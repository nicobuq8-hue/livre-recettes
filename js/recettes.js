/*
 * Mon livre de recettes — données
 * --------------------------------
 * Pour ajouter une recette : copier un bloc { ... } et l'adapter.
 *
 * Champs d'une recette :
 *   id, titre, sousTitre, categorie, image (chemin ou null)
 *   infos : { parts, preparation, cuisson, temperature }  (textes affichés tels quels)
 *   rendement : { valeur, unite, uniteSing, pas, min, aide? }   (stepper "nombre de …")
 *   formats : [ { id, libelle, rendement, ingredients?, cuisson?, note? } ]  (facultatif → menu déroulant)
 *   ingredients : liste de
 *       { t: "texte exact de la fiche", q: quantité (nombre ou [min, max]), u: "unité", l: "libellé", sg: "libellé au singulier", pre: "texte avant la quantité" }
 *       { g: "Titre de groupe" }   → intertitre
 *       Un ingrédient sans q n'est jamais recalculé (ex. « Sel et poivre »).
 *       À la quantité de base, c'est toujours le texte exact « t » qui s'affiche.
 *   etapes : [ ["Titre", "Texte"], ... ]   ({ g: "Titre de partie" } → intertitre, numérotation repartant à 1)
 *   ingrédient precis: true → arrondi au dixième de gramme (ex. levure)
 *   calcul : true → recette « calculateur » (quantités toujours calculées, règle de la fiche affichée en dessous)
 *
 * Recettes ajoutées ou modifiées depuis le téléphone (bouton « Ajouter une recette » / « Modifier ») :
 *   data/recettes-ajoutees.json : liste JSON [ {...}, ... ] au même format.
 *   Fusion au chargement : ce fichier (RECETTES) → un même id dans recettes-ajoutees.json le remplace
 *   (surcharge, sans réécrire ce JS) → les ids de data/recettes-masquees.json sont retirés (recettes
 *   intégrées « supprimées » depuis le téléphone). Toutes les fiches ont « Modifier » et « Supprimer ».
 *   Le formulaire écrit recettes-ajoutees.json via l'API GitHub et les photos dans img/ajout-<id>.jpg.
 *   On peut aussi l'éditer à la main (JSON valide), ou déplacer une recette vers ce fichier pour
 *   l'intégrer définitivement (la retirer alors du JSON, et de recettes-masquees.json si elle y est).
 */
window.RECETTES = [];
window.CATEGORIES = ["Entrées", "Plats", "Desserts", "Boulangerie", "Bases"];

/* ============================ ENTRÉES ============================ */
RECETTES.push(
{
  id: "terrine-saumon", titre: "Terrine de saumon", sousTitre: "saumon frais et fumé, ciboulette et citron",
  categorie: "Entrées", image: "img/terrine-saumon.jpg",
  infos: { parts: "1 terrine · moule 28 × 11,5 × 7,5 cm - à confirmer · remplissage partiel probable", preparation: "25 min + 6 h au frais", cuisson: "Environ 40 à 55 min, selon le moule", temperature: "160 °C · bain-marie · 71 °C à coeur" },
  rendement: { valeur: 1, unite: "terrines", uniteSing: "terrine", pas: 0.5, min: 0.5 },
  ingredients: [
    { t: "400 g de saumon frais sans peau ni arêtes", q: 400, u: "g", l: "de saumon frais sans peau ni arêtes" },
    { t: "150 g de saumon fumé", q: 150, u: "g", l: "de saumon fumé" },
    { t: "3 oeufs", q: 3, l: "oeufs", sg: "oeuf" },
    { t: "20 cl de crème fraîche épaisse", q: 20, u: "cl", l: "de crème fraîche épaisse" },
    { t: "1 bouquet de ciboulette", q: 1, l: "bouquets de ciboulette", sg: "bouquet de ciboulette" },
    { t: "Le jus de 1 citron", q: 1, pre: "Le jus de", l: "citrons", sg: "citron" },
    { t: "1 pincée de sel", q: 1, l: "pincées de sel", sg: "pincée de sel" },
    { t: "1 pincée de poivre", q: 1, l: "pincées de poivre", sg: "pincée de poivre" },
    { t: "Beurre ou papier cuisson pour le moule" }
  ],
  etapes: [
    ["Préparer le moule", "Préchauffer le four à 160 °C. Beurrer ou chemiser un moule à terrine. Les dimensions supposées sont de 28 × 11,5 × 7,5 cm, à confirmer. Environ 0,9 à 1,1 L de farce ne devrait le remplir que partiellement : mesurer sa capacité intérieure avec de l'eau pour ajuster ultérieurement les quantités."],
    ["Préparer les saumons", "Vérifier que le saumon frais ne contient plus d'arêtes. Le couper en morceaux et réserver quelques dés. Couper le saumon fumé en lanières ou en morceaux."],
    ["Mélanger la farce", "Mixer brièvement le reste du saumon frais bien froid avec les oeufs et la crème épaisse, sans laisser chauffer la préparation. Incorporer la ciboulette ciselée, le jus de citron, le poivre, le saumon fumé et les dés de saumon frais réservés. Saler prudemment, car le saumon fumé est déjà salé."],
    ["Remplir le moule", "Verser la farce dans le moule, lisser et tapoter doucement pour chasser les bulles d'air. Couvrir légèrement de papier aluminium."],
    ["Cuire au bain-marie", "Placer le moule dans un plat plus grand et verser de l'eau chaude à mi-hauteur. Enfourner environ 40 à 55 minutes, selon la hauteur réelle de la farce. Vérifier avec une sonde au centre et poursuivre jusqu'à 71 °C à coeur en raison des oeufs."],
    ["Refroidir et servir", "Sortir du bain-marie, laisser tiédir brièvement puis réfrigérer rapidement au moins 6 heures, idéalement toute une nuit. Démouler et trancher la terrine bien froide."]
  ]
},
{
  id: "terrine-deux-poissons", titre: "Terrine aux deux poissons", sousTitre: "cabillaud, saumon, aneth et baies roses",
  categorie: "Entrées", image: "img/terrine-deux-poissons.jpg",
  infos: { parts: "1 terrine · moule 28 × 11,5 × 7,5 cm - à confirmer · risque de ne pas remplir le moule", preparation: "25 min + 6 h au frais", cuisson: "Environ 45 à 55 min, selon le moule", temperature: "160 °C · bain-marie · 71 °C à coeur" },
  rendement: { valeur: 1, unite: "terrines", uniteSing: "terrine", pas: 0.5, min: 0.5 },
  ingredients: [
    { t: "300 g de cabillaud sans peau ni arêtes", q: 300, u: "g", l: "de cabillaud sans peau ni arêtes" },
    { t: "300 g de saumon sans peau ni arêtes", q: 300, u: "g", l: "de saumon sans peau ni arêtes" },
    { t: "4 oeufs", q: 4, l: "oeufs", sg: "oeuf" },
    { t: "25 cl de crème liquide", q: 25, u: "cl", l: "de crème liquide" },
    { t: "1 botte d'aneth", q: 1, l: "bottes d'aneth", sg: "botte d'aneth" },
    { t: "1 c. à café de baies roses", q: 1, u: "c. à café", l: "de baies roses" },
    { t: "1 pincée de sel", q: 1, l: "pincées de sel", sg: "pincée de sel" },
    { t: "1 pincée de poivre", q: 1, l: "pincées de poivre", sg: "pincée de poivre" },
    { t: "Beurre ou papier cuisson pour le moule" }
  ],
  etapes: [
    ["Préparer le moule", "Préchauffer le four à 160 °C. Beurrer le moule à terrine ou le chemiser soigneusement de papier cuisson. Les dimensions provisoires sont de 28 × 11,5 × 7,5 cm et restent à confirmer. Cette quantité de farce, environ 1 à 1,2 L, risque de ne remplir le moule qu'à moitié ou aux deux tiers ; mesurer sa capacité intérieure avec de l'eau avant de prévoir un ajustement."],
    ["Préparer les poissons", "Vérifier qu'il ne reste aucune arête, puis couper le cabillaud et le saumon bien froids en morceaux. Réserver quelques dés de chaque poisson pour donner de la texture, si souhaité."],
    ["Mixer la farce", "Mixer le reste des poissons par impulsions. Ajouter les oeufs et la crème liquide, puis mixer brièvement jusqu'à obtenir une préparation homogène sans la chauffer."],
    ["Assaisonner", "Ciseler l'aneth. L'incorporer à la préparation avec les baies roses légèrement écrasées, le sel et le poivre. Ajouter les dés de poisson réservés et mélanger délicatement."],
    ["Remplir la terrine", "Verser la préparation dans le moule, lisser la surface et tapoter doucement le moule sur le plan de travail afin de chasser les bulles d'air. Couvrir légèrement de papier aluminium."],
    ["Cuire au bain-marie", "Placer la terrine dans un plat plus grand et verser de l'eau chaude à mi-hauteur. Enfourner environ 45 à 55 minutes, mais se fier surtout à une sonde insérée au centre : viser 71 °C à coeur en raison des oeufs mélangés au poisson. Le temps varie avec la hauteur réelle de la farce et le moule. Retirer l'aluminium pour les 10 dernières minutes si nécessaire."],
    ["Refroidir", "Sortir la terrine du bain-marie, la laisser tiédir brièvement, puis la couvrir et la réfrigérer rapidement pendant au moins 6 heures, idéalement toute une nuit."],
    ["Démouler et servir", "Démouler la terrine bien froide et la couper avec un couteau fin. Servir avec du citron, une salade ou une sauce légère aux herbes."]
  ]
},
{
  id: "souffle-fromage", titre: "Soufflé au fromage", sousTitre: "8 ramequins individuels de 9 cm × 6 cm",
  categorie: "Entrées", image: "img/souffle-fromage.jpg",
  infos: { parts: "8 personnes", preparation: "Non précisé", cuisson: "Environ 20 min", temperature: "200 °C" },
  rendement: { valeur: 8, unite: "ramequins", uniteSing: "ramequin", pas: 1, min: 1 },
  ingredients: [
    { t: "50 g de beurre", q: 50, u: "g", l: "de beurre" },
    { t: "50 g de farine", q: 50, u: "g", l: "de farine" },
    { t: "500 ml de lait", q: 500, u: "ml", l: "de lait" },
    { t: "150 g d'emmental râpé", q: 150, u: "g", l: "d'emmental râpé" },
    { t: "6 jaunes d'oeufs", q: 6, l: "jaunes d'oeufs", sg: "jaune d'oeuf" },
    { t: "10 blancs d'oeufs", q: 10, l: "blancs d'oeufs", sg: "blanc d'oeuf" },
    { t: "Sel, poivre et noix de muscade" },
    { t: "Beurre pour les ramequins" }
  ],
  etapes: [
    ["Chauffer le lait", "Porter le lait à ébullition avec la noix de muscade."],
    ["Préparer le roux blanc", "Faire fondre le beurre dans une casserole. Ajouter la farine en une seule fois, mélanger et cuire brièvement sans coloration pour obtenir un roux blanc. Laisser refroidir."],
    ["Former la sauce", "Verser progressivement le lait bouillant sur le roux blanc refroidi en fouettant. Remettre sur feu doux si nécessaire et mélanger jusqu'à épaississement. Saler et poivrer."],
    ["Ajouter le fromage et les jaunes", "Hors du feu, incorporer l'emmental râpé. Laisser tiédir, puis ajouter les 6 jaunes d'oeufs."],
    ["Incorporer les blancs", "Monter les 10 blancs d'oeufs en neige ferme, puis les incorporer délicatement au mélange précédent sans les casser."],
    ["Préparer les ramequins", "Beurrer généreusement 8 ramequins individuels de 9 cm de diamètre et 6 cm de hauteur, en remontant le pinceau du fond vers le bord."],
    ["Cuire les soufflés", "Répartir la préparation dans les ramequins. Enfourner immédiatement à 200 °C pendant environ 20 minutes, sans ouvrir la porte du four. Servir dès la sortie du four."]
  ]
},
{
  id: "gateau-courgettes-corinne", titre: "Gâteau de courgettes de Corinne", sousTitre: "au gruyère, parmesan et herbes de Provence",
  categorie: "Entrées", image: "img/gateau-courgettes-corinne.jpg",
  infos: { parts: "6 personnes", preparation: "20 min", cuisson: "45 à 50 min", temperature: "Préchauffage 200 °C · cuisson 180 °C" },
  rendement: { valeur: 6, unite: "personnes", uniteSing: "personne", pas: 1, min: 1 },
  ingredients: [
    { t: "500 g de courgettes", q: 500, u: "g", l: "de courgettes" },
    { t: "2 oeufs entiers", q: 2, l: "oeufs entiers", sg: "oeuf entier" },
    { t: "100 ml de lait", q: 100, u: "ml", l: "de lait" },
    { t: "70 g de farine", q: 70, u: "g", l: "de farine" },
    { t: "20 g de beurre fondu", q: 20, u: "g", l: "de beurre fondu" },
    { t: "1 sachet de levure chimique", q: 1, l: "sachets de levure chimique", sg: "sachet de levure chimique" },
    { t: "50 g de gruyère râpé", q: 50, u: "g", l: "de gruyère râpé" },
    { t: "20 g de parmesan râpé", q: 20, u: "g", l: "de parmesan râpé" },
    { t: "Sel et poivre" },
    { t: "Herbes de Provence" },
    { t: "Beurre et farine pour le moule" }
  ],
  etapes: [
    ["Préparer les courgettes", "Laver les courgettes en conservant leur peau, puis les couper en demi-rondelles."],
    ["Préparer l'appareil", "Fouetter les oeufs entiers comme pour une omelette. Ajouter le lait et le beurre fondu, puis mélanger."],
    ["Ajouter les ingrédients secs", "Incorporer la farine tamisée et la levure chimique. Ajouter le gruyère râpé, le parmesan, le sel, le poivre et les herbes de Provence, puis mélanger jusqu'à obtenir une pâte homogène."],
    ["Préparer le moule", "Beurrer un moule de type moule à tarte, le chemiser avec de la farine, puis retirer l'excédent."],
    ["Monter le gâteau", "Verser l'appareil dans le moule. Répartir les demi-rondelles de courgettes et les enfoncer dans la pâte afin de bien les enrober."],
    ["Cuire", "Préchauffer le four à 200 °C. Au moment d'enfourner, baisser la température à 180 °C et cuire pendant 45 à 50 minutes, jusqu'à ce que le gâteau soit pris et bien doré."]
  ]
},
{
  id: "pate-campagne", titre: "Pâté de campagne", sousTitre: "terrine de porc, foie, cognac et lait aromatisé",
  categorie: "Entrées", image: "img/pate-campagne-rustique.jpg",
  infos: { parts: "1 kg de pâté · taille de terrine non indiquée", preparation: "Mise au sel 24 h la veille", cuisson: "Environ 10 min puis environ 4 h (stérilisation : 3 h)", temperature: "200 °C puis 90 °C au bain-marie · 74 °C à coeur" },
  rendement: { valeur: 1, unite: "kg de pâté", uniteSing: "kg de pâté", pas: 0.5, min: 0.5 },
  ingredients: [
    { g: "Viande" },
    { t: "250 g de foie de porc", q: 250, u: "g", l: "de foie de porc" },
    { t: "750 g de gorge de porc + poitrine avec os", q: 750, u: "g", l: "de gorge de porc + poitrine avec os" },
    { t: "Crépine et barde" },
    { g: "Épicerie" },
    { t: "12 g de sel fin", q: 12, u: "g", l: "de sel fin" },
    { t: "10 g de sel nitrité", q: 10, u: "g", l: "de sel nitrité" },
    { t: "3 g de poivre gris moulu", q: 3, u: "g", l: "de poivre gris moulu" },
    { t: "1 g de 4 épices", q: 1, u: "g", l: "de 4 épices" },
    { t: "2 g de sucre (quantité estimée d'après des recettes de référence)", q: 2, u: "g", l: "de sucre (quantité estimée d'après des recettes de référence)" },
    { t: "1 feuille de laurier", q: 1, l: "feuilles de laurier", sg: "feuille de laurier" },
    { g: "Aromatisation" },
    { t: "10 g d'ail", q: 10, u: "g", l: "d'ail" },
    { t: "15 g d'échalotes", q: 15, u: "g", l: "d'échalotes" },
    { t: "30 g d'oignons", q: 30, u: "g", l: "d'oignons" },
    { t: "10 g de persil", q: 10, u: "g", l: "de persil" },
    { g: "Crémerie" },
    { t: "100 g de lait entier (à aromatiser)", q: 100, u: "g", l: "de lait entier (à aromatiser)" },
    { t: "Crème fraîche pour compléter le lait infusé à 100 g", pre: "Crème fraîche pour compléter le lait infusé à", q: 100, u: "g", l: "" },
    { t: "100 g d'oeufs entiers", q: 100, u: "g", l: "d'oeufs entiers" },
    { g: "Lait aromatisé" },
    { t: "1 carotte, 1 bouquet garni, 1 échalote, quelques os de la poitrine" },
    { g: "Cave" },
    { t: "250 g de vin blanc sec pour la marinade", q: 250, u: "g", l: "de vin blanc sec pour la marinade" },
    { t: "10 g de cognac pour la marinade", q: 10, u: "g", l: "de cognac pour la marinade" }
  ],
  etapes: [
    { g: "La veille" },
    ["Découper", "Couper en gros dés les morceaux de porc et le foie. Garder les os de la poitrine."],
    ["Mise au sel et marinade 24 h", "Bien mélanger les morceaux avec le sel, le sucre, le poivre, les 4 épices, le cognac et le vin blanc qui forment la marinade. Recouvrir d'un film alimentaire et garder au frais."],
    ["Préparer le lait aromatisé", "Faire chauffer les 100 g de lait avec 1 carotte, le bouquet garni, 1 échalote et quelques os de la poitrine pendant 15 minutes, puis laisser infuser jusqu'au lendemain."],
    { g: "Le lendemain" },
    ["Faire le gratin", "Ciseler les aromates. Graisser légèrement la poêle, prendre 10 % du foie et le faire cuire avec les aromates, sans coloration."],
    ["Compléter le lait", "Tamiser le lait aromatisé : une partie s'est évaporée. Le peser et compléter avec de la crème fraîche jusqu'à retrouver 100 g."],
    ["Hacher", "Hacher à la grille fine le foie et le gratin. Hacher à la grille grosse la gorge et la poitrine."],
    ["Mélanger", "Bien mélanger pour obtenir une farce homogène, puis ajouter les oeufs et le lait aromatisé."],
    ["Monter la terrine", "Barder la terrine et bien y tasser la préparation. Faire un quadrillage de barde sur le dessus, poser une feuille de laurier et recouvrir de crépine en la bordant bien sur tous les côtés."],
    { g: "Cuisson" },
    ["Cuire", "Enfourner à 200 °C pendant environ 10 minutes, puis à 90 °C pendant environ 4 heures au bain-marie. Le pâté est cuit quand il atteint 74 °C à coeur."],
    ["Stérilisation (facultatif)", "Pour une stérilisation : 3 heures à 100 °C."]
  ]
}
);

