# Amazon Rufus Remover

Removes the Rufus AI assistant panel from amazon.com and restores the normal page layout.

Amazon's Rufus panel docks to the left side of the page and pushes all content right by ~320px via inline padding on `<body>`. Hiding the panel with a cosmetic ad-blocker rule leaves that padding behind. This script removes the panel elements, strips the `rufus-*` classes from `<body>`, and overrides the layout padding so the page renders as if Rufus never existed.

## What it does

- Injects CSS at `document-start` to hide any element whose `id` or `class` contains "rufus" (case-insensitive), so the panel never flashes on load.
- Removes matching elements from the DOM entirely.
- Strips `rufus-*` classes from `<body>` and zeroes the `--rufus-*` CSS custom properties and left padding that reserve space for the docked panel.
- Uses a `MutationObserver` to re-apply everything when Amazon dynamically re-injects the panel or re-adds body classes during navigation.

## Installation

Install from [Greasy Fork](https://greasyfork.org/en/users/1432282-shipit-0fux) or open `amazon-remove-rufus-crap.user.js` raw from this repo with a userscript manager installed:

- Safari: [Userscripts](https://apps.apple.com/us/app/userscripts/id1463298887)
- Chrome / Edge / Firefox: [Violentmonkey](https://violentmonkey.github.io/) or [Tampermonkey](https://www.tampermonkey.net/)

## Compatibility

- Tested on Safari (macOS) with the Userscripts extension.
- Targets `amazon.com`. To cover other Amazon TLDs, add `@match` lines (e.g. `https://www.amazon.co.uk/*`) to the metadata block.

## Notes

- The `el !== document.body` guard in the removal pass is required: `<body>` itself matches `[class*="rufus"]` when docked classes are present, and removing it would blank the page.
- If you previously added a cosmetic hide rule in a content blocker (1Blocker, AdGuard, etc.) for `#nav-flyout-rufus` or similar, disable it to avoid overlapping behavior.
- Amazon changes markup frequently. If the panel reappears, inspect it and confirm its `id`/`class` still contain "rufus".
