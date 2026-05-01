import { addFavorite, removeFavorite, isFavorite, getFavorites } from './favorites.js';

const NEWS_LIST_SELECTOR = '#news-list';
const LOAD_MORE_SELECTOR = '#load-more';
const COUNTER_SELECTOR   = '#counter';
const ERROR_SELECTOR     = '#error-message';
const FAVORITES_SELECTOR = '#favorites-list';
const TOAST_SELECTOR     = '#toast';
const NO_MORE_SELECTOR   = '#no-more-stories';

const TOAST_DURATION_MS = 2500;

export function renderStoryCard(news) {
  const li = document.createElement('li');

  // Ask HN e Job HN non hanno URL
  const linkHTML = news.url
    ? `<a href="${news.url}" target="_blank" rel="noopener noreferrer">${news.title}</a>`
    : `<span>${news.title}</span>`;

  const date = new Date(news.time * 1000).toLocaleDateString();
  const comments = news.descendants || 0;
  const starred = isFavorite(news.id);

  li.innerHTML = `
    ${linkHTML}
    <span>${date}</span>
    <span>${comments} commenti</span>
    <button class="star" aria-label="${starred ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}">
      ${starred ? '⭐' : '☆'}
    </button>
  `;

  const starBtn = li.querySelector('.star');

  starBtn.addEventListener('click', () => {
    // resetta la classe prima di riaggiungerla, altrimenti l'animazione non riparte
    starBtn.classList.remove('pop');
    void starBtn.offsetWidth;
    starBtn.classList.add('pop');

    if (isFavorite(news.id)) {
      removeFavorite(news.id);
      starBtn.textContent = '☆';
      starBtn.setAttribute('aria-label', 'Aggiungi ai preferiti');
      showToast('Rimosso dai preferiti');
    } else {
      addFavorite(news);
      starBtn.textContent = '⭐';
      starBtn.setAttribute('aria-label', 'Rimuovi dai preferiti');
      showToast('Aggiunto ai preferiti');
    }
    renderFavoritesList();
  });

  starBtn.addEventListener('animationend', () => starBtn.classList.remove('pop'));

  document.querySelector(NEWS_LIST_SELECTOR).appendChild(li);
}

export function showSkeletons(count) {
  const lista = document.querySelector(NEWS_LIST_SELECTOR);
  for (let i = 0; i < count; i++) {
    const li = document.createElement('li');
    li.className = 'skeleton-card';
    li.innerHTML = `
      <div class="skeleton-line skeleton-title"></div>
      <div class="skeleton-line skeleton-meta"></div>
      <div class="skeleton-line skeleton-meta short"></div>
    `;
    lista.appendChild(li);
  }
}

export function hideSkeletons() {
  document.querySelectorAll('.skeleton-card').forEach(el => el.remove());
}

export function setLoadingState(isLoading) {
  const btn = document.querySelector(LOAD_MORE_SELECTOR);
  btn.disabled = isLoading;
  btn.textContent = isLoading ? 'Loading…' : 'Load more';
}

export function setupLoadMore(callback) {
  document.querySelector(LOAD_MORE_SELECTOR).addEventListener('click', callback);
}

export function showNoMoreStories() {
  document.querySelector(LOAD_MORE_SELECTOR).style.display = 'none';
  document.querySelector(NO_MORE_SELECTOR).style.display = 'block';
}

export function setupReset(callback) {
  document.querySelector('#reset').addEventListener('click', callback);
}

export function setupRemoveLast(callback) {
  document.querySelector('#remove-last').addEventListener('click', callback);
}

// va usata insieme a removePreviousPage() per tenere DOM e cache allineati
export function removeLastStoryCards(count) {
  const lista = document.querySelector(NEWS_LIST_SELECTOR);
  const items = Array.from(lista.querySelectorAll('li'));
  items.slice(-count).forEach(li => li.remove());
}

let toastTimer = null;

export function showToast(message) {
  const toast = document.querySelector(TOAST_SELECTOR);
  toast.textContent = message;
  toast.classList.add('visible');

  // resetta il timer se l'utente clicca di nuovo prima che scompaia
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), TOAST_DURATION_MS);
}

export function showError(message) {
  const el = document.querySelector(ERROR_SELECTOR);
  el.textContent = message;
  el.style.display = 'block';
}

export function hideError() {
  const el = document.querySelector(ERROR_SELECTOR);
  el.textContent = '';
  el.style.display = 'none';
}

export function updateLoadedCounter(loaded, total) {
  document.querySelector(COUNTER_SELECTOR).textContent =
    `${loaded} di ${total} news caricate`;
}

export function renderFavoritesList() {
  const preferiti = getFavorites();
  const lista = document.querySelector(FAVORITES_SELECTOR);

  lista.innerHTML = '';

  if (preferiti.length === 0) {
    lista.innerHTML = '<li class="empty-state">Nessun preferito ancora</li>';
    return;
  }

  preferiti.forEach(news => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="${news.url}" target="_blank" rel="noopener noreferrer">${news.title}</a>
      <button class="star" aria-label="Rimuovi dai preferiti">⭐</button>
    `;
    li.querySelector('.star').addEventListener('click', () => {
      removeFavorite(news.id);
      renderFavoritesList();
    });
    lista.appendChild(li);
  });
}
