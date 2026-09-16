# Site — Prunelle & Amande

Site vitrine responsive (mobile first) avec réservation de rendez-vous en ligne.

## 1. Structure des fichiers

```
index.html          → toute la structure et le contenu du site
css/style.css        → tous les styles (couleurs, mise en page, responsive, animations)
js/script.js         → menu burger, animations au scroll, bon de commande, envoi e-mail
images/logo.png      → votre vrai logo, fond transparent
images/cotton-branch.png → votre visuel de branche de coton, fond transparent
images/favicon*.png  → icônes de l'onglet du navigateur
```

Vous pouvez ouvrir `index.html` directement dans un navigateur pour voir le
site, ou l'héberger sur n'importe quel hébergement web classique (OVH,
Hostinger, o2switch, GitHub Pages, Netlify…) en copiant simplement tout le
dossier.

## 2. Contenu déjà intégré

Le site reprend vos vraies informations (extraites de vos publications
Instagram) et votre vrai logo :

- Votre logo (fond transparent) dans l'en-tête, le menu mobile et le pied de
  page, avec une légère animation flottante.
- Votre visuel de branche de coton en fond de la section d'accueil.
- Adresse : 2100C avenue de Thonon, 74200 Allinges — sur rendez-vous
  uniquement, parking gratuit, accessible en bus (ligne A arrêt Fleysets,
  ligne N arrêt Sources).
- Contact : `prunelle.amande@gmail.com` / `07 71 77 67 20`.
- Texte « À propos », signé Amandine.
- Tous les tarifs (soins visage, massages, manucure/pédicure, vernis,
  épilations femmes/hommes, forfaits) sous forme de menu dépliant.
- Un vrai **bon de commande** dans la section réservation : la cliente coche
  une ou plusieurs prestations par catégorie, un récapitulatif avec le total
  estimé se met à jour automatiquement, et l'ensemble est envoyé par e-mail
  avec ses coordonnées.
- Vos avantages (première visite -10 %, offre étudiante -10 %, parrainage
  -5 €).
- Le rappel que les prestations à domicile restent exceptionnelles.
- Lien vers votre Instagram (@prunelle_amande).
- Des animations douces à l'ouverture et au défilement (apparition des
  sections, logo flottant) pour un rendu plus vivant.

Il ne reste que quelques éléments encore à compléter vous-même dans
`index.html` :

- Le SIRET, en bas de page (cherchez « SIRET à compléter »).
- Vérifiez les tarifs et horaires si vous les avez changés depuis vos
  dernières publications.
