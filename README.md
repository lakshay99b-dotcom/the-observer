# Almanac — The Observer

Observatory-styled new tab page.

**Live:** https://lakshay99b-dotcom.github.io/the-observer/

## Structure

```
almanac/
├── index.html          # page structure
├── css/
│   └── styles.css      # all styles
├── js/
│   ├── config.js       # endpoints + defaults (no real API keys)
│   └── main.js         # app logic
└── README.md
```

## Features

- NASA Astronomy Picture of the Day (image + video support)
- Live ISS position + telemetry
- People currently in orbit
- Next rocket launch countdown
- Solar system chart with cycling planet data
- Local field notes
- Customizable bookmarks + name
- Animated starfield

Pure HTML / CSS / vanilla JS. No frameworks, no build step.

## NASA API key (optional)

Works with NASA’s public `DEMO_KEY`. For higher limits:

1. Get a free key at https://api.nasa.gov/
2. Open ⚙️ Settings on the page
3. Paste your key → Save

Key stays in your browser’s localStorage only. Nothing is hardcoded in the source.

## Run locally

Just open `index.html` in a browser, or serve the folder with any static server.

## Deploy (GitHub Pages)

1. Push this folder’s contents to the root of your repo (or keep the folder structure)
2. Settings → Pages → Source: Deploy from a branch → `main` / `(root)`
3. Site will be at `https://<username>.github.io/<repo>/`
