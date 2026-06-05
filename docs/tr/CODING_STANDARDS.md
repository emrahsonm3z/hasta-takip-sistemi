# Kodlama Standartları

Bu doküman, kod yazarken uyduğumuz kuralları ve — en az onun kadar önemlisi —
bu kuralların neden var olduğunu anlatır. Kuralların ruhunu herkes
anlayabilsin diye yazılmıştır; teknik ayrıntılar çoğunlukla geliştiricileri
ilgilendirir, ama gerekçe herkes içindir: bu kurallar kodu tutarlı, okunur ve
güvenle değiştirilebilir tutar.

## Açıklamayı isimler yapar

Koddaki her şey açıklayıcı, tam kelimelerden oluşan bir isim alır. Uzun isim
sorun değildir; anlamsız kısaltma sorundur. Yeni hasta kaydeden bir düğmenin
adı `submitNewPatientButton`'dır, asla `sbmtBtn` değil. Amaç: kodu okuyan
birinin onu tercümansız anlayabilmesi.

## Açıklayıcı yorum yok

Bu projede alışılmadık bir kural var: kodda açıklayıcı yorum ya da
dokümantasyon bloğu bulunamaz. Bir kod parçası anlaşılmak için yoruma ihtiyaç
duyuyorsa, ihtiyaç kalmayana dek yeniden adlandırır ya da yeniden
yapılandırırız. Yoruma yazacağınız açıklamanın yeri bu dokümantasyon
sayfalarıdır — herkesin bulabileceği yerde, iki dilde. Özel yazılmış bir
denetim bunu otomatik olarak uygular.

## Her parça yerli yerinde

Kod, her biri tam olarak tek bir iş yapan küçük dosyalara bölünür ve her dosya
o işe karşılık gelen klasörde yaşar (veri çekme, şekil tanımlama, dönüştürme,
orkestrasyon, ekrana çizme). Birden fazla özelliğin kullandığı her şey ortak,
global bir yere taşınır — asla kopyala-yapıştır yapılmaz.

## Kodun içinde metin yaşamaz

Kullanıcının gördüğü her kelime çeviri dosyalarından gelir (Türkçe ve
İngilizce). Görünür bir cümleyi doğrudan koda yazmak hata sayılır. Uygulamayı
tam iki dilli yapan budur — bkz. "Diller (TR / EN)".

## Sıkı tipler — ve asla `any` yok

Kod, her değerin ne tür bir şey olduğunu bildirdiği bir dil olan TypeScript
ile yazılır. En sıkı denetim açıktır. Bir kural, geliştirici olmayanlar için
de adıyla anılmaya değer: `any` kelimesi (TypeScript'in "bu her şey olabilir,
denetlemeyi bırak" kaçış kapısı) **yasaktır**. Onu yazmak otomatik
kontrollerden geçemez. Bir şeyin tipi gerçekten bilinmiyorsa kod bunu dürüstçe
söylemeli (`unknown`) ve kullanmadan önce ne olduğunu kanıtlamalıdır —
denetçiyi susturmak seçenek değildir.

## Kuralları makineler uygular

Yukarıdakilerin hiçbiri hafızaya ya da iyi niyete dayanmaz. Otomatik araçlardan
oluşan bir zincir (kod kuralları için ESLint, biçim için Prettier, stiller
için Stylelint, commit mesajları için commitlint) her değişiklikte çalışır —
önce geliştiricinin makinesinde her commit'te, sonra yeniden otomatik kapıda
(bkz. "Nasıl Çalışıyoruz"). Tek bir komut, `validate`, zincirin tamamını
çalıştırır.
