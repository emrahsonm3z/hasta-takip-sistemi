# SPRINT_PLAN.md (Türkçe çeviri)

Bu, kanonik İngilizce `SPRINT_PLAN.md` dosyasının Türkçe çevirisidir. Düzyazı
çevrilmiştir; kod, dosya adları, tanımlayıcılar ve token adları İngilizce
bırakılmıştır.

Yaşayan backlog HEM kalıcı kayıt (§13.6). Görevler buradan sırayla çekilir; her
biri alt-adımları, oluşturduğu dosyaları, kabul kriterlerini, bağımlılıkları,
test notlarını ve bir Definition of Done (DoD) taşır. Tamamlanan görevler ✅ ile
işaretlenir ve asla silinmez; geçici "neredeyiz" göstergesi CLAUDE.md §0.1 Active
Work'tür, bu dosya değil.

**Durum açıklaması:** ⬜ planlandı · 🟡 devam ediyor · ✅ bitti

**Global DoD** (her görev, kendininkine ek): danışılan dokümanlar yüzeye çıkarıldı
(§15); yerelde `validate` + testler + `build` yeşil; `npm audit --audit-level=high`
temiz; docs §13.3'e göre iki dilde senkron; bir Conventional Commit (§14); PR
sözleşme açıklamasıyla açıldı (§15); merge öncesi CI yeşil. Ham hex yok, JSX'te
string literal yok, barrel-only import'lar, çağrı yerinde `App*`/`Form*` wrapper'lar.

> Sprint 0 uygulamayı çalışabilir, lint-temiz bir kabuğa iskeler. Sprint 1
> patients özelliğini baştan sona kurar. Sprint 2 dokümantasyon, testler, a11y'i
> doldurur ve ilk sürümü çıkarır. Bir sprint içinde görevler çoğunlukla
> `Depends on`'a göre sıralıdır.

---

## Sprint 0 — Temel / İskele

Sonuç: boş ama çalışabilir, tam-araçlı bir uygulama — provider'lar bağlı, tema +
i18n + routing canlı, global bileşenler yerinde, CI/release/docs çalışır — sıfır
özellik kodu ile.

### 0.1 ✅ Proje bootstrap + pinlenmiş bağımlılıklar
**Hedef:** Tam sürüm politikası (§1.1) kilitlenmiş, çalışabilir bir Vite + React
18 + TS (strict) iskeleti.
**Bağımlılık:** —
**Alt-adımlar:**
- Vite `react-ts` iskele; Node'u `.nvmrc`'de ayarla.
- `primereact@10.9.8`, `primeicons`, `tailwindcss@3.4.x`'i kur + **exact-pin**;
  geri kalanı caret (router, react-query, formik, yup, dayjs, i18next,
  react-i18next, react-markdown, remark-gfm, @tailwindcss/typography).
- `tsconfig.json` strict; path alias `@/` → `src/` (tsconfig + `vite.config.ts`).
- `vite.config.ts`: React plugin, alias, `base`/build config.
- Commit'lenmiş lockfile'a karşı `npm ci` çalıştığını doğrula.
**Dosyalar:** `package.json`, `package-lock.json`, `.nvmrc`, `tsconfig.json`,
`vite.config.ts`, `index.html` (minimal), `src/main.tsx` (placeholder),
`.gitignore` (`.env`, `dist`, `node_modules`).
**Kabul:** `npm ci && npm run dev` boş bir uygulama sunar; `npm run build` geçer;
PrimeReact + Tailwind tam-pinli (onlarda `^` yok).
**Test:** henüz yok (tooling 0.2'de gelir).
**DoD:** + global DoD. Commit `chore: bootstrap vite react-ts project`.

### 0.2 ✅ Tooling + custom lint kuralı
**Hedef:** Boş bir projede tüm kalite zinciri (§12) yeşil; yerel
`no-explanatory-comments` kuralı dahil.
**Bağımlılık:** 0.1
**Alt-adımlar:**
- ESLint flat config: `typescript-eslint`, `eslint-plugin-i18next`
  (`no-literal-string` JSX-only + `jsx-attributes` whitelist + `t`/`i18n.t`/
  `clsx`/`cn`'i dışlayan `callees`; test/constants'ta kapalı),
  `eslint-plugin-jsx-a11y`, `eslint-config-prettier`.
- `tools/eslint/no-explanatory-comments.js`'i (§7/§12 allowlist'i) uygula ve
  `eslint.config.js`'e inline `local` plugin olarak bağla.
- Prettier, Stylelint (`stylelint-config-standard-scss` + `stylelint-order` +
  `stylelint-prettier`), commitlint (`config-conventional`), Husky
  (`pre-commit` → lint-staged; `commit-msg` → commitlint), lint-staged.
- Script'ler: `type-check`, `lint`, `lint:style`, `format:check`, `validate`
  (= dördü), `test` (placeholder), `build`.
