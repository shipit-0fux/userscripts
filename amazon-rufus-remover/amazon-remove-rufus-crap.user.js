// ==UserScript==
// @name         Amazon Rufus Remover
// @description  Remove Rufus AI panel and fix body layout on Amazon
// @version      0.5
// @author       zerofux <shipit@zerofux.dev>
// @match        https://www.amazon.com/*
// @match        https://amazon.com/*
// @match        https://*.amazon.com/s*
// @match        https://*.amazon.com/*/s*
// @grant        none
// @run-at       document-start
// @inject-into  content
// @license      MIT
// @homepageURL  https://github.com/shipit-0fux/userscripts
// @supportURL   https://github.com/shipit-0fux/userscripts/issues
// ==/UserScript==


(function () {
  'use strict';

  // Static CSS — handles hiding + layout, wins over inline styles via !important
  const style = document.createElement('style');
  style.textContent = `
    [id*="rufus" i], [class*="rufus" i] {
      display: none !important;
    }
    body {
      padding-left: 0 !important;
      --rufus-docked-panel-width: 0px !important;
      --total-rufus-panel-full-width: 0px !important;
      --total-rufus-panel-half-width: 0px !important;
    }
  `;
  document.documentElement.appendChild(style);

  // Strip rufus-* classes from <body> so Amazon's layout rules never apply
  const cleanBody = () => {
    const b = document.body;
    if (!b) return;
    const stripped = [...b.classList].filter(c => !c.toLowerCase().includes('rufus'));
    if (stripped.length !== b.classList.length) {
      b.className = stripped.join(' ');
    }
  };

  // Remove rufus elements outright once DOM is available
  const removeRufus = () => {
    document.querySelectorAll('[id*="rufus" i], [class*="rufus" i]')
      .forEach(el => el !== document.body && el.remove());
    cleanBody();
  };

  // Re-apply on dynamic injection / class re-adds
  const start = () => {
    removeRufus();
    new MutationObserver(removeRufus).observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    });
  };

  if (document.body) {
    start();
  } else {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  }
})();