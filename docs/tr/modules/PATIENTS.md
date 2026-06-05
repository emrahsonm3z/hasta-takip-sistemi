# Hasta Modülü

Bu doküman, hasta takibi özelliğini anlatır. Dürüst durum: **veri katmanı
gönderildi** (Sprint 1.1) — modül hasta kayıtlarını baştan sona yükler,
saklar ve değiştirir. Ekranlar henüz yolda: liste 1.2, ekleme / düzenleme /
silme 1.3; en altta planlı olarak işaretlidir.

---

## Dosyalar

```
src/modules/patients/
├── api/
│   ├── patients.api.ts        fetchRawPatients() — tek salt-okunur GET
│   └── patients.storage.ts    window.localStorage'a bağlı patientStorage
├── composables/
│   ├── usePatients.ts         useQuery: depoyu oku, boşsa bir kez tohumla
│   └── usePatientMutations.ts ekle / güncelle / sil + invalidate + toast'lar
├── constants/
│   └── query-keys.ts          patientKeys factory'si
├── lib/
│   ├── patient.mapper.ts      ham satır → tipli PatientRecord (saf, birim-testli)
│   └── patient-storage.lib.ts createPatientStorage çekirdeği (saf, birim-testli)
├── models/
│   └── patient.model.ts       PatientRecord + dört enum-benzeri union
├── pages/PatientsPage.tsx     Yer-tutucu sayfa (1.2 listesi yerini alacak)
├── routes.tsx                 PATIENT_ROUTES sabitleri + rota dizisi
└── index.ts                   barrel
```

`/`, `/patients`'a yönlendirir — bu modül uygulamanın açılış sayfasıdır.

---

## Model

Düz camelCase, iç içe yok, enum alanlarında serbest string yok — canlı API'ye
karşı tiplendi (50 satır doğrulandı):

```ts
export interface PatientRecord {
  id: string
  fullName: string
  birthDate: string
  appointmentDate: string
  createdAt: string
  department: PatientDepartment
  status: PatientStatus
  priority: PatientPriority
  bloodType: PatientBloodType
  score: number
  noteTr: string
  noteEn: string
  diagnosisTr: string
  diagnosisEn: string
  isInsured: boolean
  isFollowUp: boolean
  isVaccinated: boolean
  tags: string[]
  notes: string | null
}
```

Union'lar kanonik kodları taşır (`'waiting' | 'inExamination' | 'completed'
| 'cancelled'`, …) — locale dosyalarının etiket anahtarı olarak kullandığı
kodların aynısı; bir etiketi çizmek her zaman
``t(`patients.status.${status}`)``'tir.

---

## Mapper — görünen değer girer, kod çıkar

API, Türkçe görünen değerler (`status: "Bekliyor"`, `priority: "acil"`,
`department: "Nöroloji"`) ve snake_case yerelleştirilmiş çiftler (`note_tr`,
`diagnosis_en`) gönderir. Saf mapper ikisini de normalleştirir ve bir kaydı
sessizce yanlış etiketlemek yerine **bilinmeyen her değerde fırlatır**:

```ts
const STATUS_BY_RAW_VALUE: Record<string, PatientStatus> = {
  Bekliyor: 'waiting',
  Muayenede: 'inExamination',
  Tamamlandı: 'completed',
  İptal: 'cancelled',
}

function coerce<T>(lookup: Record<string, T>, rawValue: string, field: string): T {
  const coerced = lookup[rawValue]
  if (coerced === undefined) {
    throw new Error(`Unknown ${field} value: ${rawValue}`)
  }
  return coerced
}
```

**Yalnız seed yolunda** çalışır — depo, zaten eşlenmiş modeli olduğu gibi
gidip getirir.

---

## Saklama

Saf çekirdek (`createPatientStorage`, bellek-içi bir arka uca karşı
birim-testli) tek satırla gerçek `window.localStorage`'a bağlanır. Tüm
kalıcılık ondan geçer; anahtar `'patients'`tır.

| İşlem | Davranış |
| --- | --- |
| `read()` | eksik, bozuk ya da dizi-olmayan JSON'da `[]` — asla fırlatmaz |
| `write(patients)` | tam listeyi serileştirir (kota hatası mutation'ın hata toast'ı olarak görünür) |
| `add(patient)` | sona ekler |
| `update(patient)` | `id` ile değiştirir |
| `remove(id)` | `id` ile süzer |
| `clear()` | anahtarı kaldırır (sıfırlama = clear + invalidate) |

---

## Okuma + seed

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

export function usePatients() {
  return useQuery({ queryKey: patientKeys.list(), queryFn: readOrSeedPatients })
}
```

İlk ziyaret: `VITE_API_URL`'e tek GET, eşlenir, kalıcılaştırılır. Sonraki her
ziyaret: yalnız depo. React StrictMode'un çift çağırması zararsızdır — ikinci
tohumlama birebir aynı veriyi yazar. Başarısız bir GET, yeniden-dene düğmeli
standart `ErrorState`'i çizer — `throwOnError: false` ve `retry: 1` davranışı
global QueryClient varsayılanlarından gelir (`plugins/react-query.ts`);
hook'un kendisi yalnız anahtarı ve query fonksiyonunu kurar.

---

## Mutation'lar

`usePatientMutations`; `addPatient`, `updatePatient`, `removePatient` sunar.
Her biri storage servisini çağırır, sonra `patientKeys.all()`'u invalidate
eder — yalnız invalidation, elle önbellek yaması yok — ve `useNotify` ile
konuşur (tipli anahtarlar: başarıda `patients.notifications.added` /
`.updated` / `.removed`, hatada `errors.saveFailed`).

```ts
const settle = async (successKey: TranslationKey) => {
  await queryClient.invalidateQueries({ queryKey: patientKeys.all() })
  notify.success(successKey)
}
```

---

## Testler

`src/__test__/modules/patients/` — 16 spec: mapper (camelCase düzleştirme,
her status/department dönüşümü, tag kopyalama, dört enum'da
bilinmeyende-fırlatma), bozuk-JSON toleransı dahil storage CRUD gidiş-dönüşü
ve `patientKeys` factory'si (list kök anahtarı genişletir; invalidation her
zaman eşleşir).

---

## Planlı — Sprint 1.2 / 1.3: ekranlar

- **1.2 — liste:** `usePatients()` üzerinde `AppDataTable`; Türkçe bilen
  genel arama, bir sütun sıralama, bir sütun filtre, çevrilmiş enum
  etiketleri, tarihler `formatDate` üzerinden.
- **1.3 — ekle / düzenle / sil:** ortak `Form*` alanlarından kurulan bir
  PrimeReact Dialog formu, tipli iki dilli mesajlarla Yup doğrulaması,
  not/tanının iki dil varyantı yan yana, onaylı silme — hepsi
  `usePatientMutations`'a bağlı.
