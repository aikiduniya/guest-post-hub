import { supabase } from "@/integrations/supabase/client";

export async function getServices() {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function getPosts(input?: { category?: string }) {
  let q = supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, cover_url, category, tags, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (input?.category) q = q.eq("category", input.category);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function getSettings() {
  const { data, error } = await supabase.from("site_settings").select("*");
  if (error) throw error;
  return data ?? [];
}
