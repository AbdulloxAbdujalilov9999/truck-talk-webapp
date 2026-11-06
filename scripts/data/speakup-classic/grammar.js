// SpeakUp Grammar Book — rebuilt on a deduplicated grammar sequence drawn from
// Round-Up 1, New Round-Up 2, and New Round-Up 3 (Evans & Dooley, Pearson):
// each grammar point kept once, at its fullest/last appearance across the
// three books, in the order a true zero-starter needs them. 34 units, 9
// categories, zero to intermediate (matching Round-Up 3's ceiling).
//
// Unit schema: {id, cat, catUz, title, titleUz, ruleUz,
//   explain:[[en,uz], ...],           -- bilingual explanation paragraphs
//   examples:[[en,uz], ...],
//   mistakeWrong, mistakeRight, mistakeWhy, mistakeWhyUz,
//   quiz:[[question,[4 choices],correctIndex], ...]}

const GRAMMAR = [

{id:"alphabet-first-words", cat:"Foundations", catUz:"Boshlang'ich",
title:"The Alphabet & First Words", titleUz:"Alifbo va birinchi so'zlar",
ruleUz:"Ingliz tilida 26 ta harf bor; avval alohida so'zlarni o'rganing, to'liq gaplar keyinroq keladi.",
explain:[
["English has 26 letters — 5 vowels (A, E, I, O, U) and 21 consonants. Learn to say each letter's name, then start with very short, simple words like 'cat', 'dog', 'sun'.","Ingliz tilida 26 ta harf bor — 5 tasi unli (A, E, I, O, U), 21 tasi undosh. Avval har bir harfning nomini aytishni o'rganing, so'ng 'cat', 'dog', 'sun' kabi juda qisqa so'zlardan boshlang."],
["At the very beginning, don't worry about full sentences — just learn to recognize, say, and spell single words. Full sentences come later, once you learn small connecting words like 'is' and 'have'.","Boshida to'liq gaplar haqida qayg'urmang — faqat alohida so'zlarni tanish, aytish va harflashni o'rganing. To'liq gaplar 'is' va 'have' kabi kichik so'zlarni o'rgangandan keyin keladi."]
],
examples:[["cat","mushuk"],["dog","it"],["sun","quyosh"],["book","kitob"],["pen","ruchka"]],
mistakeWrong:"Trying to memorize whole sentences before knowing single words.",
mistakeRight:"Learn words one at a time first: cat, dog, book — combine them into sentences later.",
mistakeWhy:"Jumping straight to sentences before knowing individual words is overwhelming for a true beginner.",
mistakeWhyUz:"Alohida so'zlarni bilmasdan darhol gaplarga o'tish yangi boshlovchi uchun juda qiyin.",
quiz:[
["How many letters are in the English alphabet?",["24","25","26","27"],2],
["Which of these is a vowel?",["B","C","E","D"],2],
["How do you spell 'cat'?",["K-A-T","C-A-T","S-A-T","C-A-P"],1],
["'Mushuk' in English is ___.",["Dog","Cat","Sun","Book"],1],
["'Kitob' in English is ___.",["Pen","Dog","Book","Cat"],2],
["What should you learn first, before full sentences?",["Grammar rules","Single words","Long stories","Questions"],1]
]},

{id:"personal-pronouns", cat:"Foundations", catUz:"Boshlang'ich",
title:"I, You, He, She, It, We, They", titleUz:"I, you, he, she, it, we, they",
ruleUz:"Ega olmoshlari kishi yoki narsa o'rniga ishlatiladi: men, sen/siz, u (erkak), u (ayol), u (narsa), biz, ular.",
explain:[
["We use a short word instead of repeating a name: 'Aziz' becomes 'he', 'Malika' becomes 'she', a thing or animal becomes 'it'.","Ismni takrorlash o'rniga qisqa so'z ishlatamiz: 'Aziz' — 'he', 'Malika' — 'she', narsa yoki hayvon — 'it' bo'ladi."],
["'He' is for a man or boy, 'she' is for a woman or girl, 'it' is for a thing, animal, or place. 'We' is you + others, 'they' is other people or things.","'He' — erkak yoki o'g'il bola uchun, 'she' — ayol yoki qiz bola uchun, 'it' — narsa, hayvon yoki joy uchun. 'We' — siz va boshqalar, 'they' — boshqa odamlar yoki narsalar."]
],
examples:[["I am a student.","Men o'quvchiman."],["You are my friend.","Siz mening do'stimsiz."],["He is my brother.","U mening akam."],["She is my sister.","U mening opam."],["It is a cat.","Bu mushuk."]],
mistakeWrong:"Using 'he' for a girl or 'she' for a boy.",
mistakeRight:"He = a boy/man. She = a girl/woman.",
mistakeWhy:"Uzbek 'u' works for everyone; English forces you to choose he/she/it based on who or what you mean.",
mistakeWhyUz:"O'zbekcha 'u' hammaga mos keladi; ingliz tilida esa kimni yoki nimani nazarda tutayotganingizga qarab he/she/it dan birini tanlash kerak.",
quiz:[
["Choose the pronoun for a boy.",["She","He","It","They"],1],
["Choose the pronoun for a girl.",["He","She","It","We"],1],
["Choose the pronoun for a cat.",["He","She","It","You"],2],
["'Ular' in English is ___.",["We","They","You","It"],1],
["Choose the pronoun for yourself.",["You","He","I","It"],2],
["'Biz' in English is ___.",["They","We","You","He"],1]
]},

{id:"to-be", cat:"Foundations", catUz:"Boshlang'ich",
title:"The Verb 'To Be' — am / is / are", titleUz:"'To Be' fe'li — am / is / are",
ruleUz:"I bilan am, he/she/it bilan is, you/we/they bilan are ishlatiladi.",
explain:[
["'To be' connects 'I/you/he...' to a name, a feeling, or a description: I am Aziz. She is happy. They are students.","'To be' 'I/you/he...' ni ism, his-tuyg'u yoki tasvir bilan bog'laydi: I am Aziz. She is happy. They are students."],
["Use: I am (I'm), you/we/they are (you're/we're/they're), he/she/it is (he's/she's/it's). Negative: is not (isn't), are not (aren't).","Qo'llanishi: I am (I'm), you/we/they are (you're/we're/they're), he/she/it is (he's/she's/it's). Inkor: is not (isn't), are not (aren't)."]
],
examples:[["I am a student.","Men o'quvchiman."],["You are kind.","Siz mehribonsiz."],["He is happy.","U xursand."],["We are friends.","Biz do'stmiz."],["They are not late.","Ular kech qolishmagan."]],
mistakeWrong:"He happy. They student.",
mistakeRight:"He is happy. They are students.",
mistakeWhy:"Uzbek doesn't need a separate linking word here ('u xursand' has no extra verb), so learners forget 'to be' — but English never skips it.",
mistakeWhyUz:"O'zbek tilida bunday bog'lovchi so'z shart emas ('u xursand' da qo'shimcha fe'l yo'q), shuning uchun o'quvchilar 'to be' ni unutib qo'yishadi — lekin ingliz tilida uni hech qachon tashlab bo'lmaydi.",
quiz:[
["Choose the correct word: 'She ___ happy.'",["am","is","are","be"],1],
["Choose the correct word: 'They ___ students.'",["am","is","are","be"],2],
["Choose the correct word: 'I ___ Aziz.'",["am","is","are","be"],0],
["What is the negative of 'He is happy'?",["He isn't happy.","He aren't happy.","He amn't happy.","He not happy."],0],
["Choose the correct word: 'We ___ friends.'",["am","is","are","be"],2],
["Short form of 'I am' is ___.",["I's","I'm","I'r","Im'"],1]
]},

{id:"a-an", cat:"Foundations", catUz:"Boshlang'ich",
title:"A / An", titleUz:"A / An",
ruleUz:"Undosh tovush bilan boshlanuvchi so'zdan oldin 'a', unli tovush bilan boshlanuvchidan oldin 'an' ishlatiladi.",
explain:[
["Use 'a' before a word that starts with a consonant sound: a cat, a dog, a book. Use 'an' before a word that starts with a vowel sound: an apple, an egg, an orange.","Undosh tovush bilan boshlanuvchi so'zdan oldin 'a' ishlatiladi: a cat, a dog, a book. Unli tovush bilan boshlanuvchidan oldin 'an' ishlatiladi: an apple, an egg, an orange."],
["This is about the SOUND, not just the letter: 'an hour' (silent h, sounds like a vowel), 'a university' (sounds like 'yoo', a consonant sound).","Bu harfga emas, balki TOVUSHGA bog'liq: 'an hour' (h talaffuz qilinmaydi, unli tovushdek eshitiladi), 'a university' ('yoo' kabi eshitiladi, undosh tovush)."]
],
examples:[["a cat","bir mushuk"],["an apple","bir olma"],["a book","bir kitob"],["an egg","bir tuxum"],["a dog","bir it"]],
mistakeWrong:"a apple, an cat",
mistakeRight:"an apple, a cat",
mistakeWhy:"Learners often go by the letter instead of the sound, or forget the article completely since Uzbek has none at all.",
mistakeWhyUz:"O'quvchilar ko'pincha tovush o'rniga harfga qarab tanlashadi, yoki artiklni umuman tushirib qoldirishadi, chunki o'zbek tilida artikl umuman yo'q.",
quiz:[
["Choose the correct article: '___ apple'",["A","An","The","No article"],1],
["Choose the correct article: '___ cat'",["A","An","The","No article"],0],
["Choose the correct article: '___ egg'",["A","An","The","No article"],1],
["Choose the correct article: '___ book'",["A","An","The","No article"],0],
["Choose the correct sentence.",["I have a apple.","I have an apple.","I have the apple a.","I have apple a."],1],
["What decides a vs an?",["The first letter always","The first sound","The last letter","The word's length"],1]
]},

{id:"plurals", cat:"Foundations", catUz:"Boshlang'ich",
title:"Plural Nouns", titleUz:"Ko'plik otlar",
ruleUz:"Ko'pchilik otlarga -s qo'shiladi; ba'zilariga -es, -ies, -ves; ba'zi so'zlar butunlay o'zgaradi.",
explain:[
["Most nouns just add -s: cat → cats, book → books. Words ending in -s, -sh, -ch, -x, or -o often add -es: bus → buses, box → boxes.","Ko'pchilik otlarga shunchaki -s qo'shiladi: cat → cats, book → books. -s, -sh, -ch, -x yoki -o bilan tugagan so'zlarga ko'pincha -es qo'shiladi: bus → buses, box → boxes."],
["Words ending in consonant + y change y to ies: baby → babies. Some words are completely irregular: child → children, man → men, mouse → mice, sheep → sheep (no change).","Undosh + y bilan tugagan so'zlarda y harfi ies ga o'zgaradi: baby → babies. Ba'zi so'zlar butunlay istisno: child → children, man → men, mouse → mice, sheep → sheep (o'zgarmaydi)."]
],
examples:[["one cat, two cats","bitta mushuk, ikkita mushuk"],["one box, two boxes","bitta quti, ikkita quti"],["one baby, two babies","bitta chaqaloq, ikkita chaqaloq"],["one child, two children","bitta bola, ikkita bola"],["one sheep, two sheep","bitta qo'y, ikkita qo'y"]],
mistakeWrong:"two mans, two childs, two sheeps",
mistakeRight:"two men, two children, two sheep",
mistakeWhy:"Uzbek plurals always just add one ending ('-lar'); English has several patterns plus irregular words with no ending rule at all.",
mistakeWhyUz:"O'zbek tilida ko'plik doim bitta qo'shimcha bilan yasaladi ('-lar'); ingliz tilida esa bir nechta qoida va hech qanday qoidaga bo'ysunmaydigan istisno so'zlar bor.",
quiz:[
["What is the plural of 'cat'?",["Cates","Cats","Cat's","Catss"],1],
["What is the plural of 'box'?",["Boxs","Boxes","Box's","Boxies"],1],
["What is the plural of 'baby'?",["Babys","Babies","Baby's","Babyes"],1],
["What is the plural of 'child'?",["Childs","Childes","Children","Childies"],2],
["What is the plural of 'sheep'?",["Sheeps","Sheep","Sheepes","Sheepies"],1],
["What is the plural of 'man'?",["Mans","Men","Manes","Mens"],1]
]},

{id:"this-that", cat:"Foundations", catUz:"Boshlang'ich",
title:"This / That / These / Those", titleUz:"This / That / These / Those",
ruleUz:"Yaqindagi bitta narsa uchun 'this', uzoqdagi bitta narsa uchun 'that'; ko'plikda 'these' va 'those'.",
explain:[
["Use 'this' for one thing near you, 'that' for one thing far away: This is my pen. That is your book.","Yoningizdagi bitta narsa uchun 'this', uzoqdagi bitta narsa uchun 'that' ishlatiladi: This is my pen. That is your book."],
["Use 'these' for more than one thing near you, 'those' for more than one thing far away: These are my pens. Those are your books.","Yoningizdagi bir nechta narsa uchun 'these', uzoqdagi bir nechta narsa uchun 'those' ishlatiladi: These are my pens. Those are your books."]
],
examples:[["This is my pen.","Bu mening ruchkam."],["That is your book.","Ana u sizning kitobingiz."],["These are my pens.","Bular mening ruchkalarim."],["Those are your books.","Analar sizning kitoblaringiz."],["This is a cat.","Bu mushuk."]],
mistakeWrong:"This are my pens. (mixing singular 'this' with plural verb)",
mistakeRight:"These are my pens.",
mistakeWhy:"Uzbek 'bu/ana u' doesn't change for singular/plural, so learners forget that English switches to 'these/those' for more than one thing.",
mistakeWhyUz:"O'zbekcha 'bu/ana u' birlik/ko'plik uchun o'zgarmaydi, shuning uchun o'quvchilar ingliz tilida bir nechta narsa uchun 'these/those' ga o'tish kerakligini unutishadi.",
quiz:[
["Choose the word for one thing near you.",["That","This","These","Those"],1],
["Choose the word for many things far away.",["This","That","These","Those"],3],
["Choose the correct sentence.",["This are my pens.","These are my pens.","This is my pens.","These is my pens."],1],
["Choose the word for one thing far away.",["This","That","These","Those"],1],
["Choose the correct sentence.",["That is my book.","Those is my book.","That are my book.","Those am my book."],0],
["Choose the word for many things near you.",["This","That","These","Those"],2]
]},

{id:"have-got", cat:"Foundations", catUz:"Boshlang'ich",
title:"Have / Have Got", titleUz:"Have / Have Got",
ruleUz:"Egalikni bildirish uchun I/you/we/they bilan 'have', he/she/it bilan 'has' ishlatiladi.",
explain:[
["To say what you own or what something has, use 'have' with I/you/we/they and 'has' with he/she/it: I have a dog. She has a cat.","Nimaga egalik qilishingizni aytish uchun I/you/we/they bilan 'have', he/she/it bilan 'has' ishlatiladi: I have a dog. She has a cat."],
["British English often adds 'got': I have got a dog / I've got a dog — this means exactly the same as 'I have a dog'. Negative: haven't/hasn't (got).","Britaniya ingliz tilida ko'pincha 'got' qo'shiladi: I have got a dog / I've got a dog — bu 'I have a dog' bilan bir xil ma'noni bildiradi. Inkor: haven't/hasn't (got)."]
],
examples:[["I have a dog.","Mening itim bor."],["She has a cat.","Uning mushugi bor."],["We have got two books.","Bizda ikkita kitob bor."],["He hasn't got a pen.","Uning ruchkasi yo'q."],["Do you have a sister?","Sizda opa-singil bormi?"]],
mistakeWrong:"She have a cat. He don't has a pen.",
mistakeRight:"She has a cat. He doesn't have a pen.",
mistakeWhy:"Learners forget that 'have' changes to 'has' for he/she/it, the same -s rule as other present simple verbs.",
mistakeWhyUz:"O'quvchilar he/she/it bilan 'have' ning 'has' ga o'zgarishini unutishadi — bu boshqa present simple fe'llaridagi -s qoidasi bilan bir xil.",
quiz:[
["Choose the correct word: 'She ___ a cat.'",["have","has","having","haves"],1],
["Choose the correct word: 'I ___ a dog.'",["has","have","having","haves"],1],
["Choose the correct negative: 'He ___ a pen.'",["don't have","doesn't have","not have","haven't has"],1],
["'Bizda ikkita kitob bor' in English is ___.",["We has two books.","We have two books.","We having two books.","We haves two books."],1],
["Choose the correct question.",["Does you have a sister?","Do you have a sister?","Have you a sister do?","You have a sister?"],1],
["Short form of 'I have got' is ___.",["I've got","I's got","I'm got","I'r got"],0]
]},

{id:"possessives", cat:"Foundations", catUz:"Boshlang'ich",
title:"Possessive Adjectives & Pronouns", titleUz:"Egalik olmoshlari",
ruleUz:"my/your/his/her/its/our/their otdan oldin, mine/yours/his/hers/ours/theirs esa otsiz, mustaqil ishlatiladi.",
explain:[
["Possessive adjectives go before a noun to show who owns it: my book, your pen, his sister, her brother, our house, their car.","Egalik sifatlari otdan oldin kelib, kimga tegishli ekanini bildiradi: my book, your pen, his sister, her brother, our house, their car."],
["Possessive pronouns replace the noun completely, with no noun after them: This book is mine. That pen is yours. We also add 's to a name to show ownership: Aziz's book.","Egalik olmoshlari otni to'liq almashtiradi, ulardan keyin ot kelmaydi: This book is mine. That pen is yours. Ismga egalikni bildirish uchun 's qo'shiladi: Aziz's book."]
],
examples:[["This is my book.","Bu mening kitobim."],["That is her brother.","Ana u uning akasi."],["This book is mine.","Bu kitob meniki."],["That pen is yours.","Ana u ruchka sizniki."],["This is Aziz's book.","Bu Azizning kitobi."]],
mistakeWrong:"This is her brother (talking about a boy's brother).",
mistakeRight:"This is his brother.",
mistakeWhy:"Uzbek uses one word for 'his/her'; English requires choosing based on the owner's gender, not the object's.",
mistakeWhyUz:"O'zbek tilida 'uning' bitta so'z; ingliz tilida esa egasi kimligiga (o'g'il yoki qiz) qarab tanlash kerak.",
quiz:[
["Choose the correct possessive: 'This is Aziz. ___ book is red.'",["Her","His","Its","Their"],1],
["Choose the correct possessive pronoun.",["This book is my.","This book is mine.","This book is me.","This book is I."],1],
["'Bizning uyimiz' in English is ___.",["Our house","Their house","Its house","Your house"],0],
["Choose the correct possessive: 'Aziz ___ book is on the table.'",["is","'s","s'","its"],1],
["Choose the correct sentence.",["That pen is your.","That pen is yours.","That pen is you.","That pen is yourself."],1],
["Choose the correct possessive for a girl's toy.",["His toy","Her toy","Its toy","Their toy"],1]
]},

{id:"can", cat:"Commands & Ability", catUz:"Buyruq va qobiliyat",
title:"Can — Ability & Permission", titleUz:"Can — qobiliyat va ruxsat",
ruleUz:"'Can' qobiliyatni (nimani qila olishingizni) va ruxsatni bildiradi; shaklini hech qachon o'zgartirmaydi.",
explain:[
["'Can' shows ability — something you know how to do: I can swim. She can sing. The negative is 'can't': He can't fly.","'Can' qobiliyatni bildiradi — nimani qila olishingizni: I can swim. She can sing. Inkor shakli 'can't': He can't fly."],
["'Can' also asks for permission: Can I go out? Or makes a polite request: Can you help me? 'Can' never changes form (no -s) and is always followed by the plain verb.","'Can' shuningdek ruxsat so'rash uchun ham ishlatiladi: Can I go out? Yoki odobli so'rov: Can you help me? 'Can' hech qachon shaklini o'zgartirmaydi (-s qo'shilmaydi) va undan keyin doim fe'lning oddiy shakli keladi."]
],
examples:[["I can swim.","Men suza olaman."],["She can sing well.","U yaxshi qo'shiq ayta oladi."],["Can I go out?","Chiqsam bo'ladimi?"],["He can't fly.","U ucha olmaydi."],["Can you help me?","Menga yordam bera olasizmi?"]],
mistakeWrong:"She can sings. He cans swim.",
mistakeRight:"She can sing. He can swim.",
mistakeWhy:"Learners often add -s to 'can' or to the verb after it, copying the present simple rule — but modal verbs like 'can' never change and are always followed by the plain verb.",
mistakeWhyUz:"O'quvchilar ko'pincha present simple qoidasiga o'xshatib 'can' ga yoki undan keyingi fe'lga -s qo'shishadi — lekin 'can' kabi modal fe'llar hech qachon o'zgarmaydi va undan keyin fe'lning oddiy shakli keladi.",
quiz:[
["Choose the correct sentence.",["She can sings.","She can sing.","She cans sing.","She can singing."],1],
["Which sentence shows permission?",["I can swim.","Can I go out?","She can dance.","He can't fly."],1],
["Choose the correct negative.",["He not can fly.","He can't fly.","He don't can fly.","He cann't fly."],1],
["Choose the correct question.",["Can you to help me?","Can you help me?","You can help me?","Do you can help me?"],1],
["'Suza olaman' in English is ___.",["I can swims.","I can swim.","I cans swim.","I am can swim."],1],
["What follows 'can'?",["to + verb","the plain verb","verb + ing","verb + s"],1]
]},

{id:"imperatives", cat:"Commands & Ability", catUz:"Buyruq va qobiliyat",
title:"The Imperative", titleUz:"Buyruq gap (Imperativ)",
ruleUz:"Buyruq berish uchun fe'lning oddiy shakli 'I' yoki 'you' so'zisiz ishlatiladi; inkor uchun 'Don't' qo'shiladi.",
explain:[
["To give an instruction, use the plain verb with no subject: Open the door. Sit down. Listen carefully.","Ko'rsatma berish uchun fe'lning oddiy shakli, egasiz ishlatiladi: Open the door. Sit down. Listen carefully."],
["For a negative instruction, add 'Don't' before the verb: Don't run. Don't talk. Use 'Let's' to suggest doing something together: Let's go!","Salbiy ko'rsatma uchun fe'ldan oldin 'Don't' qo'shiladi: Don't run. Don't talk. Birgalikda biror ish qilishni taklif qilish uchun 'Let's' ishlatiladi: Let's go!"]
],
examples:[["Open the door.","Eshikni oching."],["Sit down, please.","O'tiring, iltimos."],["Don't run in the classroom.","Sinfda yugurmang."],["Listen carefully.","Diqqat bilan tinglang."],["Let's go to the park.","Keling, parkka boraylik."]],
mistakeWrong:"You open the door. You don't run.",
mistakeRight:"Open the door. Don't run.",
mistakeWhy:"Uzbek imperatives change the verb ending and can feel like they include the subject; English imperatives drop the subject completely.",
mistakeWhyUz:"O'zbek tilida buyruq fe'l oxiri o'zgaradi va egani o'z ichiga olgandek tuyuladi; ingliz tilida esa ega butunlay tushiriladi.",
quiz:[
["Choose the correct imperative.",["You open the door.","Open the door.","You opening the door.","Opens the door."],1],
["Choose the correct negative imperative.",["You don't run.","Don't run.","No run.","Not run."],1],
["Choose the correct suggestion.",["Let's to go!","Let's go!","Let we go!","Lets going!"],1],
["Which sentence is an imperative?",["She opens the door.","Open the door.","She is opening the door.","Did she open the door?"],1],
["Choose the correct sentence.",["Don't to talk.","Don't talk.","Not talk.","No talking you."],1],
["What form of the verb is used in an imperative?",["Past form","Plain form","-ing form","to + verb"],1]
]},

{id:"there-is-are", cat:"Existence & Quantity", catUz:"Mavjudlik va miqdor",
title:"There is / There are", titleUz:"There is / There are",
ruleUz:"Birlik va sanalmaydigan otlar bilan 'There is', ko'plik otlar bilan 'There are' ishlatiladi.",
explain:[
["We use 'There is' with one thing and 'There are' with more than one thing, to say something exists: There is a book on the table. There are two pens.","Bitta narsa bilan 'There is', bir nechta narsa bilan 'There are' ishlatiladi va biror narsaning mavjudligini bildiradi: There is a book on the table. There are two pens."],
["Negative: There isn't / There aren't. Question: Is there...? / Are there...? Short answers: Yes, there is. / No, there aren't.","Inkor: There isn't / There aren't. Savol: Is there...? / Are there...? Qisqa javob: Yes, there is. / No, there aren't."]
],
examples:[["There is a book on the table.","Stolda kitob bor."],["There are two pens in my bag.","Sumkamda ikkita ruchka bor."],["There isn't any milk.","Sut yo'q."],["Is there a park near your house?","Uyingiz yaqinida park bormi?"],["There are twenty students in my class.","Sinfimda yigirmata o'quvchi bor."]],
mistakeWrong:"There is two pens. There are a book.",
mistakeRight:"There are two pens. There is a book.",
mistakeWhy:"Learners often don't match 'is/are' to singular/plural, since Uzbek's equivalent word 'bor' doesn't change for number.",
mistakeWhyUz:"O'quvchilar ko'pincha 'is/are' ni birlik/ko'plikka moslashtirmaydi, chunki o'zbekcha 'bor' soni bo'yicha o'zgarmaydi.",
quiz:[
["Choose the correct sentence.",["There is two pens.","There are two pens.","There a pens.","Pens there are."],1],
["Choose the correct question.",["Is there a park?","Is there parks?","Are there a park?","There is a park?"],0],
["Choose the correct negative.",["There isn't any milk.","There not any milk.","There doesn't milk.","Milk there isn't."],0],
["Choose the correct sentence.",["There are a book.","There is a book.","There a book is.","Is there a book."],1],
["Choose the correct short answer for 'Are there any pens?' (yes)",["Yes, there is.","Yes, there are.","Yes, it is.","Yes, they are."],1],
["Which form goes with plural nouns?",["There is","There are","There has","There have"],1]
]}
,

{id:"some-any", cat:"Existence & Quantity", catUz:"Mavjudlik va miqdor",
title:"Some / Any & Quantifiers", titleUz:"Some / Any va miqdor so'zlari",
ruleUz:"'Some' tasdiq gaplarda, 'any' inkor va so'roq gaplarda ishlatiladi.",
explain:[
["We use 'some' in positive sentences and offers: I have some bread. Would you like some tea? We use 'any' in negatives and questions: I don't have any bread. Do you have any tea?","'Some' tasdiq gaplar va takliflarda ishlatiladi: I have some bread. Would you like some tea? 'Any' inkor va so'roq gaplarda ishlatiladi: I don't have any bread. Do you have any tea?"],
["For things we can't count (bread, water, tea), we use words like 'a cup of', 'a piece of', 'a loaf of' to count them: a cup of tea, a piece of bread.","Sanalmaydigan narsalar (non, suv, choy) uchun 'a cup of', 'a piece of', 'a loaf of' kabi so'zlar ishlatiladi: a cup of tea, a piece of bread."]
],
examples:[["I have some bread.","Menda biroz non bor."],["I don't have any milk.","Menda sut yo'q."],["Would you like some tea?","Choy ichasizmi?"],["a cup of tea","bir chashka choy"],["a piece of bread","bir bo'lak non"]],
mistakeWrong:"I have any bread. (using 'any' in a positive statement)",
mistakeRight:"I have some bread.",
mistakeWhy:"Learners mix up which word goes with positive sentences and which with negatives/questions.",
mistakeWhyUz:"O'quvchilar qaysi so'z tasdiq gapga, qaysi biri inkor/so'roq gapga mosligini adashtirib yuborishadi.",
quiz:[
["Choose the correct word: 'I don't have ___ money.'",["some","any","a","the"],1],
["Choose the correct word: 'Would you like ___ tea?'",["some","any","much","many"],0],
["'Bir chashka choy' in English is ___.",["a cup of tea","a piece of tea","a loaf of tea","a bottle of tea"],0],
["'Bir bo'lak non' in English is ___.",["a cup of bread","a piece of bread","a glass of bread","an any of bread"],1],
["Choose the correct sentence.",["I have any apples.","I have some apples.","I have a apples.","I have the any apples."],1],
["When do we usually use 'any'?",["In positive sentences","In negatives and questions","Only with people","Never"],1]
]},

{id:"how-much-how-many", cat:"Existence & Quantity", catUz:"Mavjudlik va miqdor",
title:"How Much / How Many", titleUz:"How Much / How Many",
ruleUz:"Sanalmaydigan otlar bilan 'how much', sanaladigan otlar bilan 'how many' ishlatiladi.",
explain:[
["Use 'How much' with things we can't count (money, water, rice): How much money do you have? Use 'How many' with things we can count: How many books do you have?","Sanalmaydigan narsalar (pul, suv, guruch) bilan 'How much' ishlatiladi: How much money do you have? Sanaladigan narsalar bilan 'How many' ishlatiladi: How many books do you have?"],
["Answer with 'a lot of', 'not much', 'not many', or a number: I have a lot of books. I don't have much money.","Javob berish uchun 'a lot of', 'not much', 'not many' yoki son ishlatiladi: I have a lot of books. I don't have much money."]
],
examples:[["How much money do you have?","Sizda qancha pul bor?"],["How many books do you have?","Sizda nechta kitob bor?"],["I have a lot of friends.","Mening ko'p do'stlarim bor."],["I don't have much time.","Mening ko'p vaqtim yo'q."],["I don't have many pens.","Mening ko'p ruchkalarim yo'q."]],
mistakeWrong:"How much books do you have?",
mistakeRight:"How many books do you have?",
mistakeWhy:"Learners use 'how much' for everything, but countable things (books, pens, friends) need 'how many'.",
mistakeWhyUz:"O'quvchilar hamma narsa uchun 'how much' ishlatishadi, lekin sanaladigan narsalar (kitob, ruchka, do'st) uchun 'how many' kerak.",
quiz:[
["Choose the correct word: '___ money do you have?'",["How much","How many","How","What"],0],
["Choose the correct word: '___ books do you have?'",["How much","How many","How","What"],1],
["'Ko'p do'stlarim bor' in English is ___.",["I have a lot of friends.","I have much friends.","I have many of friends.","I have a lot friends."],0],
["Choose the correct sentence.",["I don't have much pens.","I don't have many pens.","I don't have much of pens.","I don't have many of pens."],1],
["Which word goes with uncountable nouns like water?",["many","much","few","a"],1],
["Choose the correct word: 'I don't have ___ time.'",["many","much","a","the"],1]
]},

{id:"articles", cat:"Existence & Quantity", catUz:"Mavjudlik va miqdor",
title:"Articles — a/an, the, or nothing", titleUz:"Artikllar — a/an, the yoki hech narsa",
ruleUz:"Birinchi marta tilga olinayotgan narsa uchun 'a/an', allaqachon ma'lum narsa uchun 'the', ism va umumiy tushunchalar uchun artikl ishlatilmaydi.",
explain:[
["Use 'a/an' for one thing mentioned for the first time. Use 'the' when both people know exactly which one: I have a book. The book is red.","Birinchi marta tilga olinayotgan bitta narsa uchun 'a/an' ishlatiladi. Ikkala tomon ham aynan qaysi narsa haqida gap ketayotganini bilganda 'the' ishlatiladi: I have a book. The book is red."],
["Use no article at all with names, most countries, and general ideas: I live in Uzbekistan. I like music. My name is Aziz.","Ism, ko'pchilik davlat nomlari va umumiy tushunchalar bilan artikl umuman ishlatilmaydi: I live in Uzbekistan. I like music. My name is Aziz."]
],
examples:[["I have a book. The book is red.","Menda kitob bor. Kitob qizil."],["I live in Uzbekistan.","Men O'zbekistonda yashayman."],["I like music.","Men musiqani yoqtiraman."],["My name is Aziz.","Mening ismim Aziz."],["Close the door, please.","Eshikni yoping, iltimos."]],
mistakeWrong:"I live in the Uzbekistan. I like the music.",
mistakeRight:"I live in Uzbekistan. I like music.",
mistakeWhy:"Uzbek has no articles at all, so learners either add 'the' everywhere or forget it everywhere — English uses it only in specific situations.",
mistakeWhyUz:"O'zbek tilida artikl umuman yo'q, shuning uchun o'quvchilar 'the' ni hamma joyga qo'shadi yoki hech qayerga qo'shmaydi.",
quiz:[
["Choose the correct article: 'I have a book. ___ book is red.'",["A","An","The","No article"],2],
["Choose the correct article: 'I live in ___ Uzbekistan.'",["a","an","the","no article"],3],
["Choose the correct article: 'I like ___ music.'",["a","an","the","no article"],3],
["When do we use 'the'?",["For a new thing","When both people know which one","Never","Always"],1],
["Choose the correct sentence.",["My name is the Aziz.","My name is Aziz.","My name is a Aziz.","My name is an Aziz."],1],
["Choose the correct sentence.",["Close a door, please.","Close the door, please.","Close door, please.","Close an door, please."],1]
]},

{id:"indefinite-pronouns", cat:"Existence & Quantity", catUz:"Mavjudlik va miqdor",
title:"Someone, Anyone, Nothing, Nowhere...", titleUz:"Someone, anyone, nothing, nowhere...",
ruleUz:"Someone/something/somewhere tasdiqda, anyone/anything/anywhere so'roq va inkorda, no one/nothing/nowhere o'zi allaqachon inkor.",
explain:[
["'Someone/something/somewhere' are for positive sentences: I can see someone. 'Anyone/anything/anywhere' are for questions and negatives: Is there anyone here? I can't see anyone.","'Someone/something/somewhere' tasdiq gaplarda ishlatiladi: I can see someone. 'Anyone/anything/anywhere' so'roq va inkor gaplarda ishlatiladi: Is there anyone here? I can't see anyone."],
["'No one/nothing/nowhere' already contain a negative meaning, so we don't add 'not': There is nothing in the box (not 'There isn't nothing').","'No one/nothing/nowhere' o'zi allaqachon inkor ma'nosini bildiradi, shuning uchun 'not' qo'shilmaydi: There is nothing in the box ('There isn't nothing' emas)."]
],
examples:[["I can see someone.","Men kimnidir ko'ryapman."],["Is there anyone here?","Bu yerda kimdir bormi?"],["I can't see anyone.","Men hech kimni ko'rmayapman."],["There is nothing in the box.","Qutida hech narsa yo'q."],["I have nowhere to go.","Mening boradigan joyim yo'q."]],
mistakeWrong:"There isn't nothing in the box.",
mistakeRight:"There is nothing in the box.",
mistakeWhy:"Uzbek can combine a negative word with 'yo'q', but English 'nothing' is already negative on its own — adding another negative is a mistake.",
mistakeWhyUz:"O'zbek tilida inkor so'zni 'yo'q' bilan birga ishlatish mumkin, lekin ingliz tilida 'nothing' o'zi allaqachon inkor, yana inkor qo'shish xato hisoblanadi.",
quiz:[
["Choose the correct word: 'I can see ___.' (positive)",["anyone","someone","no one","nothing"],1],
["Choose the correct word: 'Is there ___ here?' (question)",["someone","anyone","no one","something"],1],
["Choose the correct sentence.",["There isn't nothing.","There is nothing.","There isn't anything not.","Nothing isn't there."],1],
["'Hech qayerga' in English is ___.",["Somewhere","Anywhere","Nowhere","Everywhere"],2],
["Choose the correct word: 'I can't see ___.' (negative)",["someone","anyone","no one","something"],1],
["Which word is already negative by itself?",["Someone","Anyone","Nothing","Something"],2]
]}
,

{id:"present-simple", cat:"Present Tenses", catUz:"Hozirgi zamon",
title:"Present Simple", titleUz:"Hozirgi oddiy zamon",
ruleUz:"Odat va faktlar uchun ishlatiladi; he/she/it bilan fe'lga -s qo'shiladi.",
explain:[
["Use the present simple for routines, habits, and things that are always true: I go to school every day. Water boils at 100 degrees.","Odat, kundalik ish va doim to'g'ri bo'lgan narsalar uchun present simple ishlatiladi: I go to school every day. Water boils at 100 degrees."],
["With he/she/it, add -s to the verb: I go → he goes, I watch → she watches. Words like 'always', 'usually', 'sometimes', 'never' say how often.","He/she/it bilan fe'lga -s qo'shiladi: I go → he goes, I watch → she watches. 'Always', 'usually', 'sometimes', 'never' kabi so'zlar qanchalik tez-tez ekanini bildiradi."]
],
examples:[["I go to school every day.","Men har kuni maktabga boraman."],["She goes to school every day.","U har kuni maktabga boradi."],["He watches TV in the evening.","U kechqurun televizor ko'radi."],["I always brush my teeth.","Men doim tishimni yuvaman."],["Water boils at 100 degrees.","Suv 100 gradusda qaynaydi."]],
mistakeWrong:"He go to school. She watch TV.",
mistakeRight:"He goes to school. She watches TV.",
mistakeWhy:"Uzbek verb endings work differently, so learners forget the -s on he/she/it — native speakers notice a missing -s immediately.",
mistakeWhyUz:"O'zbek fe'l qo'shimchalari boshqacha ishlaydi, shuning uchun o'quvchilar he/she/it bilan -s ni unutib qo'yishadi — ingliz tilida so'zlashuvchilar buni darrov sezishadi.",
quiz:[
["Choose the correct sentence.",["He go to school.","He goes to school.","He going to school.","He gos to school."],1],
["Choose the correct sentence.",["She watch TV.","She watches TV.","She watchs TV.","She watching TV."],1],
["'Men har kuni maktabga boraman' in English is ___.",["I goes to school every day.","I go to school every day.","I going to school every day.","I am go to school every day."],1],
["Choose the word that means 'hech qachon'.",["Always","Usually","Sometimes","Never"],3],
["Choose the correct negative.",["He don't go to school.","He doesn't go to school.","He not go to school.","He isn't go to school."],1],
["What do we add to a verb with he/she/it?",["-ing","-ed","-s","-er"],2]
]},

{id:"present-continuous", cat:"Present Tenses", catUz:"Hozirgi zamon",
title:"Present Continuous", titleUz:"Hozirgi davom zamon",
ruleUz:"Hozir sodir bo'layotgan harakat uchun 'am/is/are + fe'l-ing' ishlatiladi.",
explain:[
["Use 'am/is/are + verb-ing' for something happening right now, at this moment: I am reading a book. She is playing football.","Hozir, aynan shu paytda sodir bo'layotgan harakat uchun 'am/is/are + fe'l-ing' ishlatiladi: I am reading a book. She is playing football."],
["Don't use present continuous for things that are always true — those need present simple instead: 'I speak English' (a fact), not 'I am speaking English'. Some verbs (like, know, want, believe) are never used in the -ing form.","Doim to'g'ri bo'lgan narsalar uchun present continuous ishlatilmaydi — ular uchun present simple kerak: 'I speak English' (fakt), 'I am speaking English' emas. Ba'zi fe'llar (like, know, want, believe) hech qachon -ing shaklida ishlatilmaydi."]
],
examples:[["I am reading a book.","Men kitob o'qiyapman."],["She is playing football.","U futbol o'ynayapti."],["What are you doing?","Nima qilyapsiz?"],["They are not listening.","Ular tinglamayapti."],["I speak English.","Men ingliz tilida gaplashaman."]],
mistakeWrong:"I am knowing the answer. I speaking now.",
mistakeRight:"I know the answer. I am speaking now.",
mistakeWhy:"Learners sometimes use present continuous for facts/states (know, like, want), or forget 'am/is/are' entirely before the -ing verb.",
mistakeWhyUz:"O'quvchilar ba'zan faktlar/holatlar (know, like, want) uchun present continuous ishlatishadi, yoki -ing fe'ldan oldin 'am/is/are' ni butunlay unutishadi.",
quiz:[
["Choose the correct sentence about now.",["I read a book now.","I am reading a book now.","I reading a book now.","I reads a book now."],1],
["Choose the correct question.",["What you are doing?","What are you doing?","What doing you are?","Are you what doing?"],1],
["Which verb is NOT usually used in the -ing form?",["Play","Read","Know","Watch"],2],
["Choose the correct negative.",["They not are listening.","They are not listening.","They doesn't listening.","They not listening."],1],
["Choose the correct sentence for a fact.",["I am speaking English. (as a general fact)","I speak English.","I speaking English.","I speaks English."],1],
["What form is the main verb in present continuous?",["Plain form","Past form","-ing form","to + verb"],2]
]}
,

{id:"prepositions-place", cat:"Prepositions & Connectors", catUz:"Predloglar va bog'lovchilar",
title:"Prepositions of Place & Movement", titleUz:"O'rin va harakat predloglari",
ruleUz:"in/on/under/behind/between/next to/in front of/opposite — o'rin; into/out of/through/across — harakat.",
explain:[
["'In' = inside, 'on' = on a surface, 'under' = below, 'behind' = at the back, 'between' = in the middle of two things, 'next to'/'opposite' = beside/facing: The cat is under the table.","'In' — ichida, 'on' — ustida, 'under' — ostida, 'behind' — orqasida, 'between' — ikkitasining orasida, 'next to'/'opposite' — yonida/ro'parasida: The cat is under the table."],
["For movement, use 'into' (entering), 'out of' (leaving), 'through' (from one side to the other), 'across' (from one side to the other, over a surface): She walked into the room.","Harakat uchun 'into' (kirish), 'out of' (chiqish), 'through' (bir tomondan ikkinchi tomonga), 'across' (bir tomondan ikkinchi tomonga, sirt bo'ylab) ishlatiladi: She walked into the room."]
],
examples:[["The cat is under the table.","Mushuk stol ostida."],["The book is on the shelf.","Kitob tokchada."],["The bank is between the shop and the park.","Bank do'kon va park orasida."],["She walked into the room.","U xonaga kirdi."],["He ran across the street.","U ko'chadan yugurib o'tdi."]],
mistakeWrong:"The cat is in the table. (using 'in' for a surface)",
mistakeRight:"The cat is on the table.",
mistakeWhy:"Uzbek uses one general locative ending for many locations, so learners often pick the wrong specific English preposition.",
mistakeWhyUz:"O'zbek tilida ko'p joylar uchun bitta umumiy o'rin qo'shimchasi ishlatiladi, shuning uchun o'quvchilar ingliz tilida noto'g'ri predlog tanlashadi.",
quiz:[
["Choose the correct preposition: 'The book is ___ the table.'",["in","on","under","between"],1],
["Choose the correct preposition: 'The cat is ___ the table.'",["on","under","between","next to"],1],
["Choose the correct preposition: 'The park is ___ the school and the shop.'",["next to","between","opposite","under"],1],
["Choose the correct movement word: 'She walked ___ the room.'",["into","out of","through","across"],0],
["Choose the correct movement word: 'He ran ___ the street.'",["into","out of","through","across"],3],
["Which preposition means 'inside'?",["on","in","under","between"],1]
]},

{id:"prepositions-time", cat:"Prepositions & Connectors", catUz:"Predloglar va bog'lovchilar",
title:"Prepositions of Time", titleUz:"Vaqt predloglari",
ruleUz:"'At' aniq soat, 'on' kun/sana, 'in' oy/yil/fasl bilan ishlatiladi.",
explain:[
["Use 'at' with clock times: at seven o'clock. Use 'on' with days and dates: on Monday, on the fifth of May. Use 'in' with months, years, and seasons: in May, in 2026, in winter.","'At' aniq soat bilan ishlatiladi: at seven o'clock. 'On' kunlar va sanalar bilan ishlatiladi: on Monday, on the fifth of May. 'In' oy, yil va fasllar bilan ishlatiladi: in May, in 2026, in winter."],
["Special time words don't need a preposition at all: today, tomorrow, yesterday, tonight, next week.","Ba'zi maxsus vaqt so'zlariga predlog kerak emas: today, tomorrow, yesterday, tonight, next week."]
],
examples:[["I wake up at seven o'clock.","Men soat yettida uyg'onaman."],["I have class on Monday.","Dushanba kuni darsim bor."],["My birthday is in May.","Tug'ilgan kunim mayda."],["I will see you tomorrow.","Ertaga ko'rishamiz."],["It snows in winter.","Qishda qor yog'adi."]],
mistakeWrong:"I wake up in seven o'clock. My birthday is on May.",
mistakeRight:"I wake up at seven o'clock. My birthday is in May.",
mistakeWhy:"Uzbek doesn't require different prepositions for clock time vs. months vs. days, so learners often mix up at/on/in.",
mistakeWhyUz:"O'zbek tilida soat, oy va kun uchun turli predloglar kerak emas, shuning uchun o'quvchilar at/on/in ni aralashtirib yuborishadi.",
quiz:[
["Choose the correct word: 'I have class ___ Monday.'",["in","on","at","for"],1],
["Choose the correct word: 'My birthday is ___ May.'",["on","in","at","for"],1],
["Choose the correct word: 'School starts ___ eight o'clock.'",["in","on","at","for"],2],
["Choose the correct word: 'It snows ___ winter.'",["on","at","in","for"],2],
["Which time word needs NO preposition?",["Monday","May","Tomorrow","Seven o'clock"],2],
["Choose the correct preposition for a clock time.",["at","in","on","for"],0]
]},

{id:"question-words", cat:"Prepositions & Connectors", catUz:"Predloglar va bog'lovchilar",
title:"Question Words", titleUz:"Savol so'zlari",
ruleUz:"Savol so'zi + yordamchi fe'l + ega + fe'l tartibida savol tuziladi.",
explain:[
["Question words start the question: Who (person), What (thing), Where (place), When (time), Why (reason), How (manner). Word order: question word + do/does/is/are + subject + verb.","Savol so'zlari savolni boshlaydi: Who (kim), What (nima), Where (qayerda), When (qachon), Why (nega), How (qanday). So'z tartibi: savol so'zi + do/does/is/are + ega + fe'l."],
["We can also ask 'How much/many', 'How old', 'What time', and 'Whose' (asking about ownership): Whose book is this?","'How much/many', 'How old', 'What time' va 'Whose' (egalik haqida so'rash) ham ishlatiladi: Whose book is this?"]
],
examples:[["Who is your teacher?","O'qituvchingiz kim?"],["What is your name?","Ismingiz nima?"],["Where do you live?","Qayerda yashaysiz?"],["Why are you late?","Nega kech qoldingiz?"],["Whose book is this?","Bu kimning kitobi?"]],
mistakeWrong:"Where you live? What she like?",
mistakeRight:"Where do you live? What does she like?",
mistakeWhy:"Learners often drop the helping word (do/does/is) after the question word, which English questions always need.",
mistakeWhyUz:"O'quvchilar ko'pincha savol so'zidan keyin yordamchi fe'lni (do/does/is) tushirib qoldirishadi, ingliz tilida esa u har doim kerak.",
quiz:[
["Choose the correct question word for a person.",["What","Where","Who","When"],2],
["Choose the correct question.",["Where you live?","Where do you live?","Do you where live?","Where live you?"],1],
["Choose the correct question word for a reason.",["How","Why","Which","Whose"],1],
["Choose the correct question.",["What does she like?","What she like?","What she likes?","Does what she like?"],0],
["'Bu kimning kitobi?' in English is ___.",["Who book is this?","Whose book is this?","What book is this?","Which is book this?"],1],
["Choose the correct question word for time.",["Where","When","Why","Who"],1]
]},

{id:"conjunctions", cat:"Prepositions & Connectors", catUz:"Predloglar va bog'lovchilar",
title:"And, But, Or, Because", titleUz:"And, but, or, because",
ruleUz:"'And' qo'shish, 'but' qarama-qarshilik, 'or' tanlov, 'because' sabab bildiradi.",
explain:[
["'And' joins two similar ideas: I like tea and coffee. 'But' shows a contrast: I like tea, but I don't like coffee.","'And' ikkita o'xshash fikrni bog'laydi: I like tea and coffee. 'But' qarama-qarshilikni bildiradi: I like tea, but I don't like coffee."],
["'Or' shows a choice: Do you want tea or coffee? 'Because' gives a reason: I stayed home because I was sick.","'Or' tanlovni bildiradi: Do you want tea or coffee? 'Because' sabab bildiradi: I stayed home because I was sick."]
],
examples:[["I like tea and coffee.","Men choy va kofeni yoqtiraman."],["I like tea, but I don't like coffee.","Men choyni yoqtiraman, lekin kofeni yoqtirmayman."],["Do you want tea or coffee?","Choy yoki kofe ichasizmi?"],["I stayed home because I was sick.","Men uyda qoldim, chunki kasal edim."],["She is small but strong.","U kichkina, lekin kuchli."]],
mistakeWrong:"I like tea but coffee. (using 'but' where 'and' is needed)",
mistakeRight:"I like tea and coffee.",
mistakeWhy:"Learners sometimes confuse 'and' (adding) with 'but' (contrasting), especially when translating directly from Uzbek sentence rhythm.",
mistakeWhyUz:"O'quvchilar ba'zan 'and' (qo'shish) va 'but' (qarama-qarshilik) ni adashtirib yuborishadi, ayniqsa o'zbekchadan to'g'ridan-to'g'ri tarjima qilganda.",
quiz:[
["Choose the correct connector: 'I like tea ___ coffee.'",["but","because","and","or"],2],
["Choose the correct connector: 'I like tea, ___ I don't like coffee.'",["and","but","because","or"],1],
["Choose the correct connector: 'I stayed home ___ I was sick.'",["but","because","so","and"],1],
["Choose the correct connector: 'Tea ___ coffee?'",["and","but","or","because"],2],
["Which connector gives a reason?",["and","but","because","or"],2],
["Choose the correct sentence.",["She is small and strong.","She is small but strong.","She is small or strong.","She is small because strong."],1]
]}
,

{id:"gerund-infinitive", cat:"Adjectives & Comparison", catUz:"Sifat va solishtirish",
title:"Like/Love/Hate + -ing, Want + to", titleUz:"Like/Love/Hate + -ing, Want + to",
ruleUz:"'Like/love/hate' dan keyin fe'l+ing, 'want/would like' dan keyin 'to + fe'l' keladi.",
explain:[
["After 'like', 'love', and 'hate', we use a verb + -ing (this makes the verb act like a noun): I like swimming. She loves dancing. He hates cleaning.","'Like', 'love', 'hate' dan keyin fe'l + ing ishlatiladi (bu fe'lni ot kabi qiladi): I like swimming. She loves dancing. He hates cleaning."],
["After 'want' and 'would like', we use 'to' + the plain verb: I want to play. I would like to go home.","'Want' va 'would like' dan keyin 'to' + fe'lning oddiy shakli keladi: I want to play. I would like to go home."]
],
examples:[["I like swimming.","Men suzishni yoqtiraman."],["She loves dancing.","U raqsga tushishni yaxshi ko'radi."],["He hates cleaning.","U tozalashni yomon ko'radi."],["I want to play football.","Men futbol o'ynashni xohlayman."],["I would like to go home.","Men uyga borishni xohlardim."]],
mistakeWrong:"I like to swim always. I want playing football.",
mistakeRight:"I like swimming. I want to play football.",
mistakeWhy:"Learners mix up which pattern (-ing or to+verb) goes with which verb — there's no single rule, each verb has its own pattern to learn.",
mistakeWhyUz:"O'quvchilar qaysi qolip (-ing yoki to+fe'l) qaysi fe'lga mosligini adashtirib yuborishadi — yagona qoida yo'q, har bir fe'lning o'z qolipi bor.",
quiz:[
["Choose the correct sentence.",["I like to swim always.","I like swimming.","I like swims.","I liking swim."],1],
["Choose the correct sentence.",["I want playing football.","I want play football.","I want to play football.","I wants to play football."],2],
["Choose the correct sentence.",["She loves to dancing.","She loves dancing.","She love dancing.","She loving dance."],1],
["'Men uyga borishni xohlardim' in English is ___.",["I would like going home.","I would like to go home.","I would like go home.","I want going home."],1],
["What follows 'hate'?",["to + verb","verb + ing","plain verb","verb + s"],1],
["What follows 'want'?",["to + verb","verb + ing","plain verb","verb + s"],0]
]},

{id:"adjectives-adverbs", cat:"Adjectives & Comparison", catUz:"Sifat va solishtirish",
title:"Adjectives & Adverbs of Manner", titleUz:"Sifatlar va ravishlar",
ruleUz:"Sifat otni tasvirlaydi, ravish esa fe'lni; ko'pchilik ravishlar sifat + ly bilan yasaladi.",
explain:[
["An adjective describes a noun: a happy boy, a fast car. It goes before the noun or after 'to be': She is happy.","Sifat otni tasvirlaydi: a happy boy, a fast car. U otdan oldin yoki 'to be' dan keyin keladi: She is happy."],
["An adverb describes a verb — how something happens. Most adverbs add -ly to the adjective: happy → happily, careful → carefully. Some are irregular: good → well, fast → fast, hard → hard.","Ravish fe'lni tasvirlaydi — biror narsa qanday sodir bo'lishini bildiradi. Ko'pchilik ravishlar sifatga -ly qo'shib yasaladi: happy → happily, careful → carefully. Ba'zilari istisno: good → well, fast → fast, hard → hard."]
],
examples:[["She is a happy girl.","U baxtli qiz."],["She sings happily.","U baxtli tarzda qo'shiq aytadi."],["He is a careful driver.","U ehtiyotkor haydovchi."],["He drives carefully.","U ehtiyotkorlik bilan haydaydi."],["She is a good singer. She sings well.","U yaxshi qo'shiqchi. U yaxshi qo'shiq aytadi."]],
mistakeWrong:"She sings happy. He drives careful.",
mistakeRight:"She sings happily. He drives carefully.",
mistakeWhy:"Learners often use the adjective form where an adverb (describing the verb) is needed.",
mistakeWhyUz:"O'quvchilar ko'pincha fe'lni tasvirlash uchun ravish kerak bo'lgan joyda sifatni ishlatib yuborishadi.",
quiz:[
["Choose the adjective.",["Happily","Happy","Carefully","Well"],1],
["Choose the adverb.",["Happy","Careful","Carefully","Good"],2],
["Choose the correct sentence.",["She sings happy.","She sings happily.","She singing happily.","She happily sing."],1],
["What is the adverb form of 'good'?",["Goodly","Well","Gooder","Good"],1],
["Choose the correct sentence.",["He is a careful driver.","He is a carefully driver.","He drives careful.","He driver carefully."],0],
["Most adverbs are formed by adding ___ to an adjective.",["-s","-ing","-ly","-er"],2]
]},

{id:"comparatives", cat:"Adjectives & Comparison", catUz:"Sifat va solishtirish",
title:"Comparatives & Superlatives", titleUz:"Solishtirish va eng ustunlik darajasi",
ruleUz:"Qisqa sifatlarga -er/-est, uzun sifatlarga more/the most qo'shiladi; ba'zi so'zlar istisno.",
explain:[
["For short adjectives, add -er to compare two things and -est (with 'the') to compare three or more: tall → taller → the tallest.","Qisqa sifatlarga ikkitani solishtirish uchun -er, uchta va undan ortiqni solishtirish uchun 'the' bilan -est qo'shiladi: tall → taller → the tallest."],
["For longer adjectives, use 'more' and 'the most': more beautiful, the most beautiful. Some are irregular: good → better → the best, bad → worse → the worst. Use 'as...as' to say two things are equal: She is as tall as her brother.","Uzunroq sifatlarda 'more' va 'the most' ishlatiladi: more beautiful, the most beautiful. Ba'zilari istisno: good → better → the best, bad → worse → the worst. Ikki narsa teng ekanini aytish uchun 'as...as' ishlatiladi: She is as tall as her brother."]
],
examples:[["He is taller than me.","U mendan balandroq."],["She is the tallest in the class.","U sinfda eng baland bo'yli."],["This book is more interesting.","Bu kitob qiziqarliroq."],["This is the best day of my life.","Bu hayotimdagi eng yaxshi kun."],["She is as tall as her brother.","U akasi kabi baland."]],
mistakeWrong:"This book is more good. She is the intelligentest.",
mistakeRight:"This book is better. She is the most intelligent.",
mistakeWhy:"Learners sometimes add 'more' to short adjectives that need -er, or -est to long adjectives that need 'the most' — and irregular words follow neither rule.",
mistakeWhyUz:"O'quvchilar ba'zan qisqa sifatlarga 'more' qo'shishadi (holbuki -er kerak), yoki uzun sifatlarga -est qo'shishadi (holbuki 'the most' kerak) — istisno so'zlar esa hech qaysi qoidaga bo'ysunmaydi.",
quiz:[
["Choose the correct comparative for 'tall'.",["More tall","Taller","Tallest","The taller"],1],
["Choose the correct superlative for 'tall'.",["Taller","Tallest","The tallest","More tall"],2],
["Choose the correct comparative for 'beautiful'.",["Beautifuller","More beautiful","The beautiful","Beautifulest"],1],
["Choose the correct comparative form of 'good'.",["Gooder","Better","More good","Best"],1],
["Choose the correct sentence.",["She is as tall than her brother.","She is as tall as her brother.","She is so tall as her brother.","She is tall as her brother."],1],
["Which word do we add before a superlative?",["a","an","the","some"],2]
]}
,

{id:"past-be", cat:"Past Tenses", catUz:"O'tgan zamon",
title:"Past Simple — Was / Were", titleUz:"Past Simple — Was / Were",
ruleUz:"I/he/she/it bilan 'was', you/we/they bilan 'were' ishlatiladi.",
explain:[
["'Was' is the past of 'am/is' (I/he/she/it), and 'were' is the past of 'are' (you/we/they): I was tired. They were happy.","'Was' — 'am/is' ning o'tgan zamoni (I/he/she/it uchun), 'were' — 'are' ning o'tgan zamoni (you/we/they uchun): I was tired. They were happy."],
["We also use 'there was/there were' for the past of 'there is/there are': There was a book on the table. There were three cats.","'There is/there are' ning o'tgan zamoni uchun 'there was/there were' ishlatiladi: There was a book on the table. There were three cats."]
],
examples:[["I was tired yesterday.","Men kecha charchagan edim."],["They were happy.","Ular xursand edi."],["There was a book on the table.","Stolda kitob bor edi."],["There were three cats.","Uchta mushuk bor edi."],["She wasn't at school.","U maktabda emas edi."]],
mistakeWrong:"They was happy. There was three cats.",
mistakeRight:"They were happy. There were three cats.",
mistakeWhy:"Learners often use 'was' for every subject, forgetting that 'were' is needed for you/we/they and plural 'there were'.",
mistakeWhyUz:"O'quvchilar ko'pincha har bir ega uchun 'was' ishlatishadi, you/we/they va ko'plik 'there were' uchun 'were' kerakligini unutishadi.",
quiz:[
["Choose the correct word: 'I ___ tired.'",["was","were","am","is"],0],
["Choose the correct word: 'They ___ happy.'",["was","were","is","am"],1],
["Choose the correct sentence.",["There was three cats.","There were three cats.","There is three cats.","There are three cats yesterday."],1],
["Choose the correct negative.",["She weren't at school.","She wasn't at school.","She isn't at school yesterday.","She not was at school."],1],
["Choose the correct word: 'We ___ at the park.'",["was","were","is","am"],1],
["What is the past of 'there is'?",["there was","there were","there be","there is"],0]
]},

{id:"past-regular", cat:"Past Tenses", catUz:"O'tgan zamon",
title:"Past Simple — Regular Verbs", titleUz:"Past Simple — qoidali fe'llar",
ruleUz:"Qoidali fe'llarga -ed qo'shiladi; savol va inkorda -ed ishlatilmaydi.",
explain:[
["Regular verbs add -ed for the past: play → played, watch → watched. Words ending in -e just add -d: like → liked. Words ending in consonant+y change to -ied: study → studied.","Qoidali fe'llarga o'tgan zamon uchun -ed qo'shiladi: play → played, watch → watched. -e bilan tugagan so'zlarga faqat -d qo'shiladi: like → liked. Undosh+y bilan tugagan so'zlarda y -ied ga o'zgaradi: study → studied."],
["Negative: 'didn't + plain verb' (I didn't play). Question: 'Did + subject + plain verb?' (Did you play?) — never add -ed in negatives or questions.","Inkor: 'didn't + oddiy fe'l' (I didn't play). Savol: 'Did + ega + oddiy fe'l?' (Did you play?) — inkor va savolda hech qachon -ed qo'shilmaydi."]
],
examples:[["I played football yesterday.","Men kecha futbol o'ynadim."],["She studied English last night.","U kecha kechqurun ingliz tilini o'qidi."],["We didn't watch TV.","Biz televizor ko'rmadik."],["Did you play chess?","Shaxmat o'ynadingizmi?"],["He liked the movie.","Unga film yoqdi."]],
mistakeWrong:"I didn't played. Did you played chess?",
mistakeRight:"I didn't play. Did you play chess?",
mistakeWhy:"Learners often add -ed even after 'did/didn't', but the plain verb (no -ed) is used there.",
mistakeWhyUz:"O'quvchilar ko'pincha 'did/didn't' dan keyin ham -ed qo'shishadi, lekin u yerda fe'lning oddiy shakli ishlatiladi.",
quiz:[
["What is the past tense of 'play'?",["Played","Player","Playing","Plays"],0],
["What is the past tense of 'study'?",["Studyed","Studied","Studies","Studying"],1],
["Choose the correct negative.",["I didn't played.","I didn't play.","I not played.","I doesn't play."],1],
["Choose the correct question.",["Did you played chess?","Did you play chess?","Do you played chess?","Were you play chess?"],1],
["What is the past tense of 'like'?",["Liked","Likeed","Likied","Likes"],0],
["Choose the correct sentence.",["She studied English.","She studyed English.","She studies English yesterday.","She studying English."],0]
]},

{id:"past-irregular", cat:"Past Tenses", catUz:"O'tgan zamon",
title:"Past Simple — Irregular Verbs", titleUz:"Past Simple — istisno fe'llar",
ruleUz:"Ko'plab keng tarqalgan fe'llar -ed qoidasiga bo'ysunmaydi va butunlay o'zgaradi.",
explain:[
["Many common English verbs don't follow the -ed rule — they change completely: go → went, eat → ate, have → had, see → saw, do → did.","Ko'plab keng tarqalgan ingliz fe'llari -ed qoidasiga bo'ysunmaydi — ular butunlay o'zgaradi: go → went, eat → ate, have → had, see → saw, do → did."],
["There's no shortcut — you memorize these through practice. The negative and question forms still use 'didn't'/'did' + the plain verb: I didn't go, Did you go?","Bu yerda yo'l yo'q — bularni mashq orqali yodlash kerak. Inkor va savol shakllarida hali ham 'didn't'/'did' + fe'lning oddiy shakli ishlatiladi: I didn't go, Did you go?"]
],
examples:[["I went to school.","Men maktabga bordim."],["She ate breakfast.","U nonushta qildi."],["We had a good time.","Biz yaxshi vaqt o'tkazdik."],["He saw a bird.","U qush ko'rdi."],["They did their homework.","Ular uy vazifasini bajarishdi."]],
mistakeWrong:"I goed to school. I eated breakfast.",
mistakeRight:"I went to school. I ate breakfast.",
mistakeWhy:"Learners often regularize irregular verbs by analogy with the -ed rule, since that's the pattern they learn first.",
mistakeWhyUz:"O'quvchilar ko'pincha istisno fe'llarni -ed qoidasiga o'xshatib to'g'irlab yuborishadi, chunki bu ular birinchi o'rgangan qoida.",
quiz:[
["What is the past tense of 'go'?",["Goed","Went","Gone","Going"],1],
["What is the past tense of 'eat'?",["Eated","Ate","Eaten","Eating"],1],
["What is the past tense of 'have'?",["Haved","Had","Haves","Having"],1],
["What is the past tense of 'see'?",["Seed","Saw","Seen","Seeing"],1],
["What is the past tense of 'do'?",["Doed","Did","Done","Doing"],1],
["Choose the correct sentence.",["She goed to the park.","She went to the park.","She go to the park yesterday.","She going to the park."],1]
]},

{id:"past-continuous", cat:"Past Tenses", catUz:"O'tgan zamon",
title:"Past Continuous", titleUz:"Past Continuous",
ruleUz:"O'tmishda ma'lum bir vaqtda davom etayotgan harakat uchun 'was/were + fe'l-ing' ishlatiladi.",
explain:[
["Use 'was/were + verb-ing' for an action that was in progress at a certain time in the past: At 8 PM, I was doing my homework.","O'tmishda ma'lum bir vaqtda davom etayotgan harakat uchun 'was/were + fe'l-ing' ishlatiladi: At 8 PM, I was doing my homework."],
["We often combine it with past simple using 'when': I was sleeping when the phone rang — the long action (sleeping) was interrupted by a short one (rang).","Ko'pincha 'when' bilan past simple bilan birga ishlatiladi: I was sleeping when the phone rang — uzoq harakat (sleeping) qisqa harakat (rang) bilan bo'lib yuboriladi."]
],
examples:[["I was doing my homework at 8 PM.","Men soat 20:00 da uy vazifamni bajarayotgan edim."],["I was sleeping when the phone rang.","Telefon jiringlaganda men uxlayotgan edim."],["They were playing football.","Ular futbol o'ynayotgan edi."],["What were you doing last night?","Kecha kechqurun nima qilayotgan edingiz?"],["She wasn't listening.","U tinglamayotgan edi."]],
mistakeWrong:"When you called, I slept. (using simple past for an interrupted ongoing action)",
mistakeRight:"When you called, I was sleeping.",
mistakeWhy:"Learners often use simple past for everything, missing the 'action already in progress' meaning that past continuous carries.",
mistakeWhyUz:"O'quvchilar ko'pincha hamma narsa uchun oddiy o'tgan zamonni ishlatishadi, past continuous bildiradigan 'allaqachon davom etayotgan harakat' ma'nosini o'tkazib yuborishadi.",
quiz:[
["Choose the correct sentence.",["I was sleeping when you called.","I sleep when you called.","I slept when you calling.","I sleeping when you called."],0],
["Choose the correct past continuous form for 'they'.",["was playing","were playing","is playing","are playing"],1],
["What does past continuous show?",["A finished single action","An action in progress at a past time","A general fact","A future plan"],1],
["Choose the correct question.",["What were you doing?","What was you doing?","What you were doing?","Were you what doing?"],0],
["Choose the correct sentence.",["While I was cooking, the phone rang.","While I cooking, the phone rang.","While I cook, the phone rang.","While I was cook, the phone rang."],0],
["What is the negative of 'She was working'?",["She wasn't working.","She isn't working.","She didn't working.","She not working."],0]
]}
,

{id:"modals", cat:"Modals & Future", catUz:"Modal va kelajak",
title:"Must, Have to, Should, May, Could", titleUz:"Must, have to, should, may, could",
ruleUz:"'Must/have to' majburiyat, 'mustn't' taqiq, 'should' maslahat, 'may/could' ruxsat va imkoniyat bildiradi.",
explain:[
["'Must' and 'have to' show obligation: Students must wear a uniform. 'Mustn't' means forbidden: You mustn't run here. 'Don't have to' means not necessary: You don't have to come.","'Must' va 'have to' majburiyatni bildiradi: Students must wear a uniform. 'Mustn't' — taqiqlangan degani: You mustn't run here. 'Don't have to' — zarur emas degani: You don't have to come."],
["'Should' gives friendly advice (softer than must): You should study more. 'May' and 'could' ask politely for permission or show possibility: May I go out? It could rain today.","'Should' do'stona maslahat beradi (must dan yumshoqroq): You should study more. 'May' va 'could' odobli ruxsat so'rash yoki imkoniyatni bildirish uchun ishlatiladi: May I go out? It could rain today."]
],
examples:[["Students must wear a uniform.","O'quvchilar forma kiyishlari shart."],["You mustn't run in the classroom.","Sinfda yugurmasligingiz kerak."],["You don't have to come if you're busy.","Agar band bo'lsangiz, kelishingiz shart emas."],["You should study every day.","Siz har kuni o'qishingiz kerak."],["May I go out, please?","Chiqsam bo'ladimi, iltimos?"]],
mistakeWrong:"You mustn't come if you're busy. (meant as 'not necessary')",
mistakeRight:"You don't have to come if you're busy.",
mistakeWhy:"Learners often confuse 'mustn't' (forbidden) with 'don't have to' (not necessary) — these mean very different things.",
mistakeWhyUz:"O'quvchilar ko'pincha 'mustn't' (taqiqlangan) bilan 'don't have to' (zarur emas) ni adashtirib yuborishadi — bularning ma'nosi butunlay boshqacha.",
quiz:[
["What does 'mustn't' mean?",["Not necessary","Forbidden","Optional","Recommended"],1],
["What does 'don't have to' mean?",["Forbidden","Not necessary","Impossible","Required"],1],
["Choose the softer word for friendly advice.",["Must","Have to","Should","Mustn't"],2],
["Choose the correct sentence for a strict rule.",["Students should wear a uniform.","Students must wear a uniform.","Students can wear a uniform.","Students like a uniform."],1],
["Choose the correct way to ask permission politely.",["Must I go out?","May I go out?","Should I go out?","Have I go out?"],1],
["Choose the word for possibility.",["Must","Mustn't","Could","Have to"],2]
]},

{id:"future", cat:"Modals & Future", catUz:"Modal va kelajak",
title:"The Future — Going to / Will / Shall", titleUz:"Kelajak — Going to / Will / Shall",
ruleUz:"'Going to' oldindan qaror qilingan reja uchun, 'will' spontan qaror va bashorat uchun ishlatiladi.",
explain:[
["Use 'am/is/are + going to + verb' for plans already decided: I am going to visit my grandmother tomorrow. Use 'will' for decisions made right now, promises, and predictions: I'll help you. I think it will rain.","Oldindan qaror qilingan rejalar uchun 'am/is/are + going to + fe'l' ishlatiladi: I am going to visit my grandmother tomorrow. Hozir qabul qilingan qaror, va'da va bashorat uchun 'will' ishlatiladi: I'll help you. I think it will rain."],
["'Shall' is used mostly for offers and suggestions with I/we: Shall I open the window? Shall we go?","'Shall' asosan I/we bilan taklif va tavsiya uchun ishlatiladi: Shall I open the window? Shall we go?"]
],
examples:[["I am going to visit my grandmother.","Men buvimga borishni rejalashtiryapman."],["I think it will rain tomorrow.","Menimcha, ertaga yomg'ir yog'adi."],["I'll help you with your homework.","Men uy vazifangizda sizga yordam beraman."],["Shall I open the window?","Derazani ochaymi?"],["What are you going to do this weekend?","Bu dam olish kunlari nima qilmoqchisiz?"]],
mistakeWrong:"I will visit my grandmother tomorrow. (for a plan already decided days ago)",
mistakeRight:"I am going to visit my grandmother tomorrow.",
mistakeWhy:"Learners often use 'will' for everything; English prefers 'going to' for plans decided before the moment of speaking.",
mistakeWhyUz:"O'quvchilar ko'pincha hamma narsa uchun 'will' ishlatishadi; ingliz tilida esa oldindan qaror qilingan rejalar uchun 'going to' afzal ko'riladi.",
quiz:[
["Choose the correct sentence about a decided plan.",["I go to visit my aunt.","I am going to visit my aunt.","I going to visit my aunt.","I will going to visit my aunt."],1],
["'The phone is ringing!' — choose the spontaneous decision.",["I'm going to answer it.","I'll answer it.","I answer it.","I answered it."],1],
["Choose the correct question about plans.",["What you are going to do?","What are you going to do?","What going you to do?","Are what you going to do?"],1],
["Choose the correct offer.",["Shall I open the window?","Will I open the window?","Going I open the window?","Do I shall open the window?"],0],
["'Look at those clouds! It ___ rain.'",["will","is going to","go to","going"],1],
["Which form is better for a plan decided before now?",["will","going to","can","must"],1]
]}
,

{id:"present-perfect", cat:"Advanced", catUz:"Ilg'or",
title:"Present Perfect", titleUz:"Present Perfect",
ruleUz:"Aniq vaqtni aytmasdan hayotiy tajriba yoki yaqinda sodir bo'lgan voqea uchun 'have/has + past participle' ishlatiladi.",
explain:[
["Use 'have/has + past participle' for life experiences without saying exactly when, or recent events: I have visited Turkey. She has just finished her homework.","Aniq vaqtni aytmasdan hayotiy tajriba yoki yaqinda sodir bo'lgan voqea uchun 'have/has + past participle' ishlatiladi: I have visited Turkey. She has just finished her homework."],
["Use 'for' with a length of time and 'since' with a starting point: for five years, since 2023. Never use present perfect with a specific past time word like 'yesterday' — use past simple instead.","'For' vaqt oralig'i, 'since' boshlanish nuqtasi bilan ishlatiladi: for five years, since 2023. Present perfect'ni 'yesterday' kabi aniq o'tgan vaqt so'zi bilan hech qachon ishlatmang — buning uchun past simple kerak."]
],
examples:[["I have visited Turkey.","Men Turkiyaga borganman."],["Have you ever eaten sushi?","Hech sushi yeganmisiz?"],["She has just finished her homework.","U hozirgina uy vazifasini tugatdi."],["We have lived here for five years.","Biz bu yerda besh yildan beri yashaymiz."],["He hasn't called me yet.","U menga hali qo'ng'iroq qilmadi."]],
mistakeWrong:"I have visited Turkey last year. (mixing present perfect with a specific past time)",
mistakeRight:"I visited Turkey last year.",
mistakeWhy:"Uzbek doesn't separate 'a finished action at a stated time' from 'an experience at some unstated time' the way English does.",
mistakeWhyUz:"O'zbek tilida 'aniq vaqtda tugallangan harakat' bilan 'noaniq vaqtdagi tajriba' ingliz tilidagidek ajratilmaydi.",
quiz:[
["Choose the correct question about experience.",["Did you ever visit London?","Have you ever visited London?","Do you ever visited London?","Are you ever visiting London?"],1],
["Choose the correct word for a period of time.",["since","for","ever","yet"],1],
["Choose the correct word for a starting point.",["since","for","already","yet"],0],
["Choose the correct sentence.",["I have already finished my homework.","I have finished already my homework.","I already have finished my homework.","I have finished my homework already yet."],0],
["Which time word should NOT be used with present perfect?",["ever","already","yesterday","just"],2],
["Choose the correct sentence.",["She has went there.","She has gone there.","She has go there.","She have gone there."],1]
]},

{id:"conditionals", cat:"Advanced", catUz:"Ilg'or",
title:"Conditionals — If Sentences", titleUz:"Shart gaplar — If sentences",
ruleUz:"Zero: umumiy haqiqat (if+present, present). First: haqiqiy kelajak (if+present, will). Second: xayoliy (if+past, would).",
explain:[
["Zero conditional states general truths: If you heat ice, it melts. First conditional talks about real future possibilities: If you study, you will pass.","Zero conditional umumiy haqiqatlarni bildiradi: If you heat ice, it melts. First conditional haqiqiy kelajak imkoniyati haqida: If you study, you will pass."],
["Second conditional talks about imaginary or unlikely situations, using past tense in the if-clause and 'would': If I won the lottery, I would travel the world. We use 'were' for all subjects: If I were you, I would study more.","Second conditional xayoliy yoki ehtimoli kam vaziyatlar haqida, if-qismida o'tgan zamon va 'would' ishlatiladi: If I won the lottery, I would travel the world. Barcha egalar bilan 'were' ishlatiladi: If I were you, I would study more."]
],
examples:[["If you heat ice, it melts.","Agar muzni isitsangiz, u eriydi."],["If you study, you will pass the exam.","Agar o'qisangiz, imtihondan o'tasiz."],["If I won the lottery, I would travel the world.","Agar lotereyada yutsam, dunyo bo'ylab sayohat qilardim."],["If I were you, I would study more.","Men sizning o'rningizda bo'lsam, ko'proq o'qirdim."],["If it rains, we won't go out.","Agar yomg'ir yog'sa, tashqariga chiqmaymiz."]],
mistakeWrong:"If I win the lottery, I would travel. (mixing present tense with 'would')",
mistakeRight:"If I won the lottery, I would travel.",
mistakeWhy:"Learners often keep the if-clause in present tense out of habit, forgetting the second conditional needs past tense there even though it's about an imaginary present/future.",
mistakeWhyUz:"O'quvchilar ko'pincha odat bo'yicha if-qismini hozirgi zamonda qoldirishadi, second conditional u yerda o'tgan zamon talab qilishini unutishadi.",
quiz:[
["Choose the correct zero conditional.",["If you heat ice, it melted.","If you heat ice, it melts.","If you heat ice, it will melt.","If you heated ice, it melts."],1],
["Choose the correct first conditional.",["If you study, you pass.","If you study, you will pass.","If you will study, you pass.","If you studied, you will pass."],1],
["Choose the correct second conditional.",["If I win the lottery, I will travel.","If I won the lottery, I would travel.","If I win the lottery, I would travel.","If I would win, I travel."],1],
["Choose the correct sentence with 'if I were you'.",["If I was you, I would study.","If I were you, I would study.","If I am you, I would study.","If I were you, I will study."],1],
["Which tense goes in the if-clause of a first conditional?",["will + verb","present simple","past simple","past perfect"],1],
["Zero conditional is used for:",["Imaginary situations","General truths and facts","Past events","Polite requests"],1]
]},

{id:"passive-voice", cat:"Advanced", catUz:"Ilg'or",
title:"The Passive Voice", titleUz:"Majhul nisbat (Passive Voice)",
ruleUz:"Harakatni kim bajarganidan ko'ra harakatning o'zi muhimroq bo'lganda 'ega + be + past participle' qolipi ishlatiladi.",
explain:[
["We use the passive voice when the action itself matters more than who did it: English is spoken worldwide. Form: subject + am/is/are (present) or was/were (past) + past participle.","Harakatni kim bajarganidan ko'ra harakatning o'zi muhimroq bo'lganda passive voice ishlatiladi: English is spoken worldwide. Qolip: ega + am/is/are (hozirgi) yoki was/were (o'tgan) + past participle."],
["Add 'by + person' only if it's important to say who did it: This song was written by a famous singer.","Kim bajargani muhim bo'lsagina 'by + shaxs' qo'shiladi: This song was written by a famous singer."]
],
examples:[["English is spoken worldwide.","Ingliz tili butun dunyoda gapiriladi."],["The telephone was invented by Bell.","Telefon Bell tomonidan ixtiro qilingan."],["This book was written in 1990.","Bu kitob 1990 yilda yozilgan."],["Rice is grown in many countries.","Guruch ko'p davlatlarda yetishtiriladi."],["The windows are cleaned every week.","Derazalar har hafta tozalanadi."]],
mistakeWrong:"English speaks worldwide. (using the active form for a passive meaning)",
mistakeRight:"English is spoken worldwide.",
mistakeWhy:"Uzbek passive forms work differently, so learners sometimes keep the active verb form even when the subject isn't doing the action.",
mistakeWhyUz:"O'zbek tilida majhul nisbat boshqacha ishlaydi, shuning uchun o'quvchilar ega harakatni bajarmasa ham faol fe'l shaklini ishlatib qo'yishadi.",
quiz:[
["Choose the correct passive sentence.",["English speaks worldwide.","English is spoken worldwide.","English spoken worldwide.","English is speaking worldwide."],1],
["Choose the correct passive statement.",["America discovered by Columbus.","America was discovered by Columbus.","America discover by Columbus.","America is discover by Columbus."],1],
["When do we use the passive voice?",["When the doer is more important","When the action is more important than the doer","Only in questions","Only in the future"],1],
["Choose the correct passive form.",["This house built in 1990.","This house was built in 1990.","This house is build in 1990.","This house builded in 1990."],1],
["What is the passive voice formula?",["subject + verb + object","subject + be + past participle","subject + have + past participle","subject + do + verb"],1],
["Choose the correct passive sentence.",["Rice grows in many countries.","Rice is grown in many countries.","Rice growing in many countries.","Rice is grow in many countries."],1]
]},

{id:"relative-clauses", cat:"Advanced", catUz:"Ilg'or",
title:"Relative Clauses", titleUz:"Nisbiy gaplar",
ruleUz:"Odamlar uchun 'who', narsalar uchun 'which', ikkalasi uchun 'that', egalik uchun 'whose' ishlatiladi.",
explain:[
["Relative clauses give more information about a noun without starting a new sentence: The girl who sits next to me is my cousin. Use 'who' for people, 'which' for things, 'that' for either (informal).","Nisbiy gaplar yangi gap boshlamasdan ot haqida qo'shimcha ma'lumot beradi: The girl who sits next to me is my cousin. Odamlar uchun 'who', narsalar uchun 'which', ikkalasi uchun 'that' (norasmiy) ishlatiladi."],
["Use 'whose' to show possession: That's the boy whose father is a doctor. Use 'where' for places: This is the school where I studied.","Egalikni bildirish uchun 'whose' ishlatiladi: That's the boy whose father is a doctor. Joylar uchun 'where' ishlatiladi: This is the school where I studied."]
],
examples:[["The girl who sits next to me is my cousin.","Yonimda o'tirgan qiz mening amakivachcham."],["This is the book which I read last week.","Bu men o'tgan hafta o'qigan kitob."],["That's the boy whose father is a doctor.","Bu — otasi shifokor bo'lgan bola."],["This is the school where I studied.","Bu men o'qigan maktab."],["A teacher is a person who helps students.","O'qituvchi — o'quvchilarga yordam beradigan shaxs."]],
mistakeWrong:"The man which lives next door is a doctor. (using 'which' for a person)",
mistakeRight:"The man who lives next door is a doctor.",
mistakeWhy:"Learners sometimes mix up 'who' (people) and 'which' (things), since Uzbek connecting words don't make this same distinction.",
mistakeWhyUz:"O'quvchilar ba'zan 'who' (odamlar) va 'which' (narsalar) ni adashtirib yuborishadi, chunki o'zbek tilida bunday farq yo'q.",
quiz:[
["Choose the correct relative pronoun for a person.",["Which","Where","Who","When"],2],
["Choose the correct relative pronoun for a place.",["Who","Which","Where","Whose"],2],
["Choose the correct sentence.",["A doctor is a person which helps sick people.","A doctor is a person who helps sick people.","A doctor is a person where helps sick people.","A doctor is a person whose helps sick people."],1],
["Choose the correct relative pronoun for possession.",["Who","Which","Where","Whose"],3],
["Choose the correct sentence.",["This is the book who I read.","This is the book which I read.","This is the book where I read.","This is the book whose I read."],1],
["What do relative clauses do?",["Start a brand new sentence","Give more information about a noun","Only work in questions","Replace the subject entirely"],1]
]}

];

if (typeof module !== "undefined") module.exports = GRAMMAR;