- Un lien Facebook si vous en créez un (pas encore ajouté, faute
  d'information).

## 3. Activer l'envoi automatique des e-mails de notification

**Statut actuel : entièrement configuré.** Compte EmailJS créé, **Public
Key** (`rY3J00mlNl9YoXuYC`) et **Service ID** (`service_4ijfxp8`) renseignés
dans `js/script.js` et `js/admin.js`, et le modèle de notification
(`template_m25eyum`) créé et en place.

Le site ne peut pas envoyer d'e-mails tout seul (un site statique n'a pas de
serveur d'envoi). Il utilise le service **EmailJS**, gratuit jusqu'à 200
e-mails par mois et **2 modèles maximum**. Tant que ce n'est pas configuré,
un formulaire fonctionne quand même : il ouvre automatiquement le logiciel
de messagerie du visiteur avec la demande déjà rédigée, prête à être
envoyée.

### Un seul modèle de notification, partagé par les deux formulaires

Le forfait gratuit d'EmailJS limitant à 2 modèles, et le site ayant besoin
de 3 e-mails différents (vous prévenir d'une réservation, vous prévenir
d'une demande de bon cadeau, envoyer le bon cadeau à la bénéficiaire), les
**deux premiers ont été fusionnés en un seul modèle générique**, utilisé
aussi bien par le formulaire de réservation que par celui des bons cadeaux.
Le troisième (l'envoi du bon cadeau lui-même) reste séparé — voir
section 8.2 — puisqu'il ne s'adresse pas à vous mais à la bénéficiaire.

Modèle de notification (« Email Templates » sur EmailJS), corps du
modèle :

```
Nouvelle demande — {{request_type}}

Nom : {{from_name}}
E-mail : {{reply_to}}
Téléphone : {{phone}}

{{details}}
```

`{{request_type}}` indique le type de demande (« Réservation de rendez-vous »
ou « Bon cadeau ») et `{{details}}` contient déjà, tout formaté, le détail
propre à chaque cas (prestations et créneau souhaités pour une réservation,
montant et bénéficiaire pour un bon cadeau) — vous n'avez rien à faire de
plus dans le modèle, tout est généré automatiquement par le site.

### Si vous devez un jour recréer ce modèle ou changer de compte EmailJS

1. Créez un compte gratuit sur https://www.emailjs.com
2. Dans « Email Services », connectez votre adresse e-mail (Gmail, Outlook,
   etc.) → notez le **Service ID**.
3. Dans « Email Templates », créez un modèle avec le corps ci-dessus, puis
   notez son **Template ID**.
4. Dans « Account » → « General », copiez votre **Public Key**.
5. Ouvrez `js/script.js` et remplacez, en haut du fichier :

   ```js
   const EMAILJS_PUBLIC_KEY = "VOTRE_PUBLIC_KEY";
   const EMAILJS_SERVICE_ID = "VOTRE_SERVICE_ID";
   const OWNER_EMAIL = "contact@prunelleetamande.fr";
   const NOTIFY_TEMPLATE_ID = "VOTRE_TEMPLATE_ID";
   ```

   par vos propres identifiants, et mettez l'adresse e-mail qui doit
   recevoir les demandes. Reportez aussi `EMAILJS_PUBLIC_KEY` et
   `EMAILJS_SERVICE_ID` (mêmes valeurs) en haut de `js/admin.js`.

6. Enregistrez, réhébergez le site : c'est prêt.

## 4. Photos

Le site utilise désormais vos vraies photos : le logo, la vidéo d'ambiance
dans « À propos », et 3 photos de votre cabine de soin dans la section
« L'espace ». Si vous en avez d'autres à ajouter un jour, dites-le moi.

## 5. Champs du formulaire de réservation

Prénom, nom, e-mail, téléphone, prestations souhaitées (bon de commande à
cocher), date et heure souhaitées, adresse (uniquement si domicile
exceptionnel), et un message libre. Une case à cocher de consentement est
incluse (RGPD).

## 6. Accessibilité et performance

- Mobile-first, testé pour les petits écrans en priorité.
- Menu burger accessible au clavier (Échap pour fermer).
- Contrastes de couleurs et focus visibles.
- Respecte la préférence "réduire les animations" du visiteur.

## 7. Base de données Supabase (prestations, avantages, clientes)

Le site utilise désormais **Supabase** (base de données gratuite) pour que
vos modifications dans `admin.html` soient **immédiatement visibles par vos
clientes**, sans avoir besoin de renvoyer de fichiers à votre hébergeur.
Supabase stocke aussi les demandes de réservation reçues, comme un mini-CRM.

### 7.1 Créer votre projet Supabase (une seule fois)

1. Créez un compte gratuit sur https://supabase.com et créez un nouveau
   projet (choisissez une région proche, par exemple Europe).
2. Une fois le projet créé, allez dans **SQL Editor** (menu de gauche) →
   **New query**.
3. Ouvrez le fichier `supabase/schema.sql` fourni avec le site, copiez tout
   son contenu, collez-le dans l'éditeur, puis cliquez sur **Run**. Cela crée
   toutes les tables (catégories, prestations, avantages, réservations,
   clientes) avec les bonnes règles de confidentialité.
4. Faites de même avec `supabase/seed.sql` (**New query** à nouveau) : cela
   récupère automatiquement votre catalogue actuel de prestations et
   d'avantages dans la base, pour ne pas avoir à tout ressaisir à la main.
5. Allez dans **Project Settings** (roue crantée) → **API**. Copiez la
   **Project URL** et la clé **anon public**.
6. Ouvrez `js/supabase-config.js` dans les fichiers du site, et remplacez
   les deux valeurs `VOTRE_SUPABASE_URL` et `VOTRE_SUPABASE_ANON_KEY` par
   celles copiées à l'étape précédente.
7. Renvoyez ce fichier modifié vers votre hébergement (comme pour une mise à
   jour de photo). C'est tout : le site et l'administration utilisent
   maintenant Supabase.

### 7.2 Créer votre compte de connexion à l'administration

Contrairement à un simple code, l'accès à `admin.html` utilise maintenant un
vrai compte sécurisé :

1. Dans Supabase, allez dans **Authentication** → **Users** → **Add user**.
2. Renseignez votre e-mail et un mot de passe de votre choix, puis
   confirmez.
3. Utilisez ensuite ces identifiants pour vous connecter sur `admin.html`.

Vous pouvez créer plusieurs comptes de cette façon si une autre personne
doit avoir accès à l'administration.

### 7.3 Ce que ça change au quotidien

- **Prestations et avantages** : toute modification dans `admin.html`
  (ajout, modification, suppression) est enregistrée immédiatement dans la
  base et **visible tout de suite par vos clientes** sur le site — plus
  besoin de télécharger ni de renvoyer de fichiers.
- **Clientes & réservations** : chaque bon de commande envoyé depuis le
  site apparaît automatiquement dans l'onglet « Clientes & réservations »
  de l'administration, avec les coordonnées, les prestations souhaitées, le
  total estimé, et un statut que vous pouvez faire évoluer (nouveau →
  confirmé → terminé, ou annulé). Le bouton « → Fiche cliente » sur une
  réservation crée automatiquement une fiche dans votre répertoire de
  clientes, en dessous. Vous pouvez aussi ajouter une fiche cliente
  manuellement (sans passer par une réservation), pour garder une trace de
  vos habituées, de leurs préférences ou allergies dans les notes. Ces
  informations sont strictement privées : seule une personne connectée avec
  un compte créé à l'étape 7.2 peut les consulter.
- **E-mail** : l'envoi d'e-mail via EmailJS (voir section 3) continue de
  fonctionner en parallèle, pour être prévenue immédiatement — Supabase
  stocke la demande, EmailJS vous en informe par e-mail. Les deux sont
  indépendants : si l'un échoue, l'autre fonctionne quand même.
- Les fichiers `data/services.js` et `data/offers.js` restent dans le site
  comme **solution de secours** : si Supabase est indisponible ou pas
  encore configuré, le site affiche automatiquement ces données locales à
  la place, pour ne jamais laisser vos clientes face à un site vide.

### 7.4 Sécurité

La clé « anon public » collée dans `js/supabase-config.js` est **prévue
pour être publique** (elle est visible dans le code de n'importe quel site
utilisant Supabase) — ce n'est pas une faille. Ce qui protège réellement vos
données, ce sont les règles définies dans `supabase/schema.sql` : tout le
monde peut lire le catalogue de prestations, mais seule une personne
connectée avec un compte (étape 7.2) peut le modifier ou consulter les
réservations de vos clientes. N'utilisez jamais la clé « service_role »
(différente de la clé « anon ») dans le code du site : elle donne un accès
complet à la base et doit rester secrète.

### 7.5 Calendrier des rendez-vous

Un site ne peut pas remplir automatiquement votre agenda personnel.
L'onglet « Calendrier » de l'administration permet d'intégrer votre
**Google Agenda** en aperçu, pour vous uniquement : ouvrez Google Agenda →
paramètres de l'agenda concerné → « Intégrer l'agenda » → collez le code
fourni dans l'onglet. Si vous souhaitez un jour que ce calendrier soit
visible par vos clientes sur le site public (par exemple pour montrer vos
disponibilités), dites-le moi, c'est une section que je peux ajouter
séparément.

### 7.6 Si un formulaire du site échoue avec une erreur « 403 » alors que vous êtes connectée à l'admin

Si vous testez un formulaire public (réservation ou bon cadeau) dans le
**même navigateur** où vous êtes connectée à `admin.html`, la demande peut
être refusée par Supabase (erreur « 403 Forbidden » visible dans la console
du navigateur), alors que tout fonctionne normalement en navigation privée
ou pour vos clientes. Ce n'est pas un bug d'extension de navigateur ni un
problème de cache : c'est parce que votre session de connexion à l'admin
est partagée avec tout le site (même nom de domaine), et les règles de
sécurité Supabase (`supabase/schema.sql`) n'autorisaient au départ que les
visiteurs anonymes à créer une réservation ou une demande de bon cadeau, pas
les personnes connectées. Ce cas a été corrigé une fois pour toutes (les
règles `public_create_bookings` et `public_create_gift_cards` autorisent
désormais `anon` et `authenticated`), donc vous ne devriez plus le
rencontrer. Si vous ajoutez un jour une nouvelle table alimentée par un
formulaire public, pensez à autoriser les deux rôles de la même façon.

### 7.7 Fiches clientes : ancienneté, historique, CA et points de fidélité

Les fiches clientes (`admin.html` → onglet « Clientes & réservations ») ne
se limitent plus à un simple répertoire : chaque fiche affiche maintenant
automatiquement, sous les champs modifiables, un bloc calculé à partir de
l'historique de réservations de la cliente (rapprochées par **e-mail ou
téléphone** — dès que l'un des deux correspond, aucune saisie
supplémentaire n'est nécessaire) :

- **Cliente depuis le [date]** : date de sa toute première réservation.
- **Dernière visite le [date]**, avec un badge **« À relancer »** si elle
  n'est pas revenue depuis plus de 3 mois. Ce seuil est réglable dans
  `js/admin.js`, constante `RELANCE_THRESHOLD_MONTHS`.
- **CA réalisé** : somme des réservations passées au statut « terminé ».
- **Points de fidélité** : selon votre règle (1 € dépensé = 1 point, une
  réduction de 10 € tous les 250 points), avec un badge 🎁 dès qu'une
  réduction est disponible. Ce barème est réglable dans `js/admin.js`,
  constantes `LOYALTY_POINTS_PER_EURO`, `LOYALTY_REWARD_THRESHOLD` et
  `LOYALTY_REWARD_AMOUNT` — ces réductions ne sont pas déduites
  automatiquement, c'est à vous de les appliquer lors du paiement en
  institut, puis de garder une trace (par exemple dans les notes).
- **Historique des prestations** : repliable, liste chaque réservation
  passée (date, prestations, statut).

En plus de ces badges sur chaque fiche, **trois encarts d'alerte**
apparaissent tout en haut de la liste, avec le nom des clientes concernées,
dès qu'il y en a au moins une : une pour les réductions de fidélité à
offrir, une pour les anniversaires du mois, une pour les clientes à
relancer. Ils disparaissent automatiquement dès qu'aucune cliente n'est
concernée.

Ce bloc ne se remplit qu'à partir des réservations passées par le
**formulaire du site**. Pour une cliente dont les premiers rendez-vous ont
été notés à la main (avant l'ouverture du site, ou prise par téléphone), ce
bloc reste vide tant qu'aucune réservation n'existe pour elle en base — ce
n'est pas un bug, il n'y a simplement rien à calculer. Un bouton
**« + Ajouter une prestation passée »** sous l'historique de chaque fiche
permet de rattraper ce cas : indiquez la date, les prestations réalisées et
le montant payé, et l'entrée s'ajoute à l'historique (statut « terminé »)
exactement comme une réservation reçue depuis le site — l'ancienneté, le CA
et les points de fidélité se recalculent aussitôt. Un e-mail ou un
téléphone doit être renseigné sur la fiche au préalable, c'est ce qui
permet de relier la prestation à la bonne cliente.

Deux nouveaux champs viennent aussi compléter chaque fiche :

- **Anniversaire** (facultatif) : affiche un badge 🎂 sur la fiche pendant
  tout le mois de son anniversaire, pour penser à une attention
  personnalisée.
- **Allergies / contre-indications** : champ séparé des « Notes libres »,
  pour y noter spécifiquement les composants ou soins à éviter — les notes
  libres restent disponibles pour vos autres observations (préférences,
  habitudes…).

Comme pour les autres tables, `supabase/schema.sql` doit être réexécuté une
fois (SQL Editor → coller tout le fichier → Run) pour ajouter les colonnes
`birthday` et `allergies` à la table `clients` si votre base a été créée
avant cet ajout.

## 8. Bons cadeaux

Le site permet désormais à vos clientes d'acheter un bon cadeau depuis
l'accueil (section « Bons cadeaux », montants fixes 30&nbsp;€ / 50&nbsp;€ /
80&nbsp;€ / 120&nbsp;€). Le paiement ne se fait **pas en ligne** : la
personne envoie sa demande depuis le site, puis vous la contactez pour
encaisser le règlement avec votre terminal de paiement habituel (comme pour
tout autre paiement en institut). Une fois le paiement reçu, vous confirmez
la demande dans `admin.html` → onglet « Bons cadeaux » : un code unique est
généré et **le bon cadeau est envoyé automatiquement par e-mail** à la
personne bénéficiaire, avec le montant, le message personnalisé et une
validité d'un an.

### 8.1 Mettre à jour la base de données

La nouvelle table `gift_cards` doit être créée dans Supabase : ouvrez
**SQL Editor** → **New query**, copiez à nouveau tout le contenu de
`supabase/schema.sql` (le script ne touche pas à vos données existantes,
il ajoute seulement ce qui manque), puis cliquez sur **Run**.

### 8.2 Activer l'envoi automatique des bons cadeaux par e-mail

**Statut actuel : entièrement configuré**, dans la limite des 2 modèles du
forfait gratuit EmailJS :

| Modèle | Rôle | Template ID | Renseigné dans |
|---|---|---|---|
| Notification (partagé, voir section 3) | Vous prévient d'une nouvelle demande de bon cadeau (comme pour une réservation) | `template_m25eyum` | `js/script.js` (`NOTIFY_TEMPLATE_ID`) |
| Envoi du bon cadeau | Envoie le bon cadeau à la bénéficiaire | `template_bg23ws5` | `js/admin.js` (`GIFTCARD_DELIVERY_TEMPLATE_ID`) |

Une demande de bon cadeau vous notifie donc via le **même modèle générique**
que les réservations (section 3) — ce n'est qu'au moment où vous confirmez
le paiement dans l'admin que le **second modèle**, dédié, entre en jeu pour
envoyer le bon cadeau à la bénéficiaire :

```
Bon cadeau Prunelle & Amande

Bonjour {{recipient_name}},

{{buyer_name}} vous offre un bon cadeau d'une valeur de {{amount}}
chez Prunelle & Amande !

Code du bon : {{code}}
Valable jusqu'au : {{expires_at}}

Message : {{message}}

Pour l'utiliser, présentez ce code lors de votre prise de rendez-vous
au 07 71 77 67 20 ou par e-mail à prunelle.amande@gmail.com.
```

Si un jour vous passez à un forfait EmailJS payant (plus de 2 modèles),
vous pourrez si vous le souhaitez recréer un modèle de notification dédié
aux bons cadeaux, distinct de celui des réservations — dites-le-moi, je
sépare alors le code en conséquence.

### 8.3 Statuts d'un bon cadeau

- **En attente de paiement** : demande reçue depuis le site, à encaisser.
- **Payé — bon envoyé** : paiement confirmé, code généré, e-mail envoyé à
  la bénéficiaire.
- **Utilisé** : à faire passer manuellement une fois le bon consommé lors
  d'un rendez-vous.
- **Annulé** : demande annulée (par exemple si la personne renonce avant
  paiement).

## 9. Faire apparaître les réservations du site dans votre agenda Google (et donc sur votre iPhone)

Vous pouvez faire en sorte que chaque nouvelle réservation reçue depuis le
site crée **automatiquement un événement dans votre Google Agenda**, qui se
synchronisera ensuite tout seul sur votre iPhone comme n'importe quel autre
rendez-vous de cet agenda.

Un site statique comme celui-ci ne peut pas se connecter directement à
Google Agenda (il faudrait y stocker un mot de passe ou une clé secrète
Google en clair, ce qui n'est pas sûr). La solution consiste donc à
brancher deux services que vous configurez vous-même, sans écrire de code :
**Supabase** (qui prévient dès qu'une réservation arrive) et **Make.com**
(qui crée l'événement dans votre agenda). Make.com propose un forfait
gratuit largement suffisant (1 000 actions par mois) pour ce genre d'usage.

### 9.1 Créer le scénario Make.com

1. Créez un compte gratuit sur https://www.make.com puis créez un nouveau
   scénario (« Create a new scenario »).
2. Ajoutez comme premier module **Webhooks → Custom webhook**, cliquez sur
   « Add » pour en créer un nouveau (nom libre, par exemple « Réservation
   Prunelle & Amande »). Make.com vous donne une **URL unique** : copiez-la,
   vous en aurez besoin à l'étape 9.2. Gardez cette URL secrète (ne la
   partagez pas, ne la collez pas dans un fichier du site) : n'importe qui
   la connaissant pourrait créer de faux événements dans votre agenda.
3. Ajoutez un deuxième module **Google Calendar → Create an Event**,
   connectez votre compte Google (vous serez redirigée vers l'écran de
   connexion Google habituel), et choisissez l'agenda concerné.
4. Une fois l'étape 9.2 ci-dessous terminée et un premier test envoyé,
   Make.com aura « appris » la structure des données reçues et vous pourrez
   remplir les champs de l'événement en cliquant dessus pour insérer les
   bonnes valeurs :
   - **Titre** : combinez par exemple `first_name`, `last_name` et le
     premier élément de `items` (ex. « Camille Dupont — Soin visage »).
   - **Date/heure de début** : combinez `wanted_date` et `wanted_time`.
   - **Date/heure de fin** : Make.com ne connaît pas la durée exacte des
     prestations choisies (elle n'est pas encore transmise), donc réglez
     une **durée par défaut** (par exemple +1h après le début) — vous
     pourrez toujours ajuster l'horaire d'un événement précis directement
     dans votre agenda si besoin. Dites-le-moi si vous voulez qu'on
     transmette la durée réelle des prestations plus tard.
   - **Description** : combinez `phone`, `email`, la liste `items`,
     `address` et `message`, pour retrouver toutes les infos utiles
     directement dans l'événement.
5. Activez le scénario (interrupteur en haut à droite sur « ON »).

### 9.2 Brancher Supabase sur ce webhook

1. Dans votre projet Supabase → **Database** (menu de gauche) →
   **Webhooks** → **Create a new hook**.
2. Nom libre (par exemple « Nouvelle réservation vers agenda »), **Table** :
   `bookings`, **Events** : cochez uniquement **Insert**.
3. **Type** : « HTTP Request », **Method** : `POST`, **URL** : collez l'URL
   copiée à l'étape 9.1.2. Laissez les en-têtes par défaut (Supabase envoie
   automatiquement un JSON contenant la nouvelle réservation).
4. Enregistrez (« Create webhook »).

### 9.3 Tester

Faites une réservation test depuis le site public, puis vérifiez qu'un
nouvel événement apparaît dans Make.com (onglet « History » du scénario)
et dans votre Google Agenda — il devrait ensuite apparaître sur votre
iPhone en quelques instants, selon la fréquence de synchronisation réglée
dans l'app Calendrier de l'iPhone.

Ceci ne concerne que les réservations de prestations (table `bookings`).
Si vous voulez également le faire pour les demandes de bons cadeaux, on
pourra créer un second webhook du même type sur la table `gift_cards`.
