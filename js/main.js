let settings = loadSettings();

function loadSettings() {
  try {
    const raw = localStorage.getItem(CONFIG.SETTINGS_KEY);
    if (!raw) return { ...CONFIG.defaultSettings };
    const parsed = JSON.parse(raw);
    return { ...CONFIG.defaultSettings, ...parsed };
  } catch (e) {
    console.warn("Could not read settings, using defaults", e);
    return { ...CONFIG.defaultSettings };
  }
}

function saveSettings(s) {
  try {
    localStorage.setItem(CONFIG.SETTINGS_KEY, JSON.stringify(s));
  } catch (e) {
    console.warn("Could not save settings", e);
  }
}

function tickClock() {
  const now = new Date();
  const clock = document.getElementById("clock");
  const date = document.getElementById("date");
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  clock.textContent = `${h}:${m}:${s}`;
  date.textContent = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const hour = now.getHours();
  const greetingWord =
    hour < 5 ? "Good night" :
    hour < 12 ? "Good morning" :
    hour < 18 ? "Good afternoon" : "Good evening";
  document.getElementById("greeting").firstChild.textContent = greetingWord + ", ";
}

function applyName() {
  document.getElementById("user-name").textContent = settings.name || "Observer";
}
document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = document.getElementById("search-input").value.trim();
  if (!q) return;
  window.location.href = "https://www.google.com/search?q=" + encodeURIComponent(q);
});
function renderQuickLinks() {
  const nav = document.getElementById("quicklinks");
  nav.innerHTML = "";
  settings.bookmarks.forEach((bm) => {
    if (!bm.name || !bm.url) return;
    const a = document.createElement("a");
    a.className = "quicklink";
    a.href = bm.url;
    a.innerHTML = `<span class="dot"></span>${escapeHtml(bm.name)}`;
    nav.appendChild(a);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
function initNotes() {
  const area = document.getElementById("notes-area");
  const status = document.getElementById("notes-status");
  area.value = localStorage.getItem(CONFIG.NOTES_KEY) || "";
  let debounceTimer = null;
  area.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      localStorage.setItem(CONFIG.NOTES_KEY, area.value);
      status.textContent = "Saved " + new Date().toLocaleTimeString();
      status.classList.add("show");
      setTimeout(() => status.classList.remove("show"), 1500);
    }, 500);
  });
}
function openModal(id) {
  document.getElementById(id).classList.add("open");
}
function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}

document.getElementById("settings-btn").addEventListener("click", () => {
  document.getElementById("settings-name").value = settings.name;
  document.getElementById("settings-nasa-key").value = settings.nasaKey;
  renderBookmarkEditor();
  openModal("settings-modal-backdrop");
});
document.getElementById("settings-modal-close").addEventListener("click", () => closeModal("settings-modal-backdrop"));
document.getElementById("settings-modal-backdrop").addEventListener("click", (e) => {
  if (e.target.id === "settings-modal-backdrop") closeModal("settings-modal-backdrop");
});

function renderBookmarkEditor() {
  const container = document.getElementById("bookmark-editor");
  container.innerHTML = "";
  settings.bookmarks.forEach((bm, i) => {
    const row = document.createElement("div");
    row.className = "bookmark-row";
    row.innerHTML = `
      <input class="bm-name" type="text" placeholder="Name" value="${escapeAttr(bm.name)}">
      <input class="bm-url" type="text" placeholder="https://…" value="${escapeAttr(bm.url)}">
      <button type="button" aria-label="Remove">×</button>
    `;
    row.querySelector(".bm-name").addEventListener("input", (e) => (settings.bookmarks[i].name = e.target.value));
    row.querySelector(".bm-url").addEventListener("input", (e) => (settings.bookmarks[i].url = e.target.value));
    row.querySelector("button").addEventListener("click", () => {
      settings.bookmarks.splice(i, 1);
      renderBookmarkEditor();
    });
    container.appendChild(row);
  });
}

