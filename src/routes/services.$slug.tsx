import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MarketingLayout, PageHero } from "@/components/layout/MarketingLayout";
import { getServices } from "@/lib/public.functions";
import { Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/services/$slug")({
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = Route.useParams();
  const { data: services } = useQuery({ queryKey: ["services"], queryFn: () => getServices() });
  const service = services?.find((s) => s.slug === slug);

  if (services && !service) throw notFound();
  if (!service) return null;

  const features = Array.isArray(service.features) ? (service.features as string[]) : [];

  return (
    <MarketingLayout>
      <PageHero eyebrow={service.category} title={service.name} subtitle={service.short_description} />
      <section className="max-w-5xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h2 className="font-display text-2xl font-bold">Overview</h2>
          <p className="text-muted-foreground leading-relaxed">{service.long_description}</p>
          <h3 className="font-display text-xl font-bold pt-4">What's included</h3>
          <ul className="space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={14} />
                </div>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="bg-card border border-border rounded-2xl p-8 h-fit sticky top-24 shadow-card">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Starting at</div>
          <div className="font-display text-4xl font-bold mb-1">${service.starting_price}</div>
          <div className="text-sm text-muted-foreground mb-6">per placement</div>
          <Link
            to="/dashboard"
            className="block text-center bg-primary text-primary-foreground py-3 rounded-xl font-bold shadow-glow hover:scale-[1.02] transition"
          >
            Order Now
          </Link>
          <Link
            to="/contact"
            className="mt-3 block text-center border border-border py-3 rounded-xl font-semibold hover:bg-muted transition flex items-center justify-center gap-2"
          >
            Talk to sales <ArrowRight size={14} />
          </Link>
        </aside>
      </section>
    </MarketingLayout>
  );
}
