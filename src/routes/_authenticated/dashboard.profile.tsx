import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { getMyProfile, updateMyProfile } from "@/lib/user.functions";

export const Route = createFileRoute("/_authenticated/dashboard/profile")({
  head: () => ({ meta: [{ title: "Profile — Accessily" }, { name: "robots", content: "noindex" }] }),
  component: Profile,
});

function Profile() {
  const fetchProfile = useServerFn(getMyProfile);
  const save = useServerFn(updateMyProfile);
  const { data: profile } = useQuery({ queryKey: ["my-profile"], queryFn: () => fetchProfile() });
  const m = useMutation({
    mutationFn: (d: { full_name?: string; company?: string; website?: string }) => save({ data: d }),
    onSuccess: () => toast.success("Profile saved"),
    onError: (e: Error) => toast.error(e.message),
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    m.mutate({
      full_name: String(fd.get("full_name") || "").trim() || undefined,
      company: String(fd.get("company") || "").trim() || undefined,
      website: String(fd.get("website") || "").trim() || undefined,
    });
  }

  return (
    <AppShell>
      <h1 className="font-display text-3xl font-bold mb-2">Profile</h1>
      <p className="text-muted-foreground mb-8">Update your account information.</p>

      <form onSubmit={onSubmit} className="bg-card border border-border rounded-2xl p-8 shadow-card space-y-5 max-w-2xl">
        <Field name="full_name" label="Full name" defaultValue={profile?.full_name ?? ""} />
        <Field name="company" label="Company" defaultValue={profile?.company ?? ""} />
        <Field name="website" label="Website" defaultValue={profile?.website ?? ""} />
        <button
          disabled={m.isPending}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-glow disabled:opacity-60"
        >
          {m.isPending ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </AppShell>
  );
}

function Field({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold mb-1.5 block">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        maxLength={255}
        className="w-full rounded-xl border border-border bg-background px-4 py-3"
      />
    </label>
  );
}
