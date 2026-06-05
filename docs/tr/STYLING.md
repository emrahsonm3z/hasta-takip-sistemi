# Stil ve Tema

Bu doküman, uygulamanın görünümünü nereden aldığını anlatır: renkler nereden
gelir, açık ve koyu mod nasıl çalışır, her şey görsel olarak neden tutarlı
kalır. İlke herkes için yeterince basit: **tam olarak bir palet vardır ve
ekrandaki her renk onu gösterir.** Sayfanın kalanı geliştiricilere bunun nasıl
bağlandığını gösterir.

---

## Tek token kaynağı, çok tüketici

Tek tasarım-token kaynağı, CSS değişkenlerini (`--primary-color`,
`--surface-0…900`, `--text-color`, …) tanımlayan PrimeReact **Lara Green**
tema stylesheet'idir. Tailwind ve bizim SCSS'imiz aynı değişkenleri tüketir.
Token tanımları dışında ham hex renk her yerde yasaktır.

```
Lara Green tema CSS'i (çalışma anında takas)  styles/theme/_dark.scss (bizim)
  → YEŞİL vurgu + bileşen skin'leri             → NÖTR skala: --surface-*
                                                  Tailwind ZINC'e boyandı,
                                                  açık VE koyu
      ├→ tailwind.config.ts   renkler doğrudan değişkenlere eşlenir
      ├→ styles/utils/_tokens.scss   özel SCSS için alias'lar
      └→ styles/modules/_prime-skin.scss   PrimeReact'in pişmiş bileşen
         yüzeylerini (tablolar, input'lar, dropdown panelleri) değişkenlere yönlendirir
```

