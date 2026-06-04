import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

const orderInput = z.object({
  service_id: z.string().uuid(),
  service_name: z.string().min(1).max(100),
  target_url: z.string().url().max(500),
  anchor_text: z.string().max(200).optional(),
  notes: z.string().max(1000).optional(),
  price: z.number().min(0).max(100000),
});

export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => orderInput.parse(d))
  .handler(async ({ data, context }) => {
    const { error, data: row } = await context.supabase
      .from("orders")
      .insert({ ...data, user_id: context.userId })
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("id", context.userId)
      .maybeSingle();
    return data;
  });

const profileInput = z.object({
  full_name: z.string().trim().max(100).optional(),
  company: z.string().trim().max(150).optional(),
  website: z.string().trim().max(255).optional(),
});

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => profileInput.parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .upsert({ id: context.userId, ...data });
    if (error) throw error;
    return { ok: true };
  });
