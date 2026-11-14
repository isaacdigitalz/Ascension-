/* ASCENSION V4 Service Worker - Offline + Auto Update */
const CACHE_NAME = "ascension-v4-pwa";
const FILES_TO_CACHE = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(FILES_TO_CACHE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => { if(k !== CACHE_NAME) return caches.delete(k); }))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  if(e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then((res) => { const copy = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(e.request, copy)); return res; }).catch(() => caches.match(e.request).then((cached) => { if(cached) return cached; if(e.request.mode === "navigate") return caches.match("./index.html"); return new Response("Offline - ASCENSION is saved. Go online to update.", {status: 200}); })));
});
self.addEventListener("message", (e) => { if(e.data && e.data.type === "SKIP_WAITING") self.skipWaiting(); });