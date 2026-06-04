import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { getMyOrders, createOrder } from "@/lib/user.functions";
import { getServices } from "@/lib/public.functions";
import { Plus, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/orders")({
  head: () => ({ meta: [{ title: "Orders — Accessily" }, { name: "robots", content: "noindex" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const fetchOrders = useServerFn(getMyOrders);
  const create = useServerFn(createOrder);
  const qc = useQueryClient();
  const { data: orders } = useQuery({ queryKey: ["my-orders"], queryFn: () => fetchOrders() });
  const { data: services } = useQuery({ queryKey: ["services"], queryFn: () => getServices() });
  const [open, setOpen] = useState(false);

  const m = useMutation({
    mutationFn: (d: Parameters<typeof create>[0]["data"]) => create({ data: d }),
    onSuccess: () => {
      toast.success("Order created");
      qc.invalidateQueries({ queryKey: ["my-orders"] });
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const service = services?.find((s) => s.id === fd.get("service_id"));
    if (!service) return toast.error("Select a service");
    m.mutate({
      service_id: service.id,
      service_name: service.name,
      target_url: String(fd.get("target_url")),
      anchor_text: String(fd.get("anchor_text") || "") || undefined,
      notes: String(fd.get("notes") || "") || undefined,
      price: Number(service.starting_price),
    });
  }

  return (
    <AppShell>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Track every campaign in one place.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-glow hover:scale-[1.02] transition flex items-center gap-2"
        >
          <Plus size={16} /> New Order
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Service</th>
              <th className="text-left px-4 py-3">Target URL</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Price</th>
              <th className="text-right px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders?.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 font-semibold">{o.service_name}</td>
                <td className="px-4 py-3 text-muted-foreground truncate max-w-[200px]">{o.target_url}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-bold uppercase">{o.status}</span>
                </td>
                <td className="px-4 py-3 text-right font-bold">${Number(o.price).toFixed(0)}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {orders?.length === 0 && (
              <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-up">
          <div className="bg-card rounded-2xl border border-border w-full max-w-lg p-8 shadow-glow">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="font-display text-xl font-bold">New Order</h2>
                <p className="text-sm text-muted-foreground">Submit a campaign in under a minute.</p>
              </div>
              <button onClick={() => setOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <label className="block">
                <span className="text-sm font-semibold mb-1.5 block">Service</span>
                <select
                  name="service_id"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3"
                >
                  <option value="">Choose a service…</option>
                  {services?.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} — from ${s.starting_price}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold mb-1.5 block">Target URL</span>
                <input
                  name="target_url"
                  type="url"
                  required
                  maxLength={500}
                  placeholder="https://yoursite.com/page"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold mb-1.5 block">Anchor text (optional)</span>
                <input name="anchor_text" maxLength={200} className="w-full rounded-xl border border-border bg-background px-4 py-3" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold mb-1.5 block">Notes (optional)</span>
                <textarea name="notes" maxLength={1000} rows={3} className="w-full rounded-xl border border-border bg-background px-4 py-3" />
              </label>
              <button
                disabled={m.isPending}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold shadow-glow disabled:opacity-60"
              >
                {m.isPending ? "Creating…" : "Create Order"}
              </button>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
