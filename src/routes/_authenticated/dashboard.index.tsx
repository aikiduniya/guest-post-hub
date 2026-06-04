import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/layout/AppShell";
import { getMyOrders } from "@/lib/user.functions";
import { ShoppingBag, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard — Accessily" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

function Dashboard() {
  const fetchOrders = useServerFn(getMyOrders);
  const { data: orders } = useQuery({ queryKey: ["my-orders"], queryFn: () => fetchOrders() });

  const total = orders?.length ?? 0;
  const pending = orders?.filter((o) => o.status === "pending").length ?? 0;
  const completed = orders?.filter((o) => o.status === "completed").length ?? 0;
  const spend = orders?.reduce((s, o) => s + Number(o.price), 0) ?? 0;

  const stats = [
    { Icon: ShoppingBag, label: "Total Orders", val: total, color: "bg-primary/10 text-primary" },
    { Icon: Clock, label: "Pending", val: pending, color: "bg-accent/20 text-secondary" },
    { Icon: CheckCircle2, label: "Completed", val: completed, color: "bg-cyan-brand/10 text-cyan-brand" },
    { Icon: TrendingUp, label: "Total Spend", val: `$${spend.toFixed(0)}`, color: "bg-secondary/10 text-secondary" },
  ];

  return (
    <AppShell>
      <h1 className="font-display text-3xl font-bold mb-2">Welcome back</h1>
      <p className="text-muted-foreground mb-8">Here's a snapshot of your campaigns.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-6 shadow-card">
            <div className={`size-10 rounded-xl ${s.color} flex items-center justify-center mb-4`}>
              <s.Icon size={18} />
            </div>
            <div className="text-2xl font-display font-bold">{s.val}</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h2 className="font-display font-bold text-lg">Recent Orders</h2>
          <Link to="/dashboard/orders" className="text-sm text-primary font-bold hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-border">
          {orders?.slice(0, 6).map((o) => (
            <div key={o.id} className="px-6 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="font-semibold truncate">{o.service_name}</div>
                <div className="text-xs text-muted-foreground truncate">{o.target_url}</div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  o.status === "completed" ? "bg-cyan-brand/15 text-cyan-brand"
                    : o.status === "in_progress" ? "bg-primary/10 text-primary"
                    : "bg-accent/20 text-secondary"
                }`}>{o.status}</span>
                <span className="font-bold">${Number(o.price).toFixed(0)}</span>
              </div>
            </div>
          ))}
          {orders && orders.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              No orders yet. <Link to="/services" className="text-primary font-bold">Browse services →</Link>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
