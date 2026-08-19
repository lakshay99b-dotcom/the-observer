# Almanac — The Observer

An observatory-styled new tab page.

**Live demo:** https://lakshay99b-dotcom.github.io/the-observer/

## Features

- NASA Astronomy Picture of the Day (APOD)
- Live ISS position + telemetry
- People currently in orbit
- Next rocket launch countdown
- Solar system “Tonight’s Almanac” chart
- Local field notes (saved in your browser)
- Customizable bookmarks + display name
- Animated starfield

Pure HTML / CSS / vanilla JS. No frameworks, no build step.

## NASA API key (optional)

The page works with NASA’s public `DEMO_KEY`. For higher rate limits:

1. Get a free key at [api.nasa.gov](https://api.nasa.gov/)
2. Open the ⚙️ Settings button on the page
3. Paste your key → Save

Your key is stored only in your browser’s `localStorage` and never leaves your machine.

## Deploy to GitHub Pages

This repo is already set up for the simple static method:

1. Go to **Settings → Pages**
2. Under **Source** choose **Deploy from a branch**
3. Branch: `main` / folder: `/ (root)`
4. Save

Your site will be live at:  
`https://lakshay99b-dotcom.github.io/the-observer/`

Every push to `main` updates the site automatically.

## Local use

Just open `index.html` in a browser, or point a “New Tab” extension at the GitHub Pages URL.
