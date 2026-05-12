(function(){
  const page = location.pathname.split('/').pop() || 'index.html';
  const active = p => page === p || (page==='' && p==='index.html') ? 'og-link active' : 'og-link';

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
      <div class="og-live"><div class="og-live-dot"></div>LIVE</div>
    </div>
  </nav>`;

  document.body.insertAdjacentHTML('afterbegin', nav);
})();