**Dosyalar:** `eslint.config.js`, `tools/eslint/no-explanatory-comments.js`,
`tools/eslint/no-explanatory-comments.test.js` (RuleTester), `.prettierrc`,
`.prettierignore`, `stylelint.config.js`, `commitlint.config.js`,
`.husky/pre-commit`, `.husky/commit-msg`, `package.json` (script'ler + lint-staged).
**Kabul:** `npm run validate` geçer; yerleştirilmiş bir açıklayıcı yorum lint'i
düşürür; conventional olmayan bir commit mesajı hook tarafından reddedilir.
**Test:** custom kural için `RuleTester` vakaları (geçerli: allowlist'li
direktifler; geçersiz: düzyazı yorum, JSDoc bloğu).
**DoD:** + global DoD. Commit `chore: add lint, format, commit, and custom comment-rule tooling`.

### 0.3 ✅ Plugins, config, tema bootstrap + provider'lar
**Hedef:** Tüm üçüncü-parti kütüphaneler `src/plugins/`'te yapılandırılmış, env
tipli ve doğrulanmış, tema resources path'inden beslenmiş, provider'lar doğru
bootstrap sırasında mount edilmiş.
**Bağımlılık:** 0.1 (lint-temiz için 0.2)
**Alt-adımlar:**
- `config/env.ts` (tipli, donmuş, `VITE_API_URL` için `validateRequiredEnvVars()`)
  + `config/vite-env.d.ts`; `.env.example`.
- `plugins/primereact.ts`: PrimeReactProvider value, locale bağlama ve
  `FilterService.register('nfcContains', …)` (§8).
- `plugins/theme.ts`: `lara-light-green` + `lara-dark-green`'in `?url` import'ları;
  `<link id="app-theme">`, `applyTheme()`, `setThemeMode()` (href swap + `dark`
  sınıfı + `theme-mode` persist) sahiplenir (§9).
- `plugins/react-query.ts` (QueryClient varsayılanları §10), `plugins/dayjs.ts`
  (`localizedFormat`, tr/en, `setDayjsLocale`), `plugins/i18n.ts` (react-i18next
  init + PrimeReact + Day.js köprüsü), `plugins/yup.ts` (`yup.setLocale` →
  anahtarlar).
- `index.html`: `<link id="app-theme">` + ilk paint'ten önce `dark` sınıfını
  ayarlamak için `theme-mode` okuyan paint-öncesi inline script (§9).
- `main.tsx` bootstrap sırası: i18n init → `validateRequiredEnvVars()` (başarısız
  → i18n singleton ile `ConfigErrorScreen`) → tema link uygula → provider'ları
  mount et (QueryClientProvider, PrimeReactProvider, AppToastProvider,
  AppErrorBoundary) → `RouterProvider`.
**Dosyalar:** `src/config/env.ts`, `src/config/vite-env.d.ts`,
`src/plugins/{primereact,theme,react-query,dayjs,i18n,yup}.ts`, `index.html`,
`src/main.tsx`, `.env.example`.
**Kabul:** uygulama light/dark green temayla açılır; storage'da `theme-mode`'u
değiştirmek temayı flash olmadan çevirir; eksik `VITE_API_URL`,
`ConfigErrorScreen` gösterir; console hatası yok.
**Test:** `env` doğrulaması için unit (eksik değişken throw); `setThemeMode` href
swap + class toggle (jsdom).
**DoD:** + global DoD. Commit `feat: configure plugins, env, and theme bootstrap`.

### 0.4 ✅ Stil sistemi — token-destekli Tailwind + SCSS (SMACSS) + dark
**Hedef:** Tek token kaynağı (v10 tema değişkenleri) hem Tailwind hem SCSS
tarafından tüketilir; custom token'lar iki mod için tanımlı; hiçbir yerde ham hex
yok.
**Bağımlılık:** 0.3
**Alt-adımlar:**
- `tailwind.config.ts`: token-destekli renkler (`primary`, `surface.*`, `ground`,
  `card`, `surface-border`, `text`, `text-secondary` → v10 vars), `darkMode:
  'class'`, `@tailwindcss/typography` plugin, `content` glob'ları.
  `postcss.config.js`.
- `src/styles/` SMACSS iskeleti: `base/`, `layout/`, `modules/`, `state/`,
  `theme/`, `utils/`; `utils/_tokens.scss` (v10 vars'ın SCSS alias'ları);
  `theme/_dark.scss` (`:root` + `.dark` altında uygulamaya-özel custom token'lar);
  SMACSS sırasında import eden `main.scss`; `@layer base, primereact, components,
  utilities`.
- `main.scss`'i (ve PrimeIcons'ı) `main.tsx`'te import et; SCSS modüllerinde
  `@apply`/`@tailwind` olmadığını doğrula.
**Dosyalar:** `tailwind.config.ts`, `postcss.config.js`, `src/styles/**`
(klasörler + `_tokens.scss`, `_dark.scss`, `main.scss`).
**Kabul:** bir token Tailwind sınıfı (ör. `bg-ground text-text`) swap üzerinden
iki modda da doğru render olur (`dark:` gerekmez); Stylelint geçer; yerleştirilmiş
bir hex değer review niyetini düşürür (belgelendi), `_tokens.scss` SCSS için tek
renk kaynağı.
**Test:** yok (görsel/lint-doğrulamalı).
**DoD:** + global DoD. Commit `feat: add token-backed tailwind and SMACSS scss layer`.

### 0.5 ✅ i18n locale dosyaları + anahtar tipleme
**Hedef:** İki dil için temel locale JSON ve `useNotify`/Yup'ı yalnız-anahtar
yapan `TranslationKey` tipi.
**Bağımlılık:** 0.3
**Alt-adımlar:**
- Temel namespace'lerle `locales/tr.json` + `locales/en.json`: `common.*`
  (eylemler, etiketler), `errors.*` (`errors.unexpected` dahil), `validation.*`
  (Yup mesajları), `patients.*` (başlık, alanlar, status/priority/bloodType
  etiketleri), `docs.*`. Anahtarlar iki dosyada özdeş.
- `types/i18n.types.ts`: EN kaynak şeklinden bir `TranslationKey` union türet;
  `useNotify` ve başka yerler için export et.
**Dosyalar:** `src/locales/tr.json`, `src/locales/en.json`,
`src/types/i18n.types.ts`.
**Kabul:** iki dosyanın anahtar kümeleri özdeş; `TranslationKey` çözülür; bir
`TranslationKey` slotuna anahtar-olmayan string geçmek derleme hatası.
**Test:** `Object.keys(tr)`'in `Object.keys(en)`'e (özyinelemeli) derin-eşit
olduğunu doğrulayan unit (ikisi asla kaymasın).
**DoD:** + global DoD. Commit `feat: add bilingual locale files and translation-key typing`.

### 0.6 ✅ Router + layout kabuğu + menü + dinamik başlık
**Hedef:** sidebar/topbar'lı, dil + tema anahtarlı, (boş) modül route'larını
toplayan bir data router'lı ve başlık çözümlü çalışan bir `AppLayout`.
**Bağımlılık:** 0.3, 0.4, 0.5
**Alt-adımlar:**
- `types/route.types.ts`: `AppRouteHandle { titleKey; title?(match) }`.
- `lib/route.ts`: `UIMatch` üzerinde tipli `getRouteHandle()` guard'ı.
- `composables/useMenu.ts`: modül route constant'larını (barrel üzerinden) + docs
  registry'yi topla, `menuOrder`'a göre sırala, `t(titleKey)` ile etiketle.
- `components/layout/`: `AppLayout` (`<Outlet/>` + `<ScrollRestoration/>` + en
  derin handle'dan `document.title`: `title(match)` yoksa `t(titleKey)`),
  `AppSidebar` (`useMenu` render eder), `AppTopbar`, `AppLanguageSwitcher` (tek
  akış §8), `AppThemeToggle` (`plugins/theme`).
- `router/index.tsx`: `createBrowserRouter` — `errorElement`'li tek `AppLayout`
  route'u, çocuklar = `/patients`'e index redirect, yayılmış modül dizileri
  (şimdilik boş), `*` 404.
**Dosyalar:** `src/types/route.types.ts`, `src/lib/route.ts`,
`src/composables/useMenu.ts`,
`src/components/layout/{AppLayout,AppSidebar,AppTopbar,AppLanguageSwitcher,AppThemeToggle}.tsx`,
`src/router/index.tsx`.
**Kabul:** uygulama layout render eder; dil değiştirmek etiketleri + tarihleri +
`<html lang>`'i günceller; tema toggle çalışır; bilinmeyen URL → 404; index
`/patients`'e yönlendirir (1.2'ye kadar placeholder); `document.title` aktif
route'u izler.
**Test:** `getRouteHandle` guard'ı; `useMenu` sıralama + etiket çözümü (stub'lu
registry ile render).
**DoD:** + global DoD. Commit `feat: add router, app layout, menu, and dynamic title`.

