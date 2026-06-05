# CLAUDE.md (Türkçe çeviri)

Bu, kanonik İngilizce `CLAUDE.md` dosyasının Türkçe çevirisidir. Ajan (Claude
Code) için bağlayıcı olan İngilizce sürümdür; bu dosya insan okurlar içindir.
Kod, dosya adları, tanımlayıcılar ve token adları İngilizce bırakılmıştır.

Bu, bu repodaki Claude Code için operasyonel kural dosyasıdır. Kuralları,
konvansiyonları ve referans haritasını tutar — kısa ve özdür. Derin,
insan-okur açıklamalar `docs/{en,tr}/` altında yaşar (bkz. §13), `docs`
modülü tarafından uygulama-içinde render edilir ve uzun-biçim otoritedir.
Modül başına README yoktur; her modülün detayı `docs/{en,tr}/modules/<NAME>.md`
içinde, global altyapı ise `docs/{en,tr}/COMPONENTS.md` içindedir.

Kapsam: React + TypeScript hasta takip paneli (Abisena / Panates vaka
çalışması). Sunucu verisi salt-okunur bir GET'tir; ekle / düzenle / sil
istemci tarafındadır ve `localStorage`'da kalıcılaştırılır. Arayüz tamamen iki
dillidir (Türkçe / İngilizce).

Veriler mock/dummy'dir (incelenecek bir vaka çalışması); istemci-tarafı
`localStorage` kalıcılığı bu egzersiz için uygundur ve gerçek hasta / PHI verisi
için bir desen DEĞİLDİR.

## 0. Bu Projede Nasıl Çalışılır

Görev tipini belirle ve belirtilen bölümleri + dokümanları oku. Birden çok tip →
eşleşen tüm satırların BİRLEŞİMİ.

| Görev tipi                         | CLAUDE.md'de oku    | Derin doküman                                  |
| ---------------------------------- | ------------------- | ---------------------------------------------- |
| UI bileşeni ekle / değiştir        | §2 §3 §3.1 §7 §9    | `docs/tr/STYLING.md`, `docs/tr/COMPONENTS.md`, `docs/tr/modules/PATIENTS.md` |
| Global bileşen / wrapper           | §2 §3.1             | `docs/tr/COMPONENTS.md`                        |
| Form (ekle / düzenle)              | §3.1 §8 §16         | `docs/tr/COMPONENTS.md`, `docs/tr/modules/PATIENTS.md` |
| Yeni modül                         | §2 §3 §4 §5 §6      | `docs/tr/ARCHITECTURE.md`                      |
| Routing / sayfalar / menü          | §6                  | `docs/tr/ARCHITECTURE.md`                      |
| Üçüncü-parti kütüphane konfigü      | §3 (plugins)        | `docs/tr/ARCHITECTURE.md`                      |
| Bağımlılıklar / sürümler / yükseltme | §1.1              | bu dosya                                       |
| Veri çekme / CRUD / storage        | §10                 | `docs/tr/STATE_MANAGEMENT.md`                  |
| Sıralama / filtre / arama          | §3.1 §8             | `docs/tr/COMPONENTS.md`                        |
| UI metni / i18n / yerelleştirilmiş alanlar | §8          | `docs/tr/I18N.md`                              |
| Stil / Tailwind / SCSS / tema      | §9                  | `docs/tr/STYLING.md`                           |
| Ortam / config                     | §3 (config)         | `docs/tr/ARCHITECTURE.md`, `README.md`         |
| Testler                            | §11                 | `docs/tr/TESTING.md`                           |
| Lint / format / tooling            | §12                 | `docs/tr/CODING_STANDARDS.md`                  |
| Doküman / referanslar / uygulama-içi docs | §13          | bu dosya                                       |
| Sürümleme / release                | §14                 | `docs/tr/VERSIONING.md`                        |
| Workflow / audit / commit / merge  | §15                 | `docs/tr/WORKFLOW.md`                          |
| Erişilebilirlik / performans       | §16                 | `docs/tr/COMPONENTS.md`                        |
| Responsive tasarım / responsiveness | §16                 | `docs/tr/COMPONENTS.md`                        |

**Her zaman açık** (her görev): §0.1 Active Work (ÖNCE oku), §7 İsimlendirme,
§8 Metin & i18n, §13 Dokümantasyon Sistemi, §15 Workflow (ön-iş doküman okuması dahil).

**Her Claude Code prompt'unu şununla bitir**: "If you see an issue, ambiguity, or
a better suggestion, surface it before implementing. Otherwise proceed."

## 0.1 Active Work

Tek "neredeyiz" göstergesi — aynı anda TEK aktif TOPIC (≈ bir SPRINT_PLAN görevi;
bir branch = bir topic, §15). Neyin devam ettiğini ve nerede olduğunu — mevcut
alt-madde dahil (`Next` satırı) — tek bakışta söyler. Ayrıntılı iz burada değil,
topic'in alt-madde-başına commit'lerinde ve PR açıklamasında (sözleşme, §15) yaşar —
böylece bu kısım küçük kalır ve kural dosyası ne şişer ne de merge conflict üretir.
Audit onaylanınca oluşturulur; alt-maddeler indikçe `Next` satırı ve `status`
güncellenir; maddenin tamamı topic'in son authored commit'inde (Rebase and merge
öncesi son commit, §15) SİLİNİR — merge sonrası silinecek bir commit yoktur. Kalıcı
iz `SPRINT_PLAN.md`'dir.

**Biçim**:

```markdown
### Active: <SPRINT_PLAN id + ad> · branch: <branch> · status: <planned | in-progress | in-review>
Sections: <CLAUDE.md §referansları>   ·   Paths: <dokunulan ana yollar>
Next: <mevcut/sıradaki alt-madde — bağlam olmadan başlamaya yetecek kadar net>
```

_(Devam eden aktif iş yok.)_

## 1. Proje Genel Bakış

| Katman        | Seçim                                                         |
| ------------- | ------------------------------------------------------------- |
| Framework     | React 18 (fonksiyon bileşenleri + composables). Next.js yok.  |
| Dil           | TypeScript (strict)                                           |
| Build         | Vite                                                          |
| Routing       | React Router (data router, `createBrowserRouter`) — §6        |
| UI kütüphanesi| PrimeReact 10.9.8 (stable v10) + PrimeIcons. Lara Green tema CSS (resources path'inden); koyu mod tema-swap (§9) |
| Utility CSS   | Tailwind CSS 3.4 (token-destekli — §9)                        |
| Özel CSS      | SCSS, SMACSS düzeninde, token-alias'lı (§9)                   |
| Formlar       | Formik + Yup (i18n-güdümlü mesajlar — §8, §3.1)               |
| Tarihler      | Day.js (`plugins/` içinde yapılandırılır) — §8               |
| Sunucu verisi | TanStack Query (React Query) — GET'ten bir kez seed eder       |
| İstemci verisi| `localStorage` kalıcı kaynak; CRUD invalidation ile (§10)     |
| i18n          | react-i18next (TR / EN) + PrimeReact Locale API (§8)          |
| Uygulama-içi docs | `docs` modülü `docs/{tr,en}/*.md` render eder (react-markdown) — §13 |
| Sürümleme     | release-please (Conventional-Commit güdümlü) (§14)            |
| Test          | Node yerleşik test runner (`node --test`, Node 24 type-strip), saf-mantık spec'leri — Vitest/RTL/MSW yok (§11) |

Veri kaynağı (GET, salt-okunur, tek-seferlik seed):
`https://v0-json-api-three.vercel.app/api/data`

## 1.1 Bağımlılıklar ve sürüm politikası

- **Kritik exact pin'ler** (asla aralık, asla otomatik bump): `primereact`
  `10.9.8`, `tailwindcss` `3.4.x`. **PrimeReact'i v11'e veya Tailwind'i v4'e
  YÜKSELTME** — bunlar tüm stil / token modelini (§9) değiştirir ve Dependabot
  bump'ı değil, major mimari karardır. (PrimeReact v11'in `@primeuix/themes`
  preset teması `@primereact/core` v1+ gerektirir; farklı bir paket ailesi,
  kapsam dışı.)
- Lara Green tema CSS'i, kurulu `primereact` paketinin `resources/themes/`
  yolundan tüketilir — ayrı tema paketi yok, SASS derlemesi yok, vendored kopya
  yok (§9).
- Diğer bağımlılıklar caret major kullanır; lockfile commit edilir ve her yerde
  (yerel, CI, Vercel) `npm ci` kullanılır.
- Docs-render dep'leri: `react-markdown` (^9), `remark-gfm` (^4),
  `@tailwindcss/typography` (^0.5) — sonuncusu Tailwind config `plugins`'ine
  bağlanır (§9).
- Dependabot (`.github/dependabot.yml`, ENFORCE edildiği yer) beş tam-pinli kritik
  paket — `react`, `react-dom`, `primereact`, `primeicons`, `tailwindcss` — için
  **TÜM güncelleme türlerini ignore eder** ki asla kaymasınlar, ve `eslint` İLE
  `@eslint/*` **major'larını ignore eder** (eslint v10, eslint 9'da sabitlenen
  `eslint-plugin-jsx-a11y`'yi bozar; `@eslint/js` AYRI bir pakettir, major'u aynı
  eslint hattını izler ve bir kez `eslint`-yalnız ignore'dan sızdı, bu yüzden
  `@eslint/*` da ignore edilir). Diğer her bağımlılığın minor / patch
  güncellemeleri tek bir haftalık PR'da gruplanır ve yine CI + review'dan geçer
  (§15); güvenlik açığı `npm audit --audit-level=high` kapısıyla karşılanır.

## 2. Mimari

Modüler. Her alan (domain) `src/modules/` altında kendi-kendine yeten bir modülde
yaşar; api, models, lib, composables, components, pages, routes ve constants'ı
kendi sahiplenir. Global kesişen kod üst-seviye `src/` katmanlarında yaşar.
Üçüncü-parti kütüphane konfigürasyonu `src/plugins/` içindedir.

**Katman bağımlılık sırası** (modül içinde ve uygulama genelinde):
`api → models → lib (mapper + saf yardımcılar) → composables → pages/components`.

**Ana ilkeler:**

- **Barrel üzerinden public API.** Modüller yalnızca `index.ts` üzerinden açılır.
  Diğer kod `@/modules/<name>`'den import eder, asla derin yoldan. Global
  katmanlar bir modül barrel'ını import EDEBİLİR (ör. `useMenu`, router — §6);
  modüller birbirini YALNIZCA barrel üzerinden import eder, iç dosyalardan asla.
- **Parçalama zorunludur — sorumluluğa göre, sabit satır sayısı YOK.** Modül
  kodunu küçük, odaklı dosyalara böl ve doğru alt-klasöre yerleştir (ağ → `api`,
  şekiller → `models`, dönüşüm/saf mantık → `lib`, orkestrasyon → `composables`,
  render → `components`, ekranlar → `pages`). Bölme tetikleyicisi karışık
  sorumluluk / bir birimin birden fazla iş yapması — satır eşiği değil. Bölünmesi
  mantıklı olanı böl; doldurma ya da aşırı parçalama yapma.
- **Yerleştirme kuralı (zorunlu).** Modüle özgü kod modülde kalır. Birden fazla
  modülde tekrar kullanılan her şey bir global katmanda (`src/components`,
  `src/composables`, `src/lib`) yazılMALIdır — kopyalanmaz ve bir kardeşin uzanıp
  alacağı şekilde modülün içine gömülmez.
- **Global wrapper bileşenleri (App*).** Tekrar eden UI desenleri `src/components`
  içinde global bir `App*` wrapper alır (ör. `AppDataTable`). Çağrı yerlerinde
  wrapper zorunludur — asla ham PrimeReact bileşenini doğrudan kullanma. Eksik
  yetenek wrapper'a eklenir, yerelde etrafından dolanılmaz. Global katalog §3.1;
  detay `docs/tr/COMPONENTS.md`.
