(function () {
  "use strict";

  var RECETTES = window.RECETTES || [];
  var CATEGORIES = window.CATEGORIES || [];
  var app = document.getElementById("app");
  var btnBack = document.getElementById("btnBack");

  var homeState = { q: "", cat: "Toutes", scroll: 0 };
  var recState = {}; // id -> { format, value, done: {} }

  var EMOJI = { "Entrées": "🥗", "Plats": "🍲", "Desserts": "🍰", "Boulangerie": "🥖", "Bases": "🥣" };

  /* ---------------- utilitaires ---------------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function norm(s) {
    return String(s || "").toLowerCase().replace(/œ/g, "oe").replace(/æ/g, "ae")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function byId(id) { for (var i = 0; i < RECETTES.length; i++) if (RECETTES[i].id === id) return RECETTES[i]; return null; }

  var ICON = {
    clock: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    fire: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5 1-8.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    users: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><circle cx="9" cy="8" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2.5 20c.5-3.5 3-5.5 6.5-5.5s6 2 6.5 5.5M16 4.8a3.3 3.3 0 0 1 0 6.4M18 14.8c2 .6 3.2 2.4 3.5 5.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    temp: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M10 4a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    search: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    share: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 15V3M7 8l5-5 5 5M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    print: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M7 9V3h10v6M7 17H4v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6h-3M7 14h10v7H7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    back: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /* ---------------- quantités ---------------- */
  var MASS = { "g": 1, "ml": 1 };
  var BIG = { "kg": 1, "L": 1 };

  var precise = false; // recettes « calculateur » : grammes à l'unité près
  function roundQty(v, u) {
    if (v <= 0) return 0;
    if (MASS[u] && precise) return v < 10 ? Math.round(v * 2) / 2 : Math.round(v);
    if (MASS[u]) {
      if (v < 2) return Math.max(0.5, Math.round(v * 2) / 2);
      if (v < 10) return Math.round(v * 2) / 2;
      if (v < 100) return Math.round(v);
      if (v < 500) return Math.round(v / 5) * 5;
      return Math.round(v / 10) * 10;
    }
    if (BIG[u]) return Math.max(0.05, Math.round(v * 20) / 20);
    if (u === "cl") return v < 10 ? Math.max(0.5, Math.round(v * 2) / 2) : Math.round(v);
    // pièces, cuillères, pincées, sachets, verres… : au demi près
    return Math.max(0.5, Math.round(v * 2) / 2);
  }

  function fmtNum(v, u) {
    var counted = !MASS[u] && !BIG[u] && u !== "cl";
    if (counted) {
      var whole = Math.floor(v + 1e-9), half = v - whole > 0.25;
      if (half && whole === 0) return "½";
      if (half) return whole + " ½";
      return String(whole);
    }
    var s = (Math.round(v * 100) / 100).toString().replace(".", ",");
    var parts = s.split(",");
    if (parts[0].length > 3) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
    return parts.join(",");
  }

  function qtyText(q, f, u) {
    if (Array.isArray(q)) {
      var a = roundQty(q[0] * f, u), b = roundQty(q[1] * f, u);
      return { txt: a === b ? fmtNum(a, u) : fmtNum(a, u) + " à " + fmtNum(b, u), max: b };
    }
    var r = roundQty(q * f, u);
    return { txt: fmtNum(r, u), max: r };
  }

  function ingredientHTML(it, f, calcul) {
    if (it.q === undefined) return esc(it.t);
    if (f === 1 && !calcul && it.t) return esc(it.t);
    var u = it.u || "";
    precise = !!calcul;
    var qt = it.precis ? (function (v) { v = Math.max(0.1, Math.round(v * 10) / 10); return { txt: fmtNum(v, u), max: v }; })(it.q * f) : qtyText(it.q, f, u);
    var label = (!u && it.sg && qt.max <= 1) ? it.sg : it.l;
    var html = (it.pre ? esc(it.pre) + " " : "") + "<b>" + qt.txt + (u ? " " + esc(u) : "") + "</b> " + esc(label);
    if (it.ou) {
      var o = qtyText(it.ou.q, f, it.ou.u);
      html += " ou <b>" + o.txt + " " + esc(it.ou.u) + "</b> " + esc(it.ou.l);
    }
    if (it.oeufsPour) {
      var n = roundQty(it.q * f / it.oeufsPour, "");
      html += ", soit environ " + fmtNum(n, "") + (n <= 1 ? " oeuf" : " oeufs");
    }
    if (it.jaunesPour) {
      var j = roundQty(it.q * f / it.jaunesPour, "");
      html += ", environ " + fmtNum(j, "") + (j <= 1 ? " jaune" : " jaunes");
    }
    precise = false;
    if (calcul && it.t) html += '<span class="ing-rule">Fiche : ' + esc(it.t) + "</span>";
    return html;
  }

  /* ---------------- état d'une recette ---------------- */
  function currentFormat(r, st) {
    if (!r.formats) return { rendement: r.rendement, ingredients: r.ingredients };
    for (var i = 0; i < r.formats.length; i++) if (r.formats[i].id === st.format) return r.formats[i];
    return r.formats[0];
  }
  function getState(r) {
    if (!recState[r.id]) {
      var fmt = r.formats ? r.formats[0] : null;
      recState[r.id] = { format: fmt ? fmt.id : null, value: (function(x){return x.depart||x.valeur;})(fmt ? fmt.rendement : r.rendement), done: {} };
    }
    return recState[r.id];
  }

  /* ---------------- accueil ---------------- */
  function matches(r, q) {
    if (!q) return true;
    var hay = r._search;
    if (!hay) {
      var parts = [r.titre, r.sousTitre, r.categorie];
      (r.ingredients || []).forEach(function (it) { parts.push(it.t || "", it.l || ""); });
      hay = r._search = norm(parts.join(" | "));
    }
    return norm(q).split(/\s+/).filter(Boolean).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function cardHTML(r) {
    var img = r.image
      ? '<img src="' + esc(r.image) + '" alt="" loading="lazy" decoding="async">'
      : '<div class="placeholder" aria-hidden="true">' + (EMOJI[r.categorie] || "🍽️") + "</div>";
    return '<a class="card" href="#/recette/' + esc(r.id) + '">' +
      '<div class="card-img">' + img + "</div>" +
      '<div class="card-body"><span class="cat">' + esc(r.categorie) + "</span>" +
      '<h2 class="card-title">' + esc(r.titre) + "</h2>" +
      '<p class="card-sub">' + esc(r.sousTitre) + "</p>" +
      '<div class="tags"><span class="tag">' + ICON.clock + esc(r.infos.preparation) + "</span>" +
      '<span class="tag amber">' + ICON.fire + esc(r.infos.cuisson) + "</span></div></div></a>";
  }

  function renderHome() {
    document.title = "Mon livre de recettes";
    btnBack.hidden = true;
    var cats = ["Toutes"].concat(CATEGORIES.filter(function (c) {
      return RECETTES.some(function (r) { return r.categorie === c; });
    }));
    app.innerHTML =
      '<section class="home-hero"><h1>Que voulez-vous cuisiner&nbsp;?</h1>' +
      '<label class="search">' + ICON.search +
      '<input id="q" type="search" inputmode="search" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Titre ou ingrédient…" aria-label="Rechercher une recette par titre ou ingrédient" value="' + esc(homeState.q) + '">' +
      '<button class="clear" id="clear" type="button" aria-label="Effacer la recherche"' + (homeState.q ? "" : " hidden") + '>×</button></label></section>' +
      '<nav class="chips" aria-label="Catégories">' + cats.map(function (c) {
        return '<button class="chip" type="button" data-cat="' + esc(c) + '" aria-pressed="' + (c === homeState.cat) + '">' + esc(c) + "</button>";
      }).join("") + "</nav>" +
      '<p class="count" id="count" aria-live="polite"></p><div class="grid" id="grid"></div>';

    var input = document.getElementById("q"), clear = document.getElementById("clear");
    input.addEventListener("input", function () { homeState.q = input.value; clear.hidden = !input.value; renderList(); });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") input.blur(); });
    clear.addEventListener("click", function () { homeState.q = ""; input.value = ""; clear.hidden = true; renderList(); input.focus(); });
    app.querySelectorAll(".chip").forEach(function (b) {
      b.addEventListener("click", function () {
        homeState.cat = b.getAttribute("data-cat");
        app.querySelectorAll(".chip").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        renderList();
      });
    });
    renderList();
    window.scrollTo(0, homeState.scroll || 0);
  }

  function renderList() {
    var list = RECETTES.filter(function (r) {
      return (homeState.cat === "Toutes" || r.categorie === homeState.cat) && matches(r, homeState.q);
    }).sort(function (a, b) { return a.titre.localeCompare(b.titre, "fr"); });
    document.getElementById("count").textContent = list.length + (list.length > 1 ? " recettes" : " recette");
    document.getElementById("grid").innerHTML = list.length
      ? list.map(cardHTML).join("")
      : '<p class="empty">Aucune recette ne correspond à votre recherche.</p>';
  }

  /* ---------------- page recette ---------------- */
  function renderRecipe(r) {
    document.title = r.titre + " · Mon livre de recettes";
    btnBack.hidden = false;
    var st = getState(r);
    var img = r.image
      ? '<img src="' + esc(r.image) + '" alt="' + esc(r.titre) + '">'
      : '<div class="placeholder" aria-hidden="true">' + (EMOJI[r.categorie] || "🍽️") + "</div>";
    var canShare = !!navigator.share;

    app.innerHTML =
      '<article class="recipe">' +
      '<div class="hero">' + img + '<div class="hero-text"><span class="cat">' + esc(r.categorie) + "</span>" +
      "<h1>" + esc(r.titre) + "</h1><p>" + esc(r.sousTitre) + "</p></div></div>" +
      '<div class="actions">' +
      (canShare ? '<button class="btn flex" id="share" type="button">' + ICON.share + "Partager</button>" : "") +
      '<button class="btn flex" id="print" type="button">' + ICON.print + "PDF / Imprimer</button></div>" +
      '<div class="tiles" id="tiles"></div>' +
      '<section class="box" id="qtybox"></section>' +
      '<h2 class="sec-title">Ingrédients</h2><ul class="ingredients" id="ings"></ul>' +
      '<h2 class="sec-title">Préparation</h2><ol class="steps">' +
      (function () { var n = 0; return r.etapes.map(function (s) {
        if (!Array.isArray(s)) { n = 0; return '<li class="step-group">' + esc(s.g) + "</li>"; }
        n++;
        return '<li class="step"><span class="step-num">' + n + "</span><div><h3>" + esc(s[0]) + "</h3><p>" + esc(s[1]) + "</p></div></li>";
      }).join(""); })() + "</ol>" +
      '<p class="source print-only">Mon livre de recettes</p>' +
      '<div class="spacer"></div></article>' +
      '<div class="sticky-back"><a href="#/">' + ICON.back + "Retour aux recettes</a></div>";

    document.getElementById("print").addEventListener("click", function () { window.print(); });
    if (canShare) document.getElementById("share").addEventListener("click", function () {
      navigator.share({ title: r.titre, text: r.titre + " – " + r.sousTitre, url: location.href }).catch(function () {});
    });

    renderDynamic(r);
    window.scrollTo(0, 0);
  }

  function renderDynamic(r) {
    var st = getState(r);
    var fmt = currentFormat(r, st);
    var rd = fmt.rendement;
    var ings = fmt.ingredients || r.ingredients;
    var f = st.value / rd.valeur;

    // tuiles
    var cuisson = fmt.cuisson || r.infos.cuisson;
    document.getElementById("tiles").innerHTML =
      tile(ICON.users, "Parts", r.infos.parts) + tile(ICON.clock, "Préparation", r.infos.preparation) +
      tile(ICON.fire, "Cuisson", cuisson) + tile(ICON.temp, "Température / repos", r.infos.temperature);

    // format + quantité
    var unit = st.value <= 1 ? rd.uniteSing : rd.unite;
    var html = "<h2>" + (r.formats ? "Format et quantité" : (r.calcul ? "Calculateur" : "Quantité")) + "</h2>";
    if (r.formats) {
      html += '<label class="field-label" for="fmt">Format</label><div class="select-wrap"><select id="fmt">' +
        r.formats.map(function (x) {
          return '<option value="' + esc(x.id) + '"' + (x.id === st.format ? " selected" : "") + ">" + esc(x.libelle) + "</option>";
        }).join("") + "</select></div>";
    }
    html += '<span class="field-label">' + esc(rd.libelle || (r.formats ? "Nombre" : "Pour")) + "</span>" +
      '<div class="stepper"><button type="button" id="minus" aria-label="Moins"' + (st.value - rd.pas < rd.min - 1e-9 ? " disabled" : "") + ">−</button>" +
      '<div class="stepper-value" aria-live="polite"><strong>' + fmtNum(st.value, rd.pas < 1 ? "" : "g") + "</strong><span>" + esc(unit) + "</span></div>" +
      '<button type="button" id="plus" aria-label="Plus">+</button></div>';
    if (rd.masseViande) html += '<p class="hint">Masse de viande : <strong>' + fmtNum(Math.round(st.value / rd.masseViande), "g") + " g</strong> (les calculs se font sur cette masse)</p>";
    if (rd.aide) html += '<p class="hint">' + esc(rd.aide) + "</p>";
    if (fmt.note) html += '<p class="hint">' + esc(fmt.note) + "</p>";
    if (Math.abs(st.value - (rd.depart || rd.valeur)) > 1e-9) {
      html += '<p class="hint warn">Quantités recalculées (×' + fmtNum(Math.round(f * 100) / 100, "g") + "). Les quantités citées dans les étapes correspondent à la recette d'origine.</p>" +
        '<button class="reset no-print" type="button" id="reset">Revenir à la recette d\'origine</button>';
    }
    var box = document.getElementById("qtybox");
    box.innerHTML = html;

    var sel = document.getElementById("fmt");
    if (sel) sel.addEventListener("change", function () {
      st.format = sel.value; st.done = {};
      st.value = (currentFormat(r, st).rendement.depart || currentFormat(r, st).rendement.valeur);
      renderDynamic(r);
    });
    document.getElementById("minus").addEventListener("click", function () { st.value = Math.max(rd.min, +(st.value - rd.pas).toFixed(2)); renderDynamic(r); });
    document.getElementById("plus").addEventListener("click", function () { st.value = +(st.value + rd.pas).toFixed(2); renderDynamic(r); });
    var reset = document.getElementById("reset");
    if (reset) reset.addEventListener("click", function () { st.value = rd.depart || rd.valeur; renderDynamic(r); });

    // ingrédients
    var ul = document.getElementById("ings");
    ul.innerHTML = ings.map(function (it, i) {
      if (it.g !== undefined) return '<li class="group">' + esc(it.g) + "</li>";
      return '<li class="ing' + (st.done[i] ? " done" : "") + '" data-i="' + i + '" role="checkbox" aria-checked="' + !!st.done[i] + '" tabindex="0">' +
        '<span class="check" aria-hidden="true"></span><span class="ing-text">' + ingredientHTML(it, f, r.calcul) + "</span></li>";
    }).join("");
    ul.querySelectorAll(".ing").forEach(function (li) {
      function toggle() {
        var i = li.getAttribute("data-i");
        st.done[i] = !st.done[i];
        li.classList.toggle("done", st.done[i]);
        li.setAttribute("aria-checked", String(st.done[i]));
      }
      li.addEventListener("click", toggle);
      li.addEventListener("keydown", function (e) { if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(); } });
    });
  }

  function tile(icon, label, value) {
    return '<div class="tile"><div class="tile-label">' + icon + esc(label) + '</div><div class="tile-value">' + esc(value) + "</div></div>";
  }

  /* ---------------- routeur ---------------- */
  var lastRoute = "";
  function route() {
    var h = location.hash || "#/";
    var m = h.match(/^#\/recette\/([\w-]+)(?:\?(.*))?/);
    if (lastRoute === "home") homeState.scroll = window.scrollY;
    if (m && byId(m[1])) {
      var r = byId(m[1]);
      if (m[2]) { // ex. #/recette/buns?format=mini&n=20
        var st = getState(r), params = {};
        m[2].split("&").forEach(function (kv) { var p = kv.split("="); params[p[0]] = decodeURIComponent(p[1] || ""); });
        if (params.format && r.formats && r.formats.some(function (x) { return x.id === params.format; })) {
          st.format = params.format; st.value = (currentFormat(r, st).rendement.depart || currentFormat(r, st).rendement.valeur);
        }
        var nv = parseFloat(String(params.n || "").replace(",", "."));
        if (nv > 0) st.value = nv;
      }
      lastRoute = "recipe"; renderRecipe(r);
    }
    else { lastRoute = "home"; renderHome(); }
  }
  btnBack.addEventListener("click", function () { location.hash = "#/"; });
  window.addEventListener("hashchange", route);
  route();

  /* ---------------- hors ligne ---------------- */
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }
})();
