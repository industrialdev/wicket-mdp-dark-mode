# MDP Dark Mode

Dark theme for the Wicket MDP admin panel. Three installation approaches — pick whichever fits your browser setup (Chrome, Brave, Edge, Firefox, or any browser with Tampermonkey).

> **Easiest option:** Use Tampermonkey (Approach C below). Just install the extension, add the userscript, and you're done — no need to enable developer mode or touch browser settings.

## Features

- Full dark theme covering all MDP surfaces: navbar, sidebar, cards, tables, forms, modals, datepickers, alerts, etc.
- Toggle button in the navbar — persists across sessions
- Zero impact on source code — runs entirely in the browser
- Custom scrollbar styling (Chromium)
- Custom CSS variables for easy color tweaking

---

## Approaches

### A. Chrome / Brave / Edge extension — `chrome/`

Native browser extension. No third-party tools required.

**Chrome:**
1. Go to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** → select the `chrome/` folder
4. Navigate to any `*.wicketcloud.com` URL — dark mode activates automatically

**Brave:**
1. Go to `brave://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** → select the `chrome/` folder
4. Navigate to any `*.wicketcloud.com` URL — dark mode activates automatically

**Edge:**
1. Go to `edge://extensions`
2. Enable **Developer mode** (left sidebar toggle)
3. Click **Load unpacked** → select the `chrome/` folder
4. Navigate to any `*.wicketcloud.com` URL — dark mode activates automatically

---

### B. Firefox extension — `firefox/`

Native WebExtension. Requires Firefox 109+.

**Temporary install (no signing required):**

1. Go to `about:debugging` → **This Firefox**
2. Click **Load Temporary Add-on**
3. Select the `firefox/manifest.json` file
4. Navigate to any `*.wicketcloud.com` URL — dark mode activates automatically

> Note: temporary installs are removed when Firefox restarts. For a permanent install, the extension must be signed via [addons.mozilla.org](https://addons.mozilla.org) or use a custom policy.

---

### C. Tampermonkey userscript — `tampermonkey/`

Works on any browser that supports Tampermonkey.

**1. Install Tampermonkey**

- [Chrome](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- [Brave](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) — same Chrome Web Store link; Brave supports Chrome extensions natively
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
- [Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089)

**2. Install the script**

Open Tampermonkey Dashboard → **Utilities** → drag `tampermonkey/mdp-dark.user.js` into the **Import from file** area. Or create a new script and paste the file contents.

**3. Navigate to MDP** — dark mode activates automatically.

---

## Usage

- **Toggle**: Click the ☀/🌙 icon in the navbar
- **Default**: Dark mode is ON by default. Toggle it off once to persist that preference.

## Customize Colors

All colors are CSS custom properties on `html.mdp-dark`. Edit these at the top of `dark.css` (extensions) or the `css` block in the userscript:

```css
--mdp-bg-0: #181c22;            /* Deepest background */
--mdp-bg-1: #1e2329;            /* Toolbar sidebar */
--mdp-bg-2: #252b33;            /* Cards, panels, dropdowns */
--mdp-bg-3: #2d343e;            /* Hover states, elevated */
--mdp-bg-4: #363e49;            /* Active states */
--mdp-border: #3a4350;          /* Borders */
--mdp-text: #d4dae3;            /* Primary text */
--mdp-text-secondary: #8a95a5;  /* Secondary text */
--mdp-accent: #0da090;          /* Links, focus rings, info pill labels */
```

## License

MIT
