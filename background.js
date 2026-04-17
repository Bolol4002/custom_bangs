const DEFAULT_BANGS = [
  { id: 1, name: 'Google', keyword: 'g', url: 'https://www.google.com/search?q=%s' },
  { id: 2, name: 'YouTube', keyword: 'yt', url: 'https://www.youtube.com/results?search_query=%s' },
  { id: 3, name: 'Amazon India', keyword: 'am', url: 'https://www.amazon.in/s?k=%s' },
  { id: 4, name: 'Perplexity', keyword: 'px', url: 'https://www.perplexity.ai/search?q=%s' }
];

let bangs = DEFAULT_BANGS;

browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.get('bangs').then(result => {
    if (!result.bangs) {
      return browser.storage.local.set({ bangs: DEFAULT_BANGS });
    }
    bangs = result.bangs;
  });
  
  browser.omnibox.setDefaultSuggestion({
    description: 'Type a keyword (e.g., g, yt) followed by search query'
  });
});

browser.omnibox.onInputChanged.addListener((text, suggest) => {
  if (!text.trim()) {
    suggest([]);
    return;
  }
  
  const suggestions = bangs
    .filter(bang => {
      const searchText = text.toLowerCase();
      const keyword = bang.keyword.toLowerCase();
      return searchText.startsWith(keyword + ' ') || searchText === keyword;
    })
    .map(bang => {
      const searchText = text.toLowerCase();
      const keyword = bang.keyword.toLowerCase();
      const isExact = searchText === keyword;
      
      return {
        content: isExact ? text + ' ' : text,
        description: `<match>${bang.keyword}</match> ${bang.name}`
      };
    });
  
  suggest(suggestions);
});

browser.omnibox.onInputEntered.addListener((text) => {
  const searchText = text.trim();
  
  const bang = bangs.find(b => searchText.toLowerCase().startsWith(b.keyword.toLowerCase() + ' '));
  
  if (bang) {
    const searchTerm = searchText.slice(b.keyword.length + 1);
    const searchUrl = bang.url.replace('%s', encodeURIComponent(searchTerm));
    browser.tabs.update({ url: searchUrl });
  } else {
    browser.tabs.update({ url: 'https://www.google.com/search?q=' + encodeURIComponent(searchText) });
  }
});