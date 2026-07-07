import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

// Admin permission is enforced by RLS policies (has_role(auth.uid(), 'admin')).
// Client just calls Supabase; unauthorized users get a policy error.

async function requireUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  const uid = data.user?.id;
  if (!uid) throw new Error("Not authenticated");
  return uid;
}

export async function adminStats() {
  await requireUserId();
  const [orders, posts, services] = await Promise.all([
    supabase.from("orders").select("id, price, status"),
    supabase.from("blog_posts").select("id, is_published"),
    supabase.from("services").select("id, is_active"),
  ]);
  const o = orders.data ?? [];
  return {
    orderCount: o.length,
    revenue: o.reduce((s, r) => s + Number(r.price), 0),
    pending: o.filter((r) => r.status === "pending").length,
    postsCount: (posts.data ?? []).length,
    publishedPosts: (posts.data ?? []).filter((p) => p.is_published).length,
    activeServices: (services.data ?? []).filter((s) => s.is_active).length,
  };
}

export async function adminListOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

const orderStatusInput = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
});

export async function adminUpdateOrderStatus({ data }: { data: z.infer<typeof orderStatusInput> }) {
  const parsed = orderStatusInput.parse(data);
  const { error } = await supabase.from("orders").update({ status: parsed.status }).eq("id", parsed.id);
  if (error) throw error;
  return { ok: true };
}

export async function adminListPosts() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

const postInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(150).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1).max(50000),
  category: z.string().min(1).max(50),
  tags: z.array(z.string().max(40)).max(10).default([]),
  cover_url: z.string().max(2000).optional().or(z.literal("")),
  is_published: z.boolean(),
});

export async function adminSavePost({ data }: { data: z.infer<typeof postInput> }) {
  const parsed = postInput.parse(data);
  const userId = await requireUserId();
  const payload = {
    ...parsed,
    cover_url: parsed.cover_url || null,
    published_at: parsed.is_published ? new Date().toISOString() : null,
  };
  if (parsed.id) {
    const { error } = await supabase.from("blog_posts").update(payload).eq("id", parsed.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("blog_posts").insert({ ...payload, author_id: userId });
    if (error) throw error;
  }
  return { ok: true };
}

export async function adminDeletePost({ data }: { data: { id: string } }) {
  const parsed = z.object({ id: z.string().uuid() }).parse(data);
  const { error } = await supabase.from("blog_posts").delete().eq("id", parsed.id);
  if (error) throw error;
  return { ok: true };
}

const serviceInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  category: z.string().min(1).max(50),
  short_description: z.string().min(1).max(300),
  long_description: z.string().max(5000).optional(),
  starting_price: z.number().min(0).max(100000),
  features: z.array(z.string().max(200)).max(20).default([]),
  icon: z.string().max(50).optional(),
  is_active: z.boolean(),
  sort_order: z.number().int().min(0).max(999),
});

export async function adminSaveService({ data }: { data: z.infer<typeof serviceInput> }) {
  const parsed = serviceInput.parse(data);
  if (parsed.id) {
    const { error } = await supabase.from("services").update(parsed).eq("id", parsed.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("services").insert(parsed);
    if (error) throw error;
  }
  return { ok: true };
}

export async function adminListServices() {
  const { data, error } = await supabase.from("services").select("*").order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function adminDeleteService({ data }: { data: { id: string } }) {
  const parsed = z.object({ id: z.string().uuid() }).parse(data);
  const { error } = await supabase.from("services").delete().eq("id", parsed.id);
  if (error) throw error;
  return { ok: true };
}

export async function adminGetSettings() {
  const { data, error } = await supabase.from("site_settings").select("*");
  if (error) throw error;
  return data ?? [];
}

const settingInput = z.object({
  key: z.string().min(1).max(100),
  value: z.record(z.string(), z.any()),
});

export async function adminSaveSetting({ data }: { data: z.infer<typeof settingInput> }) {
  const parsed = settingInput.parse(data);
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: parsed.key, value: parsed.value as never });
  if (error) throw error;
  return { ok: true };
}
