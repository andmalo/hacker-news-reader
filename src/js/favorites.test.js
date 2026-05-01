import { describe, it, expect, beforeEach } from 'vitest';
import { addFavorite, removeFavorite, isFavorite, getFavorites, clearFavorites } from './favorites.js';

const MOCK_NEWS = { id: 42, title: 'Test Article', url: 'https://example.com' };
const MOCK_NEWS_2 = { id: 99, title: 'Another Article', url: 'https://example2.com' };

beforeEach(() => {
  localStorage.clear();
});

describe('getFavorites', () => {
  it('restituisce un array vuoto se non ci sono preferiti', () => {
    expect(getFavorites()).toEqual([]);
  });
});

describe('addFavorite', () => {
  it('aggiunge un articolo ai preferiti', () => {
    addFavorite(MOCK_NEWS);
    expect(getFavorites()).toHaveLength(1);
    expect(getFavorites()[0].id).toBe(42);
  });

  it('non aggiunge duplicati se lo stesso articolo viene aggiunto due volte', () => {
    addFavorite(MOCK_NEWS);
    addFavorite(MOCK_NEWS);
    expect(getFavorites()).toHaveLength(1);
  });

  it('aggiunge più articoli diversi', () => {
    addFavorite(MOCK_NEWS);
    addFavorite(MOCK_NEWS_2);
    expect(getFavorites()).toHaveLength(2);
  });
});

describe('removeFavorite', () => {
  it('rimuove un articolo tramite id', () => {
    addFavorite(MOCK_NEWS);
    removeFavorite(42);
    expect(getFavorites()).toHaveLength(0);
  });

  it('non rimuove altri articoli', () => {
    addFavorite(MOCK_NEWS);
    addFavorite(MOCK_NEWS_2);
    removeFavorite(42);
    expect(getFavorites()).toHaveLength(1);
    expect(getFavorites()[0].id).toBe(99);
  });

  it('non lancia errori se si rimuove un id che non esiste', () => {
    expect(() => removeFavorite(999)).not.toThrow();
  });
});

describe('isFavorite', () => {
  it('restituisce false se l\'articolo non è tra i preferiti', () => {
    expect(isFavorite(42)).toBe(false);
  });

  it('restituisce true dopo aver aggiunto l\'articolo', () => {
    addFavorite(MOCK_NEWS);
    expect(isFavorite(42)).toBe(true);
  });

  it('restituisce false dopo aver rimosso l\'articolo', () => {
    addFavorite(MOCK_NEWS);
    removeFavorite(42);
    expect(isFavorite(42)).toBe(false);
  });
});

describe('clearFavorites', () => {
  it('svuota tutti i preferiti', () => {
    addFavorite(MOCK_NEWS);
    addFavorite(MOCK_NEWS_2);
    clearFavorites();
    expect(getFavorites()).toEqual([]);
  });
});
