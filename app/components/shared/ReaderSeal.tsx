import { useId } from "react";
import { cn } from "@/lib/utils";
import { getSeal, type SealId } from "@/lib/seals";

const SIZE = {
  xs: "size-7",
  sm: "size-9",
  md: "size-14",
  lg: "size-24",
  xl: "size-28",
} as const;

type SealSize = keyof typeof SIZE;

export default function ReaderSeal({
  id,
  size = "md",
  className,
  locked = false,
}: {
  id: SealId;
  size?: SealSize;
  className?: string;
  locked?: boolean;
}) {
  const seal = getSeal(id);
  const uid = useId().replace(/:/g, "");
  const waxId = `wax-${id}-${uid}`;

  return (
    <span
      className={cn(
        "relative inline-grid place-items-center overflow-hidden rounded-full",
        SIZE[size],
        locked && "opacity-40 grayscale",
        className
      )}
      role="img"
      aria-label={`Sceau ${seal.name}`}
    >
      <svg viewBox="0 0 80 80" className="size-full" aria-hidden>
        <defs>
          <radialGradient id={waxId} cx="38%" cy="32%" r="72%">
            <stop offset="0%" stopColor="oklch(0.42 0.06 150)" />
            <stop offset="55%" stopColor="oklch(0.22 0.04 168)" />
            <stop offset="100%" stopColor="oklch(0.14 0.03 175)" />
          </radialGradient>
        </defs>
        <circle cx="40" cy="40" r="39" fill={`url(#${waxId})`} />
        <circle
          cx="40"
          cy="40"
          r="35.5"
          fill="none"
          stroke="oklch(0.83 0.14 80 / 0.55)"
          strokeWidth="1.2"
        />
        <circle
          cx="40"
          cy="40"
          r="31.5"
          fill="none"
          stroke="oklch(0.83 0.14 80 / 0.22)"
          strokeWidth="0.7"
          strokeDasharray="1.6 2.2"
        />
        <g
          fill="none"
          stroke="oklch(0.9 0.04 90)"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <SealGlyph id={id} />
        </g>
      </svg>
    </span>
  );
}

function SealGlyph({ id }: { id: SealId }) {
  switch (id) {
    case "lantern":
      return (
        <>
          <path d="M32 28h16l2 6H30z" />
          <rect x="31" y="34" width="18" height="20" rx="2" />
          <path d="M40 22v6M34 42h12M36 54h8" />
          <path d="M36 38c1.4 3 2.6 5 4 8 1.4-3 2.6-5 4-8" />
        </>
      );
    case "quill":
      return (
        <>
          <path d="M52 22c-8 2-18 14-22 28l-4 10 10-4c14-4 26-14 28-22-4 1-8 0-12-2z" />
          <path d="M30 56c4-8 10-16 18-22" />
          <path d="M26 62h10" />
        </>
      );
    case "compass":
      return (
        <>
          <circle cx="40" cy="40" r="14" />
          <path d="M40 22v4M40 54v4M22 40h4M54 40h4" />
          <path d="M40 28l4.5 12L40 52l-4.5-12z" fill="oklch(0.9 0.04 90 / 0.18)" />
        </>
      );
    case "key":
      return (
        <>
          <circle cx="30" cy="32" r="8" />
          <circle cx="30" cy="32" r="3.2" />
          <path d="M36.5 36.5 56 56" />
          <path d="M48 48l6 2M52 52l5 1.5" />
        </>
      );
    case "moon":
      return (
        <path d="M48 24.5A16 16 0 1 0 52 54a13.5 13.5 0 1 1-4-29.5z" />
      );
    case "flame":
      return (
        <path d="M40 22c2 8-6 12-6 20 0 8 5.4 14 14 14 7 0 12-5 12-12 0-8-6-12-6-18 6 4 10 11 10 18 0 11-9 20-20 20s-20-9-20-20c0-10 8-18 16-22z" />
      );
    case "star":
      return (
        <path d="M40 22l3.4 10.6H54l-8.6 6.4 3.3 10.6L40 43.4 31.3 49.6l3.3-10.6L26 32.6h10.6z" />
      );
    case "oak":
      return (
        <>
          <path d="M40 22c8 4 14 12 12 22-1.4 7-7 10-12 12-5-2-10.6-5-12-12-2-10 4-18 12-22z" />
          <path d="M40 56V38" />
          <path d="M34 44c3-1 5-1 6 0M40 48c3 .4 5 0 7-2" />
        </>
      );
  }
}
