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
        <button class="og-rag-close" onclick="closeRagModal()">&#x2715;</button>
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
          <button class="og-rag-sug" onclick="ragAsk(this.textContent)">Which cities are on WATCH level now?</button>
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
          </div>
          <div class="og-rag-answer-text" id="og-rag-text"></div>
          <div id="og-rag-meta" style="margin-top:.75rem"></div>
        </div>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('afterbegin', nav);

  /* Keyboard shortcuts */
  document.addEventListener('keydown', function(e){
    if((e.ctrlKey||e.metaKey) && e.key==='k'){e.preventDefault();openRagModal();}
    if(e.key==='Escape') closeRagModal();
  });
})();

/* ── RAG CONFIG ── */
var RAG_WEBHOOK = "https://gauravtupe.app.n8n.cloud/webhook/oceanguard-query";

/* ── MODAL CONTROLS ── */
function openRagModal(){
  var o = document.getElementById("og-rag-overlay");
  if(o){
    o.classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(function(){ var inp = document.getElementById("og-rag-input"); if(inp) inp.focus(); }, 300);
  }
}

function closeRagModal(){
  var o = document.getElementById("og-rag-overlay");
  if(o){ o.classList.remove("open"); document.body.style.overflow = ""; }
}

function ragAsk(q){
  var inp = document.getElementById("og-rag-input");
  if(inp){ inp.value = q.trim(); ragSubmit(); }
}

