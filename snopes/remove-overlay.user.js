// ==UserScript==
// @name         Snopes Overlay Removal
// @namespace    https://github.com/shipit-0fux/userscripts
// @version      1.3
// @description  Removes ad-block detection overlays that obscure article content on Snopes.
// @author       zerofux <shipit@zerofux.dev>
// @match        *://*.snopes.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @homepageURL  https://github.com/shipit-0fux/userscripts
// @supportURL   https://github.com/shipit-0fux/userscripts/issues
// @downloadURL  https://raw.githubusercontent.com/shipit-0fux/userscripts/main/snopes/remove-overlay.user.js
// @updateURL    https://raw.githubusercontent.com/shipit-0fux/userscripts/main/snopes/remove-overlay.user.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Prevent removal of article content
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.removedNodes.forEach((node) => {
                // If article_rail_wrapper is being removed, put it back
                if (node.classList && node.classList.contains('article_rail_wrapper')) {
                    mutation.target.appendChild(node);
                }
            });
        });
    });
    
    // Start observing when DOM is ready
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }
    
    // Also remove any adblock overlays
    setInterval(() => {
        document.querySelectorAll('[id^="abn_"]').forEach(el => el.remove());
        document.querySelectorAll('.adblock_notice').forEach(el => el.remove());
    }, 100);
})();