import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative pt-20 pb-16 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 gradient-orb bg-cyan-brand rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 gradient-orb bg-primary rounded-full"></div>
      <div className="relative max-w-5xl mx-auto px-6 text-center animate-fade-up">
        {eyebrow && (
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-5">
            {eyebrow}
          </span>
        )}
        <h1 className="font-display text-5xl md:text-6xl font-bold leading-[1.05] text-balance mb-6">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
