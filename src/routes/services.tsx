import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MarketingLayout, PageHero } from "@/components/layout/MarketingLayout";
import { getServices } from "@/lib/public.functions";
import { ArrowRight, FileText, Link2, Users, Megaphone, PenTool, MapPin } from "lucide-react";

const iconMap = { FileText, Link2, Users, Megaphone, PenTool, MapPin } as const;

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Accessily" },
      { name: "description", content: "Guest posts, niche edits, blogger outreach, press releases and more." },
      { property: "og:title", content: "Services — Accessily" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data: services } = useQuery({ queryKey: ["services"], queryFn: () => getServices() });
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Services"
        title="Every SEO service you need, in one place"
        subtitle="From premium guest posts to local SEO bundles — built for measurable rankings."
      />
      <section className="max-w-7xl mx-auto px-6 pb-20 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map((s, i) => {
          const Icon = iconMap[s.icon as keyof typeof iconMap] ?? FileText;
          const accents = ["bg-primary/10 text-primary", "bg-cyan-brand/10 text-cyan-brand", "bg-accent/20 text-secondary"];
          return (
            <Link
              to="/services/$slug"
              params={{ slug: s.slug }}
              key={s.id}
              className="group bg-card p-8 rounded-2xl border border-border hover:border-primary/30 hover:-translate-y-1 transition shadow-card hover:shadow-glow"
            >
              <div className={`size-12 rounded-xl ${accents[i % 3]} flex items-center justify-center mb-5`}>
                <Icon size={22} />
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{s.category}</div>
              <h3 className="font-display text-xl font-bold mb-3">{s.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{s.short_description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm">From <span className="font-bold">${s.starting_price}</span></span>
                <span className="text-primary font-bold flex items-center gap-1 text-sm group-hover:gap-2 transition-all">
                  View <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          );
        })}
      </section>
    </MarketingLayout>
  );
}
