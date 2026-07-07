import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { adminStats } from "@/lib/admin.functions";
import { ShoppingBag, DollarSign, Clock, FileText, Package } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Admin — Accessily" }, { name: "robots", content: "noindex" }] }),
  component: AdminHome,
});

function AdminHome() {
  const { data } = useQuery({ queryKey: ["admin-stats"], queryFn: () => adminStats() });

  const cards = [
    { Icon: ShoppingBag, label: "Total Orders", val: data?.orderCount ?? 0, c: "bg-primary/10 text-primary" },
    { Icon: DollarSign, label: "Revenue", val: `$${(data?.revenue ?? 0).toFixed(0)}`, c: "bg-cyan-brand/10 text-cyan-brand" },
    { Icon: Clock, label: "Pending Orders", val: data?.pending ?? 0, c: "bg-accent/20 text-secondary" },
    { Icon: FileText, label: "Published Posts", val: `${data?.publishedPosts ?? 0} / ${data?.postsCount ?? 0}`, c: "bg-secondary/10 text-secondary" },
    { Icon: Package, label: "Active Services", val: data?.activeServices ?? 0, c: "bg-primary/10 text-primary" },
  ];

  return (
    <AppShell admin>
      <h1 className="font-display text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Platform-wide overview.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-6 shadow-card">
            <div className={`size-10 rounded-xl ${s.c} flex items-center justify-center mb-4`}>
              <s.Icon size={18} />
            </div>
            <div className="text-3xl font-display font-bold">{s.val}</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
