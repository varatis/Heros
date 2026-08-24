"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ReaderSeal from "@/components/shared/ReaderSeal";
import {
  READER_SEALS,
  encodeSeal,
  isSealUnlocked,
  unlockHint,
  type SealId,
} from "@/lib/seals";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function SealStudio({
  currentId,
  completedStories,
}: {
  currentId: SealId;
  completedStories: number;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SealId>(currentId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function choose(id: SealId) {
    const seal = READER_SEALS.find((s) => s.id === id);
    if (!seal || !isSealUnlocked(seal, completedStories) || saving) return;
    setSelected(id);
    setSaving(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Session expirée.");
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: encodeSeal(id) })
      .eq("id", user.id);

    setSaving(false);
    if (updateError) {
      setError("Impossible d’enregistrer le sceau.");
      return;
    }
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Changer de sceau"
        id="open-seal-studio"
      >
        <ReaderSeal id={selected} size="xl" />
        <span className="absolute inset-x-2 -bottom-1 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground opacity-0 shadow-sm ring-1 ring-border/60 transition-opacity group-hover:opacity-100">
          Changer
        </span>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl pb-8">
          <SheetHeader className="px-5 pt-2">
            <SheetTitle className="font-display text-2xl font-normal">
              Votre sceau
            </SheetTitle>
            <SheetDescription>
              C’est votre ex-libris : il vous suit dans la barre, sur ce profil,
              et marque les livres que vous terminez.
            </SheetDescription>
          </SheetHeader>

          <div className="grid grid-cols-4 gap-3 px-5 pt-2">
            {READER_SEALS.map((seal) => {
              const unlocked = isSealUnlocked(seal, completedStories);
              const active = selected === seal.id;
              return (
                <button
                  key={seal.id}
                  type="button"
                  id={`studio-seal-${seal.id}`}
                  disabled={!unlocked || saving}
                  onClick={() => choose(seal.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-2xl px-1 py-2 transition-colors",
                    active && "bg-primary/10",
                    unlocked ? "hover:bg-muted/50" : "cursor-not-allowed"
                  )}
                >
                  <ReaderSeal id={seal.id} size="md" locked={!unlocked} />
                  <span className="text-[11px] font-medium text-foreground/90">
                    {seal.name}
                  </span>
                  {!unlocked && (
                    <span className="text-[9px] leading-tight text-muted-foreground">
                      {unlockHint(seal)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {error && (
            <p className="px-5 pt-3 text-sm text-destructive">{error}</p>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
