import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: Awaited<ReturnType<typeof requireSupabaseAuth.server>> extends never ? never : import("@supabase/supabase-js").SupabaseClient, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (!data?.some((r) => r.role === "admin")) throw new Error("Forbidden");
}

export const adminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const [orders, posts, services] = await Promise.all([
      context.supabase.from("orders").select("id, price, status"),
      context.supabase.from("blog_posts").select("id, is_published"),
      context.supabase.from("services").select("id, is_active"),
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
  });

export const adminListOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { data } = await context.supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    return data ?? [];
  });

export const adminUpdateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["pending", "in_progress", "completed", "cancelled"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { error } = await context.supabase.from("orders").update({ status: data.status }).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const adminListPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { data } = await context.supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    return data ?? [];
  });

const postInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(150).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1).max(50000),
  category: z.string().min(1).max(50),
  tags: z.array(z.string().max(40)).max(10).default([]),
  cover_url: z.string().max(500).optional().or(z.literal("")),
  is_published: z.boolean(),
});

export const adminSavePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => postInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const payload = {
      ...data,
      cover_url: data.cover_url || null,
      published_at: data.is_published ? new Date().toISOString() : null,
    };
    if (data.id) {
      const { error } = await context.supabase.from("blog_posts").update(payload).eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await context.supabase.from("blog_posts").insert({ ...payload, author_id: context.userId });
      if (error) throw error;
    }
    return { ok: true };
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { error } = await context.supabase.from("blog_posts").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

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

export const adminSaveService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => serviceInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    if (data.id) {
      const { error } = await context.supabase.from("services").update(data).eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await context.supabase.from("services").insert(data);
      if (error) throw error;
    }
    return { ok: true };
  });

export const adminListServices = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { data } = await context.supabase.from("services").select("*").order("sort_order");
    return data ?? [];
  });

export const adminDeleteService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { error } = await context.supabase.from("services").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const adminGetSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { data } = await context.supabase.from("site_settings").select("*");
    return data ?? [];
  });

export const adminSaveSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ key: z.string().min(1).max(100), value: z.record(z.string(), z.unknown()) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { error } = await context.supabase.from("site_settings").upsert({ key: data.key, value: data.value });
    if (error) throw error;
    return { ok: true };
  });
