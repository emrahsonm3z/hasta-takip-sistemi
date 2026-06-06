# Mimari

Bu doküman, uygulamanın nasıl organize edildiğini anlatır: hangi yapı taşları
var, her biri neden sorumlu ve birbirine nasıl oturuyor. Sade bölümler herkese
büyük resmi verir; kod ve tablolar geliştiricilere kesin sözleşmeleri.

---

## Büyük resim

Hastaları takip etmek için tek sayfalık bir web uygulaması. Hasta listesini
salt-okunur bir veri servisinden bir kez yükler, sonraki tüm değişiklikleri
kendi cihazınızda tutar ve iki dil konuşur (Türkçe ve İngilizce). Giriş yoktur
— uygulama olduğu gibi incelenen bir case study'dir.

---

## Dizin yapısı

Bugün depoda olan budur.

```
src/
├── main.tsx                 Açılış: i18n → env kontrolü → tema → provider'lar → router
├── config/
│   └── env.ts               Tipli dondurulmuş env + validateRequiredEnvVars()
├── plugins/                 Üçüncü parti kütüphane yapılandırması
│   ├── primereact.ts        Provider config + TR locale + Türkçe-override metin filtre modları
│   ├── theme.ts             Lara Green açık/koyu ?url takası, <link id="app-theme">
│   ├── theme.lib.ts         Saf tema-takas mantığı (birim-testli)
│   ├── react-query.ts       QueryClient varsayılanları
│   ├── dayjs.ts             Day.js eklentileri + tr/en locale'leri
│   ├── sentry.ts            Yalnız-hatalar Sentry init (yalnız prod + DSN; saf gürültü filtresi sentry.lib.ts'te)
│   ├── i18n.ts              react-i18next init + PrimeReact + Day.js köprüsü
│   └── yup.ts               yup.setLocale() → i18n mesaj anahtarları
├── router/
│   └── index.tsx            createBrowserRouter: layout + modül rotaları + 404
├── components/              Global UI: AppDataTable (+ AppDataTableFilters), AppDialog,
│   │                        AppPrimeReactProvider (locale köprüsü), AppToastProvider, hata ekranları
│   ├── form/                Formik↔PrimeReact alan wrapper'ları (6 alan + FormField kabuğu
│   │                        + FormDirtyListener)
│   └── layout/              AppLayout, AppSidebar, AppTopbar, AppLogo, …
├── composables/             useMenu, useNotify, useMediaQuery (+ saf .lib çekirdekleri)
├── lib/                     Global saf yardımcılar: text, date, filters, pickLocalized, route
├── locales/                 tr.json + en.json (aynı anahtar kümesi, test-zorunlu)
├── styles/                  SCSS (SMACSS) + token alias'ları
├── types/                   Route handle + TranslationKey tipleri
├── __test__/                Kaynak ağacını aynalayan node:test spec'leri
└── modules/
    ├── patients/            Hasta takibi (tamamlandı: liste + ekle/düzenle/sil)
    │   ├── api/  composables/  constants/  models/  pages/
    │   ├── components/      PatientList, PatientForm, PatientDialog, PatientTags
    │   ├── lib/             patient.mapper, patient.form, patient-form.schema,
    │   │                    patient-list.lib, patient-storage.lib
    │   ├── routes.tsx
    │   └── index.ts
    └── docs/                Bu doküman görüntüleyici (kendi dokümanına bakın)
        ├── components/  composables/  constants/  lib/  pages/
        ├── routes.tsx
        └── index.ts
```

---

## Katman sorumlulukları

Bir modülün içinde kod, her biri tek iş yapan katmanlardan akar — her katman
yalnızca bu tabloda kendinden üsttekilere yaslanabilir:

| Katman | Sorumluluk |
| --- | --- |
| `api/` | Yalnız I/O — ağ çağrıları ve depo okuma/yazma; parse yok, mantık yok |
| `models/` | Arayüzler, tipler, enum-benzeri union'lar |
| `lib/` | Mapper'lar ve saf yardımcı fonksiyonlar (birim-testlenebilir) |
| `composables/` | `useQuery`/`useMutation` sarmalayıcıları + orkestrasyon |
| `pages/` | İnce kabuklar — composable çağırır, bileşen birleştirir |
| `components/` | Veriyi props ile alır, çizer |
| `constants/` | Query-key factory'leri, rota sabitleri |

