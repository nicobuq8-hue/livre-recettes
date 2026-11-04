/* Service worker — généré par build-sw.py (ne pas modifier à la main) */
const CACHE = "livre-recettes-fd66c555ba";
const ASSETS = [
  "./",
  "index.html",
  "manifest.json",
  "css/style.css",
  "js/app.js",
  "js/recettes.js",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "img/boeuf-marrons.jpg",
  "img/boudin-blanc.jpg",
  "img/brioche.jpg",
  "img/buns.jpg",
  "img/cassoulet.jpg",
  "img/clafoutis-pommes-tatin.jpg",
  "img/coulant-chocolat.jpg",
  "img/crumble-aux-pommes.jpg",
  "img/flan-patissier-quentin-lechat.jpg",
  "img/fondant-aux-pommes.jpg",
  "img/fondant-chocolat.jpg",
  "img/gateau-courgettes-corinne.jpg",
  "img/langue-boeuf-sauce-piquante.jpg",
  "img/mousse-chocolat.jpg",
  "img/omelette-norvegienne.jpg",
  "img/paella-fernande.jpg",
  "img/pate-brisee.jpg",
  "img/polenta.jpg",
  "img/quenelles-poisson-nantua.jpg",
  "img/savarin-francoise.jpg",
  "img/souffle-fromage.jpg",
  "img/tarte-citron-meringuee.jpg",
  "img/terrine-deux-poissons.jpg",
  "img/terrine-saumon.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => req.mode === "navigate" ? caches.match("index.html") : undefined);
    })
  );
});
