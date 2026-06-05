# Ortak Bileşenler

Bu doküman, her ekranın kendisinden derlendiği yeniden kullanılabilir yapı
taşlarını anlatır: tablo, form alanları, yükleniyor ve hata görünümleri,
bildirim mesajları ve yerleşim iskeleti. Ekranların ortak noktalarını merak
eden herkes için yararlıdır — yeni bir ekran yapacak geliştiriciler içinse
zorunlu okumadır.

> Bu erken bir iskelettir. Her bileşen, yaklaşan bir dokümantasyon turunda tam
> açıklamasına kavuşacaktır (ne yapar, ne kabul eder, nasıl davranır).

## Her şey için tek tablo

Uygulamadaki tüm listeler tek bir ortak tablo bileşenini kullanır. Türkçe
sıralamayı ve aramayı bilir ("ç" ve "ı" doğru davranır), sayfa numaraları
gösterir ve küçük ekranlara uyum sağlar. Ekranların kendi tablolarını yapması
yasaktır.

## Form alanları

Metin kutuları, açılır listeler, tarih seçiciler, onay kutuları — hepsi,
etiketleri ve hata mesajları iki dilde hazır gelen ortak bir form alanı
setinden gelir.

## Yükleme, hatalar ve mesajlar

"Yükleniyor"u göstermenin tek yolu, "bu başarısız oldu, yeniden dene"yi
göstermenin tek yolu, açılır bildirim göstermenin tek yolu vardır; beklenen
bir sorun (veri yüklenemedi) ile beklenmeyen bir sorun (bir hata/bug) net
biçimde ayrılır. Her birinin her yerde kullanılan kendi bileşeni vardır.

## Yerleşim iskeleti

Kenar menüsü, üst çubuk, logo, dil anahtarı ve açık/koyu düğmesi birlikte her
sayfanın çerçevesini oluşturur.
