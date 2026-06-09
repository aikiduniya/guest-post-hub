import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout, PageHero } from "@/components/layout/MarketingLayout";
import { Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Accessily" },
      { name: "description", content: "Accessily is a UK-based link building team helping brands rank with quality guest posts and content." },
      { property: "og:title", content: "About Us — Accessily" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="About"
        title="We help brands earn rankings, not chase them"
        subtitle="A focused team of SEO specialists, editors, and outreach experts placing your brand on sites that actually move the needle."
      />
      <section className="max-w-5xl mx-auto px-6 pb-20 grid md:grid-cols-2 gap-12">
        <div className="space-y-5">
          <h2 className="font-display text-3xl font-bold">Our story</h2>
          <p className="text-muted-foreground leading-relaxed">
            Accessily started with a simple idea — link building should be transparent, ethical and built on real
            editorial relationships. We've spent years curating a network of high-authority UK publishers and
            building a team of writers who can craft posts that publishers actually want to run.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Today we serve agencies, startups and in-house SEO teams who care about long-term, sustainable growth.
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
          <h3 className="font-display text-xl font-bold mb-5">What we stand for</h3>
          <ul className="space-y-3">
            {[
              "Hand-vetted publisher network",
              "Native, well-researched content",
              "Permanent dofollow placements",
              "Clear pricing, no surprises",
              "Real human support",
            ].map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <Check size={16} className="text-primary mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-glow hover:scale-[1.02] transition"
          >
            Talk to us <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
