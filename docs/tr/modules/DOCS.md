# Doküman Modülü

Bu doküman, doküman görüntüleyicinin kendisini anlatır — şu anda kullandığınız
özelliği. İlk bölümler herkes içindir; iç işleyiş geliştiriciler içindir.

## Ne yapar

Menüdeki Dokümanlar girişi, tüm proje dokümanlarının kartlar hâlinde dizildiği
bir indeks açar. Bir karta tıklamak o dokümanı rahat bir okuma sayfası olarak
açar. Uygulama dilini değiştirmek (TR/EN) dokümanı anında çevirisiyle
değiştirir.

## Dokümanlar nerede yaşar

Her doküman, projenin içinde saklanan düz bir metin dosyasıdır (Markdown);
eşleşen adlarla bir İngilizce klasörde ve bir Türkçe klasörde durur. İki özel
doküman — Sprint Planı ve Değişiklik Günlüğü — proje kökünde yaşar; Değişiklik
Günlüğü yalnızca İngilizce vardır ve iki dilde de İngilizce gösterilir.

## Kayıt (registry) kuralı

Modül, her dokümanın tek bir listesini (registry) tutar: uygulamadaki adresi,
iki dildeki başlığı, simgesi ve iki dosyası. O listede olmayan bir doküman
uygulama için yoktur — kart da almaz, adres de. Otomatik bir test, listedeki
her dosyanın iki dilde de gerçekten var olduğunu denetler.

## Nasıl kurulu

Registry ve rota tanımları düz veridir. Bir yükleyici, etkin dile uyan dosyayı
seçer ve onu talep üzerine getirir (dokümanlar uygulamanın ilk indirmesine
paketlenmez). Küçük bir çizici, Markdown'ı uygulamanın tema renklerini
kullanarak stilli okuma sayfalarına çevirir; böylece hem açık hem koyu modda
doğru görünür.
