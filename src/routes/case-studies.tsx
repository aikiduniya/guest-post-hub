import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MarketingLayout, PageHero } from "@/components/layout/MarketingLayout";
import { getPosts } from "@/lib/public.functions";
import { TrendingUp } from "lucide-react";

export const Route = createFileRoute("/case-studies")({
  head: () => ({
    meta: [
      { title: "Case Studies — Accessily" },
      { name: "description", content: "Real results from SaaS, ecommerce and agency clients using Accessily." },
      { property: "og:url", content: "/case-studies" },
    ],
    links: [{ rel: "canonical", href: "/case-studies" }],
  }),
  component: CaseStudies,
});

function CaseStudies() {
  const { data: posts } = useQuery({
    queryKey: ["posts", "case-study"],
    queryFn: () => getPosts({ data: { category: "case-study" } }),
  });

  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Case Studies"
        title="Real results from real clients"
        subtitle="See how agencies, SaaS startups, and ecommerce brands rank with Accessily."
      />
      <section className="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-2 gap-8">
        {posts?.map((p) => (
          <article
            key={p.id}
            className="group bg-card border border-border rounded-3xl overflow-hidden shadow-card hover:shadow-glow hover:-translate-y-1 transition"
          >
            <div className="aspect-[16/9] bg-gradient-to-br from-primary via-secondary to-cyan-brand relative">
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 text-secondary text-xs font-bold">
                <TrendingUp size={12} /> Case Study
              </div>
            </div>
            <div className="p-8">
              <h3 className="font-display text-2xl font-bold mb-3 group-hover:text-primary transition">{p.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{p.excerpt}</p>
              <div className="flex gap-2 flex-wrap">
                {p.tags?.map((t) => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-muted">{t}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
        {posts?.length === 0 && (
          <p className="md:col-span-2 text-center text-muted-foreground py-12">More case studies coming soon.</p>
        )}
      </section>
    </MarketingLayout>
  );
}