function escapeAttr(str) {
  return (str || "").replace(/"/g, "&quot;");
}

document.getElementById("add-bookmark").addEventListener("click", () => {
  settings.bookmarks.push({ name: "", url: "" });
  renderBookmarkEditor();
});

document.getElementById("settings-save").addEventListener("click", () => {
  settings.name = document.getElementById("settings-name").value.trim() || "Observer";
  settings.nasaKey = document.getElementById("settings-nasa-key").value.trim();
  settings.bookmarks = settings.bookmarks.filter((b) => b.name && b.url);
  saveSettings(settings);
  applyName();
  renderQuickLinks();
  closeModal("settings-modal-backdrop");
});
async function loadApod() {
  const body = document.getElementById("apod-body");
  const key = settings.nasaKey || CONFIG.nasaDemoKey;
  try {
    const res = await fetch(`${CONFIG.endpoints.apod}?api_key=${encodeURIComponent(key)}`);
    if (!res.ok) throw new Error("APOD request failed: " + res.status);
    const data = await res.json();

    const mediaUrl = data.hdurl || data.url;
    const mediaHtml =
      data.media_type === "video"
        ? `<video src="${mediaUrl}" controls playsinline preload="metadata" title="APOD video"></video>`
        : `<img src="${mediaUrl}" alt="${escapeAttr(data.title)}" loading="lazy">`;

    body.innerHTML = `
      <div class="apod-media">${mediaHtml}</div>
      <div class="apod-title">${escapeHtml(data.title)}</div>
      <div class="apod-date">${data.date}</div>
      <button class="apod-more" id="apod-more-btn">Read the full story</button>
    `;

    document.getElementById("apod-more-btn").addEventListener("click", () => {
      document.getElementById("modal-title").textContent = data.title;
      document.getElementById("modal-date").textContent =
        data.date + (data.copyright ? ` · © ${data.copyright}` : "");
      document.getElementById("modal-explanation").textContent = data.explanation;
      openModal("apod-modal-backdrop");
    });
  } catch (err) {
    console.warn("APOD widget failed", err);
    body.innerHTML = `<p class="error-text">Couldn't reach NASA's picture archive right now. Try again shortly.</p>`;
  }
}

document.getElementById("apod-modal-close").addEventListener("click", () => closeModal("apod-modal-backdrop"));
document.getElementById("apod-modal-backdrop").addEventListener("click", (e) => {
  if (e.target.id === "apod-modal-backdrop") closeModal("apod-modal-backdrop");
});

function projectToMap(lat, lon) {
  const x = ((lon + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { x, y };
}

async function loadIss() {
  try {
    const res = await fetch(CONFIG.endpoints.iss);
    if (!res.ok) throw new Error("ISS request failed: " + res.status);
    const data = await res.json();

    const { x, y } = projectToMap(data.latitude, data.longitude);
    const dot = document.getElementById("iss-dot");
    dot.style.left = x + "%";
    dot.style.top = y + "%";

    document.getElementById("iss-lat").textContent = data.latitude.toFixed(2) + "°";
    document.getElementById("iss-lon").textContent = data.longitude.toFixed(2) + "°";
    document.getElementById("iss-alt").textContent = Math.round(data.altitude) + " km";
    document.getElementById("iss-vel").textContent = Math.round(data.velocity).toLocaleString() + " km/h";
  } catch (err) {
    console.warn("ISS widget failed", err);
    document.getElementById("iss-lat").textContent = "n/a";
  }
}
async function loadPeopleInSpace() {
  const countEl = document.getElementById("people-count");
  const listEl = document.getElementById("people-list");
  try {
    const res = await fetch(CONFIG.endpoints.people);
    if (!res.ok) throw new Error("people request failed: " + res.status);
    const data = await res.json();

    countEl.textContent = data.number;
    listEl.innerHTML = (data.people || [])
      .map((p) => {
        const craft = p.spacecraft || p.craft || "—";
        return `<li>${escapeHtml(p.name)}<span>${escapeHtml(craft)}</span></li>`;
      })
      .join("");
  } catch (err) {
    console.warn("People-in-space widget failed", err);
    countEl.textContent = "—";
    listEl.innerHTML = `<li class="error-text">Roster unavailable right now.</li>`;
  }
}
let countdownInterval = null;

async function loadNextLaunch() {
  const body = document.getElementById("launch-body");
  try {
    const res = await fetch(CONFIG.endpoints.launches);
    if (!res.ok) throw new Error("launch request failed: " + res.status);
    const payload = await res.json();
    const launch = (payload.results && payload.results[0]) || null;
    if (!launch) throw new Error("no upcoming launch");

    const name = launch.name || "Upcoming launch";
    const provider =
      (launch.launch_service_provider && launch.launch_service_provider.name) ||
      (launch.rocket && launch.rocket.configuration && launch.rocket.configuration.full_name) ||
      "Rocket TBD";
    const pad =
      (launch.pad && (launch.pad.name || (launch.pad.location && launch.pad.location.name))) || "";

    body.innerHTML = `
      <p class="launch-mission">${escapeHtml(name)}</p>
      <p class="launch-meta">${escapeHtml(provider)}${pad ? " · " + escapeHtml(pad) : ""}</p>
      <div class="countdown" id="countdown">
        <div><span class="num" id="cd-d">00</span><span class="unit">days</span></div>
        <div><span class="num" id="cd-h">00</span><span class="unit">hrs</span></div>
        <div><span class="num" id="cd-m">00</span><span class="unit">min</span></div>
        <div><span class="num" id="cd-s">00</span><span class="unit">sec</span></div>
      </div>
    `;

    const targetDate = launch.net ? new Date(launch.net) : null;
    if (countdownInterval) clearInterval(countdownInterval);
    if (targetDate && !isNaN(targetDate)) {
      const update = () => {
        const diff = targetDate - new Date();
        if (diff <= 0) {
          clearInterval(countdownInterval);
          document.getElementById("countdown").outerHTML =
            `<p class="launch-meta">Liftoff window has opened.</p>`;
          return;
        }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        document.getElementById("cd-d").textContent = String(d).padStart(2, "0");
        document.getElementById("cd-h").textContent = String(h).padStart(2, "0");
        document.getElementById("cd-m").textContent = String(m).padStart(2, "0");
        document.getElementById("cd-s").textContent = String(s).padStart(2, "0");
      };
      update();
      countdownInterval = setInterval(update, 1000);
    }
  } catch (err) {
    console.warn("Launch widget failed", err);
    body.innerHTML = `<p class="error-text">Launch schedule unavailable right now.</p>`;
  }
}

const PLANETS = [
  { englishName: "Mercury", meanRadius: 2439.7, gravity: 3.7, mass: { massValue: 3.301, massExponent: 23 }, moons: [] },
  { englishName: "Venus", meanRadius: 6051.8, gravity: 8.87, mass: { massValue: 4.867, massExponent: 24 }, moons: [] },
  { englishName: "Earth", meanRadius: 6371.0, gravity: 9.8, mass: { massValue: 5.972, massExponent: 24 }, moons: [1] },
  { englishName: "Mars", meanRadius: 3389.5, gravity: 3.71, mass: { massValue: 6.417, massExponent: 23 }, moons: [1, 2] },
  { englishName: "Jupiter", meanRadius: 69911, gravity: 24.79, mass: { massValue: 1.898, massExponent: 27 }, moons: Array(95) },
  { englishName: "Saturn", meanRadius: 58232, gravity: 10.44, mass: { massValue: 5.683, massExponent: 26 }, moons: Array(146) },
  { englishName: "Uranus", meanRadius: 25362, gravity: 8.69, mass: { massValue: 8.681, massExponent: 25 }, moons: Array(28) },
  { englishName: "Neptune", meanRadius: 24622, gravity: 11.15, mass: { massValue: 1.024, massExponent: 26 }, moons: Array(16) },
];

async function loadAlmanac() {
  const canvas = document.getElementById("skychart-canvas");
  const ctx = canvas.getContext("2d");
  const readout = document.getElementById("skychart-readout");
  try {
    drawSkyChart(ctx, canvas, PLANETS);
    cyclePlanetReadout(readout, PLANETS);
  } catch (err) {
    console.warn("Almanac widget failed", err);
    readout.textContent = "Couldn't render the solar system chart.";
  }
}

function drawSkyChart(ctx, canvas, planets) {
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = `rgba(200, 214, 240, ${Math.random() * 0.5 + 0.1})`;
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.1, 0, Math.PI * 2);
    ctx.fill();
  }

  const n = planets.length;
  const marginX = 50;
  const usableW = w - marginX * 2;
  const points = planets.map((p, i) => {
    const x = marginX + (usableW / (n - 1)) * i;
    const y = h / 2 + Math.sin(i * 1.4) * (h * 0.22);
    return { x, y, planet: p };
  });

  ctx.strokeStyle = "rgba(74, 111, 151, 0.55)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  points.forEach((pt, i) => {
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  });
  ctx.stroke();

  points.forEach(({ x, y, planet }) => {
    const r = Math.max(3, Math.min(11, Math.log((planet.meanRadius || 1000) + 1) * 1.4));
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r * 2.2);
    grad.addColorStop(0, "rgba(232,168,84,0.9)");
    grad.addColorStop(1, "rgba(232,168,84,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r * 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ece4cf";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "12px 'Cormorant Garamond', serif";
    ctx.fillStyle = "rgba(217, 225, 242, 0.8)";
    ctx.textAlign = "center";
    ctx.fillText(planet.englishName, x, y + r + 16);
  });
}

