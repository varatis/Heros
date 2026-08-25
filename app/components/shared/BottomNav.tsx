"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, User, Store, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Livres", href: "/catalogue", icon: BookOpenText },
  { label: "Boutique", href: "/shop", icon: Store },
  { label: "Héros", href: "/character", icon: User },
  { label: "Succès", href: "/achievements", icon: Trophy },
];

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname.includes("/play")) {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/40 bg-background/88 px-safe pb-safe backdrop-blur-xl">
      <div className="mx-auto grid h-14 max-w-lg grid-cols-4">
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
                "flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium touch-manipulation",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="size-5" strokeWidth={isActive ? 2.25 : 1.75} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