/* ============================ PLATS ============================ */
RECETTES.push(
{
  id: "boeuf-marrons", titre: "Boeuf aux marrons", sousTitre: "mijoté tendre et réconfortant",
  categorie: "Plats", image: "img/boeuf-marrons.jpg",
  infos: { parts: "6 personnes", preparation: "25 min", cuisson: "2 h 15", temperature: "Mijotage à feu doux" },
  rendement: { valeur: 6, unite: "personnes", uniteSing: "personne", pas: 1, min: 1 },
  ingredients: [
    { t: "1,2 kg de boeuf à mijoter (paleron, macreuse, joue ou jarret)", q: 1.2, u: "kg", l: "de boeuf à mijoter (paleron, macreuse, joue ou jarret)" },
    { t: "400 g de marrons cuits au naturel", q: 400, u: "g", l: "de marrons cuits au naturel" },
    { t: "2 oignons", q: 2, l: "oignons", sg: "oignon" },
    { t: "3 carottes", q: 3, l: "carottes", sg: "carotte" },
    { t: "2 gousses d'ail", q: 2, l: "gousses d'ail", sg: "gousse d'ail" },
    { t: "20 cl de vin rouge", q: 20, u: "cl", l: "de vin rouge" },
    { t: "60 cl de bouillon de boeuf", q: 60, u: "cl", l: "de bouillon de boeuf" },
    { t: "2 c. à soupe de farine", q: 2, u: "c. à soupe", l: "de farine" },
    { t: "2 c. à soupe d'huile", q: 2, u: "c. à soupe", l: "d'huile" },
    { t: "20 g de beurre", q: 20, u: "g", l: "de beurre" },
    { t: "1 bouquet garni", q: 1, l: "bouquets garnis", sg: "bouquet garni" },
    { t: "Sel et poivre" }
  ],
  etapes: [
    ["Préparer les ingrédients", "Couper le boeuf en gros cubes. Émincer les oignons, tailler les carottes en morceaux et hacher l'ail. Égoutter délicatement les marrons."],
    ["Faire dorer le boeuf", "Chauffer l'huile dans une cocotte. Faire colorer la viande en plusieurs fois pour éviter qu'elle ne rende trop d'eau, puis la réserver."],
    ["Préparer la base aromatique", "Faire fondre le beurre dans la cocotte. Ajouter les oignons et les carottes, puis cuire 5 minutes. Ajouter l'ail et la farine, puis mélanger pendant 1 minute."],
    ["Laisser mijoter", "Verser le vin rouge et gratter les sucs de cuisson. Remettre le boeuf, ajouter le bouillon et le bouquet garni. Couvrir et laisser mijoter à feu doux pendant 1 h 45 à 2 heures, jusqu'à ce que la viande soit tendre."],
    ["Ajouter les marrons", "Incorporer les marrons sans les écraser et poursuivre la cuisson à découvert pendant 20 minutes, afin que la sauce épaississe légèrement."],
    ["Servir", "Retirer le bouquet garni, rectifier l'assaisonnement et servir bien chaud dans des assiettes creuses."]
  ]
},
{
  id: "cassoulet", titre: "Cassoulet", sousTitre: "aux haricots blancs, confit de canard et saucisses de Toulouse",
  categorie: "Plats", image: "img/cassoulet.jpg",
  infos: { parts: "8 à 10 personnes", preparation: "30 min + trempage", cuisson: "Environ 2 h 15", temperature: "Cocotte puis four · température non indiquée" },
  rendement: { valeur: 1, unite: "recettes", uniteSing: "recette", pas: 0.5, min: 0.5, aide: "1 recette = 8 à 10 personnes" },
  ingredients: [
    { t: "1 jarret demi-sel", q: 1, l: "jarrets demi-sel", sg: "jarret demi-sel" },
    { t: "1 kg de poitrine fraîche ou fumée", q: 1, u: "kg", l: "de poitrine fraîche ou fumée" },
    { t: "4 saucisses fraîches de Toulouse", q: 4, l: "saucisses fraîches de Toulouse", sg: "saucisse fraîche de Toulouse" },
    { t: "Saucisson à l'ail - quantité non indiquée" },
    { t: "Haricots blancs secs - quantité non indiquée" },
    { t: "Cuisses de canard confites - quantité non indiquée" },
    { t: "1 échalote", q: 1, l: "échalotes", sg: "échalote" },
    { t: "2 gousses d'ail", q: 2, l: "gousses d'ail", sg: "gousse d'ail" },
    { t: "1 bouquet garni", q: 1, l: "bouquets garnis", sg: "bouquet garni" },
    { t: "2 c. à soupe de concentré de tomates", q: 2, u: "c. à soupe", l: "de concentré de tomates" },
    { t: "2 tomates pelées - facultatif", q: 2, l: "tomates pelées - facultatif", sg: "tomate pelée - facultatif" },
    { t: "1/2 verre d'eau", q: 0.5, l: "verres d'eau", sg: "verre d'eau" },
    { t: "Graisse du confit de canard" }
  ],
  etapes: [
    ["La veille - Faire tremper les haricots", "Mettre les haricots blancs secs à tremper dans un grand volume d'eau froide pendant toute une nuit."],
    ["Faire revenir les viandes", "Faire revenir les morceaux de viande dans la graisse du confit de canard, puis les réserver."],
    ["Préparer les aromates", "Dans les sucs de cuisson, faire revenir l'échalote et les 2 gousses d'ail hachées."],
    ["Précuire les haricots", "Ajouter les haricots égouttés et couvrir d'eau non salée. Ajouter le bouquet garni et le concentré de tomates, puis cuire de 30 à 45 minutes. Ajouter les tomates pelées si souhaité."],
    ["Cuire les viandes", "Retirer les haricots du jus et les remplacer par les viandes réservées. Laisser cuire pendant 1 heure."],
    ["Monter le cassoulet", "Dans une cassole, disposer au fond la couenne du jarret. Assembler le cassoulet en alternant les haricots et les viandes, puis ajouter les saucisses de Toulouse et le saucisson à l'ail."],
    ["Ajouter le jus", "Recouvrir avec le jus de cuisson et ajouter un demi-verre d'eau. Répartir un peu de graisse du confit sur le dessus."],
    ["Cuire au four", "Mettre au four pendant environ 45 minutes, jusqu'à ce que le dessus soit bien doré. Le cassoulet peut être préparé à l'avance et réchauffé le lendemain."]
  ]
},
{
  id: "langue-boeuf-sauce-piquante", titre: "Langue de boeuf, sauce piquante", sousTitre: "aux cornichons, mijotée en deux temps",
  categorie: "Plats", image: "img/langue-boeuf-sauce-piquante.jpg",
  infos: { parts: "8 personnes", preparation: "35 min + repos une nuit", cuisson: "30 min/kg à la cocotte-minute + mijotage", temperature: "Sous pression puis feu doux" },
  rendement: { valeur: 8, unite: "personnes", uniteSing: "personne", pas: 1, min: 1 },
  ingredients: [
    { t: "1 langue de boeuf", q: 1, l: "langues de boeuf", sg: "langue de boeuf" },
    { t: "2 carottes", q: 2, l: "carottes", sg: "carotte" },
    { t: "1 oignon coupé en deux et brûlé", q: 1, l: "oignons coupés en deux et brûlés", sg: "oignon coupé en deux et brûlé" },
    { t: "2 à 3 gousses d'ail", q: [2, 3], l: "gousses d'ail", sg: "gousse d'ail" },
    { t: "1 bouquet garni", q: 1, l: "bouquets garnis", sg: "bouquet garni" },
    { t: "1 poireau ou 1 branche de céleri" },
    { t: "Gros sel" },
    { t: "Eau" },
    { t: "3 échalotes", q: 3, l: "échalotes", sg: "échalote" },
    { t: "30 à 40 g de beurre pour la sauce", q: [30, 40], u: "g", l: "de beurre pour la sauce" },
    { t: "30 g de farine", q: 30, u: "g", l: "de farine" },
    { t: "15 à 20 cl de vinaigre de vin blanc, ou mélange vinaigre et vin blanc sec", q: [15, 20], u: "cl", l: "de vinaigre de vin blanc, ou mélange vinaigre et vin blanc sec" },
    { t: "25 à 30 cl de bouillon de cuisson filtré", q: [25, 30], u: "cl", l: "de bouillon de cuisson filtré" },
    { t: "1 c. à café de moutarde forte - facultatif mais recommandé", q: 1, u: "c. à café", l: "de moutarde forte - facultatif mais recommandé" },
    { t: "80 à 100 g de cornichons", q: [80, 100], u: "g", l: "de cornichons" },
    { t: "Persil haché" },
    { t: "Estragon ou cerfeuil - facultatif" },
    { t: "Sel et poivre du moulin" },
    { t: "Purée, pommes vapeur ou riz pour accompagner" }
  ],
  etapes: [
    ["Préparer la langue", "Rincer la langue. Si elle a dégorgé dans l'eau, jeter cette eau. La placer dans la cocotte-minute, couvrir d'eau froide et ajouter les carottes, l'oignon coupé en deux et brûlé, l'ail, le bouquet garni, le poireau ou le céleri et le gros sel."],
    ["Cuire à la cocotte-minute", "Fermer la cocotte et compter 30 minutes de cuisson sous pression par kilogramme de langue. La langue est prête lorsqu'un couteau s'y enfonce facilement et que la peau commence à se décoller."],
    ["Peler et trancher", "Sortir la langue, la laisser tiédir quelques minutes, puis retirer entièrement la peau. La couper en tranches d'environ 1 cm et les réserver sur une planche. Filtrer et conserver le bouillon de cuisson."],
    ["Préparer le roux brun", "Faire fondre le beurre dans une casserole à feu moyen. Ajouter la farine, mélanger et cuire 1 à 2 minutes en remuant, jusqu'à obtenir une coloration brune prononcée et faire disparaître le goût de farine crue."],
    ["Réduire le vinaigre", "Verser le vinaigre, avec le vin blanc si souhaité, puis laisser réduire de moitié à deux tiers. Le liquide doit devenir légèrement sirupeux."],
    ["Terminer la sauce piquante", "Verser progressivement le bouillon de cuisson chaud en fouettant pour éviter les grumeaux. Laisser mijoter 8 à 12 minutes à feu doux. Ajouter la moutarde si souhaité, puis saler et poivrer."],
    ["Premier mijotage", "Verser la sauce dans le reste du jus de cuisson, ajouter les tranches de langue et laisser mijoter doucement pendant 1 h 30. Arrêter la cuisson, laisser refroidir et conserver au frais jusqu'au lendemain."],
    ["Reprendre la cuisson le lendemain", "Le lendemain, remettre à mijoter doucement, éventuellement en plusieurs fois, jusqu'à ce que la langue soit parfaitement moelleuse et bien imprégnée de sauce."],
    ["Ajouter les cornichons", "Couper les cornichons en rondelles ou en julienne et les incorporer en fin de cuisson. Ajouter le persil haché, ainsi qu'un peu d'estragon ou de cerfeuil si souhaité."],
    ["Servir", "Servir les tranches nappées de sauce bien chaude, avec une purée de pommes de terre, des pommes vapeur ou du riz. Si la sauce est trop acide, ajouter une très petite pincée de sucre ou un peu de beurre froid."]
  ]
},
{
  id: "paella-fernande", titre: "Paella de Fernande", sousTitre: "au poulet, moules, langoustines et chorizo",
  categorie: "Plats", image: "img/paella-fernande.jpg",
  infos: { parts: "8 personnes", preparation: "45 min", cuisson: "Environ 45 min", temperature: "Feu vif puis feu doux" },
  rendement: { valeur: 8, unite: "personnes", uniteSing: "personne", pas: 1, min: 1 },
  ingredients: [
    { t: "1 poulet de 1,5 à 2 kg", q: 1, l: "poulets de 1,5 à 2 kg", sg: "poulet de 1,5 à 2 kg" },
    { t: "2 litres de moules", q: 2, l: "litres de moules", sg: "litre de moules" },
    { t: "1 kg de langoustines", q: 1, u: "kg", l: "de langoustines" },
    { t: "500 g d'encornets", q: 500, u: "g", l: "d'encornets" },
    { t: "1 chorizo", q: 1, l: "chorizos", sg: "chorizo" },
    { t: "400 g de riz", q: 400, u: "g", l: "de riz" },
    { t: "6 c. à soupe d'huile d'olive", q: 6, u: "c. à soupe", l: "d'huile d'olive" },
    { t: "4 tomates", q: 4, l: "tomates", sg: "tomate" },
    { t: "2 gros poivrons verts", q: 2, l: "gros poivrons verts", sg: "gros poivron vert" },
    { t: "2 piments doux ou du piment en poudre", q: 2, l: "piments doux ou du piment en poudre", sg: "piment doux ou du piment en poudre" },
    { t: "2 gros oignons", q: 2, l: "gros oignons", sg: "gros oignon" },
    { t: "2 gousses d'ail", q: 2, l: "gousses d'ail", sg: "gousse d'ail" },
    { t: "1 pincée de safran", q: 1, l: "pincées de safran", sg: "pincée de safran" },
    { t: "1 litre de court-bouillon", q: 1, l: "litres de court-bouillon", sg: "litre de court-bouillon" },
    { t: "4 verres d'eau", q: 4, l: "verres d'eau", sg: "verre d'eau" },
    { t: "Sel et poivre" }
  ],
  etapes: [
    ["Faire dorer le poulet", "Découper le poulet en morceaux et le faire revenir dans l'huile très chaude. Lorsque les morceaux sont bien dorés, les retirer et réserver également leur jus de cuisson."],
    ["Ouvrir les moules", "Faire ouvrir les moules à feu vif. Garder leur chair dans une moitié de coquille, passer leur jus au tamis fin et le réserver."],
    ["Cuire les langoustines", "Préparer le court-bouillon. Lorsqu'il bout, y plonger les langoustines pendant environ 5 minutes. Les retirer et réserver la valeur d'un demi-verre de court-bouillon."],
    ["Préparer les légumes et les garnitures", "Faire revenir les tomates dans l'huile. Couper les encornets en fines lanières, le chorizo en rondelles, les piments et les poivrons en morceaux, puis les ajouter aux tomates avec l'ail haché."],
    ["Faire revenir le riz", "Dans la poêle à paella, faire dorer les oignons finement hachés. Lorsqu'ils sont bien blonds, ajouter le riz et le faire revenir pendant 2 minutes en remuant sans arrêt avec une spatule en bois."],
    ["Mouiller et assaisonner", "Ajouter 4 verres d'eau, le jus des moules, le jus du poulet et le court-bouillon réservés. Saler, poivrer, saupoudrer de safran et mélanger rapidement."],
    ["Ajouter la garniture", "Verser les encornets, le chorizo, les tomates, les piments doux, les poivrons et l'ail. Laisser cuire 15 minutes."],
    ["Terminer la cuisson", "Disposer sur le riz les morceaux de poulet, les langoustines et les moules. Ne plus remuer. Poursuivre la cuisson à feu doux pendant encore 15 minutes."],
    ["Laisser gonfler le riz", "Éteindre le feu et recouvrir la paella d'un torchon propre pour permettre au riz d'achever de gonfler. Servir 10 minutes plus tard."]
  ]
}
);
RECETTES.push(
{
  id: "quenelles-poisson-nantua", titre: "Quenelles de poisson, sauce Nantua", sousTitre: "spécialité lyonnaise légère et fondante",
  categorie: "Plats", image: "img/quenelles-poisson-nantua.jpg",
  infos: { parts: "8 personnes", preparation: "45 min + repos", cuisson: "25 à 30 min", temperature: "Frémissement puis four à 180-200 °C" },
  rendement: { valeur: 8, unite: "personnes", uniteSing: "personne", pas: 1, min: 1 },
  ingredients: [
    { t: "40 cl de lait pour la panade", q: 40, u: "cl", l: "de lait pour la panade" },
    { t: "200 g de farine pour la panade", q: 200, u: "g", l: "de farine pour la panade" },
    { t: "100 g de beurre pour la panade", q: 100, u: "g", l: "de beurre pour la panade" },
    { t: "Sel pour la panade" },
    { t: "500 g de chair de poisson blanc sans peau ni arêtes", q: 500, u: "g", l: "de chair de poisson blanc sans peau ni arêtes" },
    { t: "150 g de beurre mou pour la farce", q: 150, u: "g", l: "de beurre mou pour la farce" },
    { t: "7 oeufs entiers en moyenne, 6 à 8 selon leur taille", q: 7, l: "oeufs entiers en moyenne, selon leur taille", sg: "oeuf entier en moyenne, selon sa taille" },
    { t: "1 blanc d'oeuf supplémentaire - facultatif", q: 1, l: "blancs d'oeufs supplémentaires - facultatif", sg: "blanc d'oeuf supplémentaire - facultatif" },
    { t: "Sel, poivre blanc et noix de muscade pour la farce" },
    { t: "Eau salée frémissante ou court-bouillon léger" },
    { t: "1 litre de sauce Nantua, prête ou maison", q: 1, l: "litres de sauce Nantua, prête ou maison", sg: "litre de sauce Nantua, prête ou maison" },
    { t: "Beurre pour le plat" },
    { t: "Fromage râpé - facultatif" },
    { t: "Riz ou pommes de terre vapeur pour accompagner - facultatif" }
  ],
  etapes: [
    ["Préparer la panade", "Porter le lait à ébullition avec le beurre et une pincée de sel. Hors du feu, verser la farine en une seule fois et mélanger vigoureusement jusqu'à obtenir une pâte lisse."],
    ["Dessécher et refroidir", "Remettre sur feu doux et dessécher la panade 2 à 3 minutes en remuant constamment, jusqu'à ce qu'elle se détache des parois. Laisser refroidir complètement, puis réserver au frais de 30 minutes à 1 heure."],
    ["Préparer la farce", "Mixer très finement la chair de poisson bien froide. Ajouter la panade froide, le beurre mou, le sel, le poivre blanc et la muscade."],
    ["Incorporer les oeufs", "Ajouter 6 à 8 oeufs entiers, selon leur taille, un par un en mixant bien entre chaque ajout, jusqu'à obtenir une pâte très lisse et homogène. Si elle reste trop ferme, incorporer 1 à 2 blancs d'oeufs supplémentaires."],
    ["Faire raffermir", "Réserver la farce au réfrigérateur au moins 1 à 2 heures, idéalement 3 heures ou toute une nuit. Elle doit rester bien froide pour faciliter le façonnage."],
    ["Former les quenelles", "Porter une grande quantité d'eau salée ou de court-bouillon à frémissement, sans forte ébullition. Former environ 16 quenelles ovoïdes avec deux cuillères à soupe trempées dans l'eau chaude."],
    ["Pocher", "Plonger les quenelles par petites quantités. Cuire 12 à 15 minutes à feu doux, les retourner à mi-cuisson, puis les égoutter délicatement sur un torchon propre ou une grille."],
    ["Napper de sauce Nantua", "Beurrer un plat à gratin, y disposer les quenelles et les napper généreusement de sauce Nantua. Ajouter un peu de fromage râpé si souhaité."],
    ["Gratiner et servir", "Enfourner à 180-200 °C pendant 10 à 15 minutes pour réchauffer et gratiner. Servir aussitôt, avec du riz ou des pommes de terre vapeur."]
  ]
},
{
  id: "boudin-blanc", titre: "Boudin blanc", sousTitre: "calculateur d'après le classeur de pesée",
  categorie: "Plats", image: "img/boudin-blanc.jpg", calcul: true,
  infos: { parts: "1 kg de préparation fait environ 8 boudins de 125 g", preparation: "3h", cuisson: "15 à 20 min", temperature: "Pochage 75-85 °C" },
  rendement: { valeur: 1980, depart: 1000, unite: "g de préparation", uniteSing: "g de préparation", pas: 250, min: 500, libelle: "Quantité de préparation", masseViande: 1.98 },
  ingredients: [
    { g: "Viande" },
    { t: "Maigre 75 % : épaule de veau, poitrine de porc ou volaille", q: 750, u: "g", l: "de maigre (épaule de veau, poitrine de porc ou volaille)" },
    { t: "Gras 25 % : gorge de porc ou poitrine grasse", q: 250, u: "g", l: "de gras (gorge de porc ou poitrine grasse)" },
    { g: "Farce" },
    { t: "Mie de pain : 23 %", q: 230, u: "g", l: "de mie de pain" },
    { t: "Lait demi-écrémé aromatisé : 50 %", q: 500, u: "g", l: "de lait demi-écrémé aromatisé" },
    { t: "Crème fraîche de ferme pour compenser la perte de lait évaporée" },
    { t: "Oignon cuit au beurre et singé à la Maïzena : 12 %", q: 120, u: "g", l: "d'oignon cuit au beurre et singé à la Maïzena" },
    { t: "Maïzena pour singer : 100 g pour 5 kg de préparation", q: 39.6, u: "g", l: "de Maïzena pour singer" },
    { t: "Œufs entiers : 25 %, soit environ 1 œuf pour 50 g", q: 250, u: "g", l: "d'œufs entiers", oeufsPour: 50 },
    { g: "Épicerie (sur la masse totale de la préparation)" },
    { t: "Sel fin : 1,5 %", q: 29.7, u: "g", l: "de sel fin" },
    { t: "Poivre blanc : 0,25 %", q: 4.95, u: "g", precis: true, l: "de poivre blanc" },
    { t: "Quatre-épices : 0,1 % — optionnel", q: 1.98, u: "g", precis: true, l: "de quatre-épices — optionnel" },
    { t: "Noix de muscade : 0,1 % — optionnelle", q: 1.98, u: "g", precis: true, l: "de noix de muscade — optionnelle" },
    { t: "Porto blanc, cognac ou madère : 100 g pour 5 kg de préparation — optionnel", q: 39.6, u: "g", l: "de porto blanc, cognac ou madère — optionnel" },
    { t: "Truffe : minimum 3 % pour l'appellation truffée — optionnelle", q: 59.4, u: "g", l: "de truffe au minimum — optionnelle, pour l'appellation truffée" },
    { t: "Boyaux", q: 2.38, u: "m", l: "de boyau (environ 15 cm par boudin de 125 g)" }
  ],
  etapes: [
    ["Infuser le lait + déssaler  boyaux", "La veille ou le jour même, mettre le lait dans une casserole avec les carottes et les oignons coupés en gros morceaux ainsi que le bouquet garni. Porter juste à ébullition, puis laisser infuser 10 à 15 minutes à feu doux. Filtrer, puis peser le lait filtré afin de calculer la quantité de crème à ajouter. Laisser tiédir, idéalement autour de 50-60 °C."],
    ["Préparer les aromates", "Émincer finement les échalotes ou l'oignon. Les faire suer doucement dans le beurre sans coloration jusqu'à transparence. En fin de cuisson, saupoudrer la Maïzena et mélanger 1 à 2 minutes pour singer les aromates et former un liant, puis réserver."],
    ["Préparer la panade", "Détremper la mie de pain dans une partie du lait infusé tiède jusqu'à obtenir une pâte homogène. Ajouter éventuellement le porto."],
    ["Hacher les viandes", "Hacher finement le gras de porc, puis le maigre, avec la grille la plus fine. Si possible, repasser une seconde fois. Garder la viande bien froide ; la placer 15 à 20 minutes au congélateur si nécessaire."],
    ["Monter la farce", "Mélanger les viandes avec le sel, le poivre, la muscade et le quatre-épices. Ajouter les oeufs un à un, puis les aromates liés à la Maïzena et la panade. Verser progressivement le lait infusé tiède en mélangeant énergiquement 3 à 5 minutes, jusqu'à obtenir une farce lisse, liée et onctueuse. Si elle est trop ferme, ajouter un peu de lait ; si elle est trop liquide, un peu de fécule."],
    ["Embosser", "Rincer les boyaux qui ont été dessalés et les enfiler sur le poussoir ou l'entonnoir. Remplir sans trop tasser. Former des boudins de 12 à 15 cm, torsader ou attacher les extrémités et piquer délicatement les éventuelles bulles d'air."],
    ["Pocher", "Chauffer une grande quantité d'eau à 80-85 °C maximum, sans jamais faire bouillir. Plonger les boudins et cuire 15 à 20 minutes en maintenant l'eau entre 75 et 85 °C."],
    ["Refroidir", "Plonger immédiatement les boudins quelques minutes dans de l'eau glacée. Les essuyer sur un linge propre et les réserver au réfrigérateur."],
    ["Conserver et servir", "Conserver 4 à 5 jours au réfrigérateur, sous vide ou filmés, ou plusieurs mois au congélateur. Réchauffer à la poêle dans un peu de beurre, 8 à 10 minutes à feu doux, ou au four à 160-170 °C. Ne pas piquer."]
  ]
},
{
  id: "polenta", titre: "Gâteau de polenta au mascarpone", sousTitre: "au mascarpone gratiné",
  categorie: "Plats", image: "img/polenta.jpg",
  infos: { parts: "6 personnes", preparation: "20 min", cuisson: "25 min + 10 à 12 min", temperature: "190 °C + 210 °C" },
  rendement: { valeur: 6, unite: "personnes", uniteSing: "personne", pas: 1, min: 1 },
  ingredients: [
    { t: "180 g de polenta fine", q: 180, u: "g", l: "de polenta fine" },
    { t: "75 cl de lait entier", q: 75, u: "cl", l: "de lait entier" },
    { t: "30 g de beurre", q: 30, u: "g", l: "de beurre" },
    { t: "2 oeufs pour la base", q: 2, l: "oeufs pour la base", sg: "oeuf pour la base" },
    { t: "60 g de parmesan râpé", q: 60, u: "g", l: "de parmesan râpé" },
    { t: "Sel, poivre et muscade" },
    { t: "250 g de mascarpone", q: 250, u: "g", l: "de mascarpone" },
    { t: "1 oeuf pour le dessus", q: 1, l: "oeufs pour le dessus", sg: "oeuf pour le dessus" },
    { t: "2 c. à soupe de lait", q: 2, u: "c. à soupe", l: "de lait" },
    { t: "40 g de parmesan", q: 40, u: "g", l: "de parmesan" }
  ],
  etapes: [
    ["Cuire la polenta", "Chauffer le lait avec le beurre et l'assaisonnement. Verser la polenta en pluie et cuire 5 à 7 minutes en remuant."],
    ["Ajouter le parmesan et les oeufs", "Hors du feu, incorporer le parmesan prévu pour la polenta. Laisser tiédir 5 minutes, puis ajouter les oeufs battus prévus pour la base. Si le réglage indique une fraction d'oeuf, battre un oeuf et prélever la fraction nécessaire."],
    ["Cuire le gâteau", "Pour 6 parts, verser dans un moule carré beurré d'environ 21 × 21 cm. Si le nombre de convives change, adapter la taille du moule à la quantité de préparation. Enfourner environ 25 minutes à 190 °C, en vérifiant la cuisson selon l'épaisseur."],
    ["Gratiner au mascarpone", "Mélanger le mascarpone, l'oeuf prévu pour le dessus, le lait et le parmesan restant. Étaler, puis gratiner environ 10 à 12 minutes à 210 °C. Laisser tiédir et découper le gâteau carré en 6 portions rectangulaires."]
  ]
}
);

