import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { MarketingLayout, PageHero } from "@/components/layout/MarketingLayout";
import { Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Accessily" },
      { name: "description", content: "Get in touch with the Accessily team about SEO and link building." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  company: z.string().trim().max(150).optional(),
  message: z.string().trim().min(10).max(2000),
});

function Contact() {
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      company: fd.get("company") || undefined,
      message: fd.get("message"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      setSubmitting(false);
      return;
    }
    // No backend message endpoint yet — simulate success
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Thanks! We'll get back within 24 hours.");
    e.currentTarget.reset();
    setSubmitting(false);
  }

  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Contact"
        title="Let's talk SEO"
        subtitle="Tell us about your goals. We'll reply within 24 hours."
      />
      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-10">
        <div className="space-y-6 md:col-span-1">
          {[
            { Icon: Mail, label: "Email", value: "hello@accessily.com" },
            { Icon: Phone, label: "Phone", value: "+1 (555) 010-2024" },
            { Icon: MapPin, label: "HQ", value: "Remote-first — Global" },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="flex gap-4">
              <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Icon size={20} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
                <div className="font-semibold">{value}</div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="md:col-span-2 bg-card border border-border rounded-3xl p-8 md:p-10 shadow-card space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field name="name" label="Name" required maxLength={100} />
            <Field name="email" label="Email" type="email" required maxLength={255} />
          </div>
          <Field name="company" label="Company (optional)" maxLength={150} />
          <div>
            <label className="block text-sm font-semibold mb-2">Message</label>
            <textarea
              name="message"
              required
              maxLength={2000}
              rows={6}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            disabled={submitting}
            className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold shadow-glow hover:scale-[1.02] transition disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send Message"}
          </button>
        </form>
      </section>
    </MarketingLayout>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
  maxLength,
}: { name: string; label: string; type?: string; required?: boolean; maxLength?: number }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