### 0.7 ✅ Global bileşenler (wrapper'lar, formlar, hata yüzeyleri, notify)
**Hedef:** §3.1'deki her tekrar kullanılır yapı taşı var olur ki özellik kodu
asla ham PrimeReact'e dokunmaz.
**Bağımlılık:** 0.3, 0.5, 0.6
**Alt-adımlar:**
- `AppDataTable.tsx`: DataTable wrapper — native sort/filter/search; `nfcContains`
  ile Türkçe global filtre + metin filtreleri; `Intl.Collator('tr')` sıralama;
  `emptyMessageKey`→`t()`; controlled/uncontrolled sort+filter prop'ları (§3.1).
- `lib/text.ts` (NFC + `toLocaleLowerCase('tr')`, collator), `lib/date.ts`
  (`formatDate`), `lib/pickLocalized.ts`.
- `form/`: `FormInputText`, `FormDropdown`, `FormCalendar`, `FormInputNumber`,
  `FormCheckbox`, `FormChips` — Formik-bağlı, i18n label + hata gömülü.
- `useNotify.ts` (yalnız-anahtar `TranslationKey` API + hata normalizasyonu) +
  `AppToastProvider.tsx` (tek `<Toast/>`).
- Hata yüzeyleri: `Loading`, `ErrorState` (sayfa-içi + retry),
  `RouteErrorBoundary`, `AppErrorBoundary` → `FatalError`, `ConfigErrorScreen`.
**Dosyalar:** `src/components/AppDataTable.tsx`, `src/components/AppToastProvider.tsx`,
`src/components/{Loading,ErrorState,RouteErrorBoundary,AppErrorBoundary,FatalError,ConfigErrorScreen}.tsx`,
`src/components/form/*.tsx`, `src/composables/useNotify.ts`,
`src/lib/{text,date,pickLocalized}.ts`.
**Kabul:** geçici bir demo route, mock satırlarla `AppDataTable` render eder
(Türkçe arama/sıralama çalışır), bir `Form*` alanı i18n label + Yup hatası
gösterir, bir `useNotify` toast tetiklenir; `ErrorState` + boundary'ler
fallback'lerini render eder; `useNotify`'a geçilen literal derleme hatası.
**Test:** `lib/text` normalize + collator sırası; `formatDate` pattern'leri +
geçersiz ISO → `''`; `pickLocalized` fallback'leri; `AppDataTable` Türkçe filtre
eşleşmesi.
**DoD:** + global DoD. Commit `feat: add global components, form fields, and error surfaces`.

### 0.8 ✅ CI, release-please, Dependabot, deploy config
**Hedef:** Otomatik kapı + release otomasyonu + bağımlılık hijyeni + Vercel'de SPA
routing (§14, §15).
**Bağımlılık:** 0.2
**Alt-adımlar:**
- `.github/workflows/ci.yml`: PR'da → `npm ci` → `validate` → `test` → `build` →
  `npm audit --audit-level=high`; required status check yap.
- `.github/workflows/release.yml`: release-please action;
  `release-please-config.json` + `.release-please-manifest.json` (version `0.0.0`
  başlangıç, `release-type: node`, **publish yok** — private).
- `.github/dependabot.yml`: npm ecosystem, minor/patch grupla, beş tam pin
  `react`, `react-dom`, `primereact`, `primeicons`, `tailwindcss` için **TÜM
  güncelleme türlerini ignore** + **`eslint` major ignore** (§1.1).
