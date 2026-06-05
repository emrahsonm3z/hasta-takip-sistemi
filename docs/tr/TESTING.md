# Test

Bu doküman, uygulamanın doğru çalıştığını nasıl kontrol ettiğimizi anlatır:
neler otomatik test edilir, neler elle kontrol edilir, testler nasıl
çalıştırılır ve genişletilir. İlk bölümler herkes içindir; nasıl-yapılır
kısmı geliştiriciler için.

---

## Yaklaşım

Otomatik testler uygulamanın **saf mantığını** kapsar — değer alıp değer
döndüren, tarayıcıya bulaşmayan fonksiyonlar. Görsel görünüm ve ekran
davranışı elle doğrulanır (lint/tip zinciri de UI hatalarının büyük bir
sınıfını daha hiçbir test koşmadan yakalar). Bilerek **Vitest yok, React
Testing Library yok, jsdom yok** — koşucu Node'un yerleşik `node --test`'idir,
sıfır test bağımlılığıyla. Bir DOM test düzeneği eklemek, sonrası için
kayıtlı, ayrı bir karardır.

---

## Testleri çalıştırmak

Spec'ler TypeScript'tir ve Node'un yerel **type-stripping** özelliğiyle
çalışır; bu **Node 24** ister (`.nvmrc`). Daha eski bir Node'da `.ts`
spec'leri sessizce atlanır — bu yüzden önce sürümü değiştirin:

```
nvm use
npm test
```

CI aynı komutu Node 24'te çalıştırır (kapı `.nvmrc`'yi okur); yerelde
unutulan bir `nvm use`, bozuk bir testi review'dan asla kaçıramaz.

---

## Bugün kapsananlar

| Spec dosyası (`src/__test__/`) | Neyi kanıtlar |
| --- | --- |
| `composables/useMenu.lib.test.ts` | Menü gruplama, öğe + çocuk sıralama, alt-bölüm etiketleri |
| `composables/useNotify.lib.test.ts` | Bilinmeyen hatalar `errors.unexpected`'e normalleşir |
| `modules/docs/docs-registry.test.ts` | Her kayıtlı doküman var olan en + tr dosyasına çözülür; slug'lar benzersiz; `resolveDocPath` dil seçimi |
| `locales/locales.test.ts` | `tr.json` ile `en.json` birebir aynı anahtar yollarını taşır |
| `plugins/theme.lib.test.ts` | Tema takas mantığı (href, `dark` sınıfı, kalıcılık) |
| `lib/*.test.ts` | `formatDate`, `pickLocalized`, Türkçe normalizasyon/collator, route handle koruması |
| `components/AppDataTable.lib.test.ts` | Başlangıç filtre kurulumu |
| `config/env.test.ts` | Eksik değişken tespiti |
| `tools/eslint/` (RuleTester) | Özel no-explanatory-comments lint kuralı |

Locale-eşlik spec'i bu üslubun iyi bir örneğidir — küçük, saf ve insanların
unutacağı bir kuralı bekler:

```ts
test('tr and en locale files have identical key paths', () => {
  const trKeys = keyPaths(tr).sort()
  const enKeys = keyPaths(en).sort()
  assert.deepEqual(trKeys, enKeys)
})
```

---

## Yeni test nasıl eklenir

1. Test etmek istediğiniz mantığı **saf** bir dosyaya koyun (bir `lib/`
   yardımcısı ya da bir composable'ın `.lib.ts` çekirdeği) — React'e ya da
   DOM'a dokunuyorsa önce saf kısmı ayırın; bu ayrım projenin standart
   desenidir.
2. `src/__test__/<aynalanmış-yol>/<ad>.test.ts` oluşturun — test ağacı kaynak
   ağacını aynalar.
3. **`.ts` uzantısı dahil göreli yollarla** import edin (Node'un test koşucusu
   `@/` alias'ını çözmez); yalnız-tip import'lar `@/` kullanabilir.
4. `node:test` + `node:assert/strict` kullanın:

```ts
import assert from 'node:assert/strict'
import test from 'node:test'

import { resolveDocPath } from '../../../modules/docs/lib/doc-path.ts'

test('resolveDocPath picks the Turkish file for tr', () => {
  assert.equal(resolveDocPath(entry, 'tr'), entry.paths.tr)
})
```

5. `nvm use && npm test` — paket bir saniyenin epey altında biter.

Testler işle birlikte planlanır (audit adımında) ve kodla birlikte yazılır —
asla sonradan iliştirilmez. Zorunlu kapsam eşiği yoktur; çıta, bozulmaya
değer her saf sözleşmenin bir spec'i olmasıdır.

---

## Makinelerin testlerden başka kontrol ettikleri

Her commit ve her pull request ayrıca `npm run validate`'ten (tip kontrolü +
ESLint + Stylelint + Prettier) ve production build'inden geçer — tam kapı
için "Nasıl Çalışıyoruz"a bakın.
