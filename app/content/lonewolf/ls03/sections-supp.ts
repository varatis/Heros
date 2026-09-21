import type { StorySection } from "../../../lib/lonewolf/types";

export const SECTIONS_SUPP: StorySection[] = [
  {
  id: "32-b",
  texte: "Suite du combat du §32",
  suite: "32-c",
  combat: { nom: "Languabarb", habilete: 10, endurance: 32 }
  },
  {
  id: "32-c",
  texte: "Suite du combat du §32",
  choix: [
    { texte: "Si vous avez perdu des points d'ENDURANCE", vers: "66" },
    { texte: "Si vous n'avez perdu aucun point d'ENDURANCE", vers: "25" }
  ],
  combat: { nom: "Languabarb", habilete: 8, endurance: 30 }
  },
  {
  id: "89-b",
  texte: "Suite du combat du §89",
  suite: "89-c",
  combat: { nom: "Loup Maudit", habilete: 14, endurance: 23 }
  },
  {
  id: "89-c",
  texte: "Suite du combat du §89",
  suite: "161",
  combat: { nom: "Loup Maudit", habilete: 14, endurance: 20 }
  },
  {
  id: "138-b",
  texte: "Suite du combat du §138",
  choix: [
    { texte: "Si vous avez perdu des points d'ENDURANCE (même en fuyant)", vers: "66" },
    { texte: "Si vous avez remporté le combat sans perdre d'ENDURANCE", vers: "25" },
    { texte: "Prendre la fuite", vers: "277" }
  ],
  combat: { nom: "Languabarb", habilete: 10, endurance: 32 }
  },
  {
  id: "263-b",
  texte: "Suite du combat du §263",
  suite: "263-c",
  combat: { nom: "Languabarb", habilete: 10, endurance: 32 }
  },
  {
  id: "263-c",
  texte: "Suite du combat du §263",
  choix: [
    { texte: "Si vous avez perdu des points d'ENDURANCE (même en fuyant)", vers: "66" },
    { texte: "Si vous avez remporté le combat sans perdre d'ENDURANCE", vers: "25" },
    { texte: "Prendre la fuite", vers: "277" }
  ],
  combat: { nom: "Languabarb", habilete: 8, endurance: 30 }
  },
  {
  id: "343-b",
  texte: "Suite du combat du §343",
  suite: "343-c",
  combat: { nom: "Loup Maudit", habilete: 14, endurance: 23 }
  },
  {
  id: "343-c",
  texte: "Suite du combat du §343",
  suite: "343-d",
  combat: { nom: "Loup Maudit", habilete: 14, endurance: 20 }
  },
  {
  id: "343-d",
  texte: "Suite du combat du §343",
  suite: "28",
  combat: { nom: "Barbare des Glaces", habilete: 17, endurance: 29, immunisePsychique: true }
  }
];
