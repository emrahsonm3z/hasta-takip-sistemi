# Hasta Takip Sistemi

> Tek sayfalık, iki dilli bir poliklinik hasta paneli — modern React ile,
> gerçek bir ürün özeniyle geliştirilmiş bir case study.

**Canlı demo:** <https://hasta-takip-sistemi.vercel.app>

https://github.com/user-attachments/assets/f342a767-a135-4385-8302-7e8bf83b882a

_Tanıtım videosu (GitHub üzerinde oynatılır)._

---

## Bu nedir?

**Hasta Takip Sistemi**, bir poliklinikte hastaları ve randevuları yönetmek
için tasarlanmış tek sayfalık bir paneldir; Abisena / Panates teknik case
study'si olarak geliştirildi.

Hasta kayıtları salt-okunur bir API'den bir kez çekilir. Ekleme, düzenleme ve
silme işlemleri tamamen tarayıcıda yapılır ve `localStorage` sayesinde kalıcı
olur. Arayüz baştan sona iki dillidir (Türkçe ve İngilizce) ve açık/koyu tema
seçeneği sunar.

Veriler gerçek değil, örnek (mock) verilerdir. `localStorage` ile kalıcılık bu
case study'ye özgü bilinçli bir tercihtir; gerçek bir hasta uygulamasında bu
yaklaşım örnek alınmamalıdır.

Ayrıntılı dokümantasyon uygulamanın içindedir: kenar menüsündeki **Dokümanlar**
bölümü, `docs/{en,tr}/` altındaki iki dilli dosyaları gösterir. Yapay zekâ
ajanlarına yönelik operasyonel kurallar ise `CLAUDE.md` dosyasında bulunur.

---

## Özellikler

- **Hasta listesi:** 15 sütunlu, Türkçe alfabesine göre doğru sıralanan bir
  tablo; sütun başlığından sıralama ve menüden filtreleme (Uygula düğmesiyle).
- **Kayıt işlemleri:** Hasta ekleme, düzenleme ve silme; ekleme ile düzenleme
  için ayrı doğrulama kuralları.
- **İki dil, iki tema:** Türkçe / İngilizce arayüz ve açık / koyu tema.
- **Uygulama içi dokümantasyon:** İki dilli ve gezilebilir bir doküman
  görüntüleyici.
- **Erişilebilirlik:** WCAG AA düzeyinde temel erişilebilirlik desteği.
- **Hata izleme:** Yayın ortamında Sentry ile hata izleme (ücretsiz plan).

---

## Teknoloji yığını

