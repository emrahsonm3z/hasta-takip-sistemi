# Hasta Takip Sistemi

---

## Bu nedir?

**Hasta Takip Sistemi**, bir poliklinik hasta randevu ve takip panelidir
(Abisena / Panates teknik case study'si). Hasta kayıtları salt-okunur bir
API'den bir kez yüklenir; ekleme, düzenleme ve silme tarayıcı tarafında
çalışır ve `localStorage`'da kalıcıdır. Arayüz tamamen iki dillidir
(Türkçe / İngilizce) ve açık/koyu tema destekler.

Veri sahte (mock) veridir — `localStorage` kalıcılığı bu case study için
bilinçli bir tercihtir, gerçek hasta verisi için bir desen değildir.

Ayrıntılı dokümantasyon uygulamanın içinde yaşar: kenar menüsündeki
**Dokümanlar** girişi, `docs/{en,tr}/` altındaki iki dilli markdown
dokümanlarını render eder. Ajan-yönelimli operasyonel kurallar `CLAUDE.md`
dosyasındadır.

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

Modüler yapı: her özellik `src/modules/` altında kendi bağımsız klasöründe
yaşar ve tek kapısı olan bir barrel (`index.ts`) ile dışa açılır. Kesişen
altyapı global katmanlardadır.

```
src/
├── modules/
│   ├── patients/   Hasta takibi (rota + sayfa; veri katmanı Sprint 1.1)
│   └── docs/       Uygulama-içi doküman görüntüleyici
├── components/     Global UI (App* wrapper'lar, form alanları, kabuk)
├── composables/    useMenu, useNotify, useMediaQuery
├── lib/            Saf yardımcılar (Türkçe metin, tarih, pickLocalized)
├── plugins/        PrimeReact, tema, React Query, Day.js, i18n, Yup config
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
