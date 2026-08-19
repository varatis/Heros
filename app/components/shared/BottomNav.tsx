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

  // Ne pas afficher la barre de navigation pendant la lecture interactive pour une immersion maximale
  if (pathname.includes("/play")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/40 bg-background/90 backdrop-blur-lg pb-safe">
      <div className="flex h-16 max-w-lg mx-auto items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/catalogue" && pathname.startsWith("/story"));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-1.5 transition-all text-xs font-medium",
                isActive
                  ? "text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "p-1 rounded-xl transition-all",
                  isActive && "bg-primary/15 text-primary glow-purple"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={cn("text-[11px]", isActive && "font-bold")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
