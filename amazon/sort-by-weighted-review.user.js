// ==UserScript==
// @name         Amazon Sort by Weighted Rating
// @namespace    https://github.com/shipit-0fux/userscripts
// @version      0.9
// @description  Adds a sort option to Amazon search results using Bayesian weighted ratings instead of raw star averages.
// @author       zerofux <shipit@zerofux.dev>
// @match        https://*.amazon.com/s*
// @match        https://*.amazon.com/*/s*
// @grant        none
// @run-at       document-end
// @license      MIT
// @homepageURL  https://github.com/shipit-0fux/userscripts
// @supportURL   https://github.com/shipit-0fux/userscripts/issues
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = false;
    function log(...args) {
        if (DEBUG) console.log('[Weighted Sort]', ...args);
    }

    function addSortButton() {
        if (document.getElementById('review-count-sort-btn')) return;

        const sortArea = document.querySelector('.a-dropdown-container');
        if (!sortArea) {
            log("Sort area not found");
            return;
        }

        const button = document.createElement('button');
        button.id = 'review-count-sort-btn';
        button.className = 'a-button-text';
        button.textContent = 'Sort by Weighted Rating';
        button.style.marginLeft = '15px';
        button.style.padding = '8px 10px';
        button.style.border = '1px solid #D5D9D9';
        button.style.borderRadius = '8px';
        button.style.boxShadow = '0 2px 5px 0 rgba(213,217,217,.5)';
        button.style.background = 'linear-gradient(to bottom,#f7f8fa,#e7e9ec)';
        button.style.cursor = 'pointer';
        button.style.fontWeight = 'normal';
        button.style.fontSize = '13px';
        button.style.display = 'inline-block';

        button.addEventListener('mouseover', function() {
            this.style.background = 'linear-gradient(to bottom,#e7e9ec,#f7f8fa)';
            this.style.borderColor = '#a2a6ac';
        });
        button.addEventListener('mouseout', function() {
            this.style.background = 'linear-gradient(to bottom,#f7f8fa,#e7e9ec)';
            this.style.borderColor = '#D5D9D9';
        });
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            sortByWeightedRating();
            return false;
        });

        const parentElement = sortArea.parentNode;
        if (parentElement) {
            parentElement.appendChild(button);
        } else {
            sortArea.insertAdjacentElement('afterend', button);
        }
    }

    function parseReviewCount(text) {
        const cleaned = text.replace(/,/g, '');
        const match = cleaned.match(/^([0-9.]+)k$/i);
        if (match) return Math.floor(parseFloat(match[1]) * 1000);
        return parseInt(cleaned, 10) || 0;
    }

