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
  return (
    <nav aria-label="Thèmes" className="-mx-4 overflow-x-auto px-4 scrollbar-none">
      <ul className="flex w-max gap-2 pb-1">
        <li>
          <ThemeChip href="/catalogue" label="Tous" active={active === null} />
        </li>
        {STORY_THEMES.map((theme) => {
          const count = counts[theme.id] ?? 0;
          return (
            <li key={theme.id}>
              <ThemeChip
                href={catalogueHref(theme.id)}
                label={theme.label}
                count={count}
                active={active === theme.id}
                empty={count === 0}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function ThemeChip({
  href,
  label,
  count,
  active,
  empty = false,
}: {
  href: string;
  label: string;
  count?: number;
  active: boolean;
  empty?: boolean;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-medium touch-manipulation whitespace-nowrap",
        active
          ? "bg-primary text-primary-foreground"
          : empty
            ? "bg-muted/40 text-muted-foreground"
            : "bg-muted/70 text-foreground"
      )}
    >
      {label}
      {typeof count === "number" && count > 0 && (
        <span className={cn("text-[11px] tabular-nums", active ? "opacity-80" : "text-muted-foreground")}>
          {count}
        </span>
      )}
    </Link>
  );
}
