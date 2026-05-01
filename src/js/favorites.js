// leggi i preferiti da localStorage
export function getFavorites() {
  return JSON.parse(localStorage.getItem('preferiti')) || []
}

// controlla prima di aggiungere per evitare duplicati se l'utente clicca più volte
export function addFavorite(news) {
  const preferiti = getFavorites();
  if (preferiti.some(n => n.id === news.id)) return;
  preferiti.push(news);
  localStorage.setItem('preferiti', JSON.stringify(preferiti));
}

// verifica se l'id è già presente tra i favoriti
export function isFavorite(id) {
  const preferiti = getFavorites()
  return preferiti.some(news => news.id === id)
}

// rimuovi un preferito tramite id
export function removeFavorite(id) {
  const preferiti = getFavorites();
  const aggiornati = preferiti.filter(news => news.id !== id);
  localStorage.setItem('preferiti', JSON.stringify(aggiornati));
}

// svuota tutti i preferiti
export function clearFavorites() {
  localStorage.removeItem('preferiti');
}