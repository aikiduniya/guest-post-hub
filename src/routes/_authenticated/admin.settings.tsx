import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { adminGetSettings, adminSaveSetting } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  head: () => ({ meta: [{ title: "Admin Settings — Accessily" }, { name: "robots", content: "noindex" }] }),
  component: AdminSettings,
});

function AdminSettings() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-settings"], queryFn: () => adminGetSettings() });

  const m = useMutation({
    mutationFn: (d: { key: string; value: Record<string, unknown> }) => adminSaveSetting({ data: d }),
    onSuccess: (_r, vars) => {
      toast.success("Settings saved");
      qc.invalidateQueries({ queryKey: ["admin-settings"] });
      if (vars.key === "branding") qc.invalidateQueries({ queryKey: ["site-branding-logo"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const contact = (data?.find((d) => d.key === "contact")?.value ?? {}) as Record<string, string>;
  const hero = (data?.find((d) => d.key === "hero")?.value ?? {}) as Record<string, string>;
  const branding = (data?.find((d) => d.key === "branding")?.value ?? {}) as { logo_url?: string };

  const [logoUrl, setLogoUrl] = useState<string>(branding.logo_url ?? "");
  const [uploading, setUploading] = useState(false);

  // keep local state in sync once settings load
  if (data && logoUrl === "" && branding.logo_url) setLogoUrl(branding.logo_url);

  async function uploadLogo(file: File) {
    if (file.size > 2 * 1024 * 1024) return toast.error("Logo must be under 2MB");
    setUploading(true);
    const ext = file.name.split(".").pop() || "png";
    const path = `logo-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("site-assets").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) {
      setUploading(false);
      return toast.error(error.message);
    }
    const { data: pub } = supabase.storage.from("site-assets").getPublicUrl(path);
    setUploading(false);
    setLogoUrl(pub.publicUrl);
    toast.success("Logo uploaded — click Save to apply");
  }

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
  function saveBranding(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    m.mutate({ key: "branding", value: { logo_url: logoUrl || null } });
  }

  return (
    <AppShell admin>
      <h1 className="font-display text-3xl font-bold mb-2">Site Settings</h1>
      <p className="text-muted-foreground mb-8">Manage global site configuration.</p>

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={saveBranding} className="bg-card border border-border rounded-2xl p-8 shadow-card space-y-4 lg:col-span-2">
          <h2 className="font-display text-lg font-bold mb-2">Branding</h2>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="h-20 w-48 rounded-xl border border-border bg-background flex items-center justify-center p-2">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo preview" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-xs text-muted-foreground">No logo uploaded</span>
              )}
            </div>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-background text-sm font-semibold hover:bg-muted">
              <Upload size={14} /> {uploading ? "Uploading…" : logoUrl ? "Replace logo" : "Upload logo"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadLogo(f);
                  e.target.value = "";
                }}
              />
            </label>
            {logoUrl && (
              <button type="button" onClick={() => setLogoUrl("")} className="text-xs text-muted-foreground hover:text-destructive">
                Remove
              </button>
            )}
          </div>
          <button disabled={m.isPending} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-glow disabled:opacity-60">Save Branding</button>
        </form>

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
