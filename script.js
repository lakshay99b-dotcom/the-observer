const clockEl = document.getElementById('clock');
const dateEl = document.getElementById('date');
const unameEl = document.getElementById('uname');
const nameInput = document.getElementById('nameInput');
const notesEl = document.getElementById('notes');
const apodEl = document.getElementById('apod');
const issEl = document.getElementById('iss');
const peopleEl = document.getElementById('people');

function tick(){
  const n = new Date();
  clockEl.textContent = n.toLocaleTimeString('en-GB');
  dateEl.textContent = n.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}).toUpperCase();
  let g = 'Good evening';
  const h = n.getHours();
  if(h < 12) g = 'Good morning';
  else if(h < 17) g = 'Good afternoon';
  document.querySelector('.greeting').childNodes[0].textContent = g + ', ';
}
setInterval(tick,1000);
tick();

const savedName = localStorage.getItem('obs-name');
if(savedName){
  unameEl.textContent = savedName;
  nameInput.value = savedName;
}
document.getElementById('saveBtn').onclick = ()=>{
  let v = nameInput.value.trim() || 'Observer';
  localStorage.setItem('obs-name',v);
  unameEl.textContent = v;
};

const savedNotes = localStorage.getItem('obs-notes');
if(savedNotes) notesEl.value = savedNotes;
notesEl.oninput = ()=>{
  localStorage.setItem('obs-notes',notesEl.value);
};

const links = [
  {
    n:'GitHub',
    u:'https://github.com',
    svg:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>'
  },
  {
    n:'Stardance',
    u:'https://stardance.hackclub.com',
    svg:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2h7.6l-6 4.8 2.3 7.2-6.3-4.8-6.3 4.8 2.3-7.2-6-4.8h7.6z"/></svg>'
  },
  {
    n:'YouTube',
    u:'https://youtube.com',
    svg:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.5 31.5 0 000 12a31.5 31.5 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.5 31.5 0 0024 12a31.5 31.5 0 00-.5-5.8zM9.8 15.5v-7l6.2 3.5-6.2 3.5z"/></svg>'
  }
];
const ql = document.getElementById('qlinks');
links.forEach(l=>{
  const a = document.createElement('a');
  a.href = l.u;
  a.target = '_blank';
  a.innerHTML = l.svg + l.n;
  ql.appendChild(a);
});

document.getElementById('search').onkeydown = e=>{
  if(e.key === 'Enter'){
    const q = e.target.value.trim();
    if(q){
      window.open('https://www.google.com/search?q='+encodeURIComponent(q),'_blank');
      e.target.value = '';
    }
  }
};

async function getApod(){
  try{
    const r = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
    const d = await r.json();
    if(d.media_type === 'image'){
      apodEl.innerHTML = `<img class="apod-img" src="${d.url}" alt="${d.title}"><div class="apod-title">${d.title}</div><div class="apod-text">${d.explanation.slice(0,200)}...</div>`;
    }else{
      apodEl.innerHTML = `<p>Today is a video. <a href="${d.url}" target="_blank" style="color:#e8a854">Open it</a></p>`;
    }
  }catch(e){
    apodEl.innerHTML = '<p class="loading">Couldnt load APOD right now</p>';
  }
}
getApod();

async function getIss(){
  try{
    const r = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
    const d = await r.json();
    issEl.innerHTML = `Lat ${d.latitude.toFixed(2)}° · Lon ${d.longitude.toFixed(2)}°<br>Alt ${d.altitude.toFixed(0)} km · ${d.velocity.toFixed(0)} km/h`;
  }catch(e){
    issEl.textContent = 'ISS data unavailable';
  }
}
getIss();
setInterval(getIss,20000);

async function getPeople(){
  try{
    const r = await fetch('http://api.open-notify.org/astros.json');
    const d = await r.json();
    peopleEl.innerHTML = `${d.number} humans currently in orbit`;
  }catch(e){
    peopleEl.textContent = 'Could not fetch crew info';
  }
}
getPeople();