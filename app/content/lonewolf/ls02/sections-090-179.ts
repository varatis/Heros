// Généré par scripts/ls02-importer.cjs. Source PDF SHA-256: 922d25f0fc7292d9c9d9bdafb020524eb97de5d01e522064543a1b434d1c6908
// Les identifiants suffixés sont des étapes techniques, pas des paragraphes du livre.
import type { StorySection } from "../../../lib/lonewolf/types";
export const SECTIONS_090_179: StorySection[] = [
  {
    "id": "90",
    "texte": "Deux SQUALLS et trois VILLAGEOIS en colère montent les marches quatre à quatre, bien décidés à vous faire un mauvais sort. Il vous faut les combattre un par un. HABILETÉ ENDURANCE 1er VILLAGEOIS 10 16 1er SQUALL 6 9 2e VILLAGEOIS 11 14 2e SQUALL 5 8 3e VILLAGEOIS 11 17 Vous pouvez à tout moment prendre la fuite en sautant par une fenêtre. Dans ce cas, rendez-vous au 132. Si vous parvenez à vaincre tous ces adversaires, rendez-vous au 274.",
    "combat": {
      "nom": "Villageois",
      "habilete": 10,
      "endurance": 16,
      "fuite": [
        {
          "texte": "Sauter par une fenêtre",
          "vers": "132"
        }
      ]
    },
    "suite": "90-b"
  },
  {
    "id": "90-b",
    "texte": "Suite du combat du §90 : adversaire 2 sur 5.",
    "combat": {
      "nom": "Squall",
      "habilete": 6,
      "endurance": 9,
      "fuite": [
        {
          "texte": "Sauter par une fenêtre",
          "vers": "132"
        }
      ]
    },
    "suite": "90-c"
  },
  {
    "id": "90-c",
    "texte": "Suite du combat du §90 : adversaire 3 sur 5.",
    "combat": {
      "nom": "Villageois",
      "habilete": 11,
      "endurance": 14,
      "fuite": [
        {
          "texte": "Sauter par une fenêtre",
          "vers": "132"
        }
      ]
    },
    "suite": "90-d"
  },
  {
    "id": "90-d",
    "texte": "Suite du combat du §90 : adversaire 4 sur 5.",
    "combat": {
      "nom": "Squall",
      "habilete": 5,
      "endurance": 8,
      "fuite": [
        {
          "texte": "Sauter par une fenêtre",
          "vers": "132"
        }
      ]
    },
    "suite": "90-e"
  },
  {
    "id": "90-e",
    "texte": "Suite du combat du §90 : adversaire 5 sur 5.",
    "combat": {
      "nom": "Villageois",
      "habilete": 11,
      "endurance": 17,
      "fuite": [
        {
          "texte": "Sauter par une fenêtre",
          "vers": "132"
        }
      ]
    },
    "suite": "274"
  },
  {
    "id": "91",
    "texte": "Le garçon est expulsé du magasin par deux gardes vêtus d'un uniforme noir. Le marchand vous remercie et vous offre 2 objets que vous devrez choisir dans la liste suivante : Bâton, Couverture, 2 Repas, Sac à Dos, Poignard, 100 mètres de Corde. Faites votre choix (deux objets à votre convenance) et inscrivez vos nouvelles acquisitions sur votre Feuille d'Aventure dans la case Sac à Dos. Vous remerciez ensuite le marchand et vous sortez par une porte latérale. Rendez-vous au 245.",
    "evenement": {
      "type": "interaction",
      "interaction": {
        "type": "butin",
        "offres": [
          {
            "id": "baton",
            "quantity": 1
          },
          {
            "id": "couverture",
            "quantity": 1
          },
          {
            "id": "repas",
            "quantity": 2
          },
          {
            "id": "sac-a-dos",
            "quantity": 1
          },
          {
            "id": "poignard",
            "quantity": 1
          },
          {
            "id": "corde",
            "quantity": 1
          }
        ],
        "maximum": 2
      }
    },
    "suite": "245"
  },
  {
    "id": "92",
    "texte": "L'épouvantable créature pousse un dernier cri en s'écroulant à vos pieds. Vous faites un pas en arrière pour échapper à l'odeur putride qui se dégage de son corps en décomposition et vous voyez alors trois autres Monstres d'Enfer s'avancer vers vous. Rester ici relèverait du suicide et vous décidez de prendre la fuite en direction du bois après avoir prévenu Rhygar à grands cris du danger qui menace. Rendez-vous au 183.",
    "suite": "183"
  },
  {
    "id": "93",
    "texte": "Déduisez de votre Feuille d'Aventure le nombre de Pièces d'Or que vous voulez donner aux mendiants. Ils vous remercient, mais d'autres mendiants apparaissent aussitôt en demandant que vous leur fassiez également l'aumône. Finalement, vous parvenez à vous frayer un chemin dans la foule et vous poursuivez votre route. Rendez-vous au 137.",
    "evenement": {
      "type": "interaction",
      "interaction": {
        "type": "don"
      }
    },
    "suite": "137"
  },
  {
    "id": "94",
    "texte": "Vous insistez auprès du capitaine pour qu'on aille voir ce qui se passe à bord du bateau, mais il ignore votre demande et ordonne à ses hommes de poursuivre leurs tâches habituelles. Vous contemplez le navire marchand qui bientôt disparaît à l'horizon en vous demandant pourquoi le capitaine a refusé de faire quoi que ce soit, puis vous descendez dans la coursive et vous vous enfermez dans votre cabine en prenant bien soin de verrouiller la porte. Rendez-vous au 240.",
    "suite": "240"
  },
  {
    "id": "95",
    "texte": "Vous lancez votre cheval à grands coups d'éperons parmi les arbres enchevêtrés et vous arrivez bientôt dans une petite clairière. Là, six Squalls surexcités sont en train de sautiller autour du corps convulsé d'un homme étendu sur le sol. Une lance à la hampe sculptée de motifs étranges est enfoncée dans sa poitrine et le cadavre d'un Chevalier de la Montagne Blanche repose à côté de lui. Les Squalls échangent des cris perçants et semblent tout à fait indifférents au sort de l'homme blessé qui visiblement agonise sous leurs yeux. Si vous souhaitez attaquer les Squalls, rendez-vous au 28. Si vous maîtrisez la Discipline Kaï de la Guérison ou si vous disposez d'une potion de guérison ou d'herbe de Laumspur, vous pouvez essayer de sauver la vie de l'homme blessé en vous rendant au 239.",
    "choix": [
      {
        "texte": "Si vous souhaitez attaquer les Squalls",
        "vers": "28"
      },
      {
        "texte": "Si vous maîtrisez la Discipline Kaï de la Guérison ou si vous disposez d'une potion de guérison ou d'herbe de Laumspur, vous pouvez essayer de sauver la vie de l'homme blessé en vous rendant",
        "vers": "239",
        "requis": {
          "auMoinsUn": [
            {
              "discipline": "guerison"
            },
            {
              "objet": "potion-guerison"
            },
            {
              "objet": "potion-guerison-3"
            },
            {
              "objet": "herbe-laumspur"
            },
            {
              "objet": "potion-laumspur"
            },
            {
              "objet": "laumspur-5"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "96",
    "texte": "Votre Sixième Sens vous indique que cet endroit est maléfique. Vous vous tenez devant la porte orange lorsque quelque chose soudain vous revient en mémoire. Rendez-vous au 112.",
    "suite": "112"
  },
  {
    "id": "97",
    "texte": "Vous avez remarqué qu'au cours de vos exercices d'entraînement au maniement du Glaive de Sommer, votre maîtrise de la Discipline Kaï du Sixième Sens s'est accrue : vous êtes à présent plus sensible que jamais et vous saviez déjà, bien avant qu'il ait parlé, quelle triste nouvelle Madin Rendalim allait vous annoncer. Sans nul doute, cette acuité exceptionnelle de votre Sixième Sens vous sera d'un grand secours lors de votre voyage de retour à Holmgard. Rendez-vous au 152.",
    "suite": "152"
  },
  {
    "id": "98",
    "texte": "Votre Sens de l'Orientation vous indique qu'il n'y a aucun sentier dans cette partie de la forêt de Durenor mais il vous permet de savoir quelle direction il convient de prendre. La forêt qui s'étend devant vous est si dense cependant qu'il vous sera impossible de la traverser à cheval. Vous allez donc être contraint d'abandonner votre monture devant la tour de guet, avant de poursuivre votre chemin. Si vous souhaitez vous mettre en route en direction de Port Bax, rendez-vous au 244. Si vous préférez entrer dans la tour de guet, rendez-vous au 115.",
    "choix": [
      {
        "texte": "Si vous souhaitez vous mettre en route en direction de Port Bax",
        "vers": "244"
      },
      {
        "texte": "Si vous préférez entrer dans la tour de guet",
        "vers": "115"
      }
    ]
  },
  {
    "id": "99",
    "texte": "Le lendemain matin, vous êtes réveillé par la vigie postée dans le nid- de-pie. « Navire par bâbord avant ! » annonce l'homme à grands cris. Vous grimpez une échelle étroite et vous rejoignez le capitaine qui se tient à la proue. « Vos yeux sont plus jeunes que les miens, dit-il en vous tendant une longue-vue ciselée, essayez de voir quel est ce bateau. » Vous distinguez alors à l'horizon les voiles rouges et le pavillon noir d'un navire de guerre mené par des pirates Lakuri. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous tirez un chiffre entre 0 et 4, rendez-vous au 326. Si vous tirez un 5, un 6, un 7, un 8 ou un 9, rendez-vous au 163.",
    "evenement": {
      "type": "jet-hasard-table",
      "branches": {
        "0-4": {
          "vers": "326"
        },
        "5-9": {
          "vers": "163"
        }
      }
    }
  },
  {
    "id": "100",
    "texte": "Un voile de brume s'est répandu sur la mer calme. Il vient des îles Kirlundin, un archipel rocheux situé au nord-est du Sommerlund. Des formes étranges et sombres apparaissent bientôt dans le brouillard ; elles grandissent peu à peu et quelques minutes plus tard, on parvient à en distinguer plus nettement les contours : ce sont des navires. « Branle-bas de combat ! » crie aussitôt l'amiral et son ordre est répété comme en écho sur tous les navires de la flotte de Durenor. « Tout le monde sur le pont ! » A mesure que les bateaux ennemis s'approchent dans le brouillard, un spectacle terrifiant vous frappe de stupeur : ce sont en effet des vaisseaux fantômes qui s'avancent vers vous, des épaves menées par les cadavres vivants de marins péris en mer. Et ces navires renfloués par quelque effrayant prodige de haute sorcellerie se préparent à combattre la flotte de Durenor. Soudain, la brume se dissipe et vous voyez distinctement les bateaux fantômes se disposer en ligne pour interdire l'entrée du golfe de Holm. Le vaisseau amiral de cette flotte maléfique a pris place au milieu de la rangée et fait voile vers vous, son rostre immense pointant à l'extrémité de sa proue noire. Un instant plus tard, le puissant éperon déchire la coque du Durenor et vous entendez la voix désespérée de l'amiral lancer un ordre : « Sauve qui peut ! Abandonnez le navire ! » Le Durenor à présent est encerclé par la flotte ennemie et sombre rapidement. Si vous souhaitez sauter sur le pont du vaisseau amiral de la flotte fantôme, rendez-vous au 30. Si vous préférez plonger dans la mer et tenter de gagner à la nage un autre navire de la flotte de Durenor, rendez-vous au 267.",
    "choix": [
      {
        "texte": "Si vous souhaitez sauter sur le pont du vaisseau amiral de la flotte fantôme",
        "vers": "30"
      },
      {
        "texte": "Si vous préférez plonger dans la mer et tenter de gagner à la nage un autre navire de la flotte de Durenor",
        "vers": "267"
      }
    ]
  },
  {
    "id": "101",
    "texte": "Vous vous précipitez à l'intérieur de la cabine du capitaine ; celui-ci lève les yeux de la carte qu'il était en train d'étudier et vous regarde d'un air surpris. « Le feu a pris dans la cale ! » Vous avez parlé d'une voix haletante, le souffle coupé d'avoir tant couru. Un instant plus tard, le capitaine est sorti de sa cabine et donne l'ordre à ses hommes de remplir des seaux d'eau et de rassembler des couvertures pour étouffer l'incendie. Lorsque vous atteignez la cale avant, la fumée s'est épaissie et, soudain, une véritable frénésie s'empare du navire : des flammes en effet viennent de jaillir du panneau d'écoutille. Il faut plus d'une heure pour maîtriser le feu et les dégâts sont considérables. Les vivres et les réserves d'eau douce étaient entreposés dans cette cale : il n'en reste plus rien ; de plus, la coque du navire a été endommagée. Le capitaine remonte de la cale enfumée et s'approche de vous, le visage noir de suie. Il porte un paquet sous son bras. «Je dois vous parler en privé, my lord», dit-il à voix basse. Sans dire un mot, vous le suivez jusqu'à sa cabine. Rendez-vous au 222.",
    "suite": "222"
  },
  {
    "id": "102",
    "texte": "Le tunnel de Tarnalin est une véritable merveille. Il fait plus de 30 mètres de hauteur et de largeur et traverse les montagnes de la chaîne d'Hammardal en donnant accès à la capitale. D'ordinaire, chariots et piétons s'y pressent, car c'est la voie obligée entre Port Bax et Hammardal. Mais lorsque vous y pénétrez, vous avez la surprise de constater qu'il est désert ; vous n'y découvrez qu'une carriole de fruits renversée sur la chaussée. La route qui s'enfonce dans les profondeurs du tunnel éclairé par des torches est vide et silencieuse. Et tandis que vous avancez sur la chaussée recouverte de pavés, un sentiment d'inquiétude vous saisit : et si les Monstres d'Enfer étaient arrivés à Tarnalin avant vous ? Vous marchez pendant une heure et vous arrivez alors à une bifurcation. Si vous souhaitez prendre la voie de gauche, rendez-vous au 64. Si vous préférez aller à droite, rendez-vous au 164. Enfin, si vous maîtrisez la Discipline Kaï du Sens de l'Orientation, rendez-vous au 325.",
    "choix": [
      {
        "texte": "Si vous souhaitez prendre la voie de gauche",
        "vers": "64"
      },
      {
        "texte": "Si vous préférez aller à droite",
        "vers": "164"
      },
      {
        "texte": "Enfin, si vous maîtrisez la Discipline Kaï du Sens de l'Orientation",
        "vers": "325",
        "requis": {
          "discipline": "orientation"
        }
      }
    ]
  },
  {
    "id": "103",
    "texte": "Le Laumspur est une herbe délicieuse très recherchée d'un bout à l'autre des Fins de Terre en raison de ses vertus curatives. Vous en avez ramassé l'équivalent d'un Repas et ce Repas vous rendra 3 points d'ENDURANCE lorsque vous le prendrez (inscrivez sur votre Feuille d'Aventure votre moisson de Laumspur). Vous enveloppez soigneusement l'herbe que vous venez de ramasser et vous retournez dans la diligence en compagnie des autres voyageurs. Rendez-vous au 249.",
    "effets": {
      "objets": [
        {
          "id": "herbe-laumspur"
        }
      ]
    },
    "suite": "249"
  },
  {
    "id": "104",
    "texte": "Les pêcheurs vous regardent bouche bée comme si vous étiez revenu d'entre les morts. Puis soudain l'un d'eux renverse la table d'un coup de pied et s'enfuit avec les autres de la taverne par la porte de derrière. D'un bond, vous sautez par-dessus la table pour vous lancer à leur poursuite dans l'obscurité de la nuit. Si vous souhaitez continuer à les poursuivre, rendez-vous au 231. Si vous préférez les laisser partir, rendez-vous au 177.",
    "choix": [
      {
        "texte": "Si vous souhaitez continuer à les poursuivre",
        "vers": "231"
      },
      {
        "texte": "Si vous préférez les laisser partir",
        "vers": "177"
      }
    ]
  },
  {
    "id": "105",
    "texte": "Malheureusement pour vous, la corde a été presque coupée en deux par un coup d'épée et il faut craindre qu'elle ne casse sous votre poids. Utilisez la Table de Hasard pour obtenir un chiffre qui vous indiquera si la corde a tenu bon ou pas. Si vous tirez un chiffre entre 0 et 4, rendez-vous au 286. De 5 à 9, rendez-vous au 120.",
    "evenement": {
      "type": "jet-hasard-table",
      "branches": {
        "0-4": {
          "vers": "286"
        },
        "5-9": {
          "vers": "120"
        }
      }
    }
  },
  {
    "id": "106",
    "texte": "La lance sculptée est en métal et pourtant elle est aussi légère que si elle avait été taillée dans du bois. Vous remarquez que la hampe est gravée de caractères runiques et de symboles magiques. Vous la retirez avec précaution de la poitrine de l'homme blessé qui pousse un long soupir de soulagement. Vous vous apprêtez ensuite à examiner sa blessure lorsqu'une subite douleur vous déchire la tête. Vous avez si mal que vous vous écroulez sur le sol en perdant 2 points d'ENDURANCE. Vous êtes alors stupéfait de voir l'homme se relever d'un bond, mais votre surprise se change en horreur quand soudain il se métamorphose devant vos yeux. La peau de son visage se convulsé et change de couleur ; elle prend une teinte de plus en plus sombre et se ratatine en se décomposant à vue d'œil. Le crâne de l'homme apparaît, ses yeux s'enflamment d'une lueur rouge et brillante et de longs crocs jaillissent de sa mâchoire. La terreur vous saisit à la gorge lorsque vous comprenez enfin que cette créature est en réalité un MONSTRE D'ENFER, un de ces effroyables serviteurs des Maîtres des Ténèbres. Le monstre vous attaque en se servant de sa puissante Force Mentale et, si vous ne maîtrisez pas la Discipline Kaï du Bouclier Psychique, vous perdrez 2 points d'ENDURANCE supplémentaires à chaque assaut mené contre lui au cours du combat. La créature est invulnérable aux armes ordinaires et à la Discipline Kaï de la Puissance Psychique. Vous ne pouvez la blesser qu'à l'aide de la Lance Magique, celle-là même qui était fichée dans sa poitrine. MONSTRE D'ENFER HABILETÉ: 22 ENDURANCE:30 Il vous est impossible de prendre la fuite et vous devrez poursuivre ce combat jusqu'à la mort de l'un des deux adversaires. Si vous êtes vainqueur, vous aurez le droit de conserver la lance. Inscrivez-la dans ce cas sur votre Feuille d'Aventure dans la case Lance Magique de la section Objets Spéciaux. Rendez-vous ensuite au 320.",
    "effets": {
      "endurance": -2,
      "objets": [
        {
          "id": "lance-magique"
        }
      ]
    },
    "combat": {
      "nom": "Monstre d'Enfer",
      "habilete": 22,
      "endurance": 30,
      "immunisePsychique": true,
      "degatsPsychiquesParAssaut": 2,
      "armeSpeciale": "lance-magique"
    },
    "suite": "320"
  },
  {
    "id": "107",
    "texte": "Le capitaine donne l'ordre d'aborder le navire marchand et une vision d'horreur s'offre alors à vous : des cadavres de marins jonchent le pont, nombre d'entre eux ont le corps percé de flèches et il semble qu'ils ont dû livrer un combat désespéré pour sauver leur cargaison; les cales du navire sont vides, cependant, tout a été emporté. En descendant sur le pont inférieur, vous découvrez le capitaine dans sa cabine ; il est grièvement blessé et sa fin est proche. Si vous maîtrisez la Discipline Kaï de la Guérison, rendez-vous au 74. Sinon, rendez-vous au 294.",
    "choix": [
      {
        "vers": "74",
        "texte": "Si la condition du texte est remplie",
        "requis": {
          "discipline": "guerison"
        }
      },
      {
        "vers": "294",
        "texte": "Dans le cas contraire",
        "requis": {
          "non": {
            "discipline": "guerison"
          }
        }
      }
    ]
  },
  {
    "id": "108",
    "texte": "L'une des roues se coince dans une ornière et trois de ses gros rayons de bois se brisent sous le choc. Il vous faut interrompre votre voyage et remplacer la roue avant de pouvoir repartir vers Port Bax. Vous vous proposez d'aider le conducteur en soulevant la diligence à l'aide d'un levier, puis en plaçant un petit tronc d'arbre sous l'essieu afin qu'on puisse glisser la nouvelle roue sur son axe. Vous pesez de tout votre poids sur la grosse branche qui fait office de levier lorsque les chevaux se cabrent soudain puis s'élancent en avant. La branche aussitôt se détend comme un ressort et vous frappe en plein visage en vous projetant à terre. Vous êtes à moitié assommé et vous perdez 2 points d'ENDURANCE. Le conducteur a moins de chance que vous car la diligence lui a passé sur le corps. Le malheureux meurt dans vos bras après avoir réussi, dans un ultime effort, à vous murmurer ces quelques mots à l'oreille: « Pas... un accident... j'ai vu... ». Si vous maîtrisez la Discipline Kaï du Sixième Sens, rendez-vous au 343. Sinon, rendez- vous au 168.",
    "effets": {
      "endurance": -2
    },
    "choix": [
      {
        "vers": "343",
        "texte": "Si la condition du texte est remplie",
        "requis": {
          "discipline": "sixieme-sens"
        }
      },
      {
        "vers": "168",
        "texte": "Dans le cas contraire",
        "requis": {
          "non": {
            "discipline": "sixieme-sens"
          }
        }
      }
    ]
  },
  {
    "id": "109",
    "texte": "Vous battez des paupières pour chasser l'eau de vos yeux et vous constatez alors que le vaisseau amiral de la flotte fantôme est en flammes. Une fumée noire s'échappe de ses ponts et des langues de feu orange et jaunes jaillissent de sa coque moisie. Hélas, vous n'avez guère le loisir de contempler ce spectacle réconfortant ; soudain, en effet, vous entendez un battement d'ailes au-dessus de votre tête : c'est un Kraan qui fond sur vous en essayant de vous saisir entre ses serres pointues. Il parvient à refermer ses griffes crochues sur l'étoffe de votre cape et vous vous sentez aussitôt emporté dans les airs. Le vol cependant est de courte durée, car vous dégainez le Glaive de Sommer et vous en plongez la lame dans le ventre flasque de la créature. Avec un cri de douleur, le Kraan lâche prise et vous retombez en priant le ciel que votre chute ne soit pas trop douloureuse. Rendez-vous au 120.",
    "suite": "120"
  },
  {
    "id": "110",
    "texte": "Le GARDE ne vous croit pas et se rue sur vous, son épée à la main. GARDE DE LA TOUR HABILETÉ: 15 ENDURANCE: 22 Si vous ne possédez pas d'arme, retranchez 4 points de votre total d'habileté pendant toute la durée du combat. Vous pouvez prendre la fuite à tout moment en vous rendant au 65. Si vous décidez de vous battre et que vous êtes vainqueur, rendez-vous au 331.",
    "combat": {
      "nom": "Garde de la tour",
      "habilete": 15,
      "endurance": 22,
      "fuite": [
        {
          "texte": "Prendre la fuite",
          "vers": "65"
        }
      ]
    },
    "suite": "331"
  },
  {
    "id": "111",
    "texte": "A contrecœur, les gardes baissent les armes et vous autorisent à franchir le pont. Au moment où vous passez devant eux, ils vous fixent du regard puis se chuchotent quelques mots à l'oreille. Dès que vous avez franchi le chenal de Ryner, vous vous hâtez de poursuivre votre chemin, de peur qu'ils ne changent d'avis et vous arrêtent. Au bout d'une heure de marche sur la route qui traverse la forêt, vous arrivez à un croisement où un poteau de signalisation indique la direction de l'est : PORT BAX 5 km. Vous souriez et vous suivez la flèche : dans une heure tout au plus, vous devriez être arrivé à destination. Rendez-vous au 265.",
    "suite": "265"
  },
  {
    "id": "112",
    "texte": "Vous vous rappelez soudain ce qu'il vous a dit au sujet de la boutique à la porte orange. C'est le Quartier Général de la Fraternité du Silence, la célèbre police secrète de Lachelan. Entrer dans cette boutique serait plus dangereux encore que de pénétrer dans une pièce remplie de Drakkarim ! Vous vous détournez aussitôt de la porte orange et vous vous hâtez en direction du nord. Rendez-vous au 230.",
    "suite": "230"
  },
  {
    "id": "113",
    "texte": "Lorsque Banedon vous a donné le Pendentif à l'Etoile de Cristal, il vous a parlé de cet homme : c'est Vonotar le Traître - un sorcier renégat de la Guilde des Magiciens de Toran. Il est passé maître dans l'art de la magie noire et les Maîtres des Ténèbres en personne l'ont investi d'un grand pouvoir. Ce sont ses agents qui ont essayé de vous tuer au cours de votre mission et c'est lui qui commande la flotte des vaisseaux fantômes. Si vous anéantissez Vonotar, vous anéantirez par là même la force maléfique qui donne son pouvoir à la flotte des bateaux fantômes et à son équipage. Vous pouvez grimper en haut de la tour et attaquer Vonotar en vous rendant au 73. Si vous préférez ne pas risquer votre vie en vous mesurant à ce puissant magicien, fuyez ce navire en sautant par-dessus bord et rendez-vous au 267.",
    "choix": [
      {
        "texte": "Vous pouvez grimper en haut de la tour et attaquer Vonotar en vous rendant",
        "vers": "73"
      },
      {
        "texte": "Si vous préférez ne pas risquer votre vie en vous mesurant à ce puissant magicien, fuyez ce navire en sautant par-dessus bord et",
        "vers": "267"
      }
    ]
  },
  {
    "id": "114",
    "texte": "Vous avez marché pendant trois heures sur cette route déserte qui longe la côte lorsque la nuit commence à tomber. Les terres alentour sont plates et désolées et vous n'avez pas vu signe de vie depuis que vous vous êtes mis en chemin. Vous décidez alors de prendre quelque repos à l'abri des branches d'un grand arbre qui s'élève au bord de la route. Vous posez votre tête sur votre Sac à Dos en guise d'oreiller, vous vous couvrez de votre cape de Seigneur Kaï et vous vous laissez emporter dans un profond sommeil. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous tirez un chiffre entre 0 et 3, rendez-vous au 206. Entre 4 et 7, rendez-vous au 63. Si vous tirez 8 ou 9, rendez-vous au 8.",
    "evenement": {
      "type": "jet-hasard-table",
      "branches": {
        "0-3": {
          "vers": "206"
        },
        "4-7": {
          "vers": "63"
        },
        "8-9": {
          "vers": "8"
        }
      }
    }
  },
  {
    "id": "115",
    "texte": "Devant la porte de la tour de guet, la végétation a été arrachée et le sol bien tassé par de nombreux passages. Vous êtes en train de chercher un trou de serrure sur cette porte à l'armature de fer lorsqu'elle s'ouvre soudain. Un Chevalier de la Montagne Blanche se tient devant vous, son épée levée face à son visage. « Exposez le but de votre visite et parlez sans détour. Si vous mentez, je vous répondrai par le glaive. » Si vous souhaitez révéler au chevalier le véritable but de votre voyage à Durenor, rendez-vous au 80. Si vous voulez lui mentir, rendez-vous au 324. Si enfin vous préférez tirer votre épée et l'attaquer, rendez-vous au 162.",
    "choix": [
      {
        "texte": "» Si vous souhaitez révéler au chevalier le véritable but de votre voyage à Durenor",
        "vers": "80"
      },
      {
        "texte": "Si vous voulez lui mentir",
        "vers": "324"
      },
      {
        "texte": "Si enfin vous préférez tirer votre épée et l'attaquer",
        "vers": "162"
      }
    ]
  },
  {
    "id": "116",
    "texte": "Grâce à la Discipline Kaï, vous n'avez aucune difficulté à découvrir sous quelle tasse la bille est cachée, car pour vous l'argile est aussi transparente que le verre. Utilisez la Table de Hasard pour obtenir un chiffre et ajoutez-y 5. Vous saurez ainsi combien de Pièces d'Or vous avez gagnées avant que le fripon vous soupçonne et mette fin au jeu. Votre bourse est à nouveau remplie et vous retournez au bar où vous payez le prix d'une chambre, soit une Pièce d'Or. Rendez-vous au 314.",
    "evenement": {
      "type": "jet-hasard-table",
      "branches": {
        "0-0": {
          "or": 5,
          "coutOr": 1
        },
        "1-1": {
          "or": 6,
          "coutOr": 1
        },
        "2-2": {
          "or": 7,
          "coutOr": 1
        },
        "3-3": {
          "or": 8,
          "coutOr": 1
        },
        "4-4": {
          "or": 9,
          "coutOr": 1
        },
        "5-5": {
          "or": 10,
          "coutOr": 1
        },
        "6-6": {
          "or": 11,
          "coutOr": 1
        },
        "7-7": {
          "or": 12,
          "coutOr": 1
        },
        "8-8": {
          "or": 13,
          "coutOr": 1
        },
        "9-9": {
          "or": 14,
          "coutOr": 1
        }
      }
    },
    "suite": "314"
  },
  {
    "id": "117",
    "texte": "C'est une de ces grosses diligences, semblables à celles qui transportent les voyageurs de grand chemin au royaume du Sommerlund. Le cocher tire les rênes et arrête ses chevaux en vous observant de sous le large bord de son chapeau. Vous lui demandez où il va. « Nous allons à Ragadorn, répond-il ; nous arriverons là-bas vers midi. Il vous en coûtera 3 Couronnes pour un billet mais vous pouvez voyager sur le toit pour une Couronne seulement. » Si vous souhaitez voyager à l'intérieur de la diligence, payez 3 Couronnes au cocher et rendez-vous au 37. Si vous préférez voyager sur le toit, donnez-lui 1 Couronne et rendez-vous au 148. Enfin, si vous n'avez pas de quoi payer le voyage, vous n'aurez plus qu'à laisser repartir la diligence et à continuer à pied ; rendez-vous dans ce cas au 292.",
    "choix": [
      {
        "texte": "» Si vous souhaitez voyager à l'intérieur de la diligence, payez 3 Couronnes au cocher et",
        "vers": "37",
        "requis": {
          "or": 3
        },
        "effets": {
          "or": -3
        }
      },
      {
        "texte": "Si vous préférez voyager sur le toit, donnez-lui 1 Couronne et",
        "vers": "148",
        "requis": {
          "or": 1
        },
        "effets": {
          "or": -1
        }
      },
      {
        "texte": "Enfin, si vous n'avez pas de quoi payer le voyage, vous n'aurez plus qu'à laisser repartir la diligence et à continuer à pied",
        "vers": "292",
        "requis": {
          "orMax": 0
        }
      }
    ]
  },
  {
    "id": "118",
    "texte": "Vous dites adieu à Rhygar et vous entrez dans le tunnel de Tarnalin. D'une largeur et d'une hauteur de 30 mètres environ, le tunnel traverse les montagnes de la chaîne d'Hammardal et permet d'accéder à la capitale. Des torches l'éclairent sur toute sa longueur et les marchands sont nombreux à l'emprunter car c'est la seule voie qui relie Port Bax à Hammardal. D'ordinaire, la circulation y est intense mais vous constatez avec surprise qu'il est désert au moment où vous y pénétrez ; vous n'y trouvez qu'une carriole de fruits renversée sur la chaussée. Vous continuez à avancer dans le tunnel et un doute alors vous saisit: les Monstres d'Enfer seraient-ils arrivés avant vous ? Au bout d'une heure de marche, vous apercevez une étrange créature perchée sur le toit d'un chariot au milieu de la chaussée. L'animal mesure une soixantaine de centimètres de haut et ressemble à un rat géant. Vous pensez qu'il s'agit là d'un rongeur qui a établi ses quartiers dans le tunnel, mais vous remarquez en vous approchant que la créature porte une magnifique veste de cuir en patchwork et qu'elle tient une lance dans sa patte. L'animal se tourne soudain vers vous lorsqu'il entend vos pas. Les moustaches de son museau frémissent tandis qu'il renifle alentour et ses yeux scrutent l'obscurité. Dès qu'il vous voit, il prend la fuite et disparaît dans un tunnel plus petit situé à votre gauche. Si vous voulez suivre cette créature, rendez-vous au 23. Si vous préférez la laisser filer sans vous en soucier et poursuivre votre chemin, rendez- vous au 340. Si vous maîtrisez la Discipline Kaï de la Communication animale, rendez-vous au 279.",
    "choix": [
      {
        "texte": "Si vous voulez suivre cette créature",
        "vers": "23"
      },
      {
        "texte": "Si vous préférez la laisser filer sans vous en soucier et poursuivre votre chemin",
        "vers": "340"
      },
      {
        "texte": "Si vous maîtrisez la Discipline Kaï de la Communication animale",
        "vers": "279",
        "requis": {
          "discipline": "communication-animale"
        }
      }
    ]
  },
  {
    "id": "119",
    "texte": "Des débris de bois, des planches, des madriers et des voiles déchirées flottent sur les vagues parsemées d'écume. C'est là tout ce qui reste d'un navire marchand. Mais soudain, vous apercevez un homme cramponné à un panneau d'écoutille. Une échelle de corde lui est aussitôt jetée et le malheureux est ramené à bord. « Les pirates ! » dit-il simplement avant de s'écrouler sur le pont, à bout de force. Après qu'on l'a enveloppé dans une couverture, l'homme est emmené dans une cabine. Il a reçu de nombreuses blessures et sa fin est proche. « Voici un forfait qui porte la signature des pirates Lakuri, vous confie le capitaine, mais il est rare qu'on les croise dans ces eaux ; ils doivent être sur la piste d'un riche butin pour s'être ainsi éloignés de leurs îles tropicales. » Et tandis que votre navire reprend sa route en direction de Durenor, vous ne pouvez vous empêcher de penser que ce « riche butin » pourrait bien être vous- même. Rendez-vous au 240.",
    "suite": "240"
  },
  {
    "id": "120",
    "texte": "La chance est avec vous ; vous atterrissez en effet sans dommage sur le pont du Kalkarm, un vaisseau de guerre de la flotte de Durenor. Les marins y ont livré un rude combat dont ils sont sortis vainqueurs et ils sont occupés pour le moment à détacher les grappins que leur avait lancés l'un des bateaux fantômes. Emergeant d'un nuage de fumée, Lord Axim apparaît ; son visage est ensanglanté et son bouclier porte la trace de coups violents. « Dieu merci, vous êtes vivant, Loup Solitaire. La bataille a été sans merci et nos pertes sont élevées, mais de vous voir debout devant moi me met quelque baume au cœur », dit-il en vous prenant par le bras pour vous emmener près du bastingage. « Regardez là-bas, poursuit-il, leur vaisseau amiral est en feu. » A travers la brume noirâtre provoquée par la bataille, vous distinguez l'énorme vaisseau fantôme qui sombre sous un panache d'épaisse fumée. Pendant ce temps les marins du Kalkarm ont réussi à détacher leur navire du bateau fantôme qui les avait abordés et à l'éloigner des débris parsemant la mer alentour. Un vent se lève qui enfle les voiles déchirées et dissipe la fumée des combats. Lord Axim ordonne bientôt que soit hissé le pavillon aux Armes Royales de Durenor afin que les autres navires rescapés puissent rallier le Kalkarm. Pour la première fois depuis le début de la bataille, vous pouvez distinguer les autres navires de la flotte de Durenor et une vision stupéfiante s'offre alors à vous car, à présent que le vaisseau amiral de la flotte ennemie a sombré dans les flots, tous les autres bateaux fantômes retournent au fond de la mer d'où les avait tirés la magie des Maîtres des Ténèbres. « Le charme est rompu, dit Lord Axim, et nous avons remporté la victoire. » Quelques minutes plus tard, il ne reste plus un seul vaisseau fantôme à la surface de la mer. Rendez-vous au 225.",
    "suite": "225"
  },
  {
    "id": "121",
    "texte": "Vous courez le long de la rue de la Vigie et vous atteignez bientôt le quai, là où le fleuve Dorn sépare les parties Est et Ouest de la ville. A votre gauche, vous apercevez le pont de Ragadorn, un ouvrage d'une grande laideur dont le fer a rouillé et qui constitue le seul point de passage entre les deux moitiés de Ragadorn. Les cris des voleurs retentissent encore à vos oreilles tandis que vous vous frayez un chemin parmi la foule qui encombre le pont. Mais, lorsque vous êtes parvenu de l'autre côté, les voleurs ont abandonné la poursuite et vous vous engagez dans une large avenue qui porte le nom de boulevard du Commerce, section Est. Rendez-vous au 186.",
    "suite": "186"
  },
  {
    "id": "122",
    "texte": "Cette rue longe les murs de la ville en direction du nord. Sur votre droite, vous remarquez une boutique dont la porte est de couleur orange. A la différence des autres boutiques de la rue, celle-ci ne porte aucune enseigne. C'est alors que vous revient en mémoire le récit qu'un Seigneur Kaï vous avait fait il y a environ un an à son retour d'un voyage dans la ville de Ragadorn. Il vous avait parlé de cette porte orange à plusieurs reprises. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous tirez un chiffre entre 0 et 4, rendez-vous au 46. Entre 5 et 9, rendez-vous au 112. Si vous maîtrisez la Discipline Kaï du Sixième Sens, rendez-vous au 96.",
    "evenement": {
      "type": "jet-hasard-table",
      "branches": {
        "0-4": {
          "vers": "46"
        },
        "5-9": {
          "vers": "112"
        }
      },
      "requis": {
        "non": {
          "discipline": "sixieme-sens"
        }
      }
    },
    "choix": [
      {
        "vers": "96",
        "texte": "Utiliser le Sixième Sens",
        "requis": {
          "discipline": "sixieme-sens"
        }
      }
    ]
  },
  {
    "id": "123",
    "texte": "Une étrange énergie anime votre corps. Instinctivement, vous levez le glaive au-dessus de votre tête et un rayon de soleil vient frapper l'extrémité de la lame d'où jaillit aussitôt une lumière blanche aveuglante. Un instant plus tard, cependant, la lumière s'évanouit et vous sentez peser sur votre épaule la main de Lord Axim. « Venez, Loup Solitaire, dit-il, il y a encore beaucoup à faire pour préparer votre retour au Royaume du Sommerlund. » Vous rengainez le glaive dans son fourreau incrusté de pierreries et vous suivez Lord Axim qui vous entraîne hors de la chambre du roi. Rendez-vous au 40.",
    "suite": "40"
  },
  {
    "id": "124",
    "texte": "Vous la fouillez mais vous ne découvrez aucune preuve qu'elle était bien celle qui voulait vous assassiner. Vous trouvez sur elle 42 Pièces d'Or, un Sabre et un Poignard. Prenez ce que vous voulez parmi ces objets si le cœur vous en dit et le cas échéant, inscrivez-les sur votre Feuille d'Aventure. Rendez-vous ensuite au 33.",
    "evenement": {
      "type": "interaction",
      "interaction": {
        "type": "butin",
        "offres": [
          {
            "or": 42
          },
          {
            "id": "sabre",
            "quantity": 1
          },
          {
            "id": "poignard",
            "quantity": 1
          }
        ]
      }
    },
    "suite": "33"
  },
  {
    "id": "125",
    "texte": "Vous vous précipitez par la porte latérale de la taverne et vous courez tout au long d'une ruelle qui aboutit à la place principale. Vous apercevez, au-delà de la foule qui se presse en tous sens, de nombreux bateaux amarrés aux quais. Les brigands vous suivent de près et il vous faut agir vite, sinon ils vous tueront comme ils ont sans doute tué Ronan. Vous défaites alors l'amarre d'un canot puis vous sautez du quai et vous atterrissez lourdement dans l'embarcation, en fracassant dans votre chute le petit siège de bois aménagé au milieu. Vous trouvez une rame au fond du canot et vous pagayez ferme pour rejoindre le Sceptre Vert qui mouille à 300 mètres de là. Rendez-vous au 300.",
    "suite": "300"
  },
  {
    "id": "126",
    "texte": "L'homme tire sur la corde d'une clochette dissimulée aux regards et, soudain, quatre gardes armés font irruption dans la pièce. « Ces documents sont des faux. Vous êtes sans aucun doute un espion, peut- être même pire. Quoi qu'il en soit, vous n'allez pas tarder à apprendre ce que nous faisons des criminels dans votre genre, à Port Bax. Emmenez-le ! » Avant que vous n'ayez pu fournir la moindre explication, les gardes vous saisissent et vous emmènent à la prison de la ville. Tout votre équipement est confisqué, y compris les Objets Spéciaux et les armes, et on vous jette dans une cellule remplie de canailles à l'aspect patibulaire. Vous remarquez aussitôt que plusieurs de ces fripons portent au poignet gauche un tatouage qui représente un serpent : c'est le signe de Vonatar le Traître. Et lorsque, enfin, les gardes découvrent votre véritable identité en examinant votre équipement, il est trop tard : les séides du sorcier vous ont déjà étranglé. Votre mission s'achève donc tragiquement en même temps que votre vie dans un cul-de-basse-fosse de Port Bax.",
    "fin": "mort",
    "nomFin": "Fin de la mission — §126"
  },
  {
    "id": "127",
    "texte": "Vous vous éveillez à l'aube, au son de la pluie qui tombe à verse sur les pavés de la rue. Il y a maintenant six jours que vous avez quitté Holmgard et il vous faut prendre un repas, sinon vous perdrez 3 points d'ENDURANCE. Vous rassemblez ensuite vos affaires et vous quittez la pièce. Tandis que vous descendez l'escalier branlant, vous apercevez l'aubergiste qui est en train de nettoyer le carrelage à l'aide d'une serpillière. Si vous voulez demander à l'aubergiste quel chemin prendre pour gagner Durenor, rendez-vous au 217. Si vous préférez quitter les lieux sans lui adresser la parole, rendez-vous au 143.",
    "effets": {
      "repasObligatoire": true
    },
    "choix": [
      {
        "texte": "Si vous voulez demander à l'aubergiste quel chemin prendre pour gagner Durenor",
        "vers": "217"
      },
      {
        "texte": "Si vous préférez quitter les lieux sans lui adresser la parole",
        "vers": "143"
      }
    ]
  },
  {
    "id": "128",
    "texte": "Une lueur dorée parcourt la lame du Glaive lorsque vous le levez au- dessus de votre tête pour faire face à l'ennemi. Vous êtes attaqué par six ZOMBIES terrifiants que vous devez combattre en les considérant comme un seul et même adversaire. LES ZOMBIES HABILETÉ : 13 ENDURANCE : 19 Ce sont des morts vivants et la puissance du Glaive de Sommer vous permet donc de multiplier par deux tous les point d'ENDURANCE qu'ils perdront au cours du combat. Ils restent cependant insensibles à la Discipline Kaï de la Puissance Psychique. Si vous êtes vainqueur, rendez-vous au 237.",
    "combat": {
      "nom": "Zombies",
      "habilete": 13,
      "endurance": 19,
      "immunisePsychique": true,
      "vulnerableGlaiveSommer": true
    },
    "suite": "237"
  },
  {
    "id": "129",
    "texte": "Vous passez devant plusieurs entrepôts alignés sur le quai et vous arrivez au mur d'enceinte du port. Là, le chemin que vous suivez tourne brusquement à droite pour aboutir dans la rue du Tombeau. Quatre gardes en armes marchent au milieu de la rue. Vous ne voulez pas prendre le risque d'être interpellé et arrêté par ces soldats et vous vous réfugiez dans une ruelle en cul-de-sac, à votre droite. Mais soudain les gardes s'immobilisent à l'entrée de la ruelle. Il suffirait que l'un d'eux tourne la tête dans votre direction pour que vous soyez immédiatement repéré. Cherchant une issue, vous apercevez derrière vous une fenêtre ouverte : un coup d'oeil à l'intérieur vous permet de distinguer la salle comble d'une taverne. Il n'y a pas à hésiter: en un instant, vous enjambez le rebord de la fenêtre et vous entrez dans la taverne. Rendez- vous au 4.",
    "suite": "4"
  },
  {
    "id": "130",
    "texte": "Le moine qui voyageait en votre compagnie dans la diligence s'est approché de vous. « Vous avez besoin de vous reposer, comme nous tous, dit-il, je comprends votre embarras, mon fils; aussi permettez-moi de mettre en pratique ce que je m'efforce de prêcher. » Il vous conduit alors au bar puis dépose une Pièce d'Or dans la main de l'aubergiste. « Veuillez donner une chambre à mon ami », dit-il avec un sourire. Rendez-vous au 314.",
    "suite": "314"
  },
  {
    "id": "131",
    "texte": "Vous leur demandez ce qu'ils vous veulent. Pour toute réponse, ils tirent tous trois d'une poche de leur veste de longs poignards à la lame recourbée. Leur chef fait alors un pas en avant et vous ordonne de lui donner votre or. Comme vous hésitez, il crie : « A l'attaque ! » et les trois VOLEURS bondissent aussitôt sur vous. Si vous ne disposez d'aucune arme, retranchez 4 points de votre total d'HABILETÉ et combattez-les à mains nues. Il vous faut les affronter un par un. HABILETÉ ENDURANCE Chef VOLEUR 15 23 1er VOLEUR 13 21 2e VOLEUR 13 20 Vous pouvez prendre la fuite au cours du combat en vous rendant au 121. Si vous parvenez à tuer les trois voleurs, rendez-vous au 301.",
    "combat": {
      "nom": "Chef Voleur",
      "habilete": 15,
      "endurance": 23,
      "fuite": [
        {
          "texte": "Prendre la fuite",
          "vers": "121"
        }
      ]
    },
    "suite": "131-b"
  },
  {
    "id": "131-b",
    "texte": "Suite du combat du §131 : adversaire 2 sur 3.",
    "combat": {
      "nom": "Voleur",
      "habilete": 13,
      "endurance": 21,
      "fuite": [
        {
          "texte": "Prendre la fuite",
          "vers": "121"
        }
      ]
    },
    "suite": "131-c"
  },
  {
    "id": "131-c",
    "texte": "Suite du combat du §131 : adversaire 3 sur 3.",
    "combat": {
      "nom": "Voleur",
      "habilete": 13,
      "endurance": 20,
      "fuite": [
        {
          "texte": "Prendre la fuite",
          "vers": "121"
        }
      ]
    },
    "suite": "301"
  },
  {
    "id": "132",
    "texte": "Vous atterrissez dans la rue boueuse au milieu d'une pluie de verre brisé. La chute vous a quelque peu secoué mais vous êtes indemne. Un villageois furieux, armé d'une matraque, essaie de vous fracasser le crâne, mais vous roulez sur vous-même et vous vous relevez d'un bond ; avant qu'il ait eu le temps de vous atteindre, vous êtes déjà en train de courir le long de la rue sinueuse ; vous n'êtes pas au bout de vos peines cependant, car un Squall à cheval se précipite sur vous, sa lance levée. Il s'apprête à vous frapper lorsque vous faites un pas de côté qui vous permet d'éviter le coup. Vous saisissez alors la hampe de son arme et vous déséquilibrez le Squall qui glisse de sa selle. Si vous souhaitez frapper le Squall à l'aide de sa propre lance, rendez-vous au 317. Si vous préférez vous emparer de son cheval pour prendre la fuite, rendez- vous au 150. Si vous décidez de garder la lance, n'oubliez pas de l'inscrire sur votre Feuille d'Aventure.",
    "evenement": {
      "type": "interaction",
      "interaction": {
        "type": "butin",
        "offres": [
          {
            "id": "lance",
            "quantity": 1
          }
        ]
      }
    },
    "choix": [
      {
        "texte": "Si vous souhaitez frapper le Squall à l'aide de sa propre lance",
        "vers": "317"
      },
      {
        "texte": "Si vous préférez vous emparer de son cheval pour prendre la fuite",
        "vers": "150"
      }
    ]
  },
  {
    "id": "133",
    "texte": "Vous regardez le marin droit dans les yeux et vous concentrez votre Puissance Psychique sur sa main ouverte. Soudain, l'homme tombe de sa chaise en se tenant la main et en hurlant comme s'il venait de saisir des charbons ardents. Lorsque vous lui expliquez que seul votre pouvoir a provoqué cette douleur, il vous contemple d'un air stupéfait. Rendez-vous au 268.",
    "suite": "268"
  },
  {
    "id": "134",
    "texte": "Un cri à vous glacer le sang jaillit tout à coup de l'obscurité et vous vous retrouvez face à un Monstre d'Enfer aux yeux étincelants. Ses mains vous attrapent à la gorge et il essaie de vous étrangler; dans un hurlement de terreur, vous tombez à terre : l'immonde créature déchire alors votre tunique de ses doigts noirs aux griffes crochues. Si vous possédez une Lance Magique, rendez-vous au 38. Sinon, rendez-vous au 304.",
    "choix": [
      {
        "vers": "38",
        "texte": "Si la condition du texte est remplie",
        "requis": {
          "objet": "lance-magique"
        }
      },
      {
        "vers": "304",
        "texte": "Dans le cas contraire",
        "requis": {
          "non": {
            "objet": "lance-magique"
          }
        }
      }
    ]
  },
  {
    "id": "135",
    "texte": "«Voici votre abri», dit le chevalier d'un ton bourru en montrant du doigt les bois qui s'étendent derrière vous. Avant que vous ayez pu répondre quoi que ce soit, il fait un pas en arrière et ferme à clé la lourde porte de la tour. La forêt qu'il vous a montrée est très dense; des herbes et des buissons d'épines s'enchevêtrent dans les sous-bois et il faut renoncer à y pénétrer à cheval. Il ne vous reste donc plus qu'à abandonner votre monture et à poursuivre votre route à pied. Rendez-vous au 244.",
    "suite": "244"
  },
  {
    "id": "136",
    "texte": "« Il vous en coûtera 20 Couronnes pour vous rendre à Port Bax », lance le cocher qui s'exprime avec un fort accent de Ragadorn. Si vous possédez ces 20 Couronnes et que vous souhaitez acheter un billet, rendez-vous au 10. Si vous n'avez pas assez d'argent, rendez-vous au 238.",
    "choix": [
      {
        "texte": "Si vous possédez ces 20 Couronnes et que vous souhaitez acheter un billet",
        "vers": "10",
        "requis": {
          "or": 20
        },
        "effets": {
          "or": -20
        }
      },
      {
        "texte": "Si vous n'avez pas assez d'argent",
        "vers": "238",
        "requis": {
          "orMax": 19
        }
      }
    ]
  },
  {
    "id": "137",
    "texte": "Vous arrivez à un croisement ; la rue du Mendiant tourne en direction du sud et aboutit à la rue du Chevalier Noir. Quelques mètres plus loin, une autre voie, la rue de l'Ancre, mène en direction de l'est. La pluie tombe de plus en plus dru, à présent. Si vous souhaitez aller vers le sud le long de la rue du Chevalier Noir, rendez-vous au 259. Si vous préférez suivre la rue de l'Ancre en direction de l'est, rendez-vous au 20.",
    "choix": [
      {
        "texte": "Si vous souhaitez aller vers le sud le long de la rue du Chevalier Noir",
        "vers": "259"
      },
      {
        "texte": "Si vous préférez suivre la rue de l'Ancre en direction de l'est",
        "vers": "20"
      }
    ]
  },
  {
    "id": "138",
    "texte": "Au bout d'une heure de marche, vous atteignez le sommet d'une colline. Devant vous s'étend la forêt de Durenor. La route s'oriente vers l'est et s'enfonce sous les arbres à proximité d'une grande tour de bois. Vous apercevez devant la tour un soldat en faction. Si vous voulez poursuivre votre chemin en direction de la tour, rendez-vous au 232. Si vous préférez éviter le garde, faites un large détour et pénétrez dans la forêt plus loin au sud en vous rendant au 244.",
    "choix": [
      {
        "texte": "Si vous voulez poursuivre votre chemin en direction de la tour",
        "vers": "232"
      },
      {
        "texte": "Si vous préférez éviter le garde, faites un large détour et pénétrez dans la forêt plus loin au sud en vous rendant",
        "vers": "244"
      }
    ]
  },
  {
    "id": "139",
    "texte": "L'entraînement que vous avez suivi dans l'art de la chasse vous permet de reconnaître les fruits comestibles ou vénéneux qui poussent dans les régions septentrionales de Magnamund. Ces fruits violets sont des Larnumes. C'est là un mets de choix, sucré et nourrissant. Vous en mangez à satiété et vous en faites provision pour l'équivalent de 2 repas. Conservez-les dans votre Sac à Dos. Au-delà des larnumiers, les arbres qui portent ces fruits, vous distinguez une large route qui suit la côte en menant, au choix, vers l'est ou vers l'ouest. Si vous voulez aller vers l'est, rendez-vous au 27. Si vous préférez prendre la direction de l'ouest, rendez-vous au 114.",
    "effets": {
      "objets": [
        {
          "id": "repas",
          "quantity": 2
        }
      ]
    },
    "choix": [
      {
        "texte": "Si vous voulez aller vers l'est",
        "vers": "27"
      },
      {
        "texte": "Si vous préférez prendre la direction de l'ouest",
        "vers": "114"
      }
    ]
  },
  {
    "id": "140",
    "texte": "Les deux gardes contemplent le Sceau avec une stupeur mêlée de respect. Tous les habitants de Durenor connaissent bien la légende du Sceau d'Hammardal et l'on dit que, de tous les trésors perdus du royaume, le Sceau d'Hammardal est celui dont personne ne souhaite le retour. L'inquiétude qu'exprime le visage des deux gardes montre qu'ils savent parfaitement ce que l'anneau signifie. L'un des soldats vous accompagne sur l'autre rive du chenal de Ryner et le long d'une route forestière qui aboutit à un croisement. Un panneau indicateur orienté vers l'est précise : PORT BAX 5 km. « Il me faut vous quitter à présent et retourner au chenal, dit le garde. J'ai bien peur que la guerre ne vienne bientôt assombrir ce royaume et mon devoir est de surveiller la frontière. Que Dieu vous accorde son aide, homme du Sommerlund. » Vous le regardez s'éloigner le long du chemin forestier puis vous vous remettez en route en direction de l'est. Vous devriez avoir atteint Port Bax dans une heure tout au plus. Rendez-vous au 265.",
    "suite": "265"
  },
  {
    "id": "141",
    "texte": "Le mât s'écrase sur le pont et un débris de bois vous frappe à la tête en vous jetant par-dessus bord. Vous vous débattez dans les vagues pour refaire surface puis vous vous agrippez à un panneau d'écoutille qui flotte à portée de main. A moitié assommé, vous perdez 2 points d'ENDURANCE. Vous vous hissez ensuite sur ce radeau de fortune en vous y cramponnant de toutes vos forces : si vous portez une cotte de mailles, il faut vous en débarrasser immédiatement, sinon, vous êtes sûr de périr noyé. Rayez-la de votre Feuille d'Aventure. Vous êtes soudain pris de vertige, vous vous sentez mal, et tandis que la forte houle vous ballotte en tous sens, vous sombrez peu à peu dans l'inconscience. Lorsque vous vous réveillez au bout de plusieurs heures, la tempête s'est calmée. A en juger par la position du soleil, l'après-midi touche à sa fin. Au loin, vous apercevez un petit bateau de pêche et au-delà, un rivage qui se dessine à l'horizon. Il ne reste plus du Sceptre Vert que le panneau d'écoutille sur lequel vous êtes assis. Si vous voulez essayer de signaler votre présence au bateau de pêche en agitant votre cape, rendez-vous au 278. Si vous préférez ne pas vous occuper du bateau et tenter de rejoindre la côte en pagayant à l'aide de vos seules mains, rendez-vous au 337.",
    "effets": {
      "endurance": -2,
      "retirerObjets": [
        "cotte-mailles"
      ]
    },
    "choix": [
      {
        "texte": "Si vous voulez essayer de signaler votre présence au bateau de pêche en agitant votre cape",
        "vers": "278"
      },
      {
        "texte": "Si vous préférez ne pas vous occuper du bateau et tenter de rejoindre la côte en pagayant à l'aide de vos seules mains",
        "vers": "337"
      }
    ]
  },
  {
    "id": "142",
    "texte": "L'homme prend votre argent et vous tend un laissez-passer valable sept jours. Vous le remerciez puis vous quittez les lieux. Au-dehors, vous prenez à gauche et vous vous approchez des gardes qui se tiennent en faction au bout de la rue. Rendez-vous au 246.",
    "suite": "246"
  },
  {
    "id": "143",
    "texte": "Vous marchez en direction du sud en suivant le quai et bientôt vous arrivez à un croisement où une rue mène vers l'est. Toutes les boutiques de cette rue sont fermées, sauf une, située à votre droite. Une enseigne est accrochée au-dessus de la porte : JINELDA KOOP ALCHIMISTE Achat et vente de potions magiques Si vous souhaitez entrer dans cette boutique, rendez-vous au 289. Si vous préférez poursuivre votre chemin, rendez-vous au 186.",
    "choix": [
      {
        "texte": "Une enseigne est accrochée au-dessus de la porte : JINELDA KOOP ALCHIMISTE Achat et vente de potions magiques Si vous souhaitez entrer dans cette boutique",
        "vers": "289"
      },
      {
        "texte": "Si vous préférez poursuivre votre chemin",
        "vers": "186"
      }
    ]
  },
  {
    "id": "144",
    "texte": "Un grand Noudic vêtu d'une cape de soie en patchwork aux couleurs vives ordonne à quelques-uns de ses congénères de prendre leurs armes et de vous reconduire au-dehors. Vous leur parlez alors dans leur propre langue et un murmure de stupeur parcourt aussitôt la caverne. Jamais encore ils n'ont rencontré d'être humain qui sache parler leur dialecte. Certains d'entre eux en sont abasourdis au point de vous contempler bouche bée, les yeux ronds et les pattes ballantes. Le grand Noudic s'adresse alors à vous en se présentant comme le chef de la colonie. Il déclare se nommer Gashiss et vous souhaite la bienvenue en vous invitant à le rejoindre sur une estrade dressée au centre de la caverne. « Vouzz n'êtezz pazz de Dzurzenorz, vouzz l'homme-là, heinzz ? vous demande-t-il avec un fort accent noudic, d'ouzz venezz vouzz donczz ? » Vous lui dites que vous êtes sommerlundois et que vous vous rendez à Hammardal. Le Noudic alors vous jette un regard inquiet. « Vouzz n'êtezz pazz unzz Zombizarre, au moinzz, j'espèrezz?» demande-t-il d'une voix anxieuse. Vous comprenez aussitôt que le mot « Zombizarre » désigne les Monstres d'Enfer dans la langue noudic et il vous apprend bientôt que deux de ces créatures malfaisantes sont arrivées à Tarnalin il y a deux heures et ont provoqué une panique générale dans le tunnel. Gashiss sait où ces deux monstres se cachent; ils vous attendent pour vous tendre une embuscade. « Vouzz voulezz que je vouzz montrezz commentzz lezz évitezz, vouzz, l'homme-là, heinzz ? » propose-t-il. Vous acceptez volontiers cette offre et il vous fait signe de le suivre au bas de l'estrade. Les Noudics à présent ont surmonté leur stupeur et ils semblent vous considérer comme l'un d'eux. Avant que vous ne quittiez la caverne, une jolie femelle noudic vous offre quelques provisions. 11 y a là l'équivalent de 2 Repas. Vous la remerciez de sa générosité et vous suivez Gashiss le long d'un des nombreux couloirs qui partent de la caverne. Au bout d'une heure de marche dans l'obscurité, il s'arrête et vous montre un rayon de lumière qui filtre par une crevasse à quelque distance. « Enzz sortantzz par làzz, vouzz n'aurezz plus rienzz à craindre, vouzz, l'homme-là, heinzz 1 » déclare votre guide. Vous le remerciez de vous avoir aidé mais vous remerciez surtout en votre for intérieur les Maîtres Kaï qui vous ont enseigné la Discipline de la Communication Animale. Ces longues années d'apprentissage vous ont sans doute sauvé la vie. Vous vous faufilez bientôt par une crevasse de la paroi rocheuse et vous vous laissez tomber sur la chaussée qui longe le mur à un mètre au-dessous. Les Noudics se sont montrés fort serviables et vous leur en êtes très reconnaissant jusqu'au moment où vous vous apercevez qu'il ne vous reste plus une seule Pièce d'Or ! Ils vous ont tout dérobé et vous n'avez plus qu'à modifier votre Feuille d'Aventure en conséquence. Vous vous trouvez toujours dans le tunnel de Tarnelin que vous continuez à suivre en vous rendant au 349.",
    "effets": {
      "perdreArme": "bourse",
      "objets": [
        {
          "id": "repas",
          "quantity": 2
        }
      ]
    },
    "suite": "349"
  },
  {
    "id": "145",
    "texte": "Vous vous sentez de plus en plus faible. Au prix d'un effort surhumain, vous cherchez l'herbe de Laumspur que vous finissez par trouver ; il vous semble qu'il s'est écoulé une éternité de douleur lorsque vous parvenez enfin à glisser dans votre bouche quelques feuilles sèches que vous vous forcez à avaler. Quelques secondes plus tard de violents malaises convulsent votre corps, puis la douleur s'apaise et vous sombrez dans un sommeil agité. Il s'écoule presque une heure avant votre réveil et vous vous sentez encore très mal, si mal que vous perdez aussitôt 5 points d'ENDURANCE. Peu à peu, cependant, vos forces reviennent et votre désarroi se change alors en fureur. Vous ramassez vos affaires et vous quittez la pièce d'un pas chancelant, bien décidé à retrouver celui ou celle qui a tenté de vous assassiner. Rendez-vous au 200.",
    "effets": {
      "endurance": -5
    },
    "suite": "200"
  },
  {
    "id": "146",
    "texte": "Vous aviez raison. Ce nuage est formé par une nuée d'énormes Bêtalzans et de Kraans, une espèce plus petite, mais tout aussi mortelle. Pendant sous leur ventre noir, ils tiennent dans leurs serres d'immenses filets dans lesquels s'entassent des GLOKS. Les Bêtalzans fondent alors sur le Sceptre Vert et un filet rempli de Gloks hurlants s'écrase sur le pont. Certains n'ont pas survécu à la chute mais la plupart sont indemnes et vous attaquent sans tarder. Il vous faut les combattre en les considérant comme un seul et même ennemi. GLOKS HABILETÉ: 15 ENDURANCE: 15 Si vous êtes vainqueur, rendez-vous au 345.",
    "combat": {
      "nom": "Gloks",
      "habilete": 15,
      "endurance": 15
    },
    "suite": "345"
  },
  {
    "id": "147",
    "texte": "La mise en pratique de votre Discipline Kaï vous indique que le chemin aboutit à un cul-de-sac. Seul le pont peut vous permettre de franchir le chenal de Ryner et d'atteindre Port Bax. Rendez-vous au 47.",
    "suite": "47"
  },
  {
    "id": "148",
    "texte": "Vous vous enveloppez dans votre cape de Seigneur Kaï et vous en relevez le capuchon. Le cocher lance un cri puis fouette ses chevaux et bientôt la diligence file sur la route bordée d'arbres qui longe la côte en direction de Ragadorn. Au cours du trajet, vous bavardez avec le cocher qui vous donne des renseignements fort utiles concernant le port de Ragadorn. Depuis la mort de Killean le Suzerain, trois ans auparavant, la ville est dirigée (et fort mal, d'après votre interlocuteur) par son fils Lachelan. Ses hommes et lui ne sont en fait que des brigands qui accablent le peuple d'impôts et assassinent quiconque s'oppose à leur pouvoir. Tandis que le cocher vous parle, vous vous sentez tenaillé par la faim et il vous faut à tout prix prendre un repas, sinon vous perdrez 3 points d'ENDURANCE. Quelques heures plus tard, la ville de Ragadorn se dessine dans le lointain. Une cloche sonne les douze coups de midi et bientôt la diligence franchit la porte Ouest de la cité puis s'arrête au relais. « Si vous voulez vous rendre à Durenor, vous devrez prendre une autre diligence au relais de la porte Est, mais dépêchez- vous, car le départ est prévu à une heure. » Vous remerciez le cocher pour ces renseignements et vous sautez sur la chaussée recouverte de pavés. Vous êtes alors frappé par l'effroyable puanteur qui baigne ce port sinistre. Une enseigne rouillée accrochée à la façade en ruines d'une maison porte ces mots : « Bienvenue à Ragadorn ». Si vous souhaitez aller vers le sud le long de l'avenue de la porte Ouest, rendez- vous au 323. Si vous préférez vous diriger au nord en suivant le quai de l'Est, rendez-vous au 122. Enfin, si vous choisissez plutôt d'aller vers l'est en empruntant la rue de la Hache, rendez-vous au 257.",
    "effets": {
      "repasObligatoire": true,
      "repasChassePossible": false
    },
    "choix": [
      {
        "texte": "Si vous souhaitez aller vers le sud le long de l'avenue de la porte Ouest",
        "vers": "323"
      },
      {
        "texte": "Si vous préférez vous diriger au nord en suivant le quai de l'Est",
        "vers": "122"
      },
      {
        "texte": "Enfin, si vous choisissez plutôt d'aller vers l'est en empruntant la rue de la Hache",
        "vers": "257"
      }
    ]
  },
  {
    "id": "149",
    "texte": "Votre Sixième Sens vous indique que ce garde est un soldat loyal du royaume de Durenor. Si vous vous mêliez de vouloir le corrompre, il se sentirait gravement insulté et vous attaquerait aussitôt. Si vous souhaitez lui montrer le Sceau d'Hammardal, rendez-vous au 223. Peut- être préférez-vous cependant ne pas lui montrer l'anneau ; peut-être même n'est-il plus en votre possession ; dans ce cas vous pouvez essayer de vous faire passer pour un marchand se rendant à Port Bax en allant au 250.",
    "choix": [
      {
        "texte": "Si vous souhaitez lui montrer le Sceau d'Hammardal",
        "vers": "223",
        "requis": {
          "objet": "sceau-hammardal"
        }
      },
      {
        "texte": "Peut- être préférez-vous cependant ne pas lui montrer l'anneau ; peut-être même n'est-il plus en votre possession ; dans ce cas vous pouvez essayer de vous faire passer pour un marchand se rendant à Port Bax en allant",
        "vers": "250"
      }
    ]
  },
  {
    "id": "150",
    "texte": "Vous lancez votre cheval dans les rues sinueuses du village, puis vous traversez un pont de bois ; vous montez ensuite un sentier escarpé qui conduit au sommet d'une crique. A la clarté de la lune, vous apercevez un poteau indicateur orienté vers l'est. Vous chevauchez toute la nuit sans prendre le temps de dormir et lorsque l'aube se lève enfin, le paysage s'est métamorphosé d'une manière surprenante. Les terres arides du Pays Sauvage ont fait place à des landes et à des marécages, et, aussi loin que porte le regard, une ombre noire s'étend à l'horizon en direction de l'est. C'est la forêt de Durenor, la frontière naturelle du royaume des montagnes qui borde à cet endroit les espaces inexplorés du Pays Sauvage. Voilà sans nul doute une vision réconfortante qui vous met quelque baume au cœur. Vous n'êtes plus qu'à une journée de cheval de Port Bax, mais vous êtes épuisé après cette nuit blanche et il vous faut prendre un repas ou vous perdrez 3 points d'ENDURANCE. Si vous maîtrisez la Discipline Kaï de la Chasse, vous pouvez en faire usage et capturer du gibier qui vous fournira les viandes nécessaires pour reprendre des forces. Vous avez chevauché pendant une heure lorsque vous arrivez à une bifurcation, mais vous ne voyez aucun poteau indicateur. Si vous souhaitez prendre le chemin de gauche, rendez-vous au 261. Si vous préférez aller à droite, rendez-vous au 334.",
    "effets": {
      "repasObligatoire": true
    },
    "choix": [
      {
        "texte": "Si vous souhaitez prendre le chemin de gauche",
        "vers": "261"
      },
      {
        "texte": "Si vous préférez aller à droite",
        "vers": "334"
      }
    ]
  },
  {
    "id": "151",
    "texte": "Vous utilisez votre technique du camouflage pour imiter l'accent rocailleux des habitants de Ragadorn et vous essayez de faire croire au soldat qu'une bagarre a éclaté dans la rue du Tombeau. Vous affirmez que les gardes de la ville ont été submergés par le noinlue ri qu'il doit immédiatement courir à leur secours. Vous saurez si votre mensonge a réussi en utilisant la Table de Hasard pour obtenir un chiffre. Si vous tirez un chiffre entre 0 et 4, rendez-vous au 262. Si vous tirez un chiffre entre 5 et 9, rendez-vous au 110.",
    "evenement": {
      "type": "jet-hasard-table",
      "branches": {
        "0-4": {
          "vers": "262"
        },
        "5-9": {
          "vers": "110"
        }
      }
    }
  },
  {
    "id": "152",
    "texte": "L'aube vient de se lever sur le 33e jour de votre quête lorsque vous entrez à cheval dans Port Bax en compagnie de Lord Axim. Les préparatifs de guerre sont achevés ; les vaisseaux de la flotte de Durenor mouillent dans le port, attendant l'ordre de mettre les voiles en direction du Sommerlund. A bord des navires, une puissante armée de soldats courageux et bien entraînés attend avec impatience d'affronter au combat les Maîtres des Ténèbres. Chacun de ces hommes a juré de libérer ses alliés assiégés par l'ennemi ou de mourir sur le champ de bataille. Vous-même prenez place à bord du vaisseau amiral Durenor, un grand navire à la proue arrondie et à la haute mâture dont la seule présence donne une impression de force imposante. L'amiral Calfen qui commande la flotte vous accueille sur le pont lorsque vous vous y présentez accompagné de Lord Axim. Il ne reste plus à présent qu'à donner l'ordre du départ. En moins d'une heure, les navires ont laissé le port loin derrière eux et les dômes de Port Bax ne sont plus que de simples points à l'horizon. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous tirez un chiffre entre 0 et 3, rendez-vous au 216. Entre 4 et 6, rendez-vous au 49. Entre 7 et 9, rendez-vous au 193.",
    "evenement": {
      "type": "jet-hasard-table",
      "branches": {
        "0-3": {
          "vers": "216"
        },
        "4-6": {
          "vers": "49"
        },
        "7-9": {
          "vers": "193"
        }
      }
    }
  },
  {
    "id": "153",
    "texte": "Vous laissez le fripon à ses tasses et à sa bille, et vous vous approchez d'un groupe d'hommes qui jouent aux cartes près de l'escalier de la taverne. Au bout d'un moment, vous vous apercevez que l'un des joueurs est en train de tricher. Si vous voulez défier cet homme, rendez- vous au 241. Si vous préférez ne pas vous en mêler, rendez-vous au 130.",
    "choix": [
      {
        "texte": "Si vous voulez défier cet homme",
        "vers": "241"
      },
      {
        "texte": "Si vous préférez ne pas vous en mêler",
        "vers": "130"
      }
    ]
  },
  {
    "id": "154",
    "texte": "Dans leur poste d'équipage, les hommes du Sceptre Vert sont entassés les uns sur les autres; il règne là une atmosphère étouffante, surchauffée. Mais, en dépit du manque d'espace et de la frugalité du repas (une frugalité telle qu'elle vous coûte 2 points d'ENDURANCE), les marins sont contents que vous ayez accepté leur invitation et ils vous traitent comme un hôte d'honneur. Après dîner, ils vous invitent à jouer avec eux aux « Hublots ». Il s'agit d'un jeu de dés où l'on mise un peu d'or. Si vous voulez tenter votre chance, rendez-vous au 308. Si vous préférez décliner leur offre et leur souhaiter bonne nuit avant de regagner votre cabine, rendez-vous au 197.",
    "effets": {
      "endurance": -2
    },
    "choix": [
      {
        "texte": "Si vous voulez tenter votre chance",
        "vers": "308"
      },
      {
        "texte": "Si vous préférez décliner leur offre et leur souhaiter bonne nuit avant de regagner votre cabine",
        "vers": "197"
      }
    ]
  },
  {
    "id": "155",
    "texte": "Vous avez parcouru un kilomètre et demi sur le chemin de gauche lorsque vous arrivez à un long pont de pierre. Le fleuve qu'il enjambe semble être en crue < i menace de déborder de son lit. Vous vous etes rendu compte alors qu'il s'agit du chenal de Rynn Il fait 3 kilomètres dans sa plus grande lat i .cin >i pin . le 1500 mètres de profondeur sur presque toute sa longueur. Il a été formé à la suite d'un glissement de terrain qui a séparé le royaume de Durenor du reste des terres de Magnamund. A l'entrée du pont, un poteau indicateur précise : PORT BAX — 5 km. Vous poussez un soupir de soulagement en constatant que vous êtes sur le bon chemin : dans moins d'une heure, vous aurez atteint la ville. Rendez-vous au 265.",
    "suite": "265"
  },
  {
    "id": "156",
    "texte": "Le cocher se met en colère. « C'est une longue marche qui t'attend, étranger», lance-t-il en vous claquant la portière au nez. Vous n'avez pas les moyens de louer une chambre pour la nuit et vous décidez donc d'aller coucher avec les chevaux dans l'écurie. Rendez-vous au 213.",
    "suite": "213"
  },
  {
    "id": "157",
    "texte": "Le GARDE est furieux et il se précipite sur vous en dévalant l'escalier, son épée levée au-dessus de sa tête. Si vous ne possédez pas d'arme, réduisez de 4 points votre total d'HABILETÉ et battez-vous à mains nues. GARDE HABILETÉ: 15 ENDURANCE 22 Vous avez le droit de prendre la fuite à tout moment en vous rendant au 65. Si vous êtes vainqueur, rendez-vous au 331.",
    "combat": {
      "nom": "Garde",
      "habilete": 15,
      "endurance": 22,
      "fuite": [
        {
          "texte": "Prendre la fuite",
          "vers": "65"
        }
      ]
    },
    "suite": "331"
  },
  {
    "id": "158",
    "texte": "Le MOINE ne semble pas surpris par votre attaque et il tire lui-même une épée noire de sous sa robe de bure. MOINE HABILETÉ: 16 ENDURANCE: 23 Si vous êtes vainqueur, rendez-vous au 220.",
    "combat": {
      "nom": "Moine",
      "habilete": 16,
      "endurance": 23
    },
    "suite": "220"
  },
  {
    "id": "159",
    "texte": "Vous vous arrêtez enfin au pied d'un immense pin et vous essayez de vous maintenir debout, mais vous avez si mal aux jambes et au côté que vous tombez par terre en perdant connaissance. Ce sommeil vous épargne d'être pourfendu par le Monstre d'Enfer, mais il ne vous sauvera pas de la mort car plus jamais vous ne vous réveillerez. Votre quête s'achève ici en même temps que votre vie.",
    "fin": "mort",
    "nomFin": "Fin de la mission — §159"
  },
  {
    "id": "160",
    "texte": "« Pardonnez-moi, my lord, je ne voulais pas vous faire peur. » L'homme semble inquiet et la main ouverte qu'il tend vers vous ne cesse de trembler. Sans vous départir de votre prudence, vous acceptez son geste amical et quelques instants plus tard vous vous asseyez avec lui à l'une des tables de l'auberge dans laquelle vous êtes entré par une porte latérale. L'endroit est désert, à l'exception d'un couple de souris qui rongent un gros morceau de fromage. « Le capitaine Kelman m'a chargé de vous amener à bord du Sceptre Vert mais je dois tout d'abord m'assurer que vous êtes bien le Seigneur Kaï qu'on appelle le Loup Solitaire, dit l'homme ; pouvez-vous donnei la preuve de votre identité 1 » Le meilleur moyen de prouver que vous êtes bien le Loup Solitaire consiste à faire la démonstration que vous maîtrisez l'une des Disciplines Kaï. Vous avez le choix entre les Disciplines suivantes : Guérison Rendez-vous au 16 Puissance Psychique Rendez-vous au 133 Maîtrise des Armes Rendez-vous au 255 Communication Animale Rendez-vous au 203 Maîtrise Psychique de la Matière Rendez-vous au 48 Si vous ne maîtrisez aucune des Disciplines de cette liste, ou si vous ne souhaitez pas faire de démonstration, rendez-vous au 348.",
    "choix": [
      {
        "texte": "Vous avez le choix entre les Disciplines suivantes : Guérison",
        "vers": "16",
        "requis": {
          "discipline": "guerison"
        }
      },
      {
        "texte": "Puissance Psychique",
        "vers": "133",
        "requis": {
          "discipline": "puissance-psychique"
        }
      },
      {
        "texte": "Maîtrise des Armes",
        "vers": "255",
        "requis": {
          "discipline": "maitrise-armes"
        }
      },
      {
        "texte": "Communication Animale",
        "vers": "203",
        "requis": {
          "discipline": "communication-animale"
        }
      },
      {
        "texte": "Maîtrise Psychique de la Matière",
        "vers": "48",
        "requis": {
          "discipline": "maitrise-matiere"
        }
      },
      {
        "texte": "Si vous ne maîtrisez aucune des Disciplines de cette liste, ou si vous ne souhaitez pas faire de démonstration",
        "vers": "348"
      }
    ]
  },
  {
    "id": "161",
    "texte": "La boutique est déserte. Vous attendez en examinant pendant cinq minutes les articles exposés, mais personne ne vient. Vous vous apprêtez à repartir lorsque vous remarquez une carte accrochée derrière la porte. C'est un plan du port de Ragadorn. Les écuries et le relais de la diligence sont clairement indiqués à proximité de la porte Est de la ville. C'est là que vous trouverez un moyen de transport qui vous permettra d'atteindre Port Bax. Vous repérez le trajet qui mène à la porte Est et vous quittez la boutique. Vous rebroussez chemin au pas de course dans la rue de la Hache puis vous tournez vers l'est, dans la rue du Sage. Le pont de Ragadorn se trouve tout au bout de cette voie sinueuse ; c'est là le seul point de passage qui relie les parties Est et Ouest de la ville. Vous vous frayez un chemin dans la foule qui se presse sur le pont, puis, dès que vous êtes arrivé de l'autre côté, vous vous mettez à courir sur les pavés le long du boulevard du Commerce, section Est. Rendez-vous au 186.",
    "suite": "186"
  },
  {
    "id": "162",
    "texte": "Il lance son cri de guerre et se rue sur vous. CHEVALIER DELA MONTAGNE BLANCHE HABILETÉ: 20 ENDURANCE: 27 Vous pouvez prendre la fuite à tout moment en vous réfugiant dans les bois ; rendez-vous pour cela au 244. Si vous sortez vainqueur du combat, rendez-vous au 302.",
    "combat": {
      "nom": "Chevalier de la Montagne Blanche",
      "habilete": 20,
      "endurance": 27,
      "fuite": [
        {
          "texte": "Prendre la fuite",
          "vers": "244"
        }
      ]
    },
    "suite": "302"
  },
  {
    "id": "163",
    "texte": "« Nous avons le vaisseau le plus rapide de toutes les mers du Nord, il n'est pas de navire qui puisse rattraper le Sceptre Vert », affirme le capitaine. Il a raison en effet, car bientôt le bateau pirate disparaît à l'horizon. « Depuis vingt-cinq ans que je navigue, je n'ai jamais vu les pirates Lakuri s'aventurer si loin au nord, dit le capitaine en se caressant la barbe d'un air songeur, ils doivent être sur la piste d'un bien riche butin pour s'éloigner ainsi de leurs îles tropicales. » Et tandis que le capitaine descend dans sa cabine, vous pensez avec inquiétude que ce « riche butin » pourrait bien être vous-même. Rendez-vous au 240.",
    "suite": "240"
  },
  {
    "id": "164",
    "texte": "Vous marchez depuis une heure dans ce tunnel désert lorsque vous apercevez à votre gauche plusieurs marches taillées dans la paroi rocheuse. Elles mènent à une plateforme qui permet d'atteindre les torches éclairant le tunnel. Si vous souhaitez monter ces marches pour explorer la plate-forme, rendez-vous au 52. Si vous préférez continuer votre chemin sans vous occuper des marches, rendez-vous au 256. Si vous maîtrisez la Discipline Kaï du Sixième Sens, rendez-vous au 172.",
    "choix": [
      {
        "texte": "Si vous souhaitez monter ces marches pour explorer la plate-forme",
        "vers": "52"
      },
      {
        "texte": "Si vous préférez continuer votre chemin sans vous occuper des marches",
        "vers": "256"
      },
      {
        "texte": "Si vous maîtrisez la Discipline Kaï du Sixième Sens",
        "vers": "172",
        "requis": {
          "discipline": "sixieme-sens"
        }
      }
    ]
  },
  {
    "id": "165",
    "texte": "Vous rangez l'or dans votre bourse, puis vous ôtez l'Anneau de votre doigt et vous le lui tendez. Elle vous le prend des mains et l'examine attentivement. Vous quittez ensuite la boutique mais au moment où vous franchissez la porte, vous l'entendez ricaner sous cape et vous vous demandez alors si vous avez bien fait d'agir ainsi. Rendez-vous au 186.",
    "effets": {
      "or": 40,
      "retirerObjets": [
        "sceau-hammardal"
      ]
    },
    "suite": "186"
  },
  {
    "id": "166",
    "texte": "Vous montez un escalier et vous vous retrouvez sur le pont du navire ; la bataille fait rage tandis que les vaisseaux fantômes encerclent la flotte de Durenor. Soudain, un éclair de feu jaillit d'une tour dressée à l'arrière du bateau fantôme sur lequel vous vous trouvez, et vient frapper dans une gigantesque explosion le flanc d'un navire de la flotte durnoraise, à moins de 50 mètres de distance. Vous voyez alors avec horreur les soldats alliés sauter du pont, leurs vêtements et leurs cheveux en flammes. Si vous souhaitez explorer cette tour, rendez-vous au 328. Si vous préférez vous enfuir en sautant par-dessus bord, rendez- vous au 267.",
    "choix": [
      {
        "texte": "Si vous souhaitez explorer cette tour",
        "vers": "328"
      },
      {
        "texte": "Si vous préférez vous enfuir en sautant par-dessus bord",
        "vers": "267"
      }
    ]
  },
  {
    "id": "167",
    "texte": "«Votre stratégie ne manque pas d'audace, Loup Solitaire, mais je crois bien que je vais vous battre à présent », lance soudain votre adversaire. Le capitaine Kelman déplace alors une de ses pièces d'ivoire sculpté de votre côté du damier en arborant un sourire triomphant. Mais son sourire s'efface et une expression de contrariété apparaît sur son visage lorsque vous contre-attaquez d'une manière tout à fait inattendue. «Échec et mat», répliquez-vous d'une voix calme. Le capitaine contemple le damier d'un air incrédule. « Décidément, le talent des Seigneurs Kaï ne cessera jamais de m'étonner », dit-il en se grattant la tête. Il a toujours les yeux fixés sur le damier du Samor lorsque vous retournez dans votre cabine après lui avoir souhaité bonne nuit. Rendez-vous au 197.",
    "suite": "197"
  },
  {
    "id": "168",
    "texte": "Un par un, les autres voyageurs s'approchent et contemplent avec horreur le corps du cocher de la diligence. « Il faut l'enterrer », dit le moine. Vous hochez la tête en signe d'approbation et vous creusez une tombe pour y déposer le corps. Lorsque le malheureux est enterré, tous les voyageurs et vous-même revenez près de la diligence pour décider de ce qu'il convient de faire. «Je connais la route de Port Bax, je peux remplacer le cocher», propose Halvore. «J'espère qu'on ne nous accusera pas de l'avoir tué», dit le moine avec inquiétude. « Ce sont les dieux qui ont décidé de sa mort», assure Dorier. «J'en porterai témoignage», déclare Ganon, les Chevaliers de la Montagne Blanche ne mentent jamais. Il est vrai qu'au royaume de Durenor un authentique chevalier dit toujours la vérité, qu'elle lui soit ou non favorable. Ses paroles semblent avoir rassuré le moine et bientôt la diligence fait route à nouveau en direction de l'est. L'après-midi touche à sa fin lorsque vous arrivez au relais d'un petit village côtier connu sous le nom de Crique en Gorn et dont la population se compose essentiellement de repris de justice, de voleurs et de Squalls. Les villageois se montrent soupçonneux lorsqu'on leur annonce la mort du cocher, mais Dorier parvient à les convaincre qu'il s'agit bel et bien d'un accident. Il n'y a qu'une seule auberge dans tout le village; c'est une taverne qui porte un nom peu engageant : L'Espoir Déçu. Son état de délabrement est typique de la pauvreté qui règne dans ce village du bord de mer où abondent les masures en ruines. Une chambre pour la nuit coûte 1 Pièce d'Or. Si vous avez les moyens de vous offrir une chambre, rendez-vous au 314. Sinon, rendez-vous au 25.",
    "choix": [
      {
        "texte": "Si vous avez les moyens de vous offrir une chambre",
        "vers": "314",
        "requis": {
          "or": 1
        },
        "effets": {
          "or": -1
        }
      },
      {
        "texte": "Sinon",
        "vers": "25",
        "requis": {
          "orMax": 0
        }
      }
    ]
  },
  {
    "id": "169",
    "texte": "Découragé, vous quittez la maison de jeu et vous retournez au relais de diligence ; au loin, vous apercevez la porte Est de la ville. La diligence de Durenor attend juste à côté. Or, il vous faut à tout prix gagner Port Bax, l'avenir du Sommerlund en dépend. Vous vous arrangez donc pour passer derrière le garde qui surveille la diligence et vous montez dans le véhicule sans qu'il vous ait vu. A mesure que l'heure du départ approche, cinq autres passagers montent à leur tour et s'assoient autour de vous. Le garde claque alors la portière et le voyage pour Port Bax commence. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous tirez un chiffre entre 0 et 3, rendez-vous au 39. Entre 4 et 6, rendez- vous au 249. Entre 7 et 9, rendez-vous au 339.",
    "evenement": {
      "type": "jet-hasard-table",
      "branches": {
        "0-3": {
          "vers": "39"
        },
        "4-6": {
          "vers": "249"
        },
        "7-9": {
          "vers": "339"
        }
      }
    }
  },
  {
    "id": "170",
    "texte": "Le garde jette un coup d'œil à votre carte de couleur blanche et renifle avec mépris. « C'est un laissez-passer de marchand, dit-il, il ne vous sera d'aucune utilité ici. Il vous faut un laissez-passer rouge pour avoir accès à la base navale. » Il vous rend votre carte et retourne à son poste de garde. Rendez-vous au 327.",
    "suite": "327"
  },
  {
    "id": "171",
    "texte": "Vous apercevez derrière les arbres une large route qui longe la côte d'est en ouest. Si vous voulez aller vers l'est, rendez-vous au 27. Si vous préférez vous diriger vers l'ouest, rendez-vous au 114.",
    "choix": [
      {
        "texte": "Si vous voulez aller vers l'est",
        "vers": "27"
      },
      {
        "texte": "Si vous préférez vous diriger vers l'ouest",
        "vers": "114"
      }
    ]
  },
  {
    "id": "172",
    "texte": "Grâce à votre Sixième Sens, vous devinez qu'un péril vous menace dans l'ombre de cette plate-forme. Si vous souhaitez malgré tout monter les marches et affronter ce danger, rendez-vous au 52. Si vous préférez vous éloigner rapidement de ces marches et de cette plate-forme, rendez-vous au 256. Enfin, si vous choisissez de revenir en courant jusqu'au croisement pour prendre le tunnel de gauche, rendez-vous au 64.",
    "choix": [
      {
        "texte": "Si vous souhaitez malgré tout monter les marches et affronter ce danger",
        "vers": "52"
      },
      {
        "texte": "Si vous préférez vous éloigner rapidement de ces marches et de cette plate-forme",
        "vers": "256"
      },
      {
        "texte": "Enfin, si vous choisissez de revenir en courant jusqu'au croisement pour prendre le tunnel de gauche",
        "vers": "64"
      }
    ]
  },
  {
    "id": "173",
    "texte": "Vous pénétrez dans un somptueux magasin où sont exposées les marchandises les plus raffinées qu'on puisse trouver au nord de Magnamund. Même à cette heure tardive, l'endroit est animé : des capitaines et de riches commerçants marchandent en effet l'achat ou l'échange de leurs denrées. Le propriétaire du magasin est un jeune guerrier qui préside aux enchères du haut d'un fauteuil de bois sculpté suspendu par quatre chaînes. Ces hommes sont tous vêtus d'armures noires et leurs boucliers portent pour emblème l'image d'un vaisseau noir surmonté d'une crête rouge. Vous surprenez alors un jeune garçon en train de voler la bourse accrochée à la ceinture d'un marchand. Son forfait accompli, le garnement glisse son butin dans sa botte. Si vous décidez d'attraper le garçon pour lui faire rendre la bourse, rendez-vous au 91. Si vous préférez suivre le jeune homme au-dehors et lui dérober la bourse à votre tour, rendez-vous au 6. Enfin, si vous choisissez de faire comme si vous n'aviez rien vu pour consacrer plutôt votre attention aux marchandises exposées, rendez-vous au 283.",
    "choix": [
      {
        "texte": "Si vous décidez d'attraper le garçon pour lui faire rendre la bourse",
        "vers": "91"
      },
      {
        "texte": "Si vous préférez suivre le jeune homme au-dehors et lui dérober la bourse à votre tour",
        "vers": "6"
      },
      {
        "texte": "Enfin, si vous choisissez de faire comme si vous n'aviez rien vu pour consacrer plutôt votre attention aux marchandises exposées",
        "vers": "283"
      }
    ]
  },
  {
    "id": "174",
    "texte": "«Je n'ai encore jamais rencontré un paysan qui ait les moyens de s'acheter un cheval, dit le chevalier en s'avançant vers vous, vous n'êtes d'ailleurs sûrement pas un paysan, j'ai plutôt l'impression que vous êtes un voleur. » Puis, d'un coup de son épée, il vous désarçonne et vous tombez lourdement sur le sol. Instinctivement, vous tirez votre épée dans un geste de défense tandis que le chevalier vous attaque. Rendez- vous au 162.",
    "suite": "162"
  },
  {
    "id": "175",
    "texte": "« Il semble que l'oiseau se soit envolé », dit le capitaine. Il vous montre alors un canot qui file à bonne allure en direction d'un autre navire. « Regardez bien ce vaisseau, il n'a pas de pavillon et sa forme me paraît bien étrange. Je n'en ai encore jamais vu de semblable. » Vous observez le canot qui rejoint en quelques instants le mystérieux navire. Et soudain, comme par magie, un brouillard venu d'on ne sait où se lève sur la mer et enveloppe le vaisseau. Moins d'une minute plus tard, le navire et le brouillard ont tous deux disparu. Utilisez la Table de Hasard pour obtenir un chiffre. Si vous tirez un chiffre entre 0 et 4, rendez-vous au 53. Entre 5 et 9, rendez-vous au 209.",
    "evenement": {
      "type": "jet-hasard-table",
      "branches": {
        "0-4": {
          "vers": "53"
        },
        "5-9": {
          "vers": "209"
        }
      }
    }
  },
  {
    "id": "176",
    "texte": "Vous avez chevauché pendant trois jours et trois nuits le long du grand chemin qui remonte la vallée du Durenon. Au loin, vous apercevez le sommet des monts d'Hammardal, l'une des plus hautes chaînes de montagnes de Magnamund. La capitale du royaume de Durenor est nichée au creux de ces montagnes. L'aube vient de se lever sur le quatorzième jour de votre quête. Vous avez établi votre camp près d'une chute d'eau ; à cet endroit, les flots du fleuve Durenon plongent au bas d'un à-pic de 40 mètres de hauteur. Vous vous apprêtez à vous remettre en route lorsque six cavaliers au visage encapuchonné apparaissent sur la route forestière et vous bloquent le passage. Le Lieutenant Général Rhygar leur intime l'ordre de vous laisser passer en leur précisant que vous êtes porteur d'une dépêche royale. Au royaume de Durenor, faire obstacle au passage d'un messager du roi est considéré comme un acte de trahison ; malheureusement, l'avertissement du Lieutenant Général laisse indifférents les six cavaliers qui refusent de bouger d'un pouce. « Si vous ne voulez pas entendre raison, nos épées vous convaincront peut-être», dit alors Rhygar. Il dégaine aussitôt son arme et ordonne à ses hommes de passer à l'attaque. Si vous souhaitez prêter main forte à Rhygar, rendez- vous au 45. Si vous préférez ne pas attaquer les cavaliers, rendez-vous au 277. Enfin, si vous maîtrisez la Discipline Kaï du Sixième Sens, rendez-vous au 322.",
    "choix": [
      {
        "texte": "Si vous souhaitez prêter main forte à Rhygar",
        "vers": "45"
      },
      {
        "texte": "Si vous préférez ne pas attaquer les cavaliers",
        "vers": "277"
      },
      {
        "texte": "Enfin, si vous maîtrisez la Discipline Kaï du Sixième Sens",
        "vers": "322",
        "requis": {
          "discipline": "sixieme-sens"
        }
      }
    ]
  },
  {
    "id": "177",
    "texte": "Lorsque vous entrez à nouveau dans la taverne, vous voyez les marins rassemblés autour d'une table où se déroule une partie de bras de fer. Si vous souhaitez vous aussi engager une partie de bras de fer, rendez- vous au 276. Si vous préférez parler à l'aubergiste, rendez-vous au 342.",
    "choix": [
      {
        "texte": "Si vous souhaitez vous aussi engager une partie de bras de fer",
        "vers": "276"
      },
      {
        "texte": "Si vous préférez parler à l'aubergiste",
        "vers": "342"
      }
    ]
  },
  {
    "id": "178",
    "texte": "Bien que la délicieuse odeur de cette nourriture vous fasse saliver, vous soupçonnez quelque chose de louche et vous posez le plateau à terre, près de la porte. Vous êtes fatigué à force d'avoir faim et vous décidez de faire un somme avant d'aller rejoindre les autres au bar. Lorsque vous vous réveillez, vous apercevez les cadavres de deux rats étendus près du plateau : ils sont morts empoisonnés. Vous êtes alors saisi de fureur, car c'est à vous que cette nourriture était destinée. Vous vous hâtez de ramasser vos affaires et vous quittez la chambre, bien décidé à retrouver celui ou celle qui a tenté de vous assassiner. Rendez-vous au 200.",
    "suite": "200"
  },
  {
    "id": "179",
    "texte": "Votre maîtrise du Camouflage vous permet de vous dissimuler dans la charrette à foin en étant sûr de n'être pas découvert. Lorsque, enfin, tout danger est écarté, vous sortez de votre cachette. Si pour plus de sûreté, vous souhaitez rester caché un peu plus longtemps, vous pouvez vous réfugier au sommet d'une autre meule de foin entassée à quelque distance, rendez-vous alors au 82. Si vous préférez prendre un cheval et quitter le village, rendez-vous au 150. Si enfin vous choisissez d'entrer dans la boutique du charron, rendez-vous au 71.",
    "choix": [
      {
        "texte": "Si pour plus de sûreté, vous souhaitez rester caché un peu plus longtemps, vous pouvez vous réfugier au sommet d'une autre meule de foin entassée à quelque distance",
        "vers": "82"
      },
      {
        "texte": "Si vous préférez prendre un cheval et quitter le village",
        "vers": "150"
      },
      {
        "texte": "Si enfin vous choisissez d'entrer dans la boutique du charron",
        "vers": "71"
      }
    ]
  }
];