- `vercel.json`: SPA rewrite (hepsi → `/index.html`); branch koruması §15'te
  belgeli (sahip uygular: PR + `gate` check + lineer geçmiş zorunlu; release-please
  PR'ı için yöneticiler muaf).
**Dosyalar:** `.github/workflows/ci.yml`, `.github/workflows/release.yml`,
`release-please-config.json`, `.release-please-manifest.json`,
`.github/dependabot.yml`, `vercel.json`.
**Kabul:** PR açmak CI'ı çalıştırır; `main`'e bir `feat:`/`fix:` merge'i
release-please'in doğru bump + CHANGELOG'lu bir Release PR açmasını sağlar; derin
linkler Vercel'de çalışır (refresh'te 404 yok).
**Test:** yok (ilk gerçek PR'da pipeline-doğrulamalı).
**DoD:** + global DoD. Commit `ci: add CI gate, release-please, dependabot, and SPA rewrite`.

### 0.9 ✅ Docs modülü + registry + iskelet docs + README
**Hedef:** Uygulama-içi docs viewer çalışır ve her §13.2 dokümanı iki dilde
(iskelet) var olur, kayıtlı.
**Bağımlılık:** 0.6
**Alt-adımlar (indiği hâliyle):**
- `modules/docs/`: `MarkdownRenderer` (`react-markdown` + `remark-gfm`,
  `@tailwindcss/typography` prose'u v10 tema değişkenlerine eşlenmiş —
  `prose-invert` yok, §9); aktif dile göre anahtarlanmış
  `import.meta.glob(['/docs/**/*.md', '/CHANGELOG.md', '/SPRINT_PLAN.md', '/SPRINT_PLAN.tr.md'], { query: '?raw', import: 'default' })`
  ile loader (kök dosyalar kökte kalır; registry `paths.{en,tr}` bunu soğurur);
  `constants/docs-registry.ts` (slug + `titleKey` + `descriptionKey` + `icon` +
  `order` + `paths`, tek kaynak) + `query-keys.ts`; `lib/doc-path` (saf) +
  `lib/docs-loader`; `composables/useDocContent` (useQuery); `routes.tsx`
  (`DOCS_ROUTES`): `/docs` genel bakış + `/docs/:slug` viewer (handle ile
  dinamik başlık, bilinmeyen slug → `NotFound`); `pages/`, `index.ts` barrel.
- Menü (incelemede kararlaştırıldı): sidebar TEK bir Dokümanlar maddesi taşır →
  `/docs`; tüm dokümanların indeksi genel bakıştaki kart-grid'dir (§13.4 adım 5
  buna göre değiştirildi). `useMenu`, `DOCS_ROUTES.OVERVIEW`'u okur.
- Her §13.2 dosyası için `docs/en/*` + `docs/tr/*`, her biri §13.1 sade özetiyle
  açılır, geliştirici-olmayanlar için sade dille yazılmıştır; WORKFLOW,
  VERSIONING ve CODING_STANDARDS tam rehber olarak çıktı (PR'ı-sahip-açar akışı,
  release-PR yeniden-açma yolu, no-`any` politikası); kalanlar iskelet (içerik
  2.1'de doldurulur). `CHANGELOG.md` repo kökünde yalnız İngilizce kalır (§13.5).
- `README.md`: kurulum, script'ler, env (`VITE_API_URL`), deploy.
**Dosyalar:** `src/modules/docs/**`, `src/composables/useMenu.ts`,
`docs/en/*.md`, `docs/tr/*.md`, `docs/en/modules/*.md`, `docs/tr/modules/*.md`,
`README.md`, `tailwind.config.ts`, `src/__test__/modules/docs/*`.
**Kabul:** `/docs` tüm dokümanları listeler; `/docs/:slug` aktif-dil markdown'ı
render eder; dil değiştirmek içeriği değiştirir; sidebar tek docs maddesini
gösterir; her kayıtlı doküman erişilebilir; kayıtsız-doküman kuralı geçerli.
**Test:** docs-registry slug↔dosya bütünlüğü (her registry slug'ı var olan bir en
+ tr dosyasına çözülür), slug benzersizliği, `resolveDocPath` + `findDocEntry`
birimleri.
**DoD:** + global DoD. `feat/docs-module` üzerinde `feat(docs)`/`docs:`
alt-commit'leri olarak indi.

### 0.10 ✅ Kabuk tasarım geçişi (Atlantis-esinli)
**Hedef:** Uygulama kabuğunu Atlantis-esinli tasarıma (§9) göre yeniden stillemek:
transparan düz sidebar vs raised `.card` yüzey modeli, özel `--app-*` token'ları,
marka işareti, pattern arka planı, responsive drawer.
**Bağımlılık:** 0.6
**Alt-adımlar (indiği haliyle):**
- `--app-*` özel token'ları (`theme/_dark.scss`, iki mod) + `_tokens.scss`
  alias'ları + Tailwind açılımı (`bg-app-ground`, `w-sidebar`, Inter-öncelikli
  `fontFamily.sans`).
- Kabuk partial'ları: `layout/_layout`, `layout/_sidebar`, `layout/_topbar`,
  `modules/_card` `@layer tw-components` içinde; `base/_typography` self-hosted
  Inter variable woff2 (latin + latin-ext) ile; 14px taban.
- `AppLogo` (token-renkli inline SVG + `BRAND_NAME`), `public/favicon.svg`.
- Topbar: nötr hamburger, dairesel `.l-topbar-chip` aksiyon butonları, metin
  TR/EN aktif-dil switcher'ı (bayraklar kaldırıldı), yalnız-`:focus-visible` odak.