function getReviewData(product) {
    let count = 0;
    let starRating = 0;

    // --- Primary method: new layout with data-cy="reviews-block" ---
    const reviewsBlock = product.querySelector('[data-cy="reviews-block"]');
    if (reviewsBlock) {
        // Star rating from the hidden alt text "4.3 out of 5 stars"
        const altSpan = reviewsBlock.querySelector('span.a-icon-alt');
        if (altSpan) {
            const m = altSpan.textContent.match(/([0-9.]+)\s+out\s+of\s+5/i);
            if (m) starRating = parseFloat(m[1]);
        }

        // Review count from the link's aria-label "2,131 ratings"
        const countLink = reviewsBlock.querySelector('a[aria-label$="ratings"]');
        if (countLink) {
            const ariaLabel = countLink.getAttribute('aria-label') || '';
            const m = ariaLabel.match(/([0-9,]+)\s+ratings/i);
            if (m) count = parseInt(m[1].replace(/,/g, ''), 10) || 0;
        }

        // Fallback: if count is still 0, try the abbreviated span (e.g., "(2.1K)")
        if (count === 0) {
            const countSpan = reviewsBlock.querySelector('span.s-underline-text');
            if (countSpan) {
                const text = countSpan.textContent.trim();
                const match = text.match(/[0-9,.]+[kK]?/);
                if (match) count = parseReviewCount(match[0]);
            }
        }
    }

    // If new method succeeded, return early
    if (count > 0 && starRating > 0) return { count, starRating };

    // --- Fallback: original logic for older page structures ---
    // (the code that was already in your script – kept intact below)

    // Review count fallback
    const reviewsLink = product.querySelector('a[href*="customerReviews"]');
    if (reviewsLink) {
        const text = reviewsLink.textContent.trim();
        const match = text.match(/([0-9,]+\.?[0-9]*k)/i) || text.match(/([0-9,]+)/i);
        if (match) count = parseReviewCount(match[1]);
    }
    if (count === 0) {
        const underlinedTexts = product.querySelectorAll('.a-size-base.s-underline-text');
        for (const el of underlinedTexts) {
            const text = el.textContent.trim();
            if (/^[0-9,]+k?$/i.test(text)) { count = parseReviewCount(text); break; }
        }
    }
    if (count === 0) {
        const allTexts = product.querySelectorAll('.a-row span, .a-section span');
        for (const el of allTexts) {
            const text = el.textContent.trim();
            if (/^[0-9,]+k?$/i.test(text)) { count = parseReviewCount(text); break; }
        }
    }

    // Star rating fallback
    const starEls = product.querySelectorAll('[class*="a-icon-star"], [class*="a-star-"], .a-icon-star-small');
    for (const el of starEls) {
        const aria = el.getAttribute('aria-label') || '';
        const m = aria.match(/([0-9.]+)\s+out\s+of\s+5/i);
        if (m) { starRating = parseFloat(m[1]); break; }
    }
    if (starRating === 0) {
        const spans = product.querySelectorAll('span[aria-label]');
        for (const el of spans) {
            const aria = el.getAttribute('aria-label') || '';
            const m = aria.match(/([0-9.]+)\s+out\s+of\s+5/i);
            if (m) { starRating = parseFloat(m[1]); break; }
        }
    }
    if (starRating === 0) {
        const ratingText = product.querySelectorAll('.a-size-base');
        for (const el of ratingText) {
            const text = el.textContent.trim();
            const m = text.match(/^([1-5]\.[0-9])$/);
            if (m) { starRating = parseFloat(m[1]); break; }
        }
    }

    return { count, starRating };
}



    // Returns { count, starRating } for a product element
     function OLDgetReviewDataOLD(product) {
        let count = 0;
        let starRating = 0;

        // --- Review count ---
        const reviewsLink = product.querySelector('a[href*="customerReviews"]');
        if (reviewsLink) {
            const text = reviewsLink.textContent.trim();
            const match = text.match(/([0-9,]+\.?[0-9]*k)/i) || text.match(/([0-9,]+)/i);

            if (match) count = parseReviewCount(match[1]);
        }

        if (count === 0) {
            const underlinedTexts = product.querySelectorAll('.a-size-base.s-underline-text');
            for (const el of underlinedTexts) {
                const text = el.textContent.trim();
                if (/^[0-9,]+k?$/i.test(text)) {
                    count = parseReviewCount(text);
                    break;
                }
            }
        }

        if (count === 0) {
            const allTexts = product.querySelectorAll('.a-row span, .a-section span');
            for (const el of allTexts) {
                const text = el.textContent.trim();
                if (/^[0-9,]+k?$/i.test(text)) {
                    count = parseReviewCount(text);
                    break;
                }
            }
        }

        // --- Star rating ---
        // Pattern 1: aria-label on star icon e.g. "4.3 out of 5 stars"
        const starEls = product.querySelectorAll('[class*="a-icon-star"], [class*="a-star-"], .a-icon-star-small');
        for (const el of starEls) {
            const aria = el.getAttribute('aria-label') || '';
            const m = aria.match(/([0-9.]+)\s+out\s+of\s+5/i);
            if (m) { starRating = parseFloat(m[1]); break; }
        }

        // Pattern 2: span with aria-label containing "out of 5"
        if (starRating === 0) {
            const spans = product.querySelectorAll('span[aria-label]');
            for (const el of spans) {
                const aria = el.getAttribute('aria-label') || '';
                const m = aria.match(/([0-9.]+)\s+out\s+of\s+5/i);
                if (m) { starRating = parseFloat(m[1]); break; }
            }
        }

        // Pattern 3: text like "4.3" near a rating row
        if (starRating === 0) {
            const ratingText = product.querySelectorAll('.a-size-base');
            for (const el of ratingText) {
                const text = el.textContent.trim();
                const m = text.match(/^([1-5]\.[0-9])$/);
                if (m) { starRating = parseFloat(m[1]); break; }
            }
        }

        return { count, starRating };
    }

    // Bayesian average: (C * m + sum_ratings) / (C + n)
    // sum_ratings = starRating * count  (we only have avg, not individual ratings)
    function bayesianScore(starRating, count, globalMean, C) {
        if (count === 0 || starRating === 0) return 0;
        const sumRatings = starRating * count;
        return (C * globalMean + sumRatings) / (C + count);
    }

    function sortByWeightedRating() {
        showProgressMessage("Computing weighted ratings...");

        try {
            const resultsContainer = document.querySelector('.s-main-slot.s-result-list');
            if (!resultsContainer) {
                hideProgressMessage();
                alert("Could not find the product results container");
                return;
            }

            const products = Array.from(resultsContainer.querySelectorAll('.s-result-item'));
            if (products.length === 0) {
                hideProgressMessage();
                alert("No products found to sort");
                return;
            }

            // Collect raw data
            const productData = products.map((el, index) => {
                const { count, starRating } = getReviewData(el);
                return { element: el, count, starRating, index };
            });

            log('Raw data:', productData.map(p => ({ count: p.count, starRating: p.starRating })));

            // Compute globals — only from products that have both values
            const scored = productData.filter(p => p.count > 0 && p.starRating > 0);
            if (scored.length === 0) {
                hideProgressMessage();
                alert("Could not extract rating data from products on this page.");
                return;
            }

            const globalMean = scored.reduce((sum, p) => sum + p.starRating, 0) / scored.length;
            // C = average review count across scored products (auto-calibrating)
			const counts = scored.map(p => p.count).sort((a, b) => a - b);
			const C = counts[Math.floor(counts.length / 2)];
            log(`Global mean: ${globalMean.toFixed(3)}, C: ${C.toFixed(1)}`);

            // Compute Bayesian score for each product
            productData.forEach(p => {
                p.score = bayesianScore(p.starRating, p.count, globalMean, C);
                p.element.setAttribute('data-bayesian-score', p.score.toFixed(4));
                p.element.setAttribute('data-review-count', p.count);
                p.element.setAttribute('data-star-rating', p.starRating);
            });

            // Inject score badge on each product card
            productData.forEach(p => injectScoreBadge(p));

            // Sort descending by score; products with no data sink to bottom
            productData.sort((a, b) => b.score - a.score);

            // Re-append in sorted order
            productData.forEach(p => {
                p.element.remove();
                resultsContainer.appendChild(p.element);
            });

            hideProgressMessage();
            addSortingIndicator(productData, globalMean, C);

        } catch (err) {
            log('Error during sorting:', err);
            hideProgressMessage();
            alert("An error occurred while sorting: " + err.message);
        }
    }

    function injectScoreBadge(p) {
        // Remove any existing badge
        const existing = p.element.querySelector('.bayesian-score-badge');
        if (existing) existing.remove();

        if (p.score === 0) return;

        const badge = document.createElement('div');
        badge.className = 'bayesian-score-badge';
        badge.style.cssText = `
            display: inline-block;
            background: #232f3e;
            color: #fff;
            font-size: 11px;
            font-family: Arial, sans-serif;
            padding: 2px 7px;
            border-radius: 4px;
            margin: 4px 0 2px 0;
            white-space: nowrap;
        `;
        badge.title = `Bayesian weighted score based on ${p.count} reviews (raw: ${p.starRating}★)`;
        badge.textContent = `Weighted: ${p.score.toFixed(2)}★  (${p.starRating}★, ${p.count.toLocaleString()} reviews)`;

        // Try to insert near the star rating area
        const ratingRow = p.element.querySelector('.a-row.a-size-small, .s-rating-count-component, .a-icon-row');
        if (ratingRow) {
            ratingRow.insertAdjacentElement('afterend', badge);
        } else {
            // Fallback: prepend inside the product info section
            const infoSection = p.element.querySelector('.s-product-image-container, .s-title-instructions-style');
            if (infoSection) infoSection.appendChild(badge);
        }
    }

    function showProgressMessage(message) {
        hideProgressMessage();
        const messageEl = document.createElement('div');
        messageEl.id = 'review-sort-progress';
        messageEl.style.cssText = `
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: #fff; border: 1px solid #ddd;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            padding: 20px; border-radius: 8px; z-index: 9999;
        `;
        messageEl.innerHTML = `
            <div style="text-align:center;">
                <div style="margin-bottom:10px;">${message}</div>
                <div style="width:40px;height:40px;border:4px solid #f3f3f3;border-top:4px solid #3498db;border-radius:50%;margin:0 auto;animation:spin 2s linear infinite;"></div>
            </div>
            <style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>
        `;
        document.body.appendChild(messageEl);
    }

    function hideProgressMessage() {
        const el = document.getElementById('review-sort-progress');
        if (el) el.remove();
    }

    function addSortingIndicator(productData, globalMean, C) {
        const existing = document.getElementById('review-count-sort-indicator');
        if (existing) existing.remove();

        const indicator = document.createElement('div');
        indicator.id = 'review-count-sort-indicator';
        indicator.style.cssText = `
            background: #f0f7fb; padding: 10px 15px; margin-bottom: 15px;
            border-radius: 8px; border: 1px solid #c8e3f9;
            font-size: 14px; color: #2c5282;
            display: flex; align-items: center; justify-content: space-between;
        `;

        const textSpan = document.createElement('span');
        textSpan.style.fontWeight = 'bold';
        textSpan.textContent = `Results sorted by Bayesian weighted rating`;

        const metaSpan = document.createElement('span');
        metaSpan.style.cssText = 'font-size:12px; color:#555; margin-left:12px; font-weight:normal;';
        metaSpan.textContent = `(page mean: ${globalMean.toFixed(2)}★, C=${Math.round(C)} reviews)`;
        textSpan.appendChild(metaSpan);

        if (DEBUG && productData.length > 0) {
            const topScores = productData.slice(0, 5).map(p => p.score.toFixed(2)).join(', ');
            const debugSpan = document.createElement('span');
            debugSpan.style.cssText = 'font-size:11px; color:#888; margin-left:10px;';
            debugSpan.textContent = `Top scores: ${topScores}`;
            textSpan.appendChild(debugSpan);
        }

        indicator.appendChild(textSpan);

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Sort';
        resetButton.style.cssText = `
            padding: 6px 12px; border: 1px solid #d5d9d9;
            border-radius: 8px; background: #fff; cursor: pointer; font-size: 13px;
        `;
        resetButton.addEventListener('click', () => window.location.reload());
        indicator.appendChild(resetButton);

        const resultsArea = document.querySelector('.s-main-slot.s-result-list');
        if (resultsArea && resultsArea.parentNode) {
            resultsArea.parentNode.insertBefore(indicator, resultsArea);
        }
    }

    function init() {
        addSortButton();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 1500));
    } else {
        setTimeout(init, 1500);
    }

    const observer = new MutationObserver(function() {
        if (!document.getElementById('review-count-sort-btn')) {
            if (document.querySelector('.a-dropdown-container')) {
                setTimeout(init, 500);
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();