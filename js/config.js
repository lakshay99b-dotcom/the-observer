/* ============================================================
   ALMANAC — config
   API endpoints + defaults. No real secrets live here.
   ============================================================ */

const CONFIG = {
  // localStorage keys
  SETTINGS_KEY: "almanac:settings:v1",
  NOTES_KEY: "almanac:notes:v1",

  // defaults (user can override in Settings UI)
  defaultSettings: {
    name: "Observer",
    nasaKey: "",          // leave empty — user pastes their own key in Settings
    bookmarks: [
      { name: "GitHub", url: "https://github.com" },
      { name: "Stardance", url: "https://stardance.dev" },
      { name: "YouTube", url: "https://youtube.com" },
    ],
  },

  // public endpoints (no keys required except NASA, which is optional)
  endpoints: {
    apod: "https://api.nasa.gov/planetary/apod",
    iss: "https://api.wheretheiss.at/v1/satellites/25544",
    people: "https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json",
    launches: "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=1&mode=list",
  },

  // fallback when no NASA key is set
  nasaDemoKey: "DEMO_KEY",

  // refresh intervals (ms)
  issRefresh: 5000,
  peopleRefresh: 60000,
  planetCycle: 4500,
};
