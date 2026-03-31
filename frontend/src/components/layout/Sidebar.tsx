"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Zap,
  MessageSquare,
  BookOpen,
  Rss,
  Wallet,
  ShieldAlert,
  Activity,
  LogOut,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/portfolio", icon: Wallet, label: "Portfolio" },
  { href: "/analyzer", icon: Activity, label: "Market Intelligence" },
  { href: "/simulator", icon: ShieldAlert, label: "Risk Simulator" },
  { href: "/chat", icon: MessageSquare, label: "AI Assistant" },
  { href: "/research", icon: BookOpen, label: "Research Hub" },
  { href: "/news", icon: Rss, label: "News Feed" },
];

export function Sidebar() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const router = useRouter();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <Zap className="h-6 w-6 text-sky-400" />
        <span className="font-bold text-lg text-white tracking-tight">VittaDrishti</span>
      </div>

      {user && (
        <div className="p-6">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-xs font-bold text-sky-400">
                {user.user_metadata?.full_name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">
                  {user.user_metadata?.full_name || "Investigator"}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">Pro Member</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
                active
                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )}
            >
              <Icon className={cn("h-5 w-5", active ? "text-sky-400" : "group-hover:text-sky-400")} />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/5 rounded-lg transition-colors group"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
}
