# Kodlama Standartları

Bu doküman, kod yazarken uyduğumuz kuralları ve nedenlerini anlatır. Gerekçe
herkes içindir — bu kurallar kodu tutarlı, okunur ve güvenle değiştirilebilir
tutar; kod parçaları geliştiricilere makinelerin tam olarak neyi zorladığını
gösterir.

---

## Açıklamayı isimler yapar

Her şey açıklayıcı, tam kelimelerden oluşan bir isim alır. Uzun isim sorun
değildir; anlamsız kısaltma sorundur (`submitNewPatientButton`, asla
`sbmtBtn`).

| Yapı | Kural | Örnek |
| --- | --- | --- |
| Klasörler | kebab-case | `modules/patients/` |
| Bileşenler | PascalCase.tsx | `AppDataTable.tsx` |
| Composable'lar | useCamelCase.ts | `useMenu.ts` |
| API modülleri | camelCase.api.ts | `patients.api.ts` *(planlı, 1.1)* |
| Storage | camelCase.storage.ts | `patients.storage.ts` *(planlı, 1.1)* |
| Modeller | camelCase.model.ts | `patient.model.ts` *(planlı, 1.1)* |
| Mapper'lar | camelCase.mapper.ts | `patient.mapper.ts` *(planlı, 1.1)* |
| Saf yardımcılar | camelCase.ts | `pickLocalized.ts` |
| Sabitler | kebab-case.constants.ts | `docs-registry.ts`, `query-keys.ts` |
| Rotalar | routes.tsx | `routes.tsx` |

Varsayılan `const`, yalnız yeniden atamada `let`, `var` yok.

---

## Açıklayıcı yorum yok

Kod, açıklayıcı yorum ya da JSDoc içeremez. Bir kod anlaşılmak için yoruma
ihtiyaç duyuyorsa, ihtiyaç kalmayana dek yeniden adlandırır ya da yeniden
yapılandırırız; açıklamanın yeri bu dokümantasyon sayfalarıdır. Bunu bu repo
için yazılmış özel bir lint kuralı uygular — `local/no-explanatory-comments`
(`tools/eslint/no-explanatory-comments.js`, kendi `RuleTester` birim
testiyle). İzin verdiği tek yorumlar makine direktifleridir:

```
eslint-disable* / eslint-enable     @ts-*          prettier-ignore
global / globals                    /// <reference> @vite-ignore
shebang satırları                   boş yorumlar
```

Nadir kaçınılmaz istisna, açık bir
`eslint-disable-next-line local/no-explanatory-comments` ile yazılır — böylece
review'da her zaman görünür, asla alışkanlık olmaz.

---

## Her parça yerli yerinde

Dosyalar satır sayısına göre değil sorumluluğa göre bölünür: ağ `api/`'de,
şekiller `models/`'te, saf dönüşümler `lib/`'te, orkestrasyon
`composables/`'ta, çizim `components/`'te, ekranlar `pages/`'te. Bölme
tetikleyicisi, bir birimin birden fazla iş yapmasıdır. Bu repodan işlenmiş bir
örnek: tema anahtarı iki dosyadır — `plugins/theme.lib.ts` saf mantığı tutar
(birim-testlenebilir, tarayıcı API'si yok), `plugins/theme.ts` onu gerçek
DOM'a bağlar:

```ts
// theme.lib.ts — saf, node:test ile testli
export function applyThemeMode(mode: ThemeMode, target: ThemeTarget): void {
  target.linkElement?.setAttribute('href', target.hrefForMode(mode))
  target.root.classList.toggle('dark', mode === 'dark')
  target.storage.setItem(THEME_STORAGE_KEY, mode)
}

// theme.ts — ince DOM bağlama
export function setThemeMode(mode: ThemeMode): void {
  applyThemeMode(mode, getThemeTarget())
}
```

Birden fazla modülde yeniden kullanılan her şey global bir katmanda yaşar
(`src/components`, `src/composables`, `src/lib`) — asla çoğaltılmaz.

---

## Kodun içinde metin yaşamaz

Kullanıcının gördüğü her kelime locale dosyalarından gelir. Bu, kimsenin
hatırlamasına bağlı kalmasın diye katmanlı uygulanır:

1. `eslint-plugin-i18next`, JSX içindeki literal string'leri işaretler
   (`placeholder`, `aria-label`, `title`, … dahil).
2. Lint'in kör noktaları **tiplerle** kapatılır: `useNotify` ve Yup mesajları
   yalnız `TranslationKey` kabul eder — `en.json`'daki her nokta-yolunun
   union'ı:

```ts
// types/i18n.types.ts — anahtar union'ı EN locale dosyasından türetilir
export type TranslationKey = DotPaths<typeof en>

// plugins/yup.ts — doğrulama mesajları bile tipli anahtardır
setLocale({
  string: {
    min: ({ min }) => message('validation.stringMin', { min }),
  },
})
```

Yanlış ya da gömülü bir anahtar derleme hatasıdır — `t()`'nin kendisinde de.
Bir `node:test`, `tr.json` ile `en.json`'un her zaman aynı anahtar kümesini
taşıdığını doğrular.

---

## Sıkı tipler — ve asla `any` yok

TypeScript strict modda çalışır ve `@typescript-eslint/no-explicit-any` her TS
dosyası için `error` olarak sabitlenmiştir. `any` yazmak otomatik
kontrollerden geçemez. Bir değerin tipi gerçekten bilinmiyorsa kod bunu
dürüstçe söyler ve kullanmadan önce ne olduğunu kanıtlar. Gerçek bir örnek —
`useNotify.lib.ts`, bilinmeyen fırlatılan değeri cast etmek yerine daraltır:

```ts
function isKeyedError(error: unknown): error is KeyedError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'messageKey' in error &&
    typeof (error as Record<string, unknown>).messageKey === 'string'
  )
}
```

Denetçiyi susturmak (`@ts-ignore`, `@ts-expect-error`, `any`'ye yeniden cast)
seçenek değildir.

---

## Kuralları makineler uygular

| Araç | Sahiplendiği |
| --- | --- |
| typescript-eslint | TS/React doğruluğu; no-`any` politikası |
| eslint-plugin-i18next | JSX'te literal kullanıcı metni yok |
| eslint-plugin-jsx-a11y | erişilebilirlik zemini |
| eslint-plugin-simple-import-sort | import/export sırası (otomatik düzeltilir) |
| eslint-plugin-import-x | import hijyeni (tekrar yok, konum) |
| eslint-plugin-react-hooks | rules-of-hooks + exhaustive-deps error olarak |
| eslint-plugin-react / react-refresh | seçilmiş JSX doğruluğu + HMR ipuçları |
| local/no-explanatory-comments | yukarıdaki yorum-yok kuralı |
| Prettier | tüm biçimleme (ESLint biçim kuralları kapalı) |
| Stylelint | SCSS kalitesi, özellik sırası |
| commitlint | Conventional Commit mesajları |
| Husky + lint-staged | yukarıdakileri commit anında staged dosyalarda çalıştırır |

Tek komut zincirin tamamını çalıştırır, yerelde ve CI'da:

```
npm run validate   =  type-check + lint + lint:style + format:check
```

CI kapısı her pull request'te bunlara testleri, production build'ini ve
bağımlılık güvenlik taramasını ekler — herhangi biri kırmızıyken hiçbir şey
merge edilmez.
