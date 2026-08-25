import Link from "next/link";
import { STORY_THEMES, catalogueHref, type StoryThemeId } from "@/lib/stories";
import { cn } from "@/lib/utils";

export default function ThemeRail({
  active,
  counts,
}: {
  active: StoryThemeId | null;
  counts: Partial<Record<StoryThemeId, number>>;
}) {
  const items: Array<{
    id: string;
    href: string;
    label: string;
    count?: number;
    empty: boolean;
    current: boolean;
  }> = [
    {
      id: "all",
      href: "/catalogue",
      label: "Tous",
      empty: false,
      current: active === null,
    },
    ...STORY_THEMES.map((theme) => {
      const count = counts[theme.id] ?? 0;
      return {
        id: theme.id,
        href: catalogueHref(theme.id),
        label: theme.label,
        count: count > 0 ? count : undefined,
        empty: count === 0,
        current: active === theme.id,
      };
    }),
  ];

  return (
    <nav aria-label="Thèmes">
      <ul className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              scroll={false}
              aria-current={item.current ? "page" : undefined}
              className={cn(
                "flex h-8 items-center justify-center gap-1 rounded-full px-2.5 text-[12px] font-medium leading-none touch-manipulation",
                item.current
                  ? "bg-primary text-primary-foreground"
                  : item.empty
                    ? "bg-muted/40 text-muted-foreground"
                    : "bg-muted/70 text-foreground"
              )}
            >
              <span className="leading-none">{item.label}</span>
              {item.count != null && (
                <span
                  className={cn(
                    "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none",
                    item.current ? "bg-primary-foreground/18" : "bg-background/50"
                  )}
                >
                  {item.count}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
