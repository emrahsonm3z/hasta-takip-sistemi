# Nasıl Çalışıyoruz

Bu doküman, bir değişikliğin uygulamaya nasıl girdiğini anlatır: ilk fikirden,
kodun yazılıp kontrol edilmesine, oradan yayına. Tek bir şey aklınızda
kalacaksa şu kalsın: **proje sahibinin incelemesi olmadan hiçbir şey yayına
çıkmaz ve pull request'i yapay zekâ geliştirici değil, her zaman sahip açar
ve merge eder.**

---

## İki rol

| Rol | Kim | Ne yapar |
| --- | --- | --- |
| Geliştirici | Gözetim altında çalışan Claude Code | Planlar, kod + test yazar, self-review yapar, (yalnız onayla) commit'ler, push'lar — sonra DURUR |
| Sahip | Repo sahibi / takım yöneticisi | Planları ve kodu inceler, **pull request'i açar**, merge eder, her sürümün sahibidir |

---

## Bir değişikliğin yaşamı

```
fikir (sprint planı)
  → audit / plan (kod yok; sahip onaylar)
    → her seferinde bir alt-madde implement edilir
        → self-review → Conventional Commit (incelenmiş alt-madde başına bir)
    → topic'in son commit'inde docs:sync (iki dil)
  → branch push'lanır — geliştiricinin akışı burada BİTER
    → PR'ı GitHub'da SAHİP açar (geliştiricinin son raporunda önerdiği
      başlık + gövdeyle; açıklama sözleşmedir)
      → CI kapısı çalışır — yeşil olmak zorunda
        → sahip sözleşmeye karşı inceler
          → Rebase and merge (alt-commit'ler korunur, asla squash)
            → Vercel main'i otomatik yayınlar
```

Küçük, düşük riskli değişiklikler (bağımlılık bump'ları, yazım düzeltmeleri)
resmî audit seremonisini atlayabilir — ama pull request'i, kapıyı ve sahibin
merge'ini asla.

---

## Commit'ler — hem insan hem makine okur

Her commit mesajı **Conventional Commits**'e uyar; commitlint bunu bir git
hook'unda zorlar. Bu branch'ten gerçek bir örnek:

```
feat(layout): group module docs under a section label in the sub-menu
```

Tip öneki süs değildir: release-please sürüm numaralarını ondan türetir
(bkz. "Sürümler ve Yayınlar"). Buradaki yaygın tipler:

| Tip | Anlamı | Sürüm etkisi (0.x) |
| --- | --- | --- |
| `feat:` | yeni bir şey | minor artış |
| `fix:` | bir onarım | patch artış |
| `docs:` / `chore:` / `ci:` / `refactor:` | kullanıcıya görünür değişiklik yok | yok |

Branch'ler aynı tiplerle adlandırılır: `feat/*`, `fix/*`, `docs/*`,
`chore/*` — branch başına tek konu, üzerinde çok sayıda incelenmiş commit.

---

## Otomatik kapı

Her pull request `gate` job'unu çalıştırır (`.github/workflows/ci.yml`) —
adımlar, sırasıyla, aynen:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version-file: .nvmrc      # Node 24
    cache: npm
- run: npm ci
- run: npm run validate            # tip kontrolü + ESLint + Stylelint + Prettier
- run: npm test                    # node --test (saf-mantık spec'leri)
- run: npm run build               # production build başarmalı
- run: npm audit --audit-level=high
```

`main` üzerindeki branch koruması, merge'den önce bir pull request ve yeşil
bir `gate` ister; geçmiş lineerdir (yalnız "Rebase and merge" mümkündür —
alt-commit'ler korunur, çünkü release-please her birini okur; squash sürüm
sinyalini yok ederdi). Kontrol zorunludur ama "strict" modda değildir (branch,
merge'den önce `main` ile yeniden eşitlenmek zorunda değildir). Yöneticiler
muaf kalır — aşağıdaki release akışı için gereklidir.

---

## Release PR'ları ve kapat + yeniden aç numarası

Merge'ler `main`'e indikten sonra release-please robotu bir **Release PR**
açar (sürüm artışı + değişiklik günlüğü — bkz. "Sürümler ve Yayınlar"). O PR
`GITHUB_TOKEN` ile açılır ve GitHub'ın anti-recursion kuralı gereği robotun
açtığı bir PR, CI kapısını kendiliğinden tetiklemez. Sahibin tercih ettiği
hamle: **Release PR'ını GitHub arayüzünde kapatıp yeniden açmak** — insan
eliyle yapılan yeniden açmanın workflow tetiklemesine izin VARDIR, kapı
çalışır ve PR gerçek bir yeşil kontrolle merge olur. (Yedek yol: yönetici
muafiyetiyle doğrudan merge — kabul edilebilir, çünkü Release PR yalnız sürüm
numarasına ve değişiklik günlüğüne dokunur.)

---

## Bir şeyler ters giderse

Başarısız bir self-review implementasyona döner; başarısız bir sahip
incelemesi geliştiriciye döner. Bir sorun production'a ulaşırsa: Vercel bir
önceki deployment'a anında dönebilir ve acil bir düzeltme yukarıdaki aynı
yolu bir `fix/*` branch'inde, sadece daha hızlı yürür.