- Masaüstü collapse toggle (`.is-collapsed` @ `lg`) + mobil PrimeReact `<Sidebar>`
  drawer: opak `--app-ground` panel, `0 16px 16px 0` köşeler, yüzen kapatma (X),
  logo en üstte, route değişiminde kapanır.
- Arka plan: `.l-layout` üzerinde self-hosted PrimeVue `pattern.png`, mod-bağımsız
  `--glow-image` + `--glow-blend` (`hard-light, multiply`), `auto 20rem`, top,
  no-repeat, `--app-ground` üzerine blend (geçici scallop-SVG mask'in yerini aldı).
- `useMenu` gruplu section'lar (`menu.section.general`) + güncellenen `useMenu.lib`
  spec'i.
- Temizlik: artık kullanılmayan `common.languages.*` anahtarları ve `content-offset`
  Tailwind spacing'i kaldırıldı.
**Dosyalar:** `src/components/layout/*`, `src/composables/useMenu*`,
`src/styles/{base,fonts,images,layout,modules,theme,utils}/*`, `src/styles/main.scss`,
`tailwind.config.ts`, `index.html`, `public/favicon.svg`, `src/locales/*`,
`src/__test__/composables/useMenu.lib.test.ts`.
**Kabul:** kabuk iki modda da §9 spec'iyle eşleşir; drawer + collapse `lg` eşiğinde
çalışır; token tanımları dışında raw hex yok; `validate` + testler yeşil.
**Test:** `useMenu.lib` gruplama spec'i güncellendi (29 spec yeşil, Node 24).
**DoD:** + global DoD. Commit'ler `feat(layout): atlantis-style app shell` +
`docs: sync rule files and sprint plan for the shell design pass`.

### 0.11 ✅ Docs revizyonu — teknik derinlik, iç içe menü, kaydırma bölgesi
**Hedef:** 0.9 dokümanlarını referans çıtasına taşımak (sade anlatım korunur,
gerçek teknik gösterimler eklenir — yalnız bu repodaki kod; planlı iş planlı
olarak işaretlenir) ve kabuğu buna göre yeniden yapılandırmak.
**Bağımlılık:** 0.9
**Alt-adımlar:**
- Viewport'a kilitli kabuk: `.l-layout`/`.l-content` viewport'a sabitlenir;
  tek kaydırma bölgesi `<main>`; rota değişiminde en üste kaydırma
  (yalnız window kaydırmasını izleyen `ScrollRestoration`'ın yerine geçer).
- İç içe Dokümanlar alt-menüsü: `useMenu` öğeleri `children` kazanır (doc
  çocukları registry'den); `AppSidebar` bir disclosure çizer (satır `/docs`'a
  gider, chevron açar/kapar, `/docs` altında otomatik açık); §13.4 adım 5
  yeniden değiştirildi.
- Genel bakıştaki lead paragrafı kaldırıldı (`docs.lead` anahtarı silindi).
- `SPRINT_PLAN`, `docs/{en,tr}/SPRINT_PLAN.md`'ye taşındı (doğrulandı: kök
  yola release-please/CI bağımlılığı yok); glob + registry + kural dosyası
  referansları güncellendi; `CHANGELOG.md` kökte kalır (release-please'in).
- 11 dokümanın tamamının teknik-derinlik yeniden yazımı (EN + TR): gerçek kod
  alıntıları, tablolar, ASCII ağaç/akışlar, işlenmiş örnekler — mermaid yok,
  yeni bağımlılık yok; hasta veri katmanı/UI planlı işaretli (1.1–1.3).
- `README.md` Türkçe yeniden yazıldı (genel bakış, yığın, önkoşullar, kurulum,
  env, script'ler, mimari özet, test, deploy).
- (İncelemede eklendi) İçerik alanı için referans okuma tasarımı: kart yok,
  sola hizalı, 57.5rem sınır; çizgili h1/h2; hücre dolgusu eşit (0.875rem)
  tam-ızgaralı tablolar; callout blockquote'lar; `rehype-highlight` +
  highlight.js `github-dark` ile her-zaman-koyu kod blokları (onaylı §9
  istisnası); sidebar disclosure'ında modül dokümanları Modüller alt-bölüm
  etiketi altında gruplu.
**Dosyalar:** `src/styles/layout/*`, `src/components/layout/*`,
`src/composables/useMenu*`, `src/modules/docs/**`, `docs/{en,tr}/**`,
`README.md`, `src/locales/*`, `tailwind.config.ts`.
**Kabul:** yalnız içerik kayarken topbar + sidebar yerinde kalır; Dokümanlar
ebeveyni doc bağlantılarına açılır ve `/docs` açılış sayfası kalır; dokümanlar
iki dilde referansın teknik çıtasını karşılar, hiçbir şey uydurulmamış; README
Türkçe ve profesyonel; registry/menü/locale testleri yeşil.
**Test:** `useMenu.lib` children spec'i; registry yol bütünlüğü (taşınmış
SPRINT_PLAN yolları); locale eşliği.
**DoD:** + global DoD.

---

## Sprint 1 — Patients özelliği (baştan sona)

Sonuç: hastaları listele + ekle + düzenle + sil, iki dilli, Türkçe-duyarlı,
`localStorage`'da kalıcı, GET'ten bir kez seed'li.

### 1.1 ✅ Patients veri katmanı
**Hedef:** Model, mapper, salt-okunur GET, storage CRUD servisi, query key'ler ve
seed + mutation composable'ları (§10).
**Bağımlılık:** 0.3, 0.7
**Alt-adımlar:**
- `models/patient.model.ts`: `PatientRecord` düz camelCase (`noteTr`, `noteEn`,
  `diagnosisTr`, `diagnosisEn` dahil) + enum-benzeri union'lar (`status`,
  `priority`, `bloodType`, `department`), canlı API'ye karşı doğrulanmış.
- `lib/patient.mapper.ts`: ham snake_case → model (düz, tipli enum'lar) — yalnız seed.
- `api/patients.api.ts`: GET ham satırlar (`env.VITE_API_URL` kullanır).
- `api/patients.storage.ts`: `STORAGE_KEY='patients'`'te
  `patientStorage.{read,write,add,update,remove,clear}`; `read` → eksik/bozukta
  `[]`; `write` → quota hatası `useNotify` ile.
- `constants/query-keys.ts`: `patientKeys.all()` (fonksiyon biçimi + `as const`).
- `composables/usePatients.ts`: `useQuery` storage okur; boşsa → GET → map →
  `write` → döndür (idempotent/StrictMode-güvenli; `throwOnError:false`).
- `composables/usePatientMutations.ts`: add/update/remove storage +
  `invalidateQueries(patientKeys.all())` ile; success/error `useNotify`.
- `constants/patient-options.constants.ts`: dropdown'lar için option listeleri
  (değerler constant, etiketler i18n anahtarları ile).
- `index.ts` barrel (public API + routes + route constant'ları).
**Dosyalar:** `src/modules/patients/{models,lib,api,constants,composables}/…`,
`src/modules/patients/index.ts`.
**Kabul:** ilk yükleme GET'ten storage'a seed eder; reload storage'tan okur
(ikinci GET yok); add/edit/remove kalıcılaşır ve liste invalidation ile güncellenir;
bozuk storage değeri → boş liste (crash yok); model'de serbest `string` enum yok.
**Test (öncelik):** mapper snake→camel + enum tipleme; storage read bozuk → `[]`;
add/update/remove round-trip; `usePatients` bir kez seed sonra storage okur (GET
için MSW); `usePatientMutations` invalidate eder.
**DoD:** + global DoD; `STATE_MANAGEMENT.md` + `modules/PATIENTS.md` güncellendi.
Commit `feat(patients): add data layer with storage-backed crud`.

### 1.2 ✅ Hasta listesi (AppDataTable, Türkçe sıralama/filtre/arama)
**Hedef:** `AppDataTable` üzerinde tam hasta listesi — her kolon sıralanabilir,
tipe-uygun menü filtreleri + global arama, iki dilli alanlar ve etiketler.
**Kapsam notu:** bu, vaka çalışmasının "1 sıralama, 1 filtre, 1 arama"
asgarisini BİLEREK aşar — sahibin tercihi; burada ve modül dokümanında kayıtlı.
**Bağımlılık:** 1.1
**Alt-adımlar (indiği hâliyle):**
- `pages/PatientsPage.tsx` (ince): `usePatients` çağırır, `PatientList`'i bir
  `.card` üzerinde render eder, loading'i (wrapper'ın iki modu) ve okuma
  hatasını (`ErrorState` + retry) yönetir.
- `components/PatientList.tsx`: 15 kolon (fullName, department, status,
  priority, appointmentDate, birthDate, bloodType, score, diagnosis, note,
  isInsured, isFollowUp, isVaccinated, tags, createdAt). status/priority
  `Tag` olarak (severity haritası `patient-tag.constants.ts`); boolean'lar
  çevrilmiş evet/hayır; tag'ler `Chip`; tarihler `formatDate 'L'` (canlı
  veride saat yok); diagnosis/note yerel-dile-duyarlı TÜRETİLMİŞ satır
  alanlarıdır (`buildPatientListRows` + enjekte `pickLocalized`); böylece
  sıralama/filtre/gövde düz alanlar üzerinde çalışır.
- Sıralama, her kolonda: metin kolonları (fullName, etiketiyle department,
  diagnosis, note, bloodType, birleşik-etiketiyle tags) Türkçe collator ile
  (`sortRowsByTurkishValue`); status/priority TANIMLI enum sırasıyla
  (`sortRowsByValueOrder`); tarihler (ISO string)/score/boolean'lar doğal.
- Filtreleme, her kolonda, wrapper'da sabit `filterDisplay="menu"` —
  STANDART demo davranışı (incelemede revize edildi): her menüde varsayılan
  Temizle + Uygula düğme çubuğu, filtreler YALNIZ Uygula'da uygulanır ve tipe
  göre match-mode dropdown'u gösterilir (yalnız tags'te gizli, demo-stili;
  boolean'lar `dataType="boolean"` ile otomatik gizler → yerleşik
  TriStateCheckbox). Altı standart METİN modu Türkçe-duyarlı global override
  edilir (`lib/filters.ts`); tarihler türetilmiş satırlardaki gerçek `Date`
  değerleri üzerinde yerleşik tarih modlarını kullanır; score sayısal
  InputNumber filtresi; enum'lar TEK yeniden kullanılabilir Dropdown öğesi
  (status/priority severity-Tag seçenek şablonlu); tags TEK yeniden
  kullanılabilir herhangi-biri MultiSelect (özel `arrayContainsAny`). Ortak
  öğe fabrikaları `components/AppDataTableFilters.tsx`'te. Global arama
  korunur (fullName + diagnosisTr/En üzerinde yerleşik Türkçe `contains`;
  `nfcContains` kaldırıldı).
