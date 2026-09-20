"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { haptic } from "@/lib/haptics";
import { sfxChoice } from "@/lib/sound";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  ariaLabel?: string;
};

export function PrimaryCTA({ children, href, onClick, className, disabled, type = "button", ariaLabel }: Props) {
  const cls = cn("btn btn-primary btn-primary--hero", className);
  const handle = () => {
    haptic("medium");
    sfxChoice();
    onClick?.();
  };
  if (href && !disabled) {
    return (
      <Link href={href} aria-label={ariaLabel} className={cls} onClick={() => { haptic("medium"); sfxChoice(); }}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} disabled={disabled} aria-label={ariaLabel} className={cls} onClick={handle}>
      {children}
    </button>
  );
}

export function SecondaryCTA({ children, href, onClick, className, disabled, ariaLabel }: Props) {
  const cls = cn("btn btn-choice--secondary", className);
  const handle = () => {
    haptic("light");
    onClick?.();
  };
  if (href && !disabled) {
    return (
      <Link href={href} aria-label={ariaLabel} className={cls} onClick={() => haptic("light")}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" disabled={disabled} aria-label={ariaLabel} className={cls} onClick={handle}>
      {children}
    </button>
  );
}
