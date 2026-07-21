# Roadmap & Technical Notes

Development leads for SteamPriceCheck, ordered by priority. Each entry lists
its status, the technical approach, and the known blockers.

Legend: 🟢 planned · 🟡 exploring · 🔴 blocked · 💡 idea

---

## 1. Steam desktop client support — 🔴 blocked / 🟡 exploring

**Goal:** show the price comparison inside the Steam client's store, not only
in a regular browser.

**Current state:** dead end via userscript managers. Tampermonkey (regular
and Legacy) crashes Steam's embedded CEF browser (Chromium 126) — known,
unresolved bug ([Tampermonkey#2758](https://github.com/tampermonkey/tampermonkey/issues/2758)).
[Extendium](https://github.com/BossSloth/Extendium) blocklists Tampermonkey
for the same reason.

### Lead A — dedicated browser extension (preferred)

Convert the userscript into a small Manifest V3 extension:

- **Content script** on `store.steampowered.com/app/*`: reads the game name,
  injects the UI (same code as today, minus `GM_xmlhttpRequest`).
- **Background service worker**: performs the cross-origin Algolia queries
  (host permissions bypass page CSP/CORS), talks to the content script via
  `chrome.runtime` messaging.
- **Instant Gaming Referer requirement**: `fetch()` cannot set a `Referer`
  header, but a `declarativeNetRequest` rule (`modifyHeaders` on
  `*-dsn.algolia.net`) can — this replaces Tampermonkey's header override.
- **No `userScripts` API needed** → none of the "Allow User Scripts"
  friction, and potentially loadable inside Steam through
  [Millennium](https://steambrew.app) + Extendium (Extendium lacks
  `chrome.tabs`, which this design does not use).
- Bonus: distributable on the Chrome Web Store / Firefox AMO independently
  of any userscript manager.

### Lead B — native Millennium plugin

Follow the pattern of
[AugmentedSteam-Extension-Plugin](https://github.com/BossSloth/AugmentedSteam-Extension-Plugin):
a Millennium plugin with a Python backend (does the HTTP calls — no CORS or
CSP at all) and a JS frontend injected into the store webview. Steam-client
only; requires users to install Millennium (client mod, at their own risk).

### Lead C — wait for upstream fix

Track [Tampermonkey#2758](https://github.com/tampermonkey/tampermonkey/issues/2758).
If Tampermonkey or Valve fixes the CEF crash, restore the in-client
Tampermonkey tutorial that was removed from the README.

---

## 2. Runtime extraction of the Eneba Algolia key — 🟢 planned

The Eneba public search key is currently hardcoded (it lives in their JS
bundle, not in the page HTML). Make it self-healing like the Instant Gaming
side:

1. Fetch the Eneba store page, locate the bundle URL(s) in the HTML.
2. Fetch the bundle, regex the Algolia app id + search key.
3. Cache the pair with `GM_setValue` (needs the extra `@grant`), refresh only
   when a query returns HTTP 401/403.

Fallback remains the hardcoded pair.

---

## 3. Country & currency selection — 🟢 planned

Everything is currently pinned to the Belgian market (`products_be`, EUR,
BE activation filters) and presented as "EU". Leads:

- Auto-detect the country from the browser locale region (`fr-BE` → BE,
  `de-AT` → AT…) and query the matching Eneba index (`products_at`, …) and
  IG `country_whitelist` filter.
- Per-country currency (Eneba indexes expose `lowestPrice.<CUR>`; IG hits
  expose `currency_prices.<CUR>`).
- A small settings UI (see §5) to override the detected country.
- Validate that each `products_<cc>` index actually exists before rollout.

---

## 4. More merchants & aggregators — 🟡 exploring

Candidates, each needs the same vetting as Eneba/IG (public search API?
region + platform + key/account fields? stock signal?):

- **Kinguin, GAMIVO, K4G, Difmark** — marketplaces; strict account/region
  filtering mandatory (same rules as Eneba).
- **CDKeys** — first-party shop, no marketplace risk; check for an Algolia
  or similar search endpoint.
- **Aggregator route:** [IsThereAnyDeal](https://docs.isthereanydeal.com/)
  has an official API covering many official stores — one integration,
  dozens of shops. Requires an API key (rate limits acceptable for a
  userscript); would complement rather than replace the key-shop scrapers.
- Show an optional "official stores" line (ITAD data) next to the key-shop
  line, so users see both worlds.

---

## 5. Settings panel — 💡 idea

Via `GM_registerMenuCommand` (Tampermonkey menu) or a small gear icon in the
injected box:

- toggle merchants on/off;
- region strictness (strict EU list vs. anything BE-activatable);
- cache TTL;
- UI language override (currently follows the browser);
- country override (see §3).

Persist with `GM_setValue`/`GM_getValue`.

---

## 6. Per-edition comparison — 💡 idea

Steam pages often have several purchase blocks (Standard / Deluxe / bundle).
Today the script injects one box above the first block and compares the base
game. Lead: parse each `.game_area_purchase_game` title, run one comparison
per edition (the fuzzy matcher already handles edition tokens), and inject a
compact line above each block. Watch out for request volume — batch the
Algolia queries (both APIs accept multi-query requests).

---

## 7. DLC page support — 💡 idea

DLC store pages work today only when the DLC title matches cleanly. Lead:
detect the DLC context (`.game_area_dlc_bubble` on the page), and if so allow
`productType: "dlc"` matches on Eneba (currently implicit) and relax the
sequel-number guard for numbered DLC packs.

---

## 8. Distribution & quality — 🟢 planned

- Publish on **GreasyFork** and **OpenUserJS** for discoverability
  (auto-updates already work via `@updateURL` pointing to this repo).
- GitHub Action: ESLint pass + check that `@version` was bumped whenever
  `steam-price-check.user.js` changes (auto-update silently breaks
  otherwise).
- Screenshot/GIF of the injected UI in the README.
