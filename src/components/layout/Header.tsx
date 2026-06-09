import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { useAuth } from "@/lib/auth";

const nav = [
  { to: "/", label: "Home" },
  { to: "/sites", label: "Sites" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/60">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-9 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user && isAdmin ? (
            <Link
              to="/admin"
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-bold shadow-glow hover:scale-105 active:scale-95 transition"
            >
              Admin
            </Link>
          ) : (
            <>
              <Link to="/auth" className="text-sm font-semibold hover:text-primary transition">
                Log In
              </Link>
              <Link
                to="/contact"
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-bold shadow-glow hover:scale-105 active:scale-95 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 -mr-2"
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-up">
          <div className="px-6 py-4 flex flex-col gap-2">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2 text-base font-medium"
              >
                {n.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-3 border-t border-border mt-2">
              {user && isAdmin ? (
                <Link
                  to="/admin"
                  className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-full text-center font-bold"
                >
                  Admin
                </Link>
              ) : (
                <>
                  <Link to="/auth" className="flex-1 py-2.5 text-center font-semibold border border-border rounded-full">
                    Log In
                  </Link>
                  <Link
                    to="/contact"
                    className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-full text-center font-bold"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
