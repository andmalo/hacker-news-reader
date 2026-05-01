import './css/style.css';
import { fetchNewStories, fetchStoryById } from './js/api.js';
import {
  storeAllIds, getNextPageIds, hasMoreStories, canGoBack,
  getLoadedCount, getTotalCount,
  appendToCache, getStoriesFromCache,
  removePreviousPage, clearStoriesCache,
  BATCH_SIZE,
} from './js/newsRepository.js';
import { clearFavorites } from './js/favorites.js';
import {
  renderStoryCard, setLoadingState, setupLoadMore, showNoMoreStories,
  setupReset, setupRemoveLast, removeLastStoryCards,
  showSkeletons, hideSkeletons,
  showError, hideError,
  updateLoadedCounter,
  renderFavoritesList,
} from './js/ui.js';

// Flag per bloccare click multipli mentre una fetch è già in corso
let isLoading = false;

async function loadNextPage() {
  if (isLoading) return;

  isLoading = true;
  setLoadingState(true);
  showSkeletons(BATCH_SIZE);
  hideError();

  try {
    const ids = getNextPageIds();
    const results = await Promise.all(ids.map(id => fetchStoryById(id)));

    // Filtra gli articoli nulli (eliminati o con dati incompleti dall'API)
    const validStories = results.filter(item => item !== null);

    hideSkeletons();
    validStories.forEach(item => renderStoryCard(item));
    appendToCache(validStories);
    updateLoadedCounter(getLoadedCount(), getTotalCount());

    if (!hasMoreStories()) showNoMoreStories();
  } catch (errore) {
    // L'errore viene loggato per il debug e mostrato all'utente per trasparenza
    console.error('Errore nel caricamento delle news:', errore);
    hideSkeletons();
    showError('Impossibile caricare le notizie. Riprova tra qualche secondo.');
  } finally {
    isLoading = false;
    setLoadingState(false);
  }
}

async function init() {
  try {
    const ids = await fetchNewStories();
    storeAllIds(ids);
  } catch (errore) {
    console.error('Errore nel recupero degli id:', errore);
    showError('Impossibile connettersi a Hacker News. Controlla la connessione.');
    return;
  }

  setupLoadMore(loadNextPage);

  setupRemoveLast(() => {
    if (!canGoBack()) return;
    removeLastStoryCards(BATCH_SIZE);
    removePreviousPage();
    updateLoadedCounter(getLoadedCount(), getTotalCount());
  });

  setupReset(() => {
    clearStoriesCache();
    clearFavorites();
    location.reload();
  });

  renderFavoritesList();

  const cached = getStoriesFromCache();
  if (cached.length > 0) {
    // Ripristina le news già viste dalla cache per evitare chiamate API ridondanti
    cached.forEach(item => renderStoryCard(item));
    updateLoadedCounter(getLoadedCount(), getTotalCount());
    if (!hasMoreStories()) showNoMoreStories();
  } else {
    await loadNextPage();
  }
}

init();
