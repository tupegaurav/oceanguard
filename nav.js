(function(){
  const page = location.pathname.split('/').pop() || 'index.html';
  const active = p => (page===p||(page===''&&p==='index.html')) ? 'og-link active' : 'og-link';

  const nav = `
  <nav class="og-nav">
    <a href="index.html" class="og-brand">
      <div class="og-brand-icon">
        <svg viewBox="0 0 24 24"><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M3 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/></svg>
      </div>
      <div>
        <div class="og-brand-name">OceanGuard</div>
        <div class="og-brand-sub">India Coastal Monitor · v2</div>
      </div>
    </a>

    <div class="og-links">
      <a href="index.html" class="${active('index.html')}">
        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        Dashboard
      </a>
      <a href="analytics.html" class="${active('analytics.html')}">
        <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        Analytics
      </a>
      <a href="alerts.html" class="${active('alerts.html')}">
        <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        Alerts
      </a>
      <a href="about.html" class="${active('about.html')}">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        About
      </a>
    </div>

    <div class="og-nav-right">
      <span id="og-timestamp" style="font-family:var(--fm);font-size:11px;color:var(--tm);letter-spacing:.04em;"></span>

      <!-- RAG BUTTON IN TOPBAR -->
      <button class="og-rag-btn" onclick="openRagModal()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        Ask OceanGuard
        <span class="og-rag-badge">AI</span>
      </button>

      <div class="og-live"><div class="og-live-dot"></div>LIVE</div>
    </div>
  </nav>

  <!-- GLOBAL RAG MODAL -->
  <div class="og-rag-overlay" id="og-rag-overlay" onclick="if(event.target===this)closeRagModal()">
    <div class="og-rag-modal" id="og-rag-modal">

      <div class="og-rag-modal-header">
        <div class="og-rag-modal-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Ask OceanGuard
          <span class="og-rag-badge" style="margin-left:4px">RAG · Llama 3</span>
        </div>
        <button class="og-rag-close" onclick="closeRagModal()">✕</button>
      </div>

      <div class="og-rag-modal-body">
        <div class="og-rag-intro">
          Ask any natural language question about India's coastal weather conditions. Answers are generated from your live Google Sheets database using Retrieval Augmented Generation.
        </div>

        <div class="og-rag-suggestions">
          <button class="og-rag-sug" onclick="ragAsk(this.textContent)">Was Mangalore dangerous last week?</button>
          <button class="og-rag-sug" onclick="ragAsk(this.textContent)">Which city had the most alerts?</button>
          <button class="og-rag-sug" onclick="ragAsk(this.textContent)">Is Chennai safe today?</button>
          <button class="og-rag-sug" onclick="ragAsk(this.textContent)">How has Goa been this week?</button>
          <button class="og-rag-sug" onclick="ragAsk(this.textContent)">Compare Arabian Sea vs Bay of Bengal</button>
          <button class="og-rag-sug" onclick="ragAsk(this.textContent)">Which cities are WATCH level now?</button>
        </div>

        <div class="og-rag-input-row">
          <input
            type="text"
            class="og-rag-input"
            id="og-rag-input"
            placeholder="e.g. Which city had the highest wind speed this week?"
            onkeydown="if(event.key==='Enter')ragSubmit()"
          />
          <button class="og-rag-submit" onclick="ragSubmit()" id="og-rag-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            Ask
          </button>
        </div>

        <div class="og-rag-answer" id="og-rag-answer" style="display:none">
          <div class="og-rag-answer-header">
            <span class="og-rag-answer-q" id="og-rag-q"></span>
            <span class="og-rag-answer-meta" id="og-rag-meta"></span>
          </div>
          <div class="og-rag-answer-text" id="og-rag-text"></div>
        </div>
      </div>

    </div>
  </div>`;

  document.body.insertAdjacentHTML('afterbegin', nav);

  /* ── KEYBOARD SHORTCUT: Ctrl+K or Cmd+K opens RAG ── */
  document.addEventListener('keydown', e => {
    if((e.ctrlKey||e.metaKey) && e.key==='k'){e.preventDefault();openRagModal();}
    if(e.key==='Escape') closeRagModal();
  });
})();

/* ── RAG MODAL FUNCTIONS (global) ── */
const RAG_WEBHOOK = "https://gauravtupe.app.n8n.cloud/webhook/oceanguard-query";

function openRagModal(){
  const o=document.getElementById("og-rag-overlay");
  if(o){o.classList.add("open");document.body.style.overflow="hidden";setTimeout(()=>document.getElementById("og-rag-input")?.focus(),300);}
}
function closeRagModal(){
  const o=document.getElementById("og-rag-overlay");
  if(o){o.classList.remove("open");document.body.style.overflow="";}
}

function ragAsk(q){
  const inp=document.getElementById("og-rag-input");
  if(inp){inp.value=q;ragSubmit();}
}

async function ragSubmit(){
  const inp=document.getElementById("og-rag-input");
  const q=inp?.value.trim();
  if(!q)return;

  const btn=document.getElementById("og-rag-btn");
  const answerEl=document.getElementById("og-rag-answer");
  const textEl=document.getElementById("og-rag-text");
  const qEl=document.getElementById("og-rag-q");
  const metaEl=document.getElementById("og-rag-meta");

  btn.disabled=true;
  btn.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Thinking...`;
  answerEl.style.display="block";
  textEl.className="og-rag-thinking";
  textEl.innerHTML=`<div class="b-dot" style="background:var(--purple)"></div><div class="b-dot" style="background:var(--purple);animation-delay:.2s"></div><div class="b-dot" style="background:var(--purple);animation-delay:.4s"></div><span style="margin-left:6px">Retrieving data and generating answer...</span>`;
  qEl.textContent=`"${q}"`;
  metaEl.textContent="";

  const data      = await res.json();
const answer    = data.answer || "Sorry, I couldn't generate an answer.";
const cities    = data.citiesAnalysed?.join(", ") || "all cities";
const rowCount  = data.rowCount || 0;
const conf      = data.confidence || 0;
const confLabel = data.confidenceLabel || "Unknown confidence";
const confColor = data.confidenceColor || "amber";

// Colour map to CSS variables
const colorMap = { green:"#00d98b", amber:"#f0a500", red:"#f04060" };
const col = colorMap[confColor] || colorMap.amber;

textEl.className = "og-rag-answer-text";
textEl.innerHTML = answer
  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  .replace(/\n/g, "<br>");

// Confidence indicator
metaEl.innerHTML = `
  <div class="og-conf-bar-wrap">
    <div class="og-conf-top">
      <span class="og-conf-label" style="color:${col}">${confLabel}</span>
      <span class="og-conf-score" style="color:${col}">${conf}%</span>
    </div>
    <div class="og-conf-track">
      <div class="og-conf-fill" style="width:${conf}%;background:${col}"></div>
    </div>
    <div class="og-conf-detail">
      Based on <strong>${rowCount}</strong> readings · <strong>${cities}</strong> · last <strong>${data.timeWindow || 7}</strong> days
    </div>
  </div>`;
