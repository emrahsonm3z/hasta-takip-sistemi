# Hasta Modülü

Bu doküman, hasta takibi özelliğini anlatır. Dürüst durum: **veri katmanı
(1.1) ve liste ekranı (1.2) gönderildi** — modül hasta kayıtlarını yükler,
saklar, listeler, sıralar, filtreler ve arar. Ekleme / düzenleme / silme (1.3)
hâlâ planlıdır ve en altta öyle işaretlidir.

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
├── components/
│   └── PatientList.tsx        AppDataTable üzerinde 7 kolonlu liste
├── constants/
│   ├── patient-tag.constants.ts  status/priority → Tag severity haritaları
│   └── query-keys.ts          patientKeys factory'si
├── lib/
│   ├── patient-list.lib.ts    buildStatusFilterOptions (saf, birim-testli)
│   ├── patient.mapper.ts      ham satır → tipli PatientRecord (saf, birim-testli)
│   └── patient-storage.lib.ts createPatientStorage çekirdeği (saf, birim-testli)
├── models/
│   └── patient.model.ts       PatientRecord + dört enum-benzeri union
├── pages/PatientsPage.tsx     İnce: usePatients → ErrorState | .card üzerinde PatientList
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

## Liste (gönderildi, Sprint 1.2)

`PatientsPage` ince bir kabuktur: `usePatients()` → okuma hatasında (retry'lı)
`ErrorState`, aksi hâlde `.card` yüzeyinde `PatientList`.

**Kapsam, dürüstçe:** liste, vaka çalışmasının "bir sıralama, bir filtre, bir
arama" asgarisini BİLEREK AŞAR — sahip tam özellik setini seçti. Yapılan:
**15 kolon, her kolon sıralanabilir, her kolonda tipe-uygun menü filtresi,
artı global arama.**

| Kolon | Çizer | Sıralama | Filtre |
| --- | --- | --- | --- |
| fullName | metin | Türkçe collator | metin, standart match modları (Türkçe-duyarlı) |
| department | çevrilmiş etiket | Türkçe collator (görünen etiket) | dropdown |
| status | `Tag` (severity haritası) | tanımlı enum sırası | dropdown |
| priority | `Tag` (severity haritası) | tanımlı enum sırası | dropdown |
| appointmentDate | `formatDate 'L'` | doğal | Takvim + tarih match modları (varsayılan dateIs) |
| birthDate | `formatDate 'L'` | doğal | Takvim + tarih match modları |
| bloodType | çevrilmiş gösterim | Türkçe collator | dropdown |
| score | sayı | doğal | InputNumber + sayısal match modları |
| diagnosis | dile-duyarlı türetilmiş alan | Türkçe collator | metin, standart match modları |
| note | dile-duyarlı türetilmiş alan | Türkçe collator | metin, standart match modları |
| isInsured / isFollowUp / isVaccinated | success/danger ikon (check / times) | doğal | etiketli TriStateCheckbox (evet / hayır / hepsi) |
| tags | `Chip`'ler | — (sıralanmaz) | herhangi-biri multiselect, virgül görünümü (`arrayContainsAny`) |
| createdAt | `formatDate 'L'` | doğal | Takvim + tarih match modları |

Mekanik:

- **Standart menü-filtre davranışı** (resmî custom_filter demosu): her filtre
  menüsü varsayılan **Temizle + Uygula** düğme çubuğunu gösterir ve bir filtre
  YALNIZ Uygula'ya basıldığında uygulanır — değişiklikte hiçbir şey
  filtrelenmez. Varsayılan match-mode dropdown'u tipe göre gösterilir
  (metin / sayı / tarih / enum kolonları); yalnız tipin modu olmadığı yerde
  gizlidir — boolean'lar otomatik gizler (`dataType="boolean"`), tags
  multiselect'i ise demonun representative kolonu gibi
  `showFilterMatchModes={false}` verir.
- **Türkçe-duyarlı standart metin modları.** Altı standart metin match modu
  (şununla başlar / içerir / içermez / şununla biter / eşittir / eşit
  değildir) Türkçe-normalize implementasyonlarla global override edilir
  (`lib/filters.ts`; kayıt `plugins/primereact.ts`) — match-mode dropdown'u
  standart seçenekleri sunar ve HEPSİ Türkçe-duyarsız eşleşir. Global arama
  kutusu da aynı (artık Türkçe) yerleşik `contains`'a biner.
- **Yeniden kullanılabilir filtre öğeleri, tek ortak modül**
  (`components/AppDataTableFilters.tsx` — PrimeReact 10 yalnız InputText
  varsayılan öğesi gönderir, kaynakta doğrulandı): TEK enum Dropdown
  fabrikası (status/priority severity-Tag seçenek şablonu verir), TEK tags
  MultiSelect, artı demo-standardı Calendar / InputNumber / TriStateCheckbox
  öğeleri. Hepsi `filterCallback` ile → Uygula'da uygulanır.
- **Türetilmiş satırlar.** `buildPatientListRows(patients, localize)`,
  `diagnosis`/`note`'u etkin dil için çözer (enjekte `pickLocalized`) VE üç
  tarih alanını gerçek `Date` nesnelerine çevirir — yerleşik tarih match
  modları string değil tarih karşılaştırır. Kurucu saftır ve birim-testlidir;
  satırlar dil değişiminde yeniden çözülür.
- **Locale.** Kayıtlı TR locale, PrimeReact varsayılan locale'inin HER
  anahtarını kapsar (filtre sözlüğü, takvim, yükleme/parola metinleri ve tüm
  `aria.*` etiketleri — eksiksizlik `primereact/api` varsayılan nesnesine
  karşı doğrulandı); EN aynı kümeyi yerleşik varsayılanların üzerine pinler.
  Tüm bileşen sözlüğü etkin dili izler ve dil değişiminde canlı yeniden
  çizilir. Her filtre
  girdisi yerelleştirilmiş bir placeholder gösterir (`filters.*` anahtarları:
  "Ara…", "gg.aa.yyyy", "Sayı girin", "Seçiniz", "Tümü" — ve İngilizce
  karşılıkları). Her filtre overlay'i `_prime-skin.scss` üzerinden TEK
  tutarlı `16rem` genişliğe ve kompakt bölüm ritmine sahiptir (0.75rem bölüm
  dolgusu, match-mode dropdown'unun altında 0.5rem).
  Boolean filtreleri etiketli TriStateCheckbox'tır (kutunun yanında alan
  adı); boolean hücreleri success/danger ikonları çizer (Tag severity
  tonları, `--app-success`/`--app-danger` olarak token'landı). fullName /
  note / tags kolonları iki katına çıkarılmış min-genişlik taşır (16 / 24 /
  16rem); kalanı içeriğe göre sığar.
- **Yerleşim.** Kolonlar içeriğe göre sığar; dar ekranda tablo kendi bölgesi
  içinde yatay kayar — beklenen davranış; gerçek bir mobil yerleşim
  (istifli/öncelikli kolonlar) ayrı, sonraki bir karardır. Satırlar kartın
  üzerinde transparan, ince ızgara çizgileriyle oturur (şerit yok).

---

## Form (gönderildi, Sprint 1.3): ekle / düzenle / sil

TEK yeniden kullanılabilir dialog hem oluşturma hem düzenlemeye hizmet eder —
`PatientDialog`, global `AppDialog` kabuğu içinde `PatientForm`'u barındırır
(800px masaüstü taban genişlik, `min(750px, 70vh)` max-yükseklik, sabit
başlık + altlık ve yalnız içeriğin kaydığı yapı, 75vw/95vw responsive
kırılımları). Moda göre yalnız üç şey değişir: başlık ("Yeni Hasta" / "Hasta
Düzenle"), başlangıç değerleri (`createEmptyFormValues()` /
`toFormValues(record)`) ve gönderim hedefi (ekleme / güncelleme mutation'ı).

- **Form.** YALNIZ ortak `Form*` sarmalayıcılarından kurulur. Bölümler (büyük
  harfli soluk başlık + ince çizgi, i18n `patients.form.sections.*`): hasta
  bilgileri (fullName tam genişlik; birthDate + bloodType), randevu
  (department + status; priority + appointmentDate; score), tanı TR/EN yan
  yana, not TR/EN yan yana, üç boolean onay kutusu HER genişlikte tek satırda
  (kutu + etiket yan yana), etiketler Chips girdisi. Diğer her şey dar
  ekranda tek sütuna iner. Status/priority dropdown'ları severity Tag'lerini
  (seçenekler + seçili değer) ortak `PatientTags` kaynağından çizer. Her
  girdinin yerelleştirilmiş placeholder'ı vardır
  (`patients.form.placeholders.*`).
- **Doğrulama** (`buildPatientFormSchema(mode)`, Yup, tüm mesajlar tipli
  `message()` yardımıyla): fullName zorunlu 2–120; dört enum zorunlu +
  `oneOf` üyeliği; birthDate zorunlu, gelecekte olamaz; randevu zorunlu, HER
  İKİ modda ≥ birthDate ve OLUŞTURMA modunda ek olarak ≥ bugün (gün bazlı;
  Calendar da `minDate` alır) — DÜZENLEME geçmiş randevuları düzenlenebilir
  bırakır; score zorunlu tamsayı 1–5; tanı HER İKİ dilde zorunlu (min 2);
  notlar opsiyonel; etiketler opsiyonel, kırpılır.
- **Sistem alanları.** `id` (`pat-` + UUID) ve `createdAt` oluşturmada
  üretilir; düzenlemede korunur, düzenlenemeyen `notes` alanı gibi. Saf
  `toPatientRecord(values, system)` bunları birleştirir ve birim-testlidir.
- **Satır eylemleri.** Sağda dondurulmuş eylem kolonu (yatay kaydırma altında
  hep görünür; dondurulmuş hücreler `_prime-skin.scss`'te opak kart zemini +
  katmanlı hover tonu alır), aria-etiketli düzenle + sil ikon düğmeleriyle.
  Düzenle, dialog'u önceden doldurulmuş açar; sil, hastayı adıyla anan
  `confirmDialog()` çalıştırır ("{{name}} silinsin mi?"), onay → silme
  mutation'ı. Satıra-tıkla gezinme YOKTUR (1.3'te kararlaştırıldı).
- **Veri.** Her şey `usePatientMutations` üzerinden akar (depolama →
  invalidate → toast'lar); veri katmanına dokunulmadı.
