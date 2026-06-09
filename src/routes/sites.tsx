import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { MarketingLayout, PageHero } from "@/components/layout/MarketingLayout";
import { Briefcase, Laptop, HeartPulse, Banknote, Home as HomeIcon, BookOpen } from "lucide-react";

export const Route = createFileRoute("/sites")({
  head: () => ({
    meta: [
      { title: "Sites — Accessily" },
      { name: "description", content: "Browse our curated network of high-authority publisher sites for guest posts." },
      { property: "og:title", content: "Sites — Accessily" },
      { property: "og:url", content: "/sites" },
    ],
    links: [{ rel: "canonical", href: "/sites" }],
  }),
  component: SitesPage,
});

type Site = {
  domain: string;
  niche: string;
  category: "Business" | "Tech" | "Health" | "Finance" | "Lifestyle";
  icon: typeof Briefcase;
  price: number;
  dr: number;
  traffic: string;
  turnaround: string;
  tags: string[];
};

const sites: Site[] = [
  { domain: "thebusinesshub.co.uk", niche: "Business & Entrepreneurship", category: "Business", icon: Briefcase, price: 45, dr: 52, traffic: "18K", turnaround: "24hr", tags: ["Dofollow", "Permanent", "UK Traffic"] },
  { domain: "techinvestor.co.uk", niche: "Technology & SaaS", category: "Tech", icon: Laptop, price: 85, dr: 67, traffic: "42K", turnaround: "48hr", tags: ["Dofollow", "Permanent", "High DR"] },
  { domain: "ukwellnessguide.co.uk", niche: "Health & Wellness", category: "Health", icon: HeartPulse, price: 55, dr: 44, traffic: "27K", turnaround: "36hr", tags: ["Dofollow", "Permanent", "Niche"] },
  { domain: "financialweekly.co.uk", niche: "Finance & Investment", category: "Finance", icon: Banknote, price: 120, dr: 74, traffic: "89K", turnaround: "72hr", tags: ["Dofollow", "Permanent", "Premium"] },
  { domain: "lifestyleuk.co.uk", niche: "Lifestyle & Home", category: "Lifestyle", icon: HomeIcon, price: 38, dr: 38, traffic: "11K", turnaround: "24hr", tags: ["Dofollow", "Permanent", "Budget"] },
  { domain: "startupjournal.co.uk", niche: "Business & Startups", category: "Business", icon: BookOpen, price: 65, dr: 58, traffic: "32K", turnaround: "48hr", tags: ["Dofollow", "Permanent", "Editorial"] },
  { domain: "devstack.co.uk", niche: "Developer & Cloud", category: "Tech", icon: Laptop, price: 95, dr: 62, traffic: "51K", turnaround: "48hr", tags: ["Dofollow", "Permanent", "Tech Audience"] },
  { domain: "fitlifedaily.co.uk", niche: "Fitness & Nutrition", category: "Health", icon: HeartPulse, price: 48, dr: 41, traffic: "22K", turnaround: "36hr", tags: ["Dofollow", "Permanent", "Niche"] },
];

const filters = ["All Niches", "Business", "Tech", "Health", "Finance", "Lifestyle", "DR 50+", "Under £60"] as const;

function SitesPage() {
  const [active, setActive] = useState<(typeof filters)[number]>("All Niches");

  const visible = useMemo(() => {
    if (active === "All Niches") return sites;
    if (active === "DR 50+") return sites.filter((s) => s.dr >= 50);
    if (active === "Under £60") return sites.filter((s) => s.price < 60);
    return sites.filter((s) => s.category === active);
  }, [active]);

  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Network"
        title="Find Your Perfect Placement"
        subtitle="Browse our hand-vetted publisher network and order placements with full transparency."
      />
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex flex-wrap gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${
                active === f
                  ? "bg-primary text-primary-foreground border-primary shadow-glow"
                  : "bg-card text-foreground/70 border-border hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visible.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.domain}
                className="bg-card border border-border rounded-2xl p-6 shadow-card hover:border-primary/30 hover:-translate-y-1 transition flex flex-col"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <div className="text-2xl font-display font-bold text-primary">£{s.price}</div>
                </div>

                <h3 className="font-bold text-lg leading-snug mb-1 break-all">{s.domain}</h3>
                <p className="text-sm text-muted-foreground mb-5">{s.niche}</p>

                <div className="grid grid-cols-3 gap-2 mb-5 py-4 border-y border-border">
                  <Stat label="Authority" value={`DR ${s.dr}`} />
                  <Stat label="Traffic" value={s.traffic} />
                  <Stat label="Turnaround" value={s.turnaround} />
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {s.tags.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-full bg-muted text-xs font-semibold text-secondary">
                      {t}
                    </span>
                  ))}
                </div>

                <Link
                  to="/contact"
                  className="mt-auto block text-center bg-primary text-primary-foreground py-2.5 rounded-xl font-bold shadow-glow hover:scale-[1.02] transition"
                >
                  Order Placement
                </Link>
              </div>
            );
          })}
        </div>

        {visible.length === 0 && (
          <p className="text-center text-muted-foreground py-16">No sites match this filter yet.</p>
        )}
      </section>
    </MarketingLayout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display font-bold text-base">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
