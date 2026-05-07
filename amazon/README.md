# Amazon Sort by Weighted Rating

A tiny browser script that helps Amazon search results make more sense.

Instead of sorting products by **raw star rating alone**, this script tries to answer:

> “Is this product actually well-reviewed, or does it just have a tiny number of reviews?”

---

## What problem does this solve?

On Amazon, a product with:

* ⭐ **5.0 stars from 3 reviews**

can appear better than:

* ⭐ **4.7 stars from 12,000 reviews**

That’s usually misleading.

This script uses a smarter math method called a **Bayesian weighted rating** to balance:

* how good the reviews are
* AND how many reviews exist

So products with a *large number of consistently good reviews* rise toward the top.

---

# Explain Like I'm 5

Imagine two kids say they make the best cookies.

### Kid A

* Got **5 stars**
* But only **2 people** tasted the cookies

### Kid B

* Got **4.7 stars**
* And **5,000 people** tasted the cookies

Who do you trust more?

Probably Kid B.

This script helps Amazon sort products more like that.

---

# What the script does

When you open Amazon search results:

1. The script adds a new button:
   **“Sort by Weighted Rating”**

2. When clicked, it:

   * Reads every product on the page
   * Finds:

     * star rating
     * number of reviews
   * Calculates a smarter score
   * Re-sorts the products

3. It also adds a small badge showing:

   * weighted score
   * original star rating
   * review count

---

# Example

Instead of this:

| Product               | Stars | Reviews |
| --------------------- | ----- | ------- |
| Cheap Mystery Charger | 5.0★  | 3       |
| Trusted Brand Charger | 4.7★  | 18,421  |

Amazon might normally rank the 5.0★ item higher.

This script usually ranks the trusted product higher because thousands of people liked it.

---

# Features

* Adds a one-click sorting button to Amazon search pages
* Uses Bayesian weighted ratings
* Works with newer and older Amazon layouts
* Handles:

  * normal review counts
  * abbreviated counts like `2.1K`
* Adds visible weighted score badges
* Includes fallback parsing logic when Amazon changes page structure
* Automatically re-adds the button if Amazon dynamically reloads content

---

# How the scoring works

The script uses this formula:

```text
(C * average_rating + product_rating * review_count)
----------------------------------------------------
               (C + review_count)
```

In simple terms:

* Products with very few reviews get “skeptically adjusted”
* Products with lots of reviews earn more trust
* Ratings become more realistic overall

---

# Installation

You need a userscript manager browser extension like:

* [Tampermonkey](https://www.tampermonkey.net/?utm_source=chatgpt.com)
* [Violentmonkey](https://violentmonkey.github.io/?utm_source=chatgpt.com)

Then:

1. Create a new userscript
2. Paste in the script
3. Save
4. Open Amazon search results
5. Click:
   **Sort by Weighted Rating**

---

# Why this is useful

This script is especially helpful for:

* avoiding fake-review junk products
* finding reliable products faster
* comparing popular products more fairly
* reducing “review manipulation” effects

It won’t make Amazon perfect, but it usually produces much better rankings than raw stars alone.

---

# Limitations

Amazon changes their website often.

This script includes fallback logic to survive layout changes, but occasionally Amazon may break parts of it until updated.

Also:

* It only sorts products currently loaded on the page
* It cannot access hidden or unloaded results
* Sponsored products may still appear

---

# License

MIT License

---

# Author

Created by **zerofux**
GitHub: [shipit-0fux/userscripts](https://github.com/shipit-0fux/userscripts?utm_source=chatgpt.com)

