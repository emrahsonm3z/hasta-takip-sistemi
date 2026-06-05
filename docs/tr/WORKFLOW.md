# Nasıl Çalışıyoruz

Bu doküman, bir değişikliğin uygulamaya nasıl girdiğini anlatır: ilk fikirden,
kodun yazılıp kontrol edilmesine, oradan yayına. Ekipteki herkes için
yazılmıştır — takip etmek için geliştirici olmanız gerekmez. Tek bir şey
aklınızda kalacaksa şu kalsın: **proje sahibinin incelemesi ve onayı olmadan
hiçbir şey yayına çıkmaz.**

## İki rol

- **Geliştirici** (bu projede, gözetim altında çalışan yapay zekâ asistanı
  Claude Code) kodu yazar ve her değişikliği hazırlar.
- **Sahip** (proje yöneticisi) her değişikliği inceler, pull request'i açar ve
  son "merge" düğmesine basar. Bir şeyi yayına alabilecek tek kişi sahiptir.

## İş nereden gelir

Planlı iş tek bir yerde durur: **Sprint Planı** (uygulamanın içinde, Dokümanlar
altında okuyabilirsiniz). Basit bir görev listesidir. Biten görevler ✅ ile
işaretlenir ve asla silinmez; böylece plan aynı zamanda projenin tarihçesidir.

## Bir değişikliğin yolculuğu, adım adım

1. **Önce plan.** Tek satır kod yazılmadan önce geliştirici ilgili
   dokümantasyonu okur ve bir plan önerir: ne değişecek, hangi sırayla, nasıl
   test edilecek. Sahip planı inceler ve onaylar.
2. **Küçük, incelenmiş adımlarla çalış.** Değişiklik parça parça yapılır. Her
   parça geliştirici tarafından kontrol edilir (self-review) ve ancak ondan
   sonra **commit** olarak kaydedilir — işin küçük, adlandırılmış bir
   fotoğrafı. Commit mesajları makinelerin de okuyabileceği sıkı bir adlandırma
   kuralına uyar (otomatik sürüm numaralarını bu besler — bkz. "Sürümler ve
   Yayınlar").
3. **Dokümantasyonu güncelle.** Değişiklik dokümantasyonda anlatılan bir şeyi
   etkiliyorsa, ilgili sayfalar aynı iş paketi içinde **iki dilde** güncellenir.
4. **Push'la ve dur.** Geliştirici biten branch'i yükler ("push") ve **orada
   durur**. Pull request'i geliştirici **açmaz**. Push'tan sonra geliştirici,
   son raporunda sahibe önerilen bir başlık ve açıklama metni teslim eder.
5. **Pull request'i sahip açar.** **Pull request** (PR), değişikliğin
   uygulamanın ana sürümüne alınması talebidir. Açıklaması **sözleşmedir**: ne
   planlandı, ne yapıldı, nasıl test edildi, hangi dokümanlara dokunuldu. Sahip
   onu GitHub'da, geliştiricinin önerdiği metni kullanarak açar.
6. **Otomatik kontroller çalışır.** Her pull request bir makine tarafından
   denetlenir (**CI kapısı**): kod kalitesi, tipler, biçim, testler ve güvenlik
   taraması. Kapı kırmızıyken bir pull request **merge edilemez**.
7. **Sahip inceler ve merge eder.** Sahip, işi sözleşmeyle karşılaştırır. Bir
   şey yolunda değilse geliştiriciye geri döner. Doğruysa ve kapı yeşilse sahip
   merge eder — incelenmiş her adımı tarihçede görünür tutarak (squash yok).
8. **Yayına çıkar.** Ana branch'e merge, uygulamayı otomatik olarak yayınlar.

## Asla esnemeyen güvenlik kuralları

- Geliştirici onaysız iş kaydetmez (commit), kararlaştırılan adımlar bitmeden
  yüklemez ve **pull request'i asla açmaz**.
- Otomatik kapı her pull request'te çalışır, istisnasız.
- Küçük, düşük riskli değişiklikler resmî planlama seremonisini atlayabilir —
  ama pull request'i, kapıyı ve sahibin incelemesini asla.

## Bir şeyler ters giderse

Canlı uygulamaya bir sorun ulaşırsa iki araç vardır: barındırma servisi bir
önceki sürüme anında geri dönebilir ve acil bir düzeltme yukarıda anlatılan
aynı yolu, sadece daha hızlı yürür.