- **api yalnızca I/O'dur** — parsing yok, iş mantığı yok. GET yolu ham snake_case
  satır döner ve mapper (modül `lib/`) domain modelini kurar — bu yalnız seed'de
  çalışır. Storage servisi zaten map'lenmiş domain modelini JSON olarak round-trip
  eder, mapper yok (§10).
- **Composables orkestre eder; sayfalar ince kabuktur** — composable çağırır,
  bileşen kompoze eder; bileşenler veriyi props ile alır.
- Kod tanımlayıcıları İngilizce; kullanıcıya görünen metin yalnızca i18n (§8).

Otoriter detay: `docs/tr/ARCHITECTURE.md`.

## 3. Dizin Yapısı

```
src/
├── main.tsx                 Bootstrap: i18n init → env doğrula → tema link uygula → provider'lar → RouterProvider
├── __test__/                kaynak ağacını yansıtan node:test spec'leri (§11); value import'lar göreli, yalnız-tip @/ ile
├── config/
│   ├── env.ts               Tipli donmuş env + validateRequiredEnvVars()
│   └── vite-env.d.ts        ImportMetaEnv augmentation
├── plugins/                 Üçüncü-parti kütüphane konfigürasyonu
│   ├── primereact.ts        PrimeReactProvider value + locale + FilterService.register('nfcContains') (§8)
│   ├── theme.ts             Lara Green light/dark theme.css?url + applyTheme/setThemeMode, <link id="app-theme"> üzerinden (§9)
│   ├── react-query.ts       QueryClient varsayılanları (§10)
│   ├── dayjs.ts             Day.js eklentileri + tr/en locale + setDayjsLocale (§8)
│   ├── i18n.ts              react-i18next init + PrimeReact + Day.js köprüsü (§8)
│   └── yup.ts               yup.setLocale() → i18n mesaj anahtarları (§8, §3.1)
├── router/
│   └── index.tsx            createBrowserRouter: AppLayout + errorElement + index redirect + modül route'ları + 404 (§6)
├── components/              Global UI (App* wrapper'lar + kabuklar) — §3.1
│   ├── AppDataTable.tsx     DataTable wrapper (toolbar slot + arama + filtre-temizle, Türkçe sort/filter, iki-mod loading, responsive paginator) (§3.1)
│   ├── AppDataTable.lib.ts  saf buildInitialFilters(globalMatchMode, defaults, includeGlobal) (unit-test'li)
│   ├── AppToastProvider.tsx Tek PrimeReact <Toast/>'u mount eder; useNotify'ı besler (§3.1)
│   ├── toast-context.ts     ToastContext (AppToastProvider fast-refresh-temiz kalsın diye ayrıldı)
│   ├── Loading.tsx          Lazy-route fallback
│   ├── ErrorState.tsx       Sayfa-içi beklenen-veri hatası + retry (§3.1)
│   ├── ConfigErrorScreen.tsx Eksik-env ekranı (dev: adlar; prod: i18n) (§3 config)
│   ├── RouteErrorBoundary.tsx Router errorElement (useRouteError) (§6; 0.7'ye dek minimal)
│   ├── NotFound.tsx         `*` route için 404 sayfası (errors.notFound) (§6)
│   ├── AppErrorBoundary.tsx RouterProvider üstündeki class boundary → FatalError (§6)
│   ├── FatalError.tsx       Beklenmeyen-hata fallback UI
│   ├── form/                Formik↔PrimeReact alan wrapper'ları (§3.1)
│   │   ├── FormInputText.tsx  FormDropdown.tsx  FormCalendar.tsx
│   │   ├── FormInputNumber.tsx  FormCheckbox.tsx  FormChips.tsx
│   │   ├── FormField.tsx       Paylaşılan kabuk: i18n label + resolveValidationMessage ile Yup hatası
│   │   └── validation.ts       resolveValidationMessage(raw, t) — {key,values} parse → t() (unit-test'li)
│   └── layout/              App* layout kabuğu (§6, §9)
│       ├── AppLayout.tsx      <Outlet/> + <ScrollRestoration/> + route handle'dan başlık; sabit sidebar offset (lg) + route değişiminde mobil drawer kapanır
│       ├── AppSidebar.tsx     useMenu() gruplarını render eder; transparan sabit panel (lg) + PrimeReact <Sidebar> drawer (< lg, .l-sidebar-drawer) (§6, §9, §16)
│       ├── AppTopbar.tsx      .l-topbar-start (hamburger + başlık) + aksiyon chip'leri (dil + tema), avatar yok
│       ├── AppLogo.tsx        inline-SVG marka işareti (token-renkli) + BRAND_NAME wordmark (§9)
│       ├── AppLanguageSwitcher.tsx  aktif-dil metin chip'i (TR/EN) → i18n.changeLanguage diğerine geçirir (tek dil akışı §8)
│       └── AppThemeToggle.tsx       → plugins/theme setThemeMode + 'theme-mode' (§9)
├── composables/
│   ├── useMenu.ts           tek menü kaynağı: modül route constant'ları + docs registry, section atar (§6)
│   ├── useMenu.lib.ts       saf buildMenu(sources, translate) — gruplu section'lar, sırala + etiketle (unit-test'li)
│   ├── useNotify.ts         success / error / info toast; yalnız-anahtar TranslationKey API (§3.1)
│   ├── useNotify.lib.ts     saf normalizeErrorKey(error) → TranslationKey (unit-test'li)
│   └── useMediaQuery.ts     matchMedia hook'u (responsive paginator template, §16)
├── lib/                     Global saf yardımcılar
│   ├── text.ts              NFC + toLocaleLowerCase('tr'); Intl.Collator('tr') (§8)
│   ├── date.ts              formatDate(value, pattern) Day.js ile (§8)
│   ├── pickLocalized.ts     pickLocalized(tr, en, language) — Türkçe fallback (§8)
│   └── route.ts             getRouteHandle() UIMatch üzerinde tipli guard (§6)
├── locales/
│   ├── tr.json
│   └── en.json
├── styles/                  SCSS (SMACSS) + token alias'ları (§9)
│   ├── main.scss            Giriş: base/layout/module partial'larını @use + primeicons @import, @layer tw-base/primereact/tw-components/tw-utilities sırası + katmanlarda Tailwind + 14px base/antialiased (§9)
│   ├── base/_typography.scss  @font-face Inter (variable woff2, latin + latin-ext) (§9)
│   ├── fonts/               Self-hosted Inter variable woff2 (latin + latin-ext) — npm bağımlılığı yok (§9)
│   ├── images/pattern.png   Self-hosted PrimeVue/Atlantis pattern asset'i (lisanslı, Inter fontu gibi) — --glow-image'a verilir (§9)
│   ├── layout/_layout.scss    .l-layout wrapper (relative, ground + --glow-image/--glow-blend ile pattern arka planı) + .l-content offset kolonu (§9)
│   ├── layout/_sidebar.scss   .l-sidebar kabuğu — TRANSPARAN (yüzey/gölge yok), sabit 21rem, brand, gruplu nav, 8px primary border-left aksanı; .l-sidebar-drawer mobil panel override'ları (§9)
│   ├── layout/_topbar.scss    .l-topbar kabuğu — transparan (start cluster, aksiyon chip'leri, yalnız-:focus-visible odak) (§9)
│   ├── modules/_card.scss     .card RAISED yüzey (card-bg + 1px border + hafif gölge, radius 8px, padding 14px) (§9)
│   ├── utils/_tokens.scss   v10 tema değişkenlerinin + app-* özel token'larının SCSS alias'ları (bileşen SCSS'i için)
│   └── theme/_dark.scss     Özel app token'ları (:root + .dark) — app-ground/card/radii/sidebar-width + mod-bağımsız --glow-* pattern token'ları; --app-background serin ground'a katlandı (FOUC) (§9)
├── types/
│   ├── route.types.ts       AppRouteHandle { titleKey; title?(args) } (§6)
│   ├── i18n.types.ts        TranslationKey (en.json'dan DotPaths) — taşınabilir, i18next referansı yok (§8)
│   └── i18next-augmentation.ts  yalnız-app ambient i18next CustomTypeOptions augmentation (typeof en.json). i18n.types.ts'ten ayrıldı ki node-tipli test projesi (route type'ları üzerinden i18n.types'ı çeken) TS2664'e düşmesin; TranslationKey testlerde import-güvenli kalır (§8)
└── modules/
    ├── patients/
    │   ├── api/
    │   │   ├── patients.api.ts      GET ham satırlar (tek-seferlik seed)
    │   │   └── patients.storage.ts  localStorage CRUD servisi (§10)
    │   ├── models/          patient.model.ts (PatientRecord düz alanlar + enum'lar)
    │   ├── lib/
    │   │   ├── patient.mapper.ts    ham snake_case → camelCase model (§10)
    │   │   ├── patient.form.ts      form değerleri ↔ model (§3.1)
    │   │   └── patient-form.schema.ts  Yup schema (§3.1)
    │   ├── composables/     usePatients.ts (query+seed), usePatientMutations.ts (CRUD)
    │   ├── components/       PatientList, PatientForm, PatientDialog, …
    │   ├── constants/
    │   │   ├── patient-options.constants.ts
    │   │   └── query-keys.ts            patientKeys factory (§10)
    │   ├── pages/            PatientsPage.tsx (ince)
    │   ├── routes.tsx        PATIENT_ROUTES constant'ları + route dizisi (§6)
    │   └── index.ts          barrel (public API + routes + route constant'ları)
    └── docs/                 Uygulama-içi dokümantasyon görüntüleyici (§13)
        ├── components/       Markdown renderer (react-markdown + remark-gfm)
        ├── constants/        docs-registry.ts (slug + titleKey; tek kaynak)
        ├── pages/            DocsOverviewPage.tsx (/docs), DocViewerPage.tsx (/docs/:slug)
        ├── routes.tsx        DOCS_ROUTES constant'ları + route dizisi
        └── index.ts          barrel

Repo kökü: index.html (<link id="app-theme"> + paint-öncesi theme-mode script'i + favicon link'i tutar, §9),
public/favicon.svg (app işareti; index.html referans alır),
README.md, .env.example, .nvmrc, vercel.json,
package.json, vite.config.ts, tsconfig.json (+ tsconfig.app/node/test.json; test.json = src/__test__ *.test.ts için node-tipli config), eslint.config.js, tailwind.config.ts,
postcss.config.js, stylelint.config.js, commitlint.config.js, .husky/,
release-please-config.json, .release-please-manifest.json,
tools/eslint/no-explanatory-comments.js (custom lint kuralı, §12),
.github/{workflows/ci.yml, workflows/release.yml, dependabot.yml}
docs/{en,tr}/  (docs modülü tarafından uygulama-içinde render edilir)
```

`.env` gitignore'dadır ve asla commit edilmez; `.env.example` gerekli
değişkenleri belgeler. Lockfile commit edilir; her yerde `npm ci` kullanılır.

## 3.1 Global Altyapı İndeksi

Tekrar kullanılabilir yapı taşları global katmanlarda yaşar ve çağrı yerlerinde
zorunludur. Tam davranış ve prop'lar: `docs/tr/COMPONENTS.md`. Modül kodu bunlara
referans verir; asla yeniden uygulamaz.

**Components** (`src/components`):

