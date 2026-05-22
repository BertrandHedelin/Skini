// Client minimal pour afficher dynamiquement les files d'attente
(async function(){
  const statusEl = () => document.getElementById('status');
  const tickInfoEl = () => document.getElementById('tickInfo');
  const pauseStateEl = () => document.getElementById('pauseState');
  const pauseButtonEl = () => document.getElementById('pauseButton');
  let paused = false;
  let queuedQueues = null;

  // Récupère la config du serveur pour le port websocket
  let ipConfig = { websocketServeurPort: 8383 };
  try {
    const r = await fetch('/serveur/ipConfig.json');
    if (r.ok) ipConfig = await r.json();
  } catch(e) {
    console.warn('Impossible de charger /serveur/ipConfig.json, port par défaut utilisé');
  }

  const host = window.location.hostname || 'localhost';
  const port = ipConfig.websocketServeurPort || 8383;
  let ws;

  function connect(){
    statusEl().textContent = `Connexion : ws://${host}:${port}`;
    ws = new WebSocket(`ws://${host}:${port}`);

    ws.onopen = function(){
      statusEl().textContent = `Connecté à ${host}:${port}`;
      const msg = { type: 'startSpectateur', text: 'queueViewer', id: Date.now() };
      ws.send(JSON.stringify(msg));
    };

    ws.onclose = function(){
      statusEl().textContent = 'Déconnecté, reconnexion dans 2s...';
      setTimeout(connect, 2000);
    };

    ws.onerror = function(e){
      console.error('WebSocket error', e);
    };

    ws.onmessage = function(event){
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'etatDeLaFileAttente') {
          if (paused) {
            queuedQueues = msg.value || [];
            statusEl().textContent = `Pause activée - frame figée`;
          } else {
            renderQueues(msg.value || []);
          }
        }
      } catch(e){
        console.warn('Erreur parsing message', e);
      }
    };
  }

  function renderQueues(queues){
    const tbody = document.querySelector('#queuesTable tbody');
    tbody.innerHTML = '';

    // First pass: compute durations for all clips and per-queue totals
    const queuesInfo = [];
    for (let i = 0; i < queues.length; i++){
      const q = queues[i];
      const index = q && q[0] !== undefined ? q[0] : i;
      const content = (q && q[2]) ? q[2] : [];
      const clips = content.map(it => {
        if (it && typeof it === 'object') return it;
        return { name: String(it) };
      });
      const durations = clips.map(c => {
        if (Array.isArray(c) && c[2] && typeof c[2] === 'number') return c[2];
        if (c.duration && typeof c.duration === 'number') return c.duration;
        return 1;
      });
      const total = durations.reduce((s, v) => s + v, 0) || clips.length;
      queuesInfo.push({ index, clips, durations, total });
    }

    // Global timeline length = max of queue totals (so longest queue spans full timeline)
    const globalMaxTotal = queuesInfo.reduce((m, q) => Math.max(m, q.total || 0), 0);
    const displayTicks = globalMaxTotal || 0;
    const effectiveMaxTotal = globalMaxTotal || 1;
    tickInfoEl().textContent = `Ticks : ${displayTicks}`;

    // Fixed width for all timelines (same scale across all files)
    const FIXED_TIMELINE_WIDTH = 920;

    // Build map of queues by index so missing indices can be rendered empty
    const queueMap = new Map();
    let maxIndex = -1;
    queuesInfo.forEach(info => {
      queueMap.set(info.index, info);
      if (info.index > maxIndex) maxIndex = info.index;
    });

    // Second pass: render rows using a fixed timeline width so proportions match across rows
    for (let idx = 0; idx <= maxIndex; idx++){
      const info = queueMap.get(idx) || { index: idx, clips: [], durations: [], total: 0 };
      const tr = document.createElement('tr');
      const tdIndex = document.createElement('td'); tdIndex.textContent = info.index;
      const tdLength = document.createElement('td'); tdLength.textContent = info.clips.length;
      const tdContent = document.createElement('td');

      const timeline = document.createElement('div');
      timeline.className = 'timeline';
      timeline.style.width = FIXED_TIMELINE_WIDTH + 'px';

      if (info.clips.length === 0) {
        timeline.classList.add('timelineEmpty');
        const emptyEl = document.createElement('div');
        emptyEl.className = 'emptySlot';
        emptyEl.textContent = 'vide';
        timeline.appendChild(emptyEl);
      } else {
        for (let j = 0; j < info.clips.length; j++){
          const c = info.clips[j];
          const dur = info.durations[j] || 1;
          const widthPx = Math.max(24, Math.round((dur / effectiveMaxTotal) * FIXED_TIMELINE_WIDTH));
          const label = (Array.isArray(c) && c[1]) ? c[1] : (c.name || c.label || 'clip');
          const clipEl = document.createElement('div');
          clipEl.className = label === 'clip' ? 'clip clipPlaceholder' : 'clip';
          clipEl.style.flex = 'none';
          clipEl.style.width = widthPx + 'px';
          clipEl.title = label;
          if (label !== 'clip') {
            clipEl.style.backgroundColor = colorFromString(label);
          }
          const span = document.createElement('span'); span.textContent = label;
          clipEl.appendChild(span);
          timeline.appendChild(clipEl);
        }
      }

      tdContent.appendChild(timeline);
      tr.appendChild(tdIndex);
      tr.appendChild(tdLength);
      tr.appendChild(tdContent);
      tbody.appendChild(tr);
    }
  }

  // Simple color hash from string
  function colorFromString(s){
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h<<5) - h + s.charCodeAt(i);
    h = Math.abs(h) % 360;
    return `hsl(${h}, 65%, 45%)`;
  }

  function initControls(){
    const button = pauseButtonEl();
    button.addEventListener('click', () => {
      paused = !paused;
      if (paused) {
        pauseStateEl().textContent = 'Figé';
        button.textContent = 'Reprendre';
        statusEl().textContent = 'Arrêt sur image activé';
      } else {
        pauseStateEl().textContent = 'En direct';
        button.textContent = 'Arrêt sur image';
        statusEl().textContent = `Connecté à ${host}:${port}`;
        if (queuedQueues !== null) {
          renderQueues(queuedQueues);
          queuedQueues = null;
        }
      }
    });
  }

  connect();
  initControls();

})();