- `AppDataTable`: `filterDisplay` ve `minTableWidth` prop'ları KALDIRILDI —
  menü filtreleme wrapper'ın içinde sabit ve kolonlar içeriğe göre sığar (dar
  ekranda yatay kaydırma beklenen davranıştır; gerçek bir mobil yerleşim ayrı,
  sonraki bir karardır). TR + EN PrimeReact locale'leri filtre sözlüğüyle
  (+ TR takvim adları) genişletildi; her filtre girdisinde yerelleştirilmiş
  placeholder; tüm filtre overlay'leri tek tutarlı 16rem genişlikte, kompakt
  0.75rem bölüm ritmiyle.
- (İncelemede eklendi) Zinc yüzey birleştirmesi: Lara `--surface-*`/`--gray-*`
  skalası iki modda da Tailwind zinc'e boyandı (`theme/_dark.scss`; katmansız,
  `@layer primereact`'i yener); `--app-ground/card-bg/card-border`
  `var(--surface-*)` alias'ı oldu; `modules/_prime-skin.scss` PrimeReact'in
  pişmiş yüzeylerini — konteyner öğeleri dahil — değişkenlere yönlendirir
  (DataTable, paginator, input'lar, dropdown/multiselect panelleri,
  datepicker, chip'ler); striped satırlar kapalı (yerine ızgara çizgileri).
**Dosyalar:** `src/modules/patients/{pages,components,lib,constants}/*`,
`src/components/AppDataTable.tsx`, `src/lib/{text,filters}.ts`,
`src/plugins/primereact.ts`, `src/styles/**`, `src/__test__/*`.
**Kabul:** `/patients` seed'li veriyi listeler; her kolon sıralanır (metinde
Türkçe collation, status/priority'de enum sırası) ve tipe-uygun menü
kontrolüyle filtrelenir; global arama ile `ışık`, `Işık`'ı bulur; boş durum
i18n `emptyMessage` gösterir; boolean'lar/enum'lar çevrilmiş render olur; dil
değişimi etiketleri ve diagnosis/note'u canlı yeniden çözer.
**Test:** saf node:test spec'leri — Türkçe satır sıralama, enum-sırası
sıralama, türetilmiş yerelleştirilmiş satırlar, ayrık tag/score toplayıcılar,
seçenek kurucular, `isoDateMatches` + `arrayContainsAny` yüklemleri,
tag-severity haritaları; render/etkileşim manuel QA ile (§11).
**DoD:** + global DoD; `modules/PATIENTS.md` güncellendi.

### 1.3 ✅ Hasta ekle / düzenle / sil formu
**Hedef:** Bir dialog içinde, Yup ile doğrulanan, mutation'lara bağlı, onaylı
silmeli iki dilli bir form (tüm alanlar yan yana).
**Bağımlılık:** 1.1, 1.2
**Yapılan:**
- `lib/patient.form.ts`: `PatientFormValues` + `createEmptyFormValues` /
  `toFormValues` / `toPatientRecord(values, system)` (ISO↔`Date`; kırpma;
  sistem alanları `id`/`createdAt`/`notes` enjekte edilir — `notes` kullanıcı
  tarafından düzenlenmez, düzenlemede korunur, oluşturmada `null`).
- `lib/patient-form.schema.ts`: MODA-DUYARLI `buildPatientFormSchema(mode)` —
  zorunlu/enum-üyeliği kuralları, doğum tarihi gelecekte olamaz, randevu her
  iki modda ≥ doğum tarihi ARTI yalnız OLUŞTURMADA ≥ bugün (gün bazlı;
  Calendar bunu `minDate` ile yansıtır — düzenleme geçmiş randevuları
  düzenlenebilir bırakır); skor tamsayı 1–5; tanı iki dilde de zorunlu;
  notlar opsiyonel. Tüm mesajlar tipli `message()` anahtarlarıyla.
- `components/AppDialog.tsx` (GLOBAL): yeniden kullanılabilir dialog kabuğu —
  800px masaüstü taban, `min(750px, 70vh)` max-yükseklik, sabit başlık +
  altlık yuvaları, tek kaydırma alanı olarak içerik, `_prime-skin.scss`'te
  zinc kaplama satırları.
- `components/PatientForm.tsx` + `PatientDialog.tsx`: oluşturma + düzenleme
  için TEK dialog (moda göre başlık / başlangıç değerleri / mutation
  değişir); bölüm gruplu iki sütunlu yerleşim mobilde tek sütuna iner (üç
  boolean onay kutusu HER genişlikte tek satırda kalır); her yerde
  yerelleştirilmiş placeholder; status/priority dropdown'ları ortak severity
  Tag'lerini çizer (seçenekler + seçili değer, `PatientTags.tsx` — 1.2
  kolonları/filtreleri de kullanır); altlıktaki Kaydet, Formik `innerRef` ile
  gönderir. `FormField` sabit tek satırlık hata yuvası ayırır (yerleşim
  kayması yok); `FormCheckbox` satır içi; wrapper'lara `placeholderKey` /
  `minDate` / generic `optionTemplate` eklendi.
