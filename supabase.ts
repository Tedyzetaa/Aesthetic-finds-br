import { createClient } from "@supabase/supabase-js";

// Cliente Supabase de uso exclusivo no servidor (rotas de API e server
// components). Usa a service role key, que tem acesso total ao banco e ao
// Storage ignorando RLS — por isso NUNCA deve ser importada em componentes
// "use client" nem enviada ao navegador.

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar definidos (ver .env.example)."
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

// Bucket público onde ficam as imagens enviadas pelo painel admin
// (criado pelo script supabase/migration.sql).
export const PRODUTOS_BUCKET = "produtos-imagens";
