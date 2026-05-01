import axios from "axios";

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

// Lancia l'errore invece di swallowarlo: il chiamante deve sapere se l'API è irraggiungibile
// e decidere come informare l'utente
export async function fetchNewStories() {
  const risposta = await axios.get(`${BASE_URL}/newstories.json`);
  const ids = risposta.data;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error('La risposta dell\'API non contiene una lista di id valida.');
  }

  return ids;
}

// Restituisce null se l'articolo è eliminato o incompleto, così il chiamante può filtrarlo
// senza bloccare il caricamento degli altri articoli del batch
export async function fetchStoryById(id) {
  const risposta = await axios.get(`${BASE_URL}/item/${id}.json`);
  const item = risposta.data;

  if (!item || !item.id || !item.title) {
    return null;
  }

  return item;
}
