# Ortak Bileşenler

Bu doküman, her ekranın kendisinden derlendiği yeniden kullanılabilir yapı
taşlarını anlatır. Sade bölümler her bloğun ne yaptığını açıklar; tablolar ve
kod, geliştiricilere kesin sözleşmeleri gösterir. Değişmez kural: çağrı
noktalarında bu wrapper'lar **zorunludur** — bir `App*` wrapper'ı varken ekran
asla ham PrimeReact bileşenini kullanmaz; eksik bir yetenek yerel geçici
çözümle değil, wrapper'a eklenerek kazanılır.

---

## Katalog

| Bileşen | Dosya | İş |
| --- | --- | --- |
| `AppDataTable` | `components/AppDataTable.tsx` | Tek tablo — Türkçe bilen sıralama/filtre/arama |
| `AppDataTableFilters` | `components/AppDataTableFilters.tsx` | Ortak menü-filtre öğe fabrikaları (enum/multiselect/tarih/sayı/boolean) |
| `AppDialog` | `components/AppDialog.tsx` | Dialog kabuğu: 800px taban, sınırlı yükseklik, sabit başlık/altlık, kayan içerik |
| `AppToastProvider` | `components/AppToastProvider.tsx` | Tek `<Toast/>`'u monte eder; `useNotify`'ı besler |
| `Loading` | `components/Loading.tsx` | Lazy rotalar ve ilk yüklemeler için spinner |
| `ErrorState` | `components/ErrorState.tsx` | Beklenen veri hataları için sayfa-içi "başarısız, yeniden dene" |
| `RouteErrorBoundary` | `components/RouteErrorBoundary.tsx` | Beklenmeyen rota hataları için router `errorElement`'i |
| `AppErrorBoundary` | `components/AppErrorBoundary.tsx` | En dış class boundary → `FatalError` |
| `FatalError` | `components/FatalError.tsx` | Son çare çökme ekranı (yeniden yükle düğmesi) |
| `ConfigErrorScreen` | `components/ConfigErrorScreen.tsx` | Uygulama açılmadan gösterilen eksik-ortam ekranı |
| `NotFound` | `components/NotFound.tsx` | 404 sayfası (bilinmeyen doküman slug'ları için de) |
| `form/Form*` | `components/form/` | Formik↔PrimeReact alan seti (altı alan + ortak kabuk) |
| `layout/App*` | `components/layout/` | Kabuk: layout, sidebar, topbar, logo, anahtarlar |

---

## Her şey için tek tablo

Tüm listeler `AppDataTable` kullanır. PrimeReact DataTable'ını sarar ve her
ekranın yoksa yeniden kuracağı şeyleri hazır getirir: Türkçe bilen genel
arama, Türkçe-collator sütun sıralaması (`lib/text.ts`'teki
`sortRowsByTurkishValue` / `sortRowsByTurkishField`), **wrapper'ın içinde
sabit, STANDART menü-tipi sütun filtreleme** (`filterDisplay="menu"`,
demo-varsayılanı davranış: her filtre menüsünde Temizle + Uygula düğme çubuğu
— filtreler YALNIZ Uygula'da uygulanır — ve tipe göre match-mode dropdown'u;
altı standart metin modu Türkçe-duyarlı olacak şekilde global override
edilir, özel `arrayContainsAny` tag herhangi-birini karşılar), bir toolbar
yuvası, filtreleri temizleme düğmesi, iki yükleme modu (ilk → `Loading`; arka
plan yenileme → tablonun overlay'i) ve `md` altında numaralı PageLinks'i
bırakan paginator — yoğunluk moduyla aynı `isBelowMd` anahtarı: telefonlarda
şablon, kompakt `İlk/Önceki/Rapor/Sonraki/Son` seti artı satır-sayısı
dropdown'udur; `md` ve üzerinde tam numaralı şablon çizilir. Tablo her zaman
PrimeReact'in
küçük boyutuyla çizilir (`size="small"` wrapper'ın içindedir — çağrı yerleri
asla vermez). `md` (768px) ve üzerinde kolonlar sabit `72rem` tablo tabanının
üzerinde içeriğe göre sığar; dar pencerede tablo, kolonlarını ezmek yerine
kendi bölgesi içinde yatay kayar. Bu taban `tableMinWidth` prop'udur
(varsayılan `72rem`, yani hasta tablosu değişmez); az kolonlu bir çağrı yeri
daha küçük bir değer geçebilir — tanıtım canlı önizlemesi `100%` geçer, böylece
beş kolon yatay kaymadan genişliği doldurur. `md` altında wrapper bu tabanı
bırakır (kolonlar kendi minimumlarına iner) ve uygulama-geneli yoğunluk kuralları
devreye girer — 12px kök boyut ve küçük düğmeler, Stil dokümanına bakın;
hasta listesi ayrıca satır eylemlerini dokunmaya-uygun desenle değiştirir
(hasta modülü dokümanına bakın). Header responsive'dir: `sm` altında toolbar
sağa yaslanır ve arama kutusu, yanındaki filtre-temizle düğmesiyle tam
genişliğe uzar.

Bir kolonun varsayılan InputText öğesinden fazlasına ihtiyacı olduğunda,
`components/AppDataTableFilters.tsx`'teki ortak fabrikalar demo-standardı
öğeleri sağlar — enum Dropdown (opsiyonel seçenek şablonuyla), tags
MultiSelect, Calendar, InputNumber, TriStateCheckbox — hepsi `filterCallback`
ile (yani Uygula'da) uygulanır; asla kolon başına yeniden yazılmaz.

Bugünkü bileşenden, props'ları:

```ts
interface AppDataTableProps<T extends object> {
  data: T[]
  children: ReactNode            // <Column> tanımları
  dataKey?: string
  loading?: boolean
  toolbar?: ReactNode
  showSearchBox?: boolean        // varsayılan true
  globalFilterFields?: string[]
  defaultFilters?: DataTableFilterMeta
  sortField?: string
  sortOrder?: 1 | 0 | -1 | null
  onSort?: (event: DataTableSortEvent) => void
  paginator?: boolean            // varsayılan true
  rows?: number                  // varsayılan 10
  rowsPerPageOptions?: number[]  // varsayılan [10, 20, 50]
  rowClass?: (row: T) => string
  rowHover?: boolean
  stripedRows?: boolean
  emptyMessageKey?: TranslationKey  // varsayılan 'common.noResults'
  tableMinWidth?: string            // varsayılan '72rem' — md+ tablo tabanı
}
```

İşi olmayanlar: veri çekme ve sayfa-düzeyi hatalar — onlar composable'lara ve
aşağıdaki hata yüzeylerine aittir. Saf çekirdeği `buildInitialFilters`
(`AppDataTable.lib.ts`) birim-testlidir.

---

## Dialog'lar

`AppDialog`, her uygulama dialog'unun geçtiği kabuktur (PatientDialog tüm
iskeletini onun üzerinden kurar). Başlığı ve `footer` yuvasını sabitler
(eylem düğmeleri oraya konur — form DOM'unun dışındaki kaydet düğmesi
Formik'in `innerRef`'i üzerinden gönderir) ve içerik bölgesini tek kaydırma
alanı yapar. Boyutlandırma kabukta yaşar: 800px masaüstü taban genişlik,
`min(750px, 70vh)` max-yükseklik, 12px köşe yarıçapı, 960→75vw / 640→95vw
kırılımları. Zinc dialog yüzeyleri `_prime-skin.scss`'tedir; dolgu/kaydırma
ayrıntıları `app-dialog` sınıfı altında kapsamlanır. PrimeReact
`ConfirmDialog` bunun üzerinden GEÇMEZ (kendi kabul/ret API'si vardır) —
ortak `.p-dialog` zinc kaplamasını miras alır.

## Form alanları

Formik'e bağlı altı alan tek bir kabuğu (`FormField`) paylaşır: i18n etiketini
çizer, `htmlFor`/`id` bağlar (etiketsiz girdi yok), Yup hatalarını çözer ve
SABİT tek satırlık mesaj yuvası ayırır — beliren bir hata alttaki alanları
asla kaydırmaz; yuva, `aria-describedby` + `aria-invalid` ile girdiye bağlı
nazik bir canlı bölgedir (`aria-live`; PrimeReact'in `invalid` prop'u tek
başına ARIA üretmez). Tüm alanlar tipli `placeholderKey` kabul eder (düz literal
placeholder derleme hatasıdır):

| Alan | Sardığı | Ekstra |
| --- | --- | --- |
| `FormInputText` | InputText | |
| `FormInputNumber` | InputNumber | |
| `FormDropdown` | Dropdown | generic `optionTemplate` özel seçeneği VE seçili değeri çizer (ör. severity Tag'leri) |
| `FormCalendar` | Calendar | `minDate` |
| `FormCheckbox` | Checkbox | satır içi yerleşim: kutu + etiket tek satırda (üstte etiket yok, hata yuvası yok) |
| `FormChips` | Chips | |
| `FormDirtyListener` | — (hiçbir şey çizmez) | Formik `dirty`'sini yukarı bildirir; sabit dialog altlığı bir şey değişene dek kaydetmeyi devre dışı bırakabilir |

Doğrulama mesajları serileştirilmiş `{ key, values }` JSON'u olarak gelir
(`plugins/yup.ts` yazar) ve çizim anında çevrilir:

```ts
export function resolveValidationMessage(raw: string, t: Translate): string {
  const serialized = parseSerialized(raw)
  return serialized ? t(serialized.key, serialized.values) : raw
}
```

Böylece "en az 2 karakter" kuralı tek şemadan Türkçede "En az 2 karakter
olmalıdır.", İngilizcede "Must be at least 2 characters." gösterir.

---

## Dört hata yüzeyi

Her sorun türünün tam olarak bir yüzeyi vardır; asla karıştırılmaz:

| Durum | Yüzey | Kullanıcının gördüğü |
| --- | --- | --- |
| Beklenen veri-yükleme hatası | `ErrorState` | Sayfa-içi mesaj + Yeniden Dene düğmesi |
| Bir rotada beklenmeyen hata | `RouteErrorBoundary` | Nazik hata sayfası + ana sayfa bağlantısı |
| Ağacın herhangi bir yerinde çökme | `AppErrorBoundary` → `FatalError` | Yeniden yükleme ekranı |
| Eksik/geçersiz ortam | `ConfigErrorScreen` | Uygulama açılmadan yapılandırma hatası |

Kullanıcı eylemi geri bildirimi (kaydedildi, silindi, başarısız) beşinci
kanaldır: bir toast.

`FatalError` ve `ConfigErrorScreen` bilerek düz JSX ve i18n singleton'ı
(`i18n.t`) kullanır — PrimeReact yok, hook yok — böylece çökmüş ya da henüz
monte edilmemiş bir ağaçta bile hayatta kalırlar.

---

## Bildirimler — `useNotify`

Toast API'si **yalnızca** tipli çeviri anahtarı kabul eder; ham string derleme
hatasıdır. "Koda gömülü kullanıcı metni yok" kuralı, code review'a kalmadan
böyle hayatta kalır:

```ts
const notify = useNotify()
notify.success('patients.title')   // ✓ bir TranslationKey
notify.error('Something failed')   // ✗ derleme hatası
```

Saf çekirdeği `normalizeErrorKey` (`useNotify.lib.ts`, birim-testli)
bilinmeyen fırlatılan değerleri `errors.unexpected`'e eşler ve kendi
`messageKey`'ini taşıyan hataları olduğu gibi geçirir.

---

## Yerleşim kabuğu

Çerçevenin sahibi `AppLayout`'tur: sabit şeffaf kenar menüsü (`AppSidebar` —
iç içe Dokümanlar alt-menüsü ve mobil çekmeceyle), üst çubuk (`AppTopbar`:
hamburger, sayfa başlığı, dil + tema çipleri) ve tek kaydırma bölgesi —
`<main>` öğesi. Pencerenin kendisi asla kaymaz; rota değişiminde içerik
bölgesi en üste döner. `AppLogo` marka işaretidir; `AppLanguageSwitcher` ve
`AppThemeToggle` iki üst çubuk çipidir (ne sürdükleri için Diller ve Stil
dokümanlarına bakın). Tanıtım ana sayfası bu iki çipi kendi ince üst çubuğunda
yeniden kullanır (Tanıtım modülü dokümanına bakın), böylece dil ve tema orada
da değiştirilebilir.

---

## Bileşenlerin arkasındaki composable'lar ve yardımcılar

| Öğe | Dosya | İş |
| --- | --- | --- |
| `useMenu` | `composables/useMenu.ts` | Tek menü kaynağı — grupları (ve docs çocuklarını) rota sabitlerinden kurar |
| `useNotify` | `composables/useNotify.ts` | Yalnız-anahtar toast API'si |
| `useMediaQuery` | `composables/useMediaQuery.ts` | `matchMedia` hook'u — geneldir, ama her çağrı yeri `config/breakpoints.ts`'ten bir `MEDIA.*` sabiti geçirir (asla satır-içi sorgu literal'i değil) |
| `normalizeTurkish` / `compareTurkish` / `turkishIncludes` / `sortRowsByTurkishValue` | `lib/text.ts` | Türkçe bilen normalizasyon / collator sıralama / içerme / satır sıralama |
| `turkishStartsWith` … `turkishNotEquals` / `arrayContainsAny` | `lib/filters.ts` | Türkçe-override edilen standart metin modları + tag herhangi-biri yüklemleri |
| `formatDate` | `lib/date.ts` | Tek tarih biçimleyici (Day.js, etkin locale) |
| `pickLocalized` | `lib/pickLocalized.ts` | Türkçe geri-düşüşlü iki dilli alan seçici |
| `getRouteHandle` | `lib/route.ts` | Router eşleşmeleri üzerinde tipli koruma |