- Satır eylemleri: sağda dondurulmuş kolon, aria-etiketli düzenle/sil ikon
  düğmeleri (opak dondurulmuş-hücre kaplaması + katmanlı hover); düzenle
  dialog'u önceden doldurur; sil, hastayı adıyla anan `confirmDialog()` →
  silme mutation'ı + toast'lar. Satıra-tıkla gezinme YOK (burada
  kararlaştırıldı).
**Testler:** yalnız saf `node:test` — alan başına geçerli/geçersiz şema
(oluştur/düzenle mod ayrımı dahil), eşleme gidiş-dönüşü, boş-değer
varsayılanları, kırpma/eleme, eksik-değer fırlatması (eski RTL + MSW satırı
§11 kararından önceydi ve yanlıştı).
**DoD:** karşılandı — `validate` + 88/88 test + build yeşil; dokümanlar
eşitlendi (PATIENTS/COMPONENTS + kural dosyaları, iki dil).
Commit'ler: `feat(patients): patient form schema and value mapping`,
`feat(patients): patient dialog with create and edit`, `feat(patients): row
actions with delete confirmation`, `fix(styles): zinc surfaces for dialog and
frozen cells`, `docs: …`.

---

### 1.4 ✅ Sprint-2-öncesi düzeltme paketi
**Hedef:** Sprint 2'den önce sahibin bildirdiği dört sorunun düzeltilmesi.
**Yapılan:** checkbox işaretli durumu yeniden görünür (koşulsuz zinc kutu
kuralı artık `:not(.p-highlight)` kapsamlı; işaretli onay işareti yeni
mod-değişmez `--app-checkmark` token'ıyla HER İKİ temada açık renge
zorlandı — Lara dark koyu işaret gömer); dialog kaydetmesi yeni global
`FormDirtyListener` ile Formik `dirty`'sine kapılandı (oluşturma devre dışı
başlar); mobil topbar düzeltildi (`.l-topbar-start`'a `flex:1` +
`min-inline-size:0`, başlık artık kısaltılıyor, responsive boşluklar);
AppDataTable header'ı `sm` altında responsive (toolbar sağa yaslı, tam
genişlik arama) ve sabit `72rem` tablo tabanı — dar ekran kolonları ezmek
yerine yatay kayar (kodu 1.2'nin belgelenmiş yatay-kaydırma niyetiyle
yeniden hizalar). Yeni saf-mantık test yok (CSS/bağlama); 88/88 yeşil kalır.

