# Tanıtım Modülü

Bu doküman proje tanıtımını anlatır — uygulamanın **ana sayfası** (`/`), tüm
projeyi sade, modern bir genel bakış olarak sunar. Aynı anda
iki okura hitap eder: uygulamanın ne yaptığını anlamak isteyen teknik olmayan
bir sahip ve gerçek mühendisliğin kanıtını arayan teknik bir incelemeci.
Tamamen tamamlanmıştır; aşağıdaki her şey depodaki gerçek koddur.

---

## Ne yapar

Ana sayfa, yedi yığılı bölümden oluşan tek bir sayfadır — Genel Bakış
(hero), Ne Yapar, Canlı Önizleme, Mimari ve Teknoloji, Kalite ve
Erişilebilirlik, Üretim Süreci ve Kapanış. Sade dildeki değer cümleleri sahibi
için hikâyeyi taşır; her bölüm teknik okur için kısa bir "kaputun altı"
satırı ve rozetler ekler.

Geniş ekranlarda (`lg` ve üzeri) sağda sabit bir içindekiler listesi bölüm
başlıklarını gösterir, kaydırdıkça aktif olanı vurgular ve tıklanınca o bölüme
kaydırır. `lg` altında sayfa tek sütundur, yan menü yoktur.

Sayfa tümüyle iki dillidir: tüm metin `showcase.*` altında locale dosyalarında
yaşar (Türkçe ve İngilizce eşlikte), dil üst çubuktan değiştirilebilir ve
varsayılan olarak Türkçe görüntülenir.

---

## Ana rota ve layout

Tanıtım, uygulamanın **ana sayfasıdır** ve hasta uygulama kabuğunun parçası
**değildir**. `router/index.tsx` içinde index rotası `/` doğrudan tanıtımı
render eder (yönlendirme yok); hasta uygulaması kendi rotalarını (`/patients`,
`/docs`, …) `AppLayout` altında tutar. Eski `/showcase` yolu artık `/`'e
**yönlendirir** — tek kanonik ana sayfa.

Tanıtım kendi ince, tam-genişlik `ShowcaseLayout` üst çubuğunu sarar — marka
işareti (`/`'e bağlanır), `/patients`'e giden bir "Canlı demo" bağlantısı, bir
GitHub bağlantısı ve **uygulama kabuğunun kullandığı aynı dil değiştirici ile
tema düğmesi** (`AppLanguageSwitcher` + `AppThemeToggle`) — kenar menü yok.
Küçük ekranlarda demo ve GitHub düğmeleri yalnızca-simgeye iner. Sayfa kenar
menüden **uzak** tutulur (`useMenu` değişmez); modül **dokümantasyonu** (bu
dosya) ise her modül dokümanı gibi doküman registry'sine kayıtlıdır.

Tüm uygulama-kökü provider'ları (PrimeReact + Lara teması, i18n, toast
provider, React Query) `main.tsx` içinde router'ın üstünde durduğundan, ana
rota onları ekstra bir bağlama olmadan devralır — canlı önizleme, dil
değiştirici ve tema düğmesini burada çalıştıran da budur.

---

## Canlı önizleme

"Canlı önizleme" bölümü **gerçek** bir `AppDataTable` gömer — hasta listesinin
kullandığı aynı global wrapper — altı **uydurma** örnek satırla beslenir
(gerçek hasta verisi yok). Gerçek sıralamayı (adda Türkçe-duyarlı), iki menü
filtresini (bölüm ve durum) ve global arama kutusunu gösterir. Örnek veri ve
tipleri modüle özeldir; böylece tanıtım, hasta modülünün iç parçalarına asla
uzanmaz. Tablo `tableMinWidth="100%"` geçer, böylece beş kolonu masaüstünde
zorunlu yatay kaydırma olmadan genişliği doldurur (wrapper'ın varsayılan
`72rem` tabanı hasta tablosu için değişmez).

---

## Scroll-spy

`useScrollSpy` aktif bölümü kaydırma konumundan izler: üst kenarı, görünüm
alanının üstüne yakın sabit bir çizgiyi geçmiş son bölüm aktiftir; sayfa sonuna
kaydırıldığında son bölümü etkinleştiren bir alt-yakını yedeği ile (böylece son
ikisi dahil her bölüm aktif olabilir). Bir içindekiler öğesine tıklamak onu
hemen etkinleştirir ve kaydırma yeniden-hesabını kısa süre kilitler, böylece
tıklama "yapışır". Yumuşak kaydırma, ziyaretçi azaltılmış hareketi tercih
ettiğinde anlık atlamaya döner. Kanca saftır değildir (DOM'u okur); bu yüzden
birim-testle değil elle doğrulanır (Test dokümanına bakın).

---

## Dosyalar

```
src/modules/showcase/
├── components/
│   ├── ShowcaseLayout.tsx        ince üst çubuk + Outlet (kardeş-rota layout'u)
│   ├── ShowcaseTopbar.tsx        marka + demo/GitHub + dil & tema düğmeleri
│   ├── ScrollSpyNav.tsx          sağdaki içindekiler listesi (lg+)
│   ├── ShowcaseSection.tsx       SectionShell / SectionLead / UnderHood / Pill
│   ├── ShowcaseDataPreview.tsx   canlı AppDataTable gömmesi
│   └── sections/                 yedi bölüm bileşeni
├── composables/
│   └── useScrollSpy.ts           aktif-bölüm izleme
├── constants/
│   ├── showcase.constants.ts             GitHub URL'si
│   ├── showcase-sections.constants.ts    bölüm id'leri + başlıkları (TOC kaynağı)
│   ├── showcase-content.constants.ts     metrikler, özellikler, yığın, rozetler, adımlar
│   └── showcase-sample-patients.constants.ts   uydurma önizleme satırları + tipler
├── pages/
│   └── ShowcasePage.tsx          bölümleri + scroll-spy TOC'unu birleştirir
├── routes.tsx                    SHOWCASE_ROUTES + kardeş rota dizisi
└── index.ts                      barrel (SHOWCASE_ROUTES, showcaseRoutes)
```

---

## Genel API

Barrel yalnızca `SHOWCASE_ROUTES` (rota sabiti) ve `showcaseRoutes` (router'ın
topladığı `RouteObject[]`) sunar. Geri kalan her şey modüle özeldir.
