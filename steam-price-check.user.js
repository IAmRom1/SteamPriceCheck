// ==UserScript==
// @name         Steam PriceCheck — Eneba & Instant Gaming (Clés Steam EU)
// @namespace    https://github.com/IAmRom1/SteamPriceCheck
// @version      1.2.2
// @description  Sur chaque page de jeu Steam, compare le prix officiel avec les meilleures CLÉS Steam activables en Europe (EU/Global/EMEA) sur Eneba et Instant Gaming, et affiche le résultat au-dessus du bloc d'achat. Interface traduite en 23 langues (langue du navigateur).
// @author       IAmRom1
// @homepageURL  https://github.com/IAmRom1/SteamPriceCheck
// @supportURL   https://github.com/IAmRom1/SteamPriceCheck/issues
// @updateURL    https://github.com/IAmRom1/SteamPriceCheck/raw/main/steam-price-check.user.js
// @downloadURL  https://github.com/IAmRom1/SteamPriceCheck/raw/main/steam-price-check.user.js
// @match        https://store.steampowered.com/app/*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      instant-gaming.com
// @connect      algolia.net
// @connect      algolianet.com
// @connect      eneba.com
// @run-at       document-idle
// @noframes
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  // --- i18n ---

  const I18N = {
    en: { header: 'Steam key price check — Eneba · Instant Gaming', loading: 'Checking prices… (Steam keys activatable in Europe)', keyTag: 'Steam Key', btnOffer: 'View deal', linkOffer: 'view deal', viewPage: 'view product page', outOfStock: 'Out of stock', noKey: 'no eligible Steam key (EU region)', unavailable: 'unavailable', bothOOS: 'Out of stock at both IG and Eneba', vsSteam: 'vs Steam', by: 'developed by' },
    fr: { header: 'Comparateur de clés Steam — Eneba · Instant Gaming', loading: 'Analyse des prix en cours… (clés Steam activables en Europe)', keyTag: 'Clé Steam', btnOffer: "Voir l'offre", linkOffer: "voir l'offre", viewPage: 'voir la fiche', outOfStock: 'Hors stock', noKey: 'aucune clé Steam conforme (région EU)', unavailable: 'indisponible', bothOOS: 'Rupture de stock sur IG et Eneba', vsSteam: 'vs Steam', by: 'développé par' },
    de: { header: 'Steam-Key-Preisvergleich — Eneba · Instant Gaming', loading: 'Preise werden geprüft… (in Europa aktivierbare Steam-Keys)', keyTag: 'Steam-Key', btnOffer: 'Zum Angebot', linkOffer: 'zum Angebot', viewPage: 'Produktseite ansehen', outOfStock: 'Nicht vorrätig', noKey: 'kein passender Steam-Key (EU-Region)', unavailable: 'nicht erreichbar', bothOOS: 'Bei IG und Eneba ausverkauft', vsSteam: 'ggü. Steam', by: 'entwickelt von' },
    es: { header: 'Comparador de claves de Steam — Eneba · Instant Gaming', loading: 'Analizando precios… (claves de Steam activables en Europa)', keyTag: 'Clave Steam', btnOffer: 'Ver oferta', linkOffer: 'ver oferta', viewPage: 'ver ficha', outOfStock: 'Sin stock', noKey: 'ninguna clave de Steam válida (región UE)', unavailable: 'no disponible', bothOOS: 'Sin stock en IG y Eneba', vsSteam: 'vs Steam', by: 'desarrollado por' },
    it: { header: 'Comparatore di chiavi Steam — Eneba · Instant Gaming', loading: 'Analisi dei prezzi in corso… (chiavi Steam attivabili in Europa)', keyTag: 'Chiave Steam', btnOffer: "Vedi l'offerta", linkOffer: "vedi l'offerta", viewPage: 'vedi la scheda', outOfStock: 'Esaurito', noKey: 'nessuna chiave Steam idonea (regione UE)', unavailable: 'non disponibile', bothOOS: 'Esaurito su IG ed Eneba', vsSteam: 'vs Steam', by: 'sviluppato da' },
    pt: { header: 'Comparador de chaves Steam — Eneba · Instant Gaming', loading: 'A analisar preços… (chaves Steam ativáveis na Europa)', keyTag: 'Chave Steam', btnOffer: 'Ver oferta', linkOffer: 'ver oferta', viewPage: 'ver página', outOfStock: 'Sem stock', noKey: 'nenhuma chave Steam elegível (região UE)', unavailable: 'indisponível', bothOOS: 'Sem stock na IG e na Eneba', vsSteam: 'vs Steam', by: 'desenvolvido por' },
    nl: { header: 'Steam-key prijsvergelijker — Eneba · Instant Gaming', loading: 'Prijzen worden gecontroleerd… (Steam-keys activeerbaar in Europa)', keyTag: 'Steam-key', btnOffer: 'Bekijk aanbieding', linkOffer: 'bekijk aanbieding', viewPage: 'bekijk pagina', outOfStock: 'Niet op voorraad', noKey: 'geen geschikte Steam-key (EU-regio)', unavailable: 'niet bereikbaar', bothOOS: 'Uitverkocht bij IG en Eneba', vsSteam: 'vs Steam', by: 'ontwikkeld door' },
    pl: { header: 'Porównywarka kluczy Steam — Eneba · Instant Gaming', loading: 'Sprawdzanie cen… (klucze Steam do aktywacji w Europie)', keyTag: 'Klucz Steam', btnOffer: 'Zobacz ofertę', linkOffer: 'zobacz ofertę', viewPage: 'zobacz stronę', outOfStock: 'Brak w magazynie', noKey: 'brak odpowiedniego klucza Steam (region UE)', unavailable: 'niedostępny', bothOOS: 'Brak w magazynie w IG i Eneba', vsSteam: 'vs Steam', by: 'stworzone przez' },
    cs: { header: 'Srovnávač Steam klíčů — Eneba · Instant Gaming', loading: 'Kontrola cen… (Steam klíče aktivovatelné v Evropě)', keyTag: 'Steam klíč', btnOffer: 'Zobrazit nabídku', linkOffer: 'zobrazit nabídku', viewPage: 'zobrazit stránku', outOfStock: 'Vyprodáno', noKey: 'žádný vyhovující Steam klíč (region EU)', unavailable: 'nedostupné', bothOOS: 'Vyprodáno na IG i Eneba', vsSteam: 'vs Steam', by: 'vytvořil' },
    sk: { header: 'Porovnávač Steam kľúčov — Eneba · Instant Gaming', loading: 'Kontrola cien… (Steam kľúče aktivovateľné v Európe)', keyTag: 'Steam kľúč', btnOffer: 'Zobraziť ponuku', linkOffer: 'zobraziť ponuku', viewPage: 'zobraziť stránku', outOfStock: 'Vypredané', noKey: 'žiadny vyhovujúci Steam kľúč (región EÚ)', unavailable: 'nedostupné', bothOOS: 'Vypredané na IG aj Eneba', vsSteam: 'vs Steam', by: 'vytvoril' },
    sv: { header: 'Prisjämförelse för Steam-nycklar — Eneba · Instant Gaming', loading: 'Kontrollerar priser… (Steam-nycklar aktiverbara i Europa)', keyTag: 'Steam-nyckel', btnOffer: 'Se erbjudandet', linkOffer: 'se erbjudandet', viewPage: 'se produktsidan', outOfStock: 'Slut i lager', noKey: 'ingen giltig Steam-nyckel (EU-region)', unavailable: 'otillgänglig', bothOOS: 'Slut i lager hos IG och Eneba', vsSteam: 'vs Steam', by: 'utvecklad av' },
    da: { header: 'Prissammenligning af Steam-nøgler — Eneba · Instant Gaming', loading: 'Tjekker priser… (Steam-nøgler der kan aktiveres i Europa)', keyTag: 'Steam-nøgle', btnOffer: 'Se tilbuddet', linkOffer: 'se tilbuddet', viewPage: 'se produktsiden', outOfStock: 'Udsolgt', noKey: 'ingen gyldig Steam-nøgle (EU-region)', unavailable: 'utilgængelig', bothOOS: 'Udsolgt hos IG og Eneba', vsSteam: 'vs Steam', by: 'udviklet af' },
    no: { header: 'Prissammenligning av Steam-nøkler — Eneba · Instant Gaming', loading: 'Sjekker priser… (Steam-nøkler som kan aktiveres i Europa)', keyTag: 'Steam-nøkkel', btnOffer: 'Se tilbudet', linkOffer: 'se tilbudet', viewPage: 'se produktsiden', outOfStock: 'Utsolgt', noKey: 'ingen gyldig Steam-nøkkel (EU-region)', unavailable: 'utilgjengelig', bothOOS: 'Utsolgt hos IG og Eneba', vsSteam: 'vs Steam', by: 'utviklet av' },
    fi: { header: 'Steam-avainten hintavertailu — Eneba · Instant Gaming', loading: 'Tarkistetaan hintoja… (Euroopassa aktivoitavat Steam-avaimet)', keyTag: 'Steam-avain', btnOffer: 'Katso tarjous', linkOffer: 'katso tarjous', viewPage: 'katso tuotesivu', outOfStock: 'Loppuunmyyty', noKey: 'ei sopivaa Steam-avainta (EU-alue)', unavailable: 'ei saatavilla', bothOOS: 'Loppuunmyyty sekä IG:llä että Eneballa', vsSteam: 'vs Steam', by: 'kehittänyt' },
    hu: { header: 'Steam kulcs ár-összehasonlító — Eneba · Instant Gaming', loading: 'Árak ellenőrzése… (Európában aktiválható Steam kulcsok)', keyTag: 'Steam kulcs', btnOffer: 'Ajánlat megtekintése', linkOffer: 'ajánlat megtekintése', viewPage: 'termékoldal', outOfStock: 'Elfogyott', noKey: 'nincs megfelelő Steam kulcs (EU régió)', unavailable: 'nem elérhető', bothOOS: 'Elfogyott az IG-n és az Enebán is', vsSteam: 'vs Steam', by: 'fejlesztette' },
    ro: { header: 'Comparator de chei Steam — Eneba · Instant Gaming', loading: 'Se verifică prețurile… (chei Steam activabile în Europa)', keyTag: 'Cheie Steam', btnOffer: 'Vezi oferta', linkOffer: 'vezi oferta', viewPage: 'vezi pagina', outOfStock: 'Stoc epuizat', noKey: 'nicio cheie Steam eligibilă (regiunea UE)', unavailable: 'indisponibil', bothOOS: 'Stoc epuizat la IG și Eneba', vsSteam: 'vs Steam', by: 'dezvoltat de' },
    el: { header: 'Σύγκριση τιμών κλειδιών Steam — Eneba · Instant Gaming', loading: 'Έλεγχος τιμών… (κλειδιά Steam ενεργοποιήσιμα στην Ευρώπη)', keyTag: 'Κλειδί Steam', btnOffer: 'Δείτε την προσφορά', linkOffer: 'δείτε την προσφορά', viewPage: 'δείτε τη σελίδα', outOfStock: 'Εξαντλημένο', noKey: 'κανένα κατάλληλο κλειδί Steam (περιοχή ΕΕ)', unavailable: 'μη διαθέσιμο', bothOOS: 'Εξαντλημένο σε IG και Eneba', vsSteam: 'vs Steam', by: 'ανάπτυξη από' },
    tr: { header: 'Steam anahtarı fiyat karşılaştırması — Eneba · Instant Gaming', loading: 'Fiyatlar kontrol ediliyor… (Avrupa’da etkinleştirilebilir Steam anahtarları)', keyTag: 'Steam Anahtarı', btnOffer: 'Teklifi gör', linkOffer: 'teklifi gör', viewPage: 'ürün sayfası', outOfStock: 'Stokta yok', noKey: 'uygun Steam anahtarı yok (AB bölgesi)', unavailable: 'ulaşılamıyor', bothOOS: 'IG ve Eneba’da stokta yok', vsSteam: 'Steam’e göre', by: 'geliştiren' },
    ru: { header: 'Сравнение цен на ключи Steam — Eneba · Instant Gaming', loading: 'Проверка цен… (ключи Steam с активацией в Европе)', keyTag: 'Ключ Steam', btnOffer: 'Смотреть предложение', linkOffer: 'смотреть предложение', viewPage: 'страница товара', outOfStock: 'Нет в наличии', noKey: 'нет подходящего ключа Steam (регион ЕС)', unavailable: 'недоступно', bothOOS: 'Нет в наличии в IG и Eneba', vsSteam: 'по ср. со Steam', by: 'разработал' },
    uk: { header: 'Порівняння цін на ключі Steam — Eneba · Instant Gaming', loading: 'Перевірка цін… (ключі Steam з активацією в Європі)', keyTag: 'Ключ Steam', btnOffer: 'Переглянути пропозицію', linkOffer: 'переглянути пропозицію', viewPage: 'сторінка товару', outOfStock: 'Немає в наявності', noKey: 'немає відповідного ключа Steam (регіон ЄС)', unavailable: 'недоступно', bothOOS: 'Немає в наявності в IG та Eneba', vsSteam: 'порівняно зі Steam', by: 'розробник' },
    ja: { header: 'Steamキー価格比較 — Eneba · Instant Gaming', loading: '価格を確認中…（ヨーロッパで有効化可能なSteamキー）', keyTag: 'Steamキー', btnOffer: 'オファーを見る', linkOffer: 'オファーを見る', viewPage: '商品ページ', outOfStock: '在庫切れ', noKey: '条件に合うSteamキーなし（EU地域）', unavailable: '利用不可', bothOOS: 'IGとEnebaの両方で在庫切れ', vsSteam: 'Steam比', by: '開発者' },
    ko: { header: 'Steam 키 가격 비교 — Eneba · Instant Gaming', loading: '가격 확인 중… (유럽에서 활성화 가능한 Steam 키)', keyTag: 'Steam 키', btnOffer: '상품 보기', linkOffer: '상품 보기', viewPage: '상품 페이지', outOfStock: '품절', noKey: '조건에 맞는 Steam 키 없음 (EU 지역)', unavailable: '이용 불가', bothOOS: 'IG와 Eneba 모두 품절', vsSteam: 'Steam 대비', by: '개발자' },
    zh: { header: 'Steam 密钥比价 — Eneba · Instant Gaming', loading: '正在查询价格…（可在欧洲激活的 Steam 密钥）', keyTag: 'Steam 密钥', btnOffer: '查看优惠', linkOffer: '查看优惠', viewPage: '商品页面', outOfStock: '缺货', noKey: '没有符合条件的 Steam 密钥（欧盟区）', unavailable: '不可用', bothOOS: 'IG 和 Eneba 均缺货', vsSteam: '对比 Steam', by: '开发者' },
  };

  const NAV_LANG = String((typeof navigator !== 'undefined' && navigator.language) || 'en').toLowerCase();
  const LANG = ({ nb: 'no', nn: 'no' })[NAV_LANG.slice(0, 2)] || NAV_LANG.slice(0, 2);
  const T = I18N[LANG] || I18N.en;

  // Locales verified against each store (2026-07). IG redirects product URLs
  // by id only (slug is ignored), so any valid locale works with the EN slug.
  const IG_LANG = ['en', 'fr', 'de', 'es', 'it', 'pt', 'nl', 'pl', 'da', 'ru'].includes(LANG) ? LANG : 'en';
  const ENEBA_PREFIX = ['fr', 'de', 'es', 'it', 'pt', 'nl', 'pl', 'tr', 'ru', 'ja', 'zh'].includes(LANG) ? `/${LANG}` : '';

  // --- Config ---

  const CONFIG = {
    TIMEOUT_MS: 15000,
    CACHE_TTL_MIN: 30,
    HITS_PER_PAGE: 20,

    IG: {
      searchPage: (q) => `https://www.instant-gaming.com/en/search/?q=${encodeURIComponent(q)}`,
      // Fallback in case the runtime extraction of window.algoliaConfig fails
      // (values as of 2026-07).
      fallback: { appId: 'QKNHP8TC3Y', apiKey: '93946b91c013211f842ddf1819ea880b' },
      // EN index: titles match Steam's international names. Localized indexes
      // return translated titles ("L'Héritage de Poudlard") that break matching.
      index: 'produits_en',
      referer: 'https://www.instant-gaming.com/',
      productUrl: (id, slug) => `https://www.instant-gaming.com/${IG_LANG}/${id}-${slug}/`,
      filters: '(country_whitelist:"BE" OR country_whitelist:"worldwide" OR country_whitelist:"WW") AND (NOT country_blacklist:"BE")',
    },

    ENEBA: {
      appId: 'IHJZQ5LW2R',
      // Public search key, hardcoded: it lives in Eneba's JS bundle, not in
      // the page HTML, so it cannot be re-extracted at runtime (as of 2026-07).
      apiKey: '53864095e814940ffed0f69a897331f1',
      index: 'products_be',
      productUrl: (slug) => `https://www.eneba.com${ENEBA_PREFIX}/${slug}`,
      filters: '(NOT regionBlacklist:"belgium") AND (drmName:"steam")',
    },

    REGIONS_OK: ['europe', 'eu', 'global', 'monde', 'worldwide', 'world', 'emea', 'belgium', 'belgique'],

    // Reject anything sold as an account; require an explicit key/code on
    // marketplaces that mix both (Eneba).
    ACCOUNT_RX: /\b(account|accounts|compte|comptes)\b/i,
    KEY_RX: /\b(key|keys|cl[eé]s?|code|codes|cd[-\s]?key)\b/i,

    // Tokens stripped before title comparison (platform, edition, region noise).
    MATCH_NOISE: new Set([
      'pc', 'mac', 'linux', 'windows', 'steam', 'valve',
      'key', 'keys', 'cle', 'cles', 'code', 'codes', 'cd',
      'edition', 'goty', 'definitive', 'deluxe', 'ultimate', 'premium', 'gold',
      'complete', 'enhanced', 'remastered', 'anniversary', 'legendary',
      'collector', 'collectors', 'limited', 'special', 'extended', 'standard',
      'digital', 'version',
      'europe', 'eu', 'global', 'worldwide', 'monde', 'world', 'emea',
      'belgium', 'belgique', 'row', 'region', 'na',
      'the', 'a', 'an', 'of', 'le', 'la', 'les', 'de', 'du', 'des', 'and', 'et',
    ]),

    MATCH_THRESHOLD: 0.6,
  };

  // --- Network helpers ---

  function gmFetch({ method = 'GET', url, headers = {}, body = null }) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method,
        url,
        headers,
        data: body,
        timeout: CONFIG.TIMEOUT_MS,
        onload: (r) => (r.status >= 200 && r.status < 300)
          ? resolve(r.responseText)
          : reject(new Error(`HTTP ${r.status} — ${url}`)),
        onerror: () => reject(new Error(`Network error — ${url}`)),
        ontimeout: () => reject(new Error(`Timeout after ${CONFIG.TIMEOUT_MS}ms — ${url}`)),
      });
    });
  }

  async function algoliaQuery({ appId, apiKey, index, referer = null }, body) {
    const url = `https://${appId.toLowerCase()}-dsn.algolia.net/1/indexes/${encodeURIComponent(index)}/query`;
    const headers = {
      'Content-Type': 'application/json',
      'x-algolia-application-id': appId,
      'x-algolia-api-key': apiKey,
    };
    // IG's search key is referer-restricted to instant-gaming.com;
    // GM_xmlhttpRequest can spoof these headers where fetch() cannot.
    if (referer) {
      headers['Referer'] = referer;
      headers['Origin'] = referer.replace(/\/$/, '');
    }
    return JSON.parse(await gmFetch({ method: 'POST', url, headers, body: JSON.stringify(body) }));
  }

  // --- Misc helpers ---

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  function fmtPrice(n) {
    return new Intl.NumberFormat(NAV_LANG || 'en', { style: 'currency', currency: 'EUR' }).format(n);
  }

  // --- Title matching ---

  function cleanGameName(raw) {
    return raw
      .replace(/[’‘`´]/g, "'")
      .replace(/[™®©]/g, ' ')
      .replace(/\((?:TM|R|C)\)/gi, ' ')
      .replace(/\b(?:game of the year|goty|definitive|deluxe|ultimate|premium|gold|complete|enhanced|remastered|anniversary|legendary|collector(?:'s)?|limited|special|extended|standard|digital)\s+edition\b/gi, ' ')
      .replace(/\bedition\b/gi, ' ')
      .replace(/[:\-–—|]+/g, ' ')
      .replace(/[^\p{L}\p{N}\s'&.]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokensOf(s) {
    return new Set(
      String(s)
        .toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/['’]/g, '') // "baldur's" -> "baldurs", avoids a stray "s" token
        .replace(/[^a-z0-9]+/g, ' ')
        .split(' ')
        .filter((w) => w && !CONFIG.MATCH_NOISE.has(w))
    );
  }

  // Jaccard similarity between token sets.
  function similarity(a, b) {
    if (!a.size || !b.size) return 0;
    let inter = 0;
    for (const t of a) if (b.has(t)) inter++;
    return inter / (a.size + b.size - inter);
  }

  const ROMAN = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9,
                  x: 10, xi: 11, xii: 12, xiii: 13, xiv: 14, xv: 15, xvi: 16 };

  function numbersOf(tokens) {
    const out = new Set();
    for (const w of tokens) {
      if (/^\d+$/.test(w)) out.add(String(parseInt(w, 10)));
      else if (ROMAN[w] !== undefined) out.add(String(ROMAN[w]));
    }
    return out;
  }

  function sameNumbers(a, b) {
    if (a.size !== b.size) return false;
    for (const n of a) if (!b.has(n)) return false;
    return true;
  }

  function pickBest(candidates, targetTokens) {
    const targetNums = numbersOf(targetTokens);
    for (const c of candidates) c.score = similarity(targetTokens, c.tokens);

    // Sequel numbers must match exactly ("Hades II" scores 0.5 against
    // "Hades" but must never be paired with it, in either direction).
    const relevant = candidates.filter(
      (c) => c.score >= CONFIG.MATCH_THRESHOLD && sameNumbers(targetNums, numbersOf(c.tokens)),
    );
    if (!relevant.length) return { ok: true, found: false };

    // Keep only the top-scoring group: regional variants of the same game,
    // not a different title that happens to pass the threshold.
    const best = Math.max(...relevant.map((c) => c.score));
    const top = relevant.filter((c) => c.score >= best - 0.05);

    const inStock = top
      .filter((c) => c.inStock && typeof c.price === 'number')
      .sort((a, b) => a.price - b.price);

    if (inStock.length) {
      const w = inStock[0];
      return { ok: true, found: true, inStock: true, status: 'ok',
               price: w.price, url: w.url, name: w.name, region: w.region };
    }

    const w = top[0];
    return { ok: true, found: true, inStock: false, status: 'out_of_stock',
             price: null, url: w.url, name: w.name, region: w.region };
  }

  // --- Instant Gaming ---

  async function searchInstantGaming(query, targetTokens) {
    // Re-extract the Algolia credentials from IG's own search page so the
    // script survives a key rotation. The config sits in an inline <script>.
    let { appId, apiKey } = CONFIG.IG.fallback;
    try {
      const html = await gmFetch({ url: CONFIG.IG.searchPage(query) });
      const mId = html.match(/algolia_appid:\s*'([^']+)'/);
      const mKey = html.match(/algolia_key:\s*'([a-f0-9]+)'/);
      if (mId && mKey) { appId = mId[1]; apiKey = mKey[1]; }
    } catch (e) {
      console.warn('[PriceCheck] IG config extraction failed, using fallback:', e.message);
    }

    const data = await algoliaQuery(
      { appId, apiKey, index: CONFIG.IG.index, referer: CONFIG.IG.referer },
      {
        query,
        hitsPerPage: CONFIG.HITS_PER_PAGE,
        filters: CONFIG.IG.filters,
        attributesToRetrieve: [
          'name', 'fullname', 'seo_name', 'prod_id', 'region', 'platform',
          'type', 'has_stock', 'price', 'currency_prices', 'country_whitelist',
        ],
      },
    );

    const candidates = (data.hits || [])
      .map((h) => {
        const name = String(h.name || h.fullname || '');
        const whitelist = Array.isArray(h.country_whitelist)
          ? h.country_whitelist.map((c) => String(c).toLowerCase())
          : null;
        return {
          name,
          tokens: tokensOf(name),
          region: String(h.region || ''),
          platformOk: String(h.platform || h.type || '').trim().toLowerCase() === 'steam',
          notAccount: !CONFIG.ACCOUNT_RX.test(name) && !CONFIG.ACCOUNT_RX.test(String(h.fullname || '')),
          // Region labels can be composite ("Europe & US & Canada") — any
          // whitelisted part is enough, but the country whitelist must still
          // cover BE or be worldwide.
          regionOk:
            String(h.region || '').toLowerCase().split(/[&,/+]/)
              .some((part) => CONFIG.REGIONS_OK.includes(part.trim())) &&
            (whitelist === null || whitelist.includes('be') || whitelist.includes('worldwide') || whitelist.includes('ww')),
          inStock: h.has_stock === 1 || h.has_stock === true,
          price: typeof (h.currency_prices && h.currency_prices.EUR) === 'number'
            ? h.currency_prices.EUR
            : (typeof h.price === 'number' ? h.price : null),
          url: CONFIG.IG.productUrl(h.prod_id, h.seo_name),
        };
      })
      .filter((c) => c.platformOk && c.notAccount && c.regionOk);

    return pickBest(candidates, targetTokens);
  }

  // --- Eneba ---

  async function searchEneba(query, targetTokens) {
    const data = await algoliaQuery(
      { appId: CONFIG.ENEBA.appId, apiKey: CONFIG.ENEBA.apiKey, index: CONFIG.ENEBA.index },
      {
        query,
        hitsPerPage: CONFIG.HITS_PER_PAGE,
        filters: CONFIG.ENEBA.filters,
        attributesToRetrieve: [
          'translations.en_US.name', 'translations.en_US.descriptionTitle',
          'translations.fr_FR.name',
          'productRegions', 'drmName', 'slug', 'stockAvailable',
          'lowestPrice.EUR', 'productType',
        ],
      },
    );

    const candidates = (data.hits || [])
      .map((h) => {
        const t = h.translations || {};
        const nameEn = (t.en_US && t.en_US.name) || '';
        const nameFr = (t.fr_FR && t.fr_FR.name) || '';
        // descriptionTitle is the bare game title, without the
        // "(PC) Steam Key EUROPE" suffix — best input for matching.
        const cleanTitle = (t.en_US && t.en_US.descriptionTitle) || nameEn || nameFr;
        const regions = (h.productRegions || []).map((r) => String(r).toLowerCase());
        const regionMatch = regions.find((r) => CONFIG.REGIONS_OK.includes(r));
        const cents = h.lowestPrice && typeof h.lowestPrice.EUR === 'number' ? h.lowestPrice.EUR : null;
        return {
          name: nameFr || nameEn,
          tokens: tokensOf(cleanTitle),
          region: regionMatch ? regionMatch.toUpperCase() : (regions[0] || '').toUpperCase(),
          platformOk: h.drmName === 'steam',
          isKey: CONFIG.KEY_RX.test(nameEn) || CONFIG.KEY_RX.test(nameFr),
          notAccount: !CONFIG.ACCOUNT_RX.test(nameEn) && !CONFIG.ACCOUNT_RX.test(nameFr),
          regionOk: Boolean(regionMatch),
          inStock: h.stockAvailable === true && cents !== null,
          price: cents !== null ? cents / 100 : null, // lowestPrice is in euro cents
          url: CONFIG.ENEBA.productUrl(h.slug),
        };
      })
      .filter((c) => c.platformOk && c.isKey && c.notAccount && c.regionOk);

    return pickBest(candidates, targetTokens);
  }

  // --- Steam page ---

  function getSteamPrice() {
    const el = document.querySelector(
      '.game_area_purchase_game .discount_final_price, .game_area_purchase_game .game_purchase_price',
    );
    if (!el) return null;
    const m = el.textContent.replace(/\s| /g, '').match(/(\d+(?:[.,]\d{1,2})?)/);
    return m ? parseFloat(m[1].replace(',', '.')) : null;
  }

  // --- UI ---

  // Lucide icon paths (ISC license), inlined to avoid external requests.
  const ICON_PATHS = {
    euro: '<path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  };

  function icon(name) {
    return `<svg class="spc-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      aria-hidden="true">${ICON_PATHS[name]}</svg>`;
  }

  const CSS = `
    #spc-box .spc-ico {
      width: 1em; height: 1em; flex: 0 0 auto;
      vertical-align: -0.125em; display: inline-block;
    }
    #spc-box {
      font-family: "Motiva Sans", Arial, Helvetica, sans-serif;
      background: linear-gradient(135deg, #1f3247 0%, #16202d 100%);
      border: 1px solid #2a3f5a;
      border-radius: 4px;
      color: #c6d4df;
      padding: 14px 16px;
      margin: 0 0 14px 0;
      font-size: 13px;
      line-height: 1.45;
    }
    #spc-box .spc-header {
      display: flex; align-items: center; gap: 8px;
      color: #8ba9c4; text-transform: uppercase;
      font-size: 11px; letter-spacing: 1px;
      margin-bottom: 10px;
    }
    #spc-box .spc-loading { display: flex; align-items: center; gap: 10px; color: #acb2b8; }
    #spc-box .spc-spinner {
      width: 14px; height: 14px; flex: 0 0 auto;
      border: 2px solid #3a4f6a; border-top-color: #66c0f4;
      border-radius: 50%; animation: spc-spin .8s linear infinite;
    }
    @keyframes spc-spin { to { transform: rotate(360deg); } }

    #spc-box .spc-best {
      display: flex; align-items: center; justify-content: space-between;
      gap: 14px; flex-wrap: wrap;
      background: rgba(0, 0, 0, .25);
      border-radius: 3px; padding: 10px 12px;
    }
    #spc-box .spc-merchant { font-size: 14px; font-weight: bold; color: #ffffff; }
    #spc-box .spc-tag {
      display: inline-block; margin-left: 8px; padding: 1px 7px;
      font-size: 10px; text-transform: uppercase; letter-spacing: .5px;
      color: #66c0f4; background: rgba(102, 192, 244, .12);
      border: 1px solid rgba(102, 192, 244, .35); border-radius: 10px;
      vertical-align: 2px;
    }
    #spc-box .spc-title { color: #8f98a0; font-size: 12px; margin-top: 2px; }
    #spc-box .spc-buy { display: flex; align-items: center; gap: 12px; }
    #spc-box .spc-price { font-size: 20px; font-weight: bold; color: #beee11; }
    #spc-box .spc-save {
      font-size: 11px; font-weight: bold; color: #a4d007;
      background: rgba(164, 208, 7, .12); border-radius: 3px;
      padding: 2px 6px; margin-left: 6px; vertical-align: 3px;
    }
    #spc-box a.spc-btn {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 8px 16px; border-radius: 2px;
      background: linear-gradient(to right, #75b022 5%, #588a1b 95%);
      color: #d2efa9; font-size: 13px; text-decoration: none; white-space: nowrap;
    }
    #spc-box a.spc-btn:hover {
      background: linear-gradient(to right, #8ed629 5%, #6aa621 95%);
      color: #ffffff;
    }
    #spc-box .spc-others { margin-top: 8px; color: #8f98a0; font-size: 12px; }
    #spc-box .spc-others a { color: #66c0f4; text-decoration: none; }
    #spc-box .spc-others a:hover { color: #a3d4f5; }
    #spc-box .spc-oos { color: #cd5444; font-weight: bold; }
    #spc-box .spc-alert {
      display: flex; align-items: center; gap: 8px;
      background: rgba(205, 84, 68, .12);
      border: 1px solid rgba(205, 84, 68, .5); border-radius: 3px;
      color: #ff8a7a; font-weight: bold;
      padding: 10px 12px;
    }
    #spc-box .spc-muted { color: #67707b; }
    #spc-box .spc-credit {
      margin-top: 8px; text-align: right;
      font-size: 10px; letter-spacing: .3px; color: #4b5763;
    }
    #spc-box .spc-credit a { color: #67707b; text-decoration: none; }
    #spc-box .spc-credit a:hover { color: #8f98a0; }
  `;

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function createBox(purchaseBlock) {
    const box = document.createElement('div');
    box.id = 'spc-box';
    box.innerHTML = `
      <div class="spc-header">${icon('euro')} ${esc(T.header)}</div>
      <div class="spc-body">
        <div class="spc-loading">
          <div class="spc-spinner"></div>
          <span>${esc(T.loading)}</span>
        </div>
      </div>
      <div class="spc-credit">${esc(T.by)}
        <a href="https://github.com/IAmRom1" target="_blank" rel="noopener noreferrer">IAmRom1</a>
      </div>`;
    purchaseBlock.parentNode.insertBefore(box, purchaseBlock);
    return box;
  }

  function merchantLine(label, r) {
    if (!r.ok) return `${esc(label)} : <span class="spc-muted">${esc(T.unavailable)}</span>`;
    if (!r.found) return `${esc(label)} : <span class="spc-muted">${esc(T.noKey)}</span>`;
    if (!r.inStock) return `${esc(label)} : <span class="spc-oos">${esc(T.outOfStock)}</span> — <a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(T.viewPage)}</a>`;
    return `${esc(label)} : <strong>${esc(fmtPrice(r.price))}</strong> — <a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(T.linkOffer)}</a>`;
  }

  function render(box, results, steamPrice) {
    const body = box.querySelector('.spc-body');
    const list = [
      { label: 'Instant Gaming', ...results.ig },
      { label: 'Eneba', ...results.eneba },
    ];

    const found = list.filter((r) => r.ok && r.found);
    const inStock = found.filter((r) => r.inStock);

    if (inStock.length) {
      inStock.sort((a, b) => a.price - b.price);
      const best = inStock[0];
      const others = list.filter((r) => r !== best);

      let save = '';
      if (typeof steamPrice === 'number' && steamPrice > 0 && best.price < steamPrice) {
        const pct = Math.round((1 - best.price / steamPrice) * 100);
        if (pct >= 1) save = `<span class="spc-save">−${pct}&nbsp;% ${esc(T.vsSteam)} (${esc(fmtPrice(steamPrice))})</span>`;
      }

      body.innerHTML = `
        <div class="spc-best">
          <div class="spc-best-info">
            <div class="spc-merchant">${icon('trophy')} ${esc(best.label)}
              <span class="spc-tag">${esc(T.keyTag)} · ${esc(best.region || 'EU')}</span>
            </div>
            <div class="spc-title">${esc(best.name)}</div>
          </div>
          <div class="spc-buy">
            <div class="spc-price">${esc(fmtPrice(best.price))}${save}</div>
            <a class="spc-btn" href="${esc(best.url)}" target="_blank" rel="noopener noreferrer">${esc(T.btnOffer)} ${icon('external')}</a>
          </div>
        </div>
        <div class="spc-others">${others.map((r) => merchantLine(r.label, r)).join('<br>')}</div>`;
      return;
    }

    // Both merchants list the game but neither has stock.
    if (results.ig.ok && results.ig.found && results.eneba.ok && results.eneba.found) {
      body.innerHTML = `
        <div class="spc-alert">${icon('alert')} ${esc(T.bothOOS)}</div>
        <div class="spc-others">${list.map((r) => merchantLine(r.label, r)).join('<br>')}</div>`;
      return;
    }

    body.innerHTML = `
      <div class="spc-others">${list.map((r) => merchantLine(r.label, r)).join('<br>')}</div>`;
  }

  // --- Session cache ---

  function cacheKey() {
    const m = location.pathname.match(/\/app\/(\d+)/);
    return m ? `spc_v1_${m[1]}` : null;
  }

  function cacheGet() {
    try {
      const k = cacheKey();
      if (!k) return null;
      const raw = sessionStorage.getItem(k);
      if (!raw) return null;
      const { t, data } = JSON.parse(raw);
      if (Date.now() - t > CONFIG.CACHE_TTL_MIN * 60 * 1000) return null;
      return data;
    } catch { return null; }
  }

  function cacheSet(data) {
    try {
      const k = cacheKey();
      if (k) sessionStorage.setItem(k, JSON.stringify({ t: Date.now(), data }));
    } catch { /* storage full or blocked; skip caching */ }
  }

  // --- Entry point ---

  async function main() {
    if (document.getElementById('spc-box')) return;

    // Missing on age-gate and error pages.
    const nameEl = document.querySelector('#appHubAppName');
    if (!nameEl) return;

    const purchaseBlock = document.querySelector('.game_area_purchase_game');
    if (!purchaseBlock) return; // delisted game or F2P without a purchase block

    injectStyles();
    const box = createBox(purchaseBlock);
    const steamPrice = getSteamPrice();

    const rawName = nameEl.textContent.trim();
    const query = cleanGameName(rawName);
    const targetTokens = tokensOf(query);

    const cached = cacheGet();
    if (cached) { render(box, cached, steamPrice); return; }

    // One failing merchant must not prevent showing the other.
    const [ig, eneba] = await Promise.all([
      searchInstantGaming(query, targetTokens).catch((e) => {
        console.warn('[PriceCheck] Instant Gaming:', e);
        return { ok: false, error: e.message };
      }),
      searchEneba(query, targetTokens).catch((e) => {
        console.warn('[PriceCheck] Eneba:', e);
        return { ok: false, error: e.message };
      }),
    ]);

    const results = { ig, eneba };
    if (ig.ok || eneba.ok) cacheSet(results);
    render(box, results, steamPrice);
  }

  main();
})();
