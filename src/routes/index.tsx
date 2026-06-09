import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { getServices } from "@/lib/public.functions";
import {
  ArrowRight,
  FileText,
  Link2,
  Users,
  Megaphone,
  PenTool,
  MapPin,
  Check,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const iconMap = { FileText, Link2, Users, Megaphone, PenTool, MapPin } as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Accessily — All in One SEO Power" },
      {
        name: "description",
        content:
          "Rank faster with elite guest posts, niche edits, and blogger outreach. The all-in-one SEO power platform for agencies and brands.",
      },
      { property: "og:title", content: "Accessily — All in One SEO Power" },
      { property: "og:description", content: "Rank faster with elite guest posts and outreach at scale." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: () => getServices(),
  });

  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 gradient-orb bg-cyan-brand rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 gradient-orb bg-primary rounded-full"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles size={12} /> Link Building Reimagined
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-8 text-balance">
              Rank Faster with <br />
              <span className="text-primary">Elite Guest Posts</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed text-pretty">
              The all-in-one SEO power platform for agencies and brands. Secure high-authority backlinks,
              blogger outreach, and niche edits at scale.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Link
                to="/sites"
                className="bg-accent text-accent-foreground px-8 py-4 rounded-xl font-bold text-lg shadow-glow hover:scale-105 active:scale-95 transition flex items-center gap-2"
              >
                Browse Sites <ArrowRight size={18} />
              </Link>
              <div className="flex items-center gap-4 px-6 py-3.5 rounded-xl border border-border bg-card">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="size-8 rounded-full border-2 border-card"
                      style={{
                        background: `linear-gradient(135deg, oklch(0.${5 + i} 0.${1 + i} ${200 + i * 20}), oklch(0.${6 + i} 0.15 ${240 + i * 10}))`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">Trusted by 12,000+ SEOs</span>
              </div>
            </div>
          </div>

          {/* Hero dashboard mock */}
          <div className="relative animate-fade-up" style={{ animationDelay: "120ms" }}>
            <div className="relative bg-card rounded-3xl shadow-glow border border-border p-2 animate-float-soft">
              <div className="flex items-center gap-2 rounded-t-2xl bg-muted/40 px-4 py-3 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-destructive/40" />
                  <div className="size-2.5 rounded-full bg-accent/60" />
                  <div className="size-2.5 rounded-full bg-cyan-brand/60" />
                </div>
                <div className="ml-3 text-xs font-mono text-muted-foreground">app.accessily.com/dashboard</div>
              </div>
              <div className="p-6 grid grid-cols-6 gap-4">
                <div className="col-span-4 bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-2xl p-6">
                  <div className="text-xs uppercase tracking-widest opacity-70 mb-2">Monthly Traffic</div>
                  <div className="text-4xl font-display font-bold mb-3">+142%</div>
                  <svg viewBox="0 0 200 60" className="w-full">
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      points="0,50 20,46 40,40 60,35 80,30 100,28 120,20 140,18 160,12 180,8 200,4"
                      opacity="0.9"
                    />
                  </svg>
                </div>
                <div className="col-span-2 space-y-3">
                  <div className="rounded-xl border border-border p-4 bg-background">
                    <div className="text-xs text-muted-foreground">Live Orders</div>
                    <div className="text-2xl font-bold mt-1">82</div>
                  </div>
                  <div className="rounded-xl border border-border p-4 bg-background">
                    <div className="text-xs text-muted-foreground">DA Avg</div>
                    <div className="text-2xl font-bold mt-1 text-primary">61</div>
                  </div>
                </div>
                <div className="col-span-6 rounded-xl border border-border p-4">
                  <div className="flex justify-between text-xs mb-3 text-muted-foreground">
                    <span>Recent Placements</span>
                    <span className="text-cyan-brand font-bold">● Live</span>
                  </div>
                  <div className="space-y-2">
                    {["techcrunch-style placement", "marketing journal feature", "industry publisher post"].map(
                      (t, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="font-medium truncate">{t}</span>
                          <span className="px-2 py-0.5 rounded bg-accent/20 text-accent-foreground font-mono">
                            DA {72 - i * 5}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-card p-5 rounded-2xl shadow-card border border-border animate-float-soft" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-cyan-brand" />
                <div>
                  <div className="text-sm font-bold text-cyan-brand">+142% Traffic</div>
                  <div className="text-[10px] text-muted-foreground">Average client lift</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Marquee */}
      <div className="py-10 border-y border-border bg-surface overflow-hidden">
        <div className="animate-marquee whitespace-nowrap gap-16 items-center">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["TECHFLOW", "NEXUS MEDIA", "QUANTUM SEO", "PEAK PERFORMANCE", "GLOBAL REACH", "FORGE LABS", "STRATUM"].map(
              (n) => (
                <span
                  key={`${k}-${n}`}
                  className="text-2xl font-black text-secondary/20 mx-8 tracking-tight"
                >
                  {n}
                </span>
              ),
            ),
          )}
        </div>
      </div>

      {/* Services Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            Services
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-balance">
            Everything You Need to Rank
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Powerful link-building services designed for sustainable organic growth and maximum ROI.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {services?.map((s, i) => {
            const Icon = iconMap[s.icon as keyof typeof iconMap] ?? FileText;
            const accents = ["bg-primary/10 text-primary", "bg-cyan-brand/10 text-cyan-brand"];
            return (
              <Link
                to="/sites"
                key={s.id}
                className="group bg-card p-8 rounded-2xl border border-border hover:border-primary/30 hover:-translate-y-2 transition-all duration-300 shadow-card hover:shadow-glow"
              >
                <div className={`size-12 rounded-xl ${accents[i % 2]} flex items-center justify-center mb-6`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{s.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{s.short_description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    From <span className="font-bold text-foreground">${s.starting_price}</span>
                  </span>
                  <span className="text-primary font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Browse sites <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-secondary text-secondary-foreground py-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[120%] gradient-orb bg-primary rounded-full opacity-30"></div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center relative">
          {[
            ["250k+", "Links Delivered"],
            ["15k+", "Active Publishers"],
            ["98%", "Retention Rate"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="text-5xl md:text-6xl font-display font-bold text-accent mb-2">{n}</div>
              <div className="text-secondary-foreground/60 uppercase tracking-widest text-xs font-bold">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">How Accessily Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From order to indexed placement in three simple steps.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {[
            ["01", "Choose your service", "Pick from guest posts, niche edits, or any of our outreach products."],
            ["02", "Submit your details", "Tell us your target URL, anchor text, and content preferences."],
            ["03", "Track in real time", "Watch placements roll in via your live dashboard."],
          ].map(([n, t, d]) => (
            <div key={n} className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition">
              <div className="text-6xl font-display font-black text-primary/15 absolute top-4 right-6">{n}</div>
              <div className="size-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-6 font-bold animate-pulse-ring">
                {parseInt(n)}
              </div>
              <h3 className="font-display text-xl font-bold mb-3">{t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 bg-surface">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="text-6xl text-primary/30 font-display mb-6">"</div>
          <p className="text-2xl md:text-3xl font-display font-medium text-balance leading-snug mb-8">
            Accessily took our agency from chasing publishers to scaling 80+ placements a month. The dashboard
            transparency alone is worth it.
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="size-12 rounded-full bg-gradient-to-br from-primary to-cyan-brand" />
            <div className="text-left">
              <div className="font-bold">Sarah Chen</div>
              <div className="text-sm text-muted-foreground">Head of SEO, Velocity Media</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-balance">
            Ready to earn your next placement?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Browse our publisher network or get in touch — we'll help you pick the right placements.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/sites" className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold shadow-glow hover:scale-105 transition inline-flex items-center gap-2">
              Browse Sites <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="border border-border bg-card px-8 py-4 rounded-xl font-bold hover:border-primary/40 transition">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
