(function () {
  "use strict";

  /* =========================================================
     CONFIGURATION EMAILJS
     -----------------------------------------------------
     Pour activer l'envoi automatique des demandes de rendez-vous
     par e-mail, créez un compte gratuit sur https://www.emailjs.com
     puis remplacez les 3 valeurs ci-dessous par les vôtres.
     Tant qu'elles ne sont pas renseignées, le formulaire bascule
     automatiquement sur une solution de secours (ouverture du
     logiciel de messagerie avec le message pré-rempli).
     Voir le fichier README.md fourni avec le site pour le détail
     des étapes.
  ========================================================= */
  const EMAILJS_PUBLIC_KEY = "VOTRE_PUBLIC_KEY";
  const EMAILJS_SERVICE_ID = "VOTRE_SERVICE_ID";
  const EMAILJS_TEMPLATE_ID = "VOTRE_TEMPLATE_ID";
  const OWNER_EMAIL = "prunelle.amande@gmail.com"; // adresse qui reçoit les demandes

  const isEmailJsConfigured =
    EMAILJS_PUBLIC_KEY.indexOf("VOTRE_") === -1 &&
    EMAILJS_SERVICE_ID.indexOf("VOTRE_") === -1 &&
    EMAILJS_TEMPLATE_ID.indexOf("VOTRE_") === -1;

  if (isEmailJsConfigured && window.emailjs) {
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  /* ---------------------------------------------------------
     Rendu dynamique des prestations et avantages.
     Source des données : Supabase si configuré (voir
     js/supabase-config.js), sinon les fichiers locaux
     data/services.js et data/offers.js (secours hors-ligne).
  --------------------------------------------------------- */
  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderPrestations(categories) {
    const container = document.getElementById("price-accordion");
    if (!container) return;

    container.innerHTML = categories.map(function (cat, idx) {
      const noteHtml = cat.note
        ? '<p class="price-note">' + escapeHtml(cat.note) + "</p>"
        : "";
      const compact = cat.items.every(function (it) { return !it.duration; });
      const itemsHtml = cat.items
        .map(function (item) {
          const descHtml = item.description
            ? " <em>— " + escapeHtml(item.description) + "</em>"
            : "";
          const metaHtml = item.duration
            ? '<span class="price-meta">' + escapeHtml(item.duration) + "</span>"
            : "";
          return (
            '<li><span class="price-name">' +
            escapeHtml(item.name) +
            descHtml +
            "</span>" +
            metaHtml +
            '<span class="price-amount">' +
            item.price +
            "&nbsp;€</span></li>"
          );
        })
        .join("");
      return (
        '<details class="price-group reveal' +
        (idx === 0 ? " is-visible" : "") +
        '"' +
        (idx === 0 ? " open" : "") +
        "><summary>" +
        escapeHtml(cat.title) +
        '</summary><div class="price-group-body">' +
        noteHtml +
        '<ul class="price-list' +
        (compact ? " price-list-compact" : "") +
        '">' +
        itemsHtml +
        "</ul></div></details>"
      );
    }).join("");
  }

  function renderOffers(offers) {
    const container = document.getElementById("offers-list");
    if (!container) return;

    const icon =
      '<svg viewBox="0 0 48 48"><path d="M14 24l6 6 14-14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="24" r="19" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';

    container.innerHTML = offers.map(function (offer) {
      return (
        '<article class="advantage-card reveal">' +
        '<div class="advantage-icon" aria-hidden="true">' +
        icon +
        "</div><h3>" +
        escapeHtml(offer.title) +
        '</h3><p class="advantage-figure">' +
        escapeHtml(offer.figure) +
        "</p><p>" +
        escapeHtml(offer.description) +
        "</p></article>"
      );
    }).join("");
  }

  function renderOrderForm(categories) {
    const container = document.getElementById("order-form");
    if (!container) return;

    const groups = categories.map(function (cat, idx) {
      const itemsHtml = cat.items
        .map(function (item) {
          const label =
            cat.title +
            " — " +
            item.name +
            (item.duration ? " (" + item.duration + ")" : "") +
            " — " +
            item.price +
            " €";
          const metaHtml = item.duration
            ? " <em>" + escapeHtml(item.duration) + "</em>"
            : "";
          return (
            '<label class="order-item"><input type="checkbox" name="items" data-price="' +
            item.price +
            '" value="' +
            escapeHtml(label) +
            '"><span class="order-item-name">' +
            escapeHtml(item.name) +
            metaHtml +
            '</span><span class="order-item-price">' +
            item.price +
            "&nbsp;€</span></label>"
          );
        })
        .join("");
      return (
        '<details class="order-group"' +
        (idx === 0 ? " open" : "") +
        "><summary>" +
        escapeHtml(cat.title) +
        '</summary><div class="order-group-body">' +
        itemsHtml +
        "</div></details>"
      );
    }).join("");

    const otherHtml =
      '<label class="order-item order-item-other">' +
      '<input type="checkbox" name="items" data-price="0" value="Autre / je ne sais pas encore">' +
      '<span class="order-item-name">Autre / je ne sais pas encore</span>' +
      '<span class="order-item-price">—</span></label>';

    container.innerHTML = groups + otherHtml;
  }

  /* ---------------------------------------------------------
     Normalise les catégories venant de Supabase (services liés
     par category_id, à trier) pour qu'elles aient la même forme
     que le fichier local data/services.js ({ title, note, items }).
  --------------------------------------------------------- */
  function normalizeSupabaseCategories(rows) {
    return rows
      .slice()
      .sort(function (a, b) { return (a.sort_order || 0) - (b.sort_order || 0); })
      .map(function (cat) {
        const items = (cat.services || [])
          .slice()
          .sort(function (a, b) { return (a.sort_order || 0) - (b.sort_order || 0); })
          .map(function (s) {
            return { name: s.name, description: s.description, duration: s.duration, price: s.price };
          });
        return { id: cat.id, title: cat.title, note: cat.note, items: items };
      });
  }

  function normalizeSupabaseOffers(rows) {
    return rows
      .slice()
      .sort(function (a, b) { return (a.sort_order || 0) - (b.sort_order || 0); })
      .map(function (o) {
        return { title: o.title, figure: o.figure, description: o.description };
      });
  }

  async function loadCatalog() {
    if (window.supabaseClient) {
      try {
        const [{ data: cats, error: catErr }, { data: offs, error: offErr }] = await Promise.all([
          window.supabaseClient
            .from("categories")
            .select("*, services(*)")
            .order("sort_order"),
          window.supabaseClient
            .from("offers")
            .select("*")
            .order("sort_order"),
        ]);
        if (catErr || offErr) throw catErr || offErr;
        if (cats && cats.length) {
          return {
            categories: normalizeSupabaseCategories(cats),
            offers: offs && offs.length ? normalizeSupabaseOffers(offs) : (window.OFFERS_DATA || []),
          };
        }
      } catch (err) {
        console.warn("Supabase indisponible, utilisation des données locales.", err);
      }
    }
    return {
      categories: window.SERVICES_DATA || [],
      offers: window.OFFERS_DATA || [],
    };
  }

  /* ---------------------------------------------------------
     Démarrage : on charge le catalogue (Supabase ou fichiers
     locaux), on l'affiche, puis on câble le bon de commande et
     on relance l'observateur de révélation pour les nouveaux
     éléments injectés.
  --------------------------------------------------------- */
  loadCatalog().then(function (catalog) {
    renderPrestations(catalog.categories);
    renderOffers(catalog.offers);
    renderOrderForm(catalog.categories);
    initOrderForm();
    initRevealObserver();
  });

  /* ---------------------------------------------------------
     Révélation douce des sections au scroll
     (ré-exécutable : on la relance après le rendu du catalogue
     pour observer aussi les cartes ajoutées dynamiquement)
  --------------------------------------------------------- */
  function initRevealObserver() {
    var revealEls = document.querySelectorAll(".reveal:not(.is-visible)");
    if (revealEls.length && "IntersectionObserver" in window) {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  }
  initRevealObserver();

  /* ---------------------------------------------------------
     Année courante dans le footer
  --------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Menu burger (mobile)
  --------------------------------------------------------- */
  const burgerBtn = document.getElementById("burger-btn");
  const mainNav = document.getElementById("main-nav");
  const navBackdrop = document.getElementById("nav-backdrop");

  function openNav() {
    mainNav.classList.add("is-open");
    navBackdrop.classList.add("is-visible");
    burgerBtn.setAttribute("aria-expanded", "true");
    burgerBtn.setAttribute("aria-label", "Fermer le menu");
    document.body.style.overflow = "hidden";
  }
  function closeNav() {
    mainNav.classList.remove("is-open");
    navBackdrop.classList.remove("is-visible");
    burgerBtn.setAttribute("aria-expanded", "false");
    burgerBtn.setAttribute("aria-label", "Ouvrir le menu");
    document.body.style.overflow = "";
  }
  if (burgerBtn && mainNav) {
    burgerBtn.addEventListener("click", function () {
      const isOpen = mainNav.classList.contains("is-open");
      isOpen ? closeNav() : openNav();
    });
    navBackdrop.addEventListener("click", closeNav);
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------------------------------------------------------
     Empêcher la sélection d'une date de rendez-vous passée
  --------------------------------------------------------- */
  const dateInput = document.getElementById("date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);
  }

  /* ---------------------------------------------------------
     Bon de commande — sélection des prestations + total live
     (les cases à cocher sont injectées après le chargement du
     catalogue, donc ce câblage est fait par initOrderForm(),
     appelée une fois le rendu terminé)
  --------------------------------------------------------- */
  const orderForm = document.getElementById("order-form");
  let orderCheckboxes = [];
  const orderSummaryEmpty = document.getElementById("order-summary-empty");
  const orderSummaryList = document.getElementById("order-summary-list");
  const orderTotalEl = document.getElementById("order-total");
  const orderTotalAmountEl = document.getElementById("order-total-amount");

  function getSelectedItems() {
    return Array.from(orderCheckboxes)
      .filter(function (cb) { return cb.checked; })
      .map(function (cb) {
        return { label: cb.value, price: parseFloat(cb.dataset.price) || 0 };
      });
  }

  function refreshOrderSummary() {
    const selected = getSelectedItems();

    if (!selected.length) {
      orderSummaryEmpty.hidden = false;
      orderSummaryList.hidden = true;
      orderTotalEl.hidden = true;
      orderSummaryList.innerHTML = "";
      return;
    }

    orderSummaryEmpty.hidden = true;
    orderSummaryList.hidden = false;
    orderTotalEl.hidden = false;

    orderSummaryList.innerHTML = selected
      .map(function (item) {
        return "<li>" + item.label.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</li>";
      })
      .join("");

    const total = selected.reduce(function (sum, item) { return sum + item.price; }, 0);
    orderTotalAmountEl.textContent = total.toLocaleString("fr-FR") + "\u00A0€";
  }

  function initOrderForm() {
    if (!orderForm) return;
    orderCheckboxes = orderForm.querySelectorAll('input[type="checkbox"][name="items"]');
    orderCheckboxes.forEach(function (cb) {
      cb.addEventListener("change", refreshOrderSummary);
    });
    refreshOrderSummary();
  }

  /* ---------------------------------------------------------
     Formulaire de réservation
  --------------------------------------------------------- */
  const form = document.getElementById("booking-form");
  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");

  function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = "form-status" + (type ? " " + type : "");
  }

  function buildMailtoFallback(data) {
    const subject = encodeURIComponent(
      "Bon de commande — " + data.fname + " " + data.lname
    );
    const bodyLines = [
      "Nouvelle demande de rendez-vous / bon de commande",
      "",
      "Nom : " + data.fname + " " + data.lname,
      "E-mail : " + data.email,
      "Téléphone : " + data.phone,
      "Date souhaitée : " + data.date,
      "Heure souhaitée : " + data.time,
      "",
      "Prestations sélectionnées :",
    ]
      .concat(
        data.items.length
          ? data.items.map(function (it) { return "  • " + it.label; })
          : ["  — (aucune prestation cochée)"]
      )
      .concat([
        "",
        "Total estimé : " + data.total.toLocaleString("fr-FR") + " €",
        "",
        "Adresse (si domicile souhaité) : " + (data.address || "— (rendez-vous en institut)"),
        "Message : " + (data.message || "—"),
      ]);
    const body = encodeURIComponent(bodyLines.join("\n"));
    return "mailto:" + OWNER_EMAIL + "?subject=" + subject + "&body=" + body;
  }

  async function saveBookingToSupabase(data) {
    if (!window.supabaseClient) return;
    try {
      await window.supabaseClient.from("bookings").insert({
        first_name: data.fname,
        last_name: data.lname,
        email: data.email,
        phone: data.phone,
        wanted_date: data.date || null,
        wanted_time: data.time || null,
        address: data.address,
        message: data.message,
        items: data.items,
        total: data.total,
        status: "nouveau",
      });
    } catch (err) {
      console.warn("Impossible d'enregistrer la demande dans Supabase.", err);
    }
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const items = getSelectedItems();
      const total = items.reduce(function (sum, item) { return sum + item.price; }, 0);

      const data = {
        fname: form.fname.value.trim(),
        lname: form.lname.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        date: form.date.value,
        time: form.time.value,
        address: form.address.value.trim(),
        message: form.message.value.trim(),
        items: items,
        total: total,
      };

      const itemsText = items.length
        ? items.map(function (it) { return "• " + it.label; }).join("\n")
        : "(aucune prestation cochée)";

      submitBtn.setAttribute("disabled", "true");
      setStatus("Envoi de votre demande en cours…", "");

      saveBookingToSupabase(data);

      if (isEmailJsConfigured && window.emailjs) {
        window.emailjs
          .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            to_email: OWNER_EMAIL,
            from_name: data.fname + " " + data.lname,
            reply_to: data.email,
            phone: data.phone,
            date: data.date,
            time: data.time,
            items: itemsText,
            total: total.toLocaleString("fr-FR") + " €",
            address: data.address,
            message: data.message,
          })
          .then(function () {
            setStatus(
              "Merci ! Votre bon de commande a bien été envoyé. Vous recevrez une confirmation très vite.",
              "success"
            );
            form.reset();
            refreshOrderSummary();
          })
          .catch(function () {
            setStatus(
              "L'envoi automatique a échoué. Une fenêtre de messagerie va s'ouvrir pour finaliser votre demande.",
              "error"
            );
            window.location.href = buildMailtoFallback(data);
          })
          .finally(function () {
            submitBtn.removeAttribute("disabled");
          });
      } else {
        // Solution de secours tant qu'EmailJS n'est pas configuré
        setStatus(
          "Votre messagerie va s'ouvrir pour envoyer votre bon de commande — pensez à cliquer sur \"Envoyer\".",
          "success"
        );
        window.location.href = buildMailtoFallback(data);
        submitBtn.removeAttribute("disabled");
      }
    });
  }
})();
