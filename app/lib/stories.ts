export const STORY_THEMES = [
  {
    id: "fantasy",
    label: "Fantasy",
    blurb: "Royaumes, magie, destins.",
  },
  {
    id: "adventure",
    label: "Aventure",
    blurb: "Routes, dangers, choix.",
  },
  {
    id: "mystery",
    label: "Polar",
    blurb: "Enquêtes, secrets, indices.",
  },
  {
    id: "scifi",
    label: "SF",
    blurb: "Ailleurs, machines, lendemains.",
  },
  {
    id: "horror",
    label: "Horreur",
    blurb: "Peur, doute, ce qui veille.",
  },
  {
    id: "romance",
    label: "Romance",
    blurb: "Liens, élans, cœurs à risque.",
  },
] as const;

export type StoryThemeId = (typeof STORY_THEMES)[number]["id"];

const THEME_BY_ID = Object.fromEntries(STORY_THEMES.map((t) => [t.id, t])) as Record<
  StoryThemeId,
  (typeof STORY_THEMES)[number]
>;

export function isStoryTheme(value: string | null | undefined): value is StoryThemeId {
  return Boolean(value && value in THEME_BY_ID);
}

export function getTheme(id: string | null | undefined) {
  if (!isStoryTheme(id)) return null;
  return THEME_BY_ID[id];
}

export function genreLabel(genre: string | null | undefined): string {
  return getTheme(genre)?.label ?? (genre || "Récit");
}

export function catalogueHref(theme?: string | null): string {
  return isStoryTheme(theme) ? `/catalogue?theme=${theme}` : "/catalogue";
}

export function playtimeLabel(minutes: number | null | undefined): string {
  const m = minutes || 15;
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h} h ${rest}` : `${h} h`;
}
