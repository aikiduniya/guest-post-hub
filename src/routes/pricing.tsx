import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout, PageHero } from "@/components/layout/MarketingLayout";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Accessily" },
      { name: "description", content: "Transparent pricing for guest posts, niche edits, outreach and agency plans." },
      { property: "og:title", content: "Pricing — Accessily" },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: Pricing,
});

const tiers = [
  {
    name: "Starter",
    price: 99,
    desc: "Perfect for solo SEOs and small sites.",
    features: ["5 guest posts / month", "DA 20-40 placements", "Email support", "Live dashboard"],
    highlight: false,
  },
  {
    name: "Growth",
    price: 299,
    desc: "Most popular for in-house teams.",
    features: ["20 guest posts / month", "DA 30-60 placements", "Priority support", "PDF reports", "API access"],
    highlight: true,
  },
  {
    name: "Agency",
    price: 899,
    desc: "Built for agencies managing clients.",
    features: ["Unlimited orders", "DA 50-90 placements", "White-label reports", "Dedicated manager", "Bulk CSV upload"],
    highlight: false,
  },
];

function Pricing() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Pricing"
        title="Simple, transparent pricing"
        subtitle="Start small or scale to thousands of placements. No hidden fees."
      />
      <section className="max-w-7xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`relative rounded-3xl p-10 border transition hover:-translate-y-1 ${
              t.highlight
                ? "bg-primary text-primary-foreground border-primary shadow-glow"
                : "bg-card border-border shadow-card"
            }`}
          >
            {t.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <h3 className="font-display text-2xl font-bold mb-2">{t.name}</h3>
            <p className={`text-sm mb-6 ${t.highlight ? "opacity-80" : "text-muted-foreground"}`}>{t.desc}</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="font-display text-5xl font-bold">${t.price}</span>
              <span className={t.highlight ? "opacity-80" : "text-muted-foreground"}>/mo</span>
            </div>
            <Link
              to="/auth"
              className={`block text-center py-3 rounded-xl font-bold mb-8 transition ${
                t.highlight
                  ? "bg-accent text-accent-foreground hover:scale-[1.02]"
                  : "bg-primary text-primary-foreground hover:scale-[1.02]"
              }`}
            >
              Get Started
            </Link>
            <ul className="space-y-3">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check size={16} className={t.highlight ? "text-accent" : "text-primary"} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </MarketingLayout>
  );
}
