# userscripts

A collection of browser userscripts for use with [Tampermonkey](https://www.tampermonkey.net/), [Violentmonkey](https://violentmonkey.github.io/), or [Greasemonkey](https://www.greasespot.net/).

## Installation

Click any script's **Raw** button on GitHub — your userscript manager will prompt you to install it.

## Scripts

### Multi-site

| Script | Sites | Install Link | Description |
|--------|-------|--------------|-------------|
| [car-listing-filter.user.js](car-listing-filter.user.js) | [Install](https://raw.githubusercontent.com/shipit-0fux/userscripts/main/car-listing-filter.user.js) | AutoTrader, CarFax, CarGurus, CarMax, Cars.com, Carvana, Hertz Car Sales | Hides unwanted makes/models from search results. Edit `blockedModels` array to customize. |

### Amazon

| Script | Install Link | Description |
|--------|--------------|-------------|
| [amazon/sort-by-weighted-review.user.js](amazon/sort-by-weighted-review.user.js) | [Install](https://raw.githubusercontent.com/shipit-0fux/userscripts/main/amazon/sort-by-weighted-review.user.js) | Adds a sort option to Amazon search results using Bayesian weighted ratings instead of raw star averages. |

### AutoZone

| Script | Install Link | Description |
|--------|--------------|-------------|
| [autozone/order-history-exporter.user.js](autozone/order-history-exporter.user.js) | [Install](https://raw.githubusercontent.com/shipit-0fux/userscripts/main/autozone/order-history-exporter.user.js) |  Adds a button to the AutoZone order history page to export all orders to a CSV file. |

### Claude

> These scripts are third-party works by [lugia19](https://greasyfork.org/en/users/lugia19) hosted here for personal use. Install from [GreasyFork](https://greasyfork.org) for the latest versions.

| Script | Description |
|--------|-------------|
| [claude/usage-tracker.user.js](claude/usage-tracker.user.js) | Tracks claude.ai usage against rate limits. |
| [claude/fork-conversation.user.js](claude/fork-conversation.user.js) | Adds conversation forking/branching to claude.ai. |

### Diag.net

| Script | Install Link | Description |
|--------|--------------|-------------|
| [diag.net/unhide-answers.user.js](diag.net/unhide-answers.user.js) |  [Install](https://raw.githubusercontent.com/shipit-0fux/userscripts/main/diag.net/unhide-answers.user.js) | Extracts hidden reply content and displays it in a readable new tab. |

### Snopes

| Script | Install Link | Description |
|--------|--------------|-------------|
| [snopes/remove-overlay.user.js](snopes/remove-overlay.user.js) |  [Install](https://raw.githubusercontent.com/shipit-0fux/userscripts/main/snopes/remove-overlay.user.js) | Removes ad-block detection overlays that obscure article content. |

## Customization

**car-listing-filter**: Edit the `blockedModels` array near the top of the script to add or remove makes/models. Set `verboseLogging = false` to silence console output.

**autozone/order-history-exporter**: Adjust the `year >= 2020` lower bound in `fetchAndProcessOrders()` to control how far back the export goes.

## License

Scripts I authored are [MIT](LICENSE). Third-party scripts retain their original licenses (see file headers).