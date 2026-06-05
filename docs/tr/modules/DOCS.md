# Doküman Modülü

Bu doküman, doküman görüntüleyicinin kendisini anlatır — şu anda
kullandığınız özelliği. Tamamen gönderilmiştir; aşağıdaki her şey depodaki
gerçek koddur.

---

## Ne yapar

Kenar menüsündeki Dokümanlar girdisi tam doküman listesine açılır (modül
dokümanları "Modüller" etiketi altında gruplu) ve `/docs`'a gider — her
dokümanın kart-grid indeksi. Her kart `/docs/:slug`'ı, stilli bir okuma
sayfasını açar. Uygulama dilini değiştirmek (TR/EN) dokümanı anında
çevirisiyle değiştirir; temayı değiştirmek her şeyi okunur tutar — kod
blokları tasarım gereği iki modda da koyu kalır.

---

## Dosyalar

```
src/modules/docs/
├── components/
│   └── MarkdownRenderer.tsx   react-markdown + remark-gfm + rehype-highlight
├── composables/
│   └── useDocContent.ts       lazy dosya yükleyici üzerinde useQuery
├── constants/
│   ├── docs-registry.ts       DocEntry[] — tek doğruluk kaynağı
│   └── query-keys.ts          docsKeys factory'si
├── lib/
│   ├── doc-path.ts            resolveDocPath + findDocEntry (saf, birim-testli)
│   └── docs-loader.ts         import.meta.glob yükleyicisi
├── pages/
│   ├── DocsOverviewPage.tsx   /docs — kart-grid indeksi
│   └── DocViewerPage.tsx      /docs/:slug — okuma sayfası
├── routes.tsx                 DOCS_ROUTES (OVERVIEW + VIEWER) + dinamik başlık
└── index.ts                   barrel
```

---

## Registry — her şeyi tek liste yönetir

Her doküman `docsRegistry`'de bir girdidir. Sidebar çocukları, genel bakış
kartları, rota başlıkları ve dosya yükleme — hepsi ondan türetilir; kayıtsız
bir doküman uygulama için yoktur.

```ts
export interface DocEntry {
  slug: string
  titleKey: TranslationKey
  descriptionKey: TranslationKey
  icon: string
  order: number
  paths: { en: string; tr: string }
}
```

Sıradan bir girdi ve kök-seviye tek istisna:

```ts
{
  slug: 'architecture',
  titleKey: 'docs.doc.architecture.title',
  descriptionKey: 'docs.doc.architecture.description',
  icon: 'pi pi-sitemap',
  order: 1,
  paths: { en: '/docs/en/ARCHITECTURE.md', tr: '/docs/tr/ARCHITECTURE.md' },
},
{
  slug: 'changelog',
  titleKey: 'docs.doc.changelog.title',
  descriptionKey: 'docs.doc.changelog.description',
  icon: 'pi pi-history',
  order: 11,
  paths: { en: '/CHANGELOG.md', tr: '/CHANGELOG.md' },   // kök dosya, yalnız EN
},
```

`CHANGELOG.md` iki dili de aynı kök dosyaya yönlendirir, çünkü sürüm aracı
onu orada, yalnız İngilizce üretir. Sprint planı, diğer her doküman gibi
`docs/{en,tr}/SPRINT_PLAN.md`'de yaşar. Otomatik bir test
(`src/__test__/modules/docs/docs-registry.test.ts`), kayıtlı herhangi bir
dosya iki dilden birinde eksikse ya da iki girdi aynı slug'ı paylaşıyorsa
kırmızıya düşer.

---

## Bir doküman nasıl yüklenir

Dosyalar uygulamanın ilk indirmesine **paketlenmez**. Yükleyici, eşleşen her
dosya için lazy import fonksiyonları toplar; her biri talep üzerine çözülür:

