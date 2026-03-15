# AGENTS.md - Pixel Cool Development Guide

## Project Overview

Pixel Cool is a pixel puzzle game (PWA) where players swap pixels to recreate a target mosaic image. Built with vanilla JavaScript, HTML, and CSS. No build system required - files are served directly.

- **Production URL**: https://mcanevet.github.io/pixel-cool/
- **Tech Stack**: Vanilla JavaScript (ES6+), HTML5, CSS3, PWA (Service Worker)
- **Repository**: https://github.com/mcanevet/pixel-cool

---

## 1. Build / Lint / Test Commands

This project has no build system or test framework. All files are static and served directly.

### Running Locally

```bash
# Simply open index.html in a browser, or use a simple HTTP server:
npx serve .

# Or with Python:
python3 -m http.server 8000
```

### Deployment

Deployment is automatic via GitHub Actions. On push to `main`, the site deploys to:
- **Main**: https://mcanevet.github.io/pixel-cool/

On pull requests, a preview deploys to:
- **PR Preview**: https://mcanevet.github.io/pixel-cool/pr-{PR_NUMBER}/

The workflow file is at `.github/workflows/deploy.yml`.

### Manual GitHub Pages Rebuild

If needed, trigger a rebuild via API:
```bash
curl -X POST "https://api.github.com/repos/mcanevet/pixel-cool/pages/builds" \
  -H "Authorization: Bearer $(gh auth token)" \
  -H "Accept: application/vnd.github+json"
```

---

## 2. Code Style Guidelines

### General Principles

- Keep it simple - vanilla JavaScript, no frameworks
- No external dependencies (except fonts from Google Fonts)
- Mobile-first responsive design
- PWA-ready with manifest.json and service worker

### JavaScript (game.js, sw.js)

**Naming Conventions**
- Variables/functions: `camelCase` (e.g., `currentSize`, `shuffleArray`)
- Constants: `UPPER_SNAKE_CASE` for true constants (e.g., `DISTINCT_COLORS`)
- Private functions: Prefix with underscore `_internalFunction()` (optional)

**Code Structure**
```javascript
// Constants at top
const CONSTANT_VALUE = 'value';

// Global state (minimal)
let gameState = null;

// Functions grouped by purpose
function init() { }
function render() { }
function handleEvent() { }
```

**Functions**
- Keep functions small and focused (< 30 lines)
- Use arrow functions for callbacks: `arr.map(x => x * 2)`
- Use async/await for async operations

**Error Handling**
- Wrap potentially failing code in try/catch for user-facing errors
- Log errors to console for debugging: `console.error('Failed to:', error)`
- Provide user-friendly error messages in the UI

**No TypeScript** - This is a vanilla JS project. If types are needed, use JSDoc comments:
```javascript
/**
 * @param {string} emoji - The emoji to pixelate
 * @param {number} size - Grid size
 * @returns {string[]} Array of color strings
 */
```

### HTML (index.html)

**Structure**
- Semantic HTML5 elements (`<header>`, `<main>`, `<footer>`, `<nav>`)
- Accessibility: use `<button>`, `<label>`, `aria-*` attributes
- Keep JavaScript inline or load at end of body

**PWA Meta Tags**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#e94560">
<link rel="manifest" href="manifest.json">
```

### CSS (style.css)

**Organization**
- CSS custom properties (variables) for theming
- Mobile-first responsive design with media queries

**Example Structure**
```css
:root {
  --primary: #e94560;
  --bg: #1a1a2e;
  --pixel-size: 32px;
}

* { box-sizing: border-box; }

.selector { 
  property: value;
}

@media (max-width: 600px) {
  .selector { property: value; }
}
```

**Naming**
- BEM-lite: `.block__element--modifier` (optional, keep simple)
- Prefer classes over IDs for reusability

### Git & Workflow

**IMPORTANT: Never commit directly to main or merge PRs without explicit user consent.**

**Branching Strategy**
- `main` - production code
- `feature/*` - new features
- `fix/*` - bug fixes
- PRs required for changes to main
- NEVER push directly to main
- NEVER merge PRs without asking for confirmation first

**Commit Messages**
- Use clear, descriptive messages
- Start with verb: "Add feature", "Fix bug", "Update styling"

**Pull Requests**
- All changes via PRs
- PRs automatically deploy preview URLs
- Preview URL format: `https://mcanevet.github.io/pixel-cool/pr-{NUM}/`

---

## 3. PWA Configuration

### manifest.json
- `start_url`: Must be `/pixel-cool/` for main, `/pixel-cool-pr-{NUM}/` for PRs
- Update automatically via GitHub Actions workflow

### Service Worker (sw.js)
- Cache static assets for offline use
- Cache version: increment on changes (`pixel-cool-v2`)

---

## 4. Adding New Features

### Adding New Emojis
Edit the `EMOJIS` array in `game.js`:
```javascript
const EMOJIS = [
  '🇫🇷', '🍕', '🏀',  // Add new emojis here
];
```

### Adding New Difficulty Levels
1. Add to `levels` object in `game.js`:
   ```javascript
   const levels = { 4: 'Easy', 8: 'Medium', 24: 'Extreme' };
   ```
2. Add button in `index.html`:
   ```html
   <button class="level-btn" data-size="24">24x24</button>
   ```

### Modifying Color Palette
Edit `DISTINCT_COLORS` array in `game.js`. Colors are hex strings:
```javascript
const DISTINCT_COLORS = [
  '#e63946', '#f1faee',  // Add more colors
];
```

---

## 5. Testing Checklist

Before submitting a PR:
- [ ] Game loads without errors
- [ ] PWA installs correctly (test on mobile)
- [ ] All difficulty levels work
- [ ] Win condition triggers correctly
- [ ] Responsive design works on mobile viewport

---

## 6. Useful Links

- [PWA Guide](https://web.dev/explore/progressive-web-apps)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions](https://docs.github.com/en/actions)
