# Mon livre de recettes (PWA)

Site statique (HTML/CSS/JS), installable sur iPhone et utilisable hors ligne.

## Structure
- `index.html` – page unique
- `js/recettes.js` – **recettes intégrées** (un bloc par recette, format décrit en tête du fichier)
- `data/recettes-ajoutees.json` – recettes ajoutées depuis le téléphone, et surcharges des recettes intégrées (même id)
- `data/recettes-masquees.json` – ids des recettes intégrées masquées (« supprimées » depuis le téléphone)
- `js/app.js` – affichage, recherche, filtres, calcul des quantités, fusion des JSON au chargement
- `js/ajout.js` – formulaire « Ajouter / Modifier une recette », suppression (avec confirmation), envoi vers GitHub
- `css/style.css` – styles (écran + impression/PDF)
- `img/` – photos extraites des fiches PDF
- `icons/` – icônes de l'application
- `manifest.json`, `sw.js` – PWA / hors ligne

## Ajouter une recette depuis le téléphone
Bouton « Ajouter une recette » sur l'accueil → formulaire (`#/ajouter`). À l'envoi, l'application écrit
directement dans le dépôt GitHub via l'API « Contents » :
- la photo (redimensionnée à 1200 px, JPEG) dans `img/ajout-<id>.jpg` ;
- la recette ajoutée à la liste de `data/recettes-ajoutees.json` (commit « Ajout recette : <titre> »).
GitHub Pages republie le site en 1 à 2 minutes.

Toutes les fiches (intégrées ou ajoutées) ont les boutons **Modifier** et **Supprimer**.
La suppression demande toujours confirmation (« Supprimer « … » du livre ? Cette action est définitive. »).

- Recette ajoutée (`recettes-ajoutees.json` seulement) : retirée de ce fichier, photo `img/ajout-<id>.jpg` effacée.
- Recette intégrée (`js/recettes.js`) : son id est ajouté à `data/recettes-masquees.json` (le fichier JS n'est pas
  réécrit depuis le téléphone). Si une surcharge existait dans `recettes-ajoutees.json`, elle est aussi retirée,
  pour que l'originale ne réapparaisse pas.
- Modifier une recette intégrée enregistre une surcharge dans `recettes-ajoutees.json` (même id).

Il faut un **jeton GitHub** (fine-grained personal access token), saisi une fois dans « Réglages GitHub »
du formulaire et gardé uniquement dans le téléphone (localStorage, jamais dans le dépôt) :
github.com/settings/personal-access-tokens/new → Repository access : *Only select repositories* →
`nicobuq8-hue/livre-recettes` → Permissions : *Contents : Read and write* → Generate token.

### Importer depuis une IA
En haut du formulaire, bloc « Importer depuis une IA » :
1. « 📋 Copier la consigne pour l'IA » copie une consigne prête à l'emploi (texte dans `CONSIGNE_IA`, `js/ajout.js`).
2. Coller la consigne dans ChatGPT, Gemini, Grok, Claude…, ajouter la photo (magazine, fiche manuscrite) ou le texte de la recette.
3. Copier la réponse de l'IA dans « Colle ici la réponse de l'IA » → « Remplir le formulaire ». Vérifier, puis envoyer.

L'IA répond en JSON simple : `titre`, `sousTitre`, `categorie`, `infos {parts, preparation, cuisson, temperature}`,
`rendement {valeur, unite}`, `ingredients [{groupe} | {quantite, unite, libelle}]`, `etapes [{titre, texte}]`.
La lecture est tolérante (```json et texte autour, « 1,5 », « 1/2 », clés avec accents ou en anglais, format interne
`t/q/u/l` de `recettes.js`). Rien n'est envoyé automatiquement.

## Ajouter une recette à la main
1. Copier un bloc dans `js/recettes.js` et l'adapter (quantité `q`, unité `u`, libellé `l`, texte exact `t`).
2. Ajouter la photo dans `img/` (format 16:9 conseillé, ~960 px de large).
3. Lancer `python3 build-sw.py` pour mettre à jour la liste des fichiers hors ligne.

## Tester en local
`python3 -m http.server 8000` puis ouvrir http://localhost:8000

## Installer sur iPhone
Le site doit être servi en HTTPS. Ouvrir l'adresse dans Safari → bouton Partager → « Sur l'écran d'accueil ».

Lien direct vers un réglage : `#/recette/buns?format=mini&n=20`
