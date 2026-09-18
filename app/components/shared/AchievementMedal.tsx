import {
  Footprints,
  Flame,
  Star,
  Swords,
  KeyRound,
  Shield,
  Trophy,
  Compass,
  Gem,
  Crown,
  Hand,
} from "lucide-react";
const icons = {
  "premier-pas": Footprints,
  "rescape-du-monastere": Flame,
  "etoile-de-cristal": Star,
  "chasseur-de-gourgaz": Swords,
  "tombeau-du-roi": KeyRound,
  survivant: Shield,
  serment: Trophy,
  "etoile-et-cle": Star,
  explorateur: Compass,
  "sans-une-egratignure": Gem,
  "tete-de-loup": Crown,
  "mains-nues": Hand,
};
export default function AchievementMedal({ slug }: { slug: string }) {
  const Icon = icons[slug as keyof typeof icons] ?? Trophy;
  return (
    <div className="badge-medal shrink-0" aria-hidden="true">
      <Icon size={28} strokeWidth={1.5} />
    </div>
  );
}
