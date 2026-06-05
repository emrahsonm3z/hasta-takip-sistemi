# Veri ve Saklama

Bu doküman, hasta verisinin nereden geldiğini, nerede tutulduğunu ve bir kayıt
eklendiğinde, düzenlendiğinde ya da silindiğinde ne olduğunu anlatır. Büyük
resim geliştirici geçmişi istemez; altındaki sözleşmeler kesindir.

**Durum:** hasta veri katmanı (model, mapper, storage servisi, query key'ler,
composable'lar) **Sprint 1.1'de gönderildi** — aşağıdaki her şey depodaki
gerçek koddur. Yalnız onu tüketecek ekranlar hâlâ planlıdır (liste 1.2,
form 1.3).

---

## Model

`localStorage` (tarayıcınızın içindeki küçük bir anahtar-değer deposu) tek
kalıcı doğruluk kaynağıdır; **TanStack React Query** onun üzerindeki bellek
içi önbellektir. Sunucu salt-okunurdur ve ilk listeyi tohumlamak için **bir
kez** çağrılır.

```
uzak API (GET, bir kez)
      │  ham satırlar (Türkçe görünen değerler, note_tr/_en çiftleri)
      ▼
   mapper (saf)
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

## Hasta veri katmanı (gönderildi, Sprint 1.1)

**Storage servisi**: saf çekirdek `createPatientStorage`
(`lib/patient-storage.lib.ts`, bellek-içi bir arka uca karşı birim-testli)
tek satırla gerçek tarayıcı deposuna bağlanır (`api/patients.storage.ts`):

```ts
export const patientStorage = createPatientStorage(window.localStorage)
```

`'patients'` anahtarındaki JSON değeri üzerinde
`patientStorage.{read, write, add, update, remove, clear}`. `read`; eksik,
bozuk ya da dizi-olmayan JSON'da çökmek yerine `[]` döner; `write`'taki bir
kota hatası, mutation'ın hata toast'ı olarak görünür.

**Seed akışı** (`composables/usePatients.ts`) — gönderildiği gibi:

```ts
async function readOrSeedPatients(): Promise<PatientRecord[]> {
  const stored = patientStorage.read()
  if (stored.length > 0) {
    return stored
  }
  const rawRows = await fetchRawPatients()
  const patients = mapRawPatients(rawRows)
  patientStorage.write(patients)
  return patients
}
```

İlk ziyaret: `VITE_API_URL`'e tek GET, eşlenir, kalıcılaştırılır. Sonrası:
yalnız depo. React StrictMode'un çift çağırması altında idempotenttir
(ikinci tohumlama birebir aynı veriyi yazar).

**Yazmalar** (`composables/usePatientMutations.ts`): `addPatient`,
`updatePatient`, `removePatient` — her biri storage servisini çağırır, sonra
`queryClient.invalidateQueries({ queryKey: patientKeys.all() })` — yalnız
invalidation, elle önbellek yaması yok. Başarı da hata da `useNotify`
toast'larıyla konuşur (tipli anahtarlar).

**Mapper sınırı:** API, Türkçe görünen değerler ve snake_case yerelleştirilmiş
çiftler döner; saf mapper (`lib/patient.mapper.ts`) tipli camelCase
`PatientRecord` üretir — bilinmeyen enum değerinde fırlatır — ve **yalnız
seed yolunda** çalışır. Depo, zaten eşlenmiş modeli olduğu gibi gidip getirir.
Depo migration'ı yoktur — model değişirse temizle ve yeniden tohumla (sahte
veri için kabul edilebilir). Tam ayrıntı: Hasta Modülü dokümanı.

---

## Bir şeyler ters giderse

| Hata | Davranış |
| --- | --- |
| Seed GET başarısız | Yeniden-dene düğmeli sayfa-içi `ErrorState` (önce global `retry: 1` varsayılanı çalışır) |
| Saklanan JSON bozuk | Boş sayılır — uygulama çökmek yerine yeniden tohumlar |
| Depo kotası aşıldı | Mutation başarısız olur → `useNotify` ile `errors.saveFailed` toast'u |
| Bir doküman dosyası yüklenemedi | Doküman görüntüleyicide aynı `ErrorState` deseni (bugün canlı) |
