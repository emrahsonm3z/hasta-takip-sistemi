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

### 0.4 ⬜ Stil sistemi — token-destekli Tailwind + SCSS (SMACSS) + dark
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

### 0.5 ⬜ i18n locale dosyaları + anahtar tipleme
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

### 0.6 ⬜ Router + layout kabuğu + menü + dinamik başlık
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

### 0.7 ⬜ Global bileşenler (wrapper'lar, formlar, hata yüzeyleri, notify)
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

### 0.8 ⬜ CI, release-please, Dependabot, deploy config
**Hedef:** Otomatik kapı + release otomasyonu + bağımlılık hijyeni + Vercel'de SPA
routing (§14, §15).
**Bağımlılık:** 0.2
**Alt-adımlar:**
- `.github/workflows/ci.yml`: PR'da → `npm ci` → `validate` → `test` → `build` →
  `npm audit --audit-level=high`; required status check yap.
- `.github/workflows/release.yml`: release-please action;
  `release-please-config.json` + `.release-please-manifest.json` (version `0.0.0`
  başlangıç, `release-type: node`, **publish yok** — private).
- `.github/dependabot.yml`: npm ecosystem, minor/patch grupla, `primereact`,
  `tailwindcss`, `react`, `react-dom` için **major ignore** (§1.1).
- `vercel.json`: SPA rewrite (hepsi → `/index.html`); branch-protection kurulumunu
  WORKFLOW'da belgele (solo: required checks + manuel merge).
