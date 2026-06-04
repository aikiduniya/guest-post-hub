import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout, PageHero } from "@/components/layout/MarketingLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Accessily" },
      { name: "description", content: "Common questions about guest posts, niche edits and our outreach process." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: Faq,
});

const faqs = [
  ["What is a guest post?", "A guest post is original content published on another website with a contextual backlink pointing to your site. We handle outreach, content, and placement end-to-end."],
  ["How long until I see results?", "Most clients see ranking lifts within 30-90 days of consistent link acquisition. Domain authority growth is cumulative."],
  ["Are these links permanent?", "Yes. All our guest posts and niche edits are permanent do-follow placements. We monitor and replace any links that get removed within 12 months."],
  ["Do you accept any niche?", "We serve 200+ niches including SaaS, ecommerce, finance, health, crypto, and B2B. Some restricted niches (CBD, gambling) have premium pricing."],
  ["Can I review placements before they go live?", "Yes. Every order shows the live placement URL in your dashboard. For custom outreach, you approve the publisher before content is written."],
  ["Do you offer white-label reseller pricing?", "Yes — our Agency tier includes wholesale pricing, white-label PDF reports, and dedicated account management."],
  ["What's your refund policy?", "If a placement is rejected or removed within 30 days, we replace it free of charge. Cancel your subscription anytime with no penalty."],
];

function Faq() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="FAQ"
        title="Questions, answered"
        subtitle="Everything you need to know before you place your first order."
      />
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map(([q, a], i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="bg-card border border-border rounded-2xl px-6 shadow-card"
            >
              <AccordionTrigger className="text-left font-display font-bold text-base hover:no-underline py-5">
                {q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </MarketingLayout>
  );
}
