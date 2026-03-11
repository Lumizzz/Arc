// src/components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "⊡" },
  { label: "Hero Content", href: "/admin/dashboard#hero", icon: "◈" },
  { label: "Navigation", href: "/admin/dashboard#nav", icon: "≡" },
  { label: "Settings", href: "/admin/dashboard#settings", icon: "◎" },
];

export function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0c0c18] border-r border-white/[0.06] flex flex-col z-20">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/[0.06] flex items-center gap-2.5">
        <div className="relative w-6 h-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-white/30" />
          <div className="w-1 h-1 rounded-full bg-white/80" />
        </div>
        <span className="font-bold text-white">Imagica</span>
        <span className="ml-auto text-[10px] text-white/25 font-mono bg-white/5 px-2 py-0.5 rounded">CMS</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors duration-150
                ${isActive
                  ? "bg-white/10 text-white"
                  : "text-white/45 hover:text-white/75 hover:bg-white/[0.05]"}
              `}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User / sign out */}
      <div className="px-4 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.[0] ?? user?.email?.[0] ?? "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{user?.name ?? "Admin"}</p>
            <p className="text-[10px] text-white/35 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full text-xs text-white/35 hover:text-white/60 text-left px-1 transition-colors"
        >
          Sign out →
        </button>
      </div>
    </aside>
  );
}
