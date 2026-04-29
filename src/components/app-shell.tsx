"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Inbox,
  Columns3,
  Car,
  Settings,
  Bell,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/",          label: "Dashboard",  icon: LayoutDashboard },
  { href: "/inbox",     label: "Bandeja",    icon: Inbox },
  { href: "/kanban",    label: "Kanban",     icon: Columns3 },
  { href: "/vehiculos", label: "Vehículos",  icon: Car },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ========== SIDEBAR (Desktop) ========== */}
      <aside className="hidden md:flex w-[260px] flex-col border-r border-border bg-card shrink-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-border">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-shadow">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight leading-none">Automóviles Luismi</h1>
              <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">Gestión vehicular</p>
            </div>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <item.icon className={cn("w-[18px] h-[18px]", isActive && "text-primary")} />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-40" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="px-3 py-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar name="Alejandro Ruiz" size="sm" showOnline />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Alejandro Ruiz</p>
              <p className="text-xs text-muted-foreground truncate">Admin</p>
            </div>
            <button onClick={handleLogout} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors group/logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="md:hidden h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
              <Car className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-foreground">Automóviles Luismi</span>
          </Link>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse-dot" />
            </button>
            <Avatar name="Alejandro Ruiz" size="sm" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>

        {/* ========== BOTTOM NAV (Mobile) ========== */}
        <nav className="md:hidden border-t border-border bg-card shrink-0 safe-bottom">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 px-3 py-1 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
