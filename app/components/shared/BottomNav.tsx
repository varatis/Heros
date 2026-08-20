"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, User, Store, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Aventures",
    href: "/catalogue",
    icon: Compass,
  },
  {
    label: "Boutique",
    href: "/shop",
    icon: Store,
  },
  {
    label: "Héros",
    href: "/character",
    icon: User,
  },
  {
    label: "Succès",
    href: "/achievements",
    icon: Trophy,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname.includes("/play")) {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-safe pb-safe">
      <div className="mx-auto max-w-lg px-3 pb-2">
        <div className="premium-card grid h-[72px] grid-cols-4 items-center rounded-[1.6rem] p-1.5 shadow-2xl backdrop-blur-xl">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/catalogue" && pathname.startsWith("/story"));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative flex h-full flex-col items-center justify-center gap-1 rounded-[1.25rem] text-[11px] font-bold transition-all",
                  isActive
                    ? "bg-primary/18 text-primary shadow-inner"
                    : "text-muted-foreground hover:bg-muted/35 hover:text-foreground"
                )}
              >
                {isActive && (
                  <span className="absolute inset-x-5 top-1 h-0.5 rounded-full bg-[--hero-gold] shadow-[0_0_14px_var(--hero-gold)]" />
                )}
                <Icon
                  className={cn(
                    "size-5 transition-transform duration-200 group-hover:-translate-y-0.5",
                    isActive && "drop-shadow-[0_0_12px_var(--primary)]"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
