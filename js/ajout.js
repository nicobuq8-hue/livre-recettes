/*
 * Mon livre de recettes — ajout / modification / suppression de recettes depuis le téléphone
 * ----------------------------------------------------------------------------------------
 * Les recettes ajoutées par le formulaire sont enregistrées dans data/recettes-ajoutees.json
 * (même format que js/recettes.js) via l'API GitHub « Contents », avec un jeton personnel
 * saisi une seule fois et gardé uniquement sur l'appareil (localStorage).
 */
(function () {
  "use strict";

  var DEPOT = "nicobuq8-hue/livre-recettes";
  var BRANCHE = "main";
  var FICHIER = "data/recettes-ajoutees.json";
  var API = "https://api.github.com/repos/" + DEPOT + "/contents/";
  var CLE_JETON = "livre-recettes-jeton-github";
  var CLE_ATTENTE = "livre-recettes-attente";
  var DUREE_ATTENTE = 10 * 60 * 1000; // le temps que GitHub Pages republie le site
  var UNITES = ["g", "kg", "ml", "cl", "L", "c. à café", "c. à soupe", "pincée", "sachet", "verre", "tranche", "gousse", "feuille"];

  var H = null; // outils fournis par app.js (esc, norm, recettes, categories, route…)

  /* ---------------- jeton ---------------- */
  function getJeton() { try { return localStorage.getItem(CLE_JETON) || ""; } catch (e) { return ""; } }
  function setJeton(v) { try { if (v) localStorage.setItem(CLE_JETON, v); else localStorage.removeItem(CLE_JETON); } catch (e) {} }

  /* ---------------- base64 UTF-8 ---------------- */
  function versBase64(str) {
    var bytes = new TextEncoder().encode(str), bin = "";
    for (var i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }
  function depuisBase64(b64) {
    var bin = atob(String(b64 || "").replace(/\s/g, "")), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  /* ---------------- API GitHub ---------------- */
  function Erreur(msg, status) { var e = new Error(msg); e.status = status; return e; }

  function gh(method, chemin, corps) {
    var jeton = getJeton();
    if (!jeton) return Promise.reject(Erreur("Aucun jeton GitHub enregistré. Ouvrez « Réglages GitHub » ci-dessous et collez votre jeton."));
    var url = chemin.indexOf("https://") === 0 ? chemin : API + chemin + (method === "GET" ? "?ref=" + BRANCHE + "&t=" + Date.now() : "");
    return fetch(url, {
      method: method, cache: "no-store",
      headers: { "Authorization": "Bearer " + jeton, "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
      body: corps ? JSON.stringify(corps) : undefined
    }).catch(function () {
      throw Erreur("Pas de connexion à internet (ou GitHub ne répond pas). Vérifiez le réseau et réessayez.");
    }).then(function (res) {
      if (res.ok) return res.status === 204 ? {} : res.json();
      return res.json().catch(function () { return {}; }).then(function (data) {
        var s = res.status, m = (data && data.message) || "";
        if (s === 401) throw Erreur("Jeton refusé par GitHub (invalide ou expiré). Créez-en un nouveau et collez-le dans « Réglages GitHub ».", s);
        if (s === 403 && /rate limit/i.test(m)) throw Erreur("GitHub limite temporairement les envois. Réessayez dans quelques minutes.", s);
        if (s === 403) throw Erreur("Ce jeton n'a pas le droit d'écrire dans le livre. Il faut la permission « Contents : Read and write » sur le dépôt livre-recettes.", s);
        if (s === 404) throw Erreur("Introuvable sur GitHub. Vérifiez que le jeton donne bien accès au dépôt « livre-recettes ».", s);
        if (s === 409 || s === 422 && /sha/i.test(m)) throw Erreur("conflit", 409);
        if (s >= 500) throw Erreur("GitHub rencontre un problème (erreur " + s + "). Réessayez dans un instant.", s);
        throw Erreur("Erreur GitHub " + s + (m ? " : " + m : "") + ".", s);
      });
    });
  }

  function lireFichier(chemin) {
    return gh("GET", chemin).then(function (d) { return { sha: d.sha, contenu: d.content }; }, function (e) {
      if (e.status === 404 && chemin !== FICHIER) return { sha: null, contenu: null }; // nouveau fichier image
      throw e;
    });
  }

  function lireDonnees() {
    return lireFichier(FICHIER).then(function (f) {
      var liste;
      try { liste = JSON.parse(depuisBase64(f.contenu) || "[]"); } catch (e) { throw Erreur("Le fichier " + FICHIER + " est abîmé (JSON invalide). Il faut le réparer sur GitHub."); }
      if (!Array.isArray(liste)) throw Erreur("Le fichier " + FICHIER + " doit contenir une liste [ ].");
      return { sha: f.sha, liste: liste };
    });
  }

  // Lit le fichier de données, applique « modifier(liste) » puis l'enregistre ; en cas de conflit, relit une fois.
  function majDonnees(modifier, message, donnees) {
    function essai(d, reessai) {
      var liste = modifier(d.liste.slice());
      var texte = JSON.stringify(liste, null, 2) + "\n";
      return gh("PUT", FICHIER, { message: message, content: versBase64(texte), sha: d.sha, branch: BRANCHE })
        .then(function () { return liste; }, function (e) {
          if (e.status === 409 && !reessai) return lireDonnees().then(function (d2) { return essai(d2, true); });
          if (e.status === 409) throw Erreur("Quelqu'un d'autre modifie le livre en même temps. Réessayez dans un instant.");
          throw e;
        });
    }
    return (donnees ? Promise.resolve(donnees) : lireDonnees()).then(function (d) { return essai(d, false); });
  }

  function envoyerImage(chemin, base64, message) {
    function essai(reessai) {
      return lireFichier(chemin).then(function (f) {
        var corps = { message: message, content: base64, branch: BRANCHE };
        if (f.sha) corps.sha = f.sha;
        return gh("PUT", chemin, corps);
      }).catch(function (e) { if (e.status === 409 && !reessai) return essai(true); throw e; });
    }
    return essai(false);
  }

  function supprimerFichier(chemin, message) {
    return lireFichier(chemin).then(function (f) {
      if (!f.sha) return null;
      return gh("DELETE", chemin, { message: message, sha: f.sha, branch: BRANCHE });
    });
  }

  /* ---------------- recettes en attente de publication (affichage immédiat) ---------------- */
  function lireAttente() {
    try {
      var a = JSON.parse(localStorage.getItem(CLE_ATTENTE) || "null");
      if (a && Date.now() - a.t < DUREE_ATTENTE) return a;
    } catch (e) {}
    return { t: Date.now(), ajouts: {}, suppr: {} };
  }
  function noterAttente(recette, supprId) {
    var a = lireAttente();
    a.t = Date.now();
    if (recette) { var copie = JSON.parse(JSON.stringify(recette)); if (/^data:/.test(copie.image || "")) copie.image = null; a.ajouts[recette.id] = copie; delete a.suppr[recette.id]; }
    if (supprId) { delete a.ajouts[supprId]; a.suppr[supprId] = 1; }
    try { localStorage.setItem(CLE_ATTENTE, JSON.stringify(a)); } catch (e) {}
  }

  /* ---------------- outils ---------------- */
  function slug(titre) {
    return H.norm(titre).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/, "") || "recette";
  }
  function idUnique(titre, liste) {
    var base = slug(titre), id = base, n = 2;
    function pris(x) { return H.byId(x) || liste.some(function (r) { return r.id === x; }); }
    while (pris(id)) id = base + "-" + n++;
    return id;
  }
  function nombre(v) {
    var n = parseFloat(String(v || "").replace(/\s/g, "").replace(",", "."));
    return isFinite(n) && n > 0 ? n : null;
  }
  function fmt(n) { return String(n).replace(".", ","); }
  function singulier(unite) {
    var mots = unite.split(" ");
    if (mots[0].length > 3) mots[0] = mots[0].replace(/(?:s|x)$/, "");
    return mots.join(" ");
  }

  function redimensionner(fichier) {
    return new Promise(function (ok, ko) {
      var url = URL.createObjectURL(fichier), img = new Image();
      img.onload = function () {
        var max = 1200, w = img.naturalWidth, h = img.naturalHeight, k = Math.min(1, max / Math.max(w, h));
        var c = document.createElement("canvas");
        c.width = Math.round(w * k); c.height = Math.round(h * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        ok(c.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = function () { URL.revokeObjectURL(url); ko(new Error("Cette photo ne peut pas être lue. Essayez-en une autre.")); };
      img.src = url;
    });
  }

  /* ---------------- import depuis une IA (ChatGPT, Gemini, Grok, Claude…) ---------------- */
  var CONSIGNE_IA = [
    "Tu es un assistant de cuisine. Lis la recette que je joins (photo d'un magazine, d'un livre, d'une fiche manuscrite, ou texte copié) et retranscris-la pour mon livre de recettes.",
    "",
    "Réponds UNIQUEMENT avec un bloc JSON valide, sans aucun texte avant ou après, exactement dans ce format :",
    "",
    "{",
    '  "titre": "Tarte aux pommes",',
    '  "sousTitre": "pâte brisée maison",',
    '  "categorie": "Desserts",',
    '  "infos": { "parts": "6 personnes", "preparation": "20 min", "cuisson": "35 min", "temperature": "180 °C" },',
    '  "rendement": { "valeur": 6, "unite": "personnes" },',
    '  "ingredients": [',
    '    { "groupe": "Pâte" },',
    '    { "quantite": 250, "unite": "g", "libelle": "de farine" },',
    '    { "quantite": 2, "unite": "pièce", "libelle": "oeufs" },',
    '    { "quantite": 0.5, "unite": "c. à café", "libelle": "de sel" },',
    '    { "groupe": "Garniture" },',
    '    { "quantite": null, "unite": "", "libelle": "Sel, poivre" }',
    "  ],",
    '  "etapes": [',
    '    { "titre": "Préparer la pâte", "texte": "Mélanger la farine et le beurre..." }',
    "  ]",
    "}",
    "",
    "Règles :",
    "- Tout en français.",
    "- « categorie » : une parmi Entrées, Plats, Desserts, Boulangerie, Bases (ou une autre courte si aucune ne convient).",
    "- « quantite » : un nombre, avec un point pour les décimales (0.5 et pas « 1/2 » ni « 0,5 »). Si la recette donne une fourchette (2 à 3), prends la première valeur.",
    "- « unite » : uniquement g, kg, ml, cl, l, c. à soupe, c. à café, pièce (pour ce qui se compte : oeufs, citrons…), ou une unité courte comme pincée, sachet, gousse, tranche, feuille. Convertis « cuillère à soupe » en « c. à soupe ».",
    "- Ingrédient sans quantité (ex. « sel, poivre », « beurre pour le moule ») : « quantite »: null et « unite »: \"\".",
    "- « libelle » : le nom de l'ingrédient tel qu'écrit, avec « de » ou « d' » si besoin (ex. « de farine », « d'huile d'olive »).",
    "- « groupe » : seulement si la recette sépare les ingrédients en parties (Pâte, Garniture…).",
    "- « rendement » : le nombre de personnes, parts ou pièces de la recette d'origine, et son unité (personnes, parts, pièces…).",
    "- « etapes » : garde le texte d'origine des étapes, sans le résumer ni le réécrire. Donne à chaque étape un titre court (ex. « Cuire »).",
    "- N'invente rien : si une information manque (temps, température, sous-titre…), laisse une chaîne vide \"\" (ou null pour un nombre).",
    "- Si je joins plusieurs recettes, ne traite que la première."
  ].join("\n");

  function cleNorm(k) { return H.norm(k).replace(/[^a-z0-9]/g, ""); }
  function prendre(o, noms) { // valeur d'une clé parmi plusieurs variantes (accents, majuscules, espaces ignorés)
    if (!o || typeof o !== "object") return undefined;
    var cles = Object.keys(o);
    for (var i = 0; i < noms.length; i++) {
      for (var j = 0; j < cles.length; j++) if (cleNorm(cles[j]) === noms[i]) { var v = o[cles[j]]; if (v !== undefined && v !== null && v !== "") return v; }
    }
    return undefined;
  }
  function texte(v) { return v === undefined || v === null ? "" : (typeof v === "object" ? "" : String(v).trim()); }
  function quantite(v) { // 250 | "1,5" | "1/2" | "1 1/2" | "½" | "2-3" | [2, 3] → nombre ou null
    if (Array.isArray(v)) v = v[0];
    if (typeof v === "number") return isFinite(v) && v > 0 ? v : null;
    if (typeof v !== "string") return null;
    var x = v.replace(/½/g, " 1/2").replace(/¼/g, " 1/4").replace(/¾/g, " 3/4").replace(/,/g, ".").trim();
    var m, n;
    if ((m = x.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)/))) n = +m[1] + m[2] / m[3];      // 1 1/2
    else if ((m = x.match(/^(\d+)\s*\/\s*(\d+)/))) n = m[1] / m[2];                  // 1/2
    else if ((m = x.match(/^\d+(?:\.\d+)?/))) n = parseFloat(m[0]);                    // 250, 1.5, 2-3
    else return null;
    return n > 0 ? Math.round(n * 1000) / 1000 : null;
  }
  function unite(u) {
    u = texte(u);
    var n = H.norm(u).replace(/\.$/, "");
    if (/^(pieces?|pcs?|unites?|u)$/.test(n)) return "";
    if (/^(l|litres?)$/.test(n)) return "L";
    if (/^(grammes?|gr)$/.test(n)) return "g";
    if (/^(kilos?|kilogrammes?)$/.test(n)) return "kg";
    if (/^(cs|c\.? ?a ?s|cuill?ere?s? a soupe|c\.? a soupe|cuil\.? a soupe)$/.test(n)) return "c. à soupe";
    if (/^(cc|c\.? ?a ?c|cuill?ere?s? a cafe|c\.? a cafe|cuil\.? a cafe)$/.test(n)) return "c. à café";
    return u;
  }

  function blocJSON(txt) { // premier bloc { … } équilibré, en ignorant les accolades dans les chaînes
    var debut = txt.indexOf("{");
    if (debut === -1) return null;
    var prof = 0, dansChaine = false, echap = false;
    for (var i = debut; i < txt.length; i++) {
      var c = txt[i];
      if (dansChaine) { if (echap) echap = false; else if (c === "\\") echap = true; else if (c === '"') dansChaine = false; continue; }
      if (c === '"') dansChaine = true;
      else if (c === "{") prof++;
      else if (c === "}" && --prof === 0) return txt.slice(debut, i + 1);
    }
    return txt.slice(debut); // réponse coupée : on tente quand même
  }
  function extraireJSON(txt) {
    txt = String(txt || "").replace(/```[a-zA-Z]*/g, " ").replace(/\u00a0/g, " ");
    var essais = [txt, txt.replace(/[\u201c\u201d\u201e]/g, '"')]; // guillemets « intelligents » du téléphone
    for (var k = 0; k < essais.length; k++) {
      var bloc = blocJSON(essais[k]);
      if (!bloc) continue;
      try { return JSON.parse(bloc); } catch (e) {}
      try { return JSON.parse(bloc.replace(/,\s*([}\]])/g, "$1")); } catch (e) {} // virgules en trop
    }
    return null;
  }

  // Réponse d'une IA (format simple) ou recette au format interne (t/q/u/l, g, etapes en [titre, texte]) → recette interne
  function depuisIA(txt) {
    var o = extraireJSON(txt);
    if (o && !prendre(o, ["titre", "title", "nom", "name"]) && typeof prendre(o, ["recette", "recipe"]) === "object") o = prendre(o, ["recette", "recipe"]);
    if (!o || typeof o !== "object") throw new Error("Je ne trouve pas de bloc JSON { … } dans ce texte. Vérifiez que vous avez copié toute la réponse de l'IA.");
    var titre = texte(prendre(o, ["titre", "title", "nom", "name"]));
    var ingsBruts = prendre(o, ["ingredients", "ingredient", "ingredents"]);
    var etapesBrutes = prendre(o, ["etapes", "etape", "steps", "instructions", "preparationsteps", "methode", "deroule"]);
    if (!Array.isArray(etapesBrutes) && Array.isArray(prendre(o, ["preparation"]))) etapesBrutes = prendre(o, ["preparation"]);
    if (!titre && !Array.isArray(ingsBruts)) throw new Error("Le JSON ne ressemble pas à une recette (pas de titre ni d'ingrédients).");

    var infosB = prendre(o, ["infos", "info", "informations"]) || o;
    var rdB = prendre(o, ["rendement", "yield", "pour", "portions"]);
    var parts = texte(prendre(infosB, ["parts", "portions", "personnes", "servings", "nombredeparts"]));
    var valeur = null, uniteRd = "";
    if (rdB && typeof rdB === "object") { valeur = quantite(prendre(rdB, ["valeur", "quantite", "nombre", "value", "nb"])); uniteRd = texte(prendre(rdB, ["unite", "unit", "unites"])); }
    else if (rdB !== undefined) valeur = quantite(rdB);
    if (!valeur && parts) { valeur = quantite(parts); if (!uniteRd) uniteRd = parts.replace(/^[\d.,\s½¼¾/]+/, "").trim(); }

    var ingredients = (Array.isArray(ingsBruts) ? ingsBruts : []).map(function (it) {
      if (typeof it === "string") return { t: it.trim() };
      if (!it || typeof it !== "object") return null;
      var g = prendre(it, ["groupe", "group", "g", "section", "partie"]);
      if (g !== undefined && prendre(it, ["libelle", "l", "t", "nom", "ingredient", "name"]) === undefined) return { g: texte(g) };
      var qBrut = prendre(it, ["quantite", "qte", "q", "quantity", "qty", "quantites"]);
      var q = quantite(qBrut);
      var u = unite(prendre(it, ["unite", "u", "unit", "unites"]));
      if (!u && q && typeof qBrut === "string") u = unite(qBrut.replace(/^[\d.,\s½¼¾\/-]+/, "")); // « 1,5 kg »
      var l = texte(prendre(it, ["libelle", "l", "nom", "ingredient", "name", "label", "produit"]));
      var t = texte(prendre(it, ["t", "texte", "text"]));
      if (!q) { var lib = l || t; return lib ? { t: lib, u: u } : null; }
      return { q: q, u: u, l: l || t };
    }).filter(Boolean);

    var etapes = (Array.isArray(etapesBrutes) ? etapesBrutes : []).map(function (s, i) {
      if (Array.isArray(s)) return [texte(s[0]), texte(s[1])];
      if (typeof s === "string") return ["", s.trim()];
      if (!s || typeof s !== "object" || (s.g !== undefined && Object.keys(s).length === 1)) return null;
      return [texte(prendre(s, ["titre", "title", "nom", "name"])), texte(prendre(s, ["texte", "text", "description", "instruction", "instructions", "contenu", "detail"]))];
    }).filter(function (s) { return s && (s[0] || s[1]); });

    return {
      titre: titre,
      sousTitre: texte(prendre(o, ["soustitre", "subtitle", "sous", "description"])),
      categorie: texte(prendre(o, ["categorie", "category", "cat", "type"])),
      infos: {
        parts: parts,
        preparation: texte(prendre(infosB, ["preparation", "tempsdepreparation", "tempspreparation", "prep", "preptime"])),
        cuisson: texte(prendre(infosB, ["cuisson", "tempsdecuisson", "tempscuisson", "cooking", "cooktime"])),
        temperature: texte(prendre(infosB, ["temperature", "temp", "four", "thermostat"]))
      },
      rendement: { valeur: valeur, unite: uniteRd },
      ingredients: ingredients,
      etapes: etapes
    };
  }

  function copier(txt) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(txt).catch(function () { return copierAncien(txt); });
    return copierAncien(txt);
  }
  function copierAncien(txt) {
    return new Promise(function (ok, ko) {
      var ta = document.createElement("textarea");
      ta.value = txt; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.top = "0"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.focus(); ta.select(); ta.setSelectionRange(0, txt.length);
      var r = false; try { r = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      r ? ok() : ko(new Error("copie impossible"));
    });
  }

  function importHTML() {
    return '<section class="box import-ia"><h2>✨ Importer depuis une IA</h2>' +
      '<p class="hint top">Ouvre ton IA, colle la consigne, ajoute la photo de la recette, puis copie sa réponse ici.</p>' +
      '<button class="btn flex wide-btn" type="button" id="iaCopier">📋 Copier la consigne pour l\'IA</button>' +
      '<p class="hint" id="iaCopieMsg" aria-live="polite"></p>' +
      '<details class="voir-consigne"><summary>Voir la consigne</summary><pre id="iaConsigne">' + H.esc(CONSIGNE_IA) + "</pre></details>" +
      '<label class="field-label" for="iaReponse">Colle ici la réponse de l\'IA</label>' +
      '<textarea class="input" id="iaReponse" rows="4" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="{ &quot;titre&quot;: … }"></textarea>' +
      '<button class="btn primary wide-btn" type="button" id="iaRemplir">Remplir le formulaire</button>' +
      '<p class="hint" id="iaMsg" role="status" aria-live="polite"></p></section>';
  }

  /* ---------------- formulaire ---------------- */
  function champ(id, label, attrs, aide) {
    return '<label class="field-label" for="' + id + '">' + label + "</label>" +
      '<input class="input" id="' + id + '" ' + (attrs || "") + ">" + (aide ? '<p class="hint">' + aide + "</p>" : "");
  }

  function ligneIngredient(it) {
    var esc = H.esc;
    if (it && it.g !== undefined) {
      return '<div class="row row-group" data-type="g">' +
        '<input class="input" data-k="g" placeholder="Titre de groupe (ex. Pâte, Garniture)" aria-label="Titre de groupe" value="' + esc(it.g) + '">' +
        '<button type="button" class="icon-btn" data-act="del" aria-label="Supprimer ce titre">×</button></div>';
    }
    it = it || {};
    var q = it.q !== undefined ? fmt(Array.isArray(it.q) ? it.q[0] : it.q) : "";
    var l = it.q !== undefined ? (it.l || "") : (it.t || ""); // sans quantité : tout le texte dans « Ingrédient »
    return '<div class="row row-ing" data-type="i">' +
      '<input class="input" data-k="q" inputmode="decimal" placeholder="Qté" aria-label="Quantité" value="' + esc(q) + '">' +
      '<input class="input" data-k="u" list="unites" placeholder="Unité (g, cl…)" aria-label="Unité" autocapitalize="off" value="' + esc(it.u || "") + '">' +
      '<button type="button" class="icon-btn" data-act="del" aria-label="Supprimer cet ingrédient">×</button>' +
      '<input class="input wide" data-k="l" placeholder="Ingrédient (ex. de farine, oeufs)" aria-label="Ingrédient" value="' + esc(l) + '"></div>';
  }

  function ligneEtape(s) {
    var esc = H.esc;
    s = s || ["", ""];
    return '<div class="row row-step" data-type="e">' +
      '<div class="row-head"><span class="step-num"></span>' +
      '<input class="input" data-k="titre" placeholder="Titre de l\'étape (ex. Préparer la pâte)" aria-label="Titre de l\'étape" value="' + esc(s[0]) + '">' +
      '<button type="button" class="icon-btn" data-act="up" aria-label="Monter l\'étape">↑</button>' +
      '<button type="button" class="icon-btn" data-act="down" aria-label="Descendre l\'étape">↓</button>' +
      '<button type="button" class="icon-btn" data-act="del" aria-label="Supprimer l\'étape">×</button></div>' +
      '<textarea class="input" data-k="texte" rows="3" placeholder="Ce qu\'il faut faire…" aria-label="Texte de l\'étape">' + esc(s[1]) + "</textarea></div>";
  }

  function reglagesHTML() {
    var a = !!getJeton();
    return '<details class="box settings" id="reglages"' + (a ? "" : " open") + ">" +
      "<summary>Réglages GitHub <span class=\"badge" + (a ? " ok" : "") + "\" id=\"jetonEtat\">" + (a ? "Jeton enregistré" : "À faire une fois") + "</span></summary>" +
      '<p class="hint">Pour que la recette soit ajoutée au livre de tout le monde, l\'application a besoin d\'un <b>jeton GitHub</b> (une sorte de mot de passe limité). Il reste uniquement sur ce téléphone.</p>' +
      '<ol class="help">' +
      '<li>Ouvrir <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">github.com/settings/personal-access-tokens/new</a> (se connecter au compte GitHub).</li>' +
      "<li>Nom : « Livre de recettes ». Expiration : au choix (ex. 1 an).</li>" +
      "<li>Repository access : <b>Only select repositories</b> → choisir <b>nicobuq8-hue/livre-recettes</b>.</li>" +
      "<li>Permissions → Repository permissions → <b>Contents</b> : <b>Read and write</b>.</li>" +
      "<li>Cliquer sur <b>Generate token</b>, copier le jeton (il commence par <code>github_pat_</code>) et le coller ci-dessous.</li></ol>" +
      champ("jeton", "Jeton GitHub", 'type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="' + (a ? "•••••••• (déjà enregistré)" : "github_pat_…") + '"') +
      '<div class="actions inline"><button class="btn flex" type="button" id="jetonSave">Enregistrer</button>' +
      '<button class="btn flex" type="button" id="jetonTest"' + (a ? "" : " disabled") + ">Vérifier</button>" +
      '<button class="btn danger-text" type="button" id="jetonDel"' + (a ? "" : " disabled") + ">Effacer</button></div>" +
      '<p class="hint" id="jetonMsg" aria-live="polite"></p></details>';
  }

  function brancherReglages(root) {
    var input = root.querySelector("#jeton"), msg = root.querySelector("#jetonMsg");
    function maj() {
      var a = !!getJeton(), b = root.querySelector("#jetonEtat");
      b.textContent = a ? "Jeton enregistré" : "À faire une fois"; b.classList.toggle("ok", a);
      root.querySelector("#jetonTest").disabled = !a; root.querySelector("#jetonDel").disabled = !a;
      input.placeholder = a ? "•••••••• (déjà enregistré)" : "github_pat_…";
    }
    root.querySelector("#jetonSave").addEventListener("click", function () {
      var v = input.value.trim();
      if (!v) { msg.textContent = "Collez d'abord le jeton dans la case."; return; }
      setJeton(v); input.value = ""; maj();
      msg.textContent = "Jeton enregistré sur ce téléphone.";
    });
    root.querySelector("#jetonDel").addEventListener("click", function () {
      if (!confirm("Effacer le jeton GitHub de ce téléphone ?")) return;
      setJeton(""); maj(); msg.textContent = "Jeton effacé.";
    });
    root.querySelector("#jetonTest").addEventListener("click", function () {
      msg.textContent = "Vérification…";
      gh("GET", "https://api.github.com/repos/" + DEPOT).then(function (d) {
        msg.textContent = d.permissions && d.permissions.push ? "✅ Le jeton fonctionne : vous pouvez ajouter des recettes."
          : "⚠️ Le jeton peut lire le dépôt mais pas écrire. Donnez-lui la permission « Contents : Read and write ».";
      }, function (e) { msg.textContent = "❌ " + e.message; });
    });
  }

  function categoriesConnues() {
    var c = H.categories.slice();
    H.recettes.forEach(function (r) { if (r.categorie && c.indexOf(r.categorie) === -1) c.push(r.categorie); });
    return c;
  }

  function renderForm(app, r) {
    var esc = H.esc, edit = !!r;
    r = r || { titre: "", sousTitre: "", categorie: "Plats", infos: {}, rendement: { valeur: 4, unite: "personnes", pas: 1 }, ingredients: [{}, {}, {}], etapes: [["", ""], ["", ""]] };
    var cats = categoriesConnues(), autre = cats.indexOf(r.categorie) === -1;
    var inf = r.infos || {}, rd = r.rendement || {};
    function infoVal(v) { return v && v !== "Non précisé" ? v : ""; }
    document.title = (edit ? "Modifier la recette" : "Ajouter une recette") + " · Mon livre de recettes";

    app.innerHTML =
      '<form class="form" id="form" novalidate>' +
      '<h1 class="form-title">' + (edit ? "Modifier la recette" : "Ajouter une recette") + "</h1>" +
      (edit ? "" : '<p class="hint intro">Remplissez la fiche puis appuyez sur « Ajouter au livre ». La recette sera visible par tout le monde.</p>') +
      reglagesHTML() +
      importHTML() +

      '<section class="box"><h2>La recette</h2>' +
      champ("titre", "Titre *", 'required autocomplete="off" placeholder="ex. Tarte aux pommes" value="' + esc(r.titre) + '"') +
      champ("sousTitre", "Sous-titre (facultatif)", 'autocomplete="off" placeholder="ex. pâte brisée maison" value="' + esc(r.sousTitre || "") + '"') +
      '<label class="field-label" for="cat">Catégorie</label><div class="select-wrap"><select id="cat">' +
      cats.map(function (c) { return '<option' + (c === r.categorie ? " selected" : "") + ">" + esc(c) + "</option>"; }).join("") +
      '<option value="__autre"' + (autre ? " selected" : "") + ">Autre catégorie…</option></select></div>" +
      '<div id="catAutreWrap"' + (autre ? "" : " hidden") + ">" + champ("catAutre", "Nom de la nouvelle catégorie", 'autocomplete="off" placeholder="ex. Sauces" value="' + esc(autre ? r.categorie : "") + '"') + "</div>" +
      "</section>" +

      '<section class="box"><h2>Pour combien ?</h2>' +
      '<p class="hint top">Sert au calculateur : les quantités seront recalculées quand on change ce nombre.</p>' +
      '<div class="cols3"><div>' + champ("rdVal", "Nombre *", 'inputmode="decimal" value="' + esc(fmt(rd.valeur || 4)) + '"') + "</div>" +
      "<div>" + champ("rdUnite", "Unité", 'autocomplete="off" placeholder="personnes" list="unitesRendement" value="' + esc(rd.unite || "personnes") + '"') + "</div>" +
      "<div>" + champ("rdPas", "Pas (+/−)", 'inputmode="decimal" value="' + esc(fmt(rd.pas || 1)) + '"') + "</div></div>" +
      '<datalist id="unitesRendement"><option value="personnes"><option value="parts"><option value="pièces"><option value="gâteaux"><option value="terrines"><option value="bocaux"></datalist>' +
      "</section>" +

      '<section class="box"><h2>Infos (facultatif)</h2><div class="cols2">' +
      "<div>" + champ("infParts", "Parts / portions", 'autocomplete="off" placeholder="ex. 6 personnes" value="' + esc(edit && inf.parts !== (fmt(rd.valeur) + " " + rd.unite) ? infoVal(inf.parts) : "") + '"') + "</div>" +
      "<div>" + champ("infPrep", "Préparation", 'autocomplete="off" placeholder="ex. 20 min" value="' + esc(infoVal(inf.preparation)) + '"') + "</div>" +
      "<div>" + champ("infCuisson", "Cuisson", 'autocomplete="off" placeholder="ex. 35 min" value="' + esc(infoVal(inf.cuisson)) + '"') + "</div>" +
      "<div>" + champ("infTemp", "Température", 'autocomplete="off" placeholder="ex. 180 °C" value="' + esc(infoVal(inf.temperature)) + '"') + "</div>" +
      "</div></section>" +

      '<section class="box"><h2>Ingrédients</h2>' +
      '<p class="hint top">Mettez la quantité en chiffres pour qu\'elle soit recalculée. Sans quantité (ex. « Sel, poivre »), la ligne reste telle quelle. « Groupe » ajoute un intertitre (ex. Pâte, Garniture).</p>' +
      '<div class="rows" id="ings">' + r.ingredients.map(ligneIngredient).join("") + "</div>" +
      '<datalist id="unites">' + UNITES.map(function (u) { return '<option value="' + esc(u) + '">'; }).join("") + "</datalist>" +
      '<div class="actions inline"><button class="btn flex" type="button" id="addIng">＋ Ingrédient</button>' +
      '<button class="btn flex" type="button" id="addGroup">＋ Groupe</button></div></section>' +

      '<section class="box"><h2>Étapes</h2>' +
      '<div class="rows" id="etapes">' + r.etapes.filter(Array.isArray).map(ligneEtape).join("") + "</div>" +
      '<div class="actions inline"><button class="btn flex" type="button" id="addStep">＋ Étape</button></div></section>' +

      '<section class="box"><h2>Photo (facultatif)</h2>' +
      '<div class="photo-preview" id="photoPreview"' + (r.image ? "" : " hidden") + '>' + (r.image ? '<img src="' + esc(r.image) + '" alt="">' : "") + "</div>" +
      '<label class="btn file-btn"><input type="file" id="photo" accept="image/*">📷 ' + (r.image ? "Changer la photo" : "Prendre ou choisir une photo") + "</label>" +
      '<button class="btn danger-text" type="button" id="photoDel"' + (r.image ? "" : " hidden") + ">Retirer la photo</button>" +
      "</section>" +

      '<div class="status" id="status" role="status" aria-live="polite" hidden></div>' +
      '<div class="form-submit"><button class="btn primary" type="submit" id="submit">' + (edit ? "Enregistrer les modifications" : "Ajouter au livre") + "</button>" +
      '<a class="btn" href="' + (edit ? "#/recette/" + esc(r.id) : "#/") + '">Annuler</a></div>' +
      '<div class="spacer"></div></form>';

    var form = app.querySelector("#form");
    brancherReglages(form);

    var cat = form.querySelector("#cat"), catAutreWrap = form.querySelector("#catAutreWrap");
    cat.addEventListener("change", function () { catAutreWrap.hidden = cat.value !== "__autre"; if (!catAutreWrap.hidden) form.querySelector("#catAutre").focus(); });

    var ings = form.querySelector("#ings"), etapes = form.querySelector("#etapes");
    function numeroter() { etapes.querySelectorAll(".step-num").forEach(function (s, i) { s.textContent = i + 1; }); }
    function ajouter(cont, html) { cont.insertAdjacentHTML("beforeend", html); var el = cont.lastElementChild; var f = el.querySelector("input,textarea"); if (f) f.focus(); numeroter(); }
    form.querySelector("#addIng").addEventListener("click", function () { ajouter(ings, ligneIngredient({})); });
    form.querySelector("#addGroup").addEventListener("click", function () { ajouter(ings, ligneIngredient({ g: "" })); });
    form.querySelector("#addStep").addEventListener("click", function () { ajouter(etapes, ligneEtape()); });
    [ings, etapes].forEach(function (cont) {
      cont.addEventListener("click", function (e) {
        var b = e.target.closest("[data-act]"); if (!b) return;
        var row = b.closest(".row"), act = b.getAttribute("data-act");
        if (act === "del") row.remove();
        if (act === "up" && row.previousElementSibling) cont.insertBefore(row, row.previousElementSibling);
        if (act === "down" && row.nextElementSibling) cont.insertBefore(row.nextElementSibling, row);
        numeroter();
      });
    });
    numeroter();

    // import depuis une IA
    function remplir(x) {
      function set(id, v) { form.querySelector("#" + id).value = v || ""; }
      set("titre", x.titre); set("sousTitre", x.sousTitre);
      if (x.categorie) {
        var connue = null;
        Array.prototype.forEach.call(cat.options, function (o) { if (o.value !== "__autre" && H.norm(o.value) === H.norm(x.categorie)) connue = o.value; });
        cat.value = connue || "__autre"; catAutreWrap.hidden = !!connue; set("catAutre", connue ? "" : x.categorie);
      }
      set("rdVal", x.rendement.valeur ? fmt(x.rendement.valeur) : ""); set("rdUnite", x.rendement.unite || "personnes");
      var autoParts = x.rendement.valeur && H.norm(x.infos.parts) === H.norm(fmt(x.rendement.valeur) + " " + (x.rendement.unite || ""));
      set("infParts", autoParts ? "" : x.infos.parts); set("infPrep", x.infos.preparation); set("infCuisson", x.infos.cuisson); set("infTemp", x.infos.temperature);
      ings.innerHTML = (x.ingredients.length ? x.ingredients : [{}]).map(ligneIngredient).join("");
      etapes.innerHTML = (x.etapes.length ? x.etapes : [["", ""]]).map(ligneEtape).join("");
      numeroter();
    }
    var iaMsg = form.querySelector("#iaMsg"), iaCopieMsg = form.querySelector("#iaCopieMsg");
    form.querySelector("#iaCopier").addEventListener("click", function () {
      copier(CONSIGNE_IA).then(function () { iaCopieMsg.textContent = "Consigne copiée ✅"; },
        function () { iaCopieMsg.textContent = "La copie automatique ne marche pas ici : ouvrez « Voir la consigne », sélectionnez tout le texte et copiez-le."; form.querySelector(".voir-consigne").open = true; });
    });
    form.querySelector("#iaRemplir").addEventListener("click", function () {
      var txt = form.querySelector("#iaReponse").value;
      if (!txt.trim()) { iaMsg.className = "hint warn"; iaMsg.textContent = "Collez d'abord la réponse de l'IA dans la case."; return; }
      try {
        var x = depuisIA(txt);
        remplir(x);
        form.querySelector("#iaReponse").value = "";
        var manque = [];
        if (!x.titre) manque.push("le titre");
        if (!x.rendement.valeur) manque.push("pour combien (nombre)");
        if (!x.ingredients.length) manque.push("les ingrédients");
        if (!x.etapes.length) manque.push("les étapes");
        iaMsg.className = "hint ok";
        iaMsg.textContent = "Formulaire rempli : vérifie puis envoie." + (manque.length ? " À compléter : " + manque.join(", ") + "." : "");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {
        iaMsg.className = "hint warn";
        iaMsg.textContent = "❌ " + e.message;
      }
    });

    // photo
    var photo = { data: null, retirer: false };
    var inputPhoto = form.querySelector("#photo"), preview = form.querySelector("#photoPreview"), photoDel = form.querySelector("#photoDel");
    inputPhoto.addEventListener("change", function () {
      var f = inputPhoto.files && inputPhoto.files[0]; if (!f) return;
      preview.hidden = false; preview.innerHTML = '<p class="hint">Préparation de la photo…</p>';
      redimensionner(f).then(function (data) {
        photo.data = data; photo.retirer = false;
        preview.innerHTML = '<img src="' + data + '" alt="">'; photoDel.hidden = false;
      }, function (e) { preview.innerHTML = '<p class="hint warn">' + esc(e.message) + "</p>"; });
    });
    photoDel.addEventListener("click", function () {
      photo.data = null; photo.retirer = true; inputPhoto.value = "";
      preview.hidden = true; preview.innerHTML = ""; photoDel.hidden = true;
    });

    var status = form.querySelector("#status"), submit = form.querySelector("#submit");
    function etat(txt, type) { status.hidden = false; status.className = "status " + (type || ""); status.innerHTML = txt; }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var lu = lireFormulaire(form, r, edit);
      if (lu.erreur) { etat("⚠️ " + esc(lu.erreur), "error"); if (lu.champ) lu.champ.focus(); return; }
      if (!getJeton()) {
        etat("⚠️ Il faut d'abord enregistrer votre jeton GitHub (une seule fois). Voir « Réglages GitHub » en haut.", "error");
        var d = form.querySelector("#reglages"); d.open = true; d.scrollIntoView({ behavior: "smooth" }); return;
      }
      submit.disabled = true;
      envoyer(lu.recette, photo, edit, r, function (txt) { etat('<span class="spinner" aria-hidden="true"></span>' + esc(txt), "progress"); })
        .then(function (rec) {
          submit.disabled = false;
          H.integrer(rec, photo.data);
          succes(app, rec, edit);
        }, function (err) {
          submit.disabled = false;
          etat("❌ " + esc(err.message || "Erreur inconnue."), "error");
        });
    });
  }

  function lireFormulaire(form, ancienne, edit) {
    function v(id) { return form.querySelector("#" + id).value.trim(); }
    var titre = v("titre");
    if (!titre) return { erreur: "Indiquez le titre de la recette.", champ: form.querySelector("#titre") };
    var categorie = form.querySelector("#cat").value === "__autre" ? v("catAutre") : form.querySelector("#cat").value;
    if (!categorie) return { erreur: "Indiquez le nom de la nouvelle catégorie.", champ: form.querySelector("#catAutre") };
    var valeur = nombre(v("rdVal"));
    if (!valeur) return { erreur: "Indiquez pour combien est la recette (un nombre, ex. 4).", champ: form.querySelector("#rdVal") };
    var unite = v("rdUnite") || "personnes", pas = nombre(v("rdPas")) || 1;

    var ingredients = [], erreur = null;
    form.querySelectorAll("#ings .row").forEach(function (row) {
      if (erreur) return;
      function k(n) { return row.querySelector('[data-k="' + n + '"]').value.trim(); }
      if (row.getAttribute("data-type") === "g") { if (k("g")) ingredients.push({ g: k("g") }); return; }
      var qTxt = k("q"), u = k("u"), l = k("l");
      if (!qTxt && !u && !l) return; // ligne vide
      if (!l) { erreur = { erreur: "Il manque le nom d'un ingrédient.", champ: row.querySelector('[data-k="l"]') }; return; }
      var q = nombre(qTxt);
      if (qTxt && !q) { erreur = { erreur: "La quantité « " + qTxt + " » n'est pas un nombre (ex. 250 ou 0,5).", champ: row.querySelector('[data-k="q"]') }; return; }
      if (!q) { ingredients.push({ t: (u ? u + " " : "") + l }); return; }
      var it = { t: fmt(q) + " " + (u ? u + " " : "") + l, q: q };
      if (u) it.u = u;
      it.l = l;
      ingredients.push(it);
    });
    if (erreur) return erreur;
    if (!ingredients.some(function (it) { return it.g === undefined; })) return { erreur: "Ajoutez au moins un ingrédient.", champ: form.querySelector('#ings [data-k="l"]') };

    var etapes = [];
    form.querySelectorAll("#etapes .row").forEach(function (row, i) {
      var t = row.querySelector('[data-k="titre"]').value.trim(), x = row.querySelector('[data-k="texte"]').value.trim();
      if (t || x) etapes.push([t || "Étape " + (etapes.length + 1), x]);
    });
    if (!etapes.length) return { erreur: "Ajoutez au moins une étape.", champ: form.querySelector('#etapes [data-k="titre"]') };

    var recette = {
      id: edit ? ancienne.id : null,
      titre: titre, sousTitre: v("sousTitre"), categorie: categorie,
      image: edit ? ancienne.image || null : null,
      infos: { parts: v("infParts") || fmt(valeur) + " " + unite, preparation: v("infPrep") || "Non précisé", cuisson: v("infCuisson") || "Non précisé", temperature: v("infTemp") || "Non précisé" },
      rendement: { valeur: valeur, unite: unite, uniteSing: singulier(unite), pas: pas, min: pas },
      ingredients: ingredients,
      etapes: etapes
    };
    return { recette: recette };
  }

  function envoyer(rec, photo, edit, ancienne, progres) {
    progres("Connexion au livre sur GitHub…");
    return lireDonnees().then(function (d) {
      if (edit) {
        if (!d.liste.some(function (x) { return x.id === rec.id; })) throw Erreur("Cette recette n'existe plus dans le livre (supprimée entre-temps ?).");
      } else {
        rec.id = idUnique(rec.titre, d.liste);
      }
      var etape = Promise.resolve();
      var cheminImage = "img/ajout-" + rec.id + ".jpg";
      if (photo.data) {
        etape = etape.then(function () {
          progres("Envoi de la photo…");
          return envoyerImage(cheminImage, photo.data.split(",")[1], (edit ? "Photo modifiée : " : "Photo recette : ") + rec.titre);
        }).then(function () { rec.image = cheminImage; });
      } else if (photo.retirer) {
        rec.image = null;
      }
      return etape.then(function () {
        progres("Enregistrement de la recette…");
        return majDonnees(function (liste) {
          if (edit) return liste.map(function (x) { return x.id === rec.id ? rec : x; });
          if (liste.some(function (x) { return x.id === rec.id; })) throw Erreur("Une recette avec ce titre vient d'être ajoutée. Changez légèrement le titre.");
          return liste.concat([rec]);
        }, (edit ? "Modification recette : " : "Ajout recette : ") + rec.titre, d);
      }).then(function () {
        if (photo.retirer && ancienne && /^img\/ajout-/.test(ancienne.image || "")) {
          return supprimerFichier(ancienne.image, "Photo retirée : " + rec.titre).catch(function () {});
        }
      }).then(function () { noterAttente(rec); return rec; });
    });
  }

  function succes(app, rec, edit) {
    var esc = H.esc;
    app.innerHTML = '<section class="done-box">' +
      '<div class="done-icon" aria-hidden="true">✅</div>' +
      "<h1>" + (edit ? "Recette modifiée" : "Recette ajoutée") + "</h1>" +
      "<p>" + (edit ? "Les modifications apparaîtront dans le livre d'ici 1 à 2 minutes." : "Recette ajoutée, elle apparaîtra dans le livre d'ici 1 à 2 minutes.") + "</p>" +
      '<p class="hint">Sur ce téléphone, vous pouvez déjà la voir.</p>' +
      '<div class="form-submit"><a class="btn primary" href="#/recette/' + esc(rec.id) + '">Voir « ' + esc(rec.titre) + " »</a>" +
      (edit ? '<a class="btn" href="#/">Retour aux recettes</a>' : '<a class="btn" href="#/ajouter" id="encore">Ajouter une autre recette</a>') + "</div></section>";
    var encore = app.querySelector("#encore");
    if (encore) encore.addEventListener("click", function (e) { e.preventDefault(); if (location.hash === "#/ajouter") H.route(); else location.hash = "#/ajouter"; });
    window.scrollTo(0, 0);
  }

  function supprimer(r) {
    if (!getJeton()) { alert("Pour supprimer, il faut d'abord enregistrer votre jeton GitHub : ouvrez « Ajouter une recette » puis « Réglages GitHub »."); return Promise.resolve(false); }
    if (!confirm("Supprimer définitivement la recette « " + r.titre + " » du livre ?\nElle disparaîtra pour tout le monde.")) return Promise.resolve(false);
    return majDonnees(function (liste) {
      if (!liste.some(function (x) { return x.id === r.id; })) throw Erreur("Cette recette n'est déjà plus dans le livre.");
      return liste.filter(function (x) { return x.id !== r.id; });
    }, "Suppression recette : " + r.titre).then(function () {
      noterAttente(null, r.id);
      if (/^img\/ajout-/.test(r.image || "")) return supprimerFichier(r.image, "Photo supprimée : " + r.titre).catch(function () {});
    }).then(function () { return true; }, function (e) { alert("La recette n'a pas été supprimée.\n" + e.message); return false; });
  }

  window.Ajout = {
    init: function (outils) { H = outils; },
    renderForm: renderForm,
    supprimer: supprimer,
    attente: lireAttente,
    depuisIA: function (txt) { return depuisIA(txt); },
    CONSIGNE_IA: CONSIGNE_IA,
    FICHIER: FICHIER
  };
})();
