import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { adminListPosts, adminSavePost, adminDeletePost } from "@/lib/admin.functions";
import { Plus, X, Trash2, Edit3 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/posts")({
  head: () => ({ meta: [{ title: "Admin Posts — Accessily" }, { name: "robots", content: "noindex" }] }),
  component: AdminPosts,
});

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string;
  tags: string[];
  cover_url: string | null;
  is_published: boolean;
};

function AdminPosts() {
  const list = useServerFn(adminListPosts);
  const save = useServerFn(adminSavePost);
  const del = useServerFn(adminDeletePost);
  const qc = useQueryClient();
  const { data: posts } = useQuery({ queryKey: ["admin-posts"], queryFn: () => list() });
  const [editing, setEditing] = useState<PostRow | null>(null);
  const [open, setOpen] = useState(false);

  const saveM = useMutation({
    mutationFn: (d: {
      id?: string; slug: string; title: string; excerpt?: string; content: string;
      category: string; tags: string[]; cover_url?: string; is_published: boolean;
    }) => save({ data: d }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
      setOpen(false);
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const delM = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
    },
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    saveM.mutate({
      id: editing?.id,
      slug: String(fd.get("slug")),
      title: String(fd.get("title")),
      excerpt: String(fd.get("excerpt") || "") || undefined,
      content: String(fd.get("content")),
      category: String(fd.get("category")),
      tags: String(fd.get("tags") || "").split(",").map((s) => s.trim()).filter(Boolean),
      cover_url: String(fd.get("cover_url") || ""),
      is_published: fd.get("is_published") === "on",
    });
  }

  return (
    <AppShell admin>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Posts & Case Studies</h1>
          <p className="text-muted-foreground">Manage blog content.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setOpen(true); }}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-glow flex items-center gap-2"
        >
          <Plus size={16} /> New Post
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-card divide-y divide-border">
        {posts?.map((p) => (
          <div key={p.id} className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="font-semibold truncate">{p.title}</div>
              <div className="text-xs text-muted-foreground">/{p.slug} · {p.category}</div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                p.is_published ? "bg-cyan-brand/15 text-cyan-brand" : "bg-muted text-muted-foreground"
              }`}>
                {p.is_published ? "Published" : "Draft"}
              </span>
              <button onClick={() => { setEditing(p as PostRow); setOpen(true); }} className="text-muted-foreground hover:text-primary">
                <Edit3 size={16} />
              </button>
              <button onClick={() => confirm("Delete this post?") && delM.mutate(p.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {posts?.length === 0 && <div className="p-10 text-center text-muted-foreground">No posts yet.</div>}
      </div>

      {open && (
        <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border w-full max-w-2xl p-8 shadow-glow max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="font-display text-xl font-bold">{editing ? "Edit Post" : "New Post"}</h2>
              <button onClick={() => { setOpen(false); setEditing(null); }}><X size={20} /></button>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <Field name="title" label="Title" defaultValue={editing?.title} required maxLength={200} />
              <Field name="slug" label="Slug (lowercase, hyphens)" defaultValue={editing?.slug} required pattern="[a-z0-9-]+" maxLength={150} />
              <div className="grid grid-cols-2 gap-4">
                <Field name="category" label="Category" defaultValue={editing?.category ?? "blog"} required maxLength={50} />
                <Field name="tags" label="Tags (comma separated)" defaultValue={editing?.tags?.join(", ")} />
              </div>
              <Field name="cover_url" label="Cover URL (optional)" defaultValue={editing?.cover_url ?? ""} />
              <TextArea name="excerpt" label="Excerpt" defaultValue={editing?.excerpt ?? ""} rows={2} maxLength={500} />
              <TextArea name="content" label="Content (markdown / text)" defaultValue={editing?.content ?? ""} rows={8} required maxLength={50000} />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_published" defaultChecked={editing?.is_published} className="size-4" />
                <span className="text-sm font-semibold">Published</span>
              </label>
              <button disabled={saveM.isPending} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold shadow-glow disabled:opacity-60">
                {saveM.isPending ? "Saving…" : "Save Post"}
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
      <textarea {...rest} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 font-mono text-sm" />
    </label>
  );
}