Bilinmeye değer bir incelik: PrimeReact teması bileşenlerini sabit renk
değerleriyle boyar — çalışma anında `--surface-*` değişkenlerini okumaz. Bu
yüzden `_dark.scss`'imiz nötr skalanın tamamını zinc'e (sayfanın kendi gri
ailesine) yeniden tanımlar ve `_prime-skin.scss`, boyanmış bileşen
yüzeylerini — hem HÜCRELERİ (başlık/gövde/altlık hücreleri, ızgara çizgileri,
hover, paginator düğmeleri, input'lar, dropdown öğeleri) hem de temanın ayrı
boyadığı KONTEYNER öğelerini (`.p-datatable-thead` / `-tfoot` / `-footer`,
dropdown ve multiselect panelleri + başlıkları, datepicker, chip'ler,
kolon-filtre overlay'i + operatör başlığı) — aynı değişkenlere yönlendirir. Her yerde tek
gri ailesi; yeşil vurgu Lara'nın kalır. Tablo satırları transparandır ve
doğrudan kartın üzerinde oturur, ince ızgara çizgileriyle ayrılır (striped
satırlar kapalı). Gelecekte çatışan bir PrimeReact bileşeni
`_prime-skin.scss`'e bir satır alır — asla yerel override değil.

Tailwind tarafı (`tailwind.config.ts`'ten, olduğu gibi):

```ts
colors: {
  primary: 'var(--primary-color)',
  ground: 'var(--surface-ground)',
  card: 'var(--surface-card)',
  text: 'var(--text-color)',
  'text-secondary': 'var(--text-color-secondary)',
  'app-ground': 'var(--app-ground)',
},
```

SCSS tarafı (`styles/utils/_tokens.scss`) aynı değişkenleri alias'lar
(`$color-primary: var(--primary-color);` …), böylece özel SCSS de asla hex
değere dokunmaz.

---

## Açık ve koyu mod — tek anahtar, iki etki

Ay/güneş çipi `setThemeMode(mode)`'u çağırır (`plugins/theme.ts`); o da tam
iki şey yapar: `<link id="app-theme">` stylesheet'ini açık ve koyu Lara
dosyaları arasında takaslar ve `<html>` üzerindeki `dark` sınıfını açıp
kapatır. Seçim `localStorage`'da `theme-mode` altında kalıcıdır.

```ts
export function applyThemeMode(mode: ThemeMode, target: ThemeTarget): void {
  target.linkElement?.setAttribute('href', target.hrefForMode(mode))
  target.root.classList.toggle('dark', mode === 'dark')
  target.storage.setItem(THEME_STORAGE_KEY, mode)
}
```

İki tema dosyası aynı değişkenleri yeniden tanımladığı için token üzerine
kurulu her şey otomatik olarak mod-doğrudur — bu yüzden token renklerinde
Tailwind `dark:` varyantları **yasaktır**: ikinci, gereksiz bir mekanizma
olurlardı. `index.html` içindeki küçük bir satır-içi script `dark` sınıfını
ilk boyamadan önce uygular; yanlış arka plan parlaması olmaz.

---

## Uygulamaya özel custom token'lar

PrimeReact teması bizim kabuğumuzu bilmez; kabuk kendi token'larını tanımlar —
her mod için bir kez (`styles/theme/_dark.scss`, `:root` + `.dark`):

| Token | Açık | Koyu |
| --- | --- | --- |
| `--app-ground` (sayfa zemini) | `var(--surface-ground)` → zinc-50 | `var(--surface-ground)` → zinc-950 |
| `--app-card-bg` (yükseltilmiş yüzey) | `var(--surface-card)` → beyaz | `var(--surface-card)` → zinc-900 |
| `--app-card-border` | `var(--surface-border)` → zinc-200 | `var(--surface-border)` → zinc-700 |
| `--app-card-shadow` | hafif iki katmanlı gölge | `none` (ayrımı kenarlık yapar) |
| `--app-menu-item-hover-bg` | `rgb(100 116 139 / 10%)` | `rgb(255 255 255 / 5%)` |
| `--app-radius-card/-item` | `8px` | aynı |
| `--app-radius-sidebar/-drawer` | `16px` | aynı |
| `--app-sidebar-width` | `21rem` | aynı |
| `--glow-image` / `--glow-blend` | dekoratif desen + blend modu | aynı |

Renk literal'lerine izin verilen **tek** yer bu tanımlardır. Yeni bir custom
token, ancak uygun bir tema değişkeni yoksa eklenir.

---

## Yüzey modeli

Tasarım dili (Atlantis-esinli): **kenar menüsü düz katmandır** — arka plan
yok, kenarlık yok, gölge yok; menü doğrudan sayfa zemininin üzerinde oturur ve
dekoratif desen arkasından görünür. **Kartlar yükseltilmiş katmandır** —
`.card` (`styles/modules/_card.scss`) tek yükseltilmiş yüzeydir: kart arka
planı + 1px kenarlık + koyu modda `none`'a düşen hafif bir gölge. Formlar ve
paneller kartların üzerinde yaşar; dokümantasyon metni içerik yüzeyinin
üzerine doğrudan, sola hizalı oturur.

Kabuk viewport'a kilitlidir: pencere asla kaymaz; tek kaydırma bölgesi
`<main>`'dir — uzun sayfalarda kenar menüsü ve üst çubuk yerinde kalır.

---

## Hangi araç, ne zaman

| İhtiyaç | Kullan |
| --- | --- |
| Boşluk, yerleşim, tek seferlik utility | Tailwind utility (yalnız token-destekli renkler) |
| Renk | `primary` / `surface-*` / `text` — asla ham hex |
| PrimeReact bileşen içleri | PassThrough (`pt`) + token-destekli sınıflar |
| Yeniden kullanılır karmaşık stil | SCSS modülü (SMACSS), yalnız `_tokens.scss` alias'ları |
| Durum varyasyonu | SMACSS `is-` sınıfı (örn. `is-active`, `is-collapsed`) |

Hover/aktif durumlar düz bir yüzey basamağı kullanır (`bg-surface-100`), asla
opaklık değiştirici değil — köprülenen renkler alfa kanalı taşımaz.

---

## Cascade katmanları — stiller neden hiç kavga etmez

Tüm CSS, dört sıralı cascade katmanına iner; sıra, herhangi bir stylesheet
yüklenmeden önce kilitlensin diye `index.html`'de **en başta** bildirilir:

```
@layer tw-base, primereact, tw-components, tw-utilities;
```

Etkin öncelik, alttan üste: Tailwind preflight → PrimeReact teması → bizim
bileşenlerimiz (`l-*` kabuk, `.card`, prose ayarları) → Tailwind utility'leri.
Yani bir PrimeReact bileşenindeki utility sınıfı her zaman kazanır ve tema
asla kabuk stilimizin üzerine taşmaz. Özel SCSS partial'ları kurallarını
`@layer tw-components { … }` içine sarar; aynı adlı katmanlar birleşir.

---

## Tipografi

Yazı tipi **Inter**'dir (variable woff2, `styles/fonts/` içinde self-hosted —
CDN yok); `latin-ext` Türkçe glifleri (ğ ş ı İ) kapsar. Taban boyut 14px'tir,
`main.scss`'te kurulur. Render edilen dokümantasyon `@tailwindcss/typography`
eklentisini kullanır; her `--tw-prose-*` rengi `tailwind.config.ts` içinde
tema değişkenlerine eşlenmiştir — içerik yüzeyinde sola hizalı, ~920px ile
sınırlı — ve koyu modun hiçbir ek maliyet getirmediği bir yer daha
(`prose-invert` gereksizdir ve kullanılmaz). Tek onaylı istisna: çitli kod
blokları **iki modda da koyu** çizilir (highlight.js `github-dark`); kod her
zaman alışıldık koyu zemininde okunur.