**Dosyalar:** `.github/workflows/ci.yml`, `.github/workflows/release.yml`,
`release-please-config.json`, `.release-please-manifest.json`,
`.github/dependabot.yml`, `vercel.json`.
**Kabul:** PR açmak CI'ı çalıştırır; `main`'e bir `feat:`/`fix:` merge'i
release-please'in doğru bump + CHANGELOG'lu bir Release PR açmasını sağlar; derin
linkler Vercel'de çalışır (refresh'te 404 yok).
**Test:** yok (ilk gerçek PR'da pipeline-doğrulamalı).
**DoD:** + global DoD. Commit `ci: add CI gate, release-please, dependabot, and SPA rewrite`.

### 0.9 ⬜ Docs modülü + registry + iskelet docs + README
**Hedef:** Uygulama-içi docs viewer çalışır ve her §13.2 dokümanı iki dilde
(iskelet) var olur, kayıtlı.
**Bağımlılık:** 0.6
**Alt-adımlar:**
- `modules/docs/`: markdown renderer bileşeni (`react-markdown` + `remark-gfm`,
  `@tailwindcss/typography` prose stilleri), aktif dile göre anahtarlanmış
  `import.meta.glob('/docs/**/*.md', { query: '?raw', import: 'default' })` ile
  loader; `constants/docs-registry.ts` (slug + `titleKey`, tek kaynak);
  `routes.tsx` (`DOCS_ROUTES`): `/docs` genel bakış + `/docs/:slug` viewer;
  `pages/`, `index.ts` barrel.
- Docs route'larını `router/index.tsx`'e bağla; `useMenu` docs grubunu ekler.
- Her §13.2 dosyası için iskelet `docs/en/*` + `docs/tr/*` oluştur, her biri §13.1
  sade özetiyle açılır (içerik 2.1'de doldurulur). `CHANGELOG.md` repo kökünde
  yalnız İngilizce (§13.5).
- `README.md`: kurulum, script'ler, env (`VITE_API_URL`), deploy.
**Dosyalar:** `src/modules/docs/**`, `docs/en/*.md`, `docs/tr/*.md`,
`docs/en/modules/*.md`, `docs/tr/modules/*.md`, `README.md`.
**Kabul:** `/docs` tüm dokümanları listeler; `/docs/:slug` aktif-dil markdown'ı
render eder; dil değiştirmek içeriği değiştirir; sidebar docs grubunu gösterir;
her kayıtlı doküman erişilebilir; kayıtsız-doküman kuralı geçerli.
**Test:** docs-registry slug↔dosya bütünlüğü (her registry slug'ı var olan bir en
+ tr dosyasına çözülür).
**DoD:** + global DoD. Commit `feat: add in-app docs module with bilingual skeletons`.

---

## Sprint 1 — Patients özelliği (baştan sona)

Sonuç: hastaları listele + ekle + düzenle + sil, iki dilli, Türkçe-duyarlı,
`localStorage`'da kalıcı, GET'ten bir kez seed'li.

### 1.1 ⬜ Patients veri katmanı
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

### 1.2 ⬜ Hasta listesi (AppDataTable, Türkçe sıralama/filtre/arama)
**Hedef:** Vaka çalışmasının bir sıralama + bir filtre + bir aramasıyla,
`AppDataTable`'ı render eden liste sayfası; iki dilli alanlar ve etiketler.
**Bağımlılık:** 1.1
**Alt-adımlar:**
- `pages/PatientsPage.tsx` (ince): `usePatients` çağırır, `PatientList` render
  eder, loading (`Loading`) ve okuma hatasını (`ErrorState` + retry) yönetir.
- `components/PatientList.tsx`: `AppDataTable` kolonları — `fullName`,
  `department` (filtre), `appointmentDate` (`formatDate 'LLL'`), `status`/`priority`
  çevrilmiş tag olarak (``t(`patient.status.${value}`)``), yerelleştirilmiş not
  `pickLocalized` ile; global arama kutusu; bir sıralanabilir kolon;
  Türkçe-duyarlı eşleşme.
- Satır eylemleri (edit/delete) `aria-label={t(...)}`'li ikon butonları olarak
  (1.3'te bağlanır).
- `routes.tsx`: `PATIENT_ROUTES.LIST` + lazy sayfa + `handle.titleKey`.
**Dosyalar:** `src/modules/patients/pages/PatientsPage.tsx`,
`src/modules/patients/components/PatientList.tsx`,
`src/modules/patients/routes.tsx` (+ barrel export).
**Kabul:** `/patients` seed'li veriyi listeler; Türkçe arama (ör. `şişli`/`sisli`)
eşleşir; sıralama Türkçe collation'a uyar; department filtresi satırları daraltır;
boş durum i18n `emptyMessage` gösterir; kolonlar yerelleştirilmiş değerleri ve
formatlanmış tarihleri render eder; dil değişimi reload olmadan yeniden etiketler.
**Test:** `PatientList` satır render eder, Türkçe filtre daraltır, sıralama sırası
doğru (RTL, MSW seed).
**DoD:** + global DoD; `modules/PATIENTS.md` güncellendi. Commit
`feat(patients): add list page with turkish-aware table`.

### 1.3 ⬜ Hasta ekle / düzenle / sil formu
**Hedef:** Dialog içinde, Yup ile doğrulanmış, mutation'lara bağlı, silme
onaylı, iki dilli bir form (tüm alanlar yan yana).
**Bağımlılık:** 1.1, 1.2
**Alt-adımlar:**
- `lib/patient.form.ts`: form değerleri ↔ model (calendar için ISO↔`Date`;
  create için varsayılanlar).
- `lib/patient-form.schema.ts`: `yup.setLocale` anahtarlarını kullanan Yup schema
  (literal mesaj yok); alanlar için required/format kuralları.
- `components/PatientForm.tsx`: Formik + her alan için `Form*` alanları; hem
  `noteTr`/`noteEn` hem `diagnosisTr`/`diagnosisEn` birlikte gösterilir (sekme yok).
- `components/PatientDialog.tsx`: create + edit için formu barındıran PrimeReact
  Dialog (focus-trap, `aria-labelledby`, focus return).
- Liste eylemlerini bağla: add (toolbar), edit (satır), delete (satır → onay) →
  `usePatientMutations`; success/error toast'ları; `dataKey` stabil id.
**Dosyalar:** `src/modules/patients/lib/{patient.form,patient-form.schema}.ts`,
`src/modules/patients/components/{PatientForm,PatientDialog}.tsx` (+ `PatientList`/
`PatientsPage`'te bağlama).
**Kabul:** create bir satır ekler (kalıcı); edit onu günceller; delete (onay
sonrası) onu kaldırır; doğrulama hataları yerelleştirilmiş mesaj gösterir;
iki-dilli alanlar kaydedilir; dialog klavye-erişilebilir; success/error'da
toast'lar tetiklenir.
**Test:** schema doğrulaması (eksik required, hatalı tarih); form↔model eşleme
round-trip; create/edit/delete storage + listeyi günceller (RTL + MSW).
**DoD:** + global DoD; `modules/PATIENTS.md` güncellendi. Commit
`feat(patients): add create, edit, and delete form`.

---

## Sprint 2 — Dokümantasyon, testler, erişilebilirlik, release

Sonuç: docs etlenir, öncelikli test paketi yerinde, a11y doğrulanır ve ilk
etiketli sürüm çıkar.

### 2.1 ⬜ Dokümantasyon içeriğini doldur (en + tr)
**Hedef:** 0.9 iskeletlerini her doküman için iki dilde gerçek, sade-dil içerikle
(§13.1) değiştir.
**Bağımlılık:** Sprint 1 tamamlanmış
**Alt-adımlar:** `ARCHITECTURE`, `COMPONENTS`, `CODING_STANDARDS`, `STYLING`,
`STATE_MANAGEMENT`, `I18N`, `TESTING`, `WORKFLOW`, `VERSIONING`,
`modules/PATIENTS`, `modules/DOCS`'u yaz — her biri §13.1 özeti + kısa örneklerle;
kodu/tanımlayıcıları iki dilde de İngilizce tut (§13.5); koda karşı doğrula
(her drift'i işaretle/düzelt).
**Dosyalar:** `docs/en/*.md`, `docs/tr/*.md`, `docs/{en,tr}/modules/*.md`.
**Kabul:** her doküman uygulama-içinde iki dilde render olur; doc↔kod drift yok;
her §13.2 girdisi iskelet-olmayan; registry sağlam.
**Test:** (0.9 registry-bütünlük testini yeniden kullan.)
**DoD:** + global DoD. Commit `docs: write full bilingual documentation content`.

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
