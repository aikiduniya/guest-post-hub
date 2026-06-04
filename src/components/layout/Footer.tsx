import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-20 pb-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
        <div className="col-span-2">
          <Logo className="h-10 w-auto mb-6" />
          <p className="text-muted-foreground max-w-xs mb-8 text-sm leading-relaxed">
            Empowering the next generation of SEO professionals with data-driven link building and outreach at scale.
          </p>
          <div className="flex gap-3">
            {["X", "in", "Fb"].map((s) => (
              <div
                key={s}
                className="size-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-secondary hover:bg-primary hover:text-primary-foreground transition cursor-pointer"
              >
                {s}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-5 text-sm">Services</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-primary">Guest Posts</Link></li>
            <li><Link to="/services" className="hover:text-primary">Niche Edits</Link></li>
            <li><Link to="/services" className="hover:text-primary">Blogger Outreach</Link></li>
            <li><Link to="/services" className="hover:text-primary">Press Releases</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-5 text-sm">Company</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/case-studies" className="hover:text-primary">Case Studies</Link></li>
            <li><Link to="/reseller" className="hover:text-primary">Reseller</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-5 text-sm">Account</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/auth" className="hover:text-primary">Log In</Link></li>
            <li><Link to="/auth" className="hover:text-primary">Sign Up</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
            <li><Link to="/pricing" className="hover:text-primary">Pricing</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 border-t border-border pt-8 flex flex-col md:flex-row justify-between gap-4 text-xs text-muted-foreground">
        <span>&copy; {new Date().getFullYear()} Accessily — All in One SEO Power. Built for performance.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary">Privacy</a>
          <a href="#" className="hover:text-primary">Terms</a>
        </div>
      </div>
    </footer>
  );
}
