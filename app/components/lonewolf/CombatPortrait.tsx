"use client";

import { useState } from "react";
import { ImageOff, ShieldQuestion } from "lucide-react";

/** Portrait files are composed in advance, so the UI never crops out a face. */
export default function CombatPortrait({
  src,
  name,
  alt,
}: {
  src?: string;
  name: string;
  alt?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = !!src && src === failedSrc;
  return (
    <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#141b19]">
      {src && !failed ? (
        <img
          src={src}
          alt={alt ?? `Portrait de ${name}`}
          width={480}
          height={640}
          className="w-full h-full object-contain"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <div
          className="flex h-full flex-col items-center justify-center gap-3 p-3 text-center text-muted-foreground"
          role="img"
          aria-label={`${name} : ${failed ? "portrait indisponible" : "portrait à illustrer"}`}
        >
          {failed ? (
            <ImageOff className="size-8" aria-hidden="true" />
          ) : (
            <ShieldQuestion
              className="size-10"
              strokeWidth={1}
              aria-hidden="true"
            />
          )}
          <span className="text-xs leading-5">
            {failed ? "Portrait indisponible" : "Portrait à illustrer"}
          </span>
        </div>
      )}
    </div>
  );
}