- `AppDataTable` — tek tablo. PrimeReact DataTable'ı sarar; Türkçe-duyarlı (global
  + kolon filtreleri kayıtlı `nfcContains` ile; Türkçe-collator kolon sıralaması
  `compareTurkish` ile). Header = bir `toolbar` aksiyon slotu + global arama kutusu
  + filtre-temizle butonu (arama + kolon filtrelerini sıfırlar). Kolon filtreleri
  `filterDisplay` + `defaultFilters` ile (filtre state'i içeride yönetilir). İki-mod
  loading (ilk/boş → `Loading` bileşeni; arka plan refetch → DataTable overlay).
  Responsive paginator (`useMediaQuery` mobil/masaüstü template) + `{first} - {last}
  / {total}` raporu. `emptyMessageKey` → `t()`. Prop'lar: `data`, `children`
  (kolonlar), `dataKey`, `loading`, `toolbar`, `showSearchBox`, `globalFilterFields`,
  `filterDisplay`, `defaultFilters`, controlled sort (`sortField` / `sortOrder` /
  `onSort`), `paginator`, `rows`, `rowsPerPageOptions`, `rowClass` / `rowHover` /
  `stripedRows`, `emptyMessageKey`. Görevi DEĞİL: veri çekme, sayfa hataları.
  Selection / expansion / grouping yok; rowClick 1.2 kararı. `buildInitialFilters`
  unit-test'li saf çekirdektir. (Kesin responsive prop + hasta kolonları 1.2'de.)
- `AppToastProvider` — tek PrimeReact `<Toast/>`'u mount eder; `useNotify`'ı besler.
- `Loading` — lazy-route Suspense fallback (skeleton yok).
- `ErrorState` — sayfa-içi beklenen-veri hatası + `onRetry` (beklenmeyen
  bug'ları yakalayan error boundary'lerden ayrıdır).
- `RouteErrorBoundary` — React Router `errorElement` (`useRouteError`);
  `isRouteErrorResponse` 404 → `errors.notFound`, değilse `errors.unexpected`, ana
  sayfa link'i ile (dev hata mesajını gösterir).
- `AppErrorBoundary` — **en dışta** mount edilen class boundary (`StrictMode`'un hemen
  içinde, provider'ları sarar) → `FatalError`; altındaki her render çökmesini yakalar.
- `FatalError`, `ConfigErrorScreen` — HER İKİSİ de react-i18next **singleton**'ını
  (`i18n.t`) + düz JSX (PrimeReact/hook yok) kullanan fallback ekranları; böylece
  çökmüş veya provider-öncesi ağaçta da çalışırlar. `FatalError` = AppErrorBoundary
  son-çaresi (reload butonu); `ConfigErrorScreen` = provider-öncesi env hatası (dev:
  değişken adları; prod: i18n mesajı).
- `form/Form*` — Formik↔PrimeReact alan wrapper'ları (`FormInputText`,
  `FormDropdown`, `FormCalendar`, `FormInputNumber`, `FormCheckbox`,
  `FormChips`); i18n label + hata gösterimi gömülü.
- `layout/App*` — `AppLayout`, `AppSidebar`, `AppTopbar`, `AppLogo`,
  `AppLanguageSwitcher`, `AppThemeToggle`. `AppLogo` marka işaretidir (token-renkli
  inline SVG + `BRAND_NAME` constant wordmark — özel ad, i18n değil);
  `AppLanguageSwitcher` YALNIZ aktif dil kodunu (`TR`/`EN`) gösteren tek bir metin
  chip'idir; tıklanınca `i18n.changeLanguage` ile diğerine geçer (§8). `AppThemeToggle`
  ile birlikte dairesel `.l-topbar-chip` yüzey stilini paylaşır (§9).
  Kabuk stili `styles/layout/_sidebar.scss` + `_topbar.scss`'te; yeniden-kullanılır
  içerik yüzeyi `.card` modülüdür (`styles/modules/_card.scss`, §9).

**Composables** (`src/composables`): `useMenu` (tek menü kaynağı — her modülün
route constant'larını barrel üzerinden + docs registry'yi toplar, `menuOrder`'a
göre sıralar, etiketleri `t(titleKey)` ile çözer; `AppSidebar` yalnız onu render
eder); `useNotify` (success/error/info; YALNIZ bir `TranslationKey` kabul eder —
literal derleme hatasıdır, §8; `useNotify.lib`'deki saf `normalizeErrorKey`
bilinmeyen hatayı `errors.unexpected`'e eşler); `useMediaQuery` (responsive UI için
matchMedia hook'u, ör. AppDataTable paginator'ı).

**Lib** (`src/lib`): `text` (Türkçe normalize + collator), `date` (`formatDate`),
`pickLocalized`, `route` (`getRouteHandle`).

**Hata yüzeyleri** (dört, asla karıştırılmaz): beklenen veri-yükleme hatası →
`ErrorState` (sayfa-içi, retry); beklenmeyen runtime bug → `RouteErrorBoundary` /
`AppErrorBoundary`; kullanıcı-eylemi geri bildirimi → `useNotify` toast;
eksik/geçersiz env → `ConfigErrorScreen` (uygulama mount'tan önce).

## 4. Modül İndeksi

Her modül yukarıdaki iç düzeni izler. Modül başına detay (public API, dosya
haritası, bağımlılıklar, açık-olmayan davranış) modül README'lerinde değil
dokümanlarda yaşar. CLAUDE.md ilgili dokümana ve onun `en` sürümüne referans verir.

| Modül      | Açıklama (TR / EN) — yalnızca dokümantasyon | Detay dokümanı                |
| ---------- | ------------------------------------------- | ----------------------------- |
| `patients` | Hasta takibi / Patient tracking             | `docs/tr/modules/PATIENTS.md` |
| `docs`     | Doküman görüntüleyici / Docs viewer         | `docs/tr/modules/DOCS.md`     |

Açıklama sütunu yalnızca dokümantasyondur. Bir ekranın UI başlığı bu tablodan
değil, route handle'ından (§6) gelir. Yeni modüller buraya eklenir ve aynı
değişiklikte `docs/{en,tr}/modules/<NAME>.md` verilir.

## 5. Modül Bağımlılık Kuralları

- Modüller birbirini YALNIZCA barrel üzerinden import eder:
  `import { … } from '@/modules/x'`. Derin import'lar
  (`@/modules/x/composables/...`) yasaktır.
- Bir modül asla bir kardeşin iç dosyalarını import etmez. Paylaşılan mantık bir
  global katmana taşınır (§2 yerleştirme kuralı).
- Modüller-arası navigasyon, hedef modülün route constant'larını barrel'ından
  okur (modül → modül barrel import'u, §5 buna izin verir). Ayrı bir global
  route-isim registry'si yoktur.
- Global katmanlar (`router/index.tsx`'teki router, `useMenu`) route/menü
  toplamak için modül barrel'larını import eder. Bu global → modül'dür, serbest.
- Belgelenmiş istisnalar (henüz yok) burada tek-satır gerekçeyle listelenir.

## 6. Routing (React Router) — kimlik doğrulama yok

Bu uygulamada auth yok: route guard yok, korumalı ya da rol-kapısı yok, login ya
da 403 route'u yok. Router bir layout, modül route'ları, uygulama-içi docs
route'ları ve bir 404'tür. Varsayılan index route'u `patients`'e yönlendirir.

- **Route constant'ları, asla hardcoded string.** Her modül route'larını kendi
  `routes.tsx`'inde bildirir (ör. `PATIENT_ROUTES`): `name` (stabil İngilizce
  id), `path` (URL), `titleKey` (i18n anahtarı — asla hardcoded görünür metin,
  §8), isteğe bağlı `icon` ve `menuOrder` (menü için) ve dinamik parametreler için
  bir `build()` yardımcısı. Modül barrel'ı bunları yeniden export eder ki router
  ve `useMenu` okuyabilsin.
- **Path ile gez — tek deyim.** Constant'ın `path` / `build(id)`'sini `<Link to=…>`
  ya da `navigate(…)` ile kullan. React Router'da isimli route yok; `name` menü
  anahtarları ve eşleştirme için bir id'dir, navigasyon için değil.
- **Modül başına route dizileri.** Her modül lazy bileşenler ve tipli bir `handle`
  (`AppRouteHandle`) ile tipli bir `RouteObject[]` export eder.
- **Toplama `router/index.tsx`'te.** Tek bir `AppLayout` route'u kurar; kök
  `errorElement={<RouteErrorBoundary/>}`, çocukları: `patients`'e index redirect,
  yayılmış modül dizileri ve bir `*` 404, ve `createBrowserRouter` çağırır.
  `AppErrorBoundary` son-çare emniyet ağı olarak `RouterProvider`'ı sarar. HTML5
  history → SPA rewrite (`vercel.json`; bkz. §15 / `docs/tr/WORKFLOW.md`).
- **Layout + başlık (statik ya da dinamik).** `AppLayout` `<Outlet/>` +
  `<ScrollRestoration/>` render eder ve `document.title`'ı en derin eşleşmenin
  handle'ından `useMatches()` + `getRouteHandle` (`lib/route.ts`) ile ayarlar:
  handle'da `title` varsa eşleşmeyle çağrılır (doc slug'ı ya da hasta adı gibi
  dinamik per-kayıt başlıklar için); yoksa `t(titleKey)` kullanılır. Eşleşme /
  dil değişiminde yeniden çalışır. Sayfalar ince kalır.
- **Route handle, tipli.** `types/route.types.ts`:
  `AppRouteHandle { titleKey: string; title?: (match: UIMatch) => string }`.
  Yalnızca başlık — menü handle'da DEĞİL.
- **Menü route constant'larından türetilir (drift yok).** `useMenu` composable'ı
  (`src/composables`) tek menü kaynağıdır: her modülün route constant'larını
  barrel üzerinden toplar, `menuOrder`'a göre sıralar, etiketi `t(titleKey)`'den
  çözer ve docs grubunu docs registry'den (§13) ekler. `AppSidebar` yalnız
  `useMenu`'nun döndürdüğünü render eder — asla elle-yazılmış dizi.
- **Dinamik parametreler.** Path'te bildirilir (`/patients/:patientId`), tipli bir
  `build(patientId)` yardımcısıyla; parametreler string okunur, tüketildiği yerde
  parse edilir.

Path'ler dil-nötr İngilizce'dir (`/patients`); etiketler i18n'den handle ile
gelir, asla path'ten değil.

```ts
export const PATIENT_ROUTES = {
  LIST: {
    name: 'patients',
    path: '/patients',
    titleKey: 'patients.title',
    icon: 'pi pi-users',
    menuOrder: 1,
  },
} as const

export const patientRoutes: RouteObject[] = [
  {
    path: PATIENT_ROUTES.LIST.path,
    lazy: async () => ({ Component: (await import('./pages/PatientsPage')).default }),
    handle: { titleKey: PATIENT_ROUTES.LIST.titleKey } satisfies AppRouteHandle,
  },
]
```

Otoriter detay: `docs/tr/ARCHITECTURE.md`.

## 7. İsimlendirme

Tanımlayıcılar açıklayıcı tam kelimelerdir. Uzunluk önemli değil; anlamsız
kısaltmalar yasaktır (`submitNewPatientButton`, `sbmtBtn` değil).

| Kategori     | Konvansiyon            | Örnek                          |
| ------------ | ---------------------- | ------------------------------ |
| Klasörler    | kebab-case             | `modules/patients/`            |
| Bileşenler   | PascalCase.tsx         | `PatientList.tsx`, `AppDataTable.tsx` |
| Composables  | useCamelCase.ts        | `usePatients.ts`              |
| API modülleri| camelCase.api.ts       | `patients.api.ts`             |
| Storage      | camelCase.storage.ts   | `patients.storage.ts`         |
| Modeller     | camelCase.model.ts     | `patient.model.ts`            |
| Mapper'lar   | camelCase.mapper.ts    | `patient.mapper.ts`           |
| Saf yardımcı | camelCase.ts           | `pickLocalized.ts`            |
| Constant'lar | kebab-case.constants.ts| `patient-options.constants.ts`|
| Route'lar    | routes.tsx             | `routes.tsx`                  |

Bildirimler: varsayılan `const`, yalnızca yeniden atanınca `let`. `var` yok.

**Açıklayıcı yorum ve JSDoc yok.** Niyet; isimler, yapı ve dokümanlarla taşınır.
Özel lint kuralı `local/no-explanatory-comments` ile dayatılır (§12). Kuralın izin
verdiği tek yorumlar şunlardır: `eslint-disable*` / `eslint-enable`, `@ts-*`,
`prettier-ignore`, `global` / `globals`, triple-slash `/// <reference>`
direktifleri, Vite `@vite-ignore` magic yorumu (yalnızca Vite — webpack yok),
shebang satırları ve boş yorumlar. Bu listede olmayan, kaçınılmaz nadir açıklayıcı
yorum (ör. listede olmayan bir direktif) açık bir `eslint-disable-next-line
local/no-explanatory-comments` ile yazılır; böylece asla alışkanlık olmaz ve
review'da her zaman görünür.

## 8. Metin ve i18n

- **JS/JSX'te insan-okur string literal yok.** Kullanıcıya görünen her string
  locale JSON'dan gelir (`src/locales/tr.json`, `en.json`). Bu; JSX metnini ve şu
  UI niteliklerini kapsar: `placeholder`, `title`, `label`, `header`, `alt`,
  `aria-label`, `tooltip`, `emptyMessage`, ayrıca toast mesajları, Yup mesajları
  ve route `titleKey`. Teknik string'ler constant kalır: `className`, route
  `path`/`name`, query key'ler, ikon adları, enum DEĞERLERİ, tarih pattern'leri,
  `severity`, `field`, `dataKey`, `data-testid`.
- **Dayatma katmanlı.** (a) `eslint-plugin-i18next` `no-literal-string` JSX-only
  modda; bir `jsx-attributes` whitelist'i (yukarıdaki UI nitelikleri) ve
  `t`/`i18n.t`/`clsx`/`cn`'i dışlayan `callees` ile; test ve constants
  dosyalarında kapalı (§12). (b) Lint'in görmediği yerler — toast ve doğrulama
  string'leri — review ile değil TİPLE kapatılır: `useNotify` yalnız bir
  `TranslationKey` kabul eder (`types/i18n.types.ts`) ve Yup mesajları, anahtarı
  `TranslationKey` tipli `{ key, values }`'yi serialize eden `message(key, values)`
  yardımcısından (`plugins/yup.ts`) geçer; her iki yerde de ham literal derleme
  hatasıdır.
- **Tüm Yup mesajları `message()`'ten geçer.** Her `setLocale` girdisi VE her özel
  `.test()` / satır-içi şema mesajı `message(key, values)` kullanmalı ki
  `TranslationKey`-tipli ve dile-tepkili kalsın; `FormField` bunları render-anında
  `resolveValidationMessage` → `t(key, values)` ile çözer (`{{min}}`/`{{max}}`
  interpolasyonu). `resolveValidationMessage`'ın ham-string fallback'i nazik
  bozulmadır, ham literal geçme lisansı DEĞİL.
- **Anahtar tipleme (`types/i18n.types.ts`).** `TranslationKey`, EN locale şeklinden
  (`resolveJsonModule` ile `typeof en.json`) türetilen yaprak nokta-yol birleşimidir
  (özyinelemeli `DotPaths`). Aynı şekil i18next'in `CustomTypeOptions.resources`'ını
  augment eder; böylece `t()`'nin kendisi de native olarak anahtar-denetlenir — yanlış
  anahtar derleme hatasıdır (`t()` → TS2345, `satisfies TranslationKey` yuvası →
  TS1360). Anahtar kümesinin doğruluk kaynağı EN'dir; `tr.json` ona uymalıdır (bir
  `node:test` pariteyi doğrular).
