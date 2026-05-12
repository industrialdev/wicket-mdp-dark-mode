'use strict';

const STORAGE_KEY = 'mdp-dark-enabled';
const CLASS_NAME = 'mdp-dark';

function isLoginPage() {
  if (window.location.protocol !== 'https:') return false;
  if (window.location.pathname !== '/login') return false;
  const { hostname } = window.location;
  return /^.+\.wicketcloud\.com$/.test(hostname);
}

if (!isLoginPage()) {
  let enabled = true;

  // Apply immediately (optimistic default ON) to prevent FOUC
  document.documentElement.classList.add(CLASS_NAME);

  // Sync with stored preference
  chrome.storage.local.get(STORAGE_KEY).then((result) => {
    enabled = result[STORAGE_KEY] !== undefined ? result[STORAGE_KEY] : true;
    document.documentElement.classList.toggle(CLASS_NAME, enabled);
  });

  function applyState() {
    document.documentElement.classList.toggle(CLASS_NAME, enabled);
    const btn = document.getElementById('mdp-dark-toggle');
    if (btn) btn.innerHTML = enabled ? 'light_mode' : 'dark_mode';
  }

  function toggle() {
    enabled = !enabled;
    chrome.storage.local.set({ [STORAGE_KEY]: enabled });
    applyState();
  }

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

    const account = navbar.querySelector('.AccountSelector')
      || navbar.querySelector('.Navbar__item--right');
    if (account) {
      account.parentElement.insertBefore(btn, account);
    } else {
      navbar.appendChild(btn);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectToggle);
  } else {
    injectToggle();
  }

  const observer = new MutationObserver(() => {
    if (!document.getElementById('mdp-dark-toggle')) injectToggle();
  });

  document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('#react-root') || document.body;
    observer.observe(root, { childList: true, subtree: true });
  });
}