/* ============================ DESSERTS ============================ */
RECETTES.push(
{
  id: "clafoutis-pommes-tatin", titre: "Clafoutis aux pommes façon Tatin", sousTitre: "pommes caramélisées et flambées au calvados",
  categorie: "Desserts", image: "img/clafoutis-pommes-tatin.jpg",
  infos: { parts: "6 parts environ", preparation: "25 min", cuisson: "Environ 30 min", temperature: "180 °C" },
  rendement: { valeur: 6, unite: "parts", uniteSing: "part", pas: 1, min: 1 },
  ingredients: [
    { t: "4 pommes", q: 4, l: "pommes", sg: "pomme" },
    { t: "25 cl de lait", q: 25, u: "cl", l: "de lait" },
    { t: "25 cl de crème fluide", q: 25, u: "cl", l: "de crème fluide" },
    { t: "100 g de farine, ou moitié farine et moitié Maïzena", q: 100, u: "g", l: "de farine, ou moitié farine et moitié Maïzena" },
    { t: "3 oeufs", q: 3, l: "oeufs", sg: "oeuf" },
    { t: "100 g de sucre", q: 100, u: "g", l: "de sucre" },
    { t: "Quelques gouttes de vanille concentrée" },
    { t: "25 g de beurre et un peu de sucre pour le caramel", q: 25, u: "g", l: "de beurre et un peu de sucre pour le caramel" },
    { t: "Calvados pour flamber" }
  ],
  etapes: [
    ["Préparer les pommes", "Éplucher les pommes, retirer le coeur et les couper en quartiers ou en tranches épaisses."],
    ["Faire le caramel", "Faire fondre le beurre avec un peu de sucre. Dès que le caramel est prêt, ajouter les pommes et bien les enrober."],
    ["Flamber les pommes", "Verser un peu de calvados sur les pommes et les flamber avec précaution. Réserver."],
    ["Blanchir les oeufs", "Fouetter les oeufs avec les 100 g de sucre jusqu'à ce que le mélange blanchisse."],
    ["Préparer la pâte", "Ajouter la crème, le lait et quelques gouttes de vanille. Incorporer ensuite la farine en la tamisant."],
    ["Monter le clafoutis", "Disposer les pommes caramélisées dans un plat à tarte, puis verser la pâte par-dessus."],
    ["Cuire", "Enfourner à 180 °C pendant environ 30 minutes, jusqu'à ce que le clafoutis soit pris et bien doré."]
  ]
},
{
  id: "coulant-chocolat", titre: "Coulant au chocolat", sousTitre: "au coeur chaud et fondant",
  categorie: "Desserts", image: "img/coulant-chocolat.jpg",
  infos: { parts: "6 personnes", preparation: "15 min", cuisson: "11 min", temperature: "210 °C · repos 5 min" },
  rendement: { valeur: 6, unite: "personnes", uniteSing: "personne", pas: 1, min: 1 },
  ingredients: [
    { t: "100 g de chocolat noir", q: 100, u: "g", l: "de chocolat noir" },
    { t: "150 g de beurre demi-sel", q: 150, u: "g", l: "de beurre demi-sel" },
    { t: "150 g de sucre en poudre", q: 150, u: "g", l: "de sucre en poudre" },
    { t: "3 oeufs", q: 3, l: "oeufs", sg: "oeuf" },
    { t: "50 g de farine", q: 50, u: "g", l: "de farine" }
  ],
  etapes: [
    ["Faire fondre", "Faire fondre le chocolat noir et le beurre demi-sel au bain-marie."],
    ["Ajouter le sucre", "Ajouter le sucre et mélanger jusqu'à ce que la préparation soit brillante."],
    ["Incorporer les oeufs", "Ajouter les oeufs un par un en mélangeant entre chaque ajout."],
    ["Ajouter la farine", "Tamiser la farine, puis l'incorporer à la préparation jusqu'à obtenir une pâte homogène."],
    ["Remplir les moules", "Répartir la pâte dans des moules à muffins en les remplissant aux trois quarts."],
    ["Cuire les coulants", "Enfourner à 210 °C pendant 11 minutes pour garder le coeur coulant."],
    ["Laisser reposer", "Attendre 5 minutes avant de démouler délicatement et de servir."]
  ]
},
{
  id: "crumble-aux-pommes", titre: "Crumble aux pommes", sousTitre: "aux noisettes et à la vanille",
  categorie: "Desserts", image: "img/crumble-aux-pommes.jpg",
  infos: { parts: "1 plat · dimensions à préciser", preparation: "20 min", cuisson: "Environ 35 min", temperature: "210 °C" },
  rendement: { valeur: 1, unite: "plats", uniteSing: "plat", pas: 0.5, min: 0.5 },
  ingredients: [
    { t: "6 belles pommes", q: 6, l: "belles pommes", sg: "belle pomme" },
    { t: "1 sachet de sucre vanillé", q: 1, l: "sachets de sucre vanillé", sg: "sachet de sucre vanillé" },
    { t: "3 pincées de vanille en poudre", q: 3, l: "pincées de vanille en poudre", sg: "pincée de vanille en poudre" },
    { t: "125 g de beurre", q: 125, u: "g", l: "de beurre" },
    { t: "150 g de farine", q: 150, u: "g", l: "de farine" },
    { t: "50 g de poudre de noisette", q: 50, u: "g", l: "de poudre de noisette" },
    { t: "150 g de sucre roux", q: 150, u: "g", l: "de sucre roux" }
  ],
  etapes: [
    ["Préparer les pommes", "Éplucher les pommes et les couper en petits morceaux. Les saupoudrer de sucre vanillé et de vanille en poudre, mélanger puis les répartir au fond du plat."],
    ["Ramollir le beurre", "Couper le beurre en morceaux et le faire ramollir légèrement au micro-ondes ou à température ambiante."],
    ["Préparer les poudres", "Dans un saladier, mélanger la farine, la poudre de noisette et le sucre roux. Ajouter le beurre ramolli."],
    ["Sabler le crumble", "Malaxer la préparation avec les mains, puis l'émietter entre les doigts pour lui donner une consistance sableuse."],
    ["Monter le crumble", "Répartir uniformément la pâte à crumble sur les pommes."],
    ["Cuire", "Enfourner à 210 °C pendant environ 35 minutes, jusqu'à ce que le dessus soit bien doré."]
  ]
},
{
  id: "flan-patissier-quentin-lechat", titre: "Flan pâtissier de Quentin Lechat", sousTitre: "à la vanille, crémeux et généreux",
  categorie: "Desserts", image: "img/flan-patissier-quentin-lechat.jpg",
  infos: { parts: "8 personnes · cercle de 22 cm", preparation: "40 min + 4 h au frais", cuisson: "1 h à 1 h 10", temperature: "165 °C · chaleur tournante" },
  rendement: { valeur: 1, unite: "flans (cercle de 22 cm)", uniteSing: "flan (cercle de 22 cm)", pas: 0.5, min: 0.5, aide: "1 flan = 8 personnes" },
  ingredients: [
    { t: "1 pâte brisée pour un cercle de 22 cm", q: 1, l: "pâtes brisées pour un cercle de 22 cm", sg: "pâte brisée pour un cercle de 22 cm" },
    { t: "715 g de lait entier, si possible microfiltré", q: 715, u: "g", l: "de lait entier, si possible microfiltré" },
    { t: "130 g de sucre", q: 130, u: "g", l: "de sucre" },
    { t: "1 sachet de sucre vanillé", q: 1, l: "sachets de sucre vanillé", sg: "sachet de sucre vanillé" },
    { t: "165 g de jaunes d'oeufs", q: 165, u: "g", l: "de jaunes d'oeufs" },
    { t: "4 g de sel fin", q: 4, u: "g", l: "de sel fin" },
    { t: "60 g de Maïzena ou de poudre à crème", q: 60, u: "g", l: "de Maïzena ou de poudre à crème" },
    { t: "200 g de crème liquide à 30 % MG", q: 200, u: "g", l: "de crème liquide à 30 % MG" },
    { t: "100 g de beurre doux coupé en cubes", q: 100, u: "g", l: "de beurre doux coupé en cubes" },
    { t: "2 gousses de vanille", q: 2, l: "gousses de vanille", sg: "gousse de vanille" },
    { t: "Nappage neutre - facultatif" }
  ],
  etapes: [
    ["Foncer le cercle", "Foncer la pâte brisée en trois parties dans un cercle à mousse de 22 cm : un disque pour le fond et des bandes pour les côtés. Souder les raccords avec un peu d'eau, puis placer le fond de pâte au congélateur."],
    ["Infuser la vanille", "Fendre les gousses de vanille et récupérer les graines. Faire bouillir le lait avec les graines et les gousses, puis laisser infuser pendant 30 minutes."],
    ["Mélanger les jaunes", "Fouetter les jaunes d'oeufs avec le sucre et le sucre vanillé. Ajouter la Maïzena, ou la poudre à crème, et mélanger jusqu'à obtenir une pâte homogène et lisse."],
    ["Épaissir la crème", "Porter de nouveau le lait à ébullition. En verser la moitié sur le mélange aux oeufs, bien mélanger, puis reverser le tout dans le lait bouillant. Continuer à fouetter hors du feu afin de laisser la préparation épaissir."],
    ["Cuire la crème", "Remettre la casserole sur feu moyen et cuire sans cesser de fouetter. Dès que la crème bout, poursuivre la cuisson pendant 2 minutes en fouettant."],
    ["Incorporer beurre et crème", "Hors du feu, ajouter le beurre en cubes et la crème liquide. Fouetter pour bien les incorporer, puis retirer les gousses de vanille."],
    ["Choisir la finition", "Première option : verser la préparation chaude dans le fond de pâte congelé, lisser et réserver au réfrigérateur au moins 4 heures sans couvrir afin que le dessus croûte. Pour un flan plus crémeux : verser la crème dans un récipient, filmer au contact et réserver au frais au moins 4 heures ; la détendre ensuite au fouet, la verser dans le fond de pâte congelé et enfourner immédiatement."],
    ["Cuire le flan", "Enfourner à 165 °C en chaleur tournante pendant 1 heure à 1 heure 10, jusqu'à ce que le dessus soit bien coloré."],
    ["Napper", "Après la cuisson, appliquer un nappage neutre sur le dessus si souhaité. Laisser refroidir avant de démouler et de servir."]
  ]
},
{
  id: "fondant-aux-pommes", titre: "Fondant aux pommes", sousTitre: "moelleux, aux fines lamelles de pommes",
  categorie: "Desserts", image: "img/fondant-aux-pommes.jpg",
  infos: { parts: "1 gâteau · 6 à 8 parts", preparation: "20 min", cuisson: "Environ 45 min", temperature: "180 °C" },
  rendement: { valeur: 1, unite: "gâteaux", uniteSing: "gâteau", pas: 0.5, min: 0.5, aide: "1 gâteau = 6 à 8 parts" },
  ingredients: [
    { t: "5 pommes", q: 5, l: "pommes", sg: "pomme" },
    { t: "70 g de farine", q: 70, u: "g", l: "de farine" },
    { t: "1 yaourt nature", q: 1, l: "yaourts nature", sg: "yaourt nature" },
    { t: "1 sachet de levure chimique", q: 1, l: "sachets de levure chimique", sg: "sachet de levure chimique" },
    { t: "1 sachet de sucre vanillé", q: 1, l: "sachets de sucre vanillé", sg: "sachet de sucre vanillé" },
    { t: "2 oeufs", q: 2, l: "oeufs", sg: "oeuf" },
    { t: "70 g de beurre fondu", q: 70, u: "g", l: "de beurre fondu" },
    { t: "100 g de sucre en poudre", q: 100, u: "g", l: "de sucre en poudre" },
    { t: "1 pincée de sel", q: 1, l: "pincées de sel", sg: "pincée de sel" },
    { t: "1 bouchon de rhum", q: 1, l: "bouchons de rhum", sg: "bouchon de rhum" }
  ],
  etapes: [
    ["Blanchir les oeufs", "Dans un saladier, fouetter les 2 oeufs avec le sucre en poudre et le sucre vanillé jusqu'à ce que le mélange blanchisse."],
    ["Préparer la pâte", "Ajouter le yaourt, la farine tamisée et la levure chimique, puis mélanger jusqu'à obtenir une pâte homogène."],
    ["Parfumer", "Incorporer le beurre fondu, le rhum et la pincée de sel."],
    ["Ajouter les pommes", "Éplucher les pommes, les couper en fines lamelles puis les mélanger délicatement à la pâte."],
    ["Mettre en moule", "Verser la préparation dans un moule chemisé de papier sulfurisé et égaliser la surface."],
    ["Cuire", "Enfourner à 180 °C pendant environ 45 minutes, jusqu'à ce que le fondant soit bien doré et pris à coeur."]
  ]
}
);
RECETTES.push(
{
  id: "fondant-chocolat", titre: "Fondant au chocolat", sousTitre: "intense, moelleux et riche en chocolat",
  categorie: "Desserts", image: "img/fondant-chocolat.jpg",
  infos: { parts: "8 personnes", preparation: "15 min", cuisson: "8 min", temperature: "180 °C" },
  rendement: { valeur: 8, unite: "personnes", uniteSing: "personne", pas: 1, min: 1 },
  ingredients: [
    { t: "300 g de chocolat noir à 70-75 %", q: 300, u: "g", l: "de chocolat noir à 70-75 %" },
    { t: "4 oeufs entiers", q: 4, l: "oeufs entiers", sg: "oeuf entier" },
    { t: "2 jaunes d'oeufs", q: 2, l: "jaunes d'oeufs", sg: "jaune d'oeuf" },
    { t: "150 g de beurre", q: 150, u: "g", l: "de beurre" },
    { t: "150 g de sucre", q: 150, u: "g", l: "de sucre" },
    { t: "75 g de farine tamisée", q: 75, u: "g", l: "de farine tamisée" },
    { t: "Beurre et sucre pour les moules" }
  ],
  etapes: [
    ["Faire fondre", "Faire fondre le chocolat noir et le beurre au bain-marie, puis mélanger jusqu'à obtenir une préparation lisse."],
    ["Blanchir les oeufs", "Fouetter les 4 oeufs entiers et les 2 jaunes avec le sucre jusqu'à ce que le mélange blanchisse."],
    ["Réunir les préparations", "Verser le mélange chocolat-beurre sur les oeufs fouettés et mélanger délicatement."],
    ["Ajouter la farine", "Incorporer la farine tamisée jusqu'à obtenir une pâte homogène."],
    ["Préparer les moules", "Beurrer les moules, les saupoudrer de sucre sur toute la paroi intérieure, puis retirer l'excédent."],
    ["Remplir", "Répartir la pâte dans les moules préparés."],
    ["Cuire", "Enfourner à 180 °C pendant 8 minutes. Servir les fondants encore tièdes."]
  ]
},
{
  id: "mousse-chocolat", titre: "Mousse au chocolat", sousTitre: "aux crêpes dentelle",
  categorie: "Desserts", image: "img/mousse-chocolat.jpg",
  infos: { parts: "10 parts", preparation: "30 min", cuisson: "Sans cuisson", temperature: "Repos 2 h minimum" },
  rendement: { valeur: 10, unite: "parts", uniteSing: "part", pas: 1, min: 1 },
  ingredients: [
    { t: "200 g de chocolat noir concassé", q: 200, u: "g", l: "de chocolat noir concassé" },
    { t: "100 g de chocolat au lait concassé", q: 100, u: "g", l: "de chocolat au lait concassé" },
    { t: "17 cl de crème liquide entière à 35 % de MG", q: 17, u: "cl", l: "de crème liquide entière à 35 % de MG" },
    { t: "3 cl de lait entier", q: 3, u: "cl", l: "de lait entier" },
    { t: "9 blancs d'oeufs bio", q: 9, l: "blancs d'oeufs bio", sg: "blanc d'oeuf bio" },
    { t: "80 g de sucre en poudre", q: 80, u: "g", l: "de sucre en poudre" },
    { t: "Crêpes dentelle émiettées - quantité non indiquée" }
  ],
  etapes: [
    ["Fondre les chocolats", "Déposer le saladier contenant les chocolats concassés sur une casserole d'eau chaude. Laisser fondre au bain-marie et mélanger à feu doux."],
    ["Préparer une ganache lisse", "Chauffer la crème et le lait. Retirer le chocolat du bain-marie, puis verser progressivement les liquides chauds en mélangeant jusqu'à obtenir une ganache bien lisse."],
    ["Monter les blancs", "Monter les blancs en neige en incorporant d'abord une partie du sucre, puis les serrer avec le reste du sucre."],
    ["Incorporer délicatement", "Verser les blancs sur la préparation au chocolat et les incorporer délicatement au fouet. Finir à la maryse pour récupérer la préparation sur les bords. Ajouter les crêpes dentelle émiettées grossièrement."],
    ["Garnir et laisser prendre", "Répartir la mousse dans les ramequins. Placer au réfrigérateur au moins 2 heures avant de déguster, idéalement une nuit."]
  ]
},
{
  id: "omelette-norvegienne", titre: "Omelette norvégienne", sousTitre: "génoise, glace et meringue dorée",
  categorie: "Desserts", image: "img/omelette-norvegienne.jpg",
  infos: { parts: "8 personnes", preparation: "45 min + 4 à 6 h de congélation", cuisson: "15 à 20 min + 2 à 4 min sous le grill", temperature: "180 °C puis grill à 240-250 °C" },
  rendement: { valeur: 8, unite: "personnes", uniteSing: "personne", pas: 1, min: 1 },
  ingredients: [
    { t: "4 oeufs pour la génoise", q: 4, l: "oeufs pour la génoise", sg: "oeuf pour la génoise" },
    { t: "125 g de sucre semoule pour la génoise", q: 125, u: "g", l: "de sucre semoule pour la génoise" },
    { t: "125 g de farine", q: 125, u: "g", l: "de farine" },
    { t: "1 pincée de sel pour la génoise", q: 1, l: "pincées de sel pour la génoise", sg: "pincée de sel pour la génoise" },
    { t: "1 c. à café d'extrait de vanille - facultatif", q: 1, u: "c. à café", l: "d'extrait de vanille - facultatif" },
    { t: "50 g de sucre pour le sirop", q: 50, u: "g", l: "de sucre pour le sirop" },
    { t: "10 cl d'eau", q: 10, u: "cl", l: "d'eau" },
    { t: "2 à 3 c. à soupe de rhum, Grand Marnier ou Cointreau", q: [2, 3], u: "c. à soupe", l: "de rhum, Grand Marnier ou Cointreau" },
    { t: "800 ml à 1 L de glace bien ferme, parfum au choix", q: [800, 1000], u: "ml", l: "de glace bien ferme, parfum au choix" },
    { t: "4 blancs d'oeufs à température ambiante", q: 4, l: "blancs d'oeufs à température ambiante", sg: "blanc d'oeuf à température ambiante" },
    { t: "200 g de sucre semoule pour la meringue", q: 200, u: "g", l: "de sucre semoule pour la meringue" },
    { t: "1 pincée de sel pour la meringue", q: 1, l: "pincées de sel pour la meringue", sg: "pincée de sel pour la meringue" },
    { t: "Un peu de rhum ou de Grand Marnier pour flamber - facultatif" }
  ],
  etapes: [
    ["Préparer la génoise", "Préchauffer le four à 180 °C. Fouetter les oeufs entiers avec le sucre et, si souhaité, la vanille, jusqu'à ce que le mélange blanchisse, triple de volume et forme un ruban."],
    ["Incorporer la farine", "Ajouter délicatement la farine tamisée et le sel à la spatule. Verser dans un moule beurré et fariné de 20 à 22 cm, ou sur une plaque chemisée selon la forme souhaitée."],
    ["Cuire la génoise", "Enfourner pendant 15 à 20 minutes, jusqu'à ce que la génoise soit dorée et qu'un cure-dent en ressorte sec. Laisser refroidir complètement."],
    ["Préparer le sirop", "Faire bouillir l'eau et le sucre pendant 2 à 3 minutes. Hors du feu, ajouter l'alcool choisi, puis laisser tiédir."],
    ["Monter la glace", "Imbiber légèrement la génoise de sirop et la placer sur un plat allant au four. Tasser fermement la glace dessus, en couche ou en dôme. Recouvrir de film alimentaire et congeler au moins 4 à 6 heures, idéalement toute une nuit."],
    ["Préparer la meringue", "Monter les blancs en neige avec la pincée de sel. Lorsqu'ils deviennent mousseux, incorporer progressivement le sucre et fouetter jusqu'à obtenir une meringue ferme, brillante et formant un bec d'oiseau. Pour une tenue renforcée, la meringue italienne peut remplacer cette meringue."],
    ["Recouvrir entièrement", "Sortir le montage glacé du congélateur. Le recouvrir immédiatement et entièrement de meringue, à la spatule ou à la poche à douille. Ne laisser aucun trou afin que la glace soit parfaitement isolée."],
    ["Dorer au choix", "Sous le grill : enfourner 2 à 4 minutes à 240-250 °C en surveillant sans interruption. Au chalumeau : dorer uniformément toute la surface."],
    ["Flamber - facultatif", "Au moment de servir, verser un peu de rhum ou de Grand Marnier chaud sur la meringue et flamber avec précaution."],
    ["Servir", "Servir immédiatement pour profiter du contraste entre la meringue chaude et croustillante et la glace encore bien froide. Conserver les restes au congélateur."]
  ]
}
);
RECETTES.push(
{
  id: "savarin-francoise", titre: "Savarin de Françoise", sousTitre: "au sirop de rhum, crème fouettée ou fruits",
  categorie: "Desserts", image: "img/savarin-francoise.jpg",
  infos: { parts: "10 personnes", preparation: "20 min", cuisson: "Environ 45 min", temperature: "Four chaud · température non indiquée" },
  formats: [
    { id: "grand", libelle: "Savarin (10 personnes)", rendement: { valeur: 1, unite: "savarins", uniteSing: "savarin", pas: 1, min: 1 } },
    { id: "petit", libelle: "Petit savarin", rendement: { valeur: 1, unite: "petits savarins", uniteSing: "petit savarin", pas: 1, min: 1 },
      note: "Proportions de la fiche « pour un plus petit savarin » (étape 8). La fiche ne précise pas le sirop pour ce format : ses quantités sont celles du grand savarin et ne sont pas recalculées.",
      ingredients: [
        { t: "2 jaunes d'oeufs", q: 2, l: "jaunes d'oeufs", sg: "jaune d'oeuf" },
        { t: "100 g de sucre en poudre", q: 100, u: "g", l: "de sucre en poudre" },
        { t: "125 g de farine", q: 125, u: "g", l: "de farine" },
        { t: "4 cuillères à soupe de lait", q: 4, u: "c. à soupe", l: "de lait" },
        { t: "1 sachet de levure", q: 1, l: "sachets de levure", sg: "sachet de levure" },
        { t: "Beurre et sucre pour le moule" },
        { g: "Pour le sirop (quantités du grand savarin)" },
        { t: "2 verres d'eau" },
        { t: "150 à 200 g de sucre" },
        { t: "1 bon verre à vin de rhum" },
        { g: "" },
        { t: "Crème fouettée ou fruits pour servir" }
      ] }
  ],
  ingredients: [
    { t: "3 oeufs", q: 3, l: "oeufs", sg: "oeuf" },
    { t: "150 g de sucre en poudre", q: 150, u: "g", l: "de sucre en poudre" },
    { t: "180 g de farine", q: 180, u: "g", l: "de farine" },
    { t: "6 c. à soupe de lait", q: 6, u: "c. à soupe", l: "de lait" },
    { t: "1 sachet de levure alsacienne (levure chimique), mélangé à la farine", q: 1, l: "sachets de levure alsacienne (levure chimique), mélangés à la farine", sg: "sachet de levure alsacienne (levure chimique), mélangé à la farine" },
    { t: "Beurre et sucre pour le moule" },
    { g: "Pour le sirop" },
    { t: "2 verres d'eau", q: 2, l: "verres d'eau", sg: "verre d'eau" },
    { t: "150 à 200 g de sucre", q: [150, 200], u: "g", l: "de sucre" },
    { t: "1 bon verre à vin de rhum", q: 1, l: "bons verres à vin de rhum", sg: "bon verre à vin de rhum" },
    { g: "" },
    { t: "Crème fouettée ou fruits pour servir" }
  ],
  etapes: [
    ["Préparer les oeufs", "Séparer les blancs des jaunes. Travailler les jaunes d'oeufs avec le sucre pendant 3 minutes."],
    ["Former la pâte", "Ajouter le lait, puis la farine mélangée à la levure. Battre les blancs en neige et les incorporer délicatement."],
    ["Préparer le moule", "Beurrer un moule à savarin et le saupoudrer de sucre. Y verser la pâte."],
    ["Cuire le savarin", "Mettre à four chaud pendant environ 45 minutes. Vérifier la cuisson avec la pointe d'un couteau."],
    ["Préparer le sirop", "Faire bouillir les 2 verres d'eau avec 150 à 200 g de sucre. Retirer du feu, puis ajouter un bon verre à vin de rhum."],
    ["Imbiber", "Démouler le savarin, puis verser progressivement le sirop dessus afin qu'il s'en imprègne uniformément."],
    ["Servir", "Servir avec une crème fouettée ou des fruits."],
    ["Proportions pour un plus petit savarin", "Utiliser 2 jaunes d'oeufs, 100 g de sucre en poudre, 125 g de farine, 4 cuillères à soupe de lait et 1 sachet de levure."]
  ]
},
{
  id: "tarte-citron-meringuee", titre: "Tarte au citron meringuée", sousTitre: "sur crème d'amande et pâte brisée sucrée",
  categorie: "Desserts", image: "img/tarte-citron-meringuee.jpg",
  infos: { parts: "8 personnes", preparation: "45 min + refroidissement", cuisson: "Environ 45 min", temperature: "180 °C" },
  rendement: { valeur: 1, unite: "tartes", uniteSing: "tarte", pas: 0.5, min: 0.5, aide: "1 tarte = 8 personnes" },
  ingredients: [
    { t: "1 pâte brisée sucrée", q: 1, l: "pâtes brisées sucrées", sg: "pâte brisée sucrée" },
    { g: "Crème d'amande" },
    { t: "150 g de beurre", q: 150, u: "g", l: "de beurre" },
    { t: "150 g de sucre glace", q: 150, u: "g", l: "de sucre glace" },
    { t: "150 g de poudre d'amande", q: 150, u: "g", l: "de poudre d'amande" },
    { t: "150 g d'oeuf entier", q: 150, u: "g", l: "d'oeuf entier" },
    { g: "Crème au citron" },
    { t: "jus de 6 citrons", q: 6, pre: "jus de", l: "citrons", sg: "citron" },
    { t: "4 oeufs", q: 4, l: "oeufs", sg: "oeuf" },
    { t: "400 g de sucre", q: 400, u: "g", l: "de sucre" },
    { t: "240 g de beurre", q: 240, u: "g", l: "de beurre" },
    { t: "zeste d'un demi-citron", q: 0.5, pre: "zeste de", l: "citrons", sg: "citron" },
    { g: "Meringue italienne" },
    { t: "4 blancs d'oeufs", q: 4, l: "blancs d'oeufs", sg: "blanc d'oeuf" },
    { t: "1 c. à soupe de sucre", q: 1, u: "c. à soupe", l: "de sucre" },
    { t: "1 verre d'eau", q: 1, l: "verres d'eau", sg: "verre d'eau" },
    { t: "300 g de sucre", q: 300, u: "g", l: "de sucre" }
  ],
  etapes: [
    ["Préparer la crème d'amande", "Mélanger le beurre, le sucre glace, la poudre d'amande et les oeufs entiers jusqu'à obtenir une crème homogène."],
    ["Cuire le fond de tarte", "Foncer le moule avec la pâte brisée sucrée, étaler la crème d'amande sur le fond et cuire à 180 °C pendant environ 45 minutes. Laisser refroidir."],
    ["Commencer la crème au citron", "Au bain-marie, fouetter les 4 oeufs avec les 400 g de sucre et faire cuire doucement en mélangeant."],
    ["Ajouter le citron", "Ajouter le jus des 6 citrons et le zeste d'un demi-citron. Continuer à mélanger jusqu'à ce que la crème épaississe."],
    ["Incorporer le beurre", "Retirer du bain-marie, ajouter les 240 g de beurre et mélanger jusqu'à obtenir une crème lisse. Laisser refroidir."],
    ["Garnir la tarte", "Étaler la crème au citron refroidie sur le fond de tarte à la crème d'amande."],
    ["Monter les blancs", "Monter les 4 blancs d'oeufs en neige bien ferme, puis les serrer avec 1 cuillère à soupe de sucre."],
    ["Cuire le sirop", "Faire chauffer 1 verre d'eau avec 300 g de sucre jusqu'à 118 °C."],
    ["Terminer la meringue italienne", "Verser le sirop chaud en filet sur les blancs en neige tout en fouettant. Continuer à fouetter environ 3 minutes, jusqu'à ce que la meringue refroidisse. Garnir la tarte, puis la dorer avant de servir."]
  ]
}
);

