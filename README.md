# SteamPriceCheck

**[English](#english)** | **[Français](#français)**

A userscript that compares the official Steam price with the best **Steam keys
activatable in Europe** on **Eneba** and **Instant Gaming**, right on the Steam
store page.

> **[➜ Install in one click](https://github.com/IAmRom1/SteamPriceCheck/raw/main/steam-price-check.user.js)**
> *(requires Tampermonkey or Violentmonkey — see tutorial below)*

---

## English

### What it does

On every Steam game page (`store.steampowered.com/app/*`), the script searches
Eneba and Instant Gaming for the same game and shows, above the purchase block:

- the **cheapest merchant**, its price and a direct link to the product page;
- the other merchant's price for comparison;
- how much you save compared to the Steam price;
- an **"Out of stock"** notice when a key exists but is sold out (a red banner
  if both merchants are out of stock).

Strict filtering — an offer is only shown if it is:

| Check | Rule |
|---|---|
| Platform | Steam key only (no GOG / Xbox / PSN versions) |
| Format | a **key/code** — anything sold as an "account" is rejected |
| Region | activatable in the EU (Europe / Global / Worldwide / EMEA) |
| Right game | fuzzy title matching so *Hades* never matches *Hades II*, DLCs are never confused with the base game, etc. |

The interface follows your **browser language** (23 languages: en, fr, de, es,
it, pt, nl, pl, cs, sk, sv, da, no, fi, hu, ro, el, tr, ru, uk, ja, ko, zh —
falls back to English). Merchant links open the localized version of each shop
when it exists.

### Installation (browser)

1. Install a userscript manager:
   - **[Tampermonkey](https://www.tampermonkey.net/)** (Chrome, Edge, Firefox, Opera, Safari)
   - or **[Violentmonkey](https://violentmonkey.github.io/)** (Chrome, Edge, Firefox)

   > **Chrome/Edge note:** recent versions require enabling **Developer mode**
   > (or the "Allow user scripts" toggle) in `chrome://extensions` for
   > Tampermonkey to run scripts.

2. Click the one-click install link:

   **https://github.com/IAmRom1/SteamPriceCheck/raw/main/steam-price-check.user.js**

   Tampermonkey opens an installation tab — click **Install**.

3. Open any Steam game page. On first run, allow the script to access
   `instant-gaming.com` / `algolia.net` when Tampermonkey asks.

### Installation (Steam desktop client)

You can run the script directly inside the Steam client's built-in browser:

1. In the Steam client **store**, **middle-click** (mouse-wheel click) any
   game — a browser window opens.
2. Click the **+** next to the page tab to open a new tab.
3. In the address bar, remove `https://www.startpage.com/` and enter:

   `https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo`

4. Install the Tampermonkey extension.
5. Open a new tab and enter the script install URL:

   `https://github.com/IAmRom1/SteamPriceCheck/raw/main/steam-price-check.user.js`

6. Confirm the installation in Tampermonkey. The price comparison now shows up
   on store pages inside the Steam client.

### How it works

Both merchants' search pages are rendered client-side (their HTML contains no
results), but both are powered by **Algolia** with public search keys:

- **Instant Gaming**: the Algolia config is re-extracted at runtime from its
  own search page (self-healing if the key rotates), with a hardcoded
  fallback. Product data comes as structured JSON (platform, region, country
  whitelist, stock, price).
- **Eneba**: country-specific Algolia index with structured fields (DRM,
  regions, stock, price in euro cents).

Filtering is applied twice: server-side through Algolia `filters`, then
client-side field by field. `GM_xmlhttpRequest` is required because Steam's
CSP blocks any third-party `fetch` from the page. Internally the engine
queries the Belgian market index — keys valid in Belgium are by construction
EU-activatable (Europe / Global / EMEA regions only are accepted).

Results are cached for 30 minutes per game (sessionStorage).

### Maintenance

- **Eneba stops responding (HTTP 4xx)**: their public Algolia key probably
  rotated. Grab the new one from the Network tab on eneba.com (request to
  `*-dsn.algolia.net`) and update `CONFIG.ENEBA`.
- **IG stops responding**: the fallback key in `CONFIG.IG.fallback` may be
  stale *and* the runtime extraction failed — check the format of
  `window.algoliaConfig` on their search page.
- Matching threshold: `CONFIG.MATCH_THRESHOLD` (default 0.6).

### License

[MIT](LICENSE) — developed by [IAmRom1](https://github.com/IAmRom1).

---

## Français

### Ce que fait le script

Sur chaque page de jeu Steam (`store.steampowered.com/app/*`), le script
cherche le même jeu sur Eneba et Instant Gaming et affiche, au-dessus du bloc
d'achat :

- le **marchand le moins cher**, son prix et un lien direct vers la fiche
  produit ;
- le prix de l'autre marchand pour comparaison ;
- l'économie réalisée par rapport au prix Steam ;
- la mention **« Hors stock »** quand une clé existe mais est épuisée (bandeau
  rouge si les deux marchands sont en rupture).

Filtrage strict — une offre n'est affichée que si elle est :

| Vérification | Règle |
|---|---|
| Plateforme | clé Steam uniquement (pas de versions GOG / Xbox / PSN) |
| Format | une **clé/un code** — tout produit vendu comme « compte » est rejeté |
| Région | activable dans l'UE (Europe / Global / Worldwide / EMEA) |
| Bon jeu | matching flou des titres : *Hades* ne matche jamais *Hades II*, un DLC n'est jamais confondu avec le jeu de base, etc. |

L'interface suit la **langue du navigateur** (23 langues : en, fr, de, es, it,
pt, nl, pl, cs, sk, sv, da, no, fi, hu, ro, el, tr, ru, uk, ja, ko, zh — repli
anglais sinon). Les liens marchands ouvrent la version localisée de chaque
boutique quand elle existe.

### Installation (navigateur)

1. Installez un gestionnaire de userscripts :
   - **[Tampermonkey](https://www.tampermonkey.net/)** (Chrome, Edge, Firefox, Opera, Safari)
   - ou **[Violentmonkey](https://violentmonkey.github.io/)** (Chrome, Edge, Firefox)

   > **Note Chrome/Edge :** les versions récentes exigent d'activer le
   > **mode développeur** (ou l'option « Autoriser les scripts utilisateur »)
   > dans `chrome://extensions` pour que Tampermonkey fonctionne.

2. Cliquez sur le lien d'installation en 1 clic :

   **https://github.com/IAmRom1/SteamPriceCheck/raw/main/steam-price-check.user.js**

   Tampermonkey ouvre un onglet d'installation — cliquez sur **Installer**.

3. Ouvrez n'importe quelle page de jeu Steam. À la première exécution,
   autorisez l'accès à `instant-gaming.com` / `algolia.net` quand Tampermonkey
   le demande.

### Installation (client Steam de bureau)

Le script peut tourner directement dans le navigateur intégré du client
Steam :

1. Dans le **magasin** du client Steam, faites un **clic molette** sur
   n'importe quel jeu — une fenêtre de navigateur s'ouvre.
2. Cliquez sur le **+** à côté de l'onglet de la page pour ouvrir un nouvel
   onglet.
3. Dans la barre d'adresse, retirez `https://www.startpage.com/` et entrez :

   `https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo`

4. Installez l'extension Tampermonkey.
5. Ouvrez un nouvel onglet et entrez l'URL d'installation du script :

   `https://github.com/IAmRom1/SteamPriceCheck/raw/main/steam-price-check.user.js`

6. Confirmez l'installation dans Tampermonkey. Le comparateur apparaît
   désormais sur les pages du magasin, directement dans le client Steam.

### Fonctionnement

Les pages de recherche des deux marchands sont rendues côté client (leur HTML
ne contient aucun résultat), mais les deux boutiques reposent sur **Algolia**
avec des clés de recherche publiques :

- **Instant Gaming** : la config Algolia est ré-extraite à chaque exécution
  depuis sa propre page de recherche (auto-réparation si la clé change), avec
  un repli codé en dur. Les données produit arrivent en JSON structuré
  (plateforme, région, liste de pays, stock, prix).
- **Eneba** : index Algolia par pays avec champs structurés (DRM, régions,
  stock, prix en centimes d'euro).

Le filtrage est appliqué deux fois : côté serveur via les `filters` Algolia,
puis côté client champ par champ. `GM_xmlhttpRequest` est indispensable car le
CSP de Steam bloque tout `fetch` tiers depuis la page. En interne, le moteur
interroge l'index du marché belge — une clé valable en Belgique est par
construction activable dans l'UE (seules les régions Europe / Global / EMEA
sont acceptées).

Les résultats sont mis en cache 30 minutes par jeu (sessionStorage).

### Maintenance

- **Eneba ne répond plus (HTTP 4xx)** : leur clé Algolia publique a
  probablement tourné. Récupérez la nouvelle dans l'onglet Réseau sur
  eneba.com (requête vers `*-dsn.algolia.net`) et mettez à jour
  `CONFIG.ENEBA`.
- **IG ne répond plus** : la clé de repli de `CONFIG.IG.fallback` est
  peut-être périmée *et* l'extraction à chaud a échoué — vérifiez le format de
  `window.algoliaConfig` sur leur page de recherche.
- Seuil de matching : `CONFIG.MATCH_THRESHOLD` (0,6 par défaut).

### Licence

[MIT](LICENSE) — développé par [IAmRom1](https://github.com/IAmRom1).
