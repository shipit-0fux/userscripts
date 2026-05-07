// ==UserScript==
// @name         Unhide Diag.net Answers
// @namespace    https://github.com/shipit-0fux/userscripts
// @version      1.0
// @description  Extracts hidden reply content on diag.net and displays it in a readable new tab.
// @author       zerofux <shipit@zerofux.dev>
// @match        https://*.diag.net/*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/shipit-0fux/userscripts
// @supportURL   https://github.com/shipit-0fux/userscripts/issues
// @downloadURL  https://raw.githubusercontent.com/shipit-0fux/userscripts/main/diag.net/unhide-answers.user.js
// @updateURL    https://raw.githubusercontent.com/shipit-0fux/userscripts/main/diag.net/unhide-answers.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Add button
    const btn = document.createElement('button');
    btn.textContent = 'Show Replies';
    Object.assign(btn.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 10000,
        padding: '10px',
        background: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    });
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
        const replies = document.querySelectorAll('.dn-reply-content');
        const output = [];

        replies.forEach(reply => {
            const author = reply.querySelector('.collapsed-reply-author')?.childNodes[0]?.textContent?.trim() || 'Unknown';
            
            const timestampSpan = reply.querySelector('[data-title-prefix="Posted: "]');
            let timestamp = 'Unknown';
            if (timestampSpan) {
                const ts = timestampSpan.getAttribute('data-timestamp');
                if (ts) {
                    const date = new Date(parseInt(ts, 10) * 1000);
                    timestamp = date.toLocaleString();
                }
            }

            const paragraphs = reply.querySelectorAll('.dn-message-body p');
            const message = Array.from(paragraphs).map(p => p.textContent.trim()).join('\n');

            output.push(`From: ${author}\nTime: ${timestamp}\n\n${message}\n\n---\n`);
        });

        const newTab = window.open();
        if (newTab) {
            newTab.document.write('<pre>' + newTab.document.createTextNode(output.join('\n')).textContent + '</pre>');
            newTab.document.close();
        } else {
            alert('Popup blocked. Please allow popups for this site.');
        }
    });
})();
