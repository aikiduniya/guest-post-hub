import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout, PageHero } from "@/components/layout/MarketingLayout";
import { Check, Users, BarChart3, Zap, FileText } from "lucide-react";

export const Route = createFileRoute("/reseller")({
  head: () => ({
    meta: [
      { title: "Reseller Program — Accessily" },
      { name: "description", content: "White-label SEO reselling with wholesale pricing for agencies." },
      { property: "og:url", content: "/reseller" },
    ],
    links: [{ rel: "canonical", href: "/reseller" }],
  }),
  component: Reseller,
});

const perks = [
  { icon: BarChart3, title: "Wholesale Pricing", desc: "Up to 40% off retail across every service." },
  { icon: FileText, title: "White-Label Reports", desc: "Branded PDF reports with your logo and colors." },
  { icon: Users, title: "Dedicated Manager", desc: "A real human assigned to your account." },
  { icon: Zap, title: "API & Bulk Upload", desc: "Submit hundreds of orders via CSV or API." },
];

function Reseller() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Reseller / Agency"
        title="Scale your SEO agency without the overhead"
        subtitle="Wholesale pricing, white-label reporting, and dedicated support for serious agencies."
      />
      <section className="max-w-7xl mx-auto px-6 pb-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {perks.map((p) => (
          <div key={p.title} className="bg-card border border-border rounded-2xl p-8 shadow-card hover:border-primary/30 transition">
            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
              <p.icon size={22} />
            </div>
            <h3 className="font-display text-lg font-bold mb-2">{p.title}</h3>
            <p className="text-sm text-muted-foreground">{p.desc}</p>
          </div>
        ))}
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="bg-secondary text-secondary-foreground rounded-3xl p-12 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 gradient-orb bg-primary opacity-30"></div>
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Ready to scale?</h2>
            <p className="text-secondary-foreground/70 mb-8 max-w-xl mx-auto">
              Apply for our reseller program and get approved within 24 hours.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto mb-8 text-left">
              {["No minimum monthly spend", "Cancel anytime", "Multi-currency billing", "24/7 priority chat"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-accent" /> {f}
                </div>
              ))}
            </div>
            <Link
              to="/contact"
              className="inline-block bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold hover:scale-105 transition"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
