import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { adminListPosts, adminSavePost, adminDeletePost } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { Plus, X, Trash2, Edit3, Upload } from "lucide-react";

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
  const qc = useQueryClient();
  const { data: posts } = useQuery({ queryKey: ["admin-posts"], queryFn: () => adminListPosts() });
  const [editing, setEditing] = useState<PostRow | null>(null);
  const [open, setOpen] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  async function uploadCover(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("post-covers").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const { data, error: sErr } = await supabase.storage
      .from("post-covers")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    setUploading(false);
    if (sErr || !data) {
      toast.error(sErr?.message || "Could not create URL");
      return;
    }
    setCoverUrl(data.signedUrl);
    toast.success("Cover uploaded");
  }

  const saveM = useMutation({
    mutationFn: (d: {
      id?: string; slug: string; title: string; excerpt?: string; content: string;
      category: string; tags: string[]; cover_url?: string; is_published: boolean;
    }) => adminSavePost({ data: d }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
      setOpen(false);
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const delM = useMutation({
    mutationFn: (id: string) => adminDeletePost({ data: { id } }),
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
      cover_url: coverUrl,
      is_published: fd.get("is_published") === "on",
    });
  }

  function openNew() {
    setEditing(null);
    setCoverUrl("");
    setOpen(true);
  }
  function openEdit(p: PostRow) {
    setEditing(p);
    setCoverUrl(p.cover_url ?? "");
    setOpen(true);
  }

  return (
    <AppShell admin>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Posts & Case Studies</h1>
          <p className="text-muted-foreground">Manage blog content.</p>
        </div>
        <button
          onClick={openNew}
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
              <button onClick={() => openEdit(p as PostRow)} className="text-muted-foreground hover:text-primary">
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
              <div>
                <span className="text-sm font-semibold mb-1.5 block">Cover image</span>
                {coverUrl && (
                  <img src={coverUrl} alt="Cover preview" className="w-full h-40 object-cover rounded-xl border border-border mb-2" />
                )}
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-background text-sm font-semibold hover:bg-muted">
                    <Upload size={14} /> {uploading ? "Uploading…" : coverUrl ? "Replace image" : "Upload image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadCover(f);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  {coverUrl && (
                    <button type="button" onClick={() => setCoverUrl("")} className="text-xs text-muted-foreground hover:text-destructive">
                      Remove
                    </button>
                  )}
                </div>
              </div>
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