let almanacCycleTimer = null;
function cyclePlanetReadout(readout, planets) {
  let i = 0;
  const show = () => {
    const p = planets[i % planets.length];
    const massText = p.mass
      ? `${p.mass.massValue} × 10^${p.mass.massExponent} kg`
      : "unknown mass";
    const moonCount = Array.isArray(p.moons) ? p.moons.length : (p.moons || 0);
    readout.innerHTML =
      `<span class="planet-name">${p.englishName}</span> — mean radius ${Math.round(p.meanRadius).toLocaleString()} km · ` +
      `gravity ${p.gravity} m/s² · ${massText} · ${moonCount} known moon(s)`;
    i++;
  };
  show();
  if (almanacCycleTimer) clearInterval(almanacCycleTimer);
  almanacCycleTimer = setInterval(show, CONFIG.planetCycle);
}

function initStarfield() {
  const canvas = document.getElementById("sky");
  const ctx = canvas.getContext("2d");
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const density = Math.floor((canvas.width * canvas.height) / 9000);
    stars = Array.from({ length: density }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.3 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005,
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((s) => {
      const twinkle = Math.sin(t * s.speed + s.phase) * 0.4 + 0.6;
      ctx.fillStyle = `rgba(217, 225, 242, ${twinkle})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(draw);
}

function init() {
  applyName();
  renderQuickLinks();
  initNotes();
  initStarfield();

  tickClock();
  setInterval(tickClock, 1000);

  loadApod();
  loadIss();
  loadPeopleInSpace();
  loadNextLaunch();
  loadAlmanac();

  setInterval(loadIss, CONFIG.issRefresh);
  setInterval(loadPeopleInSpace, CONFIG.peopleRefresh);
}

document.addEventListener("DOMContentLoaded", init);