---

## Sprint 2 — Dokümantasyon, testler, erişilebilirlik, release

Sonuç: docs etlenir, öncelikli test paketi yerinde, a11y doğrulanır ve ilk
etiketli sürüm çıkar.

### 2.1 ⬜ modules/PATIENTS.md'yi tamamla + içerik gözden geçirme turu
**Hedef:** (Yeniden kapsamlandı — tam içerik yazımını 0.11 üstlendi.) Sprint 1
indikten sonra `modules/PATIENTS.md`'deki "planlı" işaretlerini gönderilmiş veri
katmanı + UI ile (gerçek kod) değiştir ve tüm dokümanlar üzerinde koda karşı bir
içerik gözden geçirme turu yap (her drift'i işaretle/düzelt).
**Bağımlılık:** Sprint 1 tamamlanmış
**Dosyalar:** `docs/{en,tr}/modules/PATIENTS.md`, `docs/{en,tr}/` genelinde
drift düzeltmeleri.
**Kabul:** PATIENTS.md gönderilmiş modülü belgeler, hiçbir şey planlı işaretli
değil; hiçbir yerde doc↔kod drift yok; registry sağlam.
**Test:** (registry-bütünlük testini yeniden kullan.)
**DoD:** + global DoD. Commit `docs: complete the patients module documentation`.

### 2.2 ⬜ Test paketini öncelik çıtasına getir
**Hedef:** Öncelik hedeflerini (§11) ve MSW kurulumunu, özelliklerle birlikte zaten
inen unit testlerin ötesinde sağlamlaştır.
**Bağımlılık:** Sprint 1 tamamlanmış
**Alt-adımlar:** MSW handler'larını + test setup'ı sonlandır; saf `lib/`'i (mapper,
`pickLocalized`, `formatDate`, Türkçe normalize/collator), composable
CRUD-on-storage + seed-bir-kez davranışını ve custom lint kuralını (`RuleTester`)
kapsadığından emin ol; eksik colocate `*.test.ts(x)` dosyalarını ekle; flake'leri
düzelt.
**Dosyalar:** `src/test/setup.ts`, `src/test/msw/*`, colocate `*.test.ts(x)`.
**Kabul:** `npm test` yeşil ve deterministik; öncelik hedefleri kapsandı; testte
gerçek ağ yok.
**Test:** bu görevin kendisi testtir.
**DoD:** + global DoD; `TESTING.md` gerçeği yansıtır. Commit
`test: complete priority test suite and msw setup`.

### 2.3 ⬜ Erişilebilirlik geçişi + son rötuş + ilk release
**Hedef:** a11y zeminini geç, son incelemeyi yap ve ilk sürümü çıkar.
**Bağımlılık:** 2.1, 2.2
**Alt-adımlar:** `eslint-plugin-jsx-a11y` temiz çalıştır; etiketli alanları,
ikon-buton `aria-label`'larını, dialog focus trap + return + `aria-labelledby`,
tablo header ARIA, `<html lang>` senkronunu doğrula; iki temayı WCAG AA kontrast
için kontrol et; responsive akıl-sağlığı kontrolü; §17'ye karşı son self-review;
ilk sürümü etiketlemek için release-please Release PR'ını merge et.
**Dosyalar:** gerektikçe bileşenlerde küçük düzeltmeler.
**Ertelenen UI rötuşu (0.6/0.7'den taşındı):** 404 sayfası metni/ifadesi;
`AppThemeToggle` ikon yönü (sun-vs-moon konvansiyonu); switcher/ikon-buton
`aria-label` ifade geçişi; `FormCheckbox` label-yanında düzeni (şu an diğer Form\*
wrapper'ları gibi label-üstte).
**Kabul:** jsx-a11y temiz; yalnız-klavye add/edit/delete çalışır; iki tema da
kontrast geçer; §17 kontrol listesi karşılanır; ilk sürüm üretilmiş CHANGELOG ile
etiketlenir.
**Test:** dialog akışı için klavye-etkileşim testi (opsiyonel ama tercih edilir).
**DoD:** + global DoD. Commit `fix: accessibility and final polish` (sonra Release
PR'ı merge et).

---

## Backlog / sonra (vaka çalışması kapsamı dışı)

- `build()` yardımcısı + dinamik `title` handle kullanan hasta detay route'u
  (`/patients/:patientId`).
- Storage şema versiyonlama (şu an clear + reseed, §10).
- Paket stabilleşince coverage eşiği.
