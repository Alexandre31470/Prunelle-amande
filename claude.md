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

## 3. Activer l'envoi automatique des e-mails de réservation

Le site ne peut pas envoyer d'e-mails tout seul (un site statique n'a pas de
serveur d'envoi). Il utilise le service **EmailJS**, gratuit jusqu'à 200
e-mails par mois, qui permet d'envoyer un e-mail directement depuis le
formulaire.

Tant que ce n'est pas configuré, le formulaire fonctionne quand même : il
ouvre automatiquement le logiciel de messagerie du visiteur avec la demande
déjà rédigée, prête à être envoyée.

### Étapes pour l'envoi 100% automatique

1. Créez un compte gratuit sur https://www.emailjs.com
2. Dans « Email Services », connectez votre adresse e-mail (Gmail, Outlook,
   etc.) → notez le **Service ID**.
3. Dans « Email Templates », créez un modèle avec les variables suivantes
   (vous pouvez copier-coller ce texte comme corps du modèle) :

   ```
   Nouveau bon de commande

   Nom : {{from_name}}
   Téléphone : {{phone}}
   E-mail : {{reply_to}}
   Date souhaitée : {{date}}
   Heure souhaitée : {{time}}

   Prestations sélectionnées :
   {{items}}

   Total estimé : {{total}}

   Adresse (si domicile souhaité) : {{address}}
   Message : {{message}}
   ```

   Notez le **Template ID**.
4. Dans « Account » → « General », copiez votre **Public Key**.
5. Ouvrez `js/script.js` et remplacez les 3 lignes en haut du fichier :

   ```js
   const EMAILJS_PUBLIC_KEY = "VOTRE_PUBLIC_KEY";
   const EMAILJS_SERVICE_ID = "VOTRE_SERVICE_ID";
   const EMAILJS_TEMPLATE_ID = "VOTRE_TEMPLATE_ID";
   const OWNER_EMAIL = "contact@prunelleetamande.fr";
   ```

   par vos propres identifiants, et mettez l'adresse e-mail qui doit
   recevoir les demandes.

6. Enregistrez, réhébergez le site : c'est prêt. Chaque demande de
   rendez-vous vous sera envoyée automatiquement par e-mail.

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
