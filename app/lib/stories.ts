export const GENRE_LABELS: Record<string, string> = {
  fantasy: "Fantasy",
  adventure: "Aventure",
  mystery: "Polar",
  scifi: "Science-fiction",
  horror: "Horreur",
  romance: "Romance",
};

export function genreLabel(genre: string | null | undefined): string {
  if (!genre) return "Récit";
  return GENRE_LABELS[genre] ?? genre;
}

export function playtimeLabel(minutes: number | null | undefined): string {
  const m = minutes || 15;
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h} h ${rest}` : `${h} h`;
}
