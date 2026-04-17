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

let bangs = DEFAULT_BANGS;

browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.get("bangs").then((result) => {
    if (!result.bangs) {
      browser.storage.local.set({ bangs: DEFAULT_BANGS });
    } else {
      bangs = result.bangs;
    }
  });

  browser.omnibox.setDefaultSuggestion({
    description: "Type a keyword (e.g., g, yt) followed by search query",
  });
});

// Keep bangs in sync whenever storage changes
browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.bangs) {
    bangs = changes.bangs.newValue;
  }
});

browser.omnibox.onInputChanged.addListener((text, suggest) => {
  if (!text.trim()) {
    suggest([]);
    return;
  }

  const cleanText = text.toLowerCase().replace(/^:/, "");

  const suggestions = bangs
    .filter((bang) => {
      const keyword = bang.keyword.toLowerCase();
      return cleanText.startsWith(keyword + " ") || cleanText === keyword;
    })
    .map((bang) => {
      const keyword = bang.keyword.toLowerCase();
      const isExact = cleanText === keyword;

      return {
        content: isExact ? text + " " : text,
        description: `<match>${bang.keyword}</match> - ${bang.name}`,
      };
    });

  suggest(suggestions);
});

browser.omnibox.onInputEntered.addListener((text) => {
  let searchText = text.trim();

  if (searchText.startsWith(":")) {
    searchText = searchText.slice(1);
  }

  const textLower = searchText.toLowerCase();
  const bang = bangs.find((b) => {
    const keyword = b.keyword.toLowerCase();
    return textLower.startsWith(keyword + " ") || textLower === keyword;
  });

  if (bang) {
    const keyword = bang.keyword.toLowerCase();
    const keywordStart = textLower.indexOf(keyword);
    const isSpaceAfter =
      searchText.charAt(keywordStart + keyword.length) === " ";
    const searchTerm = isSpaceAfter
      ? searchText.slice(keywordStart + keyword.length + 1)
      : searchText.slice(keywordStart + keyword.length);
    const searchUrl = bang.url.replace("%s", encodeURIComponent(searchTerm));
    browser.tabs.update({ url: searchUrl });
  } else {
    browser.tabs.update({
      url: "https://www.google.com/search?q=" + encodeURIComponent(searchText),
    });
  }
});
