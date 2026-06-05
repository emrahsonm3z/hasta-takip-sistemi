# Veri ve Saklama

Bu doküman, hasta verisinin nereden geldiğini, nerede tutulduğunu ve bir kayıt
eklediğinizde, düzenlediğinizde ya da sildiğinizde ne olduğunu anlatır.
"Değişikliğim aslında nereye gidiyor?" diye merak eden herkes içindir — büyük
resim için geliştirici geçmişi gerekmez.

> Bu erken bir iskelettir. Her bölüm, yaklaşan bir dokümantasyon turunda tam
> ayrıntıyla genişletilecektir.

## Veri nereden gelir

Hasta listesi, salt-okunur bir veri servisinden **bir kez** indirilir. Bu ilk
yüklemeden sonra uygulama kendi kopyasıyla çalışır.

## Değişiklikleriniz nerede yaşar

Ekleme, düzenleme ve silme — hepsi tarayıcınızın yerel deposunda olur; bir
sunucuda değil, sizin cihazınızda. Bu, bu case-study projesi için bilinçli bir
tercihtir: veriler sahte (mock) veridir. Gerçek hasta verisi asla bu şekilde
işlenmezdi.

## Ekran nasıl güncel kalır

Depo ile ekranlar arasında bellek içi bir önbellek oturur. Her değişiklikten
sonra önbelleğe "kopyan bayatladı" denir ve depodan yeniden okur. Tam olarak
tek bir doğruluk kaynağı vardır.

## Bir şeyler ters giderse

Başarısız bir yükleme, sayfa içinde yeniden dene düğmeli bir hata gösterir;
başarısız bir kayıt bir bildirim gösterir. Bozuk depolanmış veri, uygulamayı
çökertmek yerine boş sayılır.
