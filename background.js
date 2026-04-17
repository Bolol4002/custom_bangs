const DEFAULT_BANGS = [
  {
    id: 1,
    name: "Google",
    keyword: "g",
    url: "https://www.google.com/search?q=%s",
  },
  {
    id: 2,
    name: "YouTube",
    keyword: "yt",
    url: "https://www.youtube.com/results?search_query=%s",
  },
  {
    id: 3,
    name: "Amazon India",
    keyword: "am",
    url: "https://www.amazon.in/s?k=%s",
  },
  {
    id: 4,
    name: "Perplexity",
    keyword: "px",
    url: "https://www.perplexity.ai/search?q=%s",
  },
];

browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.get("bangs").then((result) => {
    if (!result.bangs) {
      browser.storage.local.set({ bangs: DEFAULT_BANGS });
    }
  });

  browser.omnibox.setDefaultSuggestion({
    description: "Type a bang keyword then your query (e.g.: yt cats)",
  });
});

function getBangs() {
  return browser.storage.local.get("bangs").then((result) => {
    return result.bangs || DEFAULT_BANGS;
  });
}

function findBang(bangs, text) {
  const textLower = text.toLowerCase();
  return bangs.find((b) => {
    const keyword = b.keyword.toLowerCase();
    return textLower.startsWith(keyword + " ") || textLower === keyword;
  });
}

function getSearchTerm(text, keyword) {
  const textLower = text.toLowerCase();
  const kwLower = keyword.toLowerCase();
  const afterKeyword = text.slice(kwLower.length);
  return afterKeyword.startsWith(" ") ? afterKeyword.slice(1) : afterKeyword;
}

browser.omnibox.onInputChanged.addListener((text, suggest) => {
  const trimmed = text.trim();
  if (!trimmed) {
    suggest([]);
    return;
  }

  getBangs().then((bangs) => {
    const textLower = trimmed.toLowerCase();

    const suggestions = bangs
      .filter((bang) => {
        const keyword = bang.keyword.toLowerCase();
        return textLower.startsWith(keyword + " ") || textLower === keyword;
      })
      .map((bang) => {
        const keyword = bang.keyword.toLowerCase();
        const isExact = textLower === keyword;
        return {
          content: isExact ? trimmed + " " : trimmed,
          description: `<match>${bang.keyword}</match> - ${bang.name}`,
        };
      });

    suggest(suggestions);
  });
});

browser.omnibox.onInputEntered.addListener((text) => {
  const searchText = text.trim();

  getBangs().then((bangs) => {
    const bang = findBang(bangs, searchText);

    if (bang) {
      const searchTerm = getSearchTerm(searchText, bang.keyword);
      const searchUrl = bang.url.replace("%s", encodeURIComponent(searchTerm));
      browser.tabs.update({ url: searchUrl });
    } else {
      browser.tabs.update({
        url:
          "https://www.google.com/search?q=" + encodeURIComponent(searchText),
      });
    }
  });
});
