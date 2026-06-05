# Sürümler ve Yayınlar

Bu doküman, uygulamanın sürüm numaralarını (0.2.0 gibi) nasıl aldığını ve bir
sürümün nasıl kesildiğini anlatır. Herkes için kısa özet: **sürüm numarasını
kimse elle yazmaz — bir robot onu commit tarihçesinden türetir ve sahip her
sürümü tek tıkla onaylar.** Kesin mekanik aşağıda.

---

## Bir sürüm numarası ne anlatır

`major.minor.patch` — örn. `0.2.0`:

| Parça | Ne zaman artar | Örnek |
| --- | --- | --- |
| patch | yalnız düzeltmeler indi (`fix:`) | 0.2.0 → 0.2.1 |
| minor | yeni bir şey indi (`feat:`) | 0.2.0 → 0.3.0 |
| major | ilk geliştirme boyunca **0**'da kalır | — |

1.0 öncesinde, kıran değişiklikler bile yalnız minor'ı artırır (aşağıdaki
config'te `bump-minor-pre-major: true`). 1.0.0'a geçiş, uygulama özellik
açısından tamamlandığında bilinçli bir karar olacak — kazara olamaz.

---

## Sayılar nereden gelir

Her commit mesajı makine-okur bir tip taşır (`feat:`, `fix:`, … — bkz. "Nasıl
Çalışıyoruz"). **release-please** GitHub Action'ı `main`'deki commit'leri
okur ve sıradaki sürümü kendi başına hesaplar. Kurulumun tamamı iki küçük
dosyadır:

```yaml
# .github/workflows/release.yml
on:
  push:
    branches: [main]
jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          config-file: release-please-config.json
          manifest-file: .release-please-manifest.json
```

```json
// release-please-config.json
{
  "include-component-in-tag": false,
  "bump-minor-pre-major": true,
  "packages": {
    ".": { "release-type": "node", "package-name": "hasta-takip-sistemi" }
  }
}
```

İncelenmiş her alt-commit'in `main`'de korunmasının (rebase-merge, asla
squash) nedeni budur: her commit'in tipi sürüm sinyalidir.

---

## Bir sürüm adım adım nasıl kesilir

1. Topic branch'leri her zamanki gibi `main`'e merge olur. **Her merge kodu
   zaten yayınlar** (Vercel `main`'i izler) — ama sürüm numarası kıpırdamaz.
2. Robot yeni commit'leri fark eder ve tek bir **Release PR** açar (ya da
   günceller): `package.json` sürümünü yükseltir, manifest'i günceller ve son
   sürümden bu yana gelen commit mesajlarından `CHANGELOG.md`'yi yeniden
   üretir.
3. Sahip o Release PR'ı merge eder — sürüm artık vardır: numara yükselir ve
   commit etiketlenir (örn. `v0.2.0`).

Bilinmeye değer tek tuhaflık: Release PR'ı bir robot token'ı açar; CI kapısı
onda kendiliğinden çalışmaz. Sahip onu **GitHub arayüzünde kapatıp yeniden
açar** — insan eliyle yeniden açma kapıyı tetikler ve PR gerçek bir yeşil
kontrolle merge olur. (Yedek: yönetici muafiyetiyle doğrudan merge; güvenli,
çünkü Release PR yalnız sürüme ve değişiklik günlüğüne dokunur.)

---

## Değişiklik günlüğü

`CHANGELOG.md` repo kökünde yaşar, çünkü release-please onu orada üretir.
Yalnız İngilizcedir (iki-dil kuralından muaf) ve uygulamanın içinde
salt-okunur render edilir — Dokümanlar → Değişiklik Günlüğü, iki dilde de
aynı dosyayı gösterir.

npm publish yok, uygulama mağazası yok — uygulama özeldir ve yayın merge
anında olur. Buradaki "release", iyi yapılmış kayıt düzenidir: doğru bir
numara ve dürüst bir değişiklik günlüğü.
