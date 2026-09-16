(function () {
  "use strict";

  const setupScreen = document.getElementById("setup-screen");
  const lockScreen = document.getElementById("lock-screen");
  const lockForm = document.getElementById("lock-form");
  const lockEmail = document.getElementById("lock-email");
  const lockPasscode = document.getElementById("lock-passcode");
  const lockError = document.getElementById("lock-error");
  const adminShell = document.getElementById("admin-shell");
  const logoutBtn = document.getElementById("logout-btn");

  if (!window.isSupabaseConfigured || !window.supabaseClient) {
    setupScreen.hidden = false;
    return;
  }

  const sb = window.supabaseClient;

  /* =========================================================
     CONFIGURATION EMAILJS (envoi du bon cadeau à la bénéficiaire)
     -----------------------------------------------------
     Mêmes Public Key / Service ID que dans js/script.js (même compte
     EmailJS). Le Template ID est différent : créez un second modèle
     dédié à l'envoi du bon cadeau (voir CLAUDE.md section 8).
  ========================================================= */
  const EMAILJS_PUBLIC_KEY = "rY3J00mlNl9YoXuYC";
  const EMAILJS_SERVICE_ID = "service_4ijfxp8";
  const GIFTCARD_DELIVERY_TEMPLATE_ID = "template_bg23ws5";

  const isGiftcardEmailConfigured =
    EMAILJS_PUBLIC_KEY.indexOf("VOTRE_") === -1 &&
    EMAILJS_SERVICE_ID.indexOf("VOTRE_") === -1 &&
    GIFTCARD_DELIVERY_TEMPLATE_ID.indexOf("VOTRE_") === -1;

  if (isGiftcardEmailConfigured && window.emailjs) {
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function slugify(str) {
    return (
      String(str || "")
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "categorie-" + Date.now()
    );
  }

  const saveBanner = document.getElementById("save-banner");
  let bannerTimer = null;
  function showBanner(message, type) {
    saveBanner.textContent = message;
    saveBanner.className = "admin-banner" + (type ? " " + type : "");
    saveBanner.hidden = false;
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(function () { saveBanner.hidden = true; }, 3500);
  }
  function showError(context, err) {
    console.error(context, err);
    showBanner("Erreur : " + (err && err.message ? err.message : context), "error");
  }

  /* =========================================================
     CONNEXION
  ========================================================= */
  async function unlock() {
    lockScreen.hidden = true;
    adminShell.hidden = false;
    initAdmin();
  }

  sb.auth.getSession().then(function (res) {
    if (res.data && res.data.session) {
      unlock();
    } else {
      lockScreen.hidden = false;
    }
  });

  if (lockForm) {
    lockForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      lockError.hidden = true;
      const { error } = await sb.auth.signInWithPassword({
        email: lockEmail.value.trim(),
        password: lockPasscode.value,
      });
      if (error) {
        lockError.textContent = "Identifiants incorrects, réessayez.";
        lockError.hidden = false;
        lockPasscode.value = "";
        lockPasscode.focus();
        return;
      }
      unlock();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async function () {
      await sb.auth.signOut();
      window.location.reload();
    });
  }

  /* =========================================================
     INTERFACE (après connexion)
  ========================================================= */
  let initialized = false;

  function initAdmin() {
    if (initialized) return;
    initialized = true;

    /* ---------- Onglets ---------- */
    const tabs = document.querySelectorAll(".admin-tab");
    const panels = document.querySelectorAll(".admin-panel");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("is-active"); });
        panels.forEach(function (p) { p.classList.remove("is-active"); });
        tab.classList.add("is-active");
        const panel = document.getElementById("panel-" + tab.dataset.tab);
        if (panel) panel.classList.add("is-active");
        if (tab.dataset.tab === "clients") { loadBookings(); loadClients(); }
        if (tab.dataset.tab === "giftcards") { loadGiftCards(); }
      });
    });

    /* =======================================================
       PRESTATIONS (categories + services)
    ======================================================= */
    const servicesEditor = document.getElementById("services-editor");
    const itemTemplate = document.getElementById("item-row-template");

    async function loadCategories() {
      servicesEditor.innerHTML = '<p class="admin-loading">Chargement…</p>';
      const { data, error } = await sb
        .from("categories")
        .select("*, services(*)")
        .order("sort_order");
      if (error) { showError("Impossible de charger les prestations.", error); return; }
      const categories = (data || [])
        .slice()
        .sort(function (a, b) { return (a.sort_order || 0) - (b.sort_order || 0); })
        .map(function (cat) {
          cat.services = (cat.services || []).slice().sort(function (a, b) {
            return (a.sort_order || 0) - (b.sort_order || 0);
          });
          return cat;
        });
      renderServicesEditor(categories);
    }

    function buildItemRow(cat, item) {
      const node = itemTemplate.content.firstElementChild.cloneNode(true);
      const nameInput = node.querySelector(".item-name");
      const durationInput = node.querySelector(".item-duration");
      const priceInput = node.querySelector(".item-price");
      const descInput = node.querySelector(".item-description");
      const deleteBtn = node.querySelector(".item-delete");

      nameInput.value = item.name || "";
      durationInput.value = item.duration || "";
      priceInput.value = item.price != null ? item.price : "";
      descInput.value = item.description || "";

      async function saveItem() {
        const { error } = await sb.from("services").update({
          name: nameInput.value.trim(),
          duration: durationInput.value.trim(),
          price: parseFloat(priceInput.value) || 0,
          description: descInput.value.trim(),
        }).eq("id", item.id);
        if (error) showError("Impossible d'enregistrer cette prestation.", error);
        else showBanner("Prestation enregistrée.", "success");
      }
      nameInput.addEventListener("blur", saveItem);
      durationInput.addEventListener("blur", saveItem);
      priceInput.addEventListener("blur", saveItem);
      descInput.addEventListener("blur", saveItem);

      deleteBtn.addEventListener("click", async function () {
        if (!confirm('Supprimer la prestation « ' + (item.name || "sans nom") + ' » ?')) return;
        const { error } = await sb.from("services").delete().eq("id", item.id);
        if (error) { showError("Impossible de supprimer cette prestation.", error); return; }
        loadCategories();
      });

      return node;
    }

    function renderServicesEditor(categories) {
      servicesEditor.innerHTML = "";
      if (!categories.length) {
        servicesEditor.innerHTML = '<p class="booking-empty">Aucune catégorie pour l\'instant — ajoutez-en une.</p>';
        return;
      }

      categories.forEach(function (cat) {
        const card = document.createElement("div");
        card.className = "category-card";

        const head = document.createElement("div");
        head.className = "category-head";

        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.className = "category-title";
        titleInput.placeholder = "Nom de la catégorie";
        titleInput.value = cat.title || "";
        titleInput.addEventListener("blur", async function () {
          const { error } = await sb.from("categories").update({ title: titleInput.value.trim() }).eq("id", cat.id);
          if (error) showError("Impossible d'enregistrer la catégorie.", error);
          else showBanner("Catégorie enregistrée.", "success");
        });

        const deleteCatBtn = document.createElement("button");
        deleteCatBtn.type = "button";
        deleteCatBtn.className = "category-delete";
        deleteCatBtn.setAttribute("aria-label", "Supprimer cette catégorie");
        deleteCatBtn.textContent = "✕";
        deleteCatBtn.addEventListener("click", async function () {
          if (!confirm('Supprimer la catégorie « ' + (cat.title || "sans nom") + ' » et toutes ses prestations ?')) return;
          const { error } = await sb.from("categories").delete().eq("id", cat.id);
          if (error) { showError("Impossible de supprimer cette catégorie.", error); return; }
          loadCategories();
        });

        head.appendChild(titleInput);
        head.appendChild(deleteCatBtn);
        card.appendChild(head);

        const noteInput = document.createElement("textarea");
        noteInput.className = "category-note";
        noteInput.rows = 2;
        noteInput.placeholder = "Note affichée au-dessus des prestations (optionnel)";
        noteInput.value = cat.note || "";
        noteInput.addEventListener("blur", async function () {
          const { error } = await sb.from("categories").update({ note: noteInput.value.trim() }).eq("id", cat.id);
          if (error) showError("Impossible d'enregistrer la note.", error);
        });
        card.appendChild(noteInput);

        const itemsWrap = document.createElement("div");
        itemsWrap.className = "items-wrap";
        (cat.services || []).forEach(function (item) {
          itemsWrap.appendChild(buildItemRow(cat, item));
        });
        card.appendChild(itemsWrap);

        const addItemBtn = document.createElement("button");
        addItemBtn.type = "button";
        addItemBtn.className = "add-item-btn";
        addItemBtn.textContent = "+ Ajouter une prestation";
        addItemBtn.addEventListener("click", async function () {
          const { error } = await sb.from("services").insert({
            category_id: cat.id,
            name: "",
            description: "",
            duration: "",
            price: 0,
            sort_order: (cat.services || []).length,
          });
          if (error) { showError("Impossible d'ajouter une prestation.", error); return; }
          loadCategories();
        });
        card.appendChild(addItemBtn);

        servicesEditor.appendChild(card);
      });
    }

    const addCategoryBtn = document.getElementById("add-category-btn");
    if (addCategoryBtn) {
      addCategoryBtn.addEventListener("click", async function () {
        const title = "Nouvelle catégorie";
        const { data: existing } = await sb.from("categories").select("id");
        const { error } = await sb.from("categories").insert({
          slug: slugify(title),
          title: title,
          note: "",
          sort_order: existing ? existing.length : 0,
        });
        if (error) { showError("Impossible d'ajouter une catégorie.", error); return; }
        loadCategories();
      });
    }

    /* =======================================================
       AVANTAGES (offers)
    ======================================================= */
    const offersEditor = document.getElementById("offers-editor");

    async function loadOffers() {
      offersEditor.innerHTML = '<p class="admin-loading">Chargement…</p>';
      const { data, error } = await sb.from("offers").select("*").order("sort_order");
      if (error) { showError("Impossible de charger les avantages.", error); return; }
      renderOffersEditor(data || []);
    }

    function renderOffersEditor(offers) {
      offersEditor.innerHTML = "";
      if (!offers.length) {
        offersEditor.innerHTML = '<p class="booking-empty">Aucun avantage pour l\'instant — ajoutez-en un.</p>';
        return;
      }

      offers.forEach(function (offer) {
        const card = document.createElement("div");
        card.className = "offer-card";

        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.className = "offer-title";
        titleInput.placeholder = "Titre (ex. Première visite)";
        titleInput.value = offer.title || "";

        const figureInput = document.createElement("input");
        figureInput.type = "text";
        figureInput.className = "offer-figure";
        figureInput.placeholder = "Ex. -10 % ou -5 €";
        figureInput.value = offer.figure || "";

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "offer-delete";
        deleteBtn.setAttribute("aria-label", "Supprimer cet avantage");
        deleteBtn.textContent = "✕";
        deleteBtn.addEventListener("click", async function () {
          if (!confirm('Supprimer l\'avantage « ' + (offer.title || "sans nom") + ' » ?')) return;
          const { error } = await sb.from("offers").delete().eq("id", offer.id);
          if (error) { showError("Impossible de supprimer cet avantage.", error); return; }
          loadOffers();
        });

        const descInput = document.createElement("textarea");
        descInput.className = "offer-description";
        descInput.rows = 2;
        descInput.placeholder = "Description de l'avantage";
        descInput.value = offer.description || "";

        async function saveOffer() {
          const { error } = await sb.from("offers").update({
            title: titleInput.value.trim(),
            figure: figureInput.value.trim(),
            description: descInput.value.trim(),
          }).eq("id", offer.id);
          if (error) showError("Impossible d'enregistrer cet avantage.", error);
          else showBanner("Avantage enregistré.", "success");
        }
        titleInput.addEventListener("blur", saveOffer);
        figureInput.addEventListener("blur", saveOffer);
        descInput.addEventListener("blur", saveOffer);

        card.appendChild(titleInput);
        card.appendChild(figureInput);
        card.appendChild(deleteBtn);
        card.appendChild(descInput);
        offersEditor.appendChild(card);
      });
    }

    const addOfferBtn = document.getElementById("add-offer-btn");
    if (addOfferBtn) {
      addOfferBtn.addEventListener("click", async function () {
        const { data: existing } = await sb.from("offers").select("id");
        const { error } = await sb.from("offers").insert({
          title: "Nouvel avantage",
          figure: "-10 %",
          description: "",
          sort_order: existing ? existing.length : 0,
        });
        if (error) { showError("Impossible d'ajouter un avantage.", error); return; }
        loadOffers();
      });
    }

    /* =======================================================
       CLIENTES & RÉSERVATIONS (CRM)
    ======================================================= */
    const bookingsList = document.getElementById("bookings-list");
    const refreshBookingsBtn = document.getElementById("refresh-bookings-btn");
    const STATUSES = ["nouveau", "confirmé", "terminé", "annulé"];

    async function loadBookings() {
      bookingsList.innerHTML = '<p class="admin-loading">Chargement…</p>';
      const { data, error } = await sb
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) { showError("Impossible de charger les réservations.", error); return; }
      renderBookings(data || []);
    }

    function renderBookings(bookings) {
      bookingsList.innerHTML = "";
      if (!bookings.length) {
        bookingsList.innerHTML = '<p class="booking-empty">Aucune demande de réservation pour l\'instant.</p>';
        return;
      }

      bookings.forEach(function (b) {
        const card = document.createElement("div");
        card.className = "booking-card";

        const items = Array.isArray(b.items) ? b.items : [];
        const itemsHtml = items.length
          ? items.map(function (it) {
              return "<li>" + escapeHtml(it.label) + "</li>";
            }).join("")
          : "<li>—</li>";

        const dateLabel = [b.wanted_date, b.wanted_time].filter(Boolean).join(" à ");

        card.innerHTML =
          '<div class="booking-head">' +
            '<span class="booking-name">' + escapeHtml((b.first_name || "") + " " + (b.last_name || "")) + '</span>' +
            '<span class="booking-date">' + escapeHtml(dateLabel || "Date non précisée") + '</span>' +
          '</div>' +
          '<div class="booking-meta">' +
            (b.email ? '<a href="mailto:' + escapeHtml(b.email) + '">' + escapeHtml(b.email) + '</a>' : '') +
            (b.phone ? '<a href="tel:' + escapeHtml(b.phone) + '">' + escapeHtml(b.phone) + '</a>' : '') +
            (b.address ? '<span>' + escapeHtml(b.address) + '</span>' : '') +
          '</div>' +
          '<ul class="booking-items">' + itemsHtml + '</ul>' +
          '<p class="booking-total">Total estimé ' + (b.total || 0) + '&nbsp;€</p>' +
          (b.message ? '<p class="booking-message">' + escapeHtml(b.message) + '</p>' : '') +
          '<div class="booking-footer"></div>';

        const footer = card.querySelector(".booking-footer");

        const statusSelect = document.createElement("select");
        statusSelect.className = "booking-status";
        statusSelect.dataset.status = b.status || "nouveau";
        STATUSES.forEach(function (s) {
          const opt = document.createElement("option");
          opt.value = s;
          opt.textContent = s.charAt(0).toUpperCase() + s.slice(1);
          if (s === b.status) opt.selected = true;
          statusSelect.appendChild(opt);
        });
        statusSelect.addEventListener("change", async function () {
          const { error } = await sb.from("bookings").update({ status: statusSelect.value }).eq("id", b.id);
          if (error) { showError("Impossible de mettre à jour le statut.", error); return; }
          statusSelect.dataset.status = statusSelect.value;
          showBanner("Statut mis à jour.", "success");
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn btn-ghost";
        deleteBtn.textContent = "Supprimer";
        deleteBtn.addEventListener("click", async function () {
          if (!confirm("Supprimer définitivement cette demande ?")) return;
          const { error } = await sb.from("bookings").delete().eq("id", b.id);
          if (error) { showError("Impossible de supprimer cette demande.", error); return; }
          loadBookings();
        });

        const toClientBtn = document.createElement("button");
        toClientBtn.type = "button";
        toClientBtn.className = "booking-to-client-btn";
        toClientBtn.textContent = "→ Fiche cliente";
        toClientBtn.addEventListener("click", async function () {
          const { error } = await sb.from("clients").insert({
            first_name: b.first_name || "",
            last_name: b.last_name || "",
            email: b.email || "",
            phone: b.phone || "",
            notes: "Créée depuis une réservation du " + new Date(b.created_at).toLocaleDateString("fr-FR"),
          });
          if (error) { showError("Impossible de créer la fiche cliente.", error); return; }
          showBanner("Fiche cliente créée.", "success");
          loadClients();
        });

        footer.appendChild(statusSelect);
        footer.appendChild(toClientBtn);
        footer.appendChild(deleteBtn);
        bookingsList.appendChild(card);
      });
    }

    if (refreshBookingsBtn) refreshBookingsBtn.addEventListener("click", loadBookings);

    /* =======================================================
       FICHES CLIENTES (répertoire manuel)
    ======================================================= */
    const clientsEditor = document.getElementById("clients-editor");

    async function loadClients() {
      clientsEditor.innerHTML = '<p class="admin-loading">Chargement…</p>';
      const { data, error } = await sb.from("clients").select("*").order("created_at", { ascending: false });
      if (error) { showError("Impossible de charger les fiches clientes.", error); return; }
      renderClientsEditor(data || []);
    }

    function renderClientsEditor(clients) {
      clientsEditor.innerHTML = "";
      if (!clients.length) {
        clientsEditor.innerHTML = '<p class="booking-empty">Aucune fiche cliente pour l\'instant.</p>';
        return;
      }

      clients.forEach(function (client) {
        const card = document.createElement("div");
        card.className = "client-card";

        const fnameInput = document.createElement("input");
        fnameInput.type = "text";
        fnameInput.placeholder = "Prénom";
        fnameInput.value = client.first_name || "";

        const lnameInput = document.createElement("input");
        lnameInput.type = "text";
        lnameInput.placeholder = "Nom";
        lnameInput.value = client.last_name || "";

        const emailInput = document.createElement("input");
        emailInput.type = "email";
        emailInput.placeholder = "E-mail";
        emailInput.value = client.email || "";

        const phoneInput = document.createElement("input");
        phoneInput.type = "tel";
        phoneInput.placeholder = "Téléphone";
        phoneInput.value = client.phone || "";

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "client-delete";
        deleteBtn.setAttribute("aria-label", "Supprimer cette fiche");
        deleteBtn.textContent = "✕";
        deleteBtn.addEventListener("click", async function () {
          if (!confirm('Supprimer la fiche de « ' + (client.first_name || "cette cliente") + ' » ?')) return;
          const { error } = await sb.from("clients").delete().eq("id", client.id);
          if (error) { showError("Impossible de supprimer cette fiche.", error); return; }
          loadClients();
        });

        const notesInput = document.createElement("textarea");
        notesInput.className = "client-notes";
        notesInput.rows = 2;
        notesInput.placeholder = "Notes (préférences, historique, allergies…)";
        notesInput.value = client.notes || "";

        async function saveClient() {
          const { error } = await sb.from("clients").update({
            first_name: fnameInput.value.trim(),
            last_name: lnameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            notes: notesInput.value.trim(),
          }).eq("id", client.id);
          if (error) showError("Impossible d'enregistrer cette fiche.", error);
          else showBanner("Fiche cliente enregistrée.", "success");
        }
        [fnameInput, lnameInput, emailInput, phoneInput, notesInput].forEach(function (el) {
          el.addEventListener("blur", saveClient);
        });

        card.appendChild(fnameInput);
        card.appendChild(lnameInput);
        card.appendChild(emailInput);
        card.appendChild(phoneInput);
        card.appendChild(deleteBtn);
        card.appendChild(notesInput);
        clientsEditor.appendChild(card);
      });
    }

    const addClientBtn = document.getElementById("add-client-btn");
    if (addClientBtn) {
      addClientBtn.addEventListener("click", async function () {
        const { error } = await sb.from("clients").insert({
          first_name: "Nouvelle",
          last_name: "cliente",
          email: "",
          phone: "",
          notes: "",
        });
        if (error) { showError("Impossible d'ajouter une fiche cliente.", error); return; }
        loadClients();
      });
    }

    /* =======================================================
       BONS CADEAUX
    ======================================================= */
    const giftcardsList = document.getElementById("giftcards-list");
    const refreshGiftcardsBtn = document.getElementById("refresh-giftcards-btn");
    const GIFTCARD_STATUS_LABELS = {
      nouveau: "En attente de paiement",
      paye: "Payé — bon envoyé",
      utilise: "Utilisé",
      annule: "Annulé",
    };

    function generateGiftCardCode() {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let code = "PA-";
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    }

    async function loadGiftCards() {
      giftcardsList.innerHTML = '<p class="admin-loading">Chargement…</p>';
      const { data, error } = await sb
        .from("gift_cards")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) { showError("Impossible de charger les bons cadeaux.", error); return; }
      renderGiftCards(data || []);
    }

    async function confirmGiftCardPayment(gc) {
      const code = generateGiftCardCode();
      const now = new Date();
      const expires = new Date(now);
      expires.setFullYear(expires.getFullYear() + 1);

      const { error } = await sb.from("gift_cards").update({
        status: "paye",
        code: code,
        validated_at: now.toISOString(),
        expires_at: expires.toISOString(),
      }).eq("id", gc.id);
      if (error) { showError("Impossible de confirmer le paiement.", error); return; }

      if (isGiftcardEmailConfigured && window.emailjs) {
        try {
          await window.emailjs.send(EMAILJS_SERVICE_ID, GIFTCARD_DELIVERY_TEMPLATE_ID, {
            to_email: gc.recipient_email,
            recipient_name: gc.recipient_name,
            buyer_name: gc.buyer_name,
            amount: Number(gc.amount || 0).toLocaleString("fr-FR") + " €",
            code: code,
            message: gc.message || "",
            expires_at: expires.toLocaleDateString("fr-FR"),
          });
          showBanner("Paiement confirmé, le bon cadeau a été envoyé par e-mail à la bénéficiaire.", "success");
        } catch (err) {
          showError("Le paiement est confirmé (code " + code + ") mais l'e-mail n'a pas pu être envoyé. Transmettez le code manuellement.", err);
        }
      } else {
        showBanner("Paiement confirmé. Code généré : " + code + " (configurez EmailJS pour l'envoi automatique — voir CLAUDE.md).", "success");
      }
      loadGiftCards();
    }

    function renderGiftCards(giftCards) {
      giftcardsList.innerHTML = "";
      if (!giftCards.length) {
        giftcardsList.innerHTML = '<p class="booking-empty">Aucune demande de bon cadeau pour l\'instant.</p>';
        return;
      }

      giftCards.forEach(function (gc) {
        const card = document.createElement("div");
        card.className = "booking-card";

        card.innerHTML =
          '<div class="booking-head">' +
            '<span class="booking-name">' + escapeHtml(gc.recipient_name || "—") + '</span>' +
            '<span class="booking-date">' + escapeHtml(new Date(gc.created_at).toLocaleDateString("fr-FR")) + '</span>' +
          '</div>' +
          '<p class="booking-total">' + Number(gc.amount || 0).toLocaleString("fr-FR") + '&nbsp;€</p>' +
          '<div class="booking-meta">' +
            '<span>Achetée par ' + escapeHtml(gc.buyer_name || "—") + '</span>' +
            (gc.buyer_email ? '<a href="mailto:' + escapeHtml(gc.buyer_email) + '">' + escapeHtml(gc.buyer_email) + '</a>' : '') +
            (gc.buyer_phone ? '<a href="tel:' + escapeHtml(gc.buyer_phone) + '">' + escapeHtml(gc.buyer_phone) + '</a>' : '') +
          '</div>' +
          '<div class="booking-meta">' +
            '<span>À envoyer à ' + escapeHtml(gc.recipient_email || "—") + '</span>' +
          '</div>' +
          (gc.message ? '<p class="booking-message">' + escapeHtml(gc.message) + '</p>' : '') +
          (gc.code ? '<p class="booking-message"><strong>Code&nbsp;: ' + escapeHtml(gc.code) + '</strong> — valable jusqu\'au ' + (gc.expires_at ? new Date(gc.expires_at).toLocaleDateString("fr-FR") : "—") + '</p>' : '') +
          '<div class="booking-footer"></div>';

        const footer = card.querySelector(".booking-footer");

        const statusBadge = document.createElement("span");
        statusBadge.className = "booking-status";
        statusBadge.dataset.status = gc.status || "nouveau";
        statusBadge.textContent = GIFTCARD_STATUS_LABELS[gc.status] || gc.status;
        footer.appendChild(statusBadge);

        if (gc.status === "nouveau") {
          const confirmBtn = document.createElement("button");
          confirmBtn.type = "button";
          confirmBtn.className = "btn btn-primary";
          confirmBtn.textContent = "✓ Confirmer le paiement et envoyer le bon";
          confirmBtn.addEventListener("click", function () {
            if (!confirm("Confirmer que le paiement de " + Number(gc.amount || 0).toLocaleString("fr-FR") + " € a bien été reçu ? Le bon cadeau sera envoyé immédiatement par e-mail.")) return;
            confirmGiftCardPayment(gc);
          });
          footer.appendChild(confirmBtn);
        }

        if (gc.status === "paye") {
          const usedBtn = document.createElement("button");
          usedBtn.type = "button";
          usedBtn.className = "booking-to-client-btn";
          usedBtn.textContent = "Marquer comme utilisé";
          usedBtn.addEventListener("click", async function () {
            const { error } = await sb.from("gift_cards").update({ status: "utilise" }).eq("id", gc.id);
            if (error) { showError("Impossible de mettre à jour le statut.", error); return; }
            loadGiftCards();
          });
          footer.appendChild(usedBtn);
        }

        if (gc.status === "nouveau" || gc.status === "paye") {
          const cancelBtn = document.createElement("button");
          cancelBtn.type = "button";
          cancelBtn.className = "btn btn-ghost";
          cancelBtn.textContent = "Annuler";
          cancelBtn.addEventListener("click", async function () {
            if (!confirm("Annuler cette demande de bon cadeau ?")) return;
            const { error } = await sb.from("gift_cards").update({ status: "annule" }).eq("id", gc.id);
            if (error) { showError("Impossible d'annuler cette demande.", error); return; }
            loadGiftCards();
          });
          footer.appendChild(cancelBtn);
        }

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn btn-ghost";
        deleteBtn.textContent = "Supprimer";
        deleteBtn.addEventListener("click", async function () {
          if (!confirm("Supprimer définitivement cette demande de bon cadeau ?")) return;
          const { error } = await sb.from("gift_cards").delete().eq("id", gc.id);
          if (error) { showError("Impossible de supprimer cette demande.", error); return; }
          loadGiftCards();
        });
        footer.appendChild(deleteBtn);

        giftcardsList.appendChild(card);
      });
    }

    if (refreshGiftcardsBtn) refreshGiftcardsBtn.addEventListener("click", loadGiftCards);

    /* =======================================================
       CALENDRIER (aperçu local, propre à cet appareil)
    ======================================================= */
    const calendarInput = document.getElementById("calendar-embed-input");
    const saveCalendarBtn = document.getElementById("save-calendar-btn");
    const calendarStatus = document.getElementById("calendar-status");
    const calendarPreviewCard = document.getElementById("calendar-preview-card");
    const calendarIframe = document.getElementById("calendar-iframe");
    const CALENDAR_KEY = "pa_admin_calendar_embed";

    function extractCalendarSrc(raw) {
      const match = raw.match(/src=["']([^"']+)["']/i);
      if (match) return match[1];
      if (/^https?:\/\//i.test(raw.trim())) return raw.trim();
      return null;
    }

    const savedCalendar = localStorage.getItem(CALENDAR_KEY);
    if (savedCalendar && calendarInput) {
      calendarInput.value = savedCalendar;
      const src = extractCalendarSrc(savedCalendar);
      if (src) {
        calendarIframe.src = src;
        calendarPreviewCard.hidden = false;
      }
    }

    if (saveCalendarBtn) {
      saveCalendarBtn.addEventListener("click", function () {
        const raw = calendarInput.value.trim();
        const src = extractCalendarSrc(raw);
        if (!src) {
          calendarStatus.textContent = "Collez le code d'intégration complet ou un lien commençant par https://";
          calendarStatus.className = "form-status error";
          return;
        }
        localStorage.setItem(CALENDAR_KEY, raw);
        calendarIframe.src = src;
        calendarPreviewCard.hidden = false;
        calendarStatus.textContent = "Calendrier enregistré sur cet appareil.";
        calendarStatus.className = "form-status success";
      });
    }

    /* ---------- Chargement initial ---------- */
    loadCategories();
    loadOffers();
  }
})();
