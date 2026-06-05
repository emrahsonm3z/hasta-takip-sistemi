# Veri ve Saklama

Bu doküman, hasta verisinin nereden geldiğini, nerede tutulduğunu ve bir kayıt
eklendiğinde, düzenlendiğinde ya da silindiğinde ne olduğunu anlatır. Büyük
resim geliştirici geçmişi istemez; altındaki sözleşmeler kesindir.

**Dürüst durum notu:** ikinci yarıda anlatılan hasta veri katmanı (model,
mapper, storage servisi, query key'ler, composable'lar) **Sprint 1.1 için
tasarlanmış sözleşmedir** ve henüz depoda değildir. Bugün gönderilen şey,
mimarinin kendisi ve onun çalışan bir örneğidir — dokümantasyon modülünün
kendi veri akışı. Her şey buna göre etiketlenmiştir.

---

## Model

`localStorage` (tarayıcınızın içindeki küçük bir anahtar-değer deposu) tek
kalıcı doğruluk kaynağıdır; **TanStack React Query** onun üzerindeki bellek
içi önbellektir. Sunucu salt-okunurdur ve ilk listeyi tohumlamak için **bir
kez** çağrılır.

```
uzak API (GET, bir kez)
      │  ham snake_case satırlar
      ▼
   mapper (saf)                       ← planlı, 1.1
      │  tipli camelCase PatientRecord[]
      ▼
localStorage  ──────────────►  React Query önbelleği  ──────►  ekranlar
 (kalıcı doğruluk)    okuma        (bellek içi)          çizim
      ▲                                  │
      └──── ekle / düzenle / sil ◄───────┘
            sonra invalidate (yeniden oku)
```

Bu, bu case study için bilinçli bir tercihtir: veri sahte (mock) veridir.
Gerçek hasta verisi asla bir tarayıcının yerel deposunda yaşamazdı.

---

## Bugün var olan ve çalışan

**QueryClient varsayılanları** — `src/plugins/react-query.ts`, gönderildiği
gibi:

```ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnWindowFocus: false,
      retry: 1,
      throwOnError: false,
    },
  },
})
```

Veri kendi kendine asla bayatlamaz (`staleTime: Infinity`) — önbellek yalnız
açık bir invalidation "kopyan eskidi" dediğinde güncellenir. Query hataları
error boundary'lere çarpmaz (`throwOnError: false`); ekranlar bunun yerine
yeniden-dene düğmeli sayfa-içi `ErrorState` çizer.

**Desenin canlı bir örneği** — docs modülü her dokümanı tam bu makineyle
yükler (`modules/docs/composables/useDocContent.ts`):

```ts
export function useDocContent(entry: DocEntry) {
  const { i18n } = useTranslation()

  return useQuery({
    queryKey: docsKeys.content(entry.slug, i18n.language),
    queryFn: () => loadDocContent(entry, i18n.language),
  })
}
```

ve query-key factory'si (`modules/docs/constants/query-keys.ts`):

```ts
export const docsKeys = {
  all: () => ['docs'] as const,
  content: (slug: string, language: string) =>
    ['docs', 'content', slug, language] as const,
}
```

Factory'nin zorladığı kural: query key'ler çağrı noktalarında **asla** elle
yazılmış string dizileri değildir — her anahtar bir modülün factory'sinden
gelir; invalidation hiçbir yazımı kaçıramaz.

---

## Hasta veri katmanı — planlı (Sprint 1.1)

Aşağıdaki sözleşmeler üzerinde anlaşılan tasarımdır (sprint planına bakın);
dosyalar ve kod 1.1'de iner.

**Storage servisi** (`modules/patients/api/patients.storage.ts`):
`STORAGE_KEY = 'patients'` altındaki JSON değeri üzerinde
`patientStorage.{read, write, add, update, remove, clear}`. `read`, eksik ya
da bozuk JSON'da çökmek yerine `[]` döner; `write`, kota hatasını bir toast
ile bildirir.

**Seed akışı** (`composables/usePatients.ts`) — ilk ziyarette:

1. `useQuery`, `patientStorage.read()`'i okur.
2. Boş mu? GET'i bir kez çek, mapper'ı çalıştır, sonucu depoya yaz.
3. Listeyi dön. Tohumlama idempotenttir (React StrictMode'un çift
   çağırmasına dayanıklı).

**Yazmalar** (`composables/usePatientMutations.ts`): her mutation storage
servisini çağırır, sonra
`queryClient.invalidateQueries(patientKeys.all())` — yalnız invalidation,
elle önbellek yaması yok. Başarı da hata da `useNotify` toast'larıyla konuşur.

**Mapper sınırı:** API ham snake_case satırlar döner; saf mapper
(`lib/patient.mapper.ts`) tipli camelCase `PatientRecord` üretir ve **yalnız
seed yolunda** çalışır. Depo, zaten eşlenmiş modeli olduğu gibi gidip getirir.
Depo migration'ı yoktur — model değişirse temizle ve yeniden tohumla (sahte
veri için kabul edilebilir).

---

## Bir şeyler ters giderse

| Hata | Davranış |
| --- | --- |
| Seed GET başarısız | Yeniden-dene düğmeli sayfa-içi `ErrorState` (önce query `retry: 1`) |
| Saklanan JSON bozuk | Boş sayılır — uygulama çökmek yerine yeniden tohumlar |
| Depo kotası aşıldı | `useNotify` ile hata toast'u *(planlı, 1.1)* |
| Bir doküman dosyası yüklenemedi | Doküman görüntüleyicide aynı `ErrorState` deseni (bugün canlı) |
