/* ==========================================================================
   Prunelle & Amande — Données initiales (seed)
   --------------------------------------------------------------------------
   À exécuter UNE SEULE FOIS, juste après supabase/schema.sql, dans le même
   éditeur SQL Supabase. Reprend votre catalogue actuel de prestations et
   d'avantages (généré depuis data/services.js et data/offers.js).
   ========================================================================== */

-- Ce bloc ne s'exécute que si la table categories est vide : vous pouvez
-- donc relancer ce fichier sans risque, il ne dupliquera jamais vos données.
do $$
begin
  if not exists (select 1 from categories limit 1) then

    insert into categories (id, slug, title, note, sort_order) values ('ec49d072-bcb8-47f4-b36d-b8861c3c2e70', 'visage', 'Soins visage sur mesure', 'Chaque soin débute par un diagnostic de peau afin de choisir le protocole le plus adapté à vos besoins.', 0);
    insert into services (category_id, name, description, duration, price, sort_order) values ('ec49d072-bcb8-47f4-b36d-b8861c3c2e70', 'Soin essentiel', 'Nettoyage, exfoliation douce, masque et hydratation', '30 min', 35, 0);
    insert into services (category_id, name, description, duration, price, sort_order) values ('ec49d072-bcb8-47f4-b36d-b8861c3c2e70', 'Soin personnalisé', 'Soin complet et moment de détente', '1 h', 65, 1);
    insert into services (category_id, name, description, duration, price, sort_order) values ('ec49d072-bcb8-47f4-b36d-b8861c3c2e70', 'Soin expert', 'Soin premium avec modelage prolongé', '1 h 30', 90, 2);

    insert into categories (id, slug, title, note, sort_order) values ('2482c530-b2b7-4203-9f25-7b3953c98b85', 'massages', 'Massages — modelage bien-être', 'Un modelage adapté à vos envies, avec une pression et des zones travaillées selon vos attentes.', 1);
    insert into services (category_id, name, description, duration, price, sort_order) values ('2482c530-b2b7-4203-9f25-7b3953c98b85', 'Modelage bien-être', '', '30 min', 35, 0);
    insert into services (category_id, name, description, duration, price, sort_order) values ('2482c530-b2b7-4203-9f25-7b3953c98b85', 'Modelage bien-être', '', '45 min', 50, 1);
    insert into services (category_id, name, description, duration, price, sort_order) values ('2482c530-b2b7-4203-9f25-7b3953c98b85', 'Modelage bien-être', '', '1 h', 65, 2);

    insert into categories (id, slug, title, note, sort_order) values ('1aa02767-19db-4641-8071-126db0f95ce2', 'manucure', 'Manucure & pédicure', '', 2);
    insert into services (category_id, name, description, duration, price, sort_order) values ('1aa02767-19db-4641-8071-126db0f95ce2', 'Manucure express', 'Mise en forme des ongles, cuticules, polissage', '30 min', 20, 0);
    insert into services (category_id, name, description, duration, price, sort_order) values ('1aa02767-19db-4641-8071-126db0f95ce2', 'Pédicure express', '', '30 min', 22, 1);
    insert into services (category_id, name, description, duration, price, sort_order) values ('1aa02767-19db-4641-8071-126db0f95ce2', 'Manucure complète', 'Manucure express + gommage + modelage des mains', '45 min', 35, 2);
    insert into services (category_id, name, description, duration, price, sort_order) values ('1aa02767-19db-4641-8071-126db0f95ce2', 'Beauté des pieds complète', 'Bain, gommage et modelage des pieds', '1 h', 42, 3);
    insert into services (category_id, name, description, duration, price, sort_order) values ('1aa02767-19db-4641-8071-126db0f95ce2', 'Vernis classique', 'Sans manucure / pédicure express', '20 min', 12, 4);
    insert into services (category_id, name, description, duration, price, sort_order) values ('1aa02767-19db-4641-8071-126db0f95ce2', 'Semi-permanent', 'Sans manucure / pédicure express', '30 min', 28, 5);
    insert into services (category_id, name, description, duration, price, sort_order) values ('1aa02767-19db-4641-8071-126db0f95ce2', 'Semi-permanent + option french', 'Sans manucure / pédicure express', '30 min', 33, 6);
    insert into services (category_id, name, description, duration, price, sort_order) values ('1aa02767-19db-4641-8071-126db0f95ce2', 'Dépose semi-permanent — posé ici', 'Posé chez Prunelle & Amande', '20 min', 10, 7);
    insert into services (category_id, name, description, duration, price, sort_order) values ('1aa02767-19db-4641-8071-126db0f95ce2', 'Dépose semi-permanent — posé ailleurs', '', '30 min', 15, 8);

    insert into categories (id, slug, title, note, sort_order) values ('e9a31756-49d0-4c18-8d98-14e89b078086', 'epil-femmes', 'Épilations femmes', '', 3);
    insert into services (category_id, name, description, duration, price, sort_order) values ('e9a31756-49d0-4c18-8d98-14e89b078086', 'Sourcils', '', '', 11, 0);
    insert into services (category_id, name, description, duration, price, sort_order) values ('e9a31756-49d0-4c18-8d98-14e89b078086', 'Lèvres / menton', '', '', 8, 1);
    insert into services (category_id, name, description, duration, price, sort_order) values ('e9a31756-49d0-4c18-8d98-14e89b078086', 'Visage complet', '', '', 25, 2);
    insert into services (category_id, name, description, duration, price, sort_order) values ('e9a31756-49d0-4c18-8d98-14e89b078086', 'Aisselles', '', '', 13, 3);
    insert into services (category_id, name, description, duration, price, sort_order) values ('e9a31756-49d0-4c18-8d98-14e89b078086', 'Demi-bras', '', '', 16, 4);
    insert into services (category_id, name, description, duration, price, sort_order) values ('e9a31756-49d0-4c18-8d98-14e89b078086', 'Bras complets', '', '', 21, 5);
    insert into services (category_id, name, description, duration, price, sort_order) values ('e9a31756-49d0-4c18-8d98-14e89b078086', 'Ventre / fessiers', '', '', 12, 6);
    insert into services (category_id, name, description, duration, price, sort_order) values ('e9a31756-49d0-4c18-8d98-14e89b078086', 'Maillot classique', '', '', 16, 7);
    insert into services (category_id, name, description, duration, price, sort_order) values ('e9a31756-49d0-4c18-8d98-14e89b078086', 'Maillot échancré / brésilien', '', '', 22, 8);
    insert into services (category_id, name, description, duration, price, sort_order) values ('e9a31756-49d0-4c18-8d98-14e89b078086', 'Maillot intégral + interfessier', '', '', 30, 9);
    insert into services (category_id, name, description, duration, price, sort_order) values ('e9a31756-49d0-4c18-8d98-14e89b078086', 'Demi-jambes / cuisses', '', '', 21, 10);
    insert into services (category_id, name, description, duration, price, sort_order) values ('e9a31756-49d0-4c18-8d98-14e89b078086', 'Jambes complètes', '', '', 32, 11);

    insert into categories (id, slug, title, note, sort_order) values ('58b44635-8114-4bc5-94ae-96cfac55b18c', 'forfaits-femmes', 'Forfaits épilations femmes', '', 4);
    insert into services (category_id, name, description, duration, price, sort_order) values ('58b44635-8114-4bc5-94ae-96cfac55b18c', 'Demi-jambes + aisselles + maillot classique', '', '', 46, 0);
    insert into services (category_id, name, description, duration, price, sort_order) values ('58b44635-8114-4bc5-94ae-96cfac55b18c', 'Demi-jambes + aisselles + maillot échancré / brésilien', '', '', 51, 1);
    insert into services (category_id, name, description, duration, price, sort_order) values ('58b44635-8114-4bc5-94ae-96cfac55b18c', 'Demi-jambes + aisselles + maillot intégral', '', '', 59, 2);

    insert into categories (id, slug, title, note, sort_order) values ('ef53bf57-555d-4a51-a9c0-4c018db82a05', 'epil-hommes', 'Épilations hommes', '', 5);
    insert into services (category_id, name, description, duration, price, sort_order) values ('ef53bf57-555d-4a51-a9c0-4c018db82a05', 'Sourcils', '', '', 11, 0);
    insert into services (category_id, name, description, duration, price, sort_order) values ('ef53bf57-555d-4a51-a9c0-4c018db82a05', 'Nez / oreilles', '', '', 8, 1);
    insert into services (category_id, name, description, duration, price, sort_order) values ('ef53bf57-555d-4a51-a9c0-4c018db82a05', 'Contour de barbe', '', '', 15, 2);
    insert into services (category_id, name, description, duration, price, sort_order) values ('ef53bf57-555d-4a51-a9c0-4c018db82a05', 'Aisselles / épaules', '', '', 15, 3);
    insert into services (category_id, name, description, duration, price, sort_order) values ('ef53bf57-555d-4a51-a9c0-4c018db82a05', 'Torse', '', '', 25, 4);
    insert into services (category_id, name, description, duration, price, sort_order) values ('ef53bf57-555d-4a51-a9c0-4c018db82a05', 'Ventre', '', '', 20, 5);
    insert into services (category_id, name, description, duration, price, sort_order) values ('ef53bf57-555d-4a51-a9c0-4c018db82a05', 'Torse + ventre', '', '', 40, 6);
    insert into services (category_id, name, description, duration, price, sort_order) values ('ef53bf57-555d-4a51-a9c0-4c018db82a05', 'Dos', '', '', 30, 7);
    insert into services (category_id, name, description, duration, price, sort_order) values ('ef53bf57-555d-4a51-a9c0-4c018db82a05', 'Bras complets', '', '', 25, 8);
    insert into services (category_id, name, description, duration, price, sort_order) values ('ef53bf57-555d-4a51-a9c0-4c018db82a05', 'Demi-jambes / cuisses', '', '', 25, 9);
    insert into services (category_id, name, description, duration, price, sort_order) values ('ef53bf57-555d-4a51-a9c0-4c018db82a05', 'Jambes complètes', '', '', 40, 10);

    -- Avantages
    insert into offers (title, figure, description, sort_order) values ('Première visite', '-10 %', 'Sur votre première prestation.', 0);
    insert into offers (title, figure, description, sort_order) values ('Offre étudiante', '-10 %', 'Sur les épilations, du lundi au vendredi hors jours fériés, sur présentation d''un justificatif étudiant.', 1);
    insert into offers (title, figure, description, sort_order) values ('Parrainage', '-5 €', 'Parrainez une amie et recevez 5 € de réduction lorsqu''elle vient pour la première fois.', 2);

  end if;
end $$;
