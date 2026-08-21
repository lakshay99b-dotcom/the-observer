var clockEl = document.getElementById('clock');
var dateEl = document.getElementById('date');
var unameEl = document.getElementById('uname');
var nameInput = document.getElementById('nameInput');
var notesEl = document.getElementById('notes');
var apodEl = document.getElementById('apod');
var issEl = document.getElementById('iss');
var peopleEl = document.getElementById('people');
var apiKeyInput = document.getElementById('apiKeyInput');
var bookmarkList = document.getElementById('bookmarkList');

var defaultBookmarks = [
  { n: 'GitHub', u: 'https://github.com' },
  { n: 'Stardance', u: 'https://stardance.hackclub.com' },
  { n: 'YouTube', u: 'https://youtube.com' }
];

function tick(){
  var n = new Date();
  clockEl.textContent = n.toLocaleTimeString('en-GB');
  dateEl.textContent = n.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}).toUpperCase();
  var g = 'Good evening';
  var h = n.getHours();
  if(h < 12) g = 'Good morning';
  else if(h < 17) g = 'Good afternoon';
  document.querySelector('.greeting').childNodes[0].textContent = g + ', ';
}
setInterval(tick,1000);
tick();

var savedName = localStorage.getItem('obs-name');
if(savedName){
  unameEl.textContent = savedName;
  nameInput.value = savedName;
}

var savedKey = localStorage.getItem('obs-apikey');
if(savedKey) apiKeyInput.value = savedKey;
else apiKeyInput.value = 'DEMO_KEY';

var savedNotes = localStorage.getItem('obs-notes');
if(savedNotes) notesEl.value = savedNotes;
notesEl.oninput = function(){
  localStorage.setItem('obs-notes', notesEl.value);
};

function getBookmarks(){
  try{
    var raw = localStorage.getItem('obs-bookmarks');
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return defaultBookmarks.slice();
}

function renderLinks(){
  var list = getBookmarks();
  var ql = document.getElementById('qlinks');
  ql.innerHTML = '';
  list.forEach(function(l){
    if(!l.n && !l.u) return;
    var a = document.createElement('a');
    a.href = l.u || '#';
    a.target = '_blank';
    a.textContent = l.n || l.u;
    ql.appendChild(a);
  });
}

function renderBookmarkEditor(){
  var list = getBookmarks();
  bookmarkList.innerHTML = '';
  list.forEach(function(l, i){
    var row = document.createElement('div');
    row.className = 'bm-row';
    row.innerHTML = '<input class="name" type="text" value="' + (l.n || '') + '" data-i="' + i + '" data-f="n">' +
      '<input class="url" type="text" value="' + (l.u || '') + '" data-i="' + i + '" data-f="u">' +
      '<button class="rm" type="button" data-i="' + i + '">&times;</button>';
    bookmarkList.appendChild(row);
  });

  bookmarkList.querySelectorAll('.rm').forEach(function(btn){
    btn.onclick = function(){
      var list2 = getBookmarks();
      list2.splice(parseInt(btn.getAttribute('data-i')), 1);
      localStorage.setItem('obs-bookmarks', JSON.stringify(list2));
      renderBookmarkEditor();
    };
  });
}

document.getElementById('addBookmark').onclick = function(){
  var list = getBookmarks();
  list.push({ n: '', u: '' });
  localStorage.setItem('obs-bookmarks', JSON.stringify(list));
  renderBookmarkEditor();
};

document.getElementById('openSettings').onclick = function(){
  nameInput.value = localStorage.getItem('obs-name') || 'Observer';
  apiKeyInput.value = localStorage.getItem('obs-apikey') || 'DEMO_KEY';
  renderBookmarkEditor();
  document.getElementById('modalBg').classList.add('open');
};

document.getElementById('closeSettings').onclick = function(){
  document.getElementById('modalBg').classList.remove('open');
};

document.getElementById('modalBg').onclick = function(e){
  if(e.target === document.getElementById('modalBg')){
    document.getElementById('modalBg').classList.remove('open');
  }
};

document.getElementById('saveBtn').onclick = function(){
  var v = nameInput.value.trim() || 'Observer';
  localStorage.setItem('obs-name', v);
  unameEl.textContent = v;

  var key = apiKeyInput.value.trim() || 'DEMO_KEY';
  localStorage.setItem('obs-apikey', key);

  var rows = bookmarkList.querySelectorAll('.bm-row');
  var list = [];
  rows.forEach(function(row){
    var n = row.querySelector('.name').value.trim();
    var u = row.querySelector('.url').value.trim();
    if(n || u) list.push({ n: n, u: u });
  });
  if(list.length === 0) list = defaultBookmarks.slice();
  localStorage.setItem('obs-bookmarks', JSON.stringify(list));

  renderLinks();
  getApod();
  document.getElementById('modalBg').classList.remove('open');
};

renderLinks();

function doSearch(){
  var input = document.getElementById('search');
  var q = input.value.trim();
  if(!q) return;

  var isUrl = false;
  if(q.indexOf('http://') === 0 || q.indexOf('https://') === 0){
    isUrl = true;
  } else if(q.indexOf('.') !== -1 && q.indexOf(' ') === -1){
    isUrl = true;
  }

  if(isUrl){
    var url = q;
    if(url.indexOf('http') !== 0) url = 'https://' + url;
    window.location.href = url;
  } else {
    window.location.href = 'https://www.google.com/search?q=' + encodeURIComponent(q);
  }
}

document.getElementById('searchForm').addEventListener('submit', function(e){
  e.preventDefault();
  doSearch();
});

async function getApod(){
  try{
    var key = localStorage.getItem('obs-apikey') || 'DEMO_KEY';
    var r = await fetch('https://api.nasa.gov/planetary/apod?api_key=' + encodeURIComponent(key));
    var d = await r.json();
    if(d.media_type === 'image'){
      apodEl.innerHTML = '<img class="apod-img" src="' + d.url + '" alt="' + d.title + '"><div class="apod-title">' + d.title + '</div><div class="apod-text">' + d.explanation.slice(0,200) + '...</div>';
    }else if(d.url){
      apodEl.innerHTML = '<p>Today is a video. <a href="' + d.url + '" target="_blank" style="color:#e8a854">Open it</a></p>';
    }else{
      apodEl.innerHTML = '<p class="loading">Couldnt load APOD right now</p>';
    }
  }catch(e){
    apodEl.innerHTML = '<p class="loading">Couldnt load APOD right now</p>';
  }
}
getApod();

async function getIss(){
  try{
    var r = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
    var d = await r.json();
    issEl.innerHTML = 'Lat ' + d.latitude.toFixed(2) + '° · Lon ' + d.longitude.toFixed(2) + '°<br>Alt ' + d.altitude.toFixed(0) + ' km · ' + d.velocity.toFixed(0) + ' km/h';
  }catch(e){
    issEl.textContent = 'ISS data unavailable';
  }
}
getIss();
setInterval(getIss,25000);

async function getPeople(){
  try{
    var r = await fetch('https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json');
    var d = await r.json();
    if(d.number){
      peopleEl.innerHTML = d.number + ' humans currently in orbit';
    }else{
      peopleEl.textContent = 'Could not fetch crew info';
    }
  }catch(e){
    peopleEl.textContent = 'Could not fetch crew info';
  }
}
getPeople();