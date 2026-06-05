# Sürümler ve Yayınlar

Bu doküman, uygulamanın sürüm numaralarını (0.2.0 gibi) nasıl aldığını ve yeni
bir sürümün nasıl yayınlandığını anlatır. Herkes için yazılmıştır —
geliştirici geçmişi gerekmez. Kısa özet: **sürüm numaraları elle seçilmez; bir
robot onları değişiklik tarihçesinden türetir ve sahip her sürümü tek tıkla
onaylar.**

## Bir sürüm numarası ne anlatır

Bir sürüm `0.2.0` gibi görünür — üç sayı: **major.minor.patch**.

- **Patch** artışı (0.2.0 → 0.2.1) "yalnızca küçük düzeltmeler" demektir.
- **Minor** artışı (0.2.0 → 0.3.0) "yeni bir şey eklendi" demektir.
- **Major** sayısı "işler geriye dönük uyumu bozacak şekilde değişti" der.
  Proje hâlâ yapım aşamasındayken major **0**'da kalır; 1.0.0'a geçiş,
  uygulama özellik açısından tamamlandığında bilinçli olarak verilecek bir
  karardır — asla kazara olmaz.

## Sayılar nereden gelir

Kaydedilen her değişiklik (her **commit**) tipli bir mesaj taşır: `fix: …`
("bir şeyi onardım") ya da `feat: …` ("yeni bir şey ekledim") gibi.
**release-please** adlı bir robot ana branch'teki bu mesajları okur ve sıradaki
sürümü kendi başına hesaplar: düzeltmeler patch'i, yeni özellikler minor'ı
artırır. "Nasıl Çalışıyoruz"daki mesaj kuralının bu kadar sıkı uygulanmasının
nedeni budur — tarihçe aynı zamanda sürüm hesaplayıcısıdır.

## Bir yayın adım adım nasıl olur

1. Değişiklikler her zamanki gibi ana branch'e merge edilir (bkz. "Nasıl
   Çalışıyoruz"). Her merge yeni kodu zaten yayına alır — ama sürüm numarası
   henüz kıpırdamaz.
2. Robot yeni değişiklikleri fark eder ve özel bir **Release PR** açar (ya da
   günceller): sürüm numarasını yükselten ve **Değişiklik Günlüğü**'nü (neyin
   değiştiğinin sürüm sürüm listesi — uygulamanın içinden de okunabilir)
   yeniden yazan tek bir pull request.
3. Sahip o Release PR'ı merge eder. Yeni sürümün resmî olarak var olduğu an
   budur: numara yükselir ve sürüm etiketlenir.

Yayınlanacak bir uygulama mağazası ya da paket yoktur — uygulama özeldir ve
yayına çıkış normal merge ile olur; burada "yayın" aslında kayıt düzenidir:
numara ve değişiklik günlüğü.

## Bilinmeye değer tek tuhaflık

Release PR'ı bir robot hesabı açar ve güvenlik gereği GitHub, bir robotun pull
request'inin başka bir robotun kontrollerini tetiklemesine izin vermez. Bu
yüzden otomatik **kapı**, Release PR'da kendiliğinden çalışmaz. Sahibin onu
merge etmek için iki yolu vardır:

- **GitHub arayüzünde kapatıp yeniden açmak.** İnsan eliyle yapılan yeniden
  açma kontrolleri tetikler, kapı çalışır ve PR gerçek bir yeşil kontrolle
  merge olur. **Tercih edilen yol budur.**
- Sahibin yönetici yetkisiyle, kontrol olmadan doğrudan merge etmek. Bu kabul
  edilebilir, çünkü Release PR yalnızca sürüm numarasına ve değişiklik
  günlüğüne dokunur — içinde kod yoktur.