- Yeni anahtar aynı değişiklikte HEM `tr.json` HEM `en.json`'a eklenir.
- **Kritik desen.** Enum değeri bir constant'tır; etiketi çevrilir: status değeri
  `'waiting'`, etiket ``t(`patients.status.${status}`)``.
- **Enum kodları locale anahtarlarıdır (0.5 → 1.1 forward-contract).** Kanonik kodlar
  locale dosyalarında `patients.{status,priority,department,bloodType}` altında yaşar.
  Model ve mapper'daki (`models/patient.model.ts`, `lib/patient.mapper.ts`, §10)
  status/priority/department enum union'ları TAM olarak bu kodları kullanmalı; mapper
  API'nin Türkçe görünen değerlerini (ör. `Bekliyor` → `waiting`, `acil` → `urgent`,
  `Dahiliye` → `internalMedicine`) bunlara normalize eder. `bloodType` anahtarları ham
  notasyondur (`0+`…); EN etiketleri `O` harfini kullanır, TR sıfırı korur.

### İki dilli içerik alanları (düz) + `pickLocalized`

API düz yerelleştirilmiş alanlar döner (`note_tr`, `note_en`, `diagnosis_tr`,
`diagnosis_en`). Mapper DÜZ bir camelCase model üretir — `noteTr`, `noteEn`,
`diagnosisTr`, `diagnosisEn` — nesting yok ve `LocalizedText` nesnesi yok.
Gösterim aktif dili Türkçe fallback ile seçer:

```ts
export const pickLocalized = (tr: string, en: string, language: string): string => {
  const base = language.split('-')[0]
  return base === 'en' ? (en || tr) : (tr || en)
}
```

`pickLocalized(patient.noteTr, patient.noteEn, i18n.language)` ile render edilir.
Ekle/düzenle formu TÜM alanları gösterir (`noteTr` + `noteEn`, `diagnosisTr` +
`diagnosisEn`) yan yana, aktif dilden bağımsız (sekme yok).

### PrimeReact locale + tarihler (tek dil akışı)

