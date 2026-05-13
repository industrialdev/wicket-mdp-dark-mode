// ==UserScript==
// @name         MDP Dark Mode
// @namespace    https://wicketcloud.com/
// @version      1.1.0
// @updateURL    https://raw.githubusercontent.com/industrialdev/wicket-mdp-dark-mode/main/tampermonkey/mdp-dark.user.js
// @downloadURL  https://raw.githubusercontent.com/industrialdev/wicket-mdp-dark-mode/main/tampermonkey/mdp-dark.user.js
// @description  Dark mode for the Wicket MDP admin panel
// @author       EstebanForge
// @match        https://admin.staging.wicketcloud.com/*
// @match        https://admin.wicketcloud.com/*
// @match        https://*.wicketcloud.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  function isExcludedLoginUrl() {
    if (window.location.protocol !== 'https:') return false;
    if (window.location.pathname !== '/login') return false;

    const { hostname } = window.location;
    const isStagingLoginHost = /^.+\.staging\.wicketcloud\.com$/.test(hostname);
    const isProdLoginHost = /^.+\.wicketcloud\.com$/.test(hostname);
    return isStagingLoginHost || isProdLoginHost;
  }

  if (isExcludedLoginUrl()) return;

  const STORAGE_KEY = 'mdp-dark-enabled';
  const CLASS_NAME = 'mdp-dark';

  // ── Preference ──────────────────────────────────────────
  let enabled = GM_getValue(STORAGE_KEY, true); // default ON

  function save() {
    GM_setValue(STORAGE_KEY, enabled);
  }

  function toggle() {
    enabled = !enabled;
    save();
    document.documentElement.classList.toggle(CLASS_NAME, enabled);
  }

  // ── Toggle Button ───────────────────────────────────────
  function injectToggle() {
    const navbar = document.querySelector('.Navbar');
    if (!navbar || document.getElementById('mdp-dark-toggle')) return;

    const btn = document.createElement('button');
    btn.id = 'mdp-dark-toggle';
    btn.type = 'button';
    btn.title = 'Toggle MDP Dark Mode';
    btn.innerHTML = enabled ? 'light_mode' : 'dark_mode';
    btn.className = 'material-icons-outlined';
    btn.addEventListener('click', toggle);

    Object.assign(btn.style, {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '22px',
      color: 'inherit',
      padding: '0 12px',
      lineHeight: '60px',
      opacity: '0.7',
      transition: 'opacity 0.2s',
    });
    btn.onmouseenter = () => (btn.style.opacity = '1');
    btn.onmouseleave = () => (btn.style.opacity = '0.7');

    // Insert before the AccountSelector
    const account = navbar.querySelector('.AccountSelector')
      || navbar.querySelector('.Navbar__item--right');
    if (account) {
      account.parentElement.insertBefore(btn, account);
    } else {
      navbar.appendChild(btn);
    }
  }

  // ── Dark CSS ────────────────────────────────────────────
  const css = `
/* ═══════════════════════════════════════════════════════════
   MDP Dark Mode — Wicket Admin Panel
   ═══════════════════════════════════════════════════════════ */

html.mdp-dark {
  /* ── Core palette (descriptive names) ── */
  --deep-charcoal-black: #0A0D14;
  --refined-slate-blue-gray: #182230;
  --bright-chalk-white: #D9DCE0;
  --light-slate-gray: #9CA3AF;
  --deep-enterprise-blue: #1565C0;
  --vibrant-teal-cyan: #1FC5BE;
  --muted-coral-salmon: #C76161;
  --soft-mint-green: #A8DDC5;
  --muted-lavender-purple: #8980B3;
  --muted-peach-orange: #E59B8E;

  /* ── Layout & Typography Scale ── */
  --mdp-bg-0: var(--deep-charcoal-black);
  --mdp-bg-1: #111722;
  --mdp-bg-2: var(--refined-slate-blue-gray);
  --mdp-bg-3: #1F2D3F;
  --mdp-bg-4: #27384E;
  --mdp-border: #374E6A;
  --mdp-border-light: #2E425B;
  --mdp-text: var(--bright-chalk-white);
  --mdp-text-secondary: var(--light-slate-gray);
  --mdp-text-muted: #6B7280;
  --mdp-accent: #0da090;
  --mdp-accent-dim: rgba(77, 166, 212, 0.15);
  --mdp-white: #ffffff;
  --mdp-black: #000000;

  /* Standard elevation for cards, dropdowns, and floating elements */
  --mdp-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);

  /* High elevation for modals. Includes a subtle border ring to guarantee separation from the dark background */
  --mdp-shadow-heavy: 0 16px 40px rgba(0, 0, 0, 0.8), 0 0 0 1px var(--mdp-border-light);

  /* Text selection highlight (Based on --deep-enterprise-blue at 40% opacity) */
  --mdp-selection-bg: rgba(21, 101, 192, 0.4);

  /* ── Buttons (Adjusted for white text contrast) ── */
  --mdp-btn-danger-bg: #C62828;
  --mdp-btn-danger-border: #B71C1C;
  --mdp-btn-danger-hover: #D32F2F;

  --mdp-btn-success-bg: #2E7D32;
  --mdp-btn-success-border: #1B5E20;
  --mdp-btn-success-hover: #388E3C;

  --mdp-btn-warning-bg: #D84315; /* Burnt orange to support white text */
  --mdp-btn-warning-border: #BF360C;
  --mdp-btn-warning-hover: #E64A19;

  --mdp-btn-info-bg: #02639A;
  --mdp-btn-info-border: #01436A;
  --mdp-btn-info-hover: #0277BD;

  /* ── Alerts (Deep washes for panel harmony, bright text) ── */
  --mdp-alert-info-bg: #0B1B2B;
  --mdp-alert-info-border: #123E5C;
  --mdp-alert-info-icon-bg: #02639A;
  --mdp-alert-info-color: #29B6F6;

  --mdp-alert-warning-bg: #291C0A;
  --mdp-alert-warning-border: #5C3E14;
  --mdp-alert-warning-icon-bg: #D84315;
  --mdp-alert-warning-color: #FFCA28;

  --mdp-alert-danger-bg: #2C1313;
  --mdp-alert-danger-border: #5C1D1D;
  --mdp-alert-danger-icon-bg: #C62828;
  --mdp-alert-danger-color: #EF5350;

  --mdp-alert-success-bg: #132617;
  --mdp-alert-success-border: #1B4A23;
  --mdp-alert-success-icon-bg: #2E7D32;
  --mdp-alert-success-color: #66BB6A;

  /* ── Destructive actions ── */
  --mdp-destructive-color: #E57373; /* Lightened to pop on dark panels */
  --mdp-destructive-hover-bg: #3B1A1A;
  --mdp-destructive-hover-border: #5C1D1D;
  --mdp-destructive-hover-color: #FF8A80;
  --mdp-danger-accent: #EF5350;

  /* =========================================
   BOOTSTRAP 5 DARK MODE OVERRIDES
   Maps BS5 classes to the --mdp-* palette
   ========================================= */

  /* ── Global Body ── */
  body {
    background-color: var(--mdp-bg-0);
    color: var(--mdp-text);
  }

  /* ── 1. Buttons (.btn-*) ── */
  .btn-primary {
    --bs-btn-color: var(--mdp-text);
    --bs-btn-bg: var(--mdp-btn-primary-bg);
    --bs-btn-border-color: var(--mdp-btn-primary-border);
    --bs-btn-hover-color: var(--mdp-white);
    --bs-btn-hover-bg: var(--mdp-btn-primary-hover);
    --bs-btn-hover-border-color: var(--mdp-btn-primary-bg);
  }

  .btn-secondary {
    --bs-btn-color: var(--mdp-text);
    --bs-btn-bg: var(--mdp-bg-3);
    --bs-btn-border-color: var(--mdp-border);
    --bs-btn-hover-color: var(--mdp-white);
    --bs-btn-hover-bg: var(--mdp-bg-4);
    --bs-btn-hover-border-color: var(--mdp-border-light);
  }

  .btn-success {
    --bs-btn-color: var(--mdp-text);
    --bs-btn-bg: var(--mdp-btn-success-bg);
    --bs-btn-border-color: var(--mdp-btn-success-border);
    --bs-btn-hover-color: var(--mdp-white);
    --bs-btn-hover-bg: var(--mdp-btn-success-hover);
    --bs-btn-hover-border-color: var(--mdp-btn-success-bg);
  }

  .btn-info {
    --bs-btn-color: var(--mdp-text);
    --bs-btn-bg: var(--mdp-btn-info-bg);
    --bs-btn-border-color: var(--mdp-btn-info-border);
    --bs-btn-hover-color: var(--mdp-white);
    --bs-btn-hover-bg: var(--mdp-btn-info-hover);
    --bs-btn-hover-border-color: var(--mdp-btn-info-bg);
  }

  .btn-warning {
    --bs-btn-color: var(--mdp-text);
    --bs-btn-bg: var(--mdp-btn-warning-bg);
    --bs-btn-border-color: var(--mdp-btn-warning-border);
    --bs-btn-hover-color: var(--mdp-white);
    --bs-btn-hover-bg: var(--mdp-btn-warning-hover);
    --bs-btn-hover-border-color: var(--mdp-btn-warning-bg);
  }

  .btn-danger {
    --bs-btn-color: var(--mdp-text);
    --bs-btn-bg: var(--mdp-btn-danger-bg);
    --bs-btn-border-color: var(--mdp-btn-danger-border);
    --bs-btn-hover-color: var(--mdp-white);
    --bs-btn-hover-bg: var(--mdp-btn-danger-hover);
    --bs-btn-hover-border-color: var(--mdp-btn-danger-bg);
  }

  .btn-dark {
    --bs-btn-color: var(--mdp-text);
    --bs-btn-bg: var(--mdp-bg-1);
    --bs-btn-border-color: var(--mdp-bg-0);
    --bs-btn-hover-color: var(--mdp-white);
    --bs-btn-hover-bg: var(--mdp-bg-0);
    --bs-btn-hover-border-color: var(--mdp-black);
  }

  .btn-light {
    --bs-btn-color: var(--mdp-bg-0);
    --bs-btn-bg: var(--mdp-text);
    --bs-btn-border-color: var(--mdp-white);
    --bs-btn-hover-color: var(--mdp-black);
    --bs-btn-hover-bg: var(--mdp-white);
    --bs-btn-hover-border-color: var(--mdp-white);
  }

  .btn-link {
    --bs-btn-color: var(--vibrant-teal-cyan);
    --bs-btn-hover-color: var(--mdp-white);
  }

  /* ── 2. Text Colors (.text-*) ── */
  /* Using alert text variables to ensure WCAG AA contrast against dark panels */
  .text-primary { color: var(--mdp-alert-info-color) !important; }
  .text-secondary { color: var(--mdp-text-secondary) !important; }
  .text-success { color: var(--mdp-alert-success-color) !important; }
  .text-info { color: var(--vibrant-teal-cyan) !important; }
  .text-warning { color: var(--mdp-alert-warning-color) !important; }
  .text-danger { color: var(--mdp-alert-danger-color) !important; }
  .text-light { color: var(--mdp-text) !important; }
  .text-dark { color: var(--mdp-bg-0) !important; }
  .text-white { color: var(--mdp-white) !important; }
  .text-body { color: var(--mdp-text) !important; }
  .text-muted { color: var(--mdp-text-muted) !important; }

  /* ── 3. Background Colors (.bg-*) ── */
  /* Using core button backgrounds for solid fills */
  .bg-primary { background-color: var(--mdp-btn-primary-bg) !important; }
  .bg-secondary { background-color: var(--mdp-bg-3) !important; }
  .bg-success { background-color: var(--mdp-btn-success-bg) !important; }
  .bg-info { background-color: var(--mdp-btn-info-bg) !important; }
  .bg-warning { background-color: var(--mdp-btn-warning-bg) !important; }
  .bg-danger { background-color: var(--mdp-btn-danger-bg) !important; }
  .bg-light { background-color: var(--mdp-text) !important; color: var(--mdp-bg-0) !important; }
  .bg-dark { background-color: var(--mdp-bg-0) !important; }

  color-scheme: dark;
}

/* ── Base ─────────────────────────────────────────────── */
html.mdp-dark body {
  background-color: var(--mdp-bg-0) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark {
  background-color: var(--mdp-bg-0);
}

/* ── Navbar ───────────────────────────────────────────── */
html.mdp-dark .Navbar {
  background-color: var(--mdp-bg-2) !important;
  border-bottom-color: var(--mdp-border) !important;
}

html.mdp-dark .Navbar__logo {
  border-right-color: var(--mdp-border) !important;
}

html.mdp-dark .WicketIcon {
  filter: invert(1) !important;
}

html.mdp-dark .Navbar__menu > li > a {
  color: var(--mdp-text) !important;
}

html.mdp-dark .Navbar__menu > li > a > span {
  border-right-color: var(--mdp-border) !important;
}

html.mdp-dark .Navbar__menu > li.active::after {
  filter: brightness(0.7);
}

html.mdp-dark .Navbar .btn.btn-icon,
html.mdp-dark .Navbar .btn-icon.TypeableResourceForm__action-delete {
  color: var(--mdp-text) !important;
  background: transparent !important;
}

html.mdp-dark .Navbar .btn.btn-icon > .Icon,
html.mdp-dark .Navbar .btn-icon.TypeableResourceForm__action-delete > .Icon {
  color: var(--mdp-white) !important;
}

html.mdp-dark .Navbar__actions {
  border-right-color: var(--mdp-border) !important;
}

html.mdp-dark .Navbar__item--right {
  color: var(--mdp-text) !important;
}

html.mdp-dark .Navbar .AccountSelector + .Navbar__item--right,
html.mdp-dark .Navbar .Navbar__actions + .AccountSelector {
  border-left-color: var(--mdp-border) !important;
}

html.mdp-dark .Navbar__mobile,
html.mdp-dark .Navbar__mobile:focus,
html.mdp-dark .Navbar__mobile:hover {
  border-left-color: var(--mdp-border) !important;
}

html.mdp-dark .Navbar__mobile .dropdown-menu > li {
  background-color: var(--mdp-bg-2) !important;
  border-bottom-color: var(--mdp-border) !important;
}

html.mdp-dark .Navbar__mobile .dropdown-menu > li > a {
  color: var(--mdp-text) !important;
}

html.mdp-dark .Navbar__mobile .dropdown-menu > li > a:active,
html.mdp-dark .Navbar__mobile .dropdown-menu > li > a:focus,
html.mdp-dark .Navbar__mobile .dropdown-menu > li > a:hover {
  background-color: var(--mdp-bg-3) !important;
}

/* ── Search bar ───────────────────────────────────────── */
html.mdp-dark .Navbar__search {
  border-color: var(--mdp-border) !important;
}

html.mdp-dark .Navbar__search .typeahead-filters,
html.mdp-dark .Navbar__search .typeahead-filters-container {
  background-color: var(--mdp-bg-3) !important;
  border-color: var(--mdp-border) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark .Navbar__search .typeahead-filters option {
  background-color: var(--mdp-bg-2);
  color: var(--mdp-text);
}

html.mdp-dark .Navbar__search:focus-within {
  border-color: var(--mdp-accent) !important;
}

html.mdp-dark .Navbar__search .react-typeahead-input {
  background-color: var(--mdp-bg-1) !important;
  color: var(--mdp-text) !important;
  border-color: var(--mdp-border) !important;
}

/* ── Toolbar sidebar ──────────────────────────────────── */
html.mdp-dark .Toolbar {
  background-color: var(--mdp-bg-1) !important;
  border-right-color: var(--mdp-border) !important;
}

html.mdp-dark .Toolbar .btn,
html.mdp-dark .Toolbar .TypeableResourceForm__action-delete,
html.mdp-dark .Toolbar a {
  color: var(--mdp-text-secondary) !important;
}

html.mdp-dark .Toolbar .btn .Icon,
html.mdp-dark .Toolbar .TypeableResourceForm__action-delete .Icon,
html.mdp-dark .Toolbar a .Icon {
  color: var(--mdp-text-secondary) !important;
}

html.mdp-dark .Toolbar .active.TypeableResourceForm__action-delete,
html.mdp-dark .Toolbar .btn.active,
html.mdp-dark .Toolbar .btn:focus,
html.mdp-dark .Toolbar .btn:hover,
html.mdp-dark .Toolbar .TypeableResourceForm__action-delete:focus,
html.mdp-dark .Toolbar .TypeableResourceForm__action-delete:hover,
html.mdp-dark .Toolbar a.active,
html.mdp-dark .Toolbar a:focus,
html.mdp-dark .Toolbar a:hover {
  background-color: var(--mdp-bg-3) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark .Toolbar .btn.Toolbar__toggle,
html.mdp-dark .Toolbar .Toolbar__toggle.TypeableResourceForm__action-delete,
html.mdp-dark .Toolbar a.Toolbar__toggle {
  border-top-color: var(--mdp-border) !important;
}

/* ── Main content ─────────────────────────────────────── */
html.mdp-dark .wkt-content-main {
  color: var(--mdp-text);
}

html.mdp-dark .wkt-app-initializing-card {
  background-color: var(--mdp-bg-2) !important;
  border-color: var(--mdp-border) !important;
  box-shadow: 0 0 8px 0 var(--mdp-shadow) !important;
}

/* ── Cards ─────────────────────────────────────────────── */
html.mdp-dark .card,
html.mdp-dark .card--panel {
  background-color: var(--mdp-bg-2) !important;
  border-color: var(--mdp-border) !important;
  color: var(--mdp-text);
}

html.mdp-dark .card--muted {
  background-color: var(--mdp-bg-3) !important;
}

html.mdp-dark .card--muted .card-header__icon,
html.mdp-dark .card--muted .Icon {
  color: var(--mdp-text-muted) !important;
}

html.mdp-dark .card-header {
  color: var(--mdp-text) !important;
}

html.mdp-dark .card--panel .card-header::after {
  border-top-color: var(--mdp-accent) !important;
}

html.mdp-dark .card__content-divider {
  border-top-color: var(--mdp-border-light) !important;
}

html.mdp-dark .card-header__title {
  color: var(--mdp-text) !important;
}

html.mdp-dark .card-header__subtitle {
  color: var(--mdp-text-secondary) !important;
}

/* ── Tables ────────────────────────────────────────────── */
html.mdp-dark table {
  color: var(--mdp-text) !important;
}

html.mdp-dark table thead tr,
html.mdp-dark table thead th,
html.mdp-dark table thead .columnheader {
  background-color: var(--mdp-bg-3) !important;
  color: var(--mdp-text-secondary) !important;
  border-bottom-color: var(--mdp-border) !important;
}

html.mdp-dark table tbody tr {
  border-bottom-color: var(--mdp-border-light) !important;
}

html.mdp-dark .table-striped > tbody > tr:nth-of-type(odd) {
  background-color: var(--mdp-bg-3) !important;
}

html.mdp-dark table tbody tr:hover,
html.mdp-dark table tbody tr:focus {
  background-color: var(--mdp-bg-3) !important;
}

html.mdp-dark table td,
html.mdp-dark table th {
  border-color: var(--mdp-border-light) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark table a,
html.mdp-dark table td a,
html.mdp-dark table td a:link {
  color: var(--mdp-accent) !important;
}

html.mdp-dark .TablePaginated {
  color: var(--mdp-text) !important;
}

html.mdp-dark .LayoutTable {
  color: var(--mdp-text) !important;
}

/* ── Forms / Inputs ───────────────────────────────────── */
html.mdp-dark .form-control,
html.mdp-dark output {
  background-color: var(--mdp-bg-2) !important;
  border-color: var(--mdp-border) !important;
  color: var(--mdp-text) !important;
  box-shadow: inset 0 1px 1px rgba(0,0,0,0.1) !important;
}

html.mdp-dark .form-control:focus {
  border-color: var(--mdp-accent) !important;
  box-shadow: inset 0 1px 1px rgba(0,0,0,0.2), 0 0 8px var(--mdp-accent-dim) !important;
}

html.mdp-dark .form-control::placeholder {
  color: var(--mdp-text-muted) !important;
}

html.mdp-dark .form-control::-webkit-input-placeholder {
  color: var(--mdp-text-muted) !important;
}

html.mdp-dark .form-control[disabled],
html.mdp-dark .form-control[readonly],
html.mdp-dark fieldset[disabled] .form-control {
  background-color: var(--mdp-bg-3) !important;
  opacity: 0.6;
}

html.mdp-dark input[type="text"],
html.mdp-dark input[type="email"],
html.mdp-dark input[type="password"],
html.mdp-dark input[type="search"],
html.mdp-dark input[type="number"],
html.mdp-dark input[type="url"],
html.mdp-dark input[type="tel"],
html.mdp-dark textarea,
html.mdp-dark select {
  background-color: var(--mdp-bg-2) !important;
  border-color: var(--mdp-border) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark input:focus,
html.mdp-dark textarea:focus,
html.mdp-dark select:focus {
  border-color: var(--mdp-accent) !important;
}

html.mdp-dark label,
html.mdp-dark .control-label {
  color: var(--mdp-text-secondary) !important;
}

html.mdp-dark .Input > .control-label {
  border-color: var(--mdp-border) !important;
}

html.mdp-dark .Input > .control-label:focus {
  border-color: var(--mdp-accent) !important;
}

html.mdp-dark .help-block {
  color: var(--mdp-text-muted) !important;
}

html.mdp-dark .text-muted,
html.mdp-dark .OrderCheckout__footer-text-legal {
  color: var(--mdp-text-muted) !important;
}

/* ── Select (react-select) ────────────────────────────── */
html.mdp-dark .Select-control {
  background-color: var(--mdp-bg-2) !important;
  border-color: var(--mdp-border) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark .Select-placeholder {
  color: var(--mdp-text-muted) !important;
}

html.mdp-dark .Select--single > .Select-control .Select-value {
  color: var(--mdp-text) !important;
}

html.mdp-dark .Select--multi .Select-value {
  background-color: var(--mdp-bg-3) !important;
  border-color: var(--mdp-border) !important;
  color: var(--mdp-accent) !important;
}

html.mdp-dark .has-value.is-pseudo-focused.Select--single > .Select-control .Select-value .Select-value-label,
html.mdp-dark .has-value.Select--single > .Select-control .Select-value .Select-value-label {
  color: var(--mdp-text) !important;
}

html.mdp-dark .Select--multi .Select-value-icon {
  border-right-color: var(--mdp-border) !important;
}

html.mdp-dark .Select-input > input {
  color: var(--mdp-text) !important;
}

html.mdp-dark .Select-menu-outer {
  background-color: var(--mdp-bg-2) !important;
  border-color: var(--mdp-border) !important;
  box-shadow: 0 0 8px 0 var(--mdp-shadow) !important;
}

html.mdp-dark .Select-option {
  color: var(--mdp-text) !important;
  background-color: transparent !important;
}

html.mdp-dark .Select-option:hover,
html.mdp-dark .Select-option.is-focused {
  background-color: var(--mdp-bg-3) !important;
}

html.mdp-dark .Select-option.is-selected {
  background-color: var(--mdp-accent) !important;
  color: var(--mdp-white) !important;
}

html.mdp-dark .Select.is-disabled > .Select-control {
  background-color: var(--mdp-bg-3) !important;
}

html.mdp-dark .Select-clear-zone {
  color: var(--mdp-text-muted) !important;
}

html.mdp-dark .Select-clear-zone:hover {
  color: var(--mdp-danger-accent) !important;
}

html.mdp-dark .Select-arrow {
  border-color: var(--mdp-text-muted) transparent transparent !important;
}

/* ── Buttons ───────────────────────────────────────────── */
html.mdp-dark .btn-default {
  background-color: var(--mdp-bg-3) !important;
  border-color: var(--mdp-border) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark .btn-default:hover,
html.mdp-dark .btn-default:focus {
  background-color: var(--mdp-bg-4) !important;
  border-color: var(--mdp-text-muted) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark .btn-primary {
  background-color: var(--mdp-teal) !important;
  border-color: var(--mdp-teal-dim) !important;
}

html.mdp-dark .btn-primary:link,
html.mdp-dark .btn-primary:visited {
  color: var(--mdp-btn-primary-text) !important;
}

html.mdp-dark .btn-primary:hover,
html.mdp-dark .btn-primary:focus {
  background-color: var(--mdp-btn-primary-hover) !important;
  color: var(--mdp-btn-primary-text) !important;
}

html.mdp-dark .btn-danger {
  background-color: var(--mdp-btn-danger-bg) !important;
  border-color: var(--mdp-btn-danger-border) !important;
  color: var(--mdp-white) !important;
}

html.mdp-dark .btn-danger:hover {
  background-color: var(--mdp-btn-danger-hover) !important;
}

html.mdp-dark .btn-success {
  background-color: var(--mdp-btn-success-bg) !important;
  border-color: var(--mdp-btn-success-border) !important;
  color: var(--mdp-white) !important;
}

html.mdp-dark .btn-success:hover {
  background-color: var(--mdp-btn-success-hover) !important;
}

html.mdp-dark .btn-warning {
  background-color: var(--mdp-btn-warning-bg) !important;
  border-color: var(--mdp-btn-warning-border) !important;
  color: var(--mdp-white) !important;
}

html.mdp-dark .btn-info {
  background-color: var(--mdp-btn-info-bg) !important;
  border-color: var(--mdp-btn-info-border) !important;
  color: var(--mdp-white) !important;
}

html.mdp-dark .btn-link {
  color: var(--mdp-accent) !important;
}

html.mdp-dark .btn-icon.TypeableResourceForm__action-delete,
html.mdp-dark .btn.btn-icon {
  background-color: var(--mdp-bg-3) !important;
  border-right-color: var(--mdp-bg-0) !important;
  border-bottom-color: var(--mdp-bg-0) !important;
  color: var(--mdp-white) !important;
}

html.mdp-dark .btn-icon.TypeableResourceForm__action-delete .Icon,
html.mdp-dark .btn.btn-icon .Icon {
  color: var(--mdp-white) !important;
}

html.mdp-dark .btn-icon--inverted.TypeableResourceForm__action-delete:active,
html.mdp-dark .btn-icon--inverted.TypeableResourceForm__action-delete:focus,
html.mdp-dark .btn-icon--inverted.TypeableResourceForm__action-delete:hover,
html.mdp-dark .btn.btn-icon--inverted:active,
html.mdp-dark .btn.btn-icon--inverted:focus,
html.mdp-dark .btn.btn-icon--inverted:hover {
  background-color: var(--mdp-bg-1) !important;
}

html.mdp-dark .btn-icon-relative.TypeableResourceForm__action-delete,
html.mdp-dark .btn.btn-icon-relative {
  color: var(--mdp-text) !important;
}

html.mdp-dark .btn-label {
  color: var(--mdp-text) !important;
}

/* ── Dropdowns ─────────────────────────────────────────── */
html.mdp-dark .dropdown-menu {
  background-color: var(--mdp-bg-2) !important;
  border-color: var(--mdp-border) !important;
  box-shadow: 0 6px 12px var(--mdp-shadow) !important;
}

html.mdp-dark .dropdown-menu > li > a {
  color: var(--mdp-text) !important;
}

html.mdp-dark .dropdown-menu > li > a:focus,
html.mdp-dark .dropdown-menu > li > a:hover {
  background-color: var(--mdp-bg-3) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark .dropdown-menu > .active > a,
html.mdp-dark .dropdown-menu > .active > a:focus,
html.mdp-dark .dropdown-menu > .active > a:hover {
  background-color: var(--mdp-bg-4) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark .dropdown-menu > .disabled > a {
  color: var(--mdp-text-muted) !important;
}

html.mdp-dark .dropdown-menu .divider {
  background-color: var(--mdp-border) !important;
}

html.mdp-dark .dropdown-item {
  color: var(--mdp-white) !important;
}

/* ── Modals ────────────────────────────────────────────── */
html.mdp-dark .modal-content {
  background-color: var(--mdp-bg-2) !important;
  border-color: var(--mdp-border) !important;
  box-shadow: 0 3px 9px var(--mdp-shadow-heavy) !important;
}

html.mdp-dark .modal-header {
  border-bottom-color: var(--mdp-border) !important;
}

html.mdp-dark .modal-footer {
  border-top-color: var(--mdp-border) !important;
}

html.mdp-dark .modal-backdrop {
  background-color: var(--mdp-black) !important;
}

html.mdp-dark .modal-backdrop.in {
  opacity: 0.6;
}

html.mdp-dark .close {
  color: var(--mdp-text) !important;
  text-shadow: 0 1px 0 var(--mdp-black) !important;
}

/* ── Drawer (sidebar) ─────────────────────────────────── */
html.mdp-dark .drawer-container-sidebar {
  box-shadow: none !important;
}

html.mdp-dark .drawer-container-sidebar--is-open {
  box-shadow: -4px 0 8px var(--mdp-shadow) !important;
}

html.mdp-dark .drawer-container > .card {
  background-color: var(--mdp-bg-2) !important;
}

html.mdp-dark .drawer-container .card-header {
  background-color: var(--mdp-bg-2) !important;
  border-bottom-color: var(--mdp-border) !important;
}

html.mdp-dark .drawer-container__actions > .btn,
html.mdp-dark .drawer-container__actions > .TypeableResourceForm__action-delete {
  background-color: var(--mdp-bg-4) !important;
  border-color: var(--mdp-border) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark .drawer-container__actions > .btn > .Icon,
html.mdp-dark .drawer-container__actions > .TypeableResourceForm__action-delete > .Icon {
  color: var(--mdp-white) !important;
}

html.mdp-dark .drawer-container__actions > .btn:hover,
html.mdp-dark .drawer-container__actions > .TypeableResourceForm__action-delete:hover {
  background-color: var(--mdp-bg-3) !important;
}

html.mdp-dark .drawer-container__actions > .btn.active,
html.mdp-dark .drawer-container__actions > .active.TypeableResourceForm__action-delete {
  background-color: var(--mdp-bg-2) !important;
  border-color: var(--mdp-border) !important;
  color: var(--mdp-accent) !important;
}

/* ── Alerts ────────────────────────────────────────────── */
html.mdp-dark .wkt-alert__info {
  border-color: var(--mdp-alert-info-border) !important;
  background-color: var(--mdp-alert-info-bg) !important;
}

html.mdp-dark .wkt-alert__info .wkt-alert__icon {
  background-color: var(--mdp-alert-info-icon-bg) !important;
}

html.mdp-dark .wkt-alert__info .wkt-alert__icon .Icon {
  color: var(--mdp-alert-info-color) !important;
}

html.mdp-dark .wkt-alert__warning {
  border-color: var(--mdp-alert-warning-border) !important;
  background-color: var(--mdp-alert-warning-bg) !important;
}

html.mdp-dark .wkt-alert__warning .wkt-alert__icon {
  background-color: var(--mdp-alert-warning-icon-bg) !important;
}

html.mdp-dark .wkt-alert__warning .wkt-alert__icon .Icon {
  color: var(--mdp-alert-warning-color) !important;
}

html.mdp-dark .wkt-alert__danger {
  border-color: var(--mdp-alert-danger-border) !important;
  background-color: var(--mdp-alert-danger-bg) !important;
}

html.mdp-dark .wkt-alert__danger .wkt-alert__icon {
  background-color: var(--mdp-alert-danger-icon-bg) !important;
}

html.mdp-dark .wkt-alert__danger .wkt-alert__icon .Icon {
  color: var(--mdp-white) !important;
}

html.mdp-dark .wkt-alert__success {
  border-color: var(--mdp-alert-success-border) !important;
  background-color: var(--mdp-alert-success-bg) !important;
}

html.mdp-dark .wkt-alert__success .wkt-alert__icon {
  background-color: var(--mdp-alert-success-icon-bg) !important;
}

html.mdp-dark .wkt-alert__success .wkt-alert__icon .Icon {
  color: var(--mdp-white) !important;
}

html.mdp-dark .wkt-alert__message {
  color: var(--mdp-text) !important;
}

html.mdp-dark .wkt-alert__message a {
  color: var(--mdp-accent) !important;
}

/* ── Datepicker ───────────────────────────────────────── */
html.mdp-dark .react-datepicker {
  background-color: var(--mdp-bg-2) !important;
  border-color: var(--mdp-border) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark .react-datepicker__header {
  background-color: var(--mdp-bg-3) !important;
  border-bottom-color: var(--mdp-border) !important;
}

html.mdp-dark .react-datepicker__current-month,
html.mdp-dark .react-datepicker-time__header {
  color: var(--mdp-text) !important;
}

html.mdp-dark .react-datepicker__day,
html.mdp-dark .react-datepicker__day-name,
html.mdp-dark .react-datepicker__time-name {
  color: var(--mdp-text) !important;
}

html.mdp-dark .react-datepicker__day:hover {
  background-color: var(--mdp-bg-4) !important;
}

html.mdp-dark .react-datepicker__day--selected,
html.mdp-dark .react-datepicker__day--in-range,
html.mdp-dark .react-datepicker__day--in-selecting-range {
  background-color: var(--mdp-accent) !important;
  color: var(--mdp-white) !important;
}

html.mdp-dark .react-datepicker__day--keyboard-selected {
  background-color: var(--mdp-bg-4) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark .react-datepicker__day--disabled {
  color: var(--mdp-text-muted) !important;
}

html.mdp-dark .react-datepicker__day--disabled:hover {
  background-color: transparent !important;
}

html.mdp-dark .react-datepicker__navigation--previous {
  border-right-color: var(--mdp-text-muted) !important;
}

html.mdp-dark .react-datepicker__navigation--next {
  border-left-color: var(--mdp-text-muted) !important;
}

html.mdp-dark .react-datepicker__time-container .react-datepicker__time {
  background-color: var(--mdp-bg-2) !important;
}

html.mdp-dark .react-datepicker__time-list-item:hover {
  background-color: var(--mdp-bg-3) !important;
}

html.mdp-dark .react-datepicker__time-list-item--selected {
  background-color: var(--mdp-accent) !important;
  color: var(--mdp-white) !important;
}

html.mdp-dark .react-datepicker__time-list-item--disabled {
  color: var(--mdp-text-muted) !important;
}

html.mdp-dark .react-datepicker__month-dropdown,
html.mdp-dark .react-datepicker__year-dropdown {
  background-color: var(--mdp-bg-3) !important;
  border-color: var(--mdp-border) !important;
}

html.mdp-dark .react-datepicker__month-option:hover,
html.mdp-dark .react-datepicker__year-option:hover {
  background-color: var(--mdp-bg-4) !important;
}

html.mdp-dark .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle::before {
  border-bottom-color: var(--mdp-border) !important;
}

html.mdp-dark .react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle::before {
  border-top-color: var(--mdp-border) !important;
}

/* ── Pagination ───────────────────────────────────────── */
html.mdp-dark .pagination > li > a,
html.mdp-dark .pagination > li > span {
  background-color: var(--mdp-bg-2) !important;
  border-color: var(--mdp-border) !important;
  color: var(--mdp-accent) !important;
}

html.mdp-dark .pagination > li > a:hover,
html.mdp-dark .pagination > li > span:hover {
  background-color: var(--mdp-bg-3) !important;
}

html.mdp-dark .pagination > .active > a,
html.mdp-dark .pagination > .active > span {
  background-color: var(--mdp-accent) !important;
  border-color: var(--mdp-accent) !important;
  color: var(--mdp-white) !important;
}

html.mdp-dark .pagination > .disabled > span,
html.mdp-dark .pagination > .disabled > a {
  background-color: var(--mdp-bg-3) !important;
  color: var(--mdp-text-muted) !important;
}

/* ── Badges / Labels / Tags ───────────────────────────── */
html.mdp-dark .badge {
  background-color: var(--mdp-bg-4) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark .label-default {
  background-color: var(--mdp-bg-4) !important;
  color: var(--mdp-text) !important;
}

/* ── Nav tabs / pills ─────────────────────────────────── */
html.mdp-dark .nav-tabs {
  border-bottom-color: var(--mdp-border) !important;
}

html.mdp-dark .nav-tabs > li > a {
  color: var(--mdp-text-secondary) !important;
  border-color: transparent !important;
}

html.mdp-dark .nav-tabs > li > a:hover {
  border-color: var(--mdp-border) var(--mdp-border) var(--mdp-border) !important;
  background-color: var(--mdp-bg-3) !important;
}

html.mdp-dark .nav-tabs > li.active > a,
html.mdp-dark .nav-tabs > li.active > a:focus,
html.mdp-dark .nav-tabs > li.active > a:hover {
  color: var(--mdp-text) !important;
  background-color: var(--mdp-bg-2) !important;
  border-color: var(--mdp-border) var(--mdp-border) transparent !important;
}

html.mdp-dark .nav-pills > li > a {
  color: var(--mdp-text-secondary) !important;
}

html.mdp-dark .nav-pills > li > a:hover {
  background-color: var(--mdp-bg-3) !important;
}

html.mdp-dark .nav-pills > li.active > a,
html.mdp-dark .nav-pills > li.active > a:focus,
html.mdp-dark .nav-pills > li.active > a:hover {
  color: var(--mdp-text) !important;
  background-color: var(--mdp-bg-4) !important;
}

html.mdp-dark .nav > li > a:focus,
html.mdp-dark .nav > li > a:hover {
  background-color: var(--mdp-bg-3) !important;
}

/* ── Property lists ───────────────────────────────────── */
html.mdp-dark .property-list__title {
  color: var(--mdp-text-secondary) !important;
}

html.mdp-dark .property-list__value {
  color: var(--mdp-text) !important;
}

html.mdp-dark .property-list--bordered .property-list__item:not(:last-child) {
  border-bottom-color: var(--mdp-border-light) !important;
}

/* ── Content placeholders (loading shimmer) ───────────── */
html.mdp-dark .content-placeholder {
  background: linear-gradient(90deg, var(--mdp-bg-3) 8%, var(--mdp-bg-4) 18%, var(--mdp-bg-3) 33%) 0 0 / 800px 104px !important;
}

html.mdp-dark .content-placeholder__line {
  background: var(--mdp-bg-2) !important;
}

/* ── Progress bars ────────────────────────────────────── */
html.mdp-dark .wicket-progress {
  background-color: var(--mdp-bg-3) !important;
}

/* ── Breadcrumbs / links ──────────────────────────────── */
html.mdp-dark a,
html.mdp-dark a:link {
  color: var(--mdp-accent) !important;
}

html.mdp-dark a:hover {
  color: var(--mdp-accent) !important;
}

/* ── Scrollbar (Chromium) ─────────────────────────────── */
html.mdp-dark ::-webkit-scrollbar {
  /* scrollbar sizing unchanged — only color overrides below */
}

html.mdp-dark ::-webkit-scrollbar-track {
  background: var(--mdp-bg-1);
}

html.mdp-dark ::-webkit-scrollbar-thumb {
  background: var(--mdp-bg-4);
}

html.mdp-dark ::-webkit-scrollbar-thumb:hover {
  background: var(--mdp-text-muted);
}

/* ── Selection ────────────────────────────────────────── */
html.mdp-dark ::selection {
  background-color: var(--mdp-selection-bg);
  color: var(--mdp-white);
}

/* ── Wells / panels (Bootstrap) ───────────────────────── */
html.mdp-dark .well {
  background-color: var(--mdp-bg-3) !important;
  border-color: var(--mdp-border) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark .panel {
  background-color: var(--mdp-bg-2) !important;
}

html.mdp-dark .panel-heading {
  background-color: var(--mdp-bg-3) !important;
  border-bottom-color: var(--mdp-border) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark .panel-body {
  background-color: var(--mdp-bg-2) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark .panel-footer {
  background-color: var(--mdp-bg-3) !important;
  border-top-color: var(--mdp-border) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark .panel-default {
  border-color: var(--mdp-border) !important;
}

html.mdp-dark .panel-default > .panel-heading {
  background-color: var(--mdp-bg-3) !important;
  border-color: var(--mdp-border) !important;
  color: var(--mdp-text) !important;
}

/* ── List groups ───────────────────────────────────────── */
html.mdp-dark .list-group-item {
  background-color: var(--mdp-bg-2) !important;
  border-color: var(--mdp-border-light) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark .list-group-item:hover,
html.mdp-dark .list-group-item:focus {
  background-color: var(--mdp-bg-3) !important;
}

/* ── Popovers / tooltips ──────────────────────────────── */
html.mdp-dark .popover {
  background-color: var(--mdp-bg-2) !important;
  border-color: var(--mdp-border) !important;
  box-shadow: 0 5px 10px var(--mdp-shadow) !important;
}

html.mdp-dark .popover-title {
  background-color: var(--mdp-bg-3) !important;
  border-bottom-color: var(--mdp-border) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark .popover-content {
  color: var(--mdp-text) !important;
}

html.mdp-dark .tooltip-inner {
  background-color: var(--mdp-bg-4) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark .tooltip.top .tooltip-arrow {
  border-top-color: var(--mdp-bg-4) !important;
}

html.mdp-dark .tooltip.bottom .tooltip-arrow {
  border-bottom-color: var(--mdp-bg-4) !important;
}

html.mdp-dark .tooltip.left .tooltip-arrow {
  border-left-color: var(--mdp-bg-4) !important;
}

html.mdp-dark .tooltip.right .tooltip-arrow {
  border-right-color: var(--mdp-bg-4) !important;
}

/* ── Notifications ─────────────────────────────────────── */
html.mdp-dark .App__notifications .wkt-alert {
  box-shadow: 0 2px 8px var(--mdp-shadow) !important;
}

/* ── hr ────────────────────────────────────────────────── */
html.mdp-dark hr {
  border-top-color: var(--mdp-border) !important;
}

/* ── h1-h6 ─────────────────────────────────────────────── */
html.mdp-dark h1,
html.mdp-dark h2,
html.mdp-dark h3,
html.mdp-dark h4,
html.mdp-dark h5,
html.mdp-dark h6 {
  color: var(--mdp-text) !important;
}

/* ── Dashboard stats ──────────────────────────────────── */
html.mdp-dark .sidebar-subheading {
  color: var(--mdp-text-secondary) !important;
}

/* Stats panel watermark PNG makes card look light — remove it */
html.mdp-dark .stats-panel {
  background-image: none !important;
}

/* ── Search typeahead results ─────────────────────────── */
html.mdp-dark .firstParentOrg {
  background-color: var(--mdp-bg-3) !important;
  color: var(--mdp-text-secondary) !important;
  border-bottom-color: var(--mdp-border) !important;
}

html.mdp-dark .AutoCompleteResult .PersonName,
html.mdp-dark .AutoCompleteResult .title,
html.mdp-dark .AutoCompleteResult .PersonName.title {
  color: var(--mdp-text) !important;
}

html.mdp-dark .AutoCompleteResult .meta {
  color: var(--mdp-text-secondary) !important;
}

html.mdp-dark .AutoCompleteResult {
  color: var(--mdp-text) !important;
}

/* ── Account selector / dropdown in navbar ────────────── */
html.mdp-dark .AccountSelector .dropdown-toggle,
html.mdp-dark .AccountSelector:focus,
html.mdp-dark .AccountSelector:hover {
  color: var(--mdp-text) !important;
}

html.mdp-dark .AccountSelector__toggle:hover,
html.mdp-dark .AccountSelector__toggle:focus {
  background-color: var(--mdp-bg-3) !important;
  color: var(--mdp-text) !important;
}

/* ── Filter chips / tags ──────────────────────────────── */
html.mdp-dark .btn-default.active,
html.mdp-dark .btn-default:active,
html.mdp-dark .open > .btn-default.dropdown-toggle {
  background-color: var(--mdp-bg-4) !important;
  border-color: var(--mdp-text-muted) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark .FilterBarItem {
  background: var(--mdp-bg-2) !important;
}

html.mdp-dark .FilterBarItem__label {
  color: var(--mdp-text) !important;
}

html.mdp-dark .FilterBarItem > button {
  color: var(--mdp-accent) !important;
}

html.mdp-dark .FilterBarItem__btn-clear {
  border-left-color: var(--mdp-border) !important;
  color: var(--mdp-text-secondary) !important;
}

html.mdp-dark .FilterBarItem--clear-all > .btn,
html.mdp-dark .FilterBarItem--clear-all > .TypeableResourceForm__action-delete {
  background-color: var(--mdp-bg-2) !important;
}

/* ── Date input calendar icon ─────────────────────────── */
html.mdp-dark .Input--date::after,
html.mdp-dark .Element--with-icon .form-control .Input--date {
  background: var(--mdp-bg-3) !important;
  color: var(--mdp-text-secondary) !important;
  border-color: var(--mdp-border) !important;
}

/* ── TypeableResourceForm action buttons ──────────────── */
html.mdp-dark .TypeableResourceForm__action-delete {
  background-color: var(--mdp-bg-3) !important;
  border-color: var(--mdp-border) !important;
  color: var(--mdp-destructive-color) !important;
}

html.mdp-dark .TypeableResourceForm__action-delete:hover {
  background-color: var(--mdp-destructive-hover-bg) !important;
  border-color: var(--mdp-destructive-hover-border) !important;
  color: var(--mdp-destructive-hover-color) !important;
}

html.mdp-dark .delete-wrapper {
  background-color: var(--mdp-bg-3) !important;
  border-top: 1px solid var(--mdp-border) !important;
}

html.mdp-dark .FormWizardStep__title {
  background-color: var(--mdp-bg-3) !important;
  border-color: var(--mdp-border) !important;
}

html.mdp-dark .FormWizardStep--active .FormWizardStep__title {
  background-color: var(--mdp-bg-4) !important;
}

/* ── Recharts (Touchpoints chart) ─────────────────────── */
html.mdp-dark .recharts-tooltip-cursor {
  fill: rgba(255, 255, 255, 0.06) !important;
}

html.mdp-dark .recharts-default-tooltip {
  background-color: var(--mdp-bg-2) !important;
  border-color: var(--mdp-border) !important;
  color: var(--mdp-text) !important;
}

html.mdp-dark .recharts-tooltip-label {
  color: var(--mdp-text-secondary) !important;
}

html.mdp-dark .recharts-tooltip-item {
  color: var(--mdp-text) !important;
}

html.mdp-dark .recharts-cartesian-axis-tick-value {
  fill: var(--mdp-text-secondary) !important;
}

html.mdp-dark .recharts-cartesian-grid-horizontal line {
  stroke: var(--mdp-border-light) !important;
}

/* ── Brand teal → accent blue (better dark contrast) ─────── */
html.mdp-dark .card-flex-tabs__item.active {
  color: var(--mdp-accent) !important;
  border-bottom-color: var(--mdp-accent) !important;
  background-color: var(--mdp-accent-dim) !important;
}

html.mdp-dark .Pill__label-icon,
html.mdp-dark .Pill__label-text {
  color: var(--mdp-accent) !important;
}

html.mdp-dark .Tags__icon {
  color: var(--mdp-accent) !important;
}

/* ── Pills (contact info: login, email, phone, etc.) ─────── */
html.mdp-dark .Pill {
  background-color: var(--mdp-bg-3) !important;
  border-color: var(--mdp-border) !important;
}

html.mdp-dark .Pill__label {
  background-color: var(--mdp-bg-4) !important;
  border-color: var(--mdp-border) !important;
}

html.mdp-dark .Pill--info .Pill__label {
  color: var(--mdp-accent) !important;
}

html.mdp-dark .Pill__value a {
  color: var(--mdp-accent) !important;
}

/* ── Primary label (addresses, etc.) ─────────────────────── */
html.mdp-dark .primary-label {
  background-color: var(--mdp-bg-3) !important;
  border-color: var(--mdp-border) !important;
  color: var(--mdp-text-secondary) !important;
}

/* ── Tags / Segment tags ──────────────────────────────────── */
html.mdp-dark .Tag,
html.mdp-dark .Tags__list-item,
html.mdp-dark .Tags__list--pills .Tags__list-item {
  background-color: var(--mdp-bg-4) !important;
  border-color: var(--mdp-border) !important;
  color: var(--mdp-text) !important;
}

/* ── Comments ──────────────────────────────────────────── */
html.mdp-dark .Comment-list__comment--enter-active {
  background-color: var(--mdp-bg-1) !important;
}

/* ── Empty state ──────────────────────────────────────── */
html.mdp-dark .EmptyState__card {
  background-color: var(--mdp-bg-2) !important;
  border-color: var(--mdp-border) !important;
}

html.mdp-dark .instruction-text {
  color: var(--mdp-white) !important;
}

/* ── Iframe (help widget) ──────────────────────────────── */
/* leave as-is to avoid breaking external widget */
`;

  // ── Bootstrap ────────────────────────────────────────────
  // Inject style as early as possible to avoid FOUC
  GM_addStyle(css);

  // Apply class immediately
  if (enabled) {
    document.documentElement.classList.add(CLASS_NAME);
  }

  // Inject toggle once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectToggle);
  } else {
    injectToggle();
  }

  // Re-inject toggle on SPA navigation (React may re-render navbar)
  const observer = new MutationObserver(() => {
    if (!document.getElementById('mdp-dark-toggle')) {
      injectToggle();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('#react-root') || document.body;
    observer.observe(root, { childList: true, subtree: true });
  });
})();
