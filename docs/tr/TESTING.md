# Test

Bu doküman, uygulamanın doğru çalıştığını nasıl kontrol ettiğimizi anlatır —
neler otomatik test edilir, neler elle kontrol edilir ve ikisinin arasındaki
çizgi nerededir. Büyük resim herkes içindir; araç ayrıntıları çoğunlukla
geliştiricileri ilgilendirir.

> Bu erken bir iskelettir. Her bölüm, yaklaşan bir dokümantasyon turunda tam
> ayrıntıyla genişletilecektir.

## Makineler neyi kontrol eder

Uygulamanın saf mantığı — veri dönüşümleri, Türkçe metin işleme, çeviri
dosyalarının eksiksizliği, dokümantasyon kaydı — her değişiklikte çalışan
otomatik testlerle ve eksiksiz bir kod kalitesi zinciriyle (tipler, lint,
biçim) kapsanır.

## İnsanlar neyi kontrol eder

Görsel görünüm ve ekran davranışı elle doğrulanır. Proje bu aşamada bilinçli
olarak otomatik tarayıcı testi tutmaz; eklenmesi kayıtlı, ayrı bir karardır.

## Testler ne zaman yazılır

Testler işle birlikte planlanır (planlama adımında) ve kodla birlikte yazılır
— asla sonradan iliştirilmez.
