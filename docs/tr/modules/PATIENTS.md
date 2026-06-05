# Hasta Modülü

Bu doküman, hasta takibi özelliğini ayrıntısıyla anlatır: liste, ekleme /
düzenleme / silme akışları ve modülün içten nasıl kurulduğu. İlk bölümler
herkes içindir; dosya haritası geliştiriciler içindir.

> Bu erken bir iskelettir. Modülün ekranları mevcut sprintte yapılıyor; bu
> sayfa onlarla birlikte büyüyecek.

## Ne yapar

Hasta kayıtlarını randevu ayrıntılarıyla listeler; listede arama, sıralama ve
filtreleme yapmanızı sağlar (Türkçe bilir); yeni kayıt eklemenize, mevcut
kaydı düzenlemenize ya da silmenize izin verir. Değişiklikler cihazınızda
kalır — bkz. "Veri ve Saklama".

## Veri neye benzer

Her kayıt hastanın adını, doğum tarihini, randevu tarihini, bölümü, durumu,
önceliği, kan grubunu, bir puanı, iki dilli not ve tanıyı, birkaç evet/hayır
işaretini ve serbest etiketleri tutar.

## Nasıl kurulu

Modül, "Mimari"de anlatılan standart katman tarifini izler: en altta veri
çekme ve yerel saklama, üstünde veri modeli ve dönüşümleri, sonra koordine
eden mantık ve en üstte ekranlar.
