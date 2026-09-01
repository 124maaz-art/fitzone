"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Dumbbell,
  FolderTree,
  Wrench,
  Package,
  Users,
  ClipboardList,
  Images,
  RefreshCcw,
  MessageSquareQuote,
  Inbox,
  Settings,
  LogOut,
  Menu,
  X,
  Dumbbell as LogoIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/equipment", label: "Equipment", icon: Dumbbell },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/trainers", label: "Trainers", icon: Users },
  { href: "/admin/programs", label: "Programs", icon: ClipboardList },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/transformations", label: "Transformations", icon: RefreshCcw },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function SidebarLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {nav.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-accent text-accent-foreground" : "text-muted hover:bg-white/5 hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar({ userName, userRole }: { userName: string; userRole: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-extrabold">
          <LogoIcon className="h-5 w-5 text-accent" /> FitZone Admin
        </Link>
        <button onClick={() => setMobileOpen(true)} aria-label="Open admin menu" className="rounded-md p-2">
          <Menu className="h-6 w-6" />
        </button>
      </header>

      <aside
        className={cn(
          "fixed inset-0 z-50 w-72 shrink-0 flex-col border-r border-border bg-background transition-transform lg:static lg:flex lg:translate-x-0",
          mobileOpen ? "flex translate-x-0" : "hidden -translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-5">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-extrabold">
            <LogoIcon className="h-5 w-5 text-accent" /> FitZone Admin
          </Link>
          <button className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close admin menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-white/5 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-bold text-accent-foreground">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{userName}</p>
              <p className="text-xs uppercase tracking-wide text-muted">{userRole}</p>
            </div>
          </div>
          <form
            action={async () => {
              await signOut({ callbackUrl: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-5 w-5" /> Logout
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
