# lofi-site

Lofi girl video wallpaper site. Plays looping background videos that rotate randomly every 2 hours, with separate day and night playlists.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

## How it works

A fullscreen looping `<video>` element displays one video at a time. Every 2 hours it switches to a random different video from the current playlist. At 5:00 and 18:00 the playlist switches between day and night modes.

### Video auto-discovery

A Vite plugin (`vite.config.ts`) scans `public/videos/day/` and `public/videos/night/` at startup and exposes the file lists via a virtual module `virtual:video-list`. Adding or removing `.mp4` files takes effect after restarting the dev server.

## Adding videos

Drop `.mp4` files into the appropriate folder:

```
public/videos/
├── day/       ← plays 05:00–17:59
└── night/     ← plays 18:00–04:59
```

Restart `npm run dev` to pick up changes.

## Config

All constants live in `src/config.ts`:

| Constant | Default | Description |
|---|---|---|
| `DAY_START_HOUR` | `5` | Hour when day playlist activates |
| `NIGHT_START_HOUR` | `18` | Hour when night playlist activates |
| `ROTATION_INTERVAL_MS` | `7200000` (2h) | How often the video rotates |
| `MODE_CHECK_INTERVAL_MS` | `60000` (1min) | How often it checks for day/night switch |

## Project structure

```
src/
├── App.tsx          # video player + rotation logic
├── config.ts        # all tuneable constants
├── video-list.d.ts  # types for the virtual module
├── main.tsx         # React entry point
└── index.css        # minimal reset (black bg, centered)
vite.config.ts       # Vite config + video list plugin
public/videos/       # video files (not committed)
```

## Build & deploy

```bash
npm run build    # outputs to dist/
npm run preview  # preview production build locally
```

Deploy the `dist/` folder to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages).

Note: videos in `public/` are copied as-is to `dist/` — keep file sizes reasonable for your hosting.

## Stack

React 19 + TypeScript + Vite
