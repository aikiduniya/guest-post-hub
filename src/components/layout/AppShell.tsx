import { Link, useRouter } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { Logo } from "@/components/layout/Logo";
import { useAuth } from "@/lib/auth";
import { LayoutDashboard, ShoppingBag, LogOut, FileText, Settings, Package } from "lucide-react";

export function AppShell({ children }: { children: ReactNode; admin?: boolean }) {
  const { signOut, user } = useAuth();
  const router = useRouter();

  const nav = [
    { to: "/admin", label: "Dashboard", Icon: LayoutDashboard },
    { to: "/admin/orders", label: "Orders", Icon: ShoppingBag },
    { to: "/admin/services", label: "Services", Icon: Package },
    { to: "/admin/posts", label: "Posts", Icon: FileText },
    { to: "/admin/settings", label: "Settings", Icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-surface">
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar text-sidebar-foreground p-6 sticky top-0 h-screen">
        <Link to="/" className="mb-10 inline-block bg-white rounded-lg p-2">
          <Logo className="h-7 w-auto" />
        </Link>
        <div className="text-xs font-bold uppercase tracking-widest text-sidebar-foreground/50 mb-4">
          Admin
        </div>
        <nav className="space-y-1 flex-1">
          {nav.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-sidebar-accent transition"
              activeProps={{ className: "bg-sidebar-accent text-white" }}
              activeOptions={{ exact: to === "/admin" }}
            >
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>
        <div className="pt-6 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/60 mb-3 truncate">{user?.email}</div>
          <button
            onClick={async () => {
              await signOut();
              router.navigate({ to: "/" });
            }}
            className="flex items-center gap-2 text-sm font-medium hover:text-accent transition"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-30 bg-card border-b border-border px-4 h-14 flex items-center justify-between">
          <Logo className="h-7 w-auto" />
          <button
            onClick={async () => {
              await signOut();
              router.navigate({ to: "/" });
            }}
            className="text-sm font-semibold text-muted-foreground"
          >
            Sign out
          </button>
        </header>
        <div className="p-6 md:p-10 max-w-6xl">{children}</div>
      </div>
    </div>
  );
}