Global katmanlar aynı fikri aynalar: `src/lib` (saf), `src/composables`
(hook'lar), `src/components` (UI), `src/plugins` (üçüncü parti config).

---

## Modüller ve barrel kuralı

Her özellik `src/modules/` altında kendi bağımsız klasöründe yaşar ve tek bir
resmî kapı açar: `index.ts` (the "barrel"). Geri kalan her şey özeldir.

```ts
// Doğru — barrel resmî API'dir
import { PATIENT_ROUTES } from '@/modules/patients'
import { docsRegistry, DOCS_ROUTES } from '@/modules/docs'

// Yanlış — başka bir modülün içine derin import yasaktır
import { docsRegistry } from '@/modules/docs/constants/docs-registry'
```

Global katmanlar (router, `useMenu`) modül barrel'larını import edebilir.
Modüller arasında yeniden kullanılan her şey global bir katmana taşınır —
asla kopyalanmaz, asla içeriye uzanılmaz.

---

## Yönlendirme

Rotalar her modülün `routes.tsx` dosyasında **sabit** olarak bildirilir, asla
elle yazılmış string olarak değil. Gerçek patients bildirimi:

```tsx
const PatientsPage = lazy(() => import('./pages/PatientsPage'))

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
    element: <PatientsPage />,
    handle: { titleKey: PATIENT_ROUTES.LIST.titleKey } satisfies AppRouteHandle,
  },
]
```

Bir modülden adres çubuğuna akış:

```
modules/{m}/routes.tsx  →  modules/{m}/index.ts  →  router/index.tsx  →  useMenu
(rota sabitleri)           (barrel re-export)       (createBrowserRouter)  (sidebar)
```

Bugünkü tam rota ağacı:

```
/                  → /patients'a yönlendirme
/patients          → PatientsPage
/docs              → DocsOverviewPage (dokümantasyon indeksi)
/docs/:slug        → DocViewerPage (tek doküman)
*                  → NotFound (404)
```

Her rota tipli bir `handle` taşır (`AppRouteHandle`): i18n üzerinden çözülen
bir `titleKey` ya da dinamik başlıklar için bir `title(match)` fonksiyonu
(doküman görüntüleyici, tarayıcı sekmesine dokümanın adını bununla yazar).
`AppLayout` en derin eşleşmeyi okur ve `document.title`'ı kurar; sayfalar ince
kalır. Path'ler dil-nötr İngilizce'dir; etiketler her zaman i18n'den gelir.

Kenar menüsü aynı rota sabitlerinden `useMenu` ile **türetilir** — elle
yazılmış menü dizisi yoktur, menü listeyle asla uyumsuz kalamaz. Dokümanlar
girdisi ayrıca kayıtlı dokümanları çocuk olarak iç içe taşır.

---

## Açılış (bootstrap)

`src/main.tsx`, sırasıyla — her adım bugün dosyada vardır:

1. Yan-etki import'ları: i18n init, Yup locale, SCSS paketi.
2. `validateRequiredEnvVars()` — zorunlu bir değişken eksikse uygulama
   `ConfigErrorScreen` çizer ve durur (yarım-bozuk uygulama yok).
3. `applyTheme()` — saklanan moddan Lara tema `<link>` href'ini kurar.
4. Provider'lar, en dıştan içe: `StrictMode` → `AppErrorBoundary` →
   `QueryClientProvider` → `PrimeReactProvider` → `AppToastProvider` → `App`.

---

## Hata izleme (Sentry, yalnız-hatalar)

Production build'leri, `VITE_SENTRY_DSN` ayarlandığında beklenmeyen hataları
Sentry'ye raporlar (ücretsiz Developer katmanı: yalnız hatalar —
`tracesSampleRate: 0`, Session Replay yok, profiling yok). Init,
`main.tsx`'te ilk import edilen `plugins/sentry.ts`'te yaşar; saf (birim
testli) `shouldDropErrorEvent` filtresi ResizeObserver döngü gürültüsünü ve
tarayıcı-eklentisi frame'lerini düşürür. Mevcut iki error boundary
yakaladıklarını raporlar (render çökmeleri; 404-dışı route hataları) —
beklenen veri hataları ve 404'ler bilerek yakalanmaz. PII korkulukları:
`sendDefaultPii: false`; CRUD `localStorage`'da yaşar ve SDK onu asla okumaz;
fırlatılan mesajlar anahtar/sayı taşır, asla alan değeri taşımaz — ve bir
hasta ID'si bir route/URL'ye girerse (backlog'taki detay route'u) breadcrumb
URL temizliği zorunlu olur. Kaynak-haritası yüklemesi (`@sentry/vite-plugin`)
`SENTRY_AUTH_TOKEN` üzerinde çift kapılıdır: token yokken build ne yükler ne
de `.map` dosyası üretir; eklentinin release adı SDK'nınkiyle eşleşir
(`hasta-takip-sistemi@<version>`), böylece yüklenen haritalar olaylara karşı
sembolize olur. DSN ve auth token sahip tarafından yönetilir (Vercel env) ve
asla repoda yaşamaz.

## Yapılandırma

| Değişken | Zorunlu | Amaç |
| --- | --- | --- |
| `VITE_API_URL` | evet | Salt-okunur hasta veri kaynağı (tek seferlik seed) |

Tipli erişim `src/config/env.ts`'te yaşar:

```ts
const REQUIRED_ENV_VARS = ['VITE_API_URL'] as const

export const env = Object.freeze({
  apiUrl: typeof apiUrlValue === 'string' ? apiUrlValue : '',
})
```

`.env` asla commit'lenmez; `.env.example` her değişkeni belgeler. Eksik bir
değişken, bozuk bir uygulama yerine net bir yapılandırma-hatası ekranı üretir
(geliştirmede değişken adları, production'da çevrilmiş mesaj).
