# Hacker News Reader

Lettore di notizie da [Hacker News](https://news.ycombinator.com/) costruito con JavaScript vanilla e Vite. Permette di sfogliare le ultime notizie, salvarle tra i preferiti e ritrovare la posizione di lettura anche dopo un reload.

---

## Funzionalità

- **Caricamento a batch** — le notizie vengono caricate 10 alla volta tramite l'[API ufficiale di HN](https://github.com/HackerNews/API)
- **Persistenza** — la lista caricata e l'indice di lettura vengono salvati in `localStorage`: al reload la pagina riparte da dove si era rimasti
- **Preferiti** — ogni notizia può essere aggiunta ai preferiti con la stella; i preferiti sono persistenti e visibili in una sezione dedicata
- **Skeleton loader** — al posto dello spinner classico, appaiono card placeholder animate durante il fetch
- **Toast di conferma** — feedback visivo quando si aggiunge o rimuove un preferito
- **Gestione errori** — gli errori API vengono mostrati direttamente nell'interfaccia
- **Reset** — un pulsante svuota cache e preferiti e ricarica la pagina da zero
- **Accessibilità** — attributi `aria-label`, `aria-live` e markup semantico (`header`, `main`, `section`)
- **SEO** — meta description, Open Graph e Twitter Card configurati

---

## Tech stack

| Strumento | Uso |
|-----------|-----|
| [Vite](https://vitejs.dev/) | Dev server e build |
| [Axios](https://axios-http.com/) | Chiamate HTTP all'API di HN |
| [Vitest](https://vitest.dev/) | Test unitari |
| [jsdom](https://github.com/jsdom/jsdom) | Ambiente DOM per i test |

---

## Struttura del progetto

```
hacker-news-reader/
├── src/
│   ├── css/
│   │   └── style.css          # Stili con variabili CSS, mobile-first
│   └── js/
│       ├── api.js             # Fetch verso l'API di Hacker News
│       ├── newsRepository.js  # Gestione ids, indice e cache localStorage
│       ├── favorites.js       # CRUD preferiti su localStorage
│       ├── ui.js              # Manipolazione DOM e componenti UI
│       ├── newsRepository.test.js
│       └── favorites.test.js
├── index.html
├── vite.config.js
└── package.json
```

---

## Avvio

```bash
# Installa le dipendenze
npm install

# Avvia il dev server
npm run dev

# Build di produzione
npm run build

# Esegui i test
npm test

# Esegui i test una volta sola
npm test -- --run
```

---

## API

Le notizie vengono recuperate dall'API pubblica di Hacker News:

- `GET /v0/newstories.json` — lista degli id delle ultime notizie
- `GET /v0/item/{id}.json` — dettagli di un singolo articolo

Non richiede autenticazione né API key.


   <!-- CI pipeline attiva -->

   Sito pubblico: https://gleaming-marshmallow-02fceb.netlify.app
