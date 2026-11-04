# Mon livre de recettes (PWA)

Site statique (HTML/CSS/JS), installable sur iPhone et utilisable hors ligne.

## Structure
- `index.html` – page unique
- `js/recettes.js` – **toutes les recettes** (un bloc par recette, format décrit en tête du fichier)
- `js/app.js` – affichage, recherche, filtres, calcul des quantités
- `css/style.css` – styles (écran + impression/PDF)
- `img/` – photos extraites des fiches PDF
- `icons/` – icônes de l'application
- `manifest.json`, `sw.js` – PWA / hors ligne

## Ajouter une recette
1. Copier un bloc dans `js/recettes.js` et l'adapter (quantité `q`, unité `u`, libellé `l`, texte exact `t`).
2. Ajouter la photo dans `img/` (format 16:9 conseillé, ~960 px de large).
3. Lancer `python3 build-sw.py` pour mettre à jour la liste des fichiers hors ligne.

## Tester en local
`python3 -m http.server 8000` puis ouvrir http://localhost:8000

## Installer sur iPhone
Le site doit être servi en HTTPS. Ouvrir l'adresse dans Safari → bouton Partager → « Sur l'écran d'accueil ».

Lien direct vers un réglage : `#/recette/buns?format=mini&n=20`
