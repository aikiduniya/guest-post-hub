import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

async function requireUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  const uid = data.user?.id;
  if (!uid) throw new Error("Not authenticated");
  return uid;
}

export async function getMyOrders() {
  await requireUserId();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

const orderInput = z.object({
  service_id: z.string().uuid(),
  service_name: z.string().min(1).max(100),
  target_url: z.string().url().max(500),
  anchor_text: z.string().max(200).optional(),
  notes: z.string().max(1000).optional(),
  price: z.number().min(0).max(100000),
});

export async function createOrder({ data }: { data: z.infer<typeof orderInput> }) {
  const parsed = orderInput.parse(data);
  const userId = await requireUserId();
  const { data: row, error } = await supabase
    .from("orders")
    .insert({ ...parsed, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return row;
}

export async function getMyProfile() {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

const profileInput = z.object({
  full_name: z.string().trim().max(100).optional(),
  company: z.string().trim().max(150).optional(),
  website: z.string().trim().max(255).optional(),
});

export async function updateMyProfile({ data }: { data: z.infer<typeof profileInput> }) {
  const parsed = profileInput.parse(data);
  const userId = await requireUserId();
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...parsed });
  if (error) throw error;
  return { ok: true };
}
