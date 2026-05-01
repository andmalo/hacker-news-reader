const INDEX_KEY = 'hn-index';
const CACHE_KEY = 'hn-news-cache';
const BATCH_SIZE = 10;

let allIds = [];
let currentIndex = 0;

// Ripristina l'indice dal localStorage per non perdere la posizione al reload
export function storeAllIds(ids) {
  allIds = ids;
  const saved = parseInt(localStorage.getItem(INDEX_KEY) || '0');
  currentIndex = Math.min(saved, ids.length);
}

// Salva l'indice aggiornato subito per non perderlo se l'utente chiude la tab
export function getNextPageIds() {
  const ids = allIds.slice(currentIndex, currentIndex + BATCH_SIZE);
  currentIndex += BATCH_SIZE;
  localStorage.setItem(INDEX_KEY, String(currentIndex));
  return ids;
}

export function hasMoreStories() {
  return currentIndex < allIds.length;
}

export function canGoBack() {
  return currentIndex > 0;
}

export function getLoadedCount() {
  return Math.min(currentIndex, allIds.length);
}

export function getTotalCount() {
  return allIds.length;
}

// Accoda i nuovi articoli alla cache esistente invece di sovrascriverla,
// così i batch precedenti sopravvivono al reload
export function appendToCache(items) {
  const existing = getStoriesFromCache();
  localStorage.setItem(CACHE_KEY, JSON.stringify([...existing, ...items]));
}

export function getStoriesFromCache() {
  return JSON.parse(localStorage.getItem(CACHE_KEY) || '[]');
}

// Tronca sia la cache che l'indice all'indietro di un batch,
// in modo che cache e DOM rimangano sempre sincronizzati
export function removePreviousPage() {
  currentIndex = Math.max(0, currentIndex - BATCH_SIZE);
  localStorage.setItem(INDEX_KEY, String(currentIndex));
  const trimmed = getStoriesFromCache().slice(0, currentIndex);
  localStorage.setItem(CACHE_KEY, JSON.stringify(trimmed));
}

export function clearStoriesCache() {
  localStorage.removeItem(INDEX_KEY);
  localStorage.removeItem(CACHE_KEY);
}

export { BATCH_SIZE };
