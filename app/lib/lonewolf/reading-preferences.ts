export interface ReadingPreferences {
  theme: "paper" | "light" | "night";
  fontSize: 18 | 20 | 22;
  spacious: boolean;
}
export const DEFAULT_READING: ReadingPreferences = {
  theme: "paper",
  fontSize: 20,
  spacious: true,
};
export const READING_KEY = "herobook:lecture:v1";
export function parseReadingPreferences(value: unknown): ReadingPreferences {
  const p =
    value && typeof value === "object"
      ? (value as Partial<ReadingPreferences>)
      : {};
  return {
    theme: p.theme === "light" || p.theme === "night" ? p.theme : "paper",
    fontSize: p.fontSize === 18 || p.fontSize === 22 ? p.fontSize : 20,
    spacious: typeof p.spacious === "boolean" ? p.spacious : true,
  };
}
