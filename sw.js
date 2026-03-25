const CACHE_NAME = 'barber-app-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
  // Qui puoi aggiungere i nomi delle icone se vuoi: './icon-192.png', './icon-512.png'
];

// 1. Installazione: Salviamo i file essenziali nella memoria del telefono
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache aperta');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Forza l'attivazione immediata
});

// 2. Attivazione: Pulizia delle vecchie cache se aggiorniamo l'app
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Vecchia cache eliminata:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Intercettazione Richieste: Network First (Prima la rete, poi la cache)
self.addEventListener('fetch', (event) => {
  // Ignoriamo le chiamate a Supabase per essere sicuri di avere dati sempre freschi in tempo reale
  if (event.request.url.includes('supabase.co')) {
      return;
  }

  // Per il resto (HTML, CSS), prova a scaricarlo da internet. Se sei offline, usa la memoria (cache)
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
