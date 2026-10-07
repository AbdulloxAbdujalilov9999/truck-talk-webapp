# SpeakUp — Ingliz tili

> **Now part of the Truck Talk site.** This folder is SpeakUp (section 1 of the combined site, served at `/speakup/`). It shares the site's Firebase project and its own data lives under the `speakup/` database namespace — see the root README, "One site, two courses".

7–8-sinf o'zbek maktab o'quvchilari uchun, ingliz tilini noldan boshlab o'rganadigan, 60 kunlik umumiy og'zaki ingliz tili kursi.

> **Eslatma:** `curriculum.js` va `grammar.js` fayllari hozircha ushbu skeletda yo'q — ular kursning haqiqiy dars materiallarini tashiydi va alohida tayyorlanmoqda. Ular qo'shilmaguncha `index.html`ni ochsangiz, sahifa bo'sh/ishlamaydigan holatda ko'rinadi — bu kutilgan holat.

## Ichida nima bor

- **`index.html`** — o'quvchi uchun kurs sahifasi: ilova qobig'i, dizayn tizimi va joylashuv
- **`app.js`** — kurs dvigateli (darslarni chizish, progress kuzatuvi, nutqni sintez qilish/tanish, testlar, ikonkalar)
- **`curriculum.js`** *(hali yo'q, alohida tayyorlanmoqda)* — 60 kunlik to'liq o'quv dasturi (lug'at, dialoglar, grammatika maslahatlari, testlar, gapirish topshiriqlari), 12 haftaga bo'lingan
- **`grammar.js`** *(hali yo'q, alohida tayyorlanmoqda)* — alohida Grammatika kitobi: mavzularga bo'lingan bo'limlar, har birida tushuntirish, misollar, "keng tarqalgan xato" bloki va test
- **`admin/`** — admin platforma (egasi / menejer / o'qituvchi paneli: foydalanuvchilar, o'quvchilar, progress, kalendar) — quyidagi **Admin platformani sozlash** bo'limiga qarang
- **`shared/`** — Firebase konfiguratsiyasi + hisob darvozasi (kirish, ruxsat so'rash, tasdiqlash/cheklash ekranlari), kurs sahifasi va admin platforma tomonidan birga ishlatiladi
- **`database.rules.json`** — serverdagi Realtime Database kirish qoidalari; bu ilova interfeysi emas, balki haqiqiy xavfsizlik chegarasi

## Uni mahalliy kompyuterda ishga tushirish

Bu statik veb-ilova (bitta tashqi bog'liqlik: Firebase, CDN orqali yuklanadi — quyidagi **Admin platformani sozlash** bo'limiga qarang). Papkani istalgan statik fayl serveri bilan ishga tushiring, masalan:

```bash
python3 -m http.server 8000
```

Keyin kurs uchun `http://localhost:8000`, admin panel uchun esa `http://localhost:8000/admin/` manzilini oching.

## Admin platformani sozlash (Firebase)

Kurs va admin panel bitta Firebase loyihasini bo'lishadi: har kim kirib (Google, Apple yoki email/parol orqali), ismini kiritadi va **Ruxsat so'rash** tugmasini bosadi; egasi yoki menejer so'rovni `admin/` bo'limidan tasdiqlaydi va rol beradi (O'qituvchi, yoki O'quvchi + uning o'qituvchisi). Haqiqiy Firebase loyihasini ulamaguningizcha, `index.html` ham, `admin/index.html` ham shunchaki "Sozlash kerak" ekranini ko'rsatadi.

1. **Firebase loyihasini yarating** — bepul Spark rejasi yetarli — [console.firebase.google.com](https://console.firebase.google.com) sahifasida, so'ng **Project settings → General → Your apps → add a Web app**, va uning konfiguratsiya obyektini [`shared/firebase-config.js`](shared/firebase-config.js) fayliga joylashtiring.
2. **Authentication → Sign-in method** — **Google** va **Email/Password** ni yoqing. Apple orqali kirish uchun qo'shimcha ravishda Apple Developer Program a'zoligi va Apple hamda Firebase konsollarida sozlangan "Sign in with Apple" Services ID kerak — hozircha kerak bo'lmasa, o'tkazib yuborish mumkin, tugma shunchaki ishlamay turadi.
3. **Realtime Database** — Firestore emas: uni `npx firebase-tools init database` orqali (yoki konsolda Build → Realtime Database → Create Database) yarating, so'ng [`database.rules.json`](database.rules.json) faylini `npx firebase-tools deploy --only database` bilan e'lon qiling (yoki uni konsolning Rules bo'limiga joylashtiring). Realtime Database bepul **Spark rejasida, hisob-kitob (billing) hisobisiz** ishlaydi — bu loyiha aynan shu sababli Firestore o'rniga uni ishlatadi, chunki Firestore endi ma'lumotlar bazasini yaratish uchun ham Blaze rejasiga o'tishni talab qiladi. Natijada olingan `databaseURL`ni `shared/firebase-config.js` fayliga, konfiguratsiyaning qolgan qismi bilan birga qo'shing (to'liq konfiguratsiyani, jumladan `databaseURL`ni, istalgan vaqtda `npx firebase-tools apps:sdkconfig web` orqali olishingiz mumkin).
4. Kurs yoki admin panelni oching va **`abdujalilov7707@gmail.com`** bilan kiring — bu manzil (`shared/firebase-config.js` faylida va mustaqil ravishda `database.rules.json` faylida) **egasi** sifatida avtomatik tasdiqlanishi uchun qattiq kodlangan, ya'ni so'rovlar navbatini chetlab o'tadi. Boshqa har bir ro'yxatdan o'tgan foydalanuvchi egasi/menejerning **Users** bo'limida kutilayotgan so'rov sifatida paydo bo'ladi.

Rollar: **Owner (Egasi)** (hammasi: istalgan foydalanuvchini tasdiqlash/cheklash, o'qituvchilarni tayinlash, istalgan o'qituvchining kalendarini tahrirlash) va **Manager (Menejer)** (kundalik tasdiqlash/boshqaruv vakolatlari xuddi shunday, lekin egasi yoki menejer hisoblariga tegʻa olmaydi) admin panelning Users/Students/Progress/Calendar bo'limlaridan foydalanadi; **Teacher (O'qituvchi)** faqat o'ziga tayinlangan o'quvchilar doirasida Students/Progress/Calendar'ni ko'radi va o'z kalendarini boshqaradi; **Student (O'quvchi)** uchun hech narsa o'zgarmaydi — kirish shunchaki uni kursga avvalgidek olib kiradi, faqat endi uning progressi bulutga ham sinxronlanadi, shunda o'qituvchisi buni ko'ra oladi.

## Xususiyatlar

- 60 kunlik dars (12 hafta × 5 kun, har 5-kun — umumlashtiruvchi takrorlash), Darslar → Hafta → Kun tartibida joylashgan, kundagi 20 ta yangi lug'at so'zi
- Matndan nutqqa (TTS) talaffuz bilan lug'at fleshkartalari, qurilmadagi tezkor ovozlarni (shu jumladan Apple qurilmalaridagi Siri ovozlarini) sekin tarmoq ovozlaridan afzal ko'rishga moslashtirilgan
- Qatordan-qatorga yoki to'liq audio ijro etish imkoniyatiga ega ssenariyli dialoglar
- Har kungi lug'at asosida avtomatik yaratiladigan Amaliyot bo'limi (bo'sh joyni to'ldirish, so'zlarni moslashtirish)
- Qo'lda yozilgan tushunish savollari va avtomatik yaratilgan lug'at savollarini birlashtiruvchi, avtomatik baholanadigan testlar; ular kun ochilishini nazorat qiladi
- Nutqni tanish orqali "Nutq mashqi" (Speaking Practice) gapirish mashqi (Chromium asosidagi brauzerlarda)
- Alohida **Grammatika kitobi** — o'zbek va ingliz grammatikasining haqiqiy farqlariga qaratilgan bo'limlar (artikllar, do-support, so'z tartibi, modal fe'llar...), Grammatika → Mavzu → Bo'lim tartibida, har birida test bilan
- **Uyga vazifa** bo'limi — kurs lug'atining to'liq to'plami shu yerda kengaytiriladigan (accordion) mashg'ulotlar ro'yxati sifatida, qidiruv maydoni bilan; har bir mashg'ulotning testi uni bajarilgan deb belgilashning yagona yo'li
- Progress xaritasi, ketma-ketlik (streak) va XP bilan boshqaruv paneli (dashboard)
- Ingliz/o'zbek tillari o'rtasida ikki tilli almashtirgich
- Butun ilova bo'ylab izchil inline-SVG ikonkalar to'plami (emoji yo'q)
- 60-kundagi Yakuniy sinovdan so'ng bosib chiqarish mumkin bo'lgan tugatish sertifikati
- Pastki tab-panel bilan mobil qurilmalarga moslashtirilgan joylashuv
- Progress avval mahalliy qurilmada (`localStorage`) va doim saqlanadi; tizimga kirgandan so'ng u bulutga ham sinxronlanadi, shunda o'qituvchi va egasi uni ko'ra oladi

## Brend ranglari

Asosiy brend rangi: **SpeakUp Blue `#2F6FED`**. Barcha ranglar bitta faylda, `shared/tokens.css`da joylashgan, uni kurs sahifasi ham, admin panel ham ishlatadi.

| Nomi | Hex | Qayerda ishlatiladi |
| --- | --- | --- |
| Brand 900 | `#0F1E3D` | Och rejimda matn, qorong'i rejimda sahifa foni |
| **Brand 700 (asosiy)** | **`#2F6FED`** | Sarlavha, asosiy tugmalar, logotip, ikonka foni |
| Brand 500 (Coral) | `#FF6B4A` | Progress-barlar, urg'ular, ikkinchi darajali urg'ular |
| Brand 200 | `#BFD3FF` | Yumshoq to'ldirishlar, qorong'i rejimda asosiy tugma |
| Brand 50 | `#F7FAFF` | Och rejimda sahifa foni |
