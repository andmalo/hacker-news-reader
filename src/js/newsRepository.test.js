import { describe, it, expect, beforeEach } from 'vitest';
import {
  storeAllIds, getNextPageIds, hasMoreStories, canGoBack,
  getLoadedCount, getTotalCount,
  appendToCache, getStoriesFromCache,
  removePreviousPage, clearStoriesCache,
  BATCH_SIZE,
} from './newsRepository.js';

const MOCK_IDS = Array.from({ length: 25 }, (_, i) => i + 1);

beforeEach(() => {
  localStorage.clear();
  storeAllIds([]);
});

describe('storeAllIds', () => {
  it('imposta la lista degli id', () => {
    storeAllIds(MOCK_IDS);
    expect(getTotalCount()).toBe(25);
  });

  it('ripristina currentIndex dal localStorage se presente', () => {
    localStorage.setItem('hn-index', '10');
    storeAllIds(MOCK_IDS);
    expect(getLoadedCount()).toBe(10);
  });

  it('cappa currentIndex alla lunghezza della lista se il valore salvato è maggiore', () => {
    localStorage.setItem('hn-index', '999');
    storeAllIds(MOCK_IDS);
    expect(getLoadedCount()).toBe(25);
  });
});

describe('getNextPageIds', () => {
  it('restituisce BATCH_SIZE id alla volta', () => {
    storeAllIds(MOCK_IDS);
    const batch = getNextPageIds();
    expect(batch).toHaveLength(BATCH_SIZE);
  });

  it('restituisce i primi 10 id al primo chiamata', () => {
    storeAllIds(MOCK_IDS);
    const batch = getNextPageIds();
    expect(batch).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('restituisce il batch successivo alla seconda chiamata', () => {
    storeAllIds(MOCK_IDS);
    getNextPageIds();
    const batch = getNextPageIds();
    expect(batch).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  });

  it('salva il nuovo indice nel localStorage', () => {
    storeAllIds(MOCK_IDS);
    getNextPageIds();
    expect(localStorage.getItem('hn-index')).toBe('10');
  });

  it("restituisce meno di BATCH_SIZE se non ci sono abbastanza id", () => {
    storeAllIds([1, 2, 3]);
    const batch = getNextPageIds();
    expect(batch).toHaveLength(3);
  });
});

describe('hasMoreStories', () => {
  it('restituisce true se ci sono ancora id da caricare', () => {
    storeAllIds(MOCK_IDS);
    getNextPageIds();
    expect(hasMoreStories()).toBe(true);
  });

  it('restituisce false quando tutti gli id sono stati caricati', () => {
    storeAllIds([1, 2, 3]);
    getNextPageIds();
    expect(hasMoreStories()).toBe(false);
  });
});

describe('canGoBack', () => {
  it('restituisce false se non è stato caricato nulla', () => {
    storeAllIds(MOCK_IDS);
    expect(canGoBack()).toBe(false);
  });

  it('restituisce true dopo aver caricato almeno un batch', () => {
    storeAllIds(MOCK_IDS);
    getNextPageIds();
    expect(canGoBack()).toBe(true);
  });
});

describe('appendToCache / getStoriesFromCache', () => {
  it('salva e recupera gli articoli dalla cache', () => {
    const items = [{ id: 1, title: 'Test' }];
    appendToCache(items);
    expect(getStoriesFromCache()).toEqual(items);
  });

  it('accoda senza sovrascrivere i batch precedenti', () => {
    appendToCache([{ id: 1, title: 'A' }]);
    appendToCache([{ id: 2, title: 'B' }]);
    expect(getStoriesFromCache()).toHaveLength(2);
  });
});

describe('removePreviousPage', () => {
  it('decrementa currentIndex di BATCH_SIZE', () => {
    storeAllIds(MOCK_IDS);
    getNextPageIds();
    getNextPageIds();
    removePreviousPage();
    expect(getLoadedCount()).toBe(BATCH_SIZE);
  });

  it('non scende sotto zero', () => {
    storeAllIds(MOCK_IDS);
    removePreviousPage();
    expect(getLoadedCount()).toBe(0);
  });

  it('tronca la cache al nuovo indice per mantenerla sincronizzata col DOM', () => {
    storeAllIds(MOCK_IDS);
    getNextPageIds();
    appendToCache(Array.from({ length: 10 }, (_, i) => ({ id: i + 1, title: `Story ${i + 1}` })));
    getNextPageIds();
    appendToCache(Array.from({ length: 10 }, (_, i) => ({ id: i + 11, title: `Story ${i + 11}` })));
    removePreviousPage();
    expect(getStoriesFromCache()).toHaveLength(BATCH_SIZE);
  });
});

describe('clearStoriesCache', () => {
  it('rimuove indice e cache dal localStorage', () => {
    storeAllIds(MOCK_IDS);
    getNextPageIds();
    appendToCache([{ id: 1, title: 'Test' }]);
    clearStoriesCache();
    expect(localStorage.getItem('hn-index')).toBeNull();
    expect(localStorage.getItem('hn-news-cache')).toBeNull();
  });
});