```ts
const docFiles = import.meta.glob<string>(['/docs/**/*.md', '/CHANGELOG.md'], {
  query: '?raw',
  import: 'default',
})

export const loadDocContent = (entry: DocEntry, language: string): Promise<string> => {
  const path = resolveDocPath(entry, language)
  const load = docFiles[path]
  if (!load) {
    return Promise.reject(new Error(path))
  }
  return load()
}
```

Dil seçimi tek saf fonksiyondur (`tr`/`tr-TR` için Türkçe, aksi hâlde
İngilizce) ve getirme, standart React Query makinesiyle doküman **ve dil**
başına önbelleklenir:

```ts
export function useDocContent(entry: DocEntry) {
  const { i18n } = useTranslation()

  return useQuery({
    queryKey: docsKeys.content(entry.slug, i18n.language),
    queryFn: () => loadDocContent(entry, i18n.language),
  })
}
```

Böylece bir dil değişimi diğer dosyayla yeniden çizer (bir kez getirilir,
sonra sonsuza dek önbellekte — `staleTime: Infinity`) ve başarısız bir
yükleme, yeniden-dene düğmeli standart sayfa-içi `ErrorState`'i gösterir.

---

## Çizim

`DocViewerPage`, `:slug`'ı `findDocEntry` ile çözer (bilinmeyen slug →
`NotFound` sayfası), dosya çözülürken `Loading` gösterir, sonra markdown'ı
çiziciye verir:

```tsx
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <article className="prose w-full max-w-[57.5rem]">
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </Markdown>
    </article>
  )
}
```

- `remark-gfm` — tablolar, üstü çizili, görev listeleri.
- `rehype-highlight` + highlight.js `github-dark` stylesheet'i — **iki temada
  da** koyu zemin üzerinde sözdizimi renklendirme (token kuralının tek onaylı
  istisnası; bkz. "Stil ve Tema").
- Okuma tasarımı (çizgili başlıklar, hücre dolgusu eşit tam-ızgaralı
  tablolar, callout blockquote'lar, satır-içi kod çipleri, 0.9375rem/1.7
  gövde) `tailwind.config.ts`'in `typography` tema bloğunda yaşar; her renk
  tema token'larına eşlidir — koyu mod ek kural istemez.
- İçerik, içerik yüzeyinin üzerine doğrudan, sola hizalı oturur; 57.5rem ile
  sınırlıdır; tarayıcı sekme başlığı, slug'ı registry'de arayan rota
  handle'ının dinamik `title(match)`'inden gelir.

---

## Sidebar disclosure'ı

`useMenu`, Dokümanlar maddesine registry'yi `children` olarak verir;
`module-` ile başlayan slug'lar `menu.section.modules` alt-bölüm etiketini
alır:

```ts
children: docsRegistry.map((entry) => ({
  key: entry.slug,
  titleKey: entry.titleKey,
  path: DOCS_ROUTES.VIEWER.build(entry.slug),
  icon: entry.icon,
  menuOrder: entry.order,
  ...(entry.slug.startsWith('module-')
    ? { subsectionKey: 'menu.section.modules' as const }
    : {}),
})),
```

`AppSidebar` bunu bir disclosure olarak çizer: satır `/docs`'a gider, chevron
düğmesi açar/kapar (`aria-expanded`/`aria-controls` ile), alt-menü rota
`/docs` altındayken otomatik açılır ve ilk modül dokümanından önce küçük,
büyük harfli bir "Modüller" etiketi görünür. Aynı içerik mobil çekmecenin
içinde de çizilir.

---

## Yeni doküman eklemek — kontrol listesi

1. Dosyayı HEM `docs/en/` HEM `docs/tr/` içinde oluşturun.
2. `docsRegistry`'ye bir `DocEntry` ekleyin (slug, iki locale anahtarı,
   simge, sıra, yollar).
3. `docs.doc.<slug>.title` / `.description` anahtarlarını İKİ locale
   dosyasına da ekleyin.
4. Bitti — sidebar, genel bakış grid'i, rota ve başlık hepsini registry'den
   alır; bütünlük testi dosyaların var olduğunu doğrular.
