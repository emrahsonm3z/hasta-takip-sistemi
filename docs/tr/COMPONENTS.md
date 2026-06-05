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
ekranın yoksa yeniden kuracağı şeyleri hazır getirir: Türkçe bilen genel arama
(kayıtlı `nfcContains` filtresi), sütun filtreleri, bir toolbar yuvası,
filtreleri temizleme düğmesi, iki yükleme modu (ilk → `Loading`; arka plan
yenileme → tablonun overlay'i) ve küçük ekranlarda `useMediaQuery` ile şablon
değiştiren duyarlı bir paginator.

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
  filterDisplay?: 'row' | 'menu'
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
}
```

İşi olmayanlar: veri çekme ve sayfa-düzeyi hatalar — onlar composable'lara ve
aşağıdaki hata yüzeylerine aittir. Saf çekirdeği `buildInitialFilters`
(`AppDataTable.lib.ts`) birim-testlidir.

---

## Form alanları

Formik'e bağlı altı alan tek bir kabuğu (`FormField`) paylaşır: i18n etiketini
çizer, `htmlFor`/`id` bağlar (etiketsiz girdi yok) ve Yup hatalarını çözer:

| Alan | Sardığı |
| --- | --- |
| `FormInputText` | InputText |
| `FormInputNumber` | InputNumber |
| `FormDropdown` | Dropdown |
| `FormCalendar` | Calendar |
| `FormCheckbox` | Checkbox |
| `FormChips` | Chips |

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
dokümanlarına bakın).

---

## Bileşenlerin arkasındaki composable'lar ve yardımcılar

| Öğe | Dosya | İş |
| --- | --- | --- |
| `useMenu` | `composables/useMenu.ts` | Tek menü kaynağı — grupları (ve docs çocuklarını) rota sabitlerinden kurar |
| `useNotify` | `composables/useNotify.ts` | Yalnız-anahtar toast API'si |
| `useMediaQuery` | `composables/useMediaQuery.ts` | `matchMedia` hook'u (paginator, sidebar eşikleri) |
| `normalizeTurkish` / `compareTurkish` / `turkishIncludes` | `lib/text.ts` | Türkçe bilen normalizasyon / collator sıralama / içerme |
| `formatDate` | `lib/date.ts` | Tek tarih biçimleyici (Day.js, etkin locale) |
| `pickLocalized` | `lib/pickLocalized.ts` | Türkçe geri-düşüşlü iki dilli alan seçici |
| `getRouteHandle` | `lib/route.ts` | Router eşleşmeleri üzerinde tipli koruma |