PrimeReact'in kendi bileşen string'leri react-i18next ile değil, kendi Locale
API'siyle yönetilir (`primelocale`'den `tr`/`en` girdileri). Dil değiştirme
`AppLanguageSwitcher`'da tek akıştır: `i18n.changeLanguage` → PrimeReact
`setLocale` → `setDayjsLocale` → `<html lang>` güncelle. Tarihler tek bir
yardımcı kullanır, `formatDate(value, pattern = 'L')` (`lib/date.ts`, Day.js +
aktif locale; geçersiz ISO'da `''`); `localizedFormat` token'ları alana göre
(`birthDate` → `'L'`, `appointmentDate` → `'LLL'`). Dağınık `toLocaleString`
yasaktır. Tarihler model'de ISO string'tir; Calendar `Date` kaydetmede ISO'ya
çevrilir.

### Türkçe-duyarlı metin

Arama/filtre `.normalize('NFC').toLocaleLowerCase('tr')` ile normalize eder;
sıralama `new Intl.Collator('tr', { numeric: true }).compare` kullanır. Bunlar
`lib/text.ts`'te yaşar; `nfcContains` filtresi `plugins/primereact.ts`'te kayıt
edilir ve `AppDataTable`'a bağlanır (§3.1). Detay: `docs/tr/I18N.md`.

## 9. Stil — Tek Token Kaynağı, Çok Tüketici (PrimeReact v10)

PrimeReact 10 legacy tema-CSS modelini kullanır. Tek tasarım-token kaynağı
import edilen Lara Green tema stylesheet'idir; v10 CSS değişkenlerini açar
(`--primary-color`, `--surface-0..900`, `--surface-ground`, `--surface-card`,
`--surface-border`, `--text-color`, `--text-color-secondary`, …). Tailwind ve
SCSS AYNI değişkenleri tüketir. **Ham hex renkler her yerde yasaktır.** Otoriter
detay: `docs/tr/STYLING.md`.

### Tema kaynağı + koyu mod (tek anahtar her şeyi sürer)

Tema, kurulu paketin resources path'inden Vite `?url` import'larıyla beslenir —
public kopya yok, SASS yok, `changeTheme` yok:

```ts
import lightThemeUrl from 'primereact/resources/themes/lara-light-green/theme.css?url'
import darkThemeUrl  from 'primereact/resources/themes/lara-dark-green/theme.css?url'
```

`plugins/theme.ts` bir `<link id="app-theme">` ve `setThemeMode(mode)` sahiplenir;
bu, o link'in `href`'ini light ya da dark URL'ye ayarlar, `<html>` üzerindeki
`dark` sınıfını toggle eder ve `theme-mode`'u `localStorage`'a yazar.
`AppThemeToggle` bunu çağırır. Flash'ı önlemek için `index.html`'deki küçük bir
inline script, React render'dan ÖNCE `theme-mode`'u okuyup `dark` sınıfını
ayarlar (böylece arka plan — her iki mod için tanımlı bir custom token — ilk
paint'te doğru olur); tema stylesheet `href`'i bootstrap'ta (`main.tsx`) aynı
`theme-mode`'dan uygulanır. Tek anahtar, iki etki (stylesheet + `dark` sınıfı) —
asla üçüncü bir mekanizma ekleme.

### Her renk her iki mod için tanımlıdır

light/dark tema dosyaları v10 değişkenlerini yeniden tanımladığından, bu
değişkenler üzerine kurulan her şey otomatik mod-doğrudur — yani **token-destekli
renklerde Tailwind `dark:` varyantı KULLANMA; swap zaten mod-doğru yapar.**
`.dark` sınıfı YALNIZ PrimeReact'in sağlamadığı uygulamaya-özel custom token'lar
için vardır; HER İKİ mod için bir kez tanımlanır — `:root { … }` ve `.dark { … }`
altında (Tailwind'in değiştirdiği aynı sınıf) — asla tek-modlu hardcoded değer.

**Token renklerinde `/alpha` yok.** Köprülenmiş Tailwind renkleri düz `var(--…)`
değerleridir (`<alpha-value>` kanalı yok), bu yüzden Tailwind'in opaklık modifikatörü
(`bg-primary/10`, `text-text/50`) onlarda ÇALIŞMAZ. Hover / active / selected durumları
için opaklık varyantı yerine **solid bir surface adımı** (`bg-surface-100`,
`bg-surface-200`, …) kullan — bunlar swap ile mod-doğrudur.

### Önce tema değişkeni; custom token yalnız gerektiğinde

Uygun bir tema değişkeni olan herhangi bir renk/yüzey için varsayılan olarak bir
Lara tema değişkeni kullan — köprülenmiş Tailwind token'ları (`primary`,
`surface.*`, `ground`, `card`, `surface-border`, `text`, `text-secondary`) ya da
`_tokens.scss` alias'ları üzerinden. Bu, PrimeReact ile Tailwind'i TEK bir palette
tutar, tema swap'i sayesinde mod-doğrudur (`dark:` yok). Uygulamaya-özel bir CUSTOM
token'ı (`:root` + `.dark`, her iki mod — ör. `--app-background`, FOUC arka planı)
YALNIZCA uygun bir tema değişkeni yokken VEYA net bir işlevsel neden varken tanımla
(ör. tema link'i yüklenmeden önce gereken bir değer). Muhakeme kullan: önce mevcut
bir değişkene uzan; paleti paralel custom renklerle parçalama.

### App kabuğu özel token'ları (Atlantis-esinli)

Kabuk, `theme/_dark.scss`'te uygulamaya-özel custom token'lar ekler (renk token'ları
her iki mod, `:root` + `.dark`; radius/genişlik/`--glow-*` mod-bağımsız, yalnız
`:root`); `utils/_tokens.scss`'te alias'lanır ve TSX'in kullandığı yerde
`tailwind.config.ts`'te Tailwind'e açılır (`bg-app-ground`, `w-sidebar`). Renk
literal'leri YALNIZCA bu tanımlarda yaşar (dosya
konvansiyonuna uymak için hex değil `rgb()` yazılır); her tüketici token'ı kullanır:

| Token | Açık | Koyu |
| --- | --- | --- |
| `--app-ground` (wrapper/body bg) | `rgb(248 250 252)` | `rgb(9 9 11)` |
| `--app-background` (FOUC, = ground) | `var(--app-ground)` | `var(--app-ground)` |
| `--app-card-bg` (raised kart yüzeyi) | `rgb(255 255 255)` | `rgb(24 24 27)` |
| `--app-card-border` | `rgb(226 232 240)` | `rgb(63 63 70)` |
| `--app-card-shadow` | `0 1px 2px rgb(15 23 42 / 4%), 0 1px 3px rgb(15 23 42 / 6%)` | `none` |
| `--app-menu-item-hover-bg` (sidebar hover/active overlay) | `rgb(100 116 139 / 10%)` | `rgb(255 255 255 / 5%)` |
| `--app-radius-card` / `-item` | `8px` / `8px` | aynı |
| `--app-radius-sidebar` / `-drawer` (masaüstü panel / mobil drawer sağ köşeleri) | `16px` / `16px` | aynı |
| `--app-sidebar-width` | `21rem` (sidebar genişliği; içerik offset'i `+ 1rem` = 22rem) | aynı |
| `--glow-image` (pattern asset'i) | `url('../images/pattern.png')` | aynı |
| `--glow-blend` (pattern blend) | `hard-light, multiply` | aynı |

**Yüzey modeli (Atlantis görünümünün özü): SIDEBAR DÜZ katmandır, KARTLAR RAISED
katmandır.** Sidebar'ın arka planı, border'ı, gölgesi YOK — menü doğrudan ground
üzerinde durur ve dekoratif desen arkasından görünür. Tek yükseltilmiş yüzey `.card`
modülüdür: `--app-card-bg` (ground'dan farklı) + 1px `--app-card-border` + hafif
`--app-card-shadow` (koyuda `none`'a iner, ayrımı border taşır). `--app-background` ilk
boyama eşleşsin diye ground'a katlanır. Favicon/Inter/`pattern.png` asset'leri sabit
marka/dekoratif literal'lerdir, tema token'ı DEĞİL — tek onaylı token-dışı renkler.

### Statik layout + dekoratif arka plan

`.l-layout` (wrapper, `position: relative`, `bg-app-ground`, `min-block-size: 100vh`)
sabit sidebar'ı ve `.l-content`'i — içerik kolonunu (`padding: 2rem`, `position: relative`,
`z-index: 1`, `overflow-x: hidden`) — tutar. `>= lg`'de kolon, sabit sidebar'ın sağına
`margin-inline-start: calc(var(--app-sidebar-width) + 1rem)` (= 22rem) ile offset'lenir;
bu `_layout.scss`'te tanımlıdır (Tailwind utility değil, böylece collapse onu
transition'layabilir). **Topbar `.l-content` İÇİNDE yaşar** (`.l-topbar`: transparan,
`justify-content: space-between`, `margin-block-end: 2rem`; `.l-topbar-start` = hamburger
2.5rem + başlık, gap 1.5rem; avatar/search yok). Sağ küme (`.l-topbar-actions`) dil + tema
**chip'leridir**: `.l-topbar-chip` = dairesel (`border-radius: 50%`), `2.5rem`,
`--surface-card` arka plan, `--surface-100` hover. Hamburger NÖTR bir ikondur
(`.l-topbar-iconbtn` → `--text-color-secondary`, Lara text-button primary'sini
`tw-components` katmanıyla yener), primary değil. Tüm topbar butonları
**yalnız-`:focus-visible`**'dır: `.l-topbar-iconbtn:focus` PrimeReact
box-shadow/outline'ını temizler (fare tıklamasında halka yok), `:focus-visible` klavye
odağı için 2px primary halkayı geri getirir (§16).
**Sidebar** (`.l-sidebar` + `.l-sidebar-fixed`): **transparan**, fixed, tam yükseklik,
`21rem`, `border-radius: 0 var(--app-radius-sidebar) var(--app-radius-sidebar) 0` (16px),
gölge/border YOK; menü padding `0 1.5rem`,
gruplar `margin-bottom: 2.25rem` (ilki `margin-top: 2rem`), section etiketi
`0.857rem`/600/uppercase/muted, item'lar `padding: 0.5rem 1rem` +
`border-inline-start: 8px solid transparent`; **aktif = `border-inline-start-color: primary`
(8px yeşil aksan) + `--app-menu-item-hover-bg`** (metin rengi değişmez), hover = aynı
overlay.
**Sidebar toggle.** Topbar hamburger'ı tüm genişliklerde görünür. `>= lg`'de `.l-layout`
üzerinde bir `.is-collapsed` modifier'ı toggle eder (state `AppLayout`'ta,
`useMediaQuery('(min-width: 1024px)')` ile dallanır): collapsed → `.l-sidebar-fixed`
`transform: translateX(-100%)` ve `.l-content` `margin-inline-start: 0` (içerik tam
genişliğe akar), ikisi de `0.3s cubic-bezier(0,0,0.2,1)` transition'lı. `lg` altında
hamburger yerine **mobil drawer'ı** açar — `showCloseIcon`'lu PrimeReact `<Sidebar>`,
`pt.root` + `.l-sidebar-drawer` ile yeniden stillenir: OPAK `--app-ground` panel (Lara
yüzeyini override eder, iki modda da sayfa ground'uyla eşleşir), `border-radius: 0
var(--app-radius-drawer) var(--app-radius-drawer) 0` (16px), `box-shadow: none` (ayrımı
backdrop sağlar), `overflow: hidden`, genişlik `w-sidebar` + `max-w-[85vw]` sınırı.
`.p-sidebar-header`'ı sağ-üstte ABSOLUTE konumludur (`padding: 1rem`, `z-index: 1`),
böylece kapatma (X) yüzer ve dikey yer kaplamaz — drawer aynı `SidebarContent`'i (logo +
menü) render eder, logo en üstte, masaüstü offset'inde (`.l-sidebar-brand` padding'i).
Drawer route değişiminde kapanır; collapse transform `>= lg`'ye kapılıdır. Dekoratif arka
plan doğrudan `.l-layout` üzerindedir: **self-hosted** `images/pattern.png` (lisanslı
PrimeVue/Atlantis pattern asset'i, Inter fontu gibi self-hosted — asla hot-link değil),
mod-bağımsız `--glow-image` + `--glow-blend` token'larıyla —
`background-image: var(--glow-image)`, `background-blend-mode: var(--glow-blend)`
(`hard-light, multiply`), `background-position: top`, `background-repeat: no-repeat`,
`background-size: auto 20rem` — elemanın `--app-ground` `background-color`'ına karşı
blend'lenir (blend'in bir tabanı olsun diye `.l-layout` üzerinde KALMALI); böylece TEK
asset iki moda da uyum sağlar. Transparan sidebar + topbar'ın arkasında görünür; opak
drawer onu örter. Atlantis breakpoint'i 992px; biz Tailwind `lg` (1024px) kullanırız ki
drawer eşiği mobil kuralımızla uyuşsun.

### Custom SCSS doğru cascade katmanına gider (`@layer`-merge mekanizması)

Sass `@use` üst-düzey olmalı; bu yüzden custom kuralları doğru CSS cascade katmanına
indirmek için her kabuk/modül partial'ı **kurallarını `@layer tw-components { … }`
içine sarar** (aynı adlı katmanlar kaynak konumundan bağımsız birleşir); `@font-face`
ve `:root`/`.dark` custom-property blokları KATMANSIZ kalır (onlar için doğru).
`main.scss` partial'ları `@use`'lar (`base/_typography`, `layout/_layout`,
`layout/_sidebar`, `layout/_topbar`, `modules/_card`). Katman SIRASI `index.html` inline anchor'ı ile
kilitli kalır (§9 Cascade (b)), bu yüzden partial'ların bundle içi `@layer`
ifadesinden önce görünmesi sorun değildir. Artık kullanılan SMACSS klasörleri:
`base/` (tipografi), `layout/` (`l-*` kabuk), `modules/` (`.card`); state bir
`is-active` sınıfıyla. Sınıf adları kebab-case'dir (SMACSS `l-`/`is-`), BEM `__`/`--`
DEĞİL; böylece Stylelint config değişikliği olmadan `selector-class-pattern` geçer.

### Tipografi (Inter, self-hosted)

`base/_typography.scss` **self-hosted Inter variable woff2**'yi `@font-face`'ler (latin
+ latin-ext alt kümeleri `styles/fonts/`'ta, `unicode-range` ile; latin-ext Türkçe
ğ/ş/ı/İ glyph'lerini kapsar) — **npm bağımlılığı yok**, tek eklenti font asset'idir.
`Inter` Tailwind config'te ilk `fontFamily.sans` girdisidir (preflight onu kullansın
diye) ve `main.scss` **14px** base boyutu + antialiasing'i `@layer tw-base`'te set eder.

### Token boru hattı

```
Lara Green tema CSS (lara-light-green / lara-dark-green, plugins/theme ile ?url-swap)
  → v10 CSS değişkenleri (--primary-color, --surface-0..900, --text-color, …)
      ├→ tailwind.config.ts  renkler doğrudan v10 değişkenlerine map'lenir
      └→ src/styles/utils/_tokens.scss  → custom SCSS için SCSS alias'ları
```

### Tailwind config (token-destekli, v10 — tailwindcss-primeui yok)

Tailwind'in kendi paleti yoktur; renkleri v10 değişkenlerini gösterir ve
`darkMode`, `<html>` `dark` sınıfıyla eşleşen `class` stratejisidir. Typography
eklentisi render edilen docs'u biçimler (§13).

```ts
import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        surface: {
          0: 'var(--surface-0)', 50: 'var(--surface-50)', 100: 'var(--surface-100)',
          200: 'var(--surface-200)', 300: 'var(--surface-300)', 400: 'var(--surface-400)',
          500: 'var(--surface-500)', 600: 'var(--surface-600)', 700: 'var(--surface-700)',
          800: 'var(--surface-800)', 900: 'var(--surface-900)',
        },
        ground: 'var(--surface-ground)',
        card: 'var(--surface-card)',
        'surface-border': 'var(--surface-border)',
        text: 'var(--text-color)',
        'text-secondary': 'var(--text-color-secondary)',
        'app-ground': 'var(--app-ground)',
      },
      width: { sidebar: 'var(--app-sidebar-width)' },
      fontFamily: { sans: ['Inter', 'system-ui', /* … platform fallback'leri */ 'sans-serif'] },
    },
  },
  plugins: [typography],
} satisfies Config
```

### SCSS token katmanı

`src/styles/utils/_tokens.scss` v10 değişkenlerini alias olarak yeniden açar ki
custom SCSS asla hex değere uzanmasın; swap onları mod-doğru tutar.

```scss
$color-primary:          var(--primary-color);
$surface-0:              var(--surface-0);
$surface-ground:         var(--surface-ground);
$surface-card:           var(--surface-card);
$surface-border:         var(--surface-border);
$text-color:             var(--text-color);
$text-color-secondary:   var(--text-color-secondary);
```

Tailwind utility'leri TSX `className`'de yaşar; SCSS `@tailwind` ya da `@apply`
KULLANMAZ. SCSS yalnız `_tokens.scss` alias'larını okur; böylece Stylelint'in
Tailwind farkındalığına gerek kalmaz.

### Hangi araç, ne zaman

| İhtiyaç                                            | Kullan                                          |
| -------------------------------------------------- | ----------------------------------------------- |
| Boşluk, yerleşim, tek-seferlik utility             | Tailwind utility (yalnız token-destekli renkler)|
| Renk                                               | `primary` / `surface` / `text` … — asla ham hex |
| PrimeReact bileşen içi                             | PrimeReact PassThrough (`pt`) + token-destekli Tailwind sınıfları |
| Tekrar kullanılır karmaşık stil, utility'nin ifade edemediği | SCSS modülü (SMACSS), yalnız `_tokens.scss` alias'larına başvurarak |
| Durum varyasyonu (open / active / selected)        | SMACSS `is-` sınıfı ya da Tailwind `data-*` varyantı |

### Cascade ve SCSS yapısı

CSS `@layer` sırası: `tw-base, primereact, tw-components, tw-utilities` (utilities
kazanır; `tw-base` en düşük). Etkin öncelik: Tailwind utilities > bizim
component'ler > PrimeReact teması > Tailwind preflight.

**(a) `tw-` öneki neden.** Tailwind v3, `base` / `components` / `utilities` çıplak
isimlerini KENDİ derleme-zamanı direktifleri olarak sahiplenir — `@tailwind base`'i
native `@layer base {}` içine sarmak Tailwind'in sarmalayıcıyı tüketip KATMANSIZ CSS
üretmesine yol açar (bu da temayı ezer). Native katmanlara önek vermek
(`tw-base` / `tw-components` / `tw-utilities`) onları Tailwind'in dokunmadığı gerçek
CSS cascade katmanları olarak korur. `primereact` aradaki tema katmanıdır.

**(b) `index.html`'deki satır-içi `<style>@layer …;` çapası İLK kalmalı** (app-theme
link'inden ve bundle CSS'inden önce). Katman sırasının yetkili bildirimidir: ham
HTML'dir, bundler/minifier'ın (lightningcss) bundle içi `@layer` ifadesini yeniden
yazmasına karşı bağışıktır ve tema çalışma-zamanında yüklenir (takaslanabilir
`<link>`), bu yüzden sıra herhangi bir sayfa yüklenmeden önce kilitlenmelidir.
Kaldırmayın/yeniden sıralamayın; isimleri `tw-*` katmanlarıyla eşleşmeli.

**(c) `--app-background` özel bir token'dır** (`theme/_dark.scss`, `:root` + `.dark`):
pre-paint FOUC betiği, tema `<link>`'i yüklenmeden ÖNCE doğru bir arka plana ihtiyaç
duyar, dolayısıyla henüz yüklenmemiş Lara `--surface-*` değişkenlerine bağlı olamaz.
Her iki mod için değer tutun; `html`'e `tw-base` içinde uygulanır.

**(d) Ayrı PrimeReact core import'u yok.** `primereact/resources/primereact.min.css`
10.9.8'de kullanımdan kaldırılmış ve BOŞtur; tüm bileşen CSS'i (yapısal + skin) temada
gelir, zaten `@layer primereact` içinde sarılıdır. Yalnız tema yüklenir (takaslanabilir
`?url` link); import veya taşınacak bir core stil sayfası yoktur.

SCSS klasörleri (`utils/` + `theme/` + `main.scss` şu an var;
`base/`/`layout/`/`modules/`/`state/` ilk kullanımda eklenir):

```
src/styles/
├── base/      reset, tipografi, element stilleri
├── layout/    l- önekli ana iskele
├── modules/   tekrar kullanılır bileşen stilleri
├── state/     is- önekli durum sınıfları
├── theme/     koyu-mod custom token'ları (.dark altında) — _dark.scss
├── utils/     _tokens.scss, mixin'ler, fonksiyonlar (çıktı yok)
└── main.scss  primeicons @import + @layer sırası + katmanlarda Tailwind
```

## 10. Durum ve Veri

`localStorage` tek kalıcı doğruluk kaynağıdır; React Query onun üzerindeki
bellek-içi cache'tir. Yazma API'si ve query persister yoktur.

- **Storage servisi** — `modules/patients/api/patients.storage.ts`,
  `STORAGE_KEY = 'patients'`'teki JSON değer üzerinde
  `patientStorage.{read, write, add, update, remove, clear}` açar. Tüm kalıcılık
  bundan geçer. `read`, eksik ya da bozuk JSON'da `[]` döner (try/catch); `write`
  quota hatasında `useNotify` ile hata bildirir. Storage şema migration'ı yok —
  model değişirse `clear` + yeniden seed (dummy veri için kabul edilebilir).
- **Okuma + seed** — `composables/usePatients.ts` `useQuery`,
  `patientStorage.read()` okur; boşsa GET'i bir kez çeker, mapper'ı çalıştırır,
  seed'i `patientStorage.write` ile yazar ve döner. Mapper yalnız bu seed yolunda
  çalışır. Seed idempotent'tir (StrictMode-güvenli).
- **Yazma (CRUD)** — `composables/usePatientMutations.ts`, storage servisini
  çağıran sonra `queryClient.invalidateQueries(patientKeys.all())` yapan
  `useMutation` kullanır. Yalnızca-invalidation — `setQueryData` yok. Reset =
  `clear` + invalidate.
- **Bildirimler** — mutation'lar success/error'da `useNotify` çağırır (§3.1).
- **QueryClient varsayılanları** (`plugins/react-query.ts`): `staleTime: Infinity`,
  `gcTime: Infinity`, `refetchOnWindowFocus: false`, `retry: 1` (yalnız seed
  GET'ini etkiler; storage okumaları senkron). Liste query'si `throwOnError: false`
  kullanır; böylece okuma hataları error boundary yerine sayfa-içi `ErrorState`
  (§3.1) render eder.
- **Query key'ler** — tek factory, `constants/query-keys.ts`, fonksiyon biçimi
  + `as const` (`patientKeys.all()` → `['patients']`; ileride
  `patientKeys.detail(id)`). Her yerden import edilir; hardcoded diziler yasak.
- **Model + mapper** — `PatientRecord` ve enum-benzeri union'ları
  `models/patient.model.ts`'te yaşar, canlı API'ye karşı doğrulanır (serbest
  `string` yok). Mapper snake_case → camelCase + enum tipleme yapar, DÜZ (nesting
  yok, §8).

Detay: `docs/tr/STATE_MANAGEMENT.md`, `docs/tr/modules/PATIENTS.md`.

## 11. Test

Runner, **Node'un yerleşik test runner'ıdır** (`node --test`, `node:test` +
`node:assert/strict` modülleri), **saf-mantık** spec'leri üzerinde — **Vitest, React
Testing Library, MSW, jsdom YOK**. Testler audit adımında (§15) PLANLANIR ve
implementation'da kodla birlikte YAZILIR.

- **Node 24 gerekir.** Spec'ler TypeScript'tir (`*.test.ts`), Node'un yerel
  type-stripping'i ile çalışır; bu **Node 24** ister (`.nvmrc`; CI onu kullanır).
  Daha eski Node'da (ör. 20) `node --test` `.ts` spec'lerini sessizce atlar ve yalnız
  JS tooling testi çalışır — testleri Node 24'te çalıştır (`nvm use`) ya da CI'a güven.
- **Ne test edilir** — saf fonksiyonlar: `lib/` (mapper, `pickLocalized`,
  `formatDate`, Türkçe normalize), saf composable çekirdekleri (`useMenu.lib`
  gruplama, `useNotify.lib`, `theme.lib`, `AppDataTable.lib`, form `validation`),
  locale parity ve custom lint kuralı (`RuleTester`). **Bileşenler, hook'lar ve
  DOM/etkileşim unit-test EDİLMEZ** (renderer yok) — kabuk/görsel davranış `validate`
  (type-check + ESLint + Stylelint + Prettier) + manuel QA ile kapsanır. Bileşen
  smoke testleri için bir DOM harness (Vitest/RTL/jsdom) eklemek ayrı bir chore olur.
- **Düzen** — spec'ler kaynak ağacını yansıtarak `src/__test__/` altında `*.test.ts`
  olarak yaşar. Value import'lar `.ts` uzantılı göreli yol kullanır (node:test `@/`
  alias'ını çözmez); yalnız-tip import'lar `@/` kullanabilir. Tooling RuleTester testi
  `tools/eslint/` içinde kalır.
- **Coverage** — zorunlu eşik yok.

Detay: `docs/tr/TESTING.md`.

## 12. Lint ve Kalite

Tek entegre zincir; Prettier tek formatter'dır.

| Araç                | Sahiplendiği                           | Çakışma çözümü                            |
| ------------------- | -------------------------------------- | ----------------------------------------- |
| typescript-eslint   | TS/React doğruluğu, kural ihlalleri; no-`any` politikası (aşağıda) | —             |
| eslint-plugin-i18next | `no-literal-string` (JSX-only, §8)   | —                                         |
| eslint-plugin-jsx-a11y | erişilebilirlik zemini (§16)        | —                                         |
| eslint-plugin-simple-import-sort | import + export sırası (zorunlu, `eslint --fix` ile otomatik düzeltilir; §5'e göre gruplar: side-effect'ler, `node:`, harici paketler (önce react), `@/` alias, göreli) | — |
| eslint-plugin-import-x | import hijyeni (tüm dosyalar): `no-duplicates` = error, `first` + `newline-after-import` = warn; `no-unresolved` kapalı (çözümlemeyi TS doğrular — resolver yok). Sıralama simple-import-sort'ta kalır (`import-x/order` kapalı) | — |
| eslint-plugin-react-hooks | `rules-of-hooks` = error, `exhaustive-deps` = error (yalnız src; kasıtlı atlanan bağımlılık için gerekçeli `eslint-disable`) | — |
| eslint-plugin-react-refresh | `only-export-components` = warn (HMR ipucu, `allowConstantExport`; barrel'lar/`routes.tsx`/`*.constants.*` için kapalı) | — |
| eslint-plugin-react (çekirdek) | seçilmiş, yalnız src: `jsx-key`, `no-array-index-key`, `no-unstable-nested-components`, `jsx-no-useless-fragment` = error; `react-in-jsx-scope` + `prop-types` kapalı (yeni JSX transform + TS); `react.version: detect` | — |
| local/no-explanatory-comments | yorum yok / JSDoc yok (§7)    | nadir istisnalar için açık `eslint-disable-next-line` |
| Prettier            | Tüm formatlama                         | `eslint-config-prettier` ESLint format kurallarını kapatır |
| Stylelint           | SCSS kalitesi, SMACSS, prop sırası     | `stylelint-config-standard-scss` + `stylelint-order` + `stylelint-prettier` |
| commitlint          | Conventional Commit mesajları (§14, §15) | `@commitlint/config-conventional` (commit-msg hook) |
| Husky + lint-staged | Staged dosyalarda pre-commit lint/format; commit-msg'de commitlint | — |

`no-literal-string` konfigü: JSX-only mod, `jsx-attributes` whitelist (§8 UI
nitelikleri), `t`/`i18n.t`/`clsx`/`cn`'i dışlayan `callees`, test ve constants
dosyalarında kapalı. `local/no-explanatory-comments` allowlist'i: `eslint-disable*` /
`eslint-enable`, `@ts-*`, `prettier-ignore`, `global` / `globals`, triple-slash
referansları, Vite `@vite-ignore` magic yorumu (yalnızca Vite — webpack yok),
shebang ve boş yorumlar. Kural yerel olarak `tools/eslint/no-explanatory-comments.js`'te
uygulanır ve `eslint.config.js`'e inline `local` plugin olarak bağlanır
(`plugins: { local: { rules: { … } } }`), `RuleTester` birim testiyle.

**`any` yok.** `@typescript-eslint/no-explicit-any`, TÜM TS dosyaları için
(`eslint.config.js`'teki `src` bloğu + `vite.config.ts` bloğu) `error` olarak
sabitlenmiştir. Recommended preset'ler bunu zaten içerir; açık sabitleme,
politikanın herhangi bir preset değişikliğinden etkilenmemesini sağlar. Örtük
taraf, iki tsconfig'deki `strict: true` (`noImplicitAny` dahil) ile kapsanır. Bir
ihlal DOĞRU DÜZGÜN bir tiple düzeltilir — kesin bir tip, `unknown` + daraltma ya
da bir generic — asla `eslint-disable`, `@ts-ignore` / `@ts-expect-error` ya da
`any`'ye yeniden cast ile susturulmaz.

Tek script her şeyi çalıştırır: `validate` = `type-check` + `lint` + `lint:style`
+ `format:check`. CI `validate` + testler + `build` + `npm audit --audit-level=high`
çalıştırır.

## 13. Dokümantasyon Sistemi

Referans haritası. Herhangi bir değişiklik için güncellenecek dokümanlar burada
aranır, tahmin edilmez. Tüm dokümanlar `docs` modülü (§3 dizin) tarafından
uygulama-içinde de render edilir; Vite `import.meta.glob('/docs/**/*.md',
{ query: '?raw', import: 'default' })` ile yüklenir, aktif dile göre seçilir.

### 13.1 Hedef kitle ve açıklık

`docs/`, yazar-olmayanlar ve son kullanıcılar dahil insanlar tarafından okunur ve
uygulama-içinde render edilir. Açık, sade dille kısa örneklerle yaz — bu dosyanın
kısa steno'su gibi değil. CLAUDE.md ajan için operasyonel steno'dur; `docs/` tüm
detaylı açıklamanın tek evidir (modül README'leri yok). Her doküman neyi
kapsadığının ve kimin ihtiyacı olduğunun tek-paragraflık sade bir özetiyle açılır.

### 13.2 Dokümantasyon indeksi

Tüm dokümanlar hem `docs/en/` hem `docs/tr/` içinde bulunur (CHANGELOG.md hariç — §13.5).

| Dosya                   | İçerik                                                   |
| ----------------------- | -------------------------------------------------------- |
| `ARCHITECTURE.md`       | Modüller, katmanlar, dizin, plugins, routing, env/config, bağımlılık kuralları |
| `COMPONENTS.md`         | Global altyapı: App* wrapper'lar, form alanları, layout, useMenu, useNotify, lib yardımcıları |
| `CODING_STANDARDS.md`   | İsimlendirme, yorum-yok kuralı, parçalama + yerleştirme, i18n-only metin, lint/format tooling |
| `STYLING.md`            | v10 tema modeli, resources ?url ile Lara Green, tema-swap koyu mod, Tailwind + SCSS token alias'ları, SMACSS, çift-mod renk |
| `STATE_MANAGEMENT.md`   | localStorage kaynağı + React Query seed, yalnız-invalidation CRUD, mapper, query key'ler |
| `I18N.md`               | Locale dosyaları, anahtarlar, düz yerelleştirilmiş alanlar + `pickLocalized`, yalnız-anahtar tipleme, PrimeReact locale, tarihler, Türkçe-duyarlı metin |
| `TESTING.md`            | Test stratejisi, MSW, düzen (`src/__test__`), öncelikler   |
| `WORKFLOW.md`           | Takım rolleri, backlog, gated akış, CI kapısı, PR-sözleşme, fast path, CI/Vercel/release mekaniği |
| `VERSIONING.md`         | release-please Release-PR akışı, Conventional-Commit bump, publish-yok |
| `SPRINT_PLAN.md`        | Yaşayan backlog + tamamlanan (✅) kayıt — kalıcı tutulur   |
| `CHANGELOG.md`          | Sürüm başına iş, release-please ile Conventional Commit'lerden repo kökünde üretilir (yalnız İngilizce; bkz. §13.5) |
| `modules/PATIENTS.md`   | Patients modül detayı (public API, dosya haritası, davranış) |
| `modules/DOCS.md`       | Docs modül detayı (registry, renderer, route'lar)            |

### 13.3 Değişiklik-tipi → güncellenecek dokümanlar

`commit + docs:sync`'te eşleşen her satırı bul ve listelenen dosyaları HER İKİ
dilde güncelle.

| Değişiklik                                       | Güncelle (en + tr)                        |
| ------------------------------------------------ | ----------------------------------------- |
| Modül / katman / bağımlılık / plugins yapısı değişti | `ARCHITECTURE.md`                     |
| Routing / menü değişti                           | `ARCHITECTURE.md`                         |
| Global bileşen / wrapper / form alanı değişti    | `COMPONENTS.md`                           |
| İsimlendirme / yorum / yerleştirme / kodlama kuralı değişti | `CODING_STANDARDS.md`          |
| Lint / format / tooling konfigü değişti          | `CODING_STANDARDS.md`                     |
| Stil token / tema / Tailwind / SCSS değişti      | `STYLING.md`                              |
| Veri / storage / CRUD / mapper / query key değişti | `STATE_MANAGEMENT.md` + `modules/PATIENTS.md` |
| i18n anahtarları, yerelleştirilmiş alanlar, tarihler ya da PrimeReact locale değişti | `I18N.md` |
| Test stratejisi / tooling değişti                | `TESTING.md`                              |
| Workflow / CI / deploy / release değişti         | `WORKFLOW.md`                             |
| Sürümleme süreci değişti                         | `VERSIONING.md`                           |
| Bir modülün davranışı değişti                    | `modules/<NAME>.md`                       |
| Bağımlılık eklendi / pinlendi / yükseltme politikası değişti | bu dosya (§1.1) + `ARCHITECTURE.md` |
| Sprint görevi tamamlandı                         | `SPRINT_PLAN.md` (✅ işaretle, asla silme)|
| Kullanıcıya görünen değişiklik gönderildi         | net bir Conventional Commit → release-please `CHANGELOG.md`'yi doldurur (§14) |
| Yeni / değişen env değişkeni                      | `README.md` + `ARCHITECTURE.md` (Configuration) |

### 13.4 Yeni bir referans noktası oluşturma

Yeni doküman/referans yalnızca bir konu mevcut hiçbir dosyaya uymadığında VE
birden fazla yerden referans verilen bağımsız bir mesele olduğunda oluşturulur.

- **İsimlendirme**: `docs/{lang}/` kökünde `UPPER_SNAKE_CASE.md` ya da modüle-özel
  bir mesele için `modules/{NAME}.md`.
- **Kayıt atomiktir — aynı commit, beş adımın hepsi:**
  1. Dosyayı HEM `docs/en/` HEM `docs/tr/` içinde oluştur, §13.1 sade özetiyle aç.
  2. İndekse (§13.2) bir satır ekle.
  3. Değişiklik-tipi tablosuna (§13.3) bir satır ekle ki gelecekteki değişiklikler
     ona yönlensin.
  4. Bir CLAUDE.md bölümü ona işaret etmeliyse, §0 tablosuna pointer ekle.
  5. Uygulama-içi `docsRegistry`'ye (`modules/docs/constants`) bir girdi ekle ki
     sidebar'da görünsün ve `/docs/:slug`'tan erişilebilsin.
- **Kural**: indekste (§13.2), eşleştirme tablosunda (§13.3) VE `docsRegistry`'de
  olmayan bir referans noktası yoktur. Kayıtsız doküman olmaz.

### 13.5 İki dillilik kuralı

Her doküman `docs/en/` ve `docs/tr/` içinde tutulur. Düzyazı çevrilir; kod, dosya
adları, tanımlayıcılar ve token adları İngilizce kalır. CLAUDE.md yalnız İngilizce.
İstisna: `CHANGELOG.md` release-please ile repo kökünde, yalnız İngilizce üretilir
ve iki-dilli kuraldan muaftır; uygulama-içi docs viewer onu İngilizce bir girdi
olarak render eder.

### 13.6 Sprint planı ve başarı etiketleri

`SPRINT_PLAN.md` hem yaşayan backlog hem kalıcı kayıttır: planlanan maddeler kabul
kriteri taşır; tamamlananlar ✅ ile işaretlenir ve asla silinmez. §0.1 Active
Work'ten ayrıdır; o geçicidir ve tamamlanınca silinir.

## 14. Sürümleme

release-please, Conventional Commits (§15) ile sürülür. Sürüm asla feature
branch'lerine elle yazılmaz; böylece eşzamanlı iş onda çakışmaz.

- **Changeset dosyası yok.** Bump, `main`'deki commit tiplerinden türetilir:
  `fix:` → patch, `feat:` → minor, `feat!:` / `BREAKING CHANGE` → major (aşağıdaki
  1.0 öncesi istisnayla). Yani okunur geçmiş (commitlint, §12) aynı zamanda release
  kaynağıdır. İncelenmiş her sub-commit `main` üzerinde **korunur** (squash yok —
  §15 Merge stratejisi), böylece release-please her Conventional tipi okur.
- **Release akışı** (canlı): bir topic branch'ini `main`'e merge etmek —
  sub-commit'lerini koruyarak (GitHub'da **Rebase and merge**, §15) — kodu hemen
  deploy eder (Vercel); sürüm değişmez. release-please GitHub Action'ı
  (`.github/workflows/release.yml`, config `release-please-config.json` +
  `.release-please-manifest.json`) tek bir **Release PR** açar/günceller; bu PR
  sürümü yükseltir ve son release'ten beri olan commit'lerden `CHANGELOG.md`'yi
  yeniden üretir. Bu Release PR'ı `GITHUB_TOKEN` açar; bu yüzden `gate` kontrolünü
  **tetiklemez** (GitHub anti-recursion: token'ın açtığı PR Actions başlatamaz).
  Sahibin onu merge etmek için iki yolu vardır: (a) branch koruması yöneticileri
  muaf tuttuğu için (§15), bu mekanik sürüm + `CHANGELOG` PR'ını kontrol olmadan
  doğrudan merge etmek; ya da (b) **Release PR'ını GitHub arayüzünde KAPATIP
  YENİDEN AÇMAK** — insan eliyle yapılan yeniden açma `GITHUB_TOKEN`
  anti-recursion kuralının dışındadır; bu yüzden CI'yi tetikler, `gate` çalışır ve
  PR gerçek bir yeşil kontrolle merge olur. Yeşil `gate` veren yol, yeniden açma
  yoludur. Onu merge etmek sürüm bump'ı + git tag'i yapar. Uygulama özeldir —
  **npm publish yok**. Detay: `docs/tr/VERSIONING.md`.
- **İlk geliştirmede 0.x.** release-please 1.0 öncesi aralıkta tutulur. Manifest
  `0.0.0` değil **`0.0.1`** ile başlatılır — `0.0.0`'da release-please pre-major
  seçeneklerini yoksayar ve doğrudan `1.0.0`'a atlar
  (googleapis/release-please#2087) — ve `bump-minor-pre-major: true`
  (`release-please-config.json`) breaking değişiklikleri 0.x içinde MINOR bump
  olarak tutar. Yani 1.0 öncesi: `feat:` ve breaking değişiklikler **minor**'ı
  yükseltir (örn. `0.1.0` → `0.2.0`, 0.x'te kalır), `fix:` ise **patch**'i. İlk
  release böylece `0.1.0` olur. `1.0.0`'a geçiş **bilinçlidir**, uygulama
  feature-complete olunca yapılır — bir breaking değişiklikle otomatik tetiklenmez.
- **Gerekli repo ayarı.** release-please Release PR'ını `GITHUB_TOKEN` ile açtığı
  için, **Settings → Actions → General → Workflow permissions → "Allow GitHub
  Actions to create and approve pull requests"** ETKİN olmalı, yoksa Action Release
  PR'ını açamaz.

## 15. Workflow

Bir takım workflow'u. Repo sahibi takım yöneticisidir: hiçbir şey onların
incelemesi olmadan `main`'e ulaşmaz. Claude Code asla onay olmadan commit ya da
merge yapmaz ve asla pull request açmaz — akışı commit + docs:sync + push'ta
BİTER; PR'ı GitHub'da sahip açar. Detay: `docs/tr/WORKFLOW.md` (CI / Vercel /
release mekaniğini de kapsar).

### Backlog

`SPRINT_PLAN.md` yaşayan backlog'tur. İş buradan çekilir; her görev kabul kriteri
taşıyabilir.

### Ön-iş (herhangi bir audit / plan / implementation öncesi)

1. Görevin okuyacağı/değiştireceği her modül + global parçayı belirle (§5 ile izle).
2. Etkilenen her `docs/tr/modules/<NAME>.md` ve `docs/tr/COMPONENTS.md`'yi baştan
   sona oku. Göz gezdirme ya da çıkarım yapma. Bir doküman henüz yoksa (erken
   iskele), bunu belirt ve CLAUDE.md + koddan ilerle.
3. Danışılan dokümanları çıktının başında yüzeye çıkar: `Consulted docs:` sonra
   yollar.
4. Bulduğun her doc↔kod drift'ini bir bulgu olarak işaretle. Sessizce etrafından
   dolanma.

### Geliştirici (yerel)

1. **Audit / Plan** — kod yok. Kapsam + alt-adım kırılımı + test planı + danışılan
   dokümanlar + drift. Sohbette netleşir; onayda TOPIC için §0.1 Active Work maddesi
   oluşur.
2. **Implementation, her seferinde bir alt-madde** — bir branch TEK bir topic'tir
   (≈ bir SPRINT_PLAN görevi ya da sıkı ilişkili alt-adımlar grubu) ve BİRDEN ÇOK
   commit taşır, incelenmiş her alt-madde için bir tane. Her alt-madde için: Claude
   Code kod + test yazar → **geliştirici self code-review** (sorun → düzelt → tekrar
   incele döngüsü) → emin olununca bir Conventional Commit (commitlint her commit'te
   çalışır, §12). Claude Code açık onay olmadan asla commit'lemez. §0.1 Active Work
   `Next` / `status`, alt-maddeler indikçe güncellenir.
3. **Topic'in son commit'inde docs:sync** — docs (iki dil, §13.3) + `SPRINT_PLAN.md`
   ✅ + Active Work silinmesi, topic'in SON commit'inde (ya da kendi `docs:` /
   `chore:` commit'inde) yer alır; Conventional mesajla (§14).
4. **Topic'i bitir.** Branch'i **push** et ve DUR — geliştirici akışı burada
   BİTER. Claude Code pull request'i AÇMAZ; sahip açar (aşağıdaki Yönetici adım
   5). Push'tan sonra agent, önerilen PR başlığını ve gövdesini (sözleşmeyi) son
   raporunda çıktılar; sahip PR'ı GitHub'da bu metni kullanarak açar.

### Otomatik kapı (CI)

Her PR'da CI `gate` job'unu çalıştırır (`validate` + testler + `build` +
`npm audit --audit-level=high`; `.github/workflows/ci.yml`); **`gate` yeşil olmadan
PR merge edilemez** (required status check). İnsanlar sonra özü inceler.

### Yönetici (sahip)

5. **PR'ı GitHub'da aç; PR açıklaması sözleşmedir** (audit planı + ne yapıldı +
   test notları + dokunulan docs + kabul kriteri + bağlı backlog maddesi),
   agent'ın son raporunda önerdiği başlık ve gövdeyi kullanarak (Geliştirici adım
   4). CI'nin `gate` job'u PR'da çalışır ve review öncesi yeşil olmalı (aşağıdaki
   Otomatik kapı + Merge stratejisi).
6. **İnceleme** sözleşmeye karşı (plan, kabul kriteri, kod, docs), topic'in
   sub-commit'leri boyunca — *hedef:* CI yeşil ile PR üzerinde; *geçici:* yerel
   branch/commit'ler üzerinde. Sorun → geliştiriciye geri.
7. **`main`'e merge**, sub-commit'leri koruyarak (aşağıdaki Merge stratejisi) →
   production deploy (Vercel) + release-please Release PR'ı açar/günceller (§14).

### Merge stratejisi

Merge'ler **incelenmiş sub-commit'leri `main` üzerinde lineer KORUR — squash yok.**
Her sub-commit atomik, incelenmiş ve Conventional'dır ve release-please her tipi
okur (§14); squash release sinyalini düşürürdü. Bir topic'i GitHub'da **Rebase and
merge** ile kapat (asla "Squash and merge", asla merge commit'i), sonra branch'i sil
ve `git checkout main && git pull`.

### Branch koruması

`main` koruması **AÇIK**, sahip tarafından repo ayarlarında uygulanır: merge'den
önce pull request zorunlu; `gate` status check'inin geçmesi zorunlu; lineer geçmiş
zorunlu (yani yalnız **Rebase and merge** mümkün — merge commit'i yok, squash yok);
force-push ve branch silme engelli. **"Do not allow bypassing the above settings"'i
ETKİNLEŞTİRME** — yöneticiler muaf kalsın ki sahip, (`GITHUB_TOKEN`'ın açtığı için)
`gate` kontrolünü hiç çalıştırmayan release-please Release PR'ını merge edebilsin
(§14). Solo not: GitHub kendi PR'ını onaylamana izin vermez; bu yüzden kapı zorunlu
`gate` status check'idir (CI yeşil); bir takım arkadaşı katılınca required
approvals'ı (1+) etkinleştir. Rollback: Vercel anında önceki deploy'a döner; acil
düzeltme `fix/*` ile, aynı akış hızlandırılmış.

### Fast path

Trivial, düşük-riskli değişiklikler (Dependabot bump'ları dahil) formal audit /
Active Work seremonisini atlar (implement → self-review → Conventional commit) — ama
kapılar asla atlanmaz: sahibin açtığı PR + CI `gate` + sahibin merge'i. Yalnız
audit hafifler.

### Git konvansiyonları

Branch'ler `feat/*`, `fix/*`, `chore/*` (ayrıca `docs/*`, `refactor/*`, `test/*`) —
branch başına tek topic, BİRDEN ÇOK Conventional Commit (`type(scope): subject`)
taşır, incelenmiş her alt-madde için bir tane; commitlint ile dayatılır (§12) ve
release-please tarafından tüketilir (§14). Push manueldir. Merge'ler sub-commit'leri
korur (yukarıdaki Merge stratejisi): GitHub'da **Rebase and merge** — asla squash,
asla merge commit'i.

Her prompt şununla biter: "If you see an issue, ambiguity, or a better suggestion,
surface it before implementing. Otherwise proceed." Kapı başarısızlıkları geri
döner: başarısız self-review implementation'a, başarısız inceleme geliştiriciye.

## 16. Erişilebilirlik ve Performans

**Erişilebilirlik:**

- `form/Form*` wrapper'ları her input'a, input'a bağlı (`htmlFor`/`id`) bir i18n
  label render eder — etiketsiz alan yok. İkon-only butonlar `aria-label={t(...)}`
  alır.
- PrimeReact Dialog focus-trap + ESC + `role="dialog"` sağlar; `aria-labelledby`
  (header) ayarla ve kapanışta focus'u geri döndür.
- DataTable sıralanabilir-kolon ARIA'sı gömülüdür; kolon header'ları etiketlidir.
- Renk token'ları (light + dark) WCAG AA kontrast hedefler (§9).
- Dil değişimi `<html lang>`'i günceller (§8).
- Dayatılan zemin: `eslint-plugin-jsx-a11y` (§12).

**Performans:**

- Küçük veri seti üzerinde native istemci-tarafı DataTable filtre/sıralama →
  virtualization gereksiz.
- React Query cache (`staleTime: Infinity`) refetch'i önler (§10).
- Route-seviyesi code splitting: `React.lazy` + Suspense + `Loading` fallback (§6, §3.1).
- Erken memoization yok — native tablo ihtiyacın çoğunu kaldırır; yalnız ölçülen
  bir darboğazı memoize et.

**Responsive (mobile-first):**

- Mobile-first tasarla; Tailwind breakpoint'lerini yukarı katmanla (`sm` 640 /
  `md` 768 / `lg` 1024 / `xl` 1280 — Tailwind varsayılanları). Sabit piksel
  genişliklerinden kaçın; akışkan utility'leri tercih et (`w-full`, `max-w-*`,
  grid/flex) ve `sm`/`md`/`lg`/`xl`'de doğrula.
- Responsive davranışı `App*` / `Form*` wrapper'larına göm ki ekranlar varsayılan
  olarak alsın: `AppSidebar` küçük ekranlarda toplanır (off-canvas/toggle);
  `AppDataTable` taşma yerine responsive/yatay-scroll moduna geçer; `Form*` alanları
  dar genişliklerde tek kolona iner; `Dialog` mobilde tam genişlik olur.
- Araç ayrımı: bir bileşenin iç yapısı için **PrimeReact'in kendi responsive
  özelliklerini** kullan — `DataTable` scroll/responsive modu, `Dialog` `breakpoints`
  (ör. `{ '960px': '75vw', '640px': '95vw' }`) — ve etraflarındaki layout/spacing için
  **Tailwind breakpoint utility'leri**. Bileşenin zaten sağladığını yeniden yazma.
  (Kesin `AppDataTable` responsive prop'u, o wrapper 1.2'de yazılırken belirlenir.)

## 17. Yeni Kod için Kontrol Listesi

1. Modül yerleştirme (§2 §3) — barrel-only import'lar; modüle-özel kod modülde,
   tekrar kullanılır kod global katmanda; mantık `lib`'de, çekme/kalıcılık
   `api`/composables'ta, asla yaprak UI'da değil.
2. Parçalama (§2) — doğru alt-klasörde küçük odaklı dosyalar; satır sayısına göre
   değil sorumluluğa göre böl.
3. Paylaşılan UI (§2 §3.1) — `App*` wrapper'ları (ör. `AppDataTable`) ve `Form*`
   alanları kullan; çağrı yerinde asla ham PrimeReact.
4. Routing (§6) — route constant'ları (`icon`/`menuOrder` dahil), lazy sayfalar,
   ince sayfalar; menü `useMenu` ile; dinamik başlık handle `title()` ile.
5. İsimlendirme (§7) — tam açıklayıcı kelimeler; yorum yok / JSDoc yok.
6. Metin (§8) — insan-okur literal yok; anahtarlar iki locale'de; `useNotify` /
   Yup yalnız-anahtar (tipli); düz yerelleştirilmiş alanlar `pickLocalized` ile;
   PrimeReact + Day.js locale senkron.
7. Türkçe-duyarlı metin (§8) — NFC + `toLocaleLowerCase('tr')`; `Intl.Collator('tr')`
   `lib/text.ts` / `AppDataTable` üzerinden.
8. Stil (§9) — yalnız token-destekli, ham hex yok; önce tema değişkeni, custom token
   yalnız uygun değişken yokken ya da işlevsel neden varken; SCSS `_tokens.scss`
   üzerinden; her renk iki modda geçerli; token renklerinde `dark:` yok; SCSS'te
   `@apply` yok.
9. Durum (§10) — React Query storage'tan seed eder; CRUD storage servisi +
   `invalidateQueries` ile; query-key factory; tek doğruluk kaynağı.
10. Testler (§11) — audit'te planlanır, kodla yazılır; GET için MSW; kaynağı
    yansıtarak `src/__test__/` altında.
11. Lint/format (§12) — `validate` geçer.
12. Erişilebilirlik / performans / responsive (§16) — etiketli alanlar, a11y lint,
    lazy route'lar; mobile-first, Tailwind breakpoint'leri, responsive `App*`/`Form*`
    wrapper'ları.
13. Docs (§13) — §13.3 üzerinden yönlendirilir, iki dil, §13.4 ile kaydedilir
    (`docsRegistry` dahil).
14. Sürümleme (§14) — net bir Conventional Commit (release-please bump'ı türetir);
    sürüm / bağımlılık-major kayması yok (§1.1).
15. Workflow (§15) — ön-iş docs danışıldı; self-commit/merge yok; kapılar ve
    PR-sözleşme korunur.
