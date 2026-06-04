import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { adminListOrders, adminUpdateOrderStatus } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  head: () => ({ meta: [{ title: "Admin Orders — Accessily" }, { name: "robots", content: "noindex" }] }),
  component: AdminOrders,
});

function AdminOrders() {
  const list = useServerFn(adminListOrders);
  const upd = useServerFn(adminUpdateOrderStatus);
  const qc = useQueryClient();
  const { data: orders } = useQuery({ queryKey: ["admin-orders"], queryFn: () => list() });

  const m = useMutation({
    mutationFn: (d: { id: string; status: "pending" | "in_progress" | "completed" | "cancelled" }) => upd({ data: d }),
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell admin>
      <h1 className="font-display text-3xl font-bold mb-2">All Orders</h1>
      <p className="text-muted-foreground mb-8">Manage every order across all users.</p>
      <div className="bg-card border border-border rounded-2xl shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Service</th>
              <th className="text-left px-4 py-3">Target</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Price</th>
              <th className="text-right px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders?.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 font-semibold">{o.service_name}</td>
                <td className="px-4 py-3 text-muted-foreground truncate max-w-[240px]">{o.target_url}</td>
                <td className="px-4 py-3">
                  <select
                    defaultValue={o.status}
                    onChange={(e) => m.mutate({ id: o.id, status: e.target.value as "pending" | "in_progress" | "completed" | "cancelled" })}
                    className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
                  >
                    {["pending", "in_progress", "completed", "cancelled"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right font-bold">${Number(o.price).toFixed(0)}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {orders?.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
