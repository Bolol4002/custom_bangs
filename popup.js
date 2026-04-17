const DEFAULT_BANGS = [
  { id: 1, name: 'Google', keyword: 'g', url: 'https://www.google.com/search?q=%s' },
  { id: 2, name: 'YouTube', keyword: 'yt', url: 'https://www.youtube.com/results?search_query=%s' },
  { id: 3, name: 'Amazon India', keyword: 'am', url: 'https://www.amazon.in/s?k=%s' },
  { id: 4, name: 'Perplexity', keyword: 'px', url: 'https://www.perplexity.ai/search?q=%s' }
];

document.addEventListener('DOMContentLoaded', () => {
  loadBangs();
  
  document.getElementById('addBtn').addEventListener('click', addBang);
});

function loadBangs() {
  browser.storage.local.get('bangs').then(result => {
    const bangs = result.bangs || DEFAULT_BANGS;
    renderBangs(bangs);
  });
}

function renderBangs(bangs) {
  const container = document.getElementById('bangsList');
  if (bangs.length === 0) {
    container.innerHTML = '<p style="padding:12px;color:#999;text-align:center;">No bangs yet</p>';
    return;
  }
  
  container.innerHTML = bangs.map(bang => `
    <div class="bang-item" data-id="${bang.id}">
      <div class="bang-info">
        <span class="bang-keyword">${bang.keyword}</span>
        <span class="bang-name">${bang.name}</span>
      </div>
      <button class="delete-btn" onclick="deleteBang(${bang.id})">✕</button>
    </div>
  `).join('');
}

function addBang() {
  const name = document.getElementById('name').value.trim();
  const keyword = document.getElementById('keyword').value.trim();
  const url = document.getElementById('url').value.trim();
  
  if (!name || !keyword || !url) {
    alert('Please fill all fields');
    return;
  }
  
  if (!url.includes('%s')) {
    alert('URL must contain %s for query');
    return;
  }
  
  browser.storage.local.get('bangs').then(result => {
    const bangs = result.bangs || DEFAULT_BANGS;
    bangs.push({
      id: Date.now(),
      name,
      keyword,
      url
    });
    return browser.storage.local.set({ bangs });
  }).then(() => {
    document.getElementById('name').value = '';
    document.getElementById('keyword').value = '';
    document.getElementById('url').value = '';
    loadBangs();
  });
}

function deleteBang(id) {
  browser.storage.local.get('bangs').then(result => {
    const bangs = result.bangs || DEFAULT_BANGS;
    const filtered = bangs.filter(b => b.id !== id);
    return browser.storage.local.set({ bangs: filtered });
  }).then(loadBangs);
}