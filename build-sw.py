#!/usr/bin/env python3
"""Régénère sw.js avec la liste de tous les fichiers à mettre en cache.
À relancer après chaque ajout de recette ou de photo : python3 build-sw.py"""
import os, hashlib, json
root = os.path.dirname(os.path.abspath(__file__))
files = ["./", "index.html", "manifest.json"]
h = hashlib.sha1()
for d in ["css", "js", "icons", "img"]:
    for f in sorted(os.listdir(os.path.join(root, d))):
        p = f"{d}/{f}"
        files.append(p)
for p in files[1:]:
    with open(os.path.join(root, p), "rb") as fh: h.update(fh.read())
version = h.hexdigest()[:10]
sw = f"""/* Service worker — généré par build-sw.py (ne pas modifier à la main) */
const CACHE = "livre-recettes-{version}";
const ASSETS = {json.dumps(files, indent=2, ensure_ascii=False)};

self.addEventListener("install", (event) => {{
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
}});

self.addEventListener("activate", (event) => {{
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
}});

self.addEventListener("fetch", (event) => {{
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req, {{ ignoreSearch: true }}).then((hit) => {{
      if (hit) return hit;
      return fetch(req).then((res) => {{
        if (res && res.ok) {{ const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }}
        return res;
      }}).catch(() => req.mode === "navigate" ? caches.match("index.html") : undefined);
    }})
  );
}});
"""
open(os.path.join(root, "sw.js"), "w").write(sw)
print("sw.js :", len(files), "fichiers, version", version)
