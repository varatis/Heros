import { Bookmark, getBookmarkById } from "./bookmarks";

export interface HeroProfile {
  heroName: string;
  bookmarkId: string;
  bookmark: Bookmark;
  createdAt: string;
}

const STORAGE_KEY = "herobook_hero_profile";
const DEFAULT_HERO_NAME = "Loup Solitaire";
const DEFAULT_BOOKMARK_ID = "kai-sun";

export function getLocalHeroProfile(): HeroProfile {
  if (typeof window === "undefined") {
    return {
      heroName: DEFAULT_HERO_NAME,
      bookmarkId: DEFAULT_BOOKMARK_ID,
      bookmark: getBookmarkById(DEFAULT_BOOKMARK_ID),
      createdAt: new Date().toISOString(),
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        heroName: parsed.heroName || DEFAULT_HERO_NAME,
        bookmarkId: parsed.bookmarkId || DEFAULT_BOOKMARK_ID,
        bookmark: getBookmarkById(parsed.bookmarkId || DEFAULT_BOOKMARK_ID),
        createdAt: parsed.createdAt || new Date().toISOString(),
      };
    }
  } catch {
    // fallback
  }

  return {
    heroName: DEFAULT_HERO_NAME,
    bookmarkId: DEFAULT_BOOKMARK_ID,
    bookmark: getBookmarkById(DEFAULT_BOOKMARK_ID),
    createdAt: new Date().toISOString(),
  };
}

export function saveLocalHeroProfile(heroName: string, bookmarkId: string): HeroProfile {
  const profile: HeroProfile = {
    heroName: heroName.trim() || DEFAULT_HERO_NAME,
    bookmarkId: bookmarkId || DEFAULT_BOOKMARK_ID,
    bookmark: getBookmarkById(bookmarkId || DEFAULT_BOOKMARK_ID),
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      // Aussi sauver des cookies pour que le serveur Next.js puisse les lire si besoin
      document.cookie = `herobook_hero_name=${encodeURIComponent(profile.heroName)}; path=/; max-age=31536000; SameSite=Lax`;
      document.cookie = `herobook_bookmark_id=${encodeURIComponent(profile.bookmarkId)}; path=/; max-age=31536000; SameSite=Lax`;
      window.dispatchEvent(new Event("herobook_profile_updated"));
    } catch {
      // ignore
    }
  }

  return profile;
}
