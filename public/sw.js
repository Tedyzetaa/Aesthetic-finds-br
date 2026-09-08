// Aesthetic Finds Br — Service Worker
// Estratégia:
//  - Assets estáticos do Next (_next/static) -> cache-first (são imutáveis, hash no nome)
//  - Navegação (HTML) -> network-first, cai no cache se offline, e se a página nunca
//    foi visitada, cai na página /offline
//  - Imagens (mesmo domínio ou remotas) -> stale-while-revalidate
//  - Nunca cacheia /api/*, /admin/* nem POST/PUT/DELETE (dados sensíveis/dinâmicos)

const VERSION = "v1";
const STATIC_CACHE = `afb-static-${VERSION}`;
const PAGES_CACHE = `afb-pages-${VERSION}`;
const IMAGE_CACHE = `afb-images-${VERSION}`;

const PRECACHE_URLS = [
  "/",
  "/offline",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  const keep = new Set([STATIC_CACHE, PAGES_CACHE, IMAGE_CACHE]);
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => !keep.has(n)).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

function isNeverCache(url) {
  return (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/admin")
  );
}

function isNextStatic(url) {
  return url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/_next/image");
}

function isImageRequest(request, url) {
  return (
    request.destination === "image" ||
    /\.(png|jpg|jpeg|webp|gif|svg|avif)$/i.test(url.pathname)
  );
}

// cache-first
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && (response.ok || response.type === "opaque")) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    return cached || Response.error();
  }
}

// stale-while-revalidate
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkFetch = fetch(request)
    .then((response) => {
      if (response && (response.ok || response.type === "opaque")) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);
  return cached || networkFetch;
}

// network-first (para navegação/HTML)
async function networkFirstNavigation(request) {
  const cache = await caches.open(PAGES_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    const offline = await caches.match("/offline");
    return offline || Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (isNeverCache(url)) return; // deixa passar direto pra rede, sem SW

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (isNextStatic(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  if (isImageRequest(request, url)) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    return;
  }

  // demais requisições GET same-origin (css, fontes, etc.)
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
  }
});
