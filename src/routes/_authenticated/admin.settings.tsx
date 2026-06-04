import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { adminGetSettings, adminSaveSetting } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  head: () => ({ meta: [{ title: "Admin Settings — Accessily" }, { name: "robots", content: "noindex" }] }),
  component: AdminSettings,
});

function AdminSettings() {
  const list = useServerFn(adminGetSettings);
  const save = useServerFn(adminSaveSetting);
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-settings"], queryFn: () => list() });

  const m = useMutation({
    mutationFn: (d: { key: string; value: Record<string, unknown> }) => save({ data: d }),
    onSuccess: () => {
      toast.success("Settings saved");
      qc.invalidateQueries({ queryKey: ["admin-settings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const contact = (data?.find((d) => d.key === "contact")?.value ?? {}) as Record<string, string>;
  const hero = (data?.find((d) => d.key === "hero")?.value ?? {}) as Record<string, string>;

  function saveContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    m.mutate({ key: "contact", value: { email: fd.get("email"), phone: fd.get("phone"), address: fd.get("address") } });
  }
  function saveHero(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    m.mutate({ key: "hero", value: { headline: fd.get("headline"), subhead: fd.get("subhead") } });
  }

  return (
    <AppShell admin>
      <h1 className="font-display text-3xl font-bold mb-2">Site Settings</h1>
      <p className="text-muted-foreground mb-8">Manage global site configuration.</p>

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={saveContact} className="bg-card border border-border rounded-2xl p-8 shadow-card space-y-4">
          <h2 className="font-display text-lg font-bold mb-2">Contact</h2>
          <Field name="email" label="Email" defaultValue={contact.email ?? ""} />
          <Field name="phone" label="Phone" defaultValue={contact.phone ?? ""} />
          <Field name="address" label="Address" defaultValue={contact.address ?? ""} />
          <button disabled={m.isPending} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-glow disabled:opacity-60">Save</button>
        </form>
        <form onSubmit={saveHero} className="bg-card border border-border rounded-2xl p-8 shadow-card space-y-4">
          <h2 className="font-display text-lg font-bold mb-2">Hero</h2>
          <Field name="headline" label="Headline" defaultValue={hero.headline ?? ""} />
          <Field name="subhead" label="Subheadline" defaultValue={hero.subhead ?? ""} />
          <button disabled={m.isPending} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-glow disabled:opacity-60">Save</button>
        </form>
      </div>
    </AppShell>
  );
}

function Field({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold mb-1.5 block">{label}</span>
      <input name={name} defaultValue={defaultValue} maxLength={500} className="w-full rounded-xl border border-border bg-background px-4 py-2.5" />
    </label>
  );
}
