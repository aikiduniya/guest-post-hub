import { createServerFn } from "@tanstack/react-start";

export const getServices = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw error;
  return data;
});

export const getPosts = createServerFn({ method: "GET" })
  .inputValidator((d: { category?: string } | undefined) => d ?? {})
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("blog_posts")
      .select("id, slug, title, excerpt, cover_url, category, tags, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    if (data.category) q = q.eq("category", data.category);
    const { data: rows, error } = await q;
    if (error) throw error;
    return rows ?? [];
  });

export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("site_settings").select("*");
  const map: Record<string, unknown> = {};
  (data ?? []).forEach((r) => (map[r.key] = r.value));
  return map;
});
