// ==UserScript==
// @name         MDP Dark Mode
// @namespace    https://wicketcloud.com/
// @version      1.1.2
// @updateURL    https://raw.githubusercontent.com/industrialdev/wicket-mdp-dark-mode/main/tampermonkey/mdp-dark.user.js
// @downloadURL  https://raw.githubusercontent.com/industrialdev/wicket-mdp-dark-mode/main/tampermonkey/mdp-dark.user.js
// @description  Dark mode for the Wicket MDP admin panel
// @author       EstebanForge
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
    const btn = document.getElementById('mdp-dark-toggle');
    if (btn) btn.innerHTML = enabled ? 'light_mode' : 'dark_mode';
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
  const css = `/* ═══════════════════════════════════════════════════════════
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
  --mdp-text-muted-light: var(--bright-chalk-white);
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
  --mdp-btn-primary-bg: var(--deep-enterprise-blue);
  --mdp-btn-primary-border: #0F4A90;
  --mdp-btn-primary-hover: #1976D2;

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
  --mdp-btn-info-hover-dark: #00456e;

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
  .text-muted-light { color: var(--mdp-text-muted-light) !important; }

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

  background-color: var(--mdp-bg-0);

  .AccountSelector .dropdown-toggle, .AccountSelector:focus, .AccountSelector:hover {
    color: var(--mdp-text) !important;
  }

  .AccountSelector__toggle:hover, .AccountSelector__toggle:focus {
    background-color: var(--mdp-bg-3) !important;
    color: var(--mdp-text) !important;
  }

  .App__notifications .wkt-alert {
    box-shadow: 0 2px 8px var(--mdp-shadow) !important;
  }

  .AutoCompleteResult {
    color: var(--mdp-text) !important;
  }

  .AutoCompleteResult .meta {
    color: var(--mdp-text-secondary) !important;
  }

  .AutoCompleteResult .PersonName, .AutoCompleteResult .title, .AutoCompleteResult .PersonName.title {
    color: var(--mdp-text) !important;
  }

  .badge {
    background-color: var(--mdp-bg-4) !important;
    color: var(--mdp-text) !important;
  }

  .btn, .TypeableResourceForm__action-delete {
    color: var(--mdp-text-muted-light) !important;
  }

  .btn-danger {
    background-color: var(--mdp-btn-danger-bg) !important;
    border-color: var(--mdp-btn-danger-border) !important;
    color: var(--mdp-white) !important;
  }

  .btn-danger:hover {
    background-color: var(--mdp-btn-danger-hover) !important;
  }

  .btn-default {
    background-color: var(--mdp-bg-3) !important;
    border-color: var(--mdp-border) !important;
    color: var(--mdp-text) !important;
  }

  .btn-default.active, .btn-default:active, .open > .btn-default.dropdown-toggle {
    background-color: var(--mdp-bg-4) !important;
    border-color: var(--mdp-text-muted) !important;
    color: var(--mdp-text) !important;
  }

  .btn-default:hover, .btn-default:focus {
    background-color: var(--mdp-bg-4) !important;
    border-color: var(--mdp-text-muted) !important;
    color: var(--mdp-text) !important;
  }

  .btn-icon--inverted.TypeableResourceForm__action-delete:active, .btn-icon--inverted.TypeableResourceForm__action-delete:focus, .btn-icon--inverted.TypeableResourceForm__action-delete:hover, .btn.btn-icon--inverted:active, .btn.btn-icon--inverted:focus, .btn.btn-icon--inverted:hover {
    background-color: var(--mdp-bg-1) !important;
  }

  .btn-icon-relative.TypeableResourceForm__action-delete, .btn.btn-icon-relative {
    color: var(--mdp-text) !important;
  }

  .btn-icon.TypeableResourceForm__action-delete .Icon, .btn.btn-icon .Icon {
    color: var(--mdp-white) !important;
  }

  .btn-icon.TypeableResourceForm__action-delete, .btn.btn-icon {
    background-color: var(--mdp-bg-3) !important;
    border-right-color: var(--mdp-bg-0) !important;
    border-bottom-color: var(--mdp-bg-0) !important;
    color: var(--mdp-white) !important;
  }

  .btn-info {
    background-color: var(--mdp-btn-info-bg) !important;
    border-color: var(--mdp-btn-info-border) !important;
    color: var(--mdp-white) !important;
  }

  .btn-label {
    color: var(--mdp-text) !important;
  }

  .btn-link {
    color: var(--mdp-accent) !important;
  }

  .btn-primary {
    background-color: var(--mdp-btn-primary-bg) !important;
    border-color: var(--mdp-btn-primary-border) !important;
  }

  .btn-primary:hover, .btn-primary:focus {
    background-color: var(--mdp-btn-info-hover-dark) !important;
    color: var(--mdp-white) !important;
  }

  .btn-primary:link, .btn-primary:visited {
    color: var(--mdp-white) !important;
  }

  .btn-success {
    background-color: var(--mdp-btn-success-bg) !important;
    border-color: var(--mdp-btn-success-border) !important;
    color: var(--mdp-white) !important;
  }

  .btn-success:hover {
    background-color: var(--mdp-btn-success-hover) !important;
  }

  .btn-warning {
    background-color: var(--mdp-btn-warning-bg) !important;
    border-color: var(--mdp-btn-warning-border) !important;
    color: var(--mdp-white) !important;
  }

  .card, .card--panel {
    background-color: var(--mdp-bg-2) !important;
    border-color: var(--mdp-border) !important;
    color: var(--mdp-text);
  }

  .card--muted {
    background-color: var(--mdp-bg-3) !important;
  }

  .card--muted .card-header__icon, .card--muted .Icon {
    color: var(--mdp-text-muted) !important;
  }

  .card--panel .card-header::after {
    border-top-color: var(--mdp-accent) !important;
  }

  .card-flex-tabs__item.active {
    color: var(--mdp-accent) !important;
    border-bottom-color: var(--mdp-accent) !important;
    background-color: var(--mdp-accent-dim) !important;
  }

  .card-header {
    color: var(--mdp-text) !important;
  }

  .card-header__subtitle {
    color: var(--mdp-text-secondary) !important;
  }

  .card-header__title {
    color: var(--mdp-text) !important;
  }

  .card__content-divider {
    border-top-color: var(--mdp-border-light) !important;
  }

  .close {
    color: var(--mdp-text) !important;
    text-shadow: 0 1px 0 var(--mdp-black) !important;
  }

  .Comment-list__comment--enter-active {
    background-color: var(--mdp-bg-1) !important;
  }

  .content-placeholder {
    background: linear-gradient(90deg, var(--mdp-bg-3) 8%, var(--mdp-bg-4) 18%, var(--mdp-bg-3) 33%) 0 0 / 800px 104px !important;
  }

  .content-placeholder__line {
    background: var(--mdp-bg-2) !important;
  }

  .delete-wrapper {
    background-color: var(--mdp-bg-3) !important;
    border-top: 1px solid var(--mdp-border) !important;
  }

  .drawer-container .card-header {
    background-color: var(--mdp-bg-2) !important;
    border-bottom-color: var(--mdp-border) !important;
  }

  .drawer-container > .card {
    background-color: var(--mdp-bg-2) !important;
  }

  .drawer-container-sidebar {
    box-shadow: none !important;
  }

  .drawer-container-sidebar--is-open {
    box-shadow: -4px 0 8px var(--mdp-shadow) !important;
  }

  .drawer-container__actions > .btn > .Icon, .drawer-container__actions > .TypeableResourceForm__action-delete > .Icon {
    color: var(--mdp-white) !important;
  }

  .drawer-container__actions > .btn, .drawer-container__actions > .TypeableResourceForm__action-delete {
    background-color: var(--mdp-bg-4) !important;
    border-color: var(--mdp-border) !important;
    color: var(--mdp-text) !important;
  }

  .drawer-container__actions > .btn.active, .drawer-container__actions > .active.TypeableResourceForm__action-delete {
    background-color: var(--mdp-bg-2) !important;
    border-color: var(--mdp-border) !important;
    color: var(--mdp-accent) !important;
  }

  .drawer-container__actions > .btn:hover, .drawer-container__actions > .TypeableResourceForm__action-delete:hover {
    background-color: var(--mdp-bg-3) !important;
  }

  .dropdown-item {
    color: var(--mdp-white) !important;
  }

  .dropdown-menu {
    background-color: var(--mdp-bg-2) !important;
    border-color: var(--mdp-border) !important;
    box-shadow: 0 6px 12px var(--mdp-shadow) !important;
  }

  .dropdown-menu .divider {
    background-color: var(--mdp-border) !important;
  }

  .dropdown-menu > .active > a, .dropdown-menu > .active > a:focus, .dropdown-menu > .active > a:hover {
    background-color: var(--mdp-bg-4) !important;
    color: var(--mdp-text) !important;
  }

  .dropdown-menu > .disabled > a {
    color: var(--mdp-text-muted) !important;
  }

  .dropdown-menu > li > a {
    color: var(--mdp-text) !important;
  }

  .dropdown-menu > li > a:focus, .dropdown-menu > li > a:hover {
    background-color: var(--mdp-bg-3) !important;
    color: var(--mdp-text) !important;
  }

  .EmptyState__card {
    background-color: var(--mdp-bg-2) !important;
    border-color: var(--mdp-border) !important;
  }

  .ExportSelector .dropdown-toggle .toggle-wrapper {
    background: transparent !important;
  }

  .ExportSelector.open .btn .toggle-wrapper,
  .ExportSelector.open .TypeableResourceForm__action-delete .toggle-wrapper {
    background: transparent !important;
  }

  .FilterBarItem {
    background: var(--mdp-bg-2) !important;
  }

  .FilterBarItem > button {
    color: var(--mdp-accent) !important;
  }

  .FilterBarItem--clear-all > .btn, .FilterBarItem--clear-all > .TypeableResourceForm__action-delete {
    background-color: var(--mdp-bg-2) !important;
  }

  .FilterBarItem__btn-clear {
    border-left-color: var(--mdp-border) !important;
    color: var(--mdp-text-secondary) !important;
  }

  .FilterBarItem__label {
    color: var(--mdp-text) !important;
  }

  .firstParentOrg {
    background-color: var(--mdp-bg-3) !important;
    color: var(--mdp-text-secondary) !important;
    border-bottom-color: var(--mdp-border) !important;
  }

  .form-control, output {
    background-color: var(--mdp-bg-2) !important;
    border-color: var(--mdp-border) !important;
    color: var(--mdp-text) !important;
    box-shadow: inset 0 1px 1px rgba(0,0,0,0.1) !important;
  }

  .form-control::-webkit-input-placeholder {
    color: var(--mdp-text-muted) !important;
  }

  .form-control::placeholder {
    color: var(--mdp-text-muted) !important;
  }

  .form-control:focus {
    border-color: var(--mdp-accent) !important;
    box-shadow: inset 0 1px 1px rgba(0,0,0,0.2), 0 0 8px var(--mdp-accent-dim) !important;
  }

  .form-control[disabled], .form-control[readonly], fieldset[disabled] .form-control {
    background-color: var(--mdp-bg-3) !important;
    opacity: 0.6;
  }

  .FormWizardStep--active .FormWizardStep__title {
    background-color: var(--mdp-bg-4) !important;
  }

  .FormWizardStep__title {
    background-color: var(--mdp-bg-3) !important;
    border-color: var(--mdp-border) !important;
  }

  .FormWizardStep--completed .material-icons {
    color: var(--vibrant-teal-cyan) !important;
  }

  .has-value.is-pseudo-focused.Select--single > .Select-control .Select-value .Select-value-label, .has-value.Select--single > .Select-control .Select-value .Select-value-label {
    color: var(--mdp-text) !important;
  }

  .help-block {
    color: var(--mdp-text-muted) !important;
  }

  .Icon.material-icons {
    color: var(--bright-chalk-white);
  }

  .Input > .control-label {
    border-color: var(--mdp-border) !important;
  }

  .Input:focus-within > .control-label {
    border-color: var(--mdp-accent) !important;
  }

  .Input:focus-within > .form-control {
    border-color: var(--mdp-accent) !important;
    box-shadow: inset 0 1px 1px rgba(0,0,0,0.2), 0 0 8px var(--mdp-accent-dim) !important;
  }

  .Input--date::after, .Element--with-icon .form-control .Input--date {
    background: var(--mdp-bg-3) !important;
    color: var(--mdp-text-secondary) !important;
    border-color: var(--mdp-border) !important;
  }

  .instruction-text {
    color: var(--mdp-white) !important;
  }

  .label-default {
    background-color: var(--mdp-bg-4) !important;
    color: var(--mdp-text) !important;
  }

  .LayoutTable {
    color: var(--mdp-text) !important;
  }

  .list-group-item {
    background-color: var(--mdp-bg-2) !important;
    border-color: var(--mdp-border-light) !important;
    color: var(--mdp-text) !important;
  }

  .list-group-item:hover, .list-group-item:focus {
    background-color: var(--mdp-bg-3) !important;
  }

  .modal-backdrop {
    background-color: var(--mdp-black) !important;
  }

  .modal-backdrop.in {
    opacity: 0.6;
  }

  .modal-content {
    background-color: var(--mdp-bg-2) !important;
    border-color: var(--mdp-border) !important;
    box-shadow: 0 3px 9px var(--mdp-shadow-heavy) !important;
  }

  .modal-footer {
    border-top-color: var(--mdp-border) !important;
  }

  .modal-header {
    border-bottom-color: var(--mdp-border) !important;
  }

  .nav > li > a:focus, .nav > li > a:hover {
    background-color: var(--mdp-bg-3) !important;
  }

  .nav-pills > li > a {
    color: var(--mdp-text-secondary) !important;
  }

  .nav-pills > li > a:hover {
    background-color: var(--mdp-bg-3) !important;
  }

  .nav-pills > li.active > a, .nav-pills > li.active > a:focus, .nav-pills > li.active > a:hover {
    color: var(--mdp-text) !important;
    background-color: var(--mdp-bg-4) !important;
  }

  .nav-tabs {
    border-bottom-color: var(--mdp-border) !important;
  }

  .nav-tabs > li > a {
    color: var(--mdp-text-secondary) !important;
    border-color: transparent !important;
  }

  .nav-tabs > li > a:hover {
    border-color: var(--mdp-border) var(--mdp-border) var(--mdp-border) !important;
    background-color: var(--mdp-bg-3) !important;
  }

  .nav-tabs > li.active > a, .nav-tabs > li.active > a:focus, .nav-tabs > li.active > a:hover {
    color: var(--mdp-text) !important;
    background-color: var(--mdp-bg-2) !important;
    border-color: var(--mdp-border) var(--mdp-border) transparent !important;
  }

  .Navbar {
    background-color: var(--mdp-bg-2) !important;
    border-bottom-color: var(--mdp-border) !important;
  }

  .Navbar .AccountSelector + .Navbar__item--right, .Navbar .Navbar__actions + .AccountSelector {
    border-left-color: var(--mdp-border) !important;
  }

  .Navbar .btn.btn-icon > .Icon, .Navbar .btn-icon.TypeableResourceForm__action-delete > .Icon {
    color: var(--mdp-white) !important;
  }

  .Navbar .btn.btn-icon, .Navbar .btn-icon.TypeableResourceForm__action-delete {
    color: var(--mdp-text) !important;
    background: transparent !important;
  }

  .Navbar__actions {
    border-right-color: var(--mdp-border) !important;
  }

  .Navbar__item--right {
    color: var(--mdp-text) !important;
  }

  .Navbar__logo {
    border-right-color: var(--mdp-border) !important;
  }

  .Navbar__menu > li > a {
    color: var(--mdp-text) !important;
  }

  .Navbar__menu > li > a > span {
    border-right-color: var(--mdp-border) !important;
  }

  .Navbar__menu > li.active::after {
    filter: brightness(0.7);
  }

  .Navbar__mobile .dropdown-menu > li {
    background-color: var(--mdp-bg-2) !important;
    border-bottom-color: var(--mdp-border) !important;
  }

  .Navbar__mobile .dropdown-menu > li > a {
    color: var(--mdp-text) !important;
  }

  .Navbar__mobile .dropdown-menu > li > a:active, .Navbar__mobile .dropdown-menu > li > a:focus, .Navbar__mobile .dropdown-menu > li > a:hover {
    background-color: var(--mdp-bg-3) !important;
  }

  .Navbar__mobile, .Navbar__mobile:focus, .Navbar__mobile:hover {
    border-left-color: var(--mdp-border) !important;
  }

  .Navbar__search {
    border-color: var(--mdp-border) !important;
  }

  .Navbar__search .react-typeahead-input {
    background-color: var(--mdp-bg-1) !important;
    color: var(--mdp-text) !important;
    border-color: var(--mdp-border) !important;
  }

  .Navbar__search .typeahead-filters option {
    background-color: var(--mdp-bg-2);
    color: var(--mdp-text);
  }

  .Navbar__search .typeahead-filters, .Navbar__search .typeahead-filters-container {
    background-color: var(--mdp-bg-3) !important;
    border-color: var(--mdp-border) !important;
    color: var(--mdp-text) !important;
  }

  .Navbar__search:focus-within {
    border-color: var(--mdp-accent) !important;
  }

  .pagination > .active > a, .pagination > .active > span {
    background-color: var(--mdp-accent) !important;
    border-color: var(--mdp-accent) !important;
    color: var(--mdp-white) !important;
  }

  .pagination > .disabled > span, .pagination > .disabled > a {
    background-color: var(--mdp-bg-3) !important;
    color: var(--mdp-text-muted) !important;
  }

  .pagination > li > a, .pagination > li > span {
    background-color: var(--mdp-bg-2) !important;
    border-color: var(--mdp-border) !important;
    color: var(--mdp-accent) !important;
  }

  .pagination > li > a:hover, .pagination > li > span:hover {
    background-color: var(--mdp-bg-3) !important;
  }

  .panel {
    background-color: var(--mdp-bg-2) !important;
  }

  .panel-body {
    background-color: var(--mdp-bg-2) !important;
    color: var(--mdp-text) !important;
  }

  .panel-default {
    border-color: var(--mdp-border) !important;
  }

  .panel-default > .panel-heading {
    background-color: var(--mdp-bg-3) !important;
    border-color: var(--mdp-border) !important;
    color: var(--mdp-text) !important;
  }

  .panel-footer {
    background-color: var(--mdp-bg-3) !important;
    border-top-color: var(--mdp-border) !important;
    color: var(--mdp-text) !important;
  }

  .panel-heading {
    background-color: var(--mdp-bg-3) !important;
    border-bottom-color: var(--mdp-border) !important;
    color: var(--mdp-text) !important;
  }

  .Pill {
    background-color: var(--mdp-bg-3) !important;
    border-color: var(--mdp-border) !important;
  }

  .Pill--info .Pill__label {
    color: var(--mdp-accent) !important;
  }

  .Pill__label {
    background-color: var(--mdp-bg-4) !important;
    border-color: var(--mdp-border) !important;
  }

  .Pill__label-icon, .Pill__label-text {
    color: var(--mdp-accent) !important;
  }

  .Pill__value a {
    color: var(--mdp-accent) !important;
  }

  .popover {
    background-color: var(--mdp-bg-2) !important;
    border-color: var(--mdp-border) !important;
    box-shadow: 0 5px 10px var(--mdp-shadow) !important;
  }

  .popover-content {
    color: var(--mdp-text) !important;
  }

  .popover-title {
    background-color: var(--mdp-bg-3) !important;
    border-bottom-color: var(--mdp-border) !important;
    color: var(--mdp-text) !important;
  }

  .primary-label {
    background-color: var(--mdp-bg-3) !important;
    border-color: var(--mdp-border) !important;
    color: var(--mdp-text-secondary) !important;
  }

  .property-list--bordered .property-list__item:not(:last-child) {
    border-bottom-color: var(--mdp-border-light) !important;
  }

  .property-list__title {
    color: var(--mdp-text-secondary) !important;
  }

  .property-list__value {
    color: var(--mdp-text) !important;
  }

  .react-datepicker {
    background-color: var(--mdp-bg-2) !important;
    border-color: var(--mdp-border) !important;
    color: var(--mdp-text) !important;
  }

  .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle::before {
    border-bottom-color: var(--mdp-border) !important;
  }

  .react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle::before {
    border-top-color: var(--mdp-border) !important;
  }

  .react-datepicker__current-month, .react-datepicker-time__header {
    color: var(--mdp-text) !important;
  }

  .react-datepicker__day, .react-datepicker__day-name, .react-datepicker__time-name {
    color: var(--mdp-text) !important;
  }

  .react-datepicker__day--disabled {
    color: var(--mdp-text-muted) !important;
  }

  .react-datepicker__day--disabled:hover {
    background-color: transparent !important;
  }

  .react-datepicker__day--keyboard-selected {
    background-color: var(--mdp-bg-4) !important;
    color: var(--mdp-text) !important;
  }

  .react-datepicker__day--selected, .react-datepicker__day--in-range, .react-datepicker__day--in-selecting-range {
    background-color: var(--mdp-accent) !important;
    color: var(--mdp-white) !important;
  }

  .react-datepicker__day:hover {
    background-color: var(--mdp-bg-4) !important;
  }

  .react-datepicker__header {
    background-color: var(--mdp-bg-3) !important;
    border-bottom-color: var(--mdp-border) !important;
  }

  .react-datepicker__month-dropdown, .react-datepicker__year-dropdown {
    background-color: var(--mdp-bg-3) !important;
    border-color: var(--mdp-border) !important;
  }

  .react-datepicker__month-option:hover, .react-datepicker__year-option:hover {
    background-color: var(--mdp-bg-4) !important;
  }

  .react-datepicker__navigation--next {
    border-left-color: var(--mdp-text-muted) !important;
  }

  .react-datepicker__navigation--previous {
    border-right-color: var(--mdp-text-muted) !important;
  }

  .react-datepicker__time-container .react-datepicker__time {
    background-color: var(--mdp-bg-2) !important;
  }

  .react-datepicker__time-list-item--disabled {
    color: var(--mdp-text-muted) !important;
  }

  .react-datepicker__time-list-item--selected {
    background-color: var(--mdp-accent) !important;
    color: var(--mdp-white) !important;
  }

  .react-datepicker__time-list-item:hover {
    background-color: var(--mdp-bg-3) !important;
  }

  .recharts-cartesian-axis-tick-value {
    fill: var(--mdp-text-secondary) !important;
  }

  .recharts-cartesian-grid-horizontal line {
    stroke: var(--mdp-border-light) !important;
  }

  .recharts-default-tooltip {
    background-color: var(--mdp-bg-2) !important;
    border-color: var(--mdp-border) !important;
    color: var(--mdp-text) !important;
  }

  .recharts-tooltip-cursor {
    fill: rgba(255, 255, 255, 0.06) !important;
  }

  .recharts-tooltip-item {
    color: var(--mdp-text) !important;
  }

  .recharts-tooltip-label {
    color: var(--mdp-text-secondary) !important;
  }

  .ResourceSummaryCallout {
    background-color: var(--mdp-bg-1) !important;
    color: var(--mdp-white) !important;
    border-color: var(--mdp-destructive-border) !important;
  }

  .Select--multi .Select-value {
    background-color: var(--mdp-bg-3) !important;
    border-color: var(--mdp-border) !important;
    color: var(--mdp-accent) !important;
  }

  .Select--multi .Select-value-icon {
    border-right-color: var(--mdp-border) !important;
  }

  .Select--single > .Select-control .Select-value {
    color: var(--mdp-text) !important;
  }

  .Select-arrow {
    border-color: var(--mdp-text-muted) transparent transparent !important;
  }

  .Select-clear-zone {
    color: var(--mdp-text-muted) !important;
  }

  .Select-clear-zone:hover {
    color: var(--mdp-danger-accent) !important;
  }

  .Select-control {
    background-color: var(--mdp-bg-2) !important;
    border-color: var(--mdp-border) !important;
    color: var(--mdp-text) !important;
  }

  .Select.is-focused .Select-control {
    border-color: var(--mdp-accent) !important;
    box-shadow: inset 0 1px 1px rgba(0,0,0,0.2), 0 0 8px var(--mdp-accent-dim) !important;
  }

  .Select-input > input {
    color: var(--mdp-text) !important;
  }

  .Select-menu-outer {
    background-color: var(--mdp-bg-2) !important;
    border-color: var(--mdp-border) !important;
    box-shadow: 0 0 8px 0 var(--mdp-shadow) !important;
  }

  .Select-option {
    color: var(--mdp-text) !important;
    background-color: transparent !important;
  }

  .Select-option.is-selected {
    background-color: var(--mdp-accent) !important;
    color: var(--mdp-white) !important;
  }

  .Select-option:hover, .Select-option.is-focused {
    background-color: var(--mdp-bg-3) !important;
  }

  .Select-placeholder {
    color: var(--mdp-text-muted) !important;
  }

  .Select.is-disabled > .Select-control {
    background-color: var(--mdp-bg-3) !important;
  }

  .sidebar-subheading {
    color: var(--mdp-text-secondary) !important;
  }

  .stats-panel {
    background-image: none !important;
  }

  .table.table-striped {
    background-color: transparent !important;
  }

  .table-striped > tbody > tr:nth-of-type(odd) {
    background-color: transparent !important;
  }

  .table-striped > tbody > tr:nth-of-type(odd) > td.is-sorting {
    background-color: transparent !important;
  }

  .table-striped > tbody > tr:nth-of-type(2n) > td.is-sorting,
  th.is-sorting {
    background-color: transparent !important;
  }

  .TablePaginated {
    color: var(--mdp-text) !important;
  }

  .Tag, .Tags__list-item, .Tags__list--pills .Tags__list-item {
    background-color: var(--mdp-bg-4) !important;
    border-color: var(--mdp-border) !important;
    color: var(--mdp-text) !important;
  }

  .Tags__icon {
    color: var(--mdp-accent) !important;
  }

  .text-muted, .OrderCheckout__footer-text-legal {
    color: var(--mdp-text-muted-light) !important;
  }

  .Toolbar {
    background-color: var(--mdp-bg-1) !important;
    border-right-color: var(--mdp-border) !important;
  }

  .Toolbar .active.TypeableResourceForm__action-delete, .Toolbar .btn.active, .Toolbar .btn:focus, .Toolbar .btn:hover, .Toolbar .TypeableResourceForm__action-delete:focus, .Toolbar .TypeableResourceForm__action-delete:hover, .Toolbar a.active, .Toolbar a:focus, .Toolbar a:hover {
    background-color: var(--mdp-bg-3) !important;
    color: var(--mdp-text) !important;
  }

  .Toolbar .btn .Icon, .Toolbar .TypeableResourceForm__action-delete .Icon, .Toolbar a .Icon {
    color: var(--mdp-text-secondary) !important;
  }

  .Toolbar .btn, .Toolbar .TypeableResourceForm__action-delete, .Toolbar a {
    color: var(--mdp-text-secondary) !important;
  }

  .Toolbar .btn.Toolbar__toggle, .Toolbar .Toolbar__toggle.TypeableResourceForm__action-delete, .Toolbar a.Toolbar__toggle {
    border-top-color: var(--mdp-border) !important;
  }

  .tooltip-inner {
    background-color: var(--mdp-bg-4) !important;
    color: var(--mdp-text) !important;
  }

  .tooltip.bottom .tooltip-arrow {
    border-bottom-color: var(--mdp-bg-4) !important;
  }

  .tooltip.left .tooltip-arrow {
    border-left-color: var(--mdp-bg-4) !important;
  }

  .tooltip.right .tooltip-arrow {
    border-right-color: var(--mdp-bg-4) !important;
  }

  .tooltip.top .tooltip-arrow {
    border-top-color: var(--mdp-bg-4) !important;
  }

  .TouchpointsOverview__svg {
    color: var(--mdp-accent) !important;
  }

  .TypeableResourceForm__action-delete {
    background-color: var(--mdp-bg-3) !important;
    border-color: var(--mdp-border) !important;
    color: var(--mdp-destructive-color) !important;
  }

  .TypeableResourceForm__action-delete:hover {
    background-color: var(--mdp-destructive-hover-bg) !important;
    border-color: var(--mdp-destructive-hover-border) !important;
    color: var(--mdp-destructive-hover-color) !important;
  }

  .well {
    background-color: var(--mdp-bg-3) !important;
    border-color: var(--mdp-border) !important;
    color: var(--mdp-text) !important;
  }

  .wicket-progress {
    background-color: var(--mdp-bg-3) !important;
  }

  .WicketIcon {
    filter: invert(1) !important;
  }

  .wkt-alert__danger {
    border-color: var(--mdp-alert-danger-border) !important;
    background-color: var(--mdp-alert-danger-bg) !important;
  }

  .wkt-alert__danger .wkt-alert__icon {
    background-color: var(--mdp-alert-danger-icon-bg) !important;
  }

  .wkt-alert__danger .wkt-alert__icon .Icon {
    color: var(--mdp-white) !important;
  }

  .wkt-alert__info {
    border-color: var(--mdp-alert-info-border) !important;
    background-color: var(--mdp-alert-info-bg) !important;
  }

  .wkt-alert__info .wkt-alert__icon {
    background-color: var(--mdp-alert-info-icon-bg) !important;
  }

  .wkt-alert__info .wkt-alert__icon .Icon {
    color: var(--mdp-alert-info-color) !important;
  }

  .wkt-alert__message {
    color: var(--mdp-text) !important;
  }

  .wkt-alert__message a {
    color: var(--mdp-accent) !important;
  }

  .wkt-alert__success {
    border-color: var(--mdp-alert-success-border) !important;
    background-color: var(--mdp-alert-success-bg) !important;
  }

  .wkt-alert__success .wkt-alert__icon {
    background-color: var(--mdp-alert-success-icon-bg) !important;
  }

  .wkt-alert__success .wkt-alert__icon .Icon {
    color: var(--mdp-white) !important;
  }

  .wkt-alert__warning {
    border-color: var(--mdp-alert-warning-border) !important;
    background-color: var(--mdp-alert-warning-bg) !important;
  }

  .wkt-alert__warning .wkt-alert__icon {
    background-color: var(--mdp-alert-warning-icon-bg) !important;
  }

  .wkt-alert__warning .wkt-alert__icon .Icon {
    color: var(--mdp-alert-warning-color) !important;
  }

  .wkt-app-initializing-card {
    background-color: var(--mdp-bg-2) !important;
    border-color: var(--mdp-border) !important;
    box-shadow: 0 0 8px 0 var(--mdp-shadow) !important;
  }

  .wkt-content-main {
    color: var(--mdp-text);
  }

  ::-webkit-scrollbar {
    /* scrollbar sizing unchanged — only color overrides below */
  }

  ::-webkit-scrollbar-thumb {
    background: var(--mdp-bg-4);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--mdp-text-muted);
  }

  ::-webkit-scrollbar-track {
    background: var(--mdp-bg-1);
  }

  ::selection {
    background-color: var(--mdp-selection-bg);
    color: var(--mdp-white);
  }

  a, a:link {
    color: var(--mdp-accent) !important;
  }

  a:hover {
    color: var(--mdp-accent) !important;
  }

  body {
    background-color: var(--mdp-bg-0) !important;
    color: var(--mdp-text) !important;
  }

  h1, h2, h3, h4, h5, h6 {
    color: var(--mdp-text) !important;
  }

  hr {
    border-top-color: var(--mdp-border) !important;
  }

  input:focus, textarea:focus, select:focus {
    border-color: var(--mdp-accent) !important;
  }

  input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="number"], input[type="url"], input[type="tel"], textarea, select {
    background-color: var(--mdp-bg-2) !important;
    border-color: var(--mdp-border) !important;
    color: var(--mdp-text) !important;
  }

  label, .control-label {
    color: var(--mdp-text-secondary) !important;
  }

  legend {
    color: var(--mdp-white) !important;
  }

  table {
    color: var(--mdp-text) !important;
  }

  table a, table td a, table td a:link {
    color: var(--mdp-accent) !important;
  }

  table tbody tr {
    border-bottom-color: var(--mdp-border-light) !important;
  }

  table tbody tr:hover, table tbody tr:focus {
    background-color: var(--mdp-bg-3) !important;
  }

  table td, table th {
    border-color: var(--mdp-border-light) !important;
    color: var(--mdp-text) !important;
  }

  table thead tr, table thead th, table thead .columnheader {
    background-color: var(--mdp-bg-3) !important;
    color: var(--mdp-text-secondary) !important;
    border-bottom-color: var(--mdp-border) !important;
  }

  .table-cell-callout {
    background-color: transparent !important;
  }

}
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
