# THE OBSERVER

**A space-inspired new-tab dashboard I built from scratch.**

A calm, dark interface that greets me with live astronomy data, useful tools, and a quiet starfield every time I open a new tab.

## 🌐 Live Demo

**[https://observer.edgeone.dev/](https://observer.edgeone.dev/)**

---

## About the project

The Observer is my personal new-tab replacement.  
I wanted something that felt like looking out a window into space instead of the usual cluttered start pages.

It shows:

- NASA’s Astronomy Picture of the Day
- Live ISS position
- Who is currently in orbit
- The next upcoming launch with a live countdown
- A simple interactive solar-system almanac with physical constants
- Quick web search
- Custom bookmarks
- Local field notes
- A soft animated starfield background

Everything is designed to stay quiet, readable, and useful without feeling busy.

## Why I built it

I open a lot of new tabs. Most new-tab pages either feel empty or try too hard to be “productive.”  

I wanted something that:

- felt calm and space-themed
- gave me real, live information about the sky and space
- still let me search the web and jump to sites I use every day
- worked offline for the parts that don’t need the network
- looked good on both desktop and mobile

So I built The Observer.

## Main features

| Feature | What it does |
|---------|--------------|
| **NASA Picture of the Day** | Fetches the current APOD with title, date, and a link to the full story |
| **Live ISS Position** | Shows the International Space Station’s current location on a simple map (powered by wheretheiss.at) with latitude, longitude, altitude and velocity |
| **People Currently in Orbit** | Lists every human currently in space and which craft they are on |
| **Next Launch** | Displays the next scheduled launch with a live countdown (data from Launch Library) |
| **Tonight’s Almanac** | Interactive planet diagram. Click or hover a planet to see mean radius, surface gravity, mass, and number of known moons |
| **Web Search** | Clean search bar that goes straight to the web |
| **Custom Bookmarks** | Quick-access buttons for the sites I use most (easily editable) |
| **Field Notes** | Simple local notes that stay on the device |
| **Animated Starfield** | Soft, slow-moving background stars |
| **Theme Toggle** | Light/dark control |
| **Responsive Layout** | Works on desktop, tablet, and phone |

## How the interface works

When the page loads:

1. The greeting changes with the time of day (“Good morning / afternoon / evening, Observer”).
2. A large, readable clock sits in the center.
3. Live data cards fill in as the APIs respond.
4. The starfield quietly animates behind everything.
5. Bookmarks and the search bar stay ready at the top.

All the space data updates automatically. Notes and bookmarks are stored locally in the browser so they stay private and work offline.

## Design philosophy

I wanted the page to feel like a quiet observation deck, not a dashboard full of widgets.

- Dark navy background with soft gold and cream text
- Generous spacing
- Clean typography (Cormorant Garamond for headings, Inter and IBM Plex Mono for body and data)
- Cards that only appear when they have something useful to show
- No flashing numbers or aggressive animations

The goal was simple: open a new tab and feel a little closer to space.

## Technologies used

- Plain HTML, CSS, and JavaScript (no heavy framework)
- Google Fonts (Cormorant Garamond, Inter, IBM Plex Mono)
- CSS animations for the starfield
- Local Storage for notes and bookmarks
- Fetch API for live data

I deliberately kept the stack light so the page loads quickly and stays easy to maintain.

## APIs & data sources

| Data | Source |
|------|--------|
| Astronomy Picture of the Day | NASA APOD API |
| ISS position | [wheretheiss.at](https://wheretheiss.at) |
| People in space | Public people-in-space JSON |
| Upcoming launches | Launch Library 2 (thespacedevs.com) |
| Planet constants | Static data I compiled |

Some endpoints use public/demo keys, so rate limits can occasionally appear. The interface handles failures gracefully and shows a quiet message when data is temporarily unavailable.

## Project structure

```
the-observer/
├── index.html          # page structure
├── css/
│   └── styles.css      # all styles
├── js/
│   ├── config.js       # endpoints + defaults (no real API keys)
│   └── main.js         # app logic
└── README.md
```

## Running the project locally

1. Clone the repository  
2. Open `index.html` in a browser  
   or serve the folder with any static server:

```bash
npx serve .
# or
python -m http.server 8000
```

That’s it. No build step required.

## Deployment

The live version is hosted on **Tencent EdgeOne**:

**https://observer.edgeone.dev/**

Any static host (GitHub Pages, Netlify, Cloudflare Pages, etc.) will also work.

### Optional: NASA API key

Works with NASA’s public `DEMO_KEY`. For higher limits:

1. Get a free key at https://api.nasa.gov/
2. Open ⚙️ Settings on the page
3. Paste your key → Save

The key stays in your browser’s localStorage only. Nothing is hardcoded in the source.

## What I learned

- How to design a calm interface that still feels alive
- Working with multiple public space APIs and handling their quirks
- Keeping a project intentionally simple instead of reaching for a framework
- Making a page feel good on both a large monitor and a phone
- The value of local-first storage for personal tools

## Challenges I faced

- NASA’s DEMO_KEY rate limit — I added clear fallback messaging so the page never looks broken
- Keeping the ISS map simple and readable without pulling in a heavy mapping library
- Making the planet almanac interactive without turning it into a science textbook
- Balancing “space aesthetic” with actual usability

## What I’m proud of

- The quiet starfield that never distracts
- How clean the live countdown and ISS card feel
- That the whole thing stays fast and works without a backend
- Building something I actually enjoy opening every day

## Future plans

- Better offline caching for APOD images
- Optional custom NASA API key support (already available via Settings)
- More detailed ISS pass predictions for the user’s location
- A small set of additional astronomy widgets (moon phase, visible planets tonight)
- Light polish on the mobile experience

## About me

I’m Lakshay — a student and developer who likes building small, thoughtful tools.  
The Observer started as a personal experiment and turned into something I use every day.

## License

MIT License — feel free to use, modify, and learn from it.

---

Thanks for checking out The Observer.  
If you try it as your new tab, I hope it makes the universe feel a little closer.
