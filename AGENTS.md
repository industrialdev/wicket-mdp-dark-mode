# MDP Dark Mode — Agent Guide

## Overview

Dark theme for the Wicket MDP admin panel. Ships as **3 approaches** from a single CSS source of truth:

- **A — Chrome/Brave/Edge extension** (`chrome/`)
- **B — Firefox extension** (`firefox/`)
- **C — Tampermonkey userscript** (`tampermonkey/`)

---

## File Map

```
.
├── AGENTS.md                    # This file
├── README.md                    # User-facing docs
├── LICENSE.md                   # MIT
├── chrome/
│   ├── manifest.json            # Chrome extension manifest (MV3)
│   ├── dark.css                 # Main CSS (source of truth)
│   └── icon*.png                # Extension icons
├── firefox/
│   ├── manifest.json            # Firefox WebExtension manifest (MV2)
│   ├── dark.css                 # Identical copy of chrome/dark.css
│   └── icon*.png                # Extension icons
└── tampermonkey/
    └── mdp-dark.user.js         # Userscript (CSS embedded as template literal)
```

**Golden rule:** `chrome/dark.css` is the CSS source of truth. Sync `firefox/dark.css` and the embedded CSS in `tampermonkey/mdp-dark.user.js` to match. All 3 must be identical in CSS output.

---

## CSS Architecture

### Variable palette (`--mdp-*` on `html.mdp-dark`)

| Variable | Purpose |
|---|---|
| `--mdp-bg-0` .. `--mdp-bg-4` | Surface hierarchy (deepest → most raised) |
| `--mdp-border` / `--mdp-border-light` | Borders |
| `--mdp-text` / `--mdp-text-secondary` / `--mdp-text-muted` | Text hierarchy |
| `--mdp-accent` / `--mdp-accent-dim` | Links, focus rings, selected states |
| `--mdp-white` / `--mdp-black` | Absolute colors |
| `--mdp-btn-*` | Button variant colors |
| `--mdp-alert-*` | Alert variant colors |
| `--mdp-destructive-*` | Destructive action colors |
| `--mdp-bg-deep` | Custom palette — deep background (#222831) |
| `--mdp-surface` | Custom palette — surface (#31363F) |
| `--mdp-teal` | Custom palette — accent teal (#76ABAE) |
| `--mdp-text-light` | Custom palette — bright text (#EEEEEE) |

### Conventions

- **Every rule** must be scoped under `html.mdp-dark` to isolate from the original light theme
- **All overrides** use `!important` to beat the app's inline/composed styles
- **Sections** are delimited by `/* ── Section name ── */` comments
- **Group related selectors** together (e.g. all `.btn-*` in the Buttons section)
- **Only override what's broken** by the dark theme — no speculative styling
- **When adding a new section**, add a comment delimiter for it

### Naming

- `--mdp-*` prefix for all custom properties
- CSS class names follow the app's BEM-like naming (`.Block__element--modifier`)
- Selectors mirror the app's own class names — don't introduce wrapper elements

---

## Adding / Modifying Rules

1. **Edit `chrome/dark.css`** first (source of truth)
2. **No hardcoded colors** — every color value MUST be a `--mdp-*` variable reference. The only place raw hex values appear is in the `/* ── Surface palette ── */` and `/* ── Custom palette ── */` variable definitions. If a new color is needed, add a variable first.
3. **Mirror the exact change** to `firefox/dark.css`
3. **Mirror to `tampermonkey/mdp-dark.user.js`** — the CSS lives as a backtick template string inside `const css = \`...\`` before the `GM_addStyle(css)` call
4. **Bump `@version`** in the userscript when pushing meaningful changes (semver)
5. **Verify** with grep that all 3 files contain the new rule

---

## Development Workflow

### Fast iteration (Tampermonkey `@require`)

Create a dev loader script (install once, then just reload):

```js
// ==UserScript==
// @name         MDP Dark Dev
// @require      file:///ABSOLUTE/PATH/tampermonkey/mdp-dark.user.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==
```

Enable Tampermonkey → Settings → **Allow access to file URLs**. Then edit → Ctrl+S → reload MDP tab.

### Browser extensions

| Browser | Load unpacked at |
|---|---|
| Chrome | `chrome://extensions` → Developer mode → Load unpacked → `chrome/` |
| Brave | `brave://extensions` → Developer mode → Load unpacked → `chrome/` |
| Edge | `edge://extensions` → Developer mode → Load unpacked → `chrome/` |
| Firefox (temp) | `about:debugging` → This Firefox → Load Temporary Add-on → `firefox/manifest.json` |

---

## Update Mechanism (Tampermonkey)

The userscript has `@updateURL` and `@downloadURL` pointing to the raw GitHub file on `main`. Tampermonkey polls this URL periodically and prompts users when `@version` changes.

**To release an update:**
1. Bump `@version` in `tampermonkey/mdp-dark.user.js`
2. Commit + push to `main`
3. Users see an "Update available" badge in Tampermonkey

---

## Quality Gates

- All 3 approaches must produce the same visual result
- Run `rg "html\\.mdp-dark" tampermonkey/mdp-dark.user.js | wc -l` and compare with `rg "html\\.mdp-dark" chrome/dark.css | wc -l` — match to ensure synced
- `--mdp-*` variables used, never raw colors in rule bodies
- `!important` on every override (Wicket app styles are aggressively specific)
- No rules outside `html.mdp-dark` scope
- No hardcoded colors outside variable definitions — every color must reference a `--mdp-*` var
- After every batch of edits, grep the 3 files for parity

## Commit Style

```
scope: short description

- chrome/dark.css      — added .Foo__bar styling
- firefox/dark.css     — mirror
- tampermonkey/        — mirror + @version bump
```
