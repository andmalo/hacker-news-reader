import { addFavorite, removeFavorite, isFavorite, getFavorites } from './favorites.js';

const TOAST_DURATION_MS = 2500;


const els = {
  newsList:   document.querySelector('#news-list'),
  loadMore:   document.querySelector('#load-more'),
  counter:    document.querySelector('#counter'),
  error:      document.querySelector('#error-message'),
  favorites:  document.querySelector('#favorites-list'),
  toast:      document.querySelector('#toast'),
  noMore:     document.querySelector('#no-more-stories'),
  reset:      document.querySelector('#reset'),
  removeLast: document.querySelector('#remove-last'),
};

  function isSafeUrl(url) {
  try {
    const { protocol } = new URL(url);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

export function renderStoryCard(news) {
  const li = document.createElement('li');

  let titleEl;
  if (news.url && isSafeUrl(news.url)) {
    titleEl = document.createElement('a');
    titleEl.href = news.url;
    titleEl.target = '_blank';
    titleEl.rel = 'noopener noreferrer';
  } else {
    titleEl = document.createElement('span');
  }
  titleEl.textContent = news.title;

  const dateEl = document.createElement('span');
  dateEl.textContent = new Date(news.time * 1000).toLocaleDateString();

  const commentsEl = document.createElement('span');
  commentsEl.textContent = `${news.descendants || 0} commenti`;

  const starred = isFavorite(news.id);
  const starBtn = document.createElement('button');
  starBtn.className = 'star';
  starBtn.textContent = starred ? '⭐' : '☆';
  starBtn.setAttribute('aria-label', starred ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti');

  li.append(titleEl, dateEl, commentsEl, starBtn);

  starBtn.addEventListener('click', () => {
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

  els.newsList.appendChild(li);
}

export function showSkeletons(count) {
  for (let i = 0; i < count; i++) {
    const li = document.createElement('li');
    li.className = 'skeleton-card';
    li.innerHTML = `
      <div class="skeleton-line skeleton-title"></div>
      <div class="skeleton-line skeleton-meta"></div>
      <div class="skeleton-line skeleton-meta short"></div>
    `;
    els.newsList.appendChild(li);
  }
}

export function hideSkeletons() {
  document.querySelectorAll('.skeleton-card').forEach(el => el.remove());
}

export function setLoadingState(isLoading) {
  els.loadMore.disabled = isLoading;
  els.loadMore.textContent = isLoading ? 'Loading…' : 'Load more';
}

export function setupLoadMore(callback) {
  els.loadMore.addEventListener('click', callback);
}

export function showNoMoreStories() {
  els.loadMore.style.display = 'none';
  els.noMore.style.display = 'block';
}

export function setupReset(callback) {
  els.reset.addEventListener('click', callback);
}

export function setupRemoveLast(callback) {
  els.removeLast.addEventListener('click', callback);
}

export function removeLastStoryCards(count) {
  const items = Array.from(els.newsList.querySelectorAll('li'));
  items.slice(-count).forEach(li => li.remove());
}

let toastTimer = null;

export function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('visible');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('visible'), TOAST_DURATION_MS);
}

export function showError(message) {
  els.error.textContent = message;
  els.error.style.display = 'block';
}

export function hideError() {
  els.error.textContent = '';
  els.error.style.display = 'none';
}

export function updateLoadedCounter(loaded, total) {
  els.counter.textContent = `${loaded} di ${total} news caricate`;
}

export function renderFavoritesList() {
  const preferiti = getFavorites();

  els.favorites.innerHTML = '';

  if (preferiti.length === 0) {
    els.favorites.innerHTML = '<li class="empty-state">Nessun preferito ancora</li>';
    return;
  }

  preferiti.forEach(news => {
    const li = document.createElement('li');

    const linkEl = document.createElement('a');
    linkEl.href = news.url;
    linkEl.target = '_blank';
    linkEl.rel = 'noopener noreferrer';
    linkEl.textContent = news.title;

    const starBtn = document.createElement('button');
    starBtn.className = 'star';
    starBtn.textContent = '⭐';
    starBtn.setAttribute('aria-label', 'Rimuovi dai preferiti');

    li.append(linkEl, starBtn);

    starBtn.addEventListener('click', () => {
      removeFavorite(news.id);
      renderFavoritesList();
    });

    els.favorites.appendChild(li);
  });
}