/* ============================ BOULANGERIE ============================ */
RECETTES.push(
{
  id: "buns", titre: "Buns", sousTitre: "gros burgers ou mini burgers",
  categorie: "Boulangerie", image: "img/buns.jpg",
  infos: { parts: "8 gros buns", preparation: "30 min + 2 h 30 de pousse", cuisson: "15 min", temperature: "200 °C · chaleur tournante avec vapeur" },
  formats: [
    { id: "gros", libelle: "Gros buns (environ 100 g)", rendement: { valeur: 8, unite: "gros buns", uniteSing: "gros bun", pas: 1, min: 1 } },
    { id: "mini", libelle: "Mini buns (environ 20 g)", rendement: { valeur: 40, unite: "mini buns", uniteSing: "mini bun", pas: 5, min: 5 },
      note: "La recette de base donne 8 gros buns d'environ 100 g ; à 20 g par mini bun (étape 6), cela correspond à environ 40 mini buns." }
  ],
  ingredients: [
    { t: "500 g de farine type 55", q: 500, u: "g", l: "de farine type 55" },
    { t: "200 ml d'eau tiède", q: 200, u: "ml", l: "d'eau tiède" },
    { t: "80 ml de lait demi-écrémé tiède", q: 80, u: "ml", l: "de lait demi-écrémé tiède" },
    { t: "10 g de sel fin", q: 10, u: "g", l: "de sel fin" },
    { t: "20 g de sucre en poudre", q: 20, u: "g", l: "de sucre en poudre" },
    { t: "9 g de levure déshydratée", q: 9, u: "g", l: "de levure déshydratée" },
    { t: "1 oeuf, environ 60 g", q: 1, l: "oeufs, environ 60 g pièce", sg: "oeuf, environ 60 g" },
    { t: "30 g de beurre ramolli", q: 30, u: "g", l: "de beurre ramolli" },
    { t: "1 jaune d'oeuf pour la dorure", q: 1, l: "jaunes d'oeufs pour la dorure", sg: "jaune d'oeuf pour la dorure" },
    { t: "Graines de pavot ou de sésame - facultatif" }
  ],
  etapes: [
    ["Réactiver la levure", "Dans le bol du batteur, verser le lait tiède, l'eau tiède et la levure. Laisser la levure se réactiver pendant 10 à 15 minutes."],
    ["Ajouter les ingrédients", "Ajouter l'oeuf, la farine, le sel et le sucre."],
    ["Pétrir", "Pétrir au crochet pendant environ 5 minutes à vitesse moyenne."],
    ["Incorporer le beurre", "Ajouter le beurre petit à petit et pétrir encore environ 10 minutes, jusqu'à ce que la pâte se décolle de la cuve et que le réseau de gluten soit bien formé."],
    ["Faire la première pousse", "Filmer et laisser lever pendant 1 h 30 à 2 heures à température ambiante. La pâte peut aussi reposer une nuit au réfrigérateur ; la laisser alors revenir à température ambiante avant de la travailler."],
    ["Diviser la pâte", "Diviser la pâte selon le format choisi : environ 100 g par gros bun ou 20 g par mini bun."],
    ["Façonner", "Bouler les portions, les déposer sur une plaque et les laisser pousser pendant 1 heure."],
    ["Dorer", "Dorer avec le jaune d'oeuf et ajouter, si souhaité, des graines de pavot ou de sésame."],
    ["Cuire avec vapeur", "Placer une réserve d'eau dans le four pour créer de la vapeur, puis cuire à 200 °C en chaleur tournante pendant environ 15 minutes."]
  ]
},
{
  id: "brioche", titre: "Brioche", sousTitre: "préparation sur deux jours",
  categorie: "Boulangerie", image: "img/brioche.jpg",
  infos: { parts: "Non précisé", preparation: "Sur 2 jours", cuisson: "20 à 30 min", temperature: "180 °C" },
  formats: [
    { id: "grosses", libelle: "Grosses brioches", cuisson: "30 min", rendement: { valeur: 1, unite: "recettes de pâte", uniteSing: "recette de pâte", pas: 0.5, min: 0.5 } },
    { id: "petites", libelle: "Petites brioches individuelles", cuisson: "20 min", rendement: { valeur: 1, unite: "recettes de pâte", uniteSing: "recette de pâte", pas: 0.5, min: 0.5 } }
  ],
  ingredients: [
    { t: "500 g de farine", q: 500, u: "g", l: "de farine" },
    { t: "120 ml de lait entier tiède", q: 120, u: "ml", l: "de lait entier tiède" },
    { t: "8 g de levure de boulanger déshydratée ou 20 g de levure fraîche", q: 8, u: "g", l: "de levure de boulanger déshydratée", ou: { q: 20, u: "g", l: "de levure fraîche" } },
    { t: "4 oeufs", q: 4, l: "oeufs", sg: "oeuf" },
    { t: "100 g de beurre doux mou", q: 100, u: "g", l: "de beurre doux mou" },
    { t: "70 g de sucre en poudre", q: 70, u: "g", l: "de sucre en poudre" },
    { t: "10 g de sel", q: 10, u: "g", l: "de sel" },
    { t: "1 jaune d'oeuf pour badigeonner", q: 1, l: "jaunes d'oeufs pour badigeonner", sg: "jaune d'oeuf pour badigeonner" }
  ],
  etapes: [
    ["La veille - Activer la levure", "Faire tiédir le lait, ajouter la levure, couvrir et laisser reposer 15 minutes."],
    ["Former la pâte", "Dans le bol du robot muni du crochet, déposer la farine, le lait avec la levure, le sucre et les oeufs un à un. Pétrir environ 5 minutes, jusqu'à obtenir une pâte assez homogène et collante."],
    ["Ajouter le sel et le beurre", "Ajouter le sel. Incorporer ensuite le beurre en petits morceaux, petit à petit, en attendant que chaque ajout soit bien incorporé. Pétrir jusqu'à ce que tout le beurre soit incorporé, environ 15 minutes."],
    ["Première pousse", "Laisser lever 2 heures entre 25 et 30 °C. Dégazer, puis pétrir 1 petite minute à la main."],
    ["Repos de nuit", "Former une boule, couvrir de film alimentaire et réserver toute la nuit au réfrigérateur."],
    ["Le lendemain - Détendre et façonner", "Laisser la pâte 1 petite heure à température ambiante. Sur un plan de travail fariné, façonner les brioches selon la forme souhaitée."],
    ["Deuxième pousse", "Déposer les brioches dans un endroit tiède pendant au moins 1 heure, jusqu'à ce que la pâte double de volume à nouveau."],
    ["Dorer et cuire", "Préchauffer le four à 180 °C. Badigeonner avec 1 jaune d'oeuf et enfourner à four chaud : 30 minutes pour les grosses brioches ou 20 minutes pour les petites brioches individuelles."]
  ]
},
{
  id: "pate-pizza-biga", titre: "Pâte à pizza sur biga", sousTitre: "6 pâtons d'environ 275 g · hydratation globale 60 %",
  categorie: "Boulangerie", image: "img/pate-pizza-patons.jpg",
  infos: { parts: "6 pâtons d'environ 275 g (réglable)", preparation: "J-3 à J-2", cuisson: "Au moment de faire la pizza", temperature: "Biga 16 à 24 h à 18-20 °C (ou 48 h au frigo)" },
  rendement: { valeur: 6, unite: "pâtons", uniteSing: "pâton", pas: 1, min: 1, aide: "Par pâton : 97,22 g de farine et 42,78 g d'eau pour la biga, 74,55 g de farine et 60 g d'eau pour la pâte (tableau « Quantité pate pizza sur BIGA »)." },
  ingredients: [
    { g: "1. La biga (hydratation 44 %)" },
    { t: "583 g de farine T00 ou T45", q: 583.32, u: "g", l: "de farine T00 ou T45" },
    { t: "257 g d'eau froide (sortie du frigo)", q: 256.68, u: "g", l: "d'eau froide (sortie du frigo)" },
    { t: "1,5 g de levure sèche (0,15 % de la farine totale)", q: 1.54593, u: "g", precis: true, l: "de levure sèche (0,15 % de la farine totale)" },
    { g: "2. La pâte (refresh final)" },
    { t: "Toute la biga" },
    { t: "447 g de farine T00 ou T45", q: 447.3, u: "g", l: "de farine T00 ou T45" },
    { t: "360 g d'eau tempérée (20-22 °C)", q: 360, u: "g", l: "d'eau tempérée (20-22 °C)" },
    { t: "28 g de sel fin (2,7 % de la farine totale)", q: 27.82674, u: "g", l: "de sel fin (2,7 % de la farine totale)" },
    { t: "21 g d'huile d'olive extra vierge (2 % de la farine totale)", q: 20.6124, u: "g", l: "d'huile d'olive extra vierge (2 % de la farine totale)" },
    { g: "" },
    { t: "Taux de biga : 51 % de la masse farine + eau" },
    { t: "Hydratation globale : 60 %" }
  ],
  etapes: [
    { g: "1. La biga" },
    ["J-3 - Mélanger la biga", "Délayer la levure sèche dans l'eau froide sortie du frigo. Ajouter la farine de la biga en une fois. Mélanger à la cuillère ou 2 à 3 minutes à la main ou à la machine, jusqu'à obtenir une pâte grossière et sèche, non lisse (hydratation de 44 % seulement)."],
    ["J-3 - Faire maturer", "Couvrir et laisser fermenter 16 à 24 heures à 18-20 °C, ou 48 heures au réfrigérateur pour plus de goût. La biga doit tripler de volume et être pleine de bulles."],
    { g: "2. La pâte" },
    ["J-2 - Dissoudre la biga", "Mettre la biga maturée en morceaux dans le pétrin, ou travailler à la main. Ajouter l'eau tempérée (20-22 °C) et commencer à mélanger pour dissoudre la biga. Ajouter progressivement la farine de la pâte."],
    ["Pétrir et saler", "Pétrir 5 à 6 minutes en première vitesse. Quand la pâte commence à se former, ajouter le sel. Pétrir encore 4 à 6 minutes en deuxième vitesse jusqu'à obtenir un voile, test du gluten."],
    ["Ajouter l'huile", "Ajouter l'huile d'olive en filet tout en continuant à pétrir 2 à 3 minutes. La pâte doit être lisse, souple et légèrement collante."],
    ["Pointage", "Couvrir et laisser fermenter en masse 2 à 3 heures à 24-26 °C, jusqu'à ce que la pâte double presque."],
    ["Diviser et bouler", "Renverser sur un plan de travail légèrement fariné. Diviser en pâtons d'environ 275 g (6 pâtons pour la recette de base). Bouler serré en refermant bien en dessous, puis disposer dans une caisse huilée et couvrir hermétiquement."],
    ["Apprêt final", "Laisser 6 à 12 heures à température ambiante, 20-22 °C, ou 24 à 48 heures au réfrigérateur à 4 °C. Dans ce dernier cas, sortir les pâtons 2 à 3 heures avant l'étalage pour qu'ils reviennent à température."]
  ]
}
);

