# Hasta Modülü

Bu doküman, hasta takibi özelliğini anlatır. Dürüst durum en başta: **bugün
gönderilen, modülün iskeletidir** — rota, kenar menüsü girdisi ve bir
yer-tutucu sayfa. Veri katmanı Sprint 1.1; liste ekranı 1.2; ekleme /
düzenleme / silme 1.3. Aşağıdaki her şey açıkça "şimdi var" ve "planlı"
olarak ayrılmıştır.

---

## Bugün var olan

Modül uygulamaya standart yolla bağlıdır (bkz. "Mimari"), üç dosyayla:

```
src/modules/patients/
├── pages/PatientsPage.tsx    Yer-tutucu sayfa (başlığı çizer)
├── routes.tsx                PATIENT_ROUTES sabitleri + rota dizisi
└── index.ts                  Barrel: export { PATIENT_ROUTES, patientRoutes }
```

Rota sabitleri — router'ın VE kenar menüsünün okuduğu tek kaynak (menünün
rotalarla asla çelişememesinin nedeni budur):

```tsx
export const PATIENT_ROUTES = {
  LIST: {
    name: 'patients',
    path: '/patients',
    titleKey: 'patients.title',
    icon: 'pi pi-users',
    menuOrder: 1,
  },
} as const
```

`/` buraya yönlendirir — Hastalar, uygulamanın açılış sayfasıdır. Locale
dosyaları, özelliğin kullanacağı iki dilli sözlüğü şimdiden taşır:
`patients.fields.*` (15 alan etiketi), `patients.status.*`,
`patients.priority.*`, `patients.department.*` ve `patients.bloodType.*` —
kod↔etiket tabloları için "Diller (TR / EN)"e bakın.

---

## Planlı — Sprint 1.1: veri katmanı

Üzerinde anlaşılan sözleşme (henüz kod yok; ayrıntı "Veri ve Saklama"da ve
sprint planında):

| Parça | Dosya (planlı) | İş |
| --- | --- | --- |
| Model | `models/patient.model.ts` | Düz camelCase `PatientRecord` + enum-benzeri union'lar |
| Mapper | `lib/patient.mapper.ts` | Ham snake_case API satırları → tipli model (yalnız seed) |
| API | `api/patients.api.ts` | Tek salt-okunur GET (`VITE_API_URL`) |
| Storage | `api/patients.storage.ts` | `localStorage` üzerinde `patientStorage.{read,write,add,update,remove,clear}` |
| Query key'ler | `constants/query-keys.ts` | `patientKeys` factory'si |
| Okuma + seed | `composables/usePatients.ts` | `useQuery`: depoyu oku; boşsa GET → eşle → yaz |
| Mutation'lar | `composables/usePatientMutations.ts` | ekle/güncelle/sil → `patientKeys.all()` invalidate |

Kaydın alanları (case-study veri modelinden — `id`, `fullName`, `birthDate`,
`appointmentDate`, `createdAt`, `department`, `status`, `priority`,
`bloodType`, `score`, iki dilli `note`/`diagnosis` çiftleri, `isInsured`,
`isFollowUp`, `isVaccinated`, `tags`) 1.1 indiğinde canlı API'ye karşı
tiplenecek.

---

## Planlı — Sprint 1.2 / 1.3: ekranlar

- **1.2 — liste:** Türkçe bilen genel aramalı `AppDataTable`, bir sütun
  sıralama, bir sütun filtre, durum/öncelik çevrilmiş etiketlerle, tarihler
  `formatDate` üzerinden.
- **1.3 — ekle / düzenle / sil:** ortak `Form*` alanlarından kurulan bir
  PrimeReact Dialog formu, tipli iki dilli mesajlarla Yup doğrulaması,
  not/tanının iki dil varyantı yan yana, onaylı silme, `useNotify` ile
  toast'lar.

Bu sayfa, o sprint'ler indikçe gerçek kodla yeniden yazılacak (sprint planı
bunu 2.1 görevi olarak izler).
