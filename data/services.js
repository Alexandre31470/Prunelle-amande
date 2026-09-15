/* ==========================================================================
   Données des prestations — Prunelle & Amande
   --------------------------------------------------------------------------
   Ce fichier est la SOURCE UNIQUE des prestations affichées :
   - dans la section "Prestations & tarifs" du site
   - dans le bon de commande de la section "Réservation"
   - dans la page d'administration (admin.html)

   Pour ajouter / modifier / supprimer une prestation, le plus simple est
   d'utiliser admin.html (page d'administration), qui permet d'éditer ces
   informations visuellement puis d'exporter ce fichier mis à jour.

   Vous pouvez aussi éditer ce fichier directement si vous êtes à l'aise
   avec ce format : chaque catégorie a un titre, une note facultative, et
   une liste de prestations (nom, description facultative, durée, prix en
   euros, sans le symbole €).
   ========================================================================== */

window.SERVICES_DATA = [
  {
    id: "visage",
    title: "Soins visage sur mesure",
    note: "Chaque soin débute par un diagnostic de peau afin de choisir le protocole le plus adapté à vos besoins.",
    items: [
      { name: "Soin essentiel", description: "Nettoyage, exfoliation douce, masque et hydratation", duration: "30 min", price: 35 },
      { name: "Soin personnalisé", description: "Soin complet et moment de détente", duration: "1 h", price: 65 },
      { name: "Soin expert", description: "Soin premium avec modelage prolongé", duration: "1 h 30", price: 90 }
    ]
  },
  {
    id: "massages",
    title: "Massages — modelage bien-être",
    note: "Un modelage adapté à vos envies, avec une pression et des zones travaillées selon vos attentes.",
    items: [
      { name: "Modelage bien-être", description: "", duration: "30 min", price: 35 },
      { name: "Modelage bien-être", description: "", duration: "45 min", price: 50 },
      { name: "Modelage bien-être", description: "", duration: "1 h", price: 65 }
    ]
  },
  {
    id: "manucure",
    title: "Manucure & pédicure",
    note: "",
    items: [
      { name: "Manucure express", description: "Mise en forme des ongles, cuticules, polissage", duration: "30 min", price: 20 },
      { name: "Pédicure express", description: "", duration: "30 min", price: 22 },
      { name: "Manucure complète", description: "Manucure express + gommage + modelage des mains", duration: "45 min", price: 35 },
      { name: "Beauté des pieds complète", description: "Bain, gommage et modelage des pieds", duration: "1 h", price: 42 },
      { name: "Vernis classique", description: "Sans manucure / pédicure express", duration: "20 min", price: 12 },
      { name: "Semi-permanent", description: "Sans manucure / pédicure express", duration: "30 min", price: 28 },
      { name: "Semi-permanent + option french", description: "Sans manucure / pédicure express", duration: "30 min", price: 33 },
      { name: "Dépose semi-permanent — posé ici", description: "Posé chez Prunelle & Amande", duration: "20 min", price: 10 },
      { name: "Dépose semi-permanent — posé ailleurs", description: "", duration: "30 min", price: 15 }
    ]
  },
  {
    id: "epil-femmes",
    title: "Épilations femmes",
    note: "",
    items: [
      { name: "Sourcils", description: "", duration: "", price: 11 },
      { name: "Lèvres / menton", description: "", duration: "", price: 8 },
      { name: "Visage complet", description: "", duration: "", price: 25 },
      { name: "Aisselles", description: "", duration: "", price: 13 },
      { name: "Demi-bras", description: "", duration: "", price: 16 },
      { name: "Bras complets", description: "", duration: "", price: 21 },
      { name: "Ventre / fessiers", description: "", duration: "", price: 12 },
      { name: "Maillot classique", description: "", duration: "", price: 16 },
      { name: "Maillot échancré / brésilien", description: "", duration: "", price: 22 },
      { name: "Maillot intégral + interfessier", description: "", duration: "", price: 30 },
      { name: "Demi-jambes / cuisses", description: "", duration: "", price: 21 },
      { name: "Jambes complètes", description: "", duration: "", price: 32 }
    ]
  },
  {
    id: "forfaits-femmes",
    title: "Forfaits épilations femmes",
    note: "",
    items: [
      { name: "Demi-jambes + aisselles + maillot classique", description: "", duration: "", price: 46 },
      { name: "Demi-jambes + aisselles + maillot échancré / brésilien", description: "", duration: "", price: 51 },
      { name: "Demi-jambes + aisselles + maillot intégral", description: "", duration: "", price: 59 }
    ]
  },
  {
    id: "epil-hommes",
    title: "Épilations hommes",
    note: "",
    items: [
      { name: "Sourcils", description: "", duration: "", price: 11 },
      { name: "Nez / oreilles", description: "", duration: "", price: 8 },
      { name: "Contour de barbe", description: "", duration: "", price: 15 },
      { name: "Aisselles / épaules", description: "", duration: "", price: 15 },
      { name: "Torse", description: "", duration: "", price: 25 },
      { name: "Ventre", description: "", duration: "", price: 20 },
      { name: "Torse + ventre", description: "", duration: "", price: 40 },
      { name: "Dos", description: "", duration: "", price: 30 },
      { name: "Bras complets", description: "", duration: "", price: 25 },
      { name: "Demi-jambes / cuisses", description: "", duration: "", price: 25 },
      { name: "Jambes complètes", description: "", duration: "", price: 40 }
    ]
  }
];
