import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { adminListServices, adminSaveService, adminDeleteService } from "@/lib/admin.functions";
import { Plus, X, Trash2, Edit3 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/services")({
  head: () => ({ meta: [{ title: "Admin Services — Accessily" }, { name: "robots", content: "noindex" }] }),
  component: AdminServices,
});

type SvcRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_description: string;
  long_description: string | null;
  starting_price: number;
  features: unknown;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
};

function AdminServices() {
  const list = useServerFn(adminListServices);
  const save = useServerFn(adminSaveService);
  const del = useServerFn(adminDeleteService);
  const qc = useQueryClient();
  const { data: services } = useQuery({ queryKey: ["admin-services"], queryFn: () => list() });
  const [editing, setEditing] = useState<SvcRow | null>(null);
  const [open, setOpen] = useState(false);

  const saveM = useMutation({
    mutationFn: (d: {
      id?: string; slug: string; name: string; category: string; short_description: string;
      long_description?: string; starting_price: number; features: string[]; icon?: string;
      is_active: boolean; sort_order: number;
    }) => save({ data: d }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin-services"] });
      qc.invalidateQueries({ queryKey: ["services"] });
      setOpen(false);
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const delM = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-services"] });
    },
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    saveM.mutate({
      id: editing?.id,
      slug: String(fd.get("slug")),
      name: String(fd.get("name")),
      category: String(fd.get("category")),
      short_description: String(fd.get("short_description")),
      long_description: String(fd.get("long_description") || "") || undefined,
      starting_price: Number(fd.get("starting_price")),
      features: String(fd.get("features") || "").split("\n").map((s) => s.trim()).filter(Boolean),
      icon: String(fd.get("icon") || "") || undefined,
      is_active: fd.get("is_active") === "on",
      sort_order: Number(fd.get("sort_order") || 0),
    });
  }

  return (
    <AppShell admin>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground">Manage your SEO catalog.</p>
        </div>
        <button onClick={() => { setEditing(null); setOpen(true); }} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-glow flex items-center gap-2">
          <Plus size={16} /> New Service
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-card divide-y divide-border">
        {services?.map((s) => (
          <div key={s.id} className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="font-semibold truncate">{s.name}</div>
              <div className="text-xs text-muted-foreground">/{s.slug} · {s.category} · ${s.starting_price}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${s.is_active ? "bg-cyan-brand/15 text-cyan-brand" : "bg-muted text-muted-foreground"}`}>
                {s.is_active ? "Active" : "Hidden"}
              </span>
              <button onClick={() => { setEditing(s as SvcRow); setOpen(true); }} className="text-muted-foreground hover:text-primary"><Edit3 size={16} /></button>
              <button onClick={() => confirm("Delete?") && delM.mutate(s.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border w-full max-w-2xl p-8 shadow-glow max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="font-display text-xl font-bold">{editing ? "Edit Service" : "New Service"}</h2>
              <button onClick={() => { setOpen(false); setEditing(null); }}><X size={20} /></button>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field name="name" label="Name" defaultValue={editing?.name} required maxLength={100} />
                <Field name="slug" label="Slug" defaultValue={editing?.slug} required pattern="[a-z0-9-]+" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field name="category" label="Category" defaultValue={editing?.category} required />
                <Field name="starting_price" label="Starting price" type="number" min={0} step="1" defaultValue={editing?.starting_price ?? 0} required />
                <Field name="sort_order" label="Sort" type="number" defaultValue={editing?.sort_order ?? 0} />
              </div>
              <Field name="icon" label="Icon (FileText, Link2, Users, Megaphone, PenTool, MapPin)" defaultValue={editing?.icon ?? "FileText"} />
              <TextArea name="short_description" label="Short description" defaultValue={editing?.short_description} required rows={2} maxLength={300} />
              <TextArea name="long_description" label="Long description" defaultValue={editing?.long_description ?? ""} rows={4} maxLength={5000} />
              <TextArea name="features" label="Features (one per line)" defaultValue={Array.isArray(editing?.features) ? (editing?.features as string[]).join("\n") : ""} rows={5} />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_active" defaultChecked={editing ? editing.is_active : true} className="size-4" />
                <span className="text-sm font-semibold">Active (visible on site)</span>
              </label>
              <button disabled={saveM.isPending} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold shadow-glow disabled:opacity-60">
                {saveM.isPending ? "Saving…" : "Save Service"}
              </button>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="text-sm font-semibold mb-1.5 block">{label}</span>
      <input {...rest} className="w-full rounded-xl border border-border bg-background px-4 py-2.5" />
    </label>
  );
}
function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="text-sm font-semibold mb-1.5 block">{label}</span>
      <textarea {...rest} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm" />
    </label>
  );
}
