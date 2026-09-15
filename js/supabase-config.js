/* ==========================================================================
   Configuration Supabase — Prunelle & Amande
   --------------------------------------------------------------------------
   Remplacez les deux valeurs ci-dessous par celles de VOTRE projet Supabase
   (Dashboard Supabase → Project Settings → API) :
   - "Project URL"        → zleabyunplcrfxgpbwch
   - "anon public" key    → eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsZWFieXVucGxjcmZ4Z3Bid2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMjIxNDcsImV4cCI6MjEwNDg5ODE0N30.XU-aCcE7j4TJ7Mb0dGnPJNhPrebzrW-HGZsewy_QuLk

   Cette clé "anon" est PUBLIQUE par nature (elle est visible dans le code
   du site, comme n'importe quel code JavaScript). Ce n'est pas une faille :
   c'est le fonctionnement normal de Supabase. La vraie protection de vos
   données vient des règles de sécurité (Row Level Security) mises en place
   par supabase/schema.sql, qui autorisent la lecture du catalogue à tout le
   monde, mais réservent la lecture des demandes de réservation et des
   fiches clientes à votre seul compte connecté.

   Voir le README (section Supabase) pour la marche à suivre complète.
   ========================================================================== */

window.SUPABASE_URL = "https://zleabyunplcrfxgpbwch.supabase.co";
window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsZWFieXVucGxjcmZ4Z3Bid2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMjIxNDcsImV4cCI6MjEwNDg5ODE0N30.XU-aCcE7j4TJ7Mb0dGnPJNhPrebzrW-HGZsewy_QuLk";

window.isSupabaseConfigured =
  window.SUPABASE_URL.indexOf("VOTRE_") === -1 &&
  window.SUPABASE_ANON_KEY.indexOf("VOTRE_") === -1;

window.supabaseClient = window.isSupabaseConfigured && window.supabase
  ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY)
  : null;
