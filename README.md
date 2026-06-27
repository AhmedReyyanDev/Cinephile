# Cinephile

A clean, dark, cinematic **movie discovery app** for film lovers. Browse what's
trending, track new and upcoming releases, see **where to watch** each movie
(official subscriptions *and* free legal options), read community reviews, and
write your own.

Built with **Expo (React Native) + TypeScript + Expo Router**. Movie data comes
from free, public sources — primarily **TMDB**, enriched with **OMDB** ratings.

---

## Features

- **Discover** — trending, now playing, popular and top‑rated movies in a clean,
  poster‑first layout with a featured hero.
- **Releases** — a dedicated feed of **new & upcoming** movies with clear
  "Out today / In N days" labels, so you always know when something drops.
- **Where to watch** — for every movie, see the legal options grouped by:
  - **Free** and **Free with ads** (e.g. Tubi, Pluto TV, YouTube — legal, no cost)
  - **Stream (subscription)** — Netflix, Prime Video, Disney+, etc.
  - **Rent** / **Buy**

  Powered by JustWatch data via TMDB, localized by region.
- **Reviews** — read community reviews from TMDB and write your own with a
  1–10 star rating. Your reviews are saved on‑device.
- **My List** — a personal watchlist plus your review diary.
- **Search** — fast, debounced movie search.

> **A note on "free" sources:** Cinephile surfaces **legal** free options
> (ad‑supported and free‑tier services that the data provider reports) alongside
> official paid options. It intentionally does **not** link to pirated/illegal
> streaming apps.

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Add your free API keys

Cinephile needs a **TMDB** API key (free). OMDB is optional but adds IMDb /
Rotten Tomatoes / Metacritic scores.

**Option A — environment variables (recommended)**

```bash
cp .env.example .env
# then edit .env and paste your keys
```

```
EXPO_PUBLIC_TMDB_API_KEY=your_tmdb_key
EXPO_PUBLIC_OMDB_API_KEY=your_omdb_key   # optional
```

**Option B — app.json**

Edit `app.json` → `expo.extra`:

```json
"extra": {
  "tmdbApiKey": "your_tmdb_key",
  "omdbApiKey": "your_omdb_key"
}
```

Where to get keys (both free):

- TMDB: https://www.themoviedb.org/settings/api
- OMDB: https://www.omdbapi.com/apikey.aspx

If no TMDB key is set, the app shows in‑app setup instructions instead of data.

### 3. Run

```bash
npm start          # Expo dev server (scan QR with Expo Go)
npm run android    # Android emulator/device
npm run ios        # iOS simulator (macOS)
npm run web        # web preview
```

---

## Project structure

```
app/                       # Expo Router routes
  _layout.tsx              # root stack
  (tabs)/                  # bottom tabs
    index.tsx              # Discover
    releases.tsx           # New & upcoming + where to watch
    search.tsx             # Search
    library.tsx            # Watchlist + my reviews
  movie/[id].tsx           # Movie details
src/
  api/                     # TMDB + OMDB clients, config, types
  components/              # Reusable UI (cards, rows, reviews, providers…)
  hooks/                   # useAsync data hook
  storage/                 # On-device watchlist + reviews (AsyncStorage)
  theme/                   # Design tokens (colors, spacing, type)
  utils/                   # Formatting helpers
```

## Useful scripts

```bash
npm run typecheck   # tsc --noEmit
npm start           # start the dev server
```

## Data attribution

This product uses the **TMDB** API but is not endorsed or certified by TMDB.
Streaming availability is provided by **JustWatch** (via TMDB). Additional
ratings via **OMDB**.

## Roadmap ideas

- Push notifications when a watchlisted movie releases or hits a service
- Cloud sync / accounts for reviews shared between cinephiles
- Trailers, similar movies, and people/cast pages
