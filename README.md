# Custom Bangs

A Firefox extension that lets you create custom keyword-triggered bangs for quick searches, similar to DuckDuckGo's !bang syntax.

## Installation

### Temporary Installation (for testing)
1. Open Firefox and navigate to `about:debugging`
2. Click **"This Firefox"** in the sidebar
3. Click **"Load Temporary Add-on..."**
4. Select the `manifest.json` file in this folder
5. The extension will be loaded until you close Firefox

### Permanent Installation
1. Go to [Mozilla Add-ons](https://addons.mozilla.org)
2. Submit your extension (you'll need to zip the files and sign it)
3. Or use WebExt Manager extension to install permanently

## Usage

### Basic Search
Type a keyword followed by your search query in the Firefox address bar:

```
g linux commands
yt rust tutorials
am wireless headphones
px ai news
```

Press **Enter** to perform the search.

### Managing Bangs
1. Click the extension icon in the toolbar
2. Add new bangs:
   - **Name**: Display name (e.g., "Google")
   - **Keyword**: Short trigger (e.g., "g")
   - **URL**: Search URL with `%s` for the query (e.g., `https://www.google.com/search?q=%s`)
3. Click **Add Bang** to save
4. Click **✕** to delete a bang

## Default Bangs

| Keyword | Name | URL |
|---------|------|-----|
| g | Google | `https://www.google.com/search?q=%s` |
| yt | YouTube | `https://www.youtube.com/results?search_query=%s` |
| am | Amazon India | `https://www.amazon.in/s?k=%s` |
| px | Perplexity | `https://www.perplexity.ai/search?q=%s` |

## Adding More Features

### Adding New Search Engines
Edit `popup.js` or use the popup UI to add more bangs. Some popular examples:

```javascript
// Reddit
{ name: 'Reddit', keyword: 'r', url: 'https://www.reddit.com/search/?q=%s' }

// Wikipedia
{ name: 'Wikipedia', keyword: 'w', url: 'https://en.wikipedia.org/wiki/%s' }

// GitHub
{ name: 'GitHub', keyword: 'gh', url: 'https://github.com/search?q=%s' }

// Stack Overflow
{ name: 'Stack Overflow', keyword: 'so', url: 'https://stackoverflow.com/search?q=%s' }

// Amazon (Global)
{ name: 'Amazon', keyword: 'aws', url: 'https://www.amazon.com/s?k=%s' }

// Google Maps
{ name: 'Google Maps', keyword: 'gm', url: 'https://www.google.com/maps/search/%s' }

// Dictionary
{ name: 'Dictionary', keyword: 'def', url: 'https://www.dictionary.com/browse/%s' }
```

### Customizing the UI
Edit `popup.html` to change the styling. The popup uses vanilla CSS.

### Advanced Features
Edit `background.js` to add:
- Keyboard shortcuts
- Context menu integration
- Search suggestions
- Analytics

## Files

- `manifest.json` - Extension configuration
- `background.js` - Omnibox search handling
- `popup.html` - Management UI
- `popup.js` - Popup logic
- `icons/` - Extension icons

## License

MIT