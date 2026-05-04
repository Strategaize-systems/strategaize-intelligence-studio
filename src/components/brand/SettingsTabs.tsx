// SettingsTabs — Navigation zwischen Profile-Editor / Changelog / Prompt-Snippet
"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface TabItem {
  href: "/settings/brand" | "/settings/brand/changelog" | "/settings/brand/preview";
  label: string;
}

const TABS: TabItem[] = [
  { href: "/settings/brand", label: "Profil" },
  { href: "/settings/brand/changelog", label: "Changelog" },
  { href: "/settings/brand/preview", label: "Prompt-Vorschau" },
];

export function SettingsTabs() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Brand Profile Bereiche"
      className="bg-white rounded-xl border-2 border-slate-200 shadow-sm p-1.5 inline-flex gap-1"
    >
      {TABS.map((tab) => {
        const isActive =
          pathname === tab.href || pathname.endsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all",
              isActive
                ? "bg-gradient-brand text-white shadow-md"
                : "text-slate-700 hover:bg-slate-100"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
