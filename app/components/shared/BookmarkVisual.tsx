"use client";

import { Bookmark } from "@/lib/bookmarks";
import { cn } from "@/lib/utils";

interface BookmarkVisualProps {
  bookmark: Bookmark;
  size?: "sm" | "md" | "lg";
  selected?: boolean;
  className?: string;
  showTassel?: boolean;
}

export default function BookmarkVisual({
  bookmark,
  size = "md",
  selected = false,
  className,
  showTassel = true,
}: BookmarkVisualProps) {
  const widthClass =
    size === "sm" ? "w-10 h-24" : size === "md" ? "w-16 h-40" : "w-24 h-56";

  const sealSize =
    size === "sm" ? "w-7 h-7" : size === "md" ? "w-11 h-11" : "w-16 h-16";

  const fontSize =
    size === "sm" ? "text-xs" : size === "md" ? "text-base" : "text-xl";

  return (
    <div
      className={cn(
        "relative flex flex-col items-center select-none transition-all duration-300",
        selected && "scale-105",
        className
      )}
    >
      {/* Halo de lueur magique nocturne si sélectionné */}
      {selected && (
        <div
          className="absolute inset-0 -inset-x-3 -inset-y-2 rounded-2xl blur-xl opacity-60 pointer-events-none transition-opacity duration-300"
          style={{ backgroundColor: bookmark.accentColor }}
        />
      )}

      {/* Le corps du ruban marque-page */}
      <div
        className={cn(
          "relative rounded-t-sm shadow-2xl flex flex-col items-center justify-between border border-white/10",
          widthClass
        )}
        style={{
          background: bookmark.ribbonGradient,
          boxShadow: selected
            ? `0 10px 25px -5px ${bookmark.glowColor}, inset 0 0 12px rgba(255,255,255,0.2)`
            : "0 8px 20px -6px rgba(0,0,0,0.7), inset 0 0 8px rgba(0,0,0,0.5)",
        }}
      >
        {/* Lignes de couture dorées / argentées sur les côtés */}
        <div className="absolute inset-y-1 left-1 w-px border-l border-dashed border-white/30" />
        <div className="absolute inset-y-1 right-1 w-px border-r border-dashed border-white/30" />

        {/* En-tête : petite attache supérieure ou rune */}
        <div className="pt-2 text-[10px] tracking-widest font-mono text-white/60 uppercase">
          {size !== "sm" && "HERO"}
        </div>

        {/* Sceau / Médaillon central */}
        <div
          className={cn(
            "rounded-full border-2 flex items-center justify-center shadow-lg transition-transform",
            sealSize,
            selected && "scale-110"
          )}
          style={{
            borderColor: bookmark.accentColor,
            background: "radial-gradient(circle, #1a221d 30%, #0d1210 100%)",
            boxShadow: `0 0 14px ${bookmark.glowColor}`,
          }}
        >
          {renderSealIcon(bookmark.sealSymbol, bookmark.accentColor, fontSize)}
        </div>

        {/* Motif runique inférieur */}
        <div className="pb-4 text-center">
          <span
            className="text-[9px] tracking-widest font-serif block opacity-75"
            style={{ color: bookmark.accentColor }}
          >
            {size !== "sm" ? "✦ ◈ ✦" : "✦"}
          </span>
        </div>

        {/* Découpe en pointe de ruban traditionnelle (queue de pie) */}
        <div
          className="absolute -bottom-3 inset-x-0 h-3"
          style={{
            background: "inherit",
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          }}
        />
      </div>

      {/* Gland de soie ou cordon pendant (tassel) */}
      {showTassel && (
        <div className="relative mt-2 flex flex-col items-center">
          {/* Cordon fin */}
          <div
            className="w-0.5 h-3 opacity-80"
            style={{ backgroundColor: bookmark.accentColor }}
          />
          {/* Perle métallique */}
          <div
            className="w-2 h-2 rounded-full border border-black/50"
            style={{
              backgroundColor: bookmark.accentColor,
              boxShadow: `0 0 6px ${bookmark.accentColor}`,
            }}
          />
          {/* Frange de fils */}
          <div
            className="w-1.5 h-4 opacity-75"
            style={{
              background: `linear-gradient(180deg, ${bookmark.accentColor} 0%, transparent 100%)`,
            }}
          />
        </div>
      )}
    </div>
  );
}

function renderSealIcon(
  symbol: Bookmark["sealSymbol"],
  color: string,
  fontSize: string
) {
  switch (symbol) {
    case "sun":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-3/5 h-3/5"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" fill={color} fillOpacity="0.2" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      );
    case "dragon":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-3/5 h-3/5"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 16c1.5-2 3-3 6-3 2.5 0 4.5 1 6 3" fill={color} fillOpacity="0.15" />
          <path d="M8 12c0-2 1.2-4 4-5 2.2 1 4 3 4 5 0 2-1.5 3.5-4 3.5S8 14 8 12Z" />
          <circle cx="10.5" cy="11" r="0.9" fill={color} />
          <circle cx="13.5" cy="11" r="0.9" fill={color} />
          <path d="M12 13.5c0.6 0.6 0.6 1.2 0 1.8-.6-.6-.6-1.2 0-1.8Z" fill={color} />
        </svg>
      );
    case "crow":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-3/5 h-3/5"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
          <line x1="16" y1="8" x2="2" y2="22" />
          <line x1="17.5" y1="15" x2="9" y2="15" />
        </svg>
      );
    case "tree":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-3/5 h-3/5"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5M12 5l-4 5M12 5l4 5M12 12l-6 6M12 14l6 4" />
        </svg>
      );
    case "star":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-3/5 h-3/5"
          fill={color}
          stroke={color}
          strokeWidth="1"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "claw":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-3/5 h-3/5"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 3v12a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
          <line x1="12" y1="9" x2="12" y2="15" />
        </svg>
      );
    default:
      return <span className={fontSize}>✦</span>;
  }
}
