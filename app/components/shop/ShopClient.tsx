import { Gem, Shield, FlaskConical } from "lucide-react";

interface Pack {
  id: string;
  name: string;
  gems_amount: number;
  bonus_gems: number | null;
}
interface Item {
  id: string;
  name: string;
  description: string | null;
  price_gems: number | null;
  item_type: string;
}
const previewPacks: Pack[] = [
  {
    id: "preview-purse",
    name: "Bourse de gemmes",
    gems_amount: 100,
    bonus_gems: 0,
  },
  {
    id: "preview-chest",
    name: "Coffret de gemmes",
    gems_amount: 500,
    bonus_gems: 0,
  },
];
const previewItems: Item[] = [
  {
    id: "preview-potion",
    name: "Potion de Laumspur",
    description:
      "Un aperçu des objets de l’échoppe. Leur achat et leur utilisation en jeu ne sont pas encore activés.",
    price_gems: 40,
    item_type: "potion",
  },
  {
    id: "preview-shield",
    name: "Bouclier",
    description:
      "Un aperçu des équipements. Aucun bonus ne sera ajouté à votre aventure depuis cette boutique.",
    price_gems: 200,
    item_type: "armor",
  },
];

/** Display only until a server-verified, atomic purchase flow is available.
 * In particular, never credit wallets from the browser or record mock payments.
 */
export default function ShopClient({
  gemPacks,
  items,
  preview = false,
}: {
  gemPacks: Pack[];
  items: Item[];
  preview?: boolean;
}) {
  const packs = preview ? previewPacks : gemPacks;
  const stock = preview ? previewItems : items;
  return (
    <div className="space-y-9">
      <section className="space-y-5">
        <div>
          <p className="eyebrow mb-2">
            À venir{preview ? " · Aperçu de présentation" : ""}
          </p>
          <h2 className="font-serif text-2xl">Gemmes & trésors</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {packs.map((pack) => (
            <article
              key={pack.id}
              className="panel p-6 flex flex-col items-start gap-4"
            >
              <span className="p-3 rounded-xl bg-primary/10 text-primary">
                <Gem size={28} />
              </span>
              <h3 className="font-serif text-xl">{pack.name}</h3>
              <p className="text-2xl text-primary">
                {pack.gems_amount.toLocaleString("fr-FR")}{" "}
                <span className="text-sm">gemmes</span>
              </p>
              {!!pack.bonus_gems && (
                <p className="text-sm text-muted-foreground">
                  + {pack.bonus_gems} gemmes bonus
                </p>
              )}
              <button
                disabled
                className="action-link action-secondary w-full opacity-70"
              >
                Bientôt disponible
              </button>
            </article>
          ))}
        </div>
        {!packs.length && (
          <p className="text-sm text-muted-foreground">
            Les packs de gemmes seront présentés à l’ouverture des achats.
          </p>
        )}
      </section>
      <section className="space-y-5">
        <h2 className="font-serif text-2xl">L’échoppe de l’aventurier</h2>
        <p className="text-muted-foreground text-sm">
          Présentation des objets · achats et bonus en jeu non activés.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {stock.map((item) => {
            const Icon = item.item_type === "potion" ? FlaskConical : Shield;
            return (
              <article key={item.id} className="panel p-6 flex gap-4">
                <Icon size={30} className="text-primary shrink-0" />
                <div className="space-y-3">
                  <h3 className="font-serif text-xl">{item.name}</h3>
                  <p className="text-sm text-muted-foreground leading-6">
                    {item.description}
                  </p>
                  <p className="text-sm text-primary">
                    {item.price_gems == null
                      ? "Tarif à venir"
                      : `${item.price_gems} gemmes · tarif indicatif`}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    Bientôt disponible
                  </span>
                </div>
              </article>
            );
          })}
        </div>
        {!stock.length && (
          <p className="text-sm text-muted-foreground">
            L’échoppe prépare sa prochaine collection.
          </p>
        )}
      </section>
    </div>
  );
}