| Katman | Teknoloji |
| --- | --- |
| Framework | React 18 (fonksiyon bileşenleri; Next.js yok) |
| Dil | TypeScript (strict; `any` yasak) |
| Build | Vite |
| Yönlendirme | React Router (data router) |
| UI kütüphanesi | PrimeReact 10.9.8 (Lara Green teması) + PrimeIcons |
| Utility CSS | Tailwind CSS 3.4 (token-destekli) |
| Özel CSS | SCSS (SMACSS düzeni) |
| Form | Formik + Yup (i18n-tipli mesajlar) |
| Sunucu verisi | TanStack React Query (GET'ten tek seferlik seed) |
| Kalıcılık | `localStorage` (istemci tarafı CRUD) |
| i18n | react-i18next (TR / EN) + PrimeReact Locale API |
| Tarihler | Day.js (aktif locale) |
| Doküman görüntüleme | react-markdown + remark-gfm + rehype-highlight |
| Hata izleme | Sentry (`@sentry/react`, yalnız production) |
| Sürümleme | release-please (Conventional Commits) |
| Test | Node 24 yerleşik test koşucusu (`node --test`) |
| Deploy | Vercel |

---

## Önkoşullar

- **Node 24** (`.nvmrc`; `nvm use`) — testler Node'un yerel TypeScript
  type-stripping'iyle çalışır ve eski sürümlerde sessizce atlanır.
- npm (lockfile commit'lidir; `npm ci` kullanın).

---

## Kurulum

```bash
nvm use
npm ci
cp .env.example .env
npm run dev
```

Çalıştırmadan önce `.env` dosyasındaki `VITE_API_URL` değerini seed veri
kaynağına ayarlayın; yoksa uygulama, bozuk bir arayüz yerine anlaşılır bir
yapılandırma-hatası ekranı gösterir.

Uygulama `http://localhost:5173` adresinde açılır.

---

## Ortam değişkenleri

| Değişken | Zorunlu | Amaç |
| --- | --- | --- |
| `VITE_API_URL` | evet | Salt-okunur hasta veri kaynağı (tek seferlik seed) |
| `VITE_SENTRY_DSN` | hayır | Sentry hata izleme (yalnız production; boşsa kapalı) |

`.env` gitignore'dadır; `.env.example` her zorunlu değişkeni belgeler. Eksik
bir değişken, bozuk bir uygulama yerine net bir yapılandırma-hatası ekranı
gösterir.

---

## Script'ler

| Script | Ne yapar |
| --- | --- |
| `npm run dev` | Geliştirme sunucusunu başlatır |
| `npm run build` | Tip kontrolü + production build |
| `npm run preview` | Production build'ini önizler |
| `npm test` | Birim testleri çalıştırır (Node 24, `node --test`) |
| `npm run type-check` | Yalnız TypeScript tip kontrolü |
| `npm run lint` | ESLint |
| `npm run lint:style` | Stylelint (SCSS) |
| `npm run format` / `format:check` | Prettier yaz / denetle |
| `npm run validate` | type-check + lint + lint:style + format:check |

---

## Mimari özet

Yapı modülerdir: her özellik `src/modules/` altında kendi bağımsız klasöründe
durur ve dışarıya tek bir giriş noktasından (`index.ts`) açılır. Birden çok
özelliği ilgilendiren altyapı ise global katmanlarda toplanır.

```
src/
├── modules/
│   ├── patients/   Hasta takibi: tam CRUD (liste, ekle/düzenle/sil) + mode-aware form doğrulama
│   └── docs/       Uygulama-içi doküman görüntüleyici
├── components/     Global UI (App* wrapper'lar, form alanları, kabuk)
├── composables/    useMenu, useNotify, useMediaQuery
├── lib/            Saf yardımcılar (Türkçe metin, tarih, pickLocalized)
├── plugins/        PrimeReact, tema, React Query, Day.js, i18n, Yup, Sentry config
├── router/         createBrowserRouter (layout + modül rotaları + 404)
├── locales/        tr.json + en.json (anahtar eşliği test-zorunlu)
└── styles/         SCSS (SMACSS) + tema token'ları
```

Tam açıklama uygulama içindeki **Mimari** dokümanındadır
(`docs/tr/ARCHITECTURE.md`).

---

## Test

```bash
nvm use
npm test
```

Saf-mantık birim testleri: menü kurulumu, doküman registry bütünlüğü, locale
anahtar eşliği, tema takası, Türkçe metin yardımcıları ve özel lint kuralı.
Ayrıntı: uygulama içindeki **Test** dokümanı.

---

## Kalite kapıları

Her commit'te Husky + lint-staged (ESLint/Prettier/Stylelint staged
dosyalarda, commitlint mesajda) çalışır. Her pull request'te CI `gate` job'u
(`.github/workflows/ci.yml`, Node sürümü `.nvmrc`'den) şunları koşar:

```
npm ci → npm run validate → npm test → npm run build → npm audit --audit-level=high
```

`gate` yeşil olmadan hiçbir PR merge edilemez. Commit mesajları Conventional
Commits'tir; sürümler ve `CHANGELOG.md` release-please tarafından otomatik
üretilir.

---

## Deploy

Vercel. `vercel.json` her yolu `index.html`'e yeniden yazar; böylece derin
bağlantılar (HTML5 history yönlendirmesi) yenilemede 404 vermez. `main`'e
merge otomatik yayınlar; sürümler release-please Release PR'ı merge
edildiğinde etiketlenir (uygulama içindeki **Sürümler ve Yayınlar**
dokümanına bakın).
