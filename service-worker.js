diff --git a/service-worker.js b/service-worker.js
index c46d521d38c3e4f4baac4eea77f77cea4a7f226d..e5691443624033acae1bf6aa86685522e081aace 100644
--- a/service-worker.js
+++ b/service-worker.js
@@ -3,48 +3,47 @@ const ASSETS = [
   './',
   './index.html',
   './manifest.webmanifest',
   './icons/icon-192.png',
   './icons/icon-512.png'
 ];
 
 self.addEventListener('install', (e) => {
   e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
   self.skipWaiting();
 });
 
 self.addEventListener('activate', (e) => {
   e.waitUntil(
     caches.keys().then(keys => Promise.all(keys.map(k => (k !== CACHE_NAME) && caches.delete(k))))
   );
   self.clients.claim();
 });
 
 self.addEventListener('fetch', (e) => {
   if (e.request.mode === 'navigate') {
     e.respondWith((async () => {
       try {
         const fresh = await fetch(e.request);
         const cache = await caches.open(CACHE_NAME);
-        cache.put('./', fresh.clone());
         cache.put('./index.html', fresh.clone());
         return fresh;
       } catch {
         const cache = await caches.open(CACHE_NAME);
-        return (await cache.match('./index.html')) || Response.error();
+        return await cache.match('./index.html');
       }
     })());
     return;
   }
   e.respondWith((async () => {
     const cache = await caches.open(CACHE_NAME);
     const cached = await cache.match(e.request);
     if (cached) return cached;
     try {
       const fresh = await fetch(e.request);
       cache.put(e.request, fresh.clone());
       return fresh;
     } catch {
       return cached || Response.error();
     }
   })());
 });
