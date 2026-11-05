# Mon livre de recettes (PWA)

Site statique (HTML/CSS/JS), installable sur iPhone et utilisable hors ligne.

## Structure
- `index.html` – page unique
- `js/recettes.js` – **toutes les recettes** (un bloc par recette, format décrit en tête du fichier)
- `data/recettes-ajoutees.json` – recettes ajoutées depuis le téléphone (liste JSON, même format que `recettes.js`)
- `js/app.js` – affichage, recherche, filtres, calcul des quantités, chargement du fichier JSON
- `js/ajout.js` – formulaire « Ajouter une recette », modification / suppression, envoi vers GitHub
- `css/style.css` – styles (écran + impression/PDF)
- `img/` – photos extraites des fiches PDF
- `icons/` – icônes de l'application
- `manifest.json`, `sw.js` – PWA / hors ligne

## Ajouter une recette depuis le téléphone
Bouton « Ajouter une recette » sur l'accueil → formulaire (`#/ajouter`). À l'envoi, l'application écrit
directement dans le dépôt GitHub via l'API « Contents » :
- la photo (redimensionnée à 1200 px, JPEG) dans `img/ajout-<id>.jpg` ;
- la recette ajoutée à la liste de `data/recettes-ajoutees.json` (commit « Ajout recette : <titre> »).
GitHub Pages republie le site en 1 à 2 minutes. Les recettes de ce fichier ont aussi les boutons
« Modifier » et « Supprimer ».

Il faut un **jeton GitHub** (fine-grained personal access token), saisi une fois dans « Réglages GitHub »
du formulaire et gardé uniquement dans le téléphone (localStorage, jamais dans le dépôt) :
github.com/settings/personal-access-tokens/new → Repository access : *Only select repositories* →
`nicobuq8-hue/livre-recettes` → Permissions : *Contents : Read and write* → Generate token.

## Ajouter une recette à la main
1. Copier un bloc dans `js/recettes.js` et l'adapter (quantité `q`, unité `u`, libellé `l`, texte exact `t`).
2. Ajouter la photo dans `img/` (format 16:9 conseillé, ~960 px de large).
3. Lancer `python3 build-sw.py` pour mettre à jour la liste des fichiers hors ligne.

## Tester en local
`python3 -m http.server 8000` puis ouvrir http://localhost:8000

## Installer sur iPhone
Le site doit être servi en HTTPS. Ouvrir l'adresse dans Safari → bouton Partager → « Sur l'écran d'accueil ».

Lien direct vers un réglage : `#/recette/buns?format=mini&n=20`
