"use client";

export type HapticStyle = "light" | "medium" | "heavy" | "selection";

export async function haptic(style: HapticStyle = "light") {
  try {
    // Capacitor Haptics if available
    const mod: any = await import("@capacitor/haptics").catch(() => null);
    if (mod?.Haptics) {
      if (style === "selection") {
        await mod.Haptics.selectionStart();
        await mod.Haptics.selectionChanged();
        await mod.Haptics.selectionEnd();
        return;
      }
      const ImpactStyle = mod.ImpactStyle ?? mod.HapticsImpactStyle;
      const impactStyle = style === "light" ? ImpactStyle.Light : style === "medium" ? ImpactStyle.Medium : ImpactStyle.Heavy;
      await mod.Haptics.impact({ style: impactStyle });
      return;
    }
  } catch {}
  // Fallback Web Vibration
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      const pattern = style === "heavy" ? 40 : style === "medium" ? 20 : 12;
      navigator.vibrate(pattern);
    }
  } catch {}
}

export async function hapticSuccess() {
  try {
    const mod = await import("@capacitor/haptics").catch(() => null);
    if (mod?.Haptics?.notification) {
      await mod.Haptics.notification({ type: mod.NotificationType.Success });
      return;
    }
  } catch {}
  haptic("medium");
}

export async function hapticError() {
  try {
    const mod = await import("@capacitor/haptics").catch(() => null);
    if (mod?.Haptics?.notification) {
      await mod.Haptics.notification({ type: mod.NotificationType.Error });
      return;
    }
  } catch {}
  haptic("heavy");
}