/* ============================ BASES ============================ */
RECETTES.push(
{
  id: "pate-brisee", titre: "Pâte brisée", sousTitre: "au beurre, reposée au frais",
  categorie: "Bases", image: "img/pate-brisee.jpg",
  infos: { parts: "1 pâton", preparation: "15 min + 2 h de repos", cuisson: "Selon la recette", temperature: "Repos au réfrigérateur" },
  rendement: { valeur: 1, unite: "pâtons", uniteSing: "pâton", pas: 0.5, min: 0.5 },
  ingredients: [
    { t: "250 g de farine type 55", q: 250, u: "g", l: "de farine type 55" },
    { t: "180 g de beurre mou coupé en dés", q: 180, u: "g", l: "de beurre mou coupé en dés" },
    { t: "4 g de sel fin", q: 4, u: "g", l: "de sel fin" },
    { t: "5 g de sucre en poudre", q: 5, u: "g", l: "de sucre en poudre" },
    { t: "20 g de jaune d'oeuf, environ 1 jaune", q: 20, u: "g", l: "de jaune d'oeuf", jaunesPour: 20 },
    { t: "50 g de lait", q: 50, u: "g", l: "de lait" }
  ],
  etapes: [
    ["Préparer le beurre", "Couper le beurre mou en cubes."],
    ["Mélanger les poudres", "Tamiser la farine, puis ajouter le sel fin et le sucre en poudre."],
    ["Sabler la pâte", "Ajouter le beurre mou et sabler la pâte à l'aide du batteur muni de la feuille, ou batteur K."],
    ["Ajouter les liquides", "Mélanger le jaune d'oeuf avec le lait. Verser ce mélange dans la pâte et continuer à travailler au batteur K jusqu'à ce que la pâte soit homogène."],
    ["Laisser reposer", "Former un pâton d'environ 3 cm d'épaisseur, le filmer et le laisser au réfrigérateur pendant au moins 2 heures avant utilisation."]
  ]
}
);
