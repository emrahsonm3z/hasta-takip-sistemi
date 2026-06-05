# Mimari

Bu doküman, uygulamanın nasıl organize edildiğini anlatır: hangi yapı taşları
var, her biri neden sorumlu ve birbirine nasıl oturuyor. Projenin yapısını
anlamak isteyen herkes içindir — büyük resmi takip etmek için geliştirici
olmanız gerekmez.

> Bu erken bir iskelettir. Her bölüm, yaklaşan bir dokümantasyon turunda tam
> açıklamalar ve kısa örneklerle doldurulacaktır.

## Büyük resim

Hastaları takip etmek için tek sayfalık bir web uygulaması. Hasta listesini
bir veri servisinden bir kez yükler, sonraki tüm değişiklikleri kendi
cihazınızda tutar ve iki dil konuşur (Türkçe ve İngilizce).

## Modüller

Her özellik, modül denen kendi bağımsız klasöründe yaşar — örneğin `patients`
(hasta ekranları) ve `docs` (şu anda okuduğunuz doküman görüntüleyici). Bir
modül ihtiyacı olan her şeyi tek yerde tutar ve diğer modüllerle yalnızca
resmî kapısından konuşur.

## Katmanlar

Bir modülün içinde kod, her biri tek iş yapan katmanlar hâlinde dizilir: dış
dünyayla konuşmak, veri şekillerini tanımlamak, veriyi dönüştürmek, koordine
etmek ve ekranı çizmek. Her katman yalnızca altındaki katmanlara yaslanabilir.

## Yönlendirme ve menü

Hangi adreste hangi sayfanın açıldığı ve kenar menüsünün aynı tek rota
listesinden nasıl üretildiği — böylece menü asla listeyle uyumsuz kalamaz.

## Yapılandırma

Uygulamanın başlamak için ortamından nelere ihtiyaç duyduğu (örneğin veri
servisinin adresi) ve eksik bir ayarın nasıl bildirildiği.