/* ── MAIN RAG SUBMIT ── */
async function ragSubmit(){
  var inp = document.getElementById("og-rag-input");
  var q   = inp ? inp.value.trim() : "";
  if(!q) return;

  var btn      = document.getElementById("og-rag-btn");
  var answerEl = document.getElementById("og-rag-answer");
  var textEl   = document.getElementById("og-rag-text");
  var qEl      = document.getElementById("og-rag-q");
  var metaEl   = document.getElementById("og-rag-meta");

  /* ── LOADING STATE ── */
  btn.disabled  = true;
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Thinking...';
  answerEl.style.display = "block";
  textEl.className       = "og-rag-thinking";
  textEl.innerHTML       = '<div class="b-dot" style="background:var(--purple)"></div>'
                         + '<div class="b-dot" style="background:var(--purple);animation-delay:.2s"></div>'
                         + '<div class="b-dot" style="background:var(--purple);animation-delay:.4s"></div>'
                         + '<span style="margin-left:6px">Retrieving data and generating answer...</span>';
  qEl.textContent = "\u201C" + q + "\u201D";
  metaEl.innerHTML = "";

  /* ── FETCH ── */
  var httpStatus = 0;
  var rawText    = "";

  try {
    /* Step 1 — send request */
    var res = await fetch(RAG_WEBHOOK, {
      method:  "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept":       "application/json"
      },
      mode: "cors",
      body: JSON.stringify({ question: q })
    });

    httpStatus = res.status;
    rawText    = await res.text(); /* read as text first — safe for any response */

    /* Step 2 — handle non-OK HTTP status */
    if(!res.ok){
      var hint = httpStatus === 404
        ? "Workflow not active — open OceanGuard_RAG in n8n and toggle it ON."
        : httpStatus === 500
        ? "n8n workflow error — check the execution log in n8n."
        : "HTTP " + httpStatus + " error from n8n.";
      throw new Error(hint);
    }

    /* Step 3 — parse JSON safely */
    var data;
    try {
      data = JSON.parse(rawText);
    } catch(_){
      throw new Error("n8n returned a non-JSON response. Check the Respond to Webhook node configuration.");
    }

    /* Step 4 — render answer */
    var answer    = data.answer    || "Sorry, I could not generate an answer from the available data.";
    var cities    = (data.citiesAnalysed && data.citiesAnalysed.join(", ")) || "all cities";
    var rowCount  = data.rowCount        || 0;
    var conf      = data.confidence      || 0;
    var confLabel = data.confidenceLabel || "Unknown confidence";
    var confColor = data.confidenceColor || "amber";
    var timeWin   = data.timeWindow      || 7;

    var colorMap = { green:"#00d98b", amber:"#f0a500", red:"#f04060" };
    var col      = colorMap[confColor] || colorMap.amber;

    textEl.className = "og-rag-answer-text";
    textEl.innerHTML = answer
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");

    /* Confidence bar */
    metaEl.innerHTML =
      '<div class="og-conf-bar-wrap">'
    +   '<div class="og-conf-top">'
    +     '<span class="og-conf-label" style="color:' + col + '">' + confLabel + '</span>'
    +     '<span class="og-conf-score" style="color:' + col + '">' + conf + '%</span>'
    +   '</div>'
    +   '<div class="og-conf-track">'
    +     '<div class="og-conf-fill" style="width:' + conf + '%;background:' + col + '"></div>'
    +   '</div>'
    +   '<div class="og-conf-detail">'
    +     'Based on <strong>' + rowCount + '</strong> readings'
    +     ' &nbsp;&middot;&nbsp; <strong>' + cities + '</strong>'
    +     ' &nbsp;&middot;&nbsp; last <strong>' + timeWin + '</strong> days'
    +   '</div>'
    + '</div>';

  } catch(err) {
    /* ── DIAGNOSTIC ERROR MESSAGE ── */
    var errMsg  = err.message || "";
    var display = "";

    if(errMsg.includes("Failed to fetch") || errMsg.includes("NetworkError") || errMsg.includes("CORS")){
      display = "<strong>Network / CORS error.</strong><br>"
              + "The browser blocked the request. In your n8n Respond to Webhook node, "
              + "add a response header: <code>Access-Control-Allow-Origin: *</code>";

    } else if(errMsg.includes("not active") || httpStatus === 404){
      display = "<strong>Workflow not active.</strong><br>"
              + "Open <em>OceanGuard_RAG</em> in n8n and click the Active toggle in the top-right corner to turn it ON.";

    } else if(errMsg.includes("non-JSON") || errMsg.includes("JSON")){
      display = "<strong>Response format error.</strong><br>"
              + "n8n sent back something unexpected. Check that your Respond to Webhook node "
              + "has <em>Respond With: JSON</em> and the Response Body references the Format Response node.";

    } else if(httpStatus === 500){
      display = "<strong>n8n workflow error (500).</strong><br>"
              + "One of your nodes crashed during execution. Open n8n → Executions to see the error.";

    } else {
      display = "<strong>Could not reach the query service.</strong><br>"
              + (errMsg ? "Detail: " + errMsg : "Ensure OceanGuard_RAG workflow is active in n8n.");
    }

    textEl.className = "og-rag-answer-text";
    textEl.innerHTML = '<div style="color:var(--red);font-family:var(--fm);font-size:12px;line-height:1.7">'
                     + display
                     + '</div>';
  }

  /* ── RESET BUTTON ── */
  btn.disabled  = false;
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
                + 'stroke-linecap="round" stroke-linejoin="round" width="13" height="13">'
                + '<line x1="22" y1="2" x2="11" y2="13"/>'
                + '<polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Ask';
}
/* ── 3D MOUSE TILT EFFECT (Optional) ── */
(function(){
  const cards = document.querySelectorAll('.og-metric');
  if(!cards.length || window.matchMedia('(pointer: coarse)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      
      card.style.transform = `perspective(1200px) translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1200px) translateY(0) rotateX(0) rotateY(0)';
    });
  });
})();
/* ── 3D MOUSE TILT (DOM-SAFE) ── */
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.og-metric');
  if(!cards.length || window.matchMedia('(pointer: coarse)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      
      const rX = ((y - cy) / cy) * -5;
      const rY = ((x - cx) / cx) * 5;
      
      card.style.transform = `translateY(-6px) rotateX(${rX}deg) rotateY(${rY}deg)`;
      card.style.boxShadow = '0 15px 35px rgba(0,0,0,0.4), 0 0 25px rgba(0,200,180,0.15)';
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
});
