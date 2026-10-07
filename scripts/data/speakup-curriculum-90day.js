// SpeakUp curriculum — 90 days, 18 weeks, built on the deduplicated
// Round-Up 1/2/3 grammar sequence in grammar.js (see that file's header).
// All 34 grammar points are introduced by Day 60; Days 61-90 apply that
// complete toolkit to thematic vocabulary and fluency practice rather than
// introducing new grammar.
//
// Pedagogy note (fixes the "how does a zero-starter know 'I have' means
// anything?" problem from the previous version): a day's vocabulary examples
// either (a) use ONLY formulaic chunks explicitly taught as memorized
// patterns (never silently assumed), or (b) use grammar already formally
// taught in an earlier day's grammar tip. Every grammar tip that introduces
// a chunk says so explicitly in Uzbek — "bu qolipni yodlab oling, to'liq
// qoidasini keyinroq o'rganamiz" (memorize this pattern, we'll learn the
// full rule later) — so nothing is assumed silently.
//
// Day schema (normal day): {d,w,wt,wtUz,t,tu,v,dl,g,qz,sp,ls}
//   v: vocabulary, [en, uz, exampleSentenceContainingWord]
//   g: grammar/pattern tip, [titleEn, bodyEn, titleUz, bodyUz]
//   qz: quiz, [question, [4 choices], correctIndex]
//   sp: speaking prompt, [en, uz]
//   ls: live-session extras, [warmupEn, warmupUz, pairworkEn, pairworkUz]
// Review day (every 5th day): {d,w,wt,wtUz,rev:true,t,tu,qz,sp,ls} (no v/dl/g)

const CURRICULUM = [

{d:1,w:1,wt:"First Steps in English",wtUz:"Ingliz tiliga birinchi qadam",
t:"Greetings & Introducing Yourself",tu:"Salomlashish va o'zingizni tanishtirish",
v:[
["Hello / Hi","Salom","Hello! My name is Aziz."],
["Good morning","Xayrli tong","Good morning, teacher!"],
["Good afternoon","Xayrli kun","Good afternoon, everyone."],
["Good evening","Xayrli kech","Good evening, Mrs. Alice."],
["Goodbye","Xayr","Goodbye! See you soon."],
["Please","Iltimos","Open the door, please."],
["Thank you","Rahmat","Thank you very much!"],
["Sorry","Kechirasiz","Sorry, I am late."],
["Yes","Ha","Yes, thank you."],
["No","Yo'q","No, thank you."],
["My name is...","Mening ismim...","My name is Dilnoza."],
["What's your name?","Ismingiz nima?","What's your name, my friend?"],
["Nice to meet you","Tanishganimdan xursandman","Nice to meet you, Sardor!"],
["How are you?","Qalaysiz?","How are you today?"],
["I'm fine","Yaxshiman","I'm fine, thank you."]
],
dl:[
["Aziz","Hello! My name is Aziz.","Salom! Mening ismim Aziz."],
["Malika","Hi, Aziz! I'm Malika. Nice to meet you.","Salom, Aziz! Men Malikaman. Tanishganimdan xursandman."],
["Aziz","Nice to meet you too. How are you?","Men ham xursandman. Qalaysiz?"],
["Malika","I'm fine, thank you. And you?","Yaxshiman, rahmat. Sizchi?"],
["Aziz","I'm fine too. Goodbye!","Men ham yaxshiman. Xayr!"],
["Malika","Goodbye, Aziz!","Xayr, Aziz!"]
],
g:["Greetings Are Fixed Phrases",
"'Hello', 'Good morning', 'Nice to meet you' and 'How are you?' are whole phrases people say without thinking about grammar — just memorize each one as one chunk, the same way you already know Uzbek greetings. We'll start looking at how English words and sentences are actually built starting tomorrow.",
"Salomlashish — tayyor iboralar",
"'Hello', 'Good morning', 'Nice to meet you' va 'How are you?' — bularning barchasi grammatikani o'ylamasdan aytiladigan tayyor iboralar; ularni xuddi o'zbekcha salomlashuv so'zlarini bilganingizdek, bitta butun bo'lak sifatida yodlab oling. Ingliz so'zlari va gaplari qanday tuzilishini ertagadan boshlab o'rganamiz."],
qz:[
["How do you say 'Salom' in English?",["Goodbye","Hello","Sorry","No"],1],
["What do you say when someone helps you?",["Sorry","Goodbye","Thank you","No"],2],
["What is the opposite of 'Yes'?",["No","Please","Sorry","Hello"],0],
["Choose the correct reply to 'How are you?'",["My name is Aziz.","I'm fine, thank you.","Nice to meet you.","Goodbye."],1]
],
sp:["Introduce yourself to a partner: say hello, your name, and ask how they are.","Sherigingizga o'zingizni tanishtiring: salomlashing, ismingizni ayting va ahvolini so'rang."],
ls:["Stand up and greet 3 classmates using different greetings.","O'rningizdan turing va 3 nafar sinfdoshingizni turli salomlashish iboralari bilan salomlang.",
"In pairs, act out meeting for the first time: greet, introduce your name, ask 'How are you?', and say goodbye.","Juftlikda birinchi marta uchrashuvni ijro eting: salomlashing, ismingizni ayting, 'Qalaysiz?' deb so'rang va xayrlashing."]
},

{d:2,w:1,wt:"First Steps in English",wtUz:"Ingliz tiliga birinchi qadam",
t:"The Alphabet & Spelling",tu:"Alifbo va harflash",
v:[
["letter","harf","A, B, C — three letters."],
["word","so'z","A short word: cat."],
["spell","harflamoq","Spell it: C-A-T."],
["vowel","unli tovush","Five vowels: A, E, I, O, U."],
["consonant","undosh tovush","Some consonants: B, C, D, F."],
["capital letter","bosh harf","A capital letter: A."],
["small letter","kichik harf","A small letter: a."],
["alphabet","alifbo","The alphabet: A to Z, 26 letters."],
["How do you spell...?","...ni qanday harflaysiz?","'How do you spell dog?' — 'D-O-G.'"],
["What does ... mean?","...nima degani?","'What does pencil mean?'"]
],
dl:[
["Teacher","Spell 'cat', please.","Iltimos, 'cat' so'zini harflang."],
["Student","C - A - T.","C - A - T."],
["Teacher","Good! Now spell 'dog'.","Yaxshi! Endi 'dog' so'zini harflang."],
["Student","D - O - G.","D - O - G."],
["Teacher","Point to the vowel: A or B.","Unli harfga ishora qiling: A yoki B."],
["Student","A.","A."]
],
g:["The Alphabet & Spelling",
"English uses 26 letters: 5 vowels (A, E, I, O, U) and 21 consonants. Learn to say and spell each letter. Then, when you meet a new word, ask 'How do you spell...?'",
"Alifbo va harflash",
"Ingliz tilida 26 ta harf bor — 5 tasi unli (A, E, I, O, U), 21 tasi undosh. Har bir harfni aytish va harflashni o'rganing, shunda yangi so'zga duch kelganingizda doim 'Buni qanday harflaysiz?' deb so'ray olasiz."],
qz:[
["How many letters are in the English alphabet?",["24","25","26","27"],2],
["Which of these is a vowel?",["B","C","E","D"],2],
["How do you spell 'cat'?",["K-A-T","C-A-T","S-A-T","C-A-P"],1],
["What should you ask when you don't understand a new word?",["Goodbye.","What does it mean?","Thank you.","Nice to meet you."],1]
],
sp:["Spell your name out loud, letter by letter.","Ismingizni ovoz chiqarib, harflab ayting."],
ls:["Alphabet relay: each student says the next letter of the alphabet.","Alifbo estafetasi: har bir o'quvchi alifbodagi keyingi harfni aytadi.",
"In pairs, take turns spelling classroom words for each other to guess.","Juftlikda navbatma-navbat sinf so'zlarini harflab, bir-biringizga topdiring."]
},

{d:3,w:1,wt:"First Steps in English",wtUz:"Ingliz tiliga birinchi qadam",
t:"Pronouns & The Verb 'To Be'",tu:"Olmoshlar va 'To Be' fe'li",
v:[
["I","men","I am a student."],
["you","siz","You are my friend."],
["he","u (erkak)","He is a boy."],
["she","u (ayol)","She is a girl."],
["it","u (narsa)","It is a book."],
["we","biz","We are students."],
["they","ular","They are teachers."],
["am","(bo'lmoq)","I am happy."],
["is","(bo'lmoq)","She is kind."],
["are","(bo'lmoq)","You are smart."],
["boy","o'g'il bola","He is a boy."],
["girl","qiz bola","She is a girl."],
["teacher","o'qituvchi","She is a teacher."],
["student","o'quvchi","I am a student."],
["friend","do'st","You are my friend."]
],
dl:[
["Teacher","Are you a student?","Siz o'quvchimisiz?"],
["Student","Yes, I am a student. He is my friend.","Ha, men o'quvchiman. U mening do'stim."],
["Teacher","Is he a student too?","U ham o'quvchimi?"],
["Student","Yes, he is a student too. We are friends.","Ha, u ham o'quvchi. Biz do'stmiz."]
],
g:["The Verb 'To Be' — am / is / are",
"Every English sentence needs a verb, even to say who someone is. The verb 'to be' connects 'I/you/he...' to a name or description: use 'am' with I, 'is' with he/she/it, 'are' with you/we/they. I am a student. He is a boy. They are teachers.",
"'To Be' fe'li — am / is / are",
"Har bir ingliz gapida fe'l bo'lishi kerak, hatto kimningdir kimligini aytish uchun ham. 'To be' fe'li 'I/you/he...' ni ism yoki tasvir bilan bog'laydi: I bilan 'am', he/she/it bilan 'is', you/we/they bilan 'are' ishlatiladi. I am a student. He is a boy. They are teachers."],
qz:[
["Choose the correct word: 'She ___ a teacher.'",["am","is","are","be"],1],
["Choose the correct word: 'They ___ students.'",["am","is","are","be"],2],
["Choose the correct word: 'I ___ a student.'",["am","is","are","be"],0],
["'U (erkak) o'quvchi' in English is ___.",["She is a student.","He is a student.","They are a student.","I am a student."],1]
],
sp:["Introduce yourself and 2 friends using I am / He is / She is.","O'zingiz va 2 ta do'stingizni 'I am / He is / She is' bilan tanishtiring."],
ls:["Point at classmates and say 'He is...' or 'She is...' with their name.","Sinfdoshlaringizga ishora qilib, ismini aytib 'He is...' yoki 'She is...' deng.",
"In pairs, describe 3 people in the room using am/is/are.","Juftlikda xonadagi 3 kishini am/is/are yordamida tasvirlang."]
},

{d:4,w:1,wt:"First Steps in English",wtUz:"Ingliz tiliga birinchi qadam",
t:"Naming Things — A / An",tu:"Narsalarni nomlash — A / An",
v:[
["cat","mushuk","It is a cat."],
["dog","it","It is a dog."],
["book","kitob","It is a book."],
["pen","ruchka","It is a pen."],
["bag","sumka","It is a bag."],
["sun","quyosh","It is the sun."],
["apple","olma","It is an apple."],
["egg","tuxum","It is an egg."],
["ball","to'p","It is a ball."],
["hat","shlyapa","It is a hat."]
],
dl:[
["Teacher","What is it?","Bu nima?"],
["Student","It is a book.","Bu kitob."],
["Teacher","Is it a pen?","Bu ruchkami?"],
["Student","No, it is a bag.","Yo'q, bu sumka."],
["Teacher","Good! What is it?","Yaxshi! Bu nima?"],
["Student","It is an apple.","Bu olma."]
],
g:["A / An",
"Now that you know 'it is', use it to name things: 'a' before a word that starts with a consonant sound (a cat, a dog, a book), 'an' before a word that starts with a vowel sound (an apple, an egg). It's about the sound, not just the letter.",
"A / An",
"Endi 'it is' ni bilganingiz uchun, undan narsalarni nomlash uchun foydalaning: undosh tovush bilan boshlanuvchi so'zdan oldin 'a' (a cat, a dog, a book), unli tovush bilan boshlanuvchidan oldin 'an' (an apple, an egg) ishlatiladi. Bu harfga emas, tovushga bog'liq."],
qz:[
["Choose 'a' or 'an': '___ apple'",["a","an","the","some"],1],
["'Mushuk' in English is ___.",["Dog","Cat","Book","Bag"],1],
["Choose the correct pattern to name an object.",["It a book.","It is a book.","It book is.","Is it book."],1],
["Choose 'a' or 'an': '___ egg'",["a","an","the","some"],1]
],
sp:["Point to 5 objects near you and say 'It is a ___' for each one.","Atrofingizdagi 5 ta buyumga ishora qilib, har biri uchun 'It is a ___' deng."],
ls:["Sing the ABC song together as a class.","Sinf bilan birga ABC qo'shig'ini kuylang.",
"In pairs, take turns pointing at objects and asking 'What is it?'","Juftlikda navbatma-navbat buyumlarga ishora qilib 'Bu nima?' deb so'rang."]
},

{d:5,w:1,wt:"First Steps in English",wtUz:"Ingliz tiliga birinchi qadam",
rev:true,t:"Week 1 Review",tu:"1-hafta Takrorlash",
qz:[
["How do you say 'Salom' in English?",["Goodbye","Hello","Sorry","No"],1],
["How many letters are in the English alphabet?",["24","25","26","27"],2],
["Choose the correct word: 'She ___ a teacher.'",["am","is","are","be"],1],
["Choose the correct pattern to name an object.",["It a book.","It is a book.","It book is.","Is it book."],1],
["What is the opposite of 'Yes'?",["No","Please","Sorry","Hello"],0],
["How do you spell 'cat'?",["K-A-T","C-A-T","S-A-T","C-A-P"],1],
["Choose the correct word: 'They ___ students.'",["am","is","are","be"],2],
["Choose 'a' or 'an': '___ apple'",["a","an","the","some"],1]
],
sp:["Introduce yourself, spell your name, then point at things and say what they are using 'It is'.","O'zingizni tanishtiring, ismingizni harflab bering, so'ngra narsalarga ishora qilib ular nima ekanini 'It is' bilan ayting."],
ls:["Quick class quiz: teacher points at a person, letter, or object, students respond fast in English.","Tezkor sinf so'rovi: o'qituvchi odam, harf yoki buyumga ishora qiladi, o'quvchilar tezda ingliz tilida javob beradi.",
"In pairs, review the week: greet each other, say who you are, spell your name, and name objects.","Juftlikda haftani takrorlang: bir-biringizni salomlang, kimligingizni ayting, ismingizni harflang va buyumlarni nomlang."]
},

{d:6,w:2,wt:"Counting & Describing Things",wtUz:"Sanash va narsalarni tasvirlash",
t:"Numbers 1-10 & Plural Nouns",tu:"1 dan 10 gacha sonlar va ko'plik otlar",
v:[
["one","bir","one book"],
["two","ikki","two books"],
["three","uch","three pens"],
["four","to'rt","four apples"],
["five","besh","five hats"],
["box","quti","one box, two boxes"],
["boxes","qutilar","one box, two boxes"],
["baby","chaqaloq","one baby, two babies"],
["babies","chaqaloqlar","one baby, two babies"],
["child","bola","one child, two children"],
["children","bolalar","one child, two children"],
["man","erkak","one man, two men"],
["men","erkaklar","one man, two men"],
["woman","ayol","one woman, two women"],
["women","ayollar","one woman, two women"]
],
dl:[
["Teacher","Count with me: one box, two boxes, three boxes.","Men bilan sanang: one box, two boxes, three boxes."],
["Student","One box, two boxes, three boxes!","One box, two boxes, three boxes!"],
["Teacher","Very good! Now: one child, two children.","Juda yaxshi! Endi: one child, two children."],
["Student","One child, two children!","One child, two children!"]
],
g:["Plural Nouns",
"Most nouns just add -s: box → boxes, cat → cats. Some words are irregular and change completely: child → children, man → men, woman → women. Practice these often, so you remember them.",
"Ko'plik otlar",
"Ko'pchilik otlarga shunchaki -s qo'shiladi: box → boxes, cat → cats. Ba'zi so'zlar butunlay istisno: child → children, man → men, woman → women. Bularni tez-tez mashq qiling, shunda esda qoladi."],
qz:[
["What is the plural of 'box'?",["Boxs","Boxes","Box's","Boxies"],1],
["What is the plural of 'child'?",["Childs","Childes","Children","Childies"],2],
["What is the plural of 'man'?",["Mans","Men","Manes","Mens"],1],
["What is the plural of 'woman'?",["Womans","Women","Woman's","Womenes"],1]
],
sp:["Count 5 things around you, saying each number and whether it's singular or plural.","Atrofingizdagi 5 ta narsani sanang, har bir son va u birlikmi yoki ko'plikmi ekanini ayting."],
ls:["Plural bingo: teacher says a singular word, students shout the plural.","Ko'plik bingo: o'qituvchi birlik so'zni aytadi, o'quvchilar ko'plikni qichqiradi.",
"In pairs, count children, men, and women in a picture using the correct plural.","Juftlikda rasmdagi bola, erkak va ayollarni to'g'ri ko'plik bilan sanang."]
},

{d:7,w:2,wt:"Counting & Describing Things",wtUz:"Sanash va narsalarni tasvirlash",
t:"This / That / These / Those",tu:"This / That / These / Those",
v:[
["this","bu (yaqin)","This is a table."],
["that","ana u (uzoq)","That is a chair."],
["these","bular (yaqin)","These are windows."],
["those","analar (uzoq)","Those are doors."],
["table","stol","This is a table."],
["chair","stul","That is a chair."],
["window","deraza","These are windows."],
["door","eshik","Those are doors."],
["shoe","poyabzal","This is my shoe."],
["shoes","poyabzallar","These are my shoes."]
],
dl:[
["Teacher","Is this a table?","Bu stolmi?"],
["Student","Yes, this is a table.","Ha, bu stol."],
["Teacher","Are those chairs?","Analar stullarmi?"],
["Student","Yes, those are chairs.","Ha, analar stullar."]
],
g:["This / That / These / Those",
"Use 'this' (near, one) and 'these' (near, many): This is a table. These are windows. Use 'that' (far, one) and 'those' (far, many): That is a chair. Those are doors.",
"This / That / These / Those",
"Yaqindagi bitta narsa uchun 'this', yaqindagi bir nechta narsa uchun 'these' ishlatiladi: This is a table. These are windows. Uzoqdagi bitta narsa uchun 'that', uzoqdagi bir nechta narsa uchun 'those' ishlatiladi: That is a chair. Those are doors."],
qz:[
["Choose the word for one thing near you.",["That","This","These","Those"],1],
["Choose the word for many things far away.",["This","That","These","Those"],3],
["Choose the correct sentence.",["This are my shoes.","These are my shoes.","This is my shoes.","These is my shoes."],1],
["'Ana u stul' in English is ___.",["This is a chair.","That is a chair.","These are chairs.","Those are chairs."],1]
],
sp:["Point to 3 things near you and 3 things far away, using this/that/these/those.","Yaqiningizdagi 3 ta va uzoqdagi 3 ta narsaga ishora qiling, this/that/these/those yordamida ayting."],
ls:["Classroom scavenger hunt: point and say 'This is a...' or 'That is a...' for objects.","Sinfda buyum qidirish: buyumlarga ishora qilib 'This is a...' yoki 'That is a...' deng.",
"In pairs, ask 'Is this a...?' and 'Are those...?' about classroom objects.","Juftlikda sinf buyumlari haqida 'Is this a...?' va 'Are those...?' deb so'rang."]
},

{d:8,w:2,wt:"Counting & Describing Things",wtUz:"Sanash va narsalarni tasvirlash",
t:"Have / Has — Pets",tu:"Have / Has — uy hayvonlari",
v:[
["have","bor (I/you/we/they)","I have a dog."],
["has","bor (he/she/it)","She has a cat."],
["don't have","yo'q (I/you/we/they)","I don't have a pet."],
["doesn't have","yo'q (he/she/it)","He doesn't have a bike."],
["pet","uy hayvoni","This is my pet."],
["dog","it","I have a dog."],
["cat","mushuk","She has a cat."],
["fish","baliq","He has a fish."],
["bird","qush","They have a bird."],
["rabbit","quyon","We have a rabbit."]
],
dl:[
["Teacher","Do you have a pet?","Uy hayvoningiz bormi?"],
["Student","Yes, I have a dog. Does she have a pet?","Ha, mening itim bor. Uning uy hayvoni bormi?"],
["Teacher","Yes, she has a cat.","Ha, uning mushugi bor."]
],
g:["Have / Has",
"Use 'have' with I/you/we/they and 'has' with he/she/it: I have a dog. She has a cat. Negative: don't have / doesn't have.",
"Have / Has",
"I/you/we/they bilan 'have', he/she/it bilan 'has' ishlatiladi: I have a dog. She has a cat. Inkor: don't have / doesn't have."],
qz:[
["Choose the correct word: 'She ___ a cat.'",["have","has","having","haves"],1],
["Choose the correct word: 'I ___ a dog.'",["has","have","having","haves"],1],
["Choose the correct negative: 'He ___ a pen.'",["don't have","doesn't have","not have","haven't has"],1],
["Choose the correct question.",["Does you have a sister?","Do you have a sister?","Have you a sister do?","You have a sister?"],1]
],
sp:["Say if you have a pet, and describe your friend's pet using 'has'.","Uy hayvoningiz bor-yo'qligini ayting va do'stingizning uy hayvonini 'has' bilan tasvirlang."],
ls:["Class survey: ask 'Do you have a pet?' and count the answers.","Sinf so'rovi: 'Uy hayvoningiz bormi?' deb so'rang va javoblarni sanang.",
"In pairs, ask about each other's pets.","Juftlikda bir-biringizning uy hayvonlaringiz haqida so'rang."]
},

{d:9,w:2,wt:"Counting & Describing Things",wtUz:"Sanash va narsalarni tasvirlash",
t:"Possessives — my, your, his, her",tu:"Egalik olmoshlari — my, your, his, her",
v:[
["my","mening","This is my mother."],
["your","sizning","This is your book."],
["his","uning (erkak)","This is his sister."],
["her","uning (ayol)","This is her brother."],
["our","bizning","This is our house."],
["their","ularning","This is their car."],
["mother","ona","This is my mother."],
["father","ota","This is my father."],
["sister","opa-singil","This is his sister."],
["brother","aka-uka","This is her brother."]
],
dl:[
["Malika","Is this your mother?","Bu sizning onangizmi?"],
["Aziz","Yes, this is my mother. And this is my father.","Ha, bu mening onam. Bu esa mening otam."],
["Malika","Who is this boy?","Bu bola kim?"],
["Aziz","This is his son.","Bu uning o'g'li."]
],
g:["Possessive Adjectives: my, your, his, her",
"Possessive adjectives go before a noun to show who owns it: my mother, your book, his sister, her brother. 'His' is for a male owner, 'her' is for a female owner.",
"Egalik olmoshlari: my, your, his, her",
"Egalik olmoshlari otdan oldin kelib, kimga tegishli ekanini bildiradi: my mother, your book, his sister, her brother. 'His' — erkak egasi uchun, 'her' — ayol egasi uchun."],
qz:[
["'Mening onam' in English is ___.",["Your mother","My mother","His mother","Her mother"],1],
["Choose the correct possessive for a boy's sister.",["Her sister","His sister","Their sister","Our sister"],1],
["Choose the correct possessive for a girl's brother.",["His brother","Her brother","Its brother","Your brother"],1],
["'Bizning uyimiz' in English is ___.",["Their house","Your house","Our house","Its house"],2]
],
sp:["Introduce your family using my/his/her: This is my mother, this is his/her...","Oilangizni my/his/her yordamida tanishtiring."],
ls:["Show a family photo (or draw one) and name 3 family members using 'my'.","Oila suratini ko'rsating va 'my' yordamida 3 ta oila a'zosini nomlang.",
"In pairs, point at each other's things and practice 'Is this your...?'","Juftlikda bir-biringizning narsalaringizga ishora qilib 'Is this your...?' deb mashq qiling."]
},

{d:10,w:2,wt:"Counting & Describing Things",wtUz:"Sanash va narsalarni tasvirlash",
rev:true,t:"Week 2 Review",tu:"2-hafta Takrorlash",
qz:[
["What is the plural of 'child'?",["Childs","Childes","Children","Childies"],2],
["Choose the word for one thing near you.",["That","This","These","Those"],1],
["Choose the correct word: 'She ___ a cat.'",["have","has","having","haves"],1],
["'Mening onam' in English is ___.",["Your mother","My mother","His mother","Her mother"],1],
["What is the plural of 'man'?",["Mans","Men","Manes","Mens"],1],
["Choose the correct sentence.",["This are my shoes.","These are my shoes.","This is my shoes.","These is my shoes."],1],
["Choose the correct negative: 'He ___ a pen.'",["don't have","doesn't have","not have","haven't has"],1],
["Choose the correct possessive for a boy's sister.",["Her sister","His sister","Their sister","Our sister"],1]
],
sp:["Count some things, point at things near and far, say if you have a pet, and describe your family.","Ba'zi narsalarni sanang, yaqin-uzoqdagi narsalarga ishora qiling, uy hayvoningiz bor-yo'qligini ayting va oilangizni tasvirlang."],
ls:["Class review game: teacher points at people/objects, students respond with the right pattern.","Sinf takrorlash o'yini: o'qituvchi odam/buyumlarga ishora qiladi, o'quvchilar to'g'ri qolip bilan javob beradi.",
"In pairs, review the week: count, name things near/far, describe pets and family.","Juftlikda haftani takrorlang: sanang, yaqin-uzoqdagi narsalarni nomlang, uy hayvoni va oilangizni tasvirlang."]
},

{d:11,w:3,wt:"Actions, Commands & My World",wtUz:"Harakatlar, buyruqlar va mening dunyom",
t:"Can — Ability",tu:"Can — qobiliyat",
v:[
["can","qila oladi","I can swim."],
["can't","qila olmaydi","I can't sing."],
["swim","suzmoq","I can swim."],
["sing","qo'shiq aytmoq","I can sing."],
["dance","raqsga tushmoq","I can dance."],
["draw","rasm chizmoq","I can draw."],
["jump","sakramoq","I can jump."],
["run","yugurmoq","I can run fast."],
["cook","ovqat pishirmoq","My mother can cook."],
["ride a bike","velosiped haydamoq","I can ride a bike."]
],
dl:[
["Malika","Can you swim?","Suza olasizmi?"],
["Aziz","Yes, I can swim. Can you sing?","Ha, men suza olaman. Siz qo'shiq ayta olasizmi?"],
["Malika","No, I can't sing, but I can dance.","Yo'q, men qo'shiq ayta olmayman, lekin raqsga tusha olaman."]
],
g:["Can — Ability",
"'Can' shows something you know how to do: I can swim. She can sing. The negative is 'can't': He can't fly. 'Can' never changes form, no matter who the subject is.",
"Can — qobiliyat",
"'Can' nimani qila olishingizni bildiradi: I can swim. She can sing. Inkor shakli 'can't': He can't fly. 'Can' ega kim bo'lishidan qat'i nazar hech qachon shaklini o'zgartirmaydi."],
qz:[
["Choose the correct sentence.",["She can sings.","She can sing.","She cans sing.","She can singing."],1],
["'Suza olaman' in English is ___.",["I can swims.","I can swim.","I cans swim.","I am can swim."],1],
["Choose the correct negative.",["He not can fly.","He can't fly.","He don't can fly.","He cann't fly."],1],
["What can your mother do? Choose the correct word for cooking.",["She can cook.","She can cooks.","She cans cook.","She can cooking."],0]
],
sp:["Say 3 things you can do and 1 thing you can't do yet.","Qila oladigan 3 ta ishingizni va hali qila olmaydigan 1 ta ishingizni ayting."],
ls:["'Can you...?' mingle: ask classmates what they can do.","'Can you...?' aralashuvi: sinfdoshlaringizdan nima qila olishlarini so'rang.",
"In pairs, find 2 things you can both do.","Juftlikda ikkalangiz ham qila oladigan 2 ta ishni toping."]
},

{d:12,w:3,wt:"Actions, Commands & My World",wtUz:"Harakatlar, buyruqlar va mening dunyom",
t:"The Imperative — Classroom Commands",tu:"Buyruq gap — sinf buyruqlari",
v:[
["open","ochmoq","Open the door."],
["close","yopmoq","Close the window."],
["come here","bu yerga kel","Come here, please."],
["stand up","o'rningdan tur","Stand up, please."],
["sit down","o'tir","Sit down, everyone."],
["listen","tinglamoq","Listen to the teacher."],
["look","qaramoq","Look at the board."],
["be quiet","jim bo'l","Be quiet, please."],
["raise your hand","qo'lingizni ko'taring","Raise your hand if you know the answer."],
["don't run","yugurma","Don't run in the classroom."]
],
dl:[
["Teacher","Good morning, class! Stand up, please.","Xayrli tong, sinf! O'rningizdan turing, iltimos."],
["Students","Good morning, teacher!","Xayrli tong, o'qituvchi!"],
["Teacher","Sit down. Open your book, please.","O'tiring. Kitobingizni oching, iltimos."],
["Student","OK. Now listen, please.","Xo'p. Endi tinglang, iltimos."]
],
g:["The Imperative",
"To give an instruction, use the plain verb with no subject: Open the door. Sit down. Listen. For a negative instruction, add 'Don't': Don't run. Don't talk. This is exactly how the classroom commands you've been hearing since Day 1 are built.",
"Buyruq gap",
"Ko'rsatma berish uchun fe'lning oddiy shakli, egasiz ishlatiladi: Open the door. Sit down. Listen. Salbiy ko'rsatma uchun 'Don't' qo'shiladi: Don't run. Don't talk. 1-kundan beri eshitib kelayotgan sinf buyruqlari aynan shu qoida bilan tuzilgan."],
qz:[
["Choose the correct imperative.",["You open the door.","Open the door.","You opening the door.","Opens the door."],1],
["Choose the correct negative imperative.",["You don't run.","Don't run.","No run.","Not run."],1],
["'O'tir' in English is ___.",["Stand up","Sit down","Come here","Open"],1],
["Which sentence is an imperative?",["She opens the door.","Open the door.","She is opening the door.","Did she open the door?"],1]
],
sp:["Give your partner 3 commands (e.g. 'Stand up', 'Open your book').","Sherigingizga 3 ta buyruq bering."],
ls:["Play 'Simon Says' using classroom commands (stand up, sit down, listen, look).","Sinf buyruqlari bilan 'Simon Says' o'yinini o'ynang.",
"In pairs, one gives 5 commands, the other performs them, then switch.","Juftlikda bir kishi 5 ta buyruq beradi, ikkinchisi bajaradi, so'ngra almashing."]
},

{d:13,w:3,wt:"Actions, Commands & My World",wtUz:"Harakatlar, buyruqlar va mening dunyom",
t:"There is / There are",tu:"There is / There are",
v:[
["there is","bor (birlik)","There is a lamp on the table."],
["there are","bor (ko'plik)","There are two windows."],
["room","xona","There is a nice room."],
["wall","devor","There is a picture on the wall."],
["picture","surat","There is a picture on the wall."],
["lamp","chiroq","There is a lamp on the desk."],
["shelf","tokcha","There is a shelf in my room."],
["two","ikki","There are two windows."],
["three","uch","There are three chairs."],
["four","to'rt","There are four books."]
],
dl:[
["Teacher","Is there a lamp in your room?","Xonangizda chiroq bormi?"],
["Student","Yes, there is a lamp.","Ha, chiroq bor."],
["Teacher","Are there any pictures?","Suratlar bormi?"],
["Student","Yes, there are two pictures.","Ha, ikkita surat bor."]
],
g:["There is / There are",
"Use 'There is' with one thing and 'There are' with more than one thing, to say something exists: There is a lamp on the table. There are two windows.",
"There is / There are",
"Bitta narsa bilan 'There is', bir nechta narsa bilan 'There are' ishlatiladi va biror narsaning mavjudligini bildiradi: There is a lamp on the table. There are two windows."],
qz:[
["Choose the correct sentence.",["There is two windows.","There are two windows.","There a window.","Windows there are."],1],
["Choose the correct question.",["Is there a lamp?","Is there lamps?","Are there a lamp?","There is a lamp?"],0],
["'Devorda surat bor' in English is ___.",["There is a picture on the wall.","There are a picture on the wall.","There a picture is on the wall.","Picture there is on the wall."],0],
["Which form goes with plural nouns?",["There is","There are","There has","There have"],1]
],
sp:["Describe your room: say what there is and how many things there are.","Xonangizni tasvirlab bering: nima borligi va nechtasi borligini ayting."],
ls:["Picture description: show a picture, students say what there is/are.","Rasm tasviri: rasm ko'rsating, o'quvchilar there is/are bilan gapirsin.",
"In pairs, describe your bedroom using 'There is/are'.","Juftlikda yotoqxonangizni 'There is/are' bilan tasvirlang."]
},

{d:14,w:3,wt:"Actions, Commands & My World",wtUz:"Harakatlar, buyruqlar va mening dunyom",
t:"Classroom Objects",tu:"Sinf buyumlari",
v:[
["notebook","daftar","This is my notebook."],
["desk","parta","There is a desk in the classroom."],
["chair","stul","This chair is mine."],
["board","doska","Look at the board."],
["pencil","qalam","I have a pencil."],
["ruler","chizg'ich","This is a ruler."],
["eraser","o'chirg'ich","She has an eraser."],
["schoolbag","maktab sumkasi","These are our schoolbags."],
["classroom","sinf xonasi","There are 20 desks in the classroom."],
["wall clock","devor soati","There is a wall clock on the wall."]
],
dl:[
["Teacher","What is this?","Bu nima?"],
["Student","It's my pencil. And these are my books.","Bu mening qalamim. Bular esa mening kitoblarim."],
["Teacher","How many desks are there in the classroom?","Sinfda nechta parta bor?"],
["Student","There are 20 desks.","20 ta parta bor."]
],
g:["Naming a Group of Things",
"You already know 'this/that/these/those', 'there is/are', and plurals — now use them all together to talk about the things in your classroom: This is my pencil. There are 20 desks. These are our schoolbags.",
"Narsalar guruhini nomlash",
"Siz allaqachon 'this/that/these/those', 'there is/are' va ko'plikni bilasiz — endi ularning barchasidan birgalikda sinfingizdagi narsalar haqida gapirish uchun foydalaning: This is my pencil. There are 20 desks. These are our schoolbags."],
qz:[
["'Daftar' in English is ___.",["Book","Notebook","Pen","Bag"],1],
["'Qalam' in English is ___.",["Pencil","Pen","Ruler","Eraser"],0],
["Choose the correct sentence.",["There is 20 desks.","There are 20 desks.","There a desk.","Desks there are."],1],
["'Bular bizning sumkalarimiz' in English is ___.",["This is our schoolbag.","These are our schoolbags.","That is our schoolbag.","Those is our schoolbags."],1]
],
sp:["Describe 5 things in your classroom using this/that/these/those and there is/are.","Sinfingizdagi 5 ta narsani this/that/these/those va there is/are yordamida tasvirlang."],
ls:["Classroom scavenger hunt: point and name objects using this/that/these/those.","Sinfda buyum qidirish: buyumlarga ishora qilib this/that/these/those bilan nomlang.",
"In pairs, ask 'How many ___ are there?' about classroom objects.","Juftlikda sinf buyumlari haqida 'Nechtasi bor?' deb so'rang."]
},

{d:15,w:3,wt:"Actions, Commands & My World",wtUz:"Harakatlar, buyruqlar va mening dunyom",
rev:true,t:"Week 3 Review — Foundations Check",tu:"3-hafta Takrorlash — Boshlang'ich tekshiruv",
qz:[
["Choose the correct sentence.",["She can sings.","She can sing.","She cans sing.","She can singing."],1],
["Choose the correct imperative.",["You open the door.","Open the door.","You opening the door.","Opens the door."],1],
["Choose the correct sentence.",["There is two windows.","There are two windows.","There a window.","Windows there are."],1],
["'Daftar' in English is ___.",["Book","Notebook","Pen","Bag"],1],
["Choose the correct negative.",["He not can fly.","He can't fly.","He don't can fly.","He cann't fly."],1],
["Choose the correct negative imperative.",["You don't run.","Don't run.","No run.","Not run."],1],
["Choose the correct question.",["Is there a lamp?","Is there lamps?","Are there a lamp?","There is a lamp?"],0],
["Choose the correct sentence.",["There is 20 desks.","There are 20 desks.","There a desk.","Desks there are."],1]
],
sp:["Talk about what you can do, give 2 classroom commands, and describe your classroom using there is/are.","Nima qila olishingiz haqida gapiring, 2 ta sinf buyrug'ini bering va sinfingizni there is/are bilan tasvirlang."],
ls:["Class review relay: can, imperatives, there is/are, and classroom objects mixed quiz.","Sinf takrorlash estafetasi: can, buyruq, there is/are va sinf buyumlari aralash so'rovi.",
"In pairs, review the week using can/imperatives/there is-are/classroom objects.","Juftlikda haftani can/buyruq/there is-are/sinf buyumlari bilan takrorlang."]
},


{d:16,w:4,wt:"My Daily Routine",wtUz:"Mening kundalik hayotim",
t:"Present Simple — Everyday Actions",tu:"Present Simple — kundalik harakatlar",
v:[
["go","bormoq","I go to school every day."],
["eat","yemoq","I eat breakfast every morning."],
["drink","ichmoq","I drink milk every day."],
["play","o'ynamoq","I play football every day."],
["study","o'qimoq","I study English every day."],
["work","ishlamoq","My father works every day."],
["live","yashamoq","I live in Tashkent."],
["like","yoqtirmoq","I like English."],
["every day","har kuni","I study every day."],
["always","doim","I always brush my teeth."]
],
dl:[
["Teacher","What do you do every day?","Har kuni nima qilasiz?"],
["Student","I go to school and I study English.","Men maktabga boraman va ingliz tilini o'qiyman."],
["Teacher","Do you like English?","Ingliz tilini yoqtirasizmi?"],
["Student","Yes, I always like my English class.","Ha, men doim ingliz tili darsimni yoqtiraman."]
],
g:["Present Simple — I / you / we / they",
"Use the present simple with I/you/we/they for routines and things you do regularly: I go to school every day. I study English. Add 'always', 'usually', 'sometimes' to say how often.",
"Present Simple — I / you / we / they",
"I/you/we/they bilan muntazam qiladigan ishlar haqida gapirish uchun present simple ishlatiladi: I go to school every day. I study English. Qanchalik tez-tez ekanini bildirish uchun 'always', 'usually', 'sometimes' qo'shiladi."],
qz:[
["Choose the correct sentence.",["I goes to school.","I go to school.","I going to school.","I am go to school."],1],
["'Har kuni' in English is ___.",["Sometimes","Always","Every day","Never"],2],
["Choose the correct sentence.",["I studies English.","I study English.","I am study English.","I studying English."],1],
["'Yoqtirmoq' in English is ___.",["Live","Work","Like","Play"],2]
],
sp:["Talk about 3 things you do every day.","Har kuni qiladigan 3 ta ishingiz haqida gapiring."],
ls:["Class chain: each student says one thing they do every day.","Sinf zanjiri: har bir o'quvchi har kuni qiladigan bitta ishini aytadi.",
"In pairs, ask 'What do you do every day?' and compare answers.","Juftlikda 'Har kuni nima qilasiz?' deb so'rang va javoblarni solishtiring."]
},

{d:17,w:4,wt:"My Daily Routine",wtUz:"Mening kundalik hayotim",
t:"Present Simple — He / She (-s)",tu:"Present Simple — He / She (-s)",
v:[
["goes","boradi","She goes to school."],
["eats","yeydi","He eats breakfast."],
["drinks","ichadi","She drinks tea."],
["plays","o'ynaydi","He plays football."],
["studies","o'qiydi","She studies English."],
["works","ishlaydi","My father works every day."],
["lives","yashaydi","She lives in Samarkand."],
["likes","yoqtiradi","He likes music."],
["watches","tomosha qiladi","She watches TV."],
["reads","o'qiydi (kitob)","He reads books."]
],
dl:[
["Malika","What does your brother do every day?","Akangiz har kuni nima qiladi?"],
["Aziz","He goes to school and he plays football.","U maktabga boradi va futbol o'ynaydi."],
["Malika","Does he like football?","U futbolni yoqtiradimi?"],
["Aziz","Yes, he likes football very much.","Ha, u futbolni juda yoqtiradi."]
],
g:["Present Simple: Adding -s with He / She / It",
"With he/she/it, add -s to the verb: go → goes, like → likes. Words ending in -y after a consonant change to -ies: study → studies. This -s is easy to forget, but it's essential.",
"Present Simple: He / She / It bilan -s qo'shish",
"He/she/it bilan fe'lga -s qo'shiladi: go → goes, like → likes. Undosh + y bilan tugagan so'zlarda -ies bo'ladi: study → studies. Bu -s ni unutish oson, lekin u juda muhim."],
qz:[
["Choose the correct sentence.",["He go to school.","He goes to school.","He going to school.","He gos to school."],1],
["'Study' with 'she' becomes ___.",["Studys","Studies","Studying","Studyes"],1],
["Choose the correct sentence.",["She like music.","She likes music.","She liking music.","She is like music."],1],
["Choose the correct sentence.",["He read books.","He reads books.","He reading books.","He is reads books."],1]
],
sp:["Talk about what your mother or father does every day.","Onangiz yoki otangiz har kuni nima qilishi haqida gapiring."],
ls:["Class chain: each student says what a family member does, using he/she + -s.","Sinf zanjiri: har bir o'quvchi oila a'zosi nima qilishi haqida he/she + -s bilan aytadi.",
"In pairs, ask about each other's best friend's daily routine.","Juftlikda bir-biringizning eng yaqin do'stingizning kundalik hayoti haqida so'rang."]
},

{d:18,w:4,wt:"My Daily Routine",wtUz:"Mening kundalik hayotim",
t:"Present Continuous — Right Now",tu:"Present Continuous — hozir",
v:[
["reading","o'qiyapti","She is reading a book."],
["writing","yozyapti","He is writing a letter."],
["playing","o'ynayapti","They are playing football."],
["eating","yeyapti","I am eating lunch."],
["drinking","ichyapti","She is drinking tea."],
["sleeping","uxlayapti","The baby is sleeping."],
["running","yugurayapti","He is running fast."],
["watching","tomosha qilyapti","We are watching TV."],
["now","hozir","What are you doing now?"],
["right now","aynan hozir","I am studying right now."]
],
dl:[
["Malika","What are you doing right now?","Hozir nima qilyapsiz?"],
["Aziz","I am reading a book. What about you?","Men kitob o'qiyapman. Sizchi?"],
["Malika","I am watching TV with my sister.","Men opam bilan televizor tomosha qilyapman."]
],
g:["Present Continuous: Actions Happening Now",
"Use 'am/is/are + verb-ing' for something happening right now: I am reading. She is playing. Most verbs just add -ing (play → playing); verbs ending in -e drop it (write → writing).",
"Present Continuous: hozir sodir bo'layotgan harakatlar",
"Hozir sodir bo'layotgan narsa uchun 'am/is/are + fe'l-ing' ishlatiladi: I am reading. She is playing. Ko'pchilik fe'llarga -ing qo'shiladi (play → playing); -e bilan tugaganlarda -e tushadi (write → writing)."],
qz:[
["Choose the correct sentence about now.",["I read a book now.","I am reading a book now.","I reading a book now.","I reads a book now."],1],
["What is the -ing form of 'write'?",["Writeing","Writting","Writing","Wrieing"],2],
["Choose the correct question.",["What you are doing?","What are you doing?","What doing you are?","Are you what doing?"],1],
["Choose the correct sentence.",["They play football now.","They are playing football now.","They playing football now.","They is playing football now."],1]
],
sp:["Look around and describe 3 things happening right now.","Atrofingizga qarang va hozir sodir bo'layotgan 3 ta ishni tasvirlang."],
ls:["Freeze game: act, teacher says 'Freeze!' and asks 'What are you doing?'","Muzlash o'yini: harakat qiling, o'qituvchi 'Freeze!' deydi va 'Nima qilyapsiz?' deb so'raydi.",
"In pairs, mime an action, partner guesses using 'Are you...ing?'","Juftlikda harakatni ijro eting, sherigingiz 'Are you...ing?' deb topsin."]
},

{d:19,w:4,wt:"My Daily Routine",wtUz:"Mening kundalik hayotim",
t:"Present Simple vs Present Continuous",tu:"Present Simple va Present Continuous farqi",
v:[
["usually","odatda","I usually walk to school."],
["sometimes","ba'zan","I sometimes watch TV."],
["never","hech qachon","I never eat late at night."],
["at the moment","hozirgi paytda","I am busy at the moment."],
["today","bugun","Today I am wearing a red shirt."],
["every week","har hafta","We play football every week."],
["this week","shu hafta","This week I am studying hard."],
["usually...but now","odatda...lekin hozir","I usually walk, but now I am running."]
],
dl:[
["Teacher","Do you usually walk to school?","Odatda maktabga piyoda borasizmi?"],
["Student","Yes, but today I am going by bus.","Ha, lekin bugun avtobusda boryapman."],
["Teacher","Why?","Nega?"],
["Student","Because it's raining now.","Chunki hozir yomg'ir yog'yapti."]
],
g:["Present Simple vs Present Continuous",
"Present simple is for routines and general facts: I usually walk to school. Present continuous is for right now: But today, I am going by bus. Don't mix them up — 'usually/always' go with present simple, 'now/at the moment' go with present continuous.",
"Present Simple va Present Continuous farqi",
"Present simple odat va umumiy faktlar uchun: I usually walk to school. Present continuous hozirgi payt uchun: But today, I am going by bus. Ularni aralashtirmang — 'usually/always' present simple bilan, 'now/at the moment' present continuous bilan keladi."],
qz:[
["Choose the correct sentence for a routine.",["I am usually walking to school.","I usually walk to school.","I usually walking to school.","I usually walks to school."],1],
["Choose the correct sentence for right now.",["I go by bus today.","I am going by bus today.","I am go by bus today.","I going by bus today."],1],
["Which word goes with present continuous?",["Usually","Always","Now","Every day"],2],
["Which word goes with present simple?",["Now","At the moment","Right now","Usually"],3]
],
sp:["Say something you usually do, and something different you are doing today.","Odatda qiladigan ishingizni va bugun qilayotgan boshqacha ishingizni ayting."],
ls:["Class contrast game: teacher says 'usually' or 'now', students say a matching sentence.","Sinf farq o'yini: o'qituvchi 'usually' yoki 'now' deydi, o'quvchilar mos gap aytadi.",
"In pairs, compare your usual routine with what's different today.","Juftlikda odatiy tartibingizni bugungi farqi bilan solishtiring."]
},

{d:20,w:4,wt:"My Daily Routine",wtUz:"Mening kundalik hayotim",rev:true,
t:"Week 4 Review",tu:"4-hafta Takrorlash",
qz:[
["Choose the correct sentence.",["I goes to school.","I go to school.","I going to school.","I am go to school."],1],
["'Study' with 'she' becomes ___.",["Studys","Studies","Studying","Studyes"],1],
["Choose the correct sentence about now.",["I read a book now.","I am reading a book now.","I reading a book now.","I reads a book now."],1],
["Choose the correct sentence for a routine.",["I am usually walking to school.","I usually walk to school.","I usually walking to school.","I usually walks to school."],1],
["What is the -ing form of 'write'?",["Writeing","Writting","Writing","Wrieing"],2],
["Choose the correct sentence.",["He read books.","He reads books.","He reading books.","He is reads books."],1],
["Which word goes with present continuous?",["Usually","Always","Now","Every day"],2],
["'Har kuni' in English is ___.",["Sometimes","Always","Every day","Never"],2]
],
sp:["Describe your daily routine, then say what you are doing right now.","Kundalik tartibingizni tasvirlang, so'ng hozir nima qilayotganingizni ayting."],
ls:["Class review relay: present simple vs continuous mixed quiz.","Sinf takrorlash estafetasi: present simple va continuous aralash so'rovi.",
"In pairs, review the week using routines and right-now actions.","Juftlikda haftani odatlar va hozirgi harakatlar bilan takrorlang."]
}
,

{d:21,w:5,wt:"Where Is It?",wtUz:"U qayerda?",
t:"Prepositions of Place",tu:"O'rin predloglari",
v:[
["in","ichida","The cat is in the box."],
["on","ustida","The book is on the table."],
["under","ostida","The shoes are under the bed."],
["behind","orqasida","The bag is behind the door."],
["between","orasida","The pen is between the books."],
["next to","yonida","The lamp is next to the bed."],
["box","quti","The cat is in the box."],
["table","stol","The book is on the table."],
["bed","karavot","The shoes are under the bed."],
["door","eshik","The bag is behind the door."]
],
dl:[
["Teacher","Where is the cat?","Mushuk qayerda?"],
["Student","The cat is under the table.","Mushuk stol ostida."],
["Teacher","Is the book on the table?","Kitob stol ustidami?"],
["Student","Yes, it's on the table.","Ha, u stol ustida."]
],
g:["Prepositions of Place: in, on, under, next to",
"'In' = inside ('in the box'). 'On' = on a surface ('on the table'). 'Under' = below ('under the bed'). 'Behind' = at the back. 'Between' = in the middle of two things. 'Next to' = beside.",
"O'rin predloglari: in, on, under, next to",
"'In' — ichida ('in the box'). 'On' — ustida ('on the table'). 'Under' — ostida ('under the bed'). 'Behind' — orqasida. 'Between' — ikkitasining orasida. 'Next to' — yonida."],
qz:[
["Choose the correct preposition: 'The book is ___ the table.'",["in","on","under","next to"],1],
["Choose the correct preposition: 'The cat is ___ the box.'",["on","in","under","between"],1],
["Choose the correct preposition: 'The shoes are ___ the bed.'",["on","in","under","next to"],2],
["Which preposition means 'yonida'?",["In","On","Under","Next to"],3]
],
sp:["Describe where 5 things are in your room using in/on/under/next to.","Xonangizdagi 5 ta narsaning qayerda ekanini in/on/under/next to yordamida tasvirlang."],
ls:["Classroom scavenger hunt: find objects and describe their location.","Sinfda buyum qidirish: buyumlarni topib joylashuvini tasvirlang.",
"In pairs, hide an object and give clues using prepositions.","Juftlikda buyumni yashiring va predloglar yordamida maslahat bering."]
},

{d:22,w:5,wt:"Where Is It?",wtUz:"U qayerda?",
t:"Prepositions of Time",tu:"Vaqt predloglari",
v:[
["at","-da (aniq vaqt)","I wake up at seven o'clock."],
["on","-da (kun)","I have class on Monday."],
["in","-da (oy/yil)","My birthday is in May."],
["seven o'clock","soat yetti","I wake up at seven o'clock."],
["Monday","dushanba","I have class on Monday."],
["May","may","My birthday is in May."],
["morning","ertalab","I study in the morning."],
["night","tun","I sleep at night."],
["today","bugun","I have a test today."],
["tomorrow","ertaga","I will see you tomorrow."]
],
dl:[
["Malika","What time do you wake up?","Soat nechada uyg'onasiz?"],
["Aziz","I wake up at seven o'clock. When is your birthday?","Men soat yettida uyg'onaman. Tug'ilgan kuningiz qachon?"],
["Malika","My birthday is in May.","Tug'ilgan kunim mayda."]
],
g:["Prepositions of Time: at, on, in",
"Use 'at' with clock times: at seven o'clock. Use 'on' with days: on Monday. Use 'in' with months and years: in May, in 2026.",
"Vaqt predloglari: at, on, in",
"'At' aniq soat bilan ishlatiladi: at seven o'clock. 'On' kunlar bilan ishlatiladi: on Monday. 'In' oy va yillar bilan ishlatiladi: in May, in 2026."],
qz:[
["Choose the correct word: 'I wake up ___ seven o'clock.'",["on","in","at","for"],2],
["Choose the correct word: 'I have class ___ Monday.'",["in","on","at","for"],1],
["Choose the correct word: 'My birthday is ___ May.'",["on","in","at","for"],1],
["Which preposition goes with a clock time?",["at","on","in","for"],0]
],
sp:["Say what time you wake up, and what day you have your favorite class.","Soat nechada uyg'onishingizni va sevimli faningiz qaysi kun ekanini ayting."],
ls:["Class calendar check: ask 'What day is it?' and 'What time is it?'","Sinf kalendar tekshiruvi: 'Bugun qaysi kun?' va 'Soat necha?' deb so'rang.",
"In pairs, ask each other's birthday month and favorite class day.","Juftlikda bir-biringizning tug'ilgan oyingiz va sevimli dars kuningizni so'rang."]
},

{d:23,w:5,wt:"Where Is It?",wtUz:"U qayerda?",
t:"Question Words",tu:"Savol so'zlari",
v:[
["who","kim","Who is your teacher?"],
["what","nima","What is your name?"],
["where","qayerda","Where do you live?"],
["when","qachon","When is your birthday?"],
["why","nega","Why are you late?"],
["how","qanday","How are you?"],
["whose","kimning","Whose book is this?"],
["question","savol","I have a question."]
],
dl:[
["Teacher","Who is your best friend?","Eng yaqin do'stingiz kim?"],
["Student","My best friend is Malika.","Eng yaqin do'stim Malika."],
["Teacher","Where does she live?","U qayerda yashaydi?"],
["Student","She lives near my house.","U mening uyim yaqinida yashaydi."]
],
g:["Question Words",
"Question words start the question: Who (person), What (thing), Where (place), When (time), Why (reason), How (manner). They always come first: Where do you live?",
"Savol so'zlari",
"Savol so'zlari savolni boshlaydi: Who (kim), What (nima), Where (qayerda), When (qachon), Why (nega), How (qanday). Ular doim birinchi o'rinda keladi: Where do you live?"],
qz:[
["Choose the correct question word for a person.",["What","Where","Who","When"],2],
["Choose the correct question word for a place.",["Who","What","Where","When"],2],
["Choose the correct question word for a reason.",["How","Why","Which","Whose"],1],
["'Bu kimning kitobi?' in English is ___.",["Who book is this?","Whose book is this?","What book is this?","Where book is this?"],1]
],
sp:["Ask your partner 4 different questions using who/what/where/when.","Sherigingizga who/what/where/when yordamida 4 xil savol bering."],
ls:["Question chain: each student asks a question to the next student.","Savol zanjiri: har bir o'quvchi keyingisiga savol beradi.",
"In pairs, interview each other with at least 4 different question words.","Juftlikda kamida 4 xil savol so'zi bilan bir-biringizni intervyu qiling."]
},

{d:24,w:5,wt:"Where Is It?",wtUz:"U qayerda?",
t:"How Much / How Many",tu:"How Much / How Many",
v:[
["how much","qancha (sanalmaydigan)","How much water do you drink?"],
["how many","nechta (sanaladigan)","How many books do you have?"],
["money","pul","How much money do you have?"],
["water","suv","How much water do you drink?"],
["books","kitoblar","How many books do you have?"],
["apples","olmalar","How many apples do you want?"],
["a lot of","ko'p","I have a lot of books."],
["not much","ko'p emas","I don't have much money."]
],
dl:[
["Malika","How many books do you have?","Sizda nechta kitob bor?"],
["Aziz","I have a lot of books. How much money do you have?","Menda ko'p kitob bor. Sizda qancha pul bor?"],
["Malika","I don't have much money today.","Bugun menda ko'p pul yo'q."]
],
g:["How Much / How Many",
"Use 'How much' with things we can't count (money, water): How much money do you have? Use 'How many' with things we can count: How many books do you have?",
"How Much / How Many",
"Sanalmaydigan narsalar (pul, suv) bilan 'How much' ishlatiladi: How much money do you have? Sanaladigan narsalar bilan 'How many' ishlatiladi: How many books do you have?"],
qz:[
["Choose the correct word: '___ money do you have?'",["How much","How many","How","What"],0],
["Choose the correct word: '___ books do you have?'",["How much","How many","How","What"],1],
["'Ko'p kitobim bor' in English is ___.",["I have a lot of books.","I have much books.","I have many of books.","I have a lot books."],0],
["Which word goes with uncountable things like water?",["Many","Much","Few","A"],1]
],
sp:["Ask your partner how much money and how many books they have.","Sherigingizdan qancha puli va nechta kitobi borligini so'rang."],
ls:["Class survey: ask 'How many pens do you have?' and total the class results.","Sinf so'rovi: 'Nechta ruchkangiz bor?' deb so'rang va sinf natijasini yig'ing.",
"In pairs, practice how much/how many with school supplies.","Juftlikda maktab buyumlari bilan how much/how many mashq qiling."]
},

{d:25,w:5,wt:"Where Is It?",wtUz:"U qayerda?",rev:true,
t:"Week 5 Review",tu:"5-hafta Takrorlash",
qz:[
["Choose the correct preposition: 'The book is ___ the table.'",["in","on","under","next to"],1],
["Choose the correct word: 'I wake up ___ seven o'clock.'",["on","in","at","for"],2],
["Choose the correct question word for a person.",["What","Where","Who","When"],2],
["Choose the correct word: '___ books do you have?'",["How much","How many","How","What"],1],
["Choose the correct word: 'I have class ___ Monday.'",["in","on","at","for"],1],
["'Bu kimning kitobi?' in English is ___.",["Who book is this?","Whose book is this?","What book is this?","Where book is this?"],1],
["Which preposition means 'yonida'?",["In","On","Under","Next to"],3],
["'Ko'p kitobim bor' in English is ___.",["I have a lot of books.","I have much books.","I have many of books.","I have a lot books."],0]
],
sp:["Describe your room, your daily schedule, and answer 3 questions from a friend.","Xonangizni, kundalik jadvalingizni tasvirlang va do'stingizning 3 ta savoliga javob bering."],
ls:["Class review relay: prepositions, time, and question words mixed quiz.","Sinf takrorlash estafetasi: predloglar, vaqt va savol so'zlari aralash so'rovi.",
"In pairs, review the week with a mini interview.","Juftlikda haftani kichik intervyu bilan takrorlang."]
}
,

{d:26,w:6,wt:"Food & Things",wtUz:"Ovqat va narsalar",
t:"Some / Any",tu:"Some / Any",
v:[
["some","biroz","I have some bread."],
["any","hech qanday","I don't have any milk."],
["bread","non","I have some bread."],
["milk","sut","I don't have any milk."],
["apples","olmalar","I have some apples."],
["pens","ruchkalar","Do you have any pens?"],
["water","suv","I want some water."],
["tea","choy","Would you like some tea?"]
],
dl:[
["Teacher","Do you have any pens?","Ruchkangiz bormi?"],
["Student","Yes, I have some pens. Would you like some tea?","Ha, menda bir nechta ruchka bor. Choy ichasizmi?"],
["Teacher","Yes, please. Thank you.","Ha, iltimos. Rahmat."]
],
g:["Some and Any",
"Use 'some' in positive sentences and offers: I have some bread. Would you like some tea? Use 'any' in negatives and questions: I don't have any milk. Do you have any pens?",
"Some va Any",
"'Some' tasdiq gaplar va takliflarda ishlatiladi: I have some bread. Would you like some tea? 'Any' inkor va so'roq gaplarda ishlatiladi: I don't have any milk. Do you have any pens?"],
qz:[
["Choose the correct word: 'I don't have ___ milk.'",["some","any","a","the"],1],
["Choose the correct word: 'Would you like ___ tea?'",["some","any","much","many"],0],
["Choose the correct sentence.",["I have any apples.","I have some apples.","I have a apples.","I have the any apples."],1],
["When do we usually use 'any'?",["Positive sentences","Negatives and questions","Only with people","Never"],1]
],
sp:["Say what food you have some of, and ask a friend if they have any.","Qanday ovqatingiz borligini ayting va do'stingizdan uning bor-yo'qligini so'rang."],
ls:["Class 'offer' game: offer classmates 'Would you like some...?' with different foods.","Sinf 'taklif' o'yini: sinfdoshlaringizga turli ovqatlar bilan 'Would you like some...?' deb taklif qiling.",
"In pairs, ask 'Do you have any...?' about school supplies.","Juftlikda maktab buyumlari haqida 'Do you have any...?' deb so'rang."]
},

{d:27,w:6,wt:"Food & Things",wtUz:"Ovqat va narsalar",
t:"Like / Want + -ing / to",tu:"Like / Want + -ing / to",
v:[
["like","yoqtirmoq","I like swimming."],
["love","juda yoqtirmoq","She loves dancing."],
["hate","yomon ko'rmoq","He hates cleaning."],
["want","xohlamoq","I want to play."],
["swimming","suzish","I like swimming."],
["dancing","raqsga tushish","She loves dancing."],
["cleaning","tozalash","He hates cleaning."],
["to play","o'ynashni","I want to play football."]
],
dl:[
["Malika","Do you like swimming?","Suzishni yoqtirasizmi?"],
["Aziz","Yes, I love swimming. I want to swim today.","Ha, men suzishni juda yoqtiraman. Bugun suzgim keladi."],
["Malika","I hate cleaning, but I want to help my mother.","Men tozalashni yomon ko'raman, lekin onamga yordam bergim keladi."]
],
g:["Like/Love/Hate + -ing, Want + to",
"After 'like', 'love', 'hate', use a verb + -ing: I like swimming. After 'want', use 'to' + the plain verb: I want to play.",
"Like/Love/Hate + -ing, Want + to",
"'Like', 'love', 'hate' dan keyin fe'l + ing ishlatiladi: I like swimming. 'Want' dan keyin 'to' + fe'lning oddiy shakli ishlatiladi: I want to play."],
qz:[
["Choose the correct sentence.",["I like to swim always.","I like swimming.","I like swims.","I liking swim."],1],
["Choose the correct sentence.",["I want playing football.","I want to play football.","I want play football.","I wants to play football."],1],
["'Raqsga tushishni yaxshi ko'radi' in English is ___.",["She loves dance.","She loves dancing.","She love dancing.","She loving dance."],1],
["What follows 'want'?",["to + verb","verb + ing","plain verb","verb + s"],0]
],
sp:["Say 2 things you like doing and 1 thing you want to do this weekend.","Yoqtiradigan 2 ta ishingizni va bu dam olish kunlari qilishni xohlagan 1 ta ishingizni ayting."],
ls:["Class survey: ask 'Do you like...?' about hobbies.","Sinf so'rovi: hobbilar haqida 'Do you like...?' deb so'rang.",
"In pairs, share things you like, love, and hate.","Juftlikda yoqtiradigan, juda yoqtiradigan va yomon ko'radigan narsalaringizni ayting."]
},

{d:28,w:6,wt:"Food & Things",wtUz:"Ovqat va narsalar",
t:"Articles — a/an, the, or nothing",tu:"Artikllar — a/an, the yoki hech narsa",
v:[
["the","(ma'lum narsa)","I have a book. The book is red."],
["Uzbekistan","O'zbekiston","I live in Uzbekistan."],
["music","musiqa","I like music."],
["name","ism","My name is Aziz."],
["close the door","eshikni yop","Close the door, please."],
["open the window","derazani och","Open the window, please."]
],
dl:[
["Teacher","Close the door, please.","Eshikni yoping, iltimos."],
["Student","OK. I live in Uzbekistan. Do you like music?","Xo'p. Men O'zbekistonda yashayman. Musiqani yoqtirasizmi?"],
["Teacher","Yes, I love music.","Ha, men musiqani juda yoqtiraman."]
],
g:["Articles: a/an, the, or nothing",
"Use 'a/an' for something new. Use 'the' when both people know exactly which one: I have a book. The book is red. Use no article with names, most countries, and general ideas: I live in Uzbekistan. I like music.",
"Artikllar: a/an, the yoki hech narsa",
"Yangi narsa uchun 'a/an' ishlatiladi. Ikkala tomon ham aynan qaysi narsani bilganda 'the' ishlatiladi: I have a book. The book is red. Ism, ko'pchilik davlat va umumiy tushunchalar bilan artikl ishlatilmaydi: I live in Uzbekistan. I like music."],
qz:[
["Choose the correct article: 'I have a book. ___ book is red.'",["A","An","The","No article"],2],
["Choose the correct article: 'I live in ___ Uzbekistan.'",["a","an","the","no article"],3],
["Choose the correct article: 'I like ___ music.'",["a","an","the","no article"],3],
["Choose the correct sentence.",["My name is the Aziz.","My name is Aziz.","My name is a Aziz.","My name is an Aziz."],1]
],
sp:["Talk about your country, your name, and something you like, using articles correctly.","Mamlakatingiz, ismingiz va yoqtirgan narsangiz haqida artikllardan to'g'ri foydalanib gapiring."],
ls:["Class 'a/the' sorting: teacher says a sentence, students say if it needs a/an/the/nothing.","Sinf 'a/the' saralash: o'qituvchi gap aytadi, o'quvchilar a/an/the/hech narsa kerakligini aytadi.",
"In pairs, talk about your countries and favorite music.","Juftlikda mamlakatlaringiz va sevimli musiqangiz haqida gapiring."]
},

{d:29,w:6,wt:"Food & Things",wtUz:"Ovqat va narsalar",
t:"Someone, Anyone, Nothing...",tu:"Someone, anyone, nothing...",
v:[
["someone","kimdir","I can see someone."],
["anyone","hech kim (savol/inkor)","Is there anyone here?"],
["something","nimadir","There is something in the box."],
["anything","hech narsa (savol/inkor)","I can't see anything."],
["nothing","hech narsa","There is nothing in the box."],
["nowhere","hech qayerga","I have nowhere to go."]
],
dl:[
["Malika","Is there anyone in the room?","Xonada kimdir bormi?"],
["Aziz","No, there is no one. There is nothing here.","Yo'q, hech kim yo'q. Bu yerda hech narsa yo'q."],
["Malika","I can see something over there!","Men u yerda nimadir ko'ryapman!"]
],
g:["Someone, Anyone, Nothing, Nowhere",
"'Someone/something' are for positive sentences: I can see someone. 'Anyone/anything' are for questions and negatives: Is there anyone here? 'Nothing/nowhere' already mean negative — don't add 'not'.",
"Someone, anyone, nothing, nowhere",
"'Someone/something' tasdiq gaplarda ishlatiladi: I can see someone. 'Anyone/anything' so'roq va inkor gaplarda ishlatiladi: Is there anyone here? 'Nothing/nowhere' allaqachon inkor ma'nosini bildiradi — 'not' qo'shilmaydi."],
qz:[
["Choose the correct word: 'I can see ___.' (positive)",["anyone","someone","no one","nothing"],1],
["Choose the correct word: 'Is there ___ here?'",["someone","anyone","no one","something"],1],
["Choose the correct sentence.",["There isn't nothing.","There is nothing.","There isn't anything not.","Nothing isn't there."],1],
["'Hech qayerga' in English is ___.",["Somewhere","Anywhere","Nowhere","Everywhere"],2]
],
sp:["Describe your bag: say something that is in it and something that is not.","Sumkangizni tasvirlang: unda nima borligini va nima yo'qligini ayting."],
ls:["Mystery bag game: guess what's inside using 'something/nothing'.","Sirli sumka o'yini: ichida nima borligini 'something/nothing' bilan taxmin qiling.",
"In pairs, ask 'Is there anyone/anything...?' about the classroom.","Juftlikda sinf haqida 'Is there anyone/anything...?' deb so'rang."]
},

{d:30,w:6,wt:"Food & Things",wtUz:"Ovqat va narsalar",rev:true,
t:"Week 6 Review — Term 1 Final Check",tu:"6-hafta Takrorlash — 1-chorak Yakuniy Tekshiruvi",
qz:[
["Choose the correct word: 'I don't have ___ milk.'",["some","any","a","the"],1],
["Choose the correct sentence.",["I want playing football.","I want to play football.","I want play football.","I wants to play football."],1],
["Choose the correct article: 'I live in ___ Uzbekistan.'",["a","an","the","no article"],3],
["Choose the correct word: 'Is there ___ here?'",["someone","anyone","no one","something"],1],
["Choose the correct word: 'Would you like ___ tea?'",["some","any","much","many"],0],
["What follows 'want'?",["to + verb","verb + ing","plain verb","verb + s"],0],
["Choose the correct sentence.",["My name is the Aziz.","My name is Aziz.","My name is a Aziz.","My name is an Aziz."],1],
["'Hech qayerga' in English is ___.",["Somewhere","Anywhere","Nowhere","Everywhere"],2]
],
sp:["Give a 1-minute talk about yourself: your name, country, family, daily routine, and things you like.","O'zingiz haqida 1 daqiqalik nutq so'zlang: ismingiz, mamlakatingiz, oilangiz, kundalik hayotingiz va yoqtirgan narsalaringiz haqida."],
ls:["Term 1 celebration: each student shares one English sentence they're proud of.","1-chorak nishonlash: har bir o'quvchi faxrlanadigan bitta ingliz gapini aytadi.",
"In pairs, review the whole term by describing yourselves fully.","Juftlikda butun chorakni o'zingizni to'liq tasvirlash orqali takrorlang."]
}
,

{d:31,w:7,wt:"Describing Things",wtUz:"Narsalarni tasvirlash",
t:"Adjectives & Adverbs",tu:"Sifatlar va ravishlar",
v:[
["happy","baxtli","She is a happy girl."],
["happily","baxtli tarzda","She sings happily."],
["careful","ehtiyotkor","He is a careful driver."],
["carefully","ehtiyotkorlik bilan","He drives carefully."],
["good","yaxshi","She is a good singer."],
["well","yaxshi (ravish)","She sings well."],
["slow","sekin","He is a slow runner."],
["slowly","sekin (ravish)","He runs slowly."],
["quick","tez","She is a quick learner."],
["quickly","tez (ravish)","She learns quickly."]
],
dl:[
["Teacher","Is he a careful driver?","U ehtiyotkor haydovchimi?"],
["Student","Yes, he drives very carefully.","Ha, u juda ehtiyotkorlik bilan haydaydi."],
["Teacher","Does she sing well?","U yaxshi qo'shiq aytadimi?"],
["Student","Yes, she sings very well.","Ha, u juda yaxshi qo'shiq aytadi."]
],
g:["Adjectives & Adverbs of Manner",
"An adjective describes a noun: a happy girl, a careful driver. An adverb describes a verb — most add -ly: happy → happily, careful → carefully. Some are irregular: good → well.",
"Sifatlar va ravishlar",
"Sifat otni tasvirlaydi: a happy girl, a careful driver. Ravish fe'lni tasvirlaydi — ko'pchiligiga -ly qo'shiladi: happy → happily, careful → carefully. Ba'zilari istisno: good → well."],
qz:[
["Choose the adjective.",["Happily","Happy","Carefully","Well"],1],
["Choose the adverb.",["Happy","Careful","Carefully","Good"],2],
["What is the adverb form of 'good'?",["Goodly","Well","Gooder","Good"],1],
["Choose the correct sentence.",["She sings happy.","She sings happily.","She singing happily.","She happily sing."],1]
],
sp:["Describe 2 people using adjectives, then describe how they do something using adverbs.","2 kishini sifatlar bilan tasvirlang, so'ng ular biror narsani qanday qilishini ravishlar bilan ayting."],
ls:["Adjective/adverb sort: teacher says a word, students say if it's an adjective or adverb.","Sifat/ravish saralash: o'qituvchi so'z aytadi, o'quvchilar sifat yoki ravish ekanini aytadi.",
"In pairs, describe how you do 3 daily activities using adverbs.","Juftlikda 3 ta kundalik ishni ravishlar bilan qanday qilishingizni tasvirlang."]
},

{d:32,w:7,wt:"Describing Things",wtUz:"Narsalarni tasvirlash",
t:"Comparatives & Superlatives",tu:"Solishtirish va eng ustunlik darajasi",
v:[
["taller","balandroq","He is taller than me."],
["tallest","eng baland","She is the tallest in the class."],
["bigger","kattaroq","An elephant is bigger than a dog."],
["biggest","eng katta","The elephant is the biggest."],
["more beautiful","chiroyliroq","This flower is more beautiful."],
["most beautiful","eng chiroyli","This is the most beautiful flower."],
["better","yaxshiroq","This book is better."],
["best","eng yaxshi","This is the best day."]
],
dl:[
["Malika","Who is taller, you or your brother?","Kim balandroq, siz yoki akangiz?"],
["Aziz","My brother is taller than me. He is the tallest in our family.","Akam mendan balandroq. U bizning oilamizda eng baland."]
],
g:["Comparatives & Superlatives",
"For short adjectives, add -er to compare two things and -est (with 'the') for three or more: tall → taller → the tallest. For longer adjectives, use 'more/the most'. Irregular: good → better → the best.",
"Solishtirish va eng ustunlik darajasi",
"Qisqa sifatlarga ikkitani solishtirish uchun -er, uchtadan ortiqni solishtirish uchun 'the' bilan -est qo'shiladi: tall → taller → the tallest. Uzunroq sifatlarda 'more/the most' ishlatiladi. Istisno: good → better → the best."],
qz:[
["Choose the correct comparative for 'tall'.",["More tall","Taller","Tallest","The taller"],1],
["Choose the correct superlative for 'tall'.",["Taller","Tallest","The tallest","More tall"],2],
["Choose the correct comparative for 'beautiful'.",["Beautifuller","More beautiful","The beautiful","Beautifulest"],1],
["Choose the correct comparative form of 'good'.",["Gooder","Better","More good","Best"],1]
],
sp:["Compare yourself with a family member (taller/shorter, older/younger).","O'zingizni oila a'zoingiz bilan solishtiring (balandroq/pastroq, kattaroq/kichikroq)."],
ls:["Class comparison line-up: students line up from shortest to tallest, describing.","Sinf solishtirish safi: o'quvchilar eng pastdan eng balandgacha saf tortadi va tasvirlaydi.",
"In pairs, compare 3 things (animals, foods, or family members).","Juftlikda 3 ta narsani (hayvon, ovqat yoki oila a'zosi) solishtiring."]
},

{d:33,w:7,wt:"Describing Things",wtUz:"Narsalarni tasvirlash",
t:"As...As — Equal Comparisons",tu:"As...As — teng solishtirish",
v:[
["as tall as","kabi baland","She is as tall as her brother."],
["as old as","kabi katta yoshda","I am as old as my cousin."],
["as fast as","kabi tez","He runs as fast as me."],
["as good as","kabi yaxshi","Her English is as good as mine."],
["worse","yomonroq","Today's weather is worse than yesterday."],
["worst","eng yomon","This is the worst day."]
],
dl:[
["Teacher","Is your English as good as your friend's?","Ingliz tilingiz do'stingiznikidek yaxshimi?"],
["Student","Yes, I think it's as good as hers.","Ha, menimcha uning ingliz tili bilan bir xil yaxshi."]
],
g:["As...As — Saying Two Things Are Equal",
"Use 'as + adjective + as' to say two things are equal: She is as tall as her brother. Negative: not as...as: I am not as tall as him.",
"As...As — ikki narsa teng ekanini aytish",
"Ikki narsa teng ekanini aytish uchun 'as + sifat + as' ishlatiladi: She is as tall as her brother. Inkor: not as...as: I am not as tall as him."],
qz:[
["Choose the correct sentence.",["She is as tall than her brother.","She is as tall as her brother.","She is so tall as her brother.","She is tall as her brother."],1],
["Choose the correct comparative for 'bad'.",["Badder","Worse","More bad","Baddest"],1],
["Choose the correct sentence.",["I am not as tall as him.","I am not as tall than him.","I am not so tall than him.","I not as tall as him."],0],
["What is the superlative of 'bad'?",["Worse","The worst","Badest","More bad"],1]
],
sp:["Compare your English to a friend's using 'as good as' or 'not as good as'.","Ingliz tilingizni do'stingiznikiga 'as good as' yoki 'not as good as' bilan solishtiring."],
ls:["Class 'as...as' game: compare two students or objects using 'as...as'.","Sinf 'as...as' o'yini: ikki o'quvchi yoki buyumni 'as...as' bilan solishtiring.",
"In pairs, find things you and your partner are equally good at.","Juftlikda siz va sherigingiz teng darajada yaxshi bo'lgan narsalarni toping."]
},

{d:34,w:7,wt:"Describing Things",wtUz:"Narsalarni tasvirlash",
t:"And, But, Or, Because",tu:"And, but, or, because",
v:[
["and","va","I like tea and coffee."],
["but","lekin","I like tea, but I don't like coffee."],
["or","yoki","Do you want tea or coffee?"],
["because","chunki","I stayed home because I was sick."]
],
dl:[
["Malika","Do you want tea or coffee?","Choy yoki kofe ichasizmi?"],
["Aziz","I like tea, but I don't like coffee. And I stayed home yesterday because I was sick.","Men choyni yoqtiraman, lekin kofeni yoqtirmayman. Kecha uyda qoldim, chunki kasal edim."]
],
g:["And, But, Or, Because",
"'And' joins two similar ideas. 'But' shows contrast. 'Or' shows a choice. 'Because' gives a reason: I stayed home because I was sick.",
"And, but, or, because",
"'And' ikkita o'xshash fikrni bog'laydi. 'But' qarama-qarshilikni bildiradi. 'Or' tanlovni bildiradi. 'Because' sabab bildiradi: I stayed home because I was sick."],
qz:[
["Choose the correct connector: 'I like tea ___ coffee.'",["but","because","and","or"],2],
["Choose the correct connector: 'I like tea, ___ I don't like coffee.'",["and","but","because","or"],1],
["Choose the correct connector: 'I stayed home ___ I was sick.'",["but","because","so","and"],1],
["Which connector gives a reason?",["and","but","because","or"],2]
],
sp:["Say 2 things you like and 1 thing you don't, giving a reason with 'because'.","Yoqtirgan 2 ta narsangizni va yoqtirmagan 1 ta narsangizni 'because' bilan sabab ko'rsatib ayting."],
ls:["Class chain: each student adds a sentence using and/but/or/because.","Sinf zanjiri: har bir o'quvchi and/but/or/because bilan gap qo'shadi.",
"In pairs, tell each other why you like or don't like something.","Juftlikda biror narsani nega yoqtirishingiz yoki yoqtirmasligingizni ayting."]
},

{d:35,w:7,wt:"Describing Things",wtUz:"Narsalarni tasvirlash",rev:true,
t:"Week 7 Review",tu:"7-hafta Takrorlash",
qz:[
["Choose the adverb.",["Happy","Careful","Carefully","Good"],2],
["Choose the correct comparative for 'tall'.",["More tall","Taller","Tallest","The taller"],1],
["Choose the correct sentence.",["She is as tall than her brother.","She is as tall as her brother.","She is so tall as her brother.","She is tall as her brother."],1],
["Choose the correct connector: 'I stayed home ___ I was sick.'",["but","because","so","and"],1],
["What is the adverb form of 'good'?",["Goodly","Well","Gooder","Good"],1],
["Choose the correct comparative form of 'good'.",["Gooder","Better","More good","Best"],1],
["What is the superlative of 'bad'?",["Worse","The worst","Badest","More bad"],1],
["Choose the correct connector: 'I like tea ___ coffee.'",["but","because","and","or"],2]
],
sp:["Describe and compare 2 family members, saying why you like spending time with them.","2 ta oila a'zoingizni tasvirlang va solishtiring, ular bilan vaqt o'tkazishni nega yoqtirishingizni ayting."],
ls:["Class review relay: adjectives, comparatives, and connectors mixed quiz.","Sinf takrorlash estafetasi: sifatlar, solishtirish va bog'lovchilar aralash so'rovi.",
"In pairs, review the week using descriptions and comparisons.","Juftlikda haftani tasvirlash va solishtirish bilan takrorlang."]
}
,

{d:36,w:8,wt:"Yesterday",wtUz:"Kecha",
t:"Past Simple — Was / Were",tu:"Past Simple — Was / Were",
v:[
["was","edi (I/he/she/it)","I was tired yesterday."],
["were","edi (you/we/they)","They were happy."],
["yesterday","kecha","I was at school yesterday."],
["last week","o'tgan hafta","We were on vacation last week."],
["ago","oldin","I was here two days ago."],
["there was","bor edi","There was a book on the table."],
["there were","bor edi (ko'plik)","There were three cats."]
],
dl:[
["Teacher","Where were you yesterday?","Kecha qayerda edingiz?"],
["Student","I was at home. I was sick.","Men uyda edim. Men kasal edim."],
["Teacher","Were your friends at school?","Do'stlaringiz maktabda edimi?"],
["Student","Yes, they were at school.","Ha, ular maktabda edi."]
],
g:["Past Simple — Was / Were",
"'Was' is the past of 'am/is' (I/he/she/it). 'Were' is the past of 'are' (you/we/they): I was tired. They were happy. 'There was/there were' is the past of 'there is/there are'.",
"Past Simple — Was / Were",
"'Was' — 'am/is' ning o'tgan zamoni (I/he/she/it). 'Were' — 'are' ning o'tgan zamoni (you/we/they): I was tired. They were happy. 'There was/there were' — 'there is/there are' ning o'tgan zamoni."],
qz:[
["Choose the correct word: 'I ___ tired.'",["was","were","am","is"],0],
["Choose the correct word: 'They ___ happy.'",["was","were","is","am"],1],
["Choose the correct sentence.",["There was three cats.","There were three cats.","There is three cats.","There are three cats yesterday."],1],
["Choose the correct negative.",["She weren't at school.","She wasn't at school.","She isn't at school yesterday.","She not was at school."],1]
],
sp:["Say where you were and how you felt yesterday.","Kecha qayerda edingiz va o'zingizni qanday his qilganingizni ayting."],
ls:["Class chain: 'Yesterday I was...' each student adds a sentence.","Sinf zanjiri: 'Kecha men...' har bir o'quvchi gap qo'shadi.",
"In pairs, ask each other 'Where were you yesterday?'","Juftlikda bir-biringizdan 'Kecha qayerda edingiz?' deb so'rang."]
},

{d:37,w:8,wt:"Yesterday",wtUz:"Kecha",
t:"Past Simple — Regular Verbs",tu:"Past Simple — qoidali fe'llar",
v:[
["played","o'ynadi","I played football yesterday."],
["watched","tomosha qildi","We watched a movie last night."],
["studied","o'qidi","She studied English last night."],
["walked","piyoda yurdi","She walked to school."],
["visited","tashrif buyurdi","We visited our grandmother."],
["cooked","pishirdi","My mother cooked dinner."]
],
dl:[
["Malika","What did you do yesterday?","Kecha nima qildingiz?"],
["Aziz","I played football and I watched a movie.","Men futbol o'ynadim va film tomosha qildim."],
["Malika","I studied English and visited my grandmother.","Men ingliz tilini o'qidim va buvimga tashrif buyurdim."]
],
g:["Past Simple — Regular Verbs",
"Regular verbs add -ed for the past: play → played, watch → watched. Words ending in consonant+y change to -ied: study → studied. Negative: didn't + plain verb.",
"Past Simple — qoidali fe'llar",
"Qoidali fe'llarga o'tgan zamon uchun -ed qo'shiladi: play → played, watch → watched. Undosh+y bilan tugagan so'zlarda -ied bo'ladi: study → studied. Inkor: didn't + oddiy fe'l."],
qz:[
["What is the past tense of 'play'?",["Played","Player","Playing","Plays"],0],
["What is the past tense of 'study'?",["Studyed","Studied","Studies","Studying"],1],
["Choose the correct negative.",["I didn't played.","I didn't play.","I not played.","I doesn't play."],1],
["Choose the correct sentence.",["She studied English.","She studyed English.","She studies English yesterday.","She studying English."],0]
],
sp:["Talk about what you did yesterday, using at least 3 past verbs.","Kecha nima qilganingiz haqida kamida 3 ta o'tgan zamon fe'li bilan gapiring."],
ls:["Yesterday chain: each student says one thing they did yesterday.","Kecha zanjiri: har bir o'quvchi kecha qilgan bitta ishini aytadi.",
"In pairs, interview each other about yesterday.","Juftlikda kecha haqida bir-biringizni intervyu qiling."]
},

{d:38,w:8,wt:"Yesterday",wtUz:"Kecha",
t:"Past Simple — Irregular Verbs",tu:"Past Simple — istisno fe'llar",
v:[
["went","bordi","I went to school."],
["ate","yedi","She ate breakfast."],
["saw","ko'rdi","He saw a bird."],
["had","bor edi","We had a good time."],
["did","qildi","They did their homework."],
["made","yasadi","My mother made a cake."]
],
dl:[
["Teacher","What did you do last weekend?","O'tgan dam olish kunlari nima qildingiz?"],
["Student","I went to the market. I saw my friend there.","Men bozorga bordim. U yerda do'stimni ko'rdim."],
["Teacher","Did you have fun?","Yaxshi vaqt o'tkazdingizmi?"],
["Student","Yes, we had a great time.","Ha, biz juda yaxshi vaqt o'tkazdik."]
],
g:["Past Simple — Irregular Verbs",
"Many common verbs don't follow the -ed rule — they change completely: go → went, eat → ate, see → saw, have → had, do → did, make → made. There's no shortcut, memorize them through practice.",
"Past Simple — istisno fe'llar",
"Ko'plab keng tarqalgan fe'llar -ed qoidasiga bo'ysunmaydi — ular butunlay o'zgaradi: go → went, eat → ate, see → saw, have → had, do → did, make → made. Bunda yo'l yo'q, mashq orqali yodlang."],
qz:[
["What is the past tense of 'go'?",["Goed","Went","Gone","Going"],1],
["What is the past tense of 'eat'?",["Eated","Ate","Eaten","Eating"],1],
["What is the past tense of 'see'?",["Seed","Saw","Seen","Seeing"],1],
["What is the past tense of 'have'?",["Haved","Had","Haves","Having"],1]
],
sp:["Tell a short story about last weekend using at least 3 irregular past verbs.","O'tgan dam olish kunlari haqida kamida 3 ta istisno fe'l bilan qisqa hikoya ayting."],
ls:["Past tense charades: act out a past action, class guesses the verb.","O'tgan zamon pantomimasi: harakatni ijro eting, sinf fe'lni topsin.",
"In pairs, tell each other 3 things you did last weekend.","Juftlikda o'tgan dam olish kunlari qilgan 3 ta ishingizni ayting."]
},

{d:39,w:8,wt:"Yesterday",wtUz:"Kecha",
t:"Past Continuous",tu:"Past Continuous",
v:[
["was doing","qilayotgan edi","I was doing my homework at 8 PM."],
["was sleeping","uxlayotgan edi","I was sleeping when you called."],
["were playing","o'ynayotgan edi (ko'plik)","They were playing football."],
["when","-ganda","I was sleeping when the phone rang."],
["while","-yotgan paytda","While I was cooking, the phone rang."]
],
dl:[
["Malika","What were you doing at 8 PM yesterday?","Kecha soat 20:00 da nima qilayotgan edingiz?"],
["Aziz","I was doing my homework when my friend called.","Do'stim qo'ng'iroq qilganda men uy vazifamni qilayotgan edim."]
],
g:["Past Continuous",
"Use 'was/were + verb-ing' for an action in progress at a past time: I was doing my homework at 8 PM. Combine with 'when' for an interrupting action: I was sleeping when the phone rang.",
"Past Continuous",
"O'tmishda ma'lum vaqtda davom etayotgan harakat uchun 'was/were + fe'l-ing' ishlatiladi: I was doing my homework at 8 PM. Bo'lib yuruvchi harakat uchun 'when' bilan birga ishlatiladi: I was sleeping when the phone rang."],
qz:[
["Choose the correct sentence.",["I was sleeping when you called.","I sleep when you called.","I slept when you calling.","I sleeping when you called."],0],
["Choose the correct past continuous form for 'they'.",["was playing","were playing","is playing","are playing"],1],
["Choose the correct question.",["What were you doing?","What was you doing?","What you were doing?","Were you what doing?"],0],
["Choose the correct sentence.",["While I was cooking, the phone rang.","While I cooking, the phone rang.","While I cook, the phone rang.","While I was cook, the phone rang."],0]
],
sp:["Say what you were doing at three different times yesterday.","Kecha uchta turli vaqtda nima qilayotganingizni ayting."],
ls:["Freeze-and-tell: act, freeze, and say 'I was...ing' when asked.","Muzlash va aytish: harakat qiling, muzlang va so'ralganda 'I was...ing' deng.",
"In pairs, tell each other what you were doing at 8 PM yesterday.","Juftlikda kecha soat 20:00 da nima qilayotganingizni ayting."]
},

{d:40,w:8,wt:"Yesterday",wtUz:"Kecha",rev:true,
t:"Week 8 Review",tu:"8-hafta Takrorlash",
qz:[
["Choose the correct word: 'I ___ tired.'",["was","were","am","is"],0],
["What is the past tense of 'play'?",["Played","Player","Playing","Plays"],0],
["What is the past tense of 'go'?",["Goed","Went","Gone","Going"],1],
["Choose the correct sentence.",["I was sleeping when you called.","I sleep when you called.","I slept when you calling.","I sleeping when you called."],0],
["Choose the correct word: 'They ___ happy.'",["was","were","is","am"],1],
["What is the past tense of 'eat'?",["Eated","Ate","Eaten","Eating"],1],
["Choose the correct negative.",["I didn't played.","I didn't play.","I not played.","I doesn't play."],1],
["Choose the correct past continuous form for 'they'.",["was playing","were playing","is playing","are playing"],1]
],
sp:["Tell a story about yesterday: where you were, what you did, and what you were doing at a specific time.","Kecha haqida hikoya ayting: qayerda edingiz, nima qildingiz va aniq bir vaqtda nima qilayotgan edingiz."],
ls:["Class storytelling: build a class story about 'yesterday' together.","Sinf hikoyachiligi: birgalikda 'kecha' haqida sinf hikoyasini tuzing.",
"In pairs, review: tell each other a story about last weekend.","Juftlikda takrorlang: o'tgan dam olish kunlari haqida bir-biringizga hikoya ayting."]
}
,

{d:41,w:9,wt:"Rules & Plans",wtUz:"Qoidalar va rejalar",
t:"Must, Mustn't, Have To",tu:"Must, mustn't, have to",
v:[
["must","kerak (majburiy)","Students must wear a uniform."],
["mustn't","mumkin emas","You mustn't run in the classroom."],
["have to","kerak","I have to finish my homework."],
["don't have to","kerak emas","You don't have to come if you're busy."]
],
dl:[
["Teacher","You must be quiet in the library.","Kutubxonada jim bo'lishingiz kerak."],
["Student","OK. Do I have to bring my own book?","Xo'p. O'z kitobimni olib kelishim kerakmi?"],
["Teacher","No, you don't have to. We have books here.","Yo'q, kerak emas. Bizda bu yerda kitoblar bor."]
],
g:["Must, Mustn't, Have To",
"'Must' and 'have to' show obligation: Students must wear a uniform. 'Mustn't' means forbidden: You mustn't run here. 'Don't have to' means not necessary: You don't have to come.",
"Must, mustn't, have to",
"'Must' va 'have to' majburiyatni bildiradi: Students must wear a uniform. 'Mustn't' — taqiqlangan: You mustn't run here. 'Don't have to' — zarur emas: You don't have to come."],
qz:[
["What does 'mustn't' mean?",["Not necessary","Forbidden","Optional","Recommended"],1],
["What does 'don't have to' mean?",["Forbidden","Not necessary","Impossible","Required"],1],
["Choose the correct sentence for a strict rule.",["Students should wear a uniform.","Students must wear a uniform.","Students can wear a uniform.","Students like a uniform."],1],
["Choose the correct sentence.",["I have finish my homework.","I have to finish my homework.","I must to finish my homework.","I having to finish my homework."],1]
],
sp:["Say 2 rules you must follow at school and 1 thing you don't have to do.","Maktabda amal qilishingiz kerak bo'lgan 2 ta qoidani va qilishingiz shart bo'lmagan 1 ta narsani ayting."],
ls:["Class rules poster: in groups, write 3 classroom rules using must/mustn't.","Sinf qoidalari plakati: guruhlarda must/mustn't bilan 3 ta sinf qoidasini yozing.",
"In pairs, discuss school rules using must/mustn't/have to.","Juftlikda maktab qoidalarini must/mustn't/have to bilan muhokama qiling."]
},

{d:42,w:9,wt:"Rules & Plans",wtUz:"Qoidalar va rejalar",
t:"Should, May, Could",tu:"Should, may, could",
v:[
["should","kerak (maslahat)","You should study every day."],
["shouldn't","kerak emas (maslahat)","You shouldn't eat too much sugar."],
["may","mumkin (ruxsat)","May I go out, please?"],
["could","mumkin (imkoniyat)","It could rain today."]
],
dl:[
["Student","May I go out, please?","Chiqsam bo'ladimi, iltimos?"],
["Teacher","Yes, you may.","Ha, mumkin."],
["Student","Should I bring an umbrella? It could rain.","Soyabon olib kelishim kerakmi? Yomg'ir yog'ishi mumkin."],
["Teacher","Yes, you should.","Ha, kerak."]
],
g:["Should, May, Could",
"'Should' gives friendly advice: You should study more. 'May' politely asks for permission: May I go out? 'Could' shows possibility: It could rain today.",
"Should, may, could",
"'Should' do'stona maslahat beradi: You should study more. 'May' odobli ruxsat so'raydi: May I go out? 'Could' imkoniyatni bildiradi: It could rain today."],
qz:[
["Choose the softer word for friendly advice.",["Must","Have to","Should","Mustn't"],2],
["Choose the correct way to ask permission politely.",["Must I go out?","May I go out?","Should I go out?","Have I go out?"],1],
["Choose the word for possibility.",["Must","Mustn't","Could","Have to"],2],
["Choose the correct advice.",["You should eating well.","You should eat well.","You should to eat well.","You shoulds eat well."],1]
],
sp:["Give a friend 2 pieces of advice using 'should', and ask permission for something using 'may'.","Do'stingizga 'should' bilan 2 ta maslahat bering va 'may' bilan biror narsaga ruxsat so'rang."],
ls:["Advice circle: each student gives one 'should' piece of advice for staying healthy.","Maslahat doirasi: har bir o'quvchi sog'lom bo'lish uchun bitta 'should' maslahati beradi.",
"In pairs, practice asking permission politely with 'May I...?'","Juftlikda 'May I...?' bilan odobli ruxsat so'rashni mashq qiling."]
},

{d:43,w:9,wt:"Rules & Plans",wtUz:"Qoidalar va rejalar",
t:"Future — Going To",tu:"Kelajak — Going To",
v:[
["going to","-moqchi (reja)","I am going to visit my grandmother."],
["plan","reja","What's your plan for the weekend?"],
["tomorrow","ertaga","I am going to study tomorrow."],
["next week","kelasi hafta","We are going to travel next week."]
],
dl:[
["Malika","What are you going to do this weekend?","Bu dam olish kunlari nima qilmoqchisiz?"],
["Aziz","I am going to visit my grandmother. What about you?","Men buvimga borishni rejalashtiryapman. Sizchi?"],
["Malika","I am going to study for my test.","Men testimga tayyorlanmoqchiman."]
],
g:["Future Plans: be going to",
"Use 'am/is/are + going to + verb' for plans already decided: I am going to visit my grandmother tomorrow.",
"Kelajak rejalari: be going to",
"Oldindan qaror qilingan rejalar uchun 'am/is/are + going to + fe'l' ishlatiladi: I am going to visit my grandmother tomorrow."],
qz:[
["Choose the correct sentence about a plan.",["I go to visit my aunt.","I am going to visit my aunt.","I going to visit my aunt.","I am go to visit my aunt."],1],
["Choose the correct question.",["What you are going to do?","What are you going to do?","What going you to do?","Are what you going to do?"],1],
["Choose the correct sentence.",["She is going to study medicine.","She go to study medicine.","She will studies medicine.","She going study medicine."],0],
["'Kelasi hafta sayohat qilamiz' in English is ___.",["We travel next week.","We are going to travel next week.","We going travel next week.","We are travel next week."],1]
],
sp:["Talk about your plans for next weekend.","Kelasi dam olish kunlari uchun rejalaringiz haqida gapiring."],
ls:["Plans mingle: ask classmates 'What are you going to do this weekend?'","Rejalar aralashuvi: sinfdoshlaringizdan so'rang.",
"In pairs, share your plans for tomorrow.","Juftlikda ertangi rejalaringizni ayting."]
},

{d:44,w:9,wt:"Rules & Plans",wtUz:"Qoidalar va rejalar",
t:"Future — Will / Shall",tu:"Kelajak — Will / Shall",
v:[
["will","-ar (bashorat/qaror)","I think it will rain tomorrow."],
["won't","-mas","It won't rain today."],
["shall","-aymi (taklif)","Shall I open the window?"],
["promise","va'da bermoq","I promise I will help you."]
],
dl:[
["Malika","Look at those clouds!","Ana bulutlarga qarang!"],
["Aziz","I think it will rain. Shall we go inside?","Menimcha yomg'ir yog'adi. Ichkariga kiraylikmi?"],
["Malika","Yes, let's go. I promise I'll bring an umbrella tomorrow.","Ha, boraylik. Ertaga soyabon olib kelishga va'da beraman."]
],
g:["Future: Will / Shall",
"Use 'will' for predictions and decisions made right now: I think it will rain. I'll help you. Use 'shall' for offers and suggestions with I/we: Shall I open the window? Shall we go?",
"Kelajak: Will / Shall",
"Bashorat va hozir qabul qilingan qarorlar uchun 'will' ishlatiladi: I think it will rain. I'll help you. I/we bilan taklif uchun 'shall' ishlatiladi: Shall I open the window? Shall we go?"],
qz:[
["'The phone is ringing!' — choose the spontaneous decision.",["I'm going to answer it.","I'll answer it.","I answer it.","I answered it."],1],
["Choose the correct offer.",["Shall I open the window?","Will I open the window?","Going I open the window?","Do I shall open the window?"],0],
["'Menimcha ertaga yomg'ir yog'adi' in English is ___.",["I think it rains tomorrow.","I think it will rain tomorrow.","I think it going to rain tomorrow.","I think it rained tomorrow."],1],
["Choose the correct negative.",["It won't rain today.","It wonts rain today.","It will not to rain today.","It not will rain today."],0]
],
sp:["Make 2 predictions about tomorrow's weather and 1 promise to a friend.","Ertangi ob-havo haqida 2 ta bashorat va do'stingizga 1 ta va'da bering."],
ls:["Fortune teller game: predict things about classmates' futures using 'will'.","Folbin o'yini: sinfdoshlaringizning kelajagi haqida 'will' bilan bashorat qiling.",
"In pairs, make offers to each other using 'Shall I...?'","Juftlikda bir-biringizga 'Shall I...?' bilan taklif bering."]
},

{d:45,w:9,wt:"Rules & Plans",wtUz:"Qoidalar va rejalar",rev:true,
t:"Week 9 Review",tu:"9-hafta Takrorlash",
qz:[
["What does 'mustn't' mean?",["Not necessary","Forbidden","Optional","Recommended"],1],
["Choose the correct way to ask permission politely.",["Must I go out?","May I go out?","Should I go out?","Have I go out?"],1],
["Choose the correct sentence about a plan.",["I go to visit my aunt.","I am going to visit my aunt.","I going to visit my aunt.","I am go to visit my aunt."],1],
["Choose the correct offer.",["Shall I open the window?","Will I open the window?","Going I open the window?","Do I shall open the window?"],0],
["What does 'don't have to' mean?",["Forbidden","Not necessary","Impossible","Required"],1],
["Choose the softer word for friendly advice.",["Must","Have to","Should","Mustn't"],2],
["Choose the word for possibility.",["Must","Mustn't","Could","Have to"],2],
["'The phone is ringing!' — choose the spontaneous decision.",["I'm going to answer it.","I'll answer it.","I answer it.","I answered it."],1]
],
sp:["Talk about school rules, give advice to a friend, and share your weekend plans.","Maktab qoidalari haqida gapiring, do'stingizga maslahat bering va dam olish kunlari rejalaringizni ayting."],
ls:["Class review relay: modals and future mixed quiz.","Sinf takrorlash estafetasi: modal va kelajak aralash so'rovi.",
"In pairs, review the week using rules, advice, and plans.","Juftlikda haftani qoidalar, maslahat va rejalar bilan takrorlang."]
}
,

{d:46,w:10,wt:"My Experiences",wtUz:"Mening tajribalarim",
t:"Present Perfect — Have You Ever...?",tu:"Present Perfect — Have you ever...?",
v:[
["have visited","borgan","I have visited Turkey."],
["have eaten","yegan","Have you ever eaten sushi?"],
["have seen","ko'rgan","She has seen this movie."],
["ever","hech qachon","Have you ever been to London?"],
["never","hech qachon (inkor)","I have never eaten sushi."]
],
dl:[
["Malika","Have you ever visited another country?","Boshqa mamlakatga borganmisiz?"],
["Aziz","Yes, I have visited Turkey. Have you ever eaten sushi?","Ha, men Turkiyaga borganman. Sushi yeganmisiz?"],
["Malika","No, I have never eaten sushi.","Yo'q, men hech qachon sushi yemaganman."]
],
g:["Present Perfect — Have you ever...?",
"Use 'have/has + past participle' to talk about life experiences without saying exactly when: I have visited Turkey. Have you ever eaten sushi? Negative: I have never eaten sushi.",
"Present Perfect — Have you ever...?",
"Aniq vaqtni aytmasdan hayotiy tajriba haqida gapirish uchun 'have/has + past participle' ishlatiladi: I have visited Turkey. Have you ever eaten sushi? Inkor: I have never eaten sushi."],
qz:[
["Choose the correct question about experience.",["Did you ever visit London?","Have you ever visited London?","Do you ever visited London?","Are you ever visiting London?"],1],
["Choose the correct sentence.",["She has went there.","She has gone there.","She has go there.","She have gone there."],1],
["Choose the correct negative.",["I have not never eaten sushi.","I have never eaten sushi.","I never have eaten sushi not.","I haven't never eaten sushi."],1],
["What does 'ever' mean here?",["Always","At any time in your life","Never","Today"],1]
],
sp:["Ask a friend 3 'Have you ever...?' questions.","Do'stingizga 3 ta 'Have you ever...?' savolini bering."],
ls:["'Have you ever...?' mingle: ask classmates about experiences.","'Have you ever...?' aralashuvi: sinfdoshlaringizdan tajribalar haqida so'rang.",
"In pairs, find 2 experiences you both have had.","Juftlikda ikkalangiz ham boshdan kechirgan 2 ta tajribani toping."]
},

{d:47,w:10,wt:"My Experiences",wtUz:"Mening tajribalarim",
t:"Present Perfect — Already, Yet, Just",tu:"Present Perfect — Already, yet, just",
v:[
["already","allaqachon","I have already finished my homework."],
["yet","hali","Have you finished yet?"],
["just","hozirgina","I have just arrived."],
["not yet","hali emas","I haven't finished yet."]
],
dl:[
["Teacher","Have you finished your homework yet?","Uy vazifangizni hali tugatdingizmi?"],
["Student","Yes, I have already finished it.","Ha, men uni allaqachon tugatganman."],
["Teacher","Great, I have just checked it.","Ajoyib, men uni hozirgina tekshirdim."]
],
g:["Already, Yet, Just",
"'Already' goes in positive sentences: I have already finished. 'Yet' goes in questions and negatives: Have you finished yet? I haven't finished yet. 'Just' means very recently: I have just arrived.",
"Already, yet, just",
"'Already' tasdiq gaplarda: I have already finished. 'Yet' savol va inkor gaplarda: Have you finished yet? I haven't finished yet. 'Just' juda yaqinda ma'nosini bildiradi: I have just arrived."],
qz:[
["Choose the correct sentence.",["I have finished already my homework.","I have already finished my homework.","I already have finished my homework.","I have finished my homework already yet."],1],
["Choose the correct question.",["Have you finished yet?","Have you already finished?","Have you just finished?","Have you finished already yet?"],0],
["'Hozirgina keldim' in English is ___.",["I have already arrived.","I have just arrived.","I have arrived yet.","I have never arrived."],1],
["Which word goes in negative sentences?",["Already","Just","Yet","Ever"],2]
],
sp:["Say 2 things you have already done today and 1 thing you haven't done yet.","Bugun allaqachon qilgan 2 ta ishingizni va hali qilmagan 1 ta ishingizni ayting."],
ls:["Class check-in: ask 'Have you finished...yet?' about homework/tasks.","Sinf tekshiruvi: uy vazifasi haqida 'Have you finished...yet?' deb so'rang.",
"In pairs, share what you have just done and what you haven't done yet.","Juftlikda hozirgina qilgan va hali qilmagan ishlaringizni ayting."]
},

{d:48,w:10,wt:"My Experiences",wtUz:"Mening tajribalarim",
t:"Present Perfect — For / Since",tu:"Present Perfect — For / Since",
v:[
["for","davomida","I have lived here for five years."],
["since","-dan beri","I have studied English since 2023."],
["how long","qancha vaqtdan beri","How long have you lived here?"]
],
dl:[
["Malika","How long have you studied English?","Ingliz tilini qancha vaqtdan beri o'rganyapsiz?"],
["Aziz","I have studied English for one year. What about you?","Men ingliz tilini bir yildan beri o'rganyapman. Sizchi?"],
["Malika","I have studied it since last year too.","Men ham o'tgan yildan beri o'rganyapman."]
],
g:["For and Since",
"Use 'for' with a length of time: for five years, for one month. Use 'since' with a starting point: since 2023, since last year. Both answer the question 'How long...?'",
"For va Since",
"'For' vaqt oralig'i bilan ishlatiladi: for five years, for one month. 'Since' boshlanish nuqtasi bilan ishlatiladi: since 2023, since last year. Ikkalasi ham 'How long...?' savoliga javob beradi."],
qz:[
["Choose the correct word: 'I have lived here ___ five years.'",["since","for","at","on"],1],
["Choose the correct word: 'I have studied English ___ 2023.'",["since","for","at","on"],0],
["Choose the correct question.",["How long you have lived here?","How long have you lived here?","How long do you live here?","How long you live here?"],1],
["Which word goes with a length of time?",["Since","For","Ever","Yet"],1]
],
sp:["Say how long you have lived in your city and how long you have studied English.","Shahringizda qancha vaqtdan beri yashaganingizni va ingliz tilini qancha vaqtdan beri o'rganganingizni ayting."],
ls:["Class survey: ask 'How long have you...?' about hobbies and school.","Sinf so'rovi: hobbi va maktab haqida 'Qancha vaqtdan beri...?' deb so'rang.",
"In pairs, ask each other 'How long have you known your best friend?'","Juftlikda 'Eng yaqin do'stingizni qancha vaqtdan beri bilasiz?' deb so'rang."]
},

{d:49,w:10,wt:"My Experiences",wtUz:"Mening tajribalarim",
t:"Present Perfect vs Past Simple",tu:"Present Perfect va Past Simple farqi",
v:[
["last year","o'tgan yili","I visited Turkey last year."],
["experience","tajriba","This was a great experience."],
["result","natija","The result of my hard work is good grades."]
],
dl:[
["Teacher","Have you ever visited Turkey?","Turkiyaga borganmisiz?"],
["Student","Yes, I have. I visited Turkey last year.","Ha, borganman. O'tgan yili Turkiyaga bordim."],
["Teacher","Was it a good experience?","Bu yaxshi tajriba bo'ldimi?"],
["Student","Yes, it was a great experience.","Ha, bu ajoyib tajriba bo'ldi."]
],
g:["Present Perfect vs Past Simple",
"Use present perfect for an experience without saying when: I have visited Turkey. Use past simple with a specific time word: I visited Turkey last year. Never mix present perfect with 'yesterday' or 'last year'.",
"Present Perfect va Past Simple farqi",
"Aniq vaqtni aytmasdan tajriba uchun present perfect ishlatiladi: I have visited Turkey. Aniq vaqt so'zi bilan past simple ishlatiladi: I visited Turkey last year. Present perfect'ni 'yesterday' yoki 'last year' bilan hech qachon aralashtirmang."],
qz:[
["Choose the correct sentence.",["I have visited Turkey last year.","I visited Turkey last year.","I have visit Turkey last year.","I was visited Turkey last year."],1],
["Choose the correct sentence for an experience (no time given).",["I visited Turkey.","I have visited Turkey.","I am visiting Turkey.","I visit Turkey."],1],
["Which time word needs past simple, not present perfect?",["Ever","Already","Last year","Just"],2],
["Choose the correct sentence.",["Have you ever visited London?","Did you ever visited London?","Do you ever visit London?","Are you ever visited London?"],0]
],
sp:["Talk about a place you have visited, then give the specific time you went there.","Borgan joyingiz haqida gapiring, so'ng u yerga aniq qachon borganingizni ayting."],
ls:["Class experience board: list class experiences, then ask 'When did you...?' for details.","Sinf tajriba taxtasi: sinf tajribalarini ro'yxatlang, so'ng 'Qachon...?' deb tafsilot so'rang.",
"In pairs, talk about a memorable experience and when it happened.","Juftlikda unutilmas tajriba va u qachon sodir bo'lgani haqida gapiring."]
},

{d:50,w:10,wt:"My Experiences",wtUz:"Mening tajribalarim",rev:true,
t:"Week 10 Review",tu:"10-hafta Takrorlash",
qz:[
["Choose the correct question about experience.",["Did you ever visit London?","Have you ever visited London?","Do you ever visited London?","Are you ever visiting London?"],1],
["Choose the correct sentence.",["I have finished already my homework.","I have already finished my homework.","I already have finished my homework.","I have finished my homework already yet."],1],
["Choose the correct word: 'I have lived here ___ five years.'",["since","for","at","on"],1],
["Choose the correct sentence.",["I have visited Turkey last year.","I visited Turkey last year.","I have visit Turkey last year.","I was visited Turkey last year."],1],
["'Hozirgina keldim' in English is ___.",["I have already arrived.","I have just arrived.","I have arrived yet.","I have never arrived."],1],
["Choose the correct word: 'I have studied English ___ 2023.'",["since","for","at","on"],0],
["Choose the correct sentence.",["She has went there.","She has gone there.","She has go there.","She have gone there."],1],
["Which time word needs past simple, not present perfect?",["Ever","Already","Last year","Just"],2]
],
sp:["Talk about your experiences: places you've visited, things you've tried, and how long you've done your hobbies.","Tajribalaringiz haqida gapiring: borgan joylaringiz, sinab ko'rgan narsalaringiz va hobbilaringizni qancha vaqtdan beri qilishingiz."],
ls:["Class experience trivia: mixed present perfect quiz relay.","Sinf tajriba bilim bellashuvi: aralash present perfect so'rovi.",
"In pairs, review the week: share experiences using present perfect and past simple.","Juftlikda haftani present perfect va past simple bilan takrorlang."]
}
,

{d:51,w:11,wt:"If...",wtUz:"Agar...",
t:"Zero Conditional — General Truths",tu:"Zero Conditional — umumiy haqiqatlar",
v:[
["if","agar","If you heat ice, it melts."],
["melts","eriydi","If you heat ice, it melts."],
["boils","qaynaydi","Water boils if you heat it."],
["freezes","muzlaydi","Water freezes if it gets very cold."]
],
dl:[
["Teacher","What happens if you heat ice?","Muzni isitsangiz nima bo'ladi?"],
["Student","If you heat ice, it melts.","Agar muzni isitsangiz, u eriydi."],
["Teacher","And what happens if water gets very cold?","Va suv juda sovib qolsa nima bo'ladi?"],
["Student","It freezes.","U muzlaydi."]
],
g:["Zero Conditional",
"Zero conditional talks about general truths and facts that are always true: If you heat ice, it melts. Water boils if you heat it to 100 degrees. Form: If + present simple, present simple.",
"Zero Conditional",
"Zero conditional doim to'g'ri bo'lgan umumiy haqiqat va faktlar haqida: If you heat ice, it melts. Water boils if you heat it to 100 degrees. Qolip: If + present simple, present simple."],
qz:[
["Choose the correct zero conditional.",["If you heat ice, it melted.","If you heat ice, it melts.","If you heat ice, it will melt.","If you heated ice, it melts."],1],
["Zero conditional is used for:",["Imaginary situations","General truths and facts","Past events","Polite requests"],1],
["Choose the correct sentence.",["Water boil if you heat it.","Water boils if you heat it.","Water boiled if you heat it.","Water will boil if heat it."],1],
["What tense is used in both parts of a zero conditional?",["Past simple","Present simple","Future","Present continuous"],1]
],
sp:["Say 2 zero conditional sentences about science facts you know.","Bilgan fan faktlaringiz haqida 2 ta zero conditional gap tuzing."],
ls:["Science facts game: teams make zero conditional sentences about nature.","Fan faktlari o'yini: jamoalar tabiat haqida zero conditional gaplar tuzadi.",
"In pairs, make 3 zero conditional sentences together.","Juftlikda birgalikda 3 ta zero conditional gap tuzing."]
},

{d:52,w:11,wt:"If...",wtUz:"Agar...",
t:"First Conditional — Real Possibilities",tu:"First Conditional — haqiqiy imkoniyatlar",
v:[
["will pass","o'tadi","If you study, you will pass."],
["will rain","yomg'ir yog'adi","If it rains, we won't go out."],
["will miss","kechikadi","If you don't hurry, you will miss the bus."]
],
dl:[
["Teacher","What will happen if you study hard?","Agar qattiq o'qisangiz nima bo'ladi?"],
["Student","If I study hard, I will pass the exam.","Agar qattiq o'qisam, imtihondan o'taman."],
["Teacher","And if you don't study?","Va agar o'qimasangiz?"],
["Student","If I don't study, I will fail.","Agar o'qimasam, yiqilaman."]
],
g:["First Conditional",
"First conditional talks about real future possibilities: If you study, you will pass. Form: If + present simple, will + verb. The if-clause never uses 'will'.",
"First Conditional",
"First conditional haqiqiy kelajak imkoniyatlari haqida: If you study, you will pass. Qolip: If + present simple, will + fe'l. If-qismida hech qachon 'will' ishlatilmaydi."],
qz:[
["Choose the correct first conditional.",["If you study, you pass.","If you study, you will pass.","If you will study, you pass.","If you studied, you will pass."],1],
["Choose the correct sentence.",["If it rain, we stay home.","If it rains, we will stay home.","If it will rain, we stay home.","If it rains, we stayed home."],1],
["Which tense goes in the if-clause of a first conditional?",["will + verb","present simple","past simple","past perfect"],1],
["Choose the correct sentence.",["If you don't hurry, you miss the bus.","If you don't hurry, you will miss the bus.","If you won't hurry, you will miss the bus.","If you don't hurry, you missed the bus."],1]
],
sp:["Say what will happen if you study hard, and if you don't do your homework.","Agar qattiq o'qisangiz va agar uy vazifangizni qilmasangiz nima bo'lishini ayting."],
ls:["Conditional chain: 'If it rains, I will...' — build a chain of consequences.","Shart zanjiri: 'Agar yomg'ir yog'sa, men...' — oqibatlar zanjirini tuzing.",
"In pairs, discuss real possibilities for this weekend using first conditional.","Juftlikda first conditional yordamida shu dam olish kunlari uchun haqiqiy imkoniyatlarni muhokama qiling."]
},

{d:53,w:11,wt:"If...",wtUz:"Agar...",
t:"Second Conditional — Imaginary Situations",tu:"Second Conditional — xayoliy vaziyatlar",
v:[
["would travel","sayohat qilardi","If I won the lottery, I would travel."],
["if I were you","men sizning o'rningizda bo'lsam","If I were you, I would study more."],
["would help","yordam berardi","If I had a superpower, I would help people."]
],
dl:[
["Malika","What would you do if you won the lottery?","Agar lotereyada yutsangiz, nima qilar edingiz?"],
["Aziz","If I won the lottery, I would travel the world.","Agar lotereyada yutsam, dunyo bo'ylab sayohat qilardim."],
["Malika","If I were you, I would help my family too.","Men sizning o'rningizda bo'lsam, oilamga ham yordam berardim."]
],
g:["Second Conditional",
"Second conditional talks about imaginary or unlikely situations: If I won the lottery, I would travel the world. Form: If + past simple, would + verb. Use 'were' for all subjects: If I were you...",
"Second Conditional",
"Second conditional xayoliy yoki ehtimoli kam vaziyatlar haqida: If I won the lottery, I would travel the world. Qolip: If + past simple, would + fe'l. Barcha egalar bilan 'were' ishlatiladi: If I were you..."],
qz:[
["Choose the correct second conditional.",["If I win the lottery, I will travel.","If I won the lottery, I would travel.","If I win the lottery, I would travel.","If I would win, I travel."],1],
["Choose the correct sentence with 'if I were you'.",["If I was you, I would study.","If I were you, I would study.","If I am you, I would study.","If I were you, I will study."],1],
["Second conditional is used for:",["Real future plans","Imaginary or unlikely situations","Past facts","General truths"],1],
["Which tense goes in the if-clause of a second conditional?",["will + verb","present simple","past simple","present perfect"],2]
],
sp:["Say what you would do if you had a superpower.","Agar super kuchingiz bo'lsa, nima qilishingiz haqida ayting."],
ls:["'What would you do if...?' circle: pose imaginative situations.","'Nima qilar edingiz agar...?' doirasi.",
"In pairs, discuss 2 hypothetical situations using second conditional.","Juftlikda second conditional yordamida 2 ta xayoliy vaziyatni muhokama qiling."]
},

{d:54,w:11,wt:"If...",wtUz:"Agar...",
t:"Giving Advice with \"If I were you\"",tu:"\"If I were you\" bilan maslahat berish",
v:[
["advice","maslahat","If I were you, I would ask the teacher for advice."],
["problem","muammo","If I had that problem, I would talk to my parents."],
["would ask","so'rar edim","If I were you, I would ask for help."]
],
dl:[
["Malika","I have a problem. I don't understand my homework.","Muammom bor. Uy vazifamni tushunmayapman."],
["Aziz","If I were you, I would ask the teacher for help.","Men sizning o'rningizda bo'lsam, o'qituvchidan yordam so'rardim."],
["Malika","That's good advice. Thank you!","Bu yaxshi maslahat. Rahmat!"]
],
g:["\"If I were you...\" for Giving Advice",
"We often use the second conditional to give advice: If I were you, I would ask for help. It's a polite, gentle way to suggest what someone else should do.",
"\"If I were you...\" maslahat berish uchun",
"Maslahat berish uchun ko'pincha second conditional ishlatiladi: If I were you, I would ask for help. Bu boshqa birovga nima qilish kerakligini taklif qilishning odobli, muloyim usuli."],
qz:[
["Choose the correct advice.",["If I am you, I ask for help.","If I were you, I would ask for help.","If I was you, I ask for help.","If I were you, I ask for help."],1],
["What is this pattern used for?",["Giving orders","Giving polite advice","Asking permission","Making promises"],1],
["Choose the correct sentence.",["If I were you, I would talk to my parents.","If I am you, I would talk to my parents.","If I were you, I talk to my parents.","If I was you, I will talk to my parents."],0],
["Choose the correct response to a problem.",["If I were you, I ignore it.","If I were you, I would ignore it.","If I am you, I would ignore it.","If I were you, I ignoring it."],1]
],
sp:["Listen to a friend's problem and give advice using 'If I were you...'","Do'stingizning muammosini tinglang va 'If I were you...' bilan maslahat bering."],
ls:["Advice circle: students share a small problem, classmates give advice.","Maslahat doirasi: o'quvchilar kichik muammo aytadi, sinfdoshlar maslahat beradi.",
"In pairs, take turns sharing a problem and giving advice.","Juftlikda navbatma-navbat muammo ayting va maslahat bering."]
},

{d:55,w:11,wt:"If...",wtUz:"Agar...",rev:true,
t:"Week 11 Review",tu:"11-hafta Takrorlash",
qz:[
["Choose the correct zero conditional.",["If you heat ice, it melted.","If you heat ice, it melts.","If you heat ice, it will melt.","If you heated ice, it melts."],1],
["Choose the correct first conditional.",["If you study, you pass.","If you study, you will pass.","If you will study, you pass.","If you studied, you will pass."],1],
["Choose the correct second conditional.",["If I win the lottery, I will travel.","If I won the lottery, I would travel.","If I win the lottery, I would travel.","If I would win, I travel."],1],
["Choose the correct sentence with 'if I were you'.",["If I was you, I would study.","If I were you, I would study.","If I am you, I would study.","If I were you, I will study."],1],
["Zero conditional is used for:",["Imaginary situations","General truths and facts","Past events","Polite requests"],1],
["Which tense goes in the if-clause of a second conditional?",["will + verb","present simple","past simple","present perfect"],2],
["What is 'if I were you' used for?",["Giving orders","Giving polite advice","Asking permission","Making promises"],1],
["Choose the correct sentence.",["If it rain, we stay home.","If it rains, we will stay home.","If it will rain, we stay home.","If it rains, we stayed home."],1]
],
sp:["Talk about a general truth, a real future plan, and an imaginary wish, using all three conditionals.","Uchala shart gapdan foydalanib, umumiy haqiqat, haqiqiy kelajak rejasi va xayoliy istak haqida gapiring."],
ls:["Class conditional relay: zero, first, and second conditional mixed quiz.","Sinf shart gap estafetasi: zero, first va second conditional aralash so'rovi.",
"In pairs, review the week with 3 conditional sentences each.","Juftlikda haftani har biringiz 3 tadan shart gap bilan takrorlang."]
}
,

{d:56,w:12,wt:"Interesting Facts",wtUz:"Qiziqarli faktlar",
t:"The Passive Voice — Present Simple",tu:"Majhul nisbat — Present Simple",
v:[
["is spoken","gapiriladi","English is spoken worldwide."],
["is grown","yetishtiriladi","Rice is grown in many countries."],
["are made","yasaladi","These toys are made in China."],
["worldwide","butun dunyoda","English is spoken worldwide."]
],
dl:[
["Teacher","Where is rice grown?","Guruch qayerda yetishtiriladi?"],
["Student","Rice is grown in many countries.","Guruch ko'p davlatlarda yetishtiriladi."],
["Teacher","Is English spoken in your country?","Sizning mamlakatingizda ingliz tili gapiriladimi?"],
["Student","Yes, English is spoken in schools.","Ha, ingliz tili maktablarda gapiriladi."]
],
g:["The Passive Voice — Present Simple",
"We use the passive when the action matters more than who does it: English is spoken worldwide. Form: subject + am/is/are + past participle.",
"Majhul nisbat — Present Simple",
"Harakatni kim bajarganidan ko'ra harakatning o'zi muhimroq bo'lganda passive ishlatiladi: English is spoken worldwide. Qolip: ega + am/is/are + past participle."],
qz:[
["Choose the correct passive sentence.",["English speaks worldwide.","English is spoken worldwide.","English spoken worldwide.","English is speaking worldwide."],1],
["Choose the correct passive sentence.",["Rice grows in many countries.","Rice is grown in many countries.","Rice growing in many countries.","Rice is grow in many countries."],1],
["What is the passive voice formula?",["subject + verb + object","subject + be + past participle","subject + have + past participle","subject + do + verb"],1],
["When do we use the passive voice?",["When the doer is more important","When the action is more important than the doer","Only in questions","Only in the future"],1]
],
sp:["Say 2 facts about your country using the passive voice (e.g. 'Cotton is grown in Uzbekistan').","Passive voice yordamida mamlakatingiz haqida 2 ta fakt ayting."],
ls:["Fact quiz: 'Where is ___ made/grown?' — class guesses using passive.","Fakt so'rovi: 'Qayerda ishlab chiqariladi/yetishtiriladi?' — sinf passive bilan topsin.",
"In pairs, make 3 passive sentences about products or food.","Juftlikda mahsulot yoki ovqat haqida 3 ta passive gap tuzing."]
},

{d:57,w:12,wt:"Interesting Facts",wtUz:"Qiziqarli faktlar",
t:"The Passive Voice — Past Simple",tu:"Majhul nisbat — Past Simple",
v:[
["was invented","ixtiro qilingan","The telephone was invented by Bell."],
["was written","yozilgan","This book was written in 1990."],
["was built","qurilgan","This house was built in 1990."],
["were made","yasalgan","These shoes were made in Italy."]
],
dl:[
["Teacher","Who was the telephone invented by?","Telefon kim tomonidan ixtiro qilingan?"],
["Student","It was invented by Alexander Graham Bell.","U Aleksandr Graham Bell tomonidan ixtiro qilingan."],
["Teacher","When was this school built?","Bu maktab qachon qurilgan?"],
["Student","It was built in 1990.","U 1990 yilda qurilgan."]
],
g:["The Passive Voice — Past Simple",
"For the past, use was/were + past participle: The telephone was invented by Bell. Add 'by + person' only if it's important to say who did it.",
"Majhul nisbat — Past Simple",
"O'tgan zamon uchun was/were + past participle ishlatiladi: The telephone was invented by Bell. Kim bajargani muhim bo'lsagina 'by + shaxs' qo'shiladi."],
qz:[
["Choose the correct passive statement.",["America discovered by Columbus.","America was discovered by Columbus.","America discover by Columbus.","America is discover by Columbus."],1],
["Choose the correct passive form.",["This house built in 1990.","This house was built in 1990.","This house is build in 1990.","This house builded in 1990."],1],
["Choose the correct passive sentence.",["These shoes made in Italy.","These shoes were made in Italy.","These shoes was made in Italy.","These shoes is made in Italy."],1],
["Choose the correct question.",["Who invented the telephone was?","Who was the telephone invented by?","Who was invented the telephone?","By who the telephone was invented?"],1]
],
sp:["Talk about a famous invention and who invented it, using the passive.","Mashhur ixtiro va uni kim ixtiro qilgani haqida passive bilan gapiring."],
ls:["Famous inventions quiz: match inventions to inventors using passive sentences.","Mashhur ixtirolar so'rovi: ixtirolarni ixtirochilar bilan passive gaplar orqali moslashtiring.",
"In pairs, discuss when your school or house was built.","Juftlikda maktabingiz yoki uyingiz qachon qurilgani haqida gaplashing."]
},

{d:58,w:12,wt:"Interesting Facts",wtUz:"Qiziqarli faktlar",
t:"Relative Clauses — Who, Which",tu:"Nisbiy gaplar — Who, Which",
v:[
["who","kim (bog'lovchi)","The girl who sits next to me is my cousin."],
["which","qaysi (bog'lovchi)","This is the book which I read last week."],
["that","ki (bog'lovchi)","The car that I bought is red."]
],
dl:[
["Teacher","Can you describe a teacher using 'who'?","O'qituvchini 'who' bilan tasvirlay olasizmi?"],
["Student","A teacher is a person who helps students learn.","O'qituvchi — o'quvchilarga o'rganishga yordam beradigan shaxs."],
["Teacher","Great! Now describe your favorite book using 'which'.","Ajoyib! Endi sevimli kitobingizni 'which' bilan tasvirlang."],
["Student","This is the book which I read last week.","Bu men o'tgan hafta o'qigan kitob."]
],
g:["Relative Clauses: Who, Which",
"Use 'who' for people and 'which' for things to give more information about a noun without starting a new sentence: The girl who sits next to me is my cousin. This is the book which I read.",
"Nisbiy gaplar: Who, Which",
"Odamlar uchun 'who', narsalar uchun 'which' ishlatilib, yangi gap boshlamasdan ot haqida qo'shimcha ma'lumot beriladi: The girl who sits next to me is my cousin. This is the book which I read."],
qz:[
["Choose the correct relative pronoun for a person.",["Which","Where","Who","When"],2],
["Choose the correct sentence.",["A doctor is a person which helps sick people.","A doctor is a person who helps sick people.","A doctor is a person where helps sick people.","A doctor is a person whose helps sick people."],1],
["Choose the correct sentence.",["This is the book who I read.","This is the book which I read.","This is the book where I read.","This is the book whose I read."],1],
["What do relative clauses do?",["Start a brand new sentence","Give more information about a noun","Only work in questions","Replace the subject entirely"],1]
],
sp:["Describe a person and a thing using relative clauses.","Nisbiy gaplar yordamida bir kishi va bir narsani tasvirlang."],
ls:["Definition game: describe a word using 'who/which', class guesses.","Ta'rif o'yini: so'zni 'who/which' bilan tasvirlang, sinf topsin.",
"In pairs, describe people and things you know using who/which.","Juftlikda tanigan odamlar va narsalarni who/which bilan tasvirlang."]
},

{d:59,w:12,wt:"Interesting Facts",wtUz:"Qiziqarli faktlar",
t:"Relative Clauses — Whose, Where",tu:"Nisbiy gaplar — Whose, Where",
v:[
["whose","kimning (bog'lovchi)","That's the boy whose father is a doctor."],
["where","qayerda (bog'lovchi)","This is the school where I studied."],
["neighborhood","mahalla","This is the neighborhood where I live."],
["park","park","This is the park where I play football."],
["classroom","sinf xonasi","This is the classroom where we study."]
],
dl:[
["Malika","Who is that boy?","Ana u bola kim?"],
["Aziz","That's the boy whose father is our teacher.","Bu — otasi bizning o'qituvchimiz bo'lgan bola."],
["Malika","And where is your old school?","Va sizning eski maktabingiz qayerda?"],
["Aziz","This is the school where I studied.","Bu men o'qigan maktab."]
],
g:["Relative Clauses: Whose, Where",
"Use 'whose' to show possession: That's the boy whose father is a doctor. Use 'where' for places: This is the school where I studied.",
"Nisbiy gaplar: Whose, Where",
"Egalikni bildirish uchun 'whose' ishlatiladi: That's the boy whose father is a doctor. Joylar uchun 'where' ishlatiladi: This is the school where I studied."],
qz:[
["Choose the correct relative pronoun for a place.",["Who","Which","Where","Whose"],2],
["Choose the correct relative pronoun for possession.",["Who","Which","Where","Whose"],3],
["Choose the correct sentence.",["This is the park who I play.","This is the park where I play.","This is the park which I play.","This is the park whose I play."],1],
["'Otasi shifokor bo'lgan bola' in English is ___.",["The boy who father is a doctor","The boy whose father is a doctor","The boy which father is a doctor","The boy where father is a doctor"],1]
],
sp:["Describe your school and a friend whose family you know, using where/whose.","Maktabingiz va oilasini bilgan do'stingizni where/whose bilan tasvirlang."],
ls:["Class 'who/which/where/whose' review game with pictures.","Sinf 'who/which/where/whose' rasm bilan takrorlash o'yini.",
"In pairs, describe your neighborhood using 'where'.","Juftlikda mahallangizni 'where' bilan tasvirlang."]
},

{d:60,w:12,wt:"Interesting Facts",wtUz:"Qiziqarli faktlar",rev:true,
t:"Grammar Foundations Complete!",tu:"Grammatika asoslari tugallandi!",
qz:[
["How do you say 'Salom' in English?",["Goodbye","Hello","Sorry","No"],1],
["Choose the correct word: 'She ___ a teacher.'",["am","is","are","be"],1],
["Choose the correct sentence.",["I goes to school.","I go to school.","I going to school.","I am go to school."],1],
["What is the past tense of 'go'?",["Goed","Went","Gone","Going"],1],
["Choose the correct comparative for 'tall'.",["More tall","Taller","Tallest","The taller"],1],
["Choose the correct sentence about a plan.",["I go to visit my aunt.","I am going to visit my aunt.","I going to visit my aunt.","I am go to visit my aunt."],1],
["Choose the correct question about experience.",["Did you ever visit London?","Have you ever visited London?","Do you ever visited London?","Are you ever visiting London?"],1],
["Choose the correct first conditional.",["If you study, you pass.","If you study, you will pass.","If you will study, you pass.","If you studied, you will pass."],1],
["Choose the correct passive sentence.",["English speaks worldwide.","English is spoken worldwide.","English spoken worldwide.","English is speaking worldwide."],1],
["Choose the correct sentence.",["A doctor is a person which helps sick people.","A doctor is a person who helps sick people.","A doctor is a person where helps sick people.","A doctor is a person whose helps sick people."],1],
["What does 'mustn't' mean?",["Not necessary","Forbidden","Optional","Recommended"],1],
["Choose the correct sentence.",["There is two windows.","There are two windows.","There a window.","Windows there are."],1],
["What is the plural of 'child'?",["Childs","Childes","Children","Childies"],2],
["Choose the correct sentence.",["I like to swim always.","I like swimming.","I like swims.","I liking swim."],1],
["Choose the correct word: '___ books do you have?'",["How much","How many","How","What"],1],
["Choose the correct second conditional.",["If I win the lottery, I will travel.","If I won the lottery, I would travel.","If I win the lottery, I would travel.","If I would win, I travel."],1],
["Choose the correct sentence.",["She can sings.","She can sing.","She cans sing.","She can singing."],1],
["Choose the correct sentence about now.",["I read a book now.","I am reading a book now.","I reading a book now.","I reads a book now."],1],
["Choose the correct connector: 'I stayed home ___ I was sick.'",["but","because","so","and"],1],
["Choose the correct sentence.",["This is the park who I play.","This is the park where I play.","This is the park which I play.","This is the park whose I play."],1]
],
sp:["Give a 2-minute talk about yourself: your family, daily routine, an experience you've had, your plans, and your opinion on something — using as much grammar from this course as you can.","O'zingiz haqida 2 daqiqalik nutq so'zlang: oilangiz, kundalik hayotingiz, boshdan kechirgan tajribangiz, rejalaringiz va biror narsa haqidagi fikringiz — shu kursda o'rgangan grammatikangizdan iloji boricha ko'proq foydalaning."],
ls:["Class celebration: each student gives a short speech about their English journey so far.","Sinf nishonlash: har bir o'quvchi hozirgacha bo'lgan ingliz tili safari haqida qisqa nutq so'zlaydi.",
"In pairs, interview each other covering everything from this course, then introduce your partner to the class.","Juftlikda shu kursning barcha mavzularini qamrab olib bir-biringizni intervyu qiling, so'ng sherigingizni sinfga tanishtiring."]
}
,

{d:61,w:13,wt:"Family & People",wtUz:"Oila va odamlar",
t:"Family Members",tu:"Oila a'zolari",
v:[
["mother","ona","My mother is a teacher."],
["father","ota","My father works every day."],
["parents","ota-ona","My parents love me."],
["sister","opa-singil","My sister is ten years old."],
["brother","aka-uka","My brother plays football."],
["grandmother","buvi","My grandmother cooks delicious food."],
["grandfather","bobo","My grandfather tells great stories."],
["aunt","xola","My aunt lives in Tashkent."],
["uncle","amaki","My uncle is a doctor."],
["cousin","amakivachcha","My cousin studies with me."],
["baby","chaqaloq","The baby is sleeping."],
["family","oila","I love my family."]
],
dl:[
["Malika","How many people are there in your family?","Oilangizda nechta odam bor?"],
["Aziz","There are five people. I have two sisters and one brother.","Beshta odam bor. Ikkita opa-singlim va bitta akam bor."],
["Malika","Are your grandparents alive?","Buvi-bobongiz hayotmi?"],
["Aziz","Yes, they live with us.","Ha, ular biz bilan yashaydi."]
],
g:["Talking About Your Family",
"You already know everything you need for this: 'have/has' for family members (I have two sisters), 'there is/are' for counting family (There are five people), and possessives (my grandmother). Now let's use them together!",
"Oilangiz haqida gapirish",
"Buning uchun kerak bo'lgan hamma narsani allaqachon bilasiz: oila a'zolari uchun 'have/has' (I have two sisters), oilani sanash uchun 'there is/are' (There are five people), va egalik olmoshlari (my grandmother). Endi ularni birga ishlatamiz!"],
qz:[
["'Ona' in English is ___.",["Father","Mother","Sister","Aunt"],1],
["'Amaki' in English is ___.",["Uncle","Aunt","Cousin","Nephew"],0],
["Choose the correct sentence.",["I have two sister.","I have two sisters.","I has two sisters.","I having two sisters."],1],
["'Oila' in English is ___.",["Friend","Neighbor","Family","Children"],2]
],
sp:["Describe your family: how many people, their names, and their relationship to you.","Oilangizni tasvirlab bering: nechta odam, ismlari va sizga qanday qarindosh ekanini ayting."],
ls:["Show a family photo (or draw one) and introduce 3 family members.","Oila suratini ko'rsating va 3 ta oila a'zosini tanishtiring.",
"In pairs, ask about each other's families.","Juftlikda bir-biringizning oilangiz haqida so'rang."]
},

{d:62,w:13,wt:"Family & People",wtUz:"Oila va odamlar",
t:"Describing People",tu:"Odamlarni tasvirlash",
v:[
["tall","baland bo'yli","My brother is tall."],
["short","past bo'yli","She is short."],
["young","yosh","The teacher is young."],
["old","keksa","My grandfather is old."],
["kind","mehribon","She is kind to everyone."],
["funny","kulgili","He is a funny boy."],
["long hair","uzun soch","She has long hair."],
["short hair","qisqa soch","He has short hair."],
["brown eyes","jigarrang ko'z","I have brown eyes."]
],
dl:[
["Teacher","What does your best friend look like?","Eng yaqin do'stingiz qanday ko'rinishga ega?"],
["Student","She is tall and she has long hair. She is very kind.","U baland bo'yli va uzun sochli. U juda mehribon."]
],
g:["Describing Appearance and Character",
"You already know 'to be' + adjective (She is tall) and 'have' + noun (She has long hair) — combine them to give a full description of anyone!",
"Tashqi ko'rinish va xarakterni tasvirlash",
"Siz allaqachon 'to be' + sifat (She is tall) va 'have' + ot (She has long hair) ni bilasiz — to'liq tasvir berish uchun ularni birlashtiring!"],
qz:[
["'Mehribon' in English is ___.",["Funny","Kind","Tall","Short"],1],
["Choose the correct sentence.",["She have long hair.","She has long hair.","She is have long hair.","She having long hair."],1],
["What is the opposite of 'tall'?",["Old","Young","Short","Kind"],2],
["'Jigarrang ko'z' in English is ___.",["Long hair","Brown eyes","Short hair","Old eyes"],1]
],
sp:["Describe 2 people you know: their appearance and their character.","Tanigan 2 kishini tasvirlab bering: tashqi ko'rinishi va xarakteri."],
ls:["Guess who: describe a classmate without naming them, others guess.","Kimni toping: sinfdoshni ismini aytmasdan tasvirlang, boshqalar topsin.",
"In pairs, describe each other using 3 adjectives.","Juftlikda bir-biringizni 3 ta sifat bilan tasvirlang."]
},

{d:63,w:13,wt:"Family & People",wtUz:"Oila va odamlar",
t:"Jobs & Occupations",tu:"Kasblar",
v:[
["doctor","shifokor","My uncle is a doctor."],
["nurse","hamshira","She works as a nurse."],
["engineer","muhandis","He wants to be an engineer."],
["farmer","fermer","My grandfather is a farmer."],
["driver","haydovchi","He is a bus driver."],
["cook","oshpaz","She is a good cook."],
["police officer","militsioner","He is a police officer."],
["pilot","uchuvchi","She wants to be a pilot."]
],
dl:[
["Malika","What does your father do?","Otangiz nima ish qiladi?"],
["Aziz","He is an engineer. What do you want to be?","U muhandis. Siz kim bo'lishni xohlaysiz?"],
["Malika","I want to be a doctor. I want to help people.","Men shifokor bo'lishni xohlayman. Odamlarga yordam bergim keladi."]
],
g:["Talking About Jobs",
"Use 'to be' for someone's job (She is a nurse) and 'want to be' for a future dream job (I want to be a doctor) — you already know both patterns!",
"Kasblar haqida gapirish",
"Kimningdir kasbi uchun 'to be' (She is a nurse), kelajakdagi orzu kasb uchun 'want to be' (I want to be a doctor) ishlatiladi — siz ikkalasini ham allaqachon bilasiz!"],
qz:[
["'Shifokor' in English is ___.",["Nurse","Doctor","Engineer","Farmer"],1],
["Choose the correct sentence.",["I want be a doctor.","I want to be a doctor.","I wants to be a doctor.","I want being a doctor."],1],
["'Uchuvchi' in English is ___.",["Pilot","Driver","Cook","Farmer"],0],
["Choose the correct sentence.",["He engineer.","He is engineer.","He is an engineer.","He an engineer."],2]
],
sp:["Talk about your parents' jobs and the job you want to have.","Ota-onangizning kasbi va xohlagan kasbingiz haqida gapiring."],
ls:["Job charades: act out a job, class guesses.","Kasb pantomimasi: kasbni ijro eting, sinf topsin.",
"In pairs, ask each other about your dream jobs.","Juftlikda bir-biringizning orzu kasbingiz haqida so'rang."]
},

{d:64,w:13,wt:"Family & People",wtUz:"Oila va odamlar",
t:"Countries & Nationalities",tu:"Davlatlar va millatlar",
v:[
["Uzbekistan","O'zbekiston","I am from Uzbekistan."],
["Uzbek","o'zbek","I am Uzbek."],
["England","Angliya","She is from England."],
["English","ingliz","He speaks English."],
["Russia","Rossiya","He is from Russia."],
["China","Xitoy","This tea is from China."],
["Turkey","Turkiya","We traveled to Turkey."],
["Korea","Koreya","I like music from Korea."]
],
dl:[
["Malika","Where are you from?","Qayerliksiz?"],
["Aziz","I am from Uzbekistan. I am Uzbek. Where is your pen pal from?","Men O'zbekistondanman. Men o'zbekman. Sizning maktubdosh do'stingiz qayerlik?"],
["Malika","She is from Turkey. She speaks Turkish and English.","U Turkiyadan. U turk va ingliz tillarida gaplashadi."]
],
g:["Country vs. Nationality",
"The country and the nationality word are often different: Uzbekistan (country) → Uzbek (nationality). Use 'I am from + country' or 'I am + nationality' — both are correct!",
"Davlat nomi va millat",
"Davlat nomi va millat so'zi ko'pincha turlicha bo'ladi: Uzbekistan (davlat) → Uzbek (millat). 'I am from + davlat' yoki 'I am + millat' ishlatiladi — ikkalasi ham to'g'ri!"],
qz:[
["What is the nationality word for 'England'?",["Englishman","English","England","Englisher"],1],
["'Men o'zbekman' in English is ___.",["I am from Uzbek.","I am Uzbekistan.","I am Uzbek.","I Uzbek am."],2],
["What language do people speak in Turkey?",["German","French","Turkish","Korean"],2],
["Choose the correct sentence.",["I from Uzbekistan.","I am from Uzbekistan.","I am Uzbekistan from.","I is from Uzbekistan."],1]
],
sp:["Say where you are from, your nationality, and name 2 other countries and nationalities.","Qayerlik ekaningizni, millatingizni va yana 2 ta davlat va millatni ayting."],
ls:["Class map activity: point to a country and say its nationality.","Sinf xarita mashqi: davlatni ko'rsating va millatini ayting.",
"In pairs, pretend to be from different countries and introduce yourselves.","Juftlikda turli davlatlardan bo'lganingizni tasavvur qilib, o'zingizni tanishtiring."]
},

{d:65,w:13,wt:"Family & People",wtUz:"Oila va odamlar",rev:true,
t:"Week 13 Review",tu:"13-hafta Takrorlash",
qz:[
["'Ona' in English is ___.",["Father","Mother","Sister","Aunt"],1],
["'Mehribon' in English is ___.",["Funny","Kind","Tall","Short"],1],
["Choose the correct sentence.",["I want be a doctor.","I want to be a doctor.","I wants to be a doctor.","I want being a doctor."],1],
["'Men o'zbekman' in English is ___.",["I am from Uzbek.","I am Uzbekistan.","I am Uzbek.","I Uzbek am."],2],
["'Amaki' in English is ___.",["Uncle","Aunt","Cousin","Nephew"],0],
["What is the opposite of 'tall'?",["Old","Young","Short","Kind"],2],
["'Shifokor' in English is ___.",["Nurse","Doctor","Engineer","Farmer"],1],
["What language do people speak in Turkey?",["German","French","Turkish","Korean"],2]
],
sp:["Introduce your family, describe one person, and say where you are from.","Oilangizni tanishtiring, bitta kishini tasvirlang va qayerlik ekaningizni ayting."],
ls:["Class review relay: family, appearance, jobs, and countries mixed quiz.","Sinf takrorlash estafetasi: oila, tashqi ko'rinish, kasblar va davlatlar aralash so'rovi.",
"In pairs, review the week with a mini interview about family and dreams.","Juftlikda haftani oila va orzular haqida kichik intervyu bilan takrorlang."]
}
,

{d:66,w:14,wt:"Food & Health",wtUz:"Ovqat va salomatlik",
t:"Food & Drinks",tu:"Ovqat va ichimliklar",
v:[
["bread","non","I eat bread every morning."],
["rice","guruch","We cook rice with meat."],
["meat","go'sht","My father likes meat."],
["fish","baliq","Fish is healthy food."],
["vegetable","sabzavot","Vegetables are good for you."],
["fruit","meva","I eat fruit every day."],
["apple","olma","An apple a day keeps you healthy."],
["water","suv","I drink water every day."],
["tea","choy","We drink tea in the morning."],
["milk","sut","I drink milk every day."]
],
dl:[
["Malika","What do you usually eat for breakfast?","Odatda nonushtaga nima yeysiz?"],
["Aziz","I usually eat bread and eggs. Do you like vegetables?","Men odatda non va tuxum yeyman. Sabzavotlarni yoqtirasizmi?"],
["Malika","Yes, I love vegetables and fruit.","Ha, men sabzavot va mevani yaxshi ko'raman."]
],
g:["Talking About Food",
"You already know 'like/love' + -ing or noun (I like vegetables), and 'some/any' for food (I have some bread) — use them to talk about what you eat!",
"Ovqat haqida gapirish",
"Siz allaqachon 'like/love' + ot (I like vegetables) va ovqat uchun 'some/any' (I have some bread) ni bilasiz — nima yeyishingiz haqida gapirish uchun ulardan foydalaning!"],
qz:[
["'Go'sht' in English is ___.",["Fish","Chicken","Meat","Egg"],2],
["Choose the correct sentence.",["I like a vegetables.","I like vegetables.","I like an vegetables.","I likes vegetables."],1],
["'Sabzavot' in English is ___.",["Fruit","Vegetable","Bread","Rice"],1],
["'Non' in English is ___.",["Rice","Bread","Meat","Milk"],1]
],
sp:["Talk about your favorite foods and what you usually eat for breakfast.","Sevimli taomlaringiz va odatda nonushtaga nima yeyishingiz haqida gapiring."],
ls:["Food picture flashcards: teacher shows a picture, students shout the word.","Ovqat rasm kartochkalari: rasm ko'rsating, o'quvchilar so'zni aytadi.",
"In pairs, ask 'Do you like...?' about 5 different foods.","Juftlikda 5 xil ovqat haqida 'Do you like...?' deb so'rang."]
},

{d:67,w:14,wt:"Food & Health",wtUz:"Ovqat va salomatlik",
t:"At a Cafe — Ordering Food",tu:"Kafeda — ovqat buyurtma qilish",
v:[
["menu","menyu","Can I see the menu, please?"],
["would like","xohlardim","I would like a pizza, please."],
["order","buyurtma bermoq","I want to order juice."],
["bill","hisob","Can we have the bill, please?"],
["delicious","mazali","This soup is delicious."]
],
dl:[
["Waiter","Welcome! What would you like to order?","Xush kelibsiz! Nima buyurtma qilasiz?"],
["Aziz","I would like a pizza and juice, please.","Menga pitsa va sharbat bering, iltimos."],
["Waiter","Anything else?","Yana biror narsami?"],
["Aziz","No, thank you. Can I have the bill, please?","Yo'q, rahmat. Hisobni bera olasizmi?"]
],
g:["Polite Requests: 'I would like...'",
"To politely ask for something, use 'I would like...' instead of 'I want...': I would like a pizza, please. This is more polite, especially with people you don't know well.",
"Odobli so'rov: 'I would like...'",
"Biror narsani odobli so'rash uchun 'I want...' o'rniga 'I would like...' ishlatiladi: I would like a pizza, please. Bu, ayniqsa yaxshi tanimagan odamlar bilan, ancha odobliroq."],
qz:[
["Choose the polite way to order food.",["I want a pizza.","I would like a pizza, please.","Give me a pizza.","Pizza now!"],1],
["What do you ask for at the end of a meal?",["Menu","Bill","Order","Waiter"],1],
["'Mazali' in English is ___.",["Cold","Hot","Delicious","Hungry"],2],
["Choose the correct sentence.",["I would like ordering juice.","I would like to order juice.","I would like order juice.","I would liking juice."],1]
],
sp:["Role-play ordering food at a restaurant politely.","Restoranda ovqat buyurtma qilishni odobli tarzda ijro eting."],
ls:["Set up a mini class 'cafe' — order using 'I would like...'","Sinfda kichik 'kafe' tashkil qiling.",
"In pairs, act out ordering food and drinks.","Juftlikda ovqat va ichimlik buyurtma qilishni ijro eting."]
},

{d:68,w:14,wt:"Food & Health",wtUz:"Ovqat va salomatlik",
t:"Body & Feelings",tu:"Tana va his-tuyg'ular",
v:[
["head","bosh","My head hurts."],
["hand","qo'l","Wash your hands."],
["leg","oyoq","My leg hurts."],
["happy","baxtli","I am happy today."],
["sad","xafa","She is sad about the news."],
["tired","charchagan","I am tired after school."],
["sick","kasal","I feel sick today."]
],
dl:[
["Doctor","What's the problem?","Muammo nimada?"],
["Aziz","I have a headache. I feel sick.","Boshim og'riyapti. O'zimni kasal his qilyapman."],
["Doctor","You should rest and drink water.","Dam olishingiz va suv ichishingiz kerak."]
],
g:["Talking About How You Feel",
"Use 'have' for a pain (I have a headache) and 'to be' or 'feel' for an emotion (I am sad / I feel sick) — you already know both patterns!",
"O'zingizni qanday his qilishingiz haqida gapirish",
"Og'riq uchun 'have' (I have a headache), his-tuyg'u uchun 'to be' yoki 'feel' (I am sad / I feel sick) ishlatiladi — siz ikkalasini ham bilasiz!"],
qz:[
["'Bosh og'rig'i bor' in English is ___.",["I am a headache.","I have a headache.","I headache.","I feel headache."],1],
["'Charchagan' in English is ___.",["Happy","Sad","Tired","Sick"],2],
["Choose the correct sentence.",["You should to rest.","You should rest.","You should resting.","You shoulds rest."],1],
["What is the opposite of 'happy'?",["Tired","Sick","Sad","Well"],2]
],
sp:["Say how you feel today and describe a time you were sick.","Bugun o'zingizni qanday his qilayotganingizni ayting va kasal bo'lgan vaqtingizni tasvirlang."],
ls:["Body parts game: teacher says a body part, students touch it.","Tana a'zolari o'yini: tana a'zosini ayting, o'quvchilar unga tegadi.",
"In pairs, role-play a doctor visit.","Juftlikda shifokorga borishni ijro eting."]
},

{d:69,w:14,wt:"Food & Health",wtUz:"Ovqat va salomatlik",
t:"Healthy Habits",tu:"Sog'lom odatlar",
v:[
["healthy","sog'lom","Eating fruit is healthy."],
["exercise","jismoniy mashq","I exercise every morning."],
["junk food","foydasiz ovqat","Junk food is not healthy."],
["sleep well","yaxshi uxlamoq","You should sleep well."]
],
dl:[
["Teacher","What should we do to stay healthy?","Sog'lom bo'lish uchun nima qilishimiz kerak?"],
["Student","We should eat fruit and exercise every day.","Biz har kuni meva yeyishimiz va mashq qilishimiz kerak."],
["Teacher","And we shouldn't eat too much junk food.","Va biz juda ko'p foydasiz ovqat yemasligimiz kerak."]
],
g:["Giving Health Advice",
"Use 'should' for good advice and 'shouldn't' for bad ideas — you learned this pattern already: You should exercise. You shouldn't eat too much junk food.",
"Sog'liq bo'yicha maslahat berish",
"Yaxshi maslahat uchun 'should', yomon fikr uchun 'shouldn't' ishlatiladi — bu qolipni allaqachon o'rgangansiz: You should exercise. You shouldn't eat too much junk food."],
qz:[
["Choose the correct advice.",["You should eating well.","You should eat well.","You should to eat well.","You shoulds eat well."],1],
["'Foydasiz ovqat' in English is ___.",["Healthy food","Junk food","Fresh food","Fast food"],1],
["Choose the correct negative advice.",["You shouldn't eating junk food.","You shouldn't eat junk food.","You don't should eat junk food.","You not should eat junk food."],1],
["What should you do to stay healthy?",["Sleep well and exercise","Eat only junk food","Never exercise","Sleep very little"],0]
],
sp:["Give 3 pieces of health advice using should/shouldn't.","Should/shouldn't yordamida 3 ta sog'liq bo'yicha maslahat bering."],
ls:["Class healthy habit poster: in groups, list 3 healthy habits.","Sinf sog'lom odat plakati: guruhlarda 3 ta sog'lom odatni sanab bering.",
"In pairs, create a healthy daily routine together.","Juftlikda birgalikda sog'lom kundalik tartib tuzing."]
},

{d:70,w:14,wt:"Food & Health",wtUz:"Ovqat va salomatlik",rev:true,
t:"Week 14 Review",tu:"14-hafta Takrorlash",
qz:[
["'Go'sht' in English is ___.",["Fish","Chicken","Meat","Egg"],2],
["Choose the polite way to order food.",["I want a pizza.","I would like a pizza, please.","Give me a pizza.","Pizza now!"],1],
["'Bosh og'rig'i bor' in English is ___.",["I am a headache.","I have a headache.","I headache.","I feel headache."],1],
["Choose the correct advice.",["You should eating well.","You should eat well.","You should to eat well.","You shoulds eat well."],1],
["'Sabzavot' in English is ___.",["Fruit","Vegetable","Bread","Rice"],1],
["What do you ask for at the end of a meal?",["Menu","Bill","Order","Waiter"],1],
["'Charchagan' in English is ___.",["Happy","Sad","Tired","Sick"],2],
["'Foydasiz ovqat' in English is ___.",["Healthy food","Junk food","Fresh food","Fast food"],1]
],
sp:["Talk about your favorite meal, how you felt when you were sick, and 2 healthy habits.","Sevimli taomingiz, kasal bo'lganingizda o'zingizni qanday his qilganingiz va 2 ta sog'lom odat haqida gapiring."],
ls:["Class food & health quiz relay.","Sinf ovqat va salomatlik bo'yicha estafeta so'rovi.",
"In pairs, review: order food, then give health advice.","Juftlikda takrorlang: ovqat buyurtma qiling, so'ng sog'liq bo'yicha maslahat bering."]
}
,

{d:71,w:15,wt:"Animals & Nature",wtUz:"Hayvonlar va tabiat",
t:"Animals",tu:"Hayvonlar",
v:[
["dog","it","I have a dog."],
["cat","mushuk","My cat is white."],
["lion","sher","The lion is the king of animals."],
["elephant","fil","The elephant is very big."],
["monkey","maymun","The monkey climbs trees."],
["bird","qush","The bird can fly."],
["fish","baliq","I have a fish in a bowl."],
["horse","ot","He can ride a horse."]
],
dl:[
["Malika","Do you have any pets?","Sizda uy hayvoni bormi?"],
["Aziz","Yes, I have a dog and a cat. What's your favorite wild animal?","Ha, mening itim va mushugim bor. Sevimli yovvoyi hayvoningiz qaysi?"],
["Malika","I like elephants. They are so big.","Menga fillar yoqadi. Ular juda katta."]
],
g:["Talking About Animals",
"You know 'have' for pets (I have a dog) and plurals (dogs, cats) — animal words are also a great place to notice irregular plurals: sheep stays 'sheep', mouse becomes 'mice'.",
"Hayvonlar haqida gapirish",
"Siz uy hayvonlari uchun 'have' (I have a dog) va ko'plikni bilasiz (dogs, cats) — hayvon so'zlari istisno ko'plikni ko'rish uchun ham yaxshi: sheep 'sheep' bo'lib qoladi, mouse esa 'mice' bo'ladi."],
qz:[
["'Sher' in English is ___.",["Tiger","Lion","Bear","Wolf"],1],
["Which animal can fly?",["Dog","Cat","Bird","Horse"],2],
["'Maymun' in English is ___.",["Fox","Wolf","Monkey","Bear"],2],
["Choose the correct sentence.",["I have a dog and a cat.","I has a dog and a cat.","I having a dog and a cat.","I am have a dog and a cat."],0]
],
sp:["Talk about your favorite animal (pet or wild) and describe it.","Sevimli hayvoningiz (uy yoki yovvoyi) haqida gapiring va uni tasvirlang."],
ls:["Animal sounds game: make an animal sound, students name it.","Hayvon ovozlari o'yini: hayvon ovozini chiqaring, o'quvchilar nomlasin.",
"In pairs, ask 'Do you have any pets?'","Juftlikda 'Uy hayvoningiz bormi?' deb so'rang."]
},

{d:72,w:15,wt:"Animals & Nature",wtUz:"Hayvonlar va tabiat",
t:"Nature & Places",tu:"Tabiat va joylar",
v:[
["forest","o'rmon","There are many trees in the forest."],
["mountain","tog'","The mountain is very high."],
["river","daryo","The river flows to the sea."],
["sea","dengiz","The sea is blue."],
["tree","daraxt","The tree is very tall."],
["flower","gul","She picked a flower."]
],
dl:[
["Teacher","Have you ever visited the mountains?","Tog'larga borganmisiz?"],
["Student","Yes, I visited the mountains last summer. There was a beautiful river.","Ha, o'tgan yozda tog'larga borgan edim. U yerda chiroyli daryo bor edi."]
],
g:["Describing Nature",
"You know 'there is/are' for saying what exists (There is a river) and present perfect for experiences (Have you ever visited...?) — combine them to talk about nature!",
"Tabiatni tasvirlash",
"Siz mavjudlikni aytish uchun 'there is/are' (There is a river) va tajriba uchun present perfect (Have you ever visited...?) ni bilasiz — tabiat haqida gapirish uchun ularni birlashtiring!"],
qz:[
["'Daryo' in English is ___.",["Lake","Sea","River","Ocean"],2],
["Choose the correct sentence.",["There is many trees.","There are many trees.","There a tree.","Tree there is."],1],
["'Tog'' in English is ___.",["Forest","Mountain","River","Sea"],1],
["Choose the correct question.",["Have you ever visit the mountains?","Have you ever visited the mountains?","Did you ever visited the mountains?","Do you ever visit the mountains?"],1]
],
sp:["Describe a beautiful place in nature you have visited or want to visit.","Tabiatda tashrif buyurgan yoki bormoqchi bo'lgan chiroyli joyingizni tasvirlang."],
ls:["Nature picture description: describe what there is in a landscape picture.","Tabiat surati tasviri: manzara suratida nima borligini tasvirlang.",
"In pairs, describe a place in nature using 'there is/are'.","Juftlikda tabiatdagi bir joyni 'there is/are' bilan tasvirlang."]
},

{d:73,w:15,wt:"Animals & Nature",wtUz:"Hayvonlar va tabiat",
t:"Comparing Animals",tu:"Hayvonlarni solishtirish",
v:[
["bigger","kattaroq","An elephant is bigger than a dog."],
["faster","tezroq","A cheetah is faster than a lion."],
["the biggest","eng katta","The elephant is the biggest animal here."],
["the fastest","eng tez","The cheetah is the fastest animal."]
],
dl:[
["Teacher","Which is bigger, an elephant or a horse?","Fil kattami yoki ot?"],
["Student","An elephant is bigger than a horse. I think the cheetah is the fastest animal.","Fil otdan kattaroq. Menimcha, gepard eng tez hayvon."]
],
g:["Comparing Animals",
"You already learned comparatives and superlatives (bigger, the biggest) — now use them to compare your favorite animals!",
"Hayvonlarni solishtirish",
"Siz allaqachon comparative va superlative (bigger, the biggest) ni o'rgangansiz — endi sevimli hayvonlaringizni solishtirish uchun ulardan foydalaning!"],
qz:[
["Choose the correct comparative for 'big'.",["More big","Bigger","Biggest","The bigger"],1],
["Choose the correct superlative for 'fast'.",["Faster","Fastest","The fastest","More fast"],2],
["Choose the correct sentence.",["A cheetah is fast than a lion.","A cheetah is faster than a lion.","A cheetah is more fast than a lion.","A cheetah fastest than a lion."],1],
["Which animal is usually the biggest?",["Cat","Dog","Elephant","Bird"],2]
],
sp:["Compare 3 animals using comparatives and superlatives.","3 ta hayvonni comparative va superlative bilan solishtiring."],
ls:["Animal comparison debate: which animal is the strongest/fastest?","Hayvonlarni solishtirish bahsi: qaysi hayvon eng kuchli/eng tez?",
"In pairs, compare yourselves and your family members.","Juftlikda o'zingiz va oila a'zolaringizni solishtiring."]
},

{d:74,w:15,wt:"Animals & Nature",wtUz:"Hayvonlar va tabiat",
t:"Weather & Seasons",tu:"Ob-havo va fasllar",
v:[
["sunny","quyoshli","It's sunny today."],
["rainy","yomg'irli","It's rainy outside."],
["hot","issiq","It's hot in summer."],
["cold","sovuq","It's cold in winter."],
["spring","bahor","Flowers bloom in spring."],
["summer","yoz","We swim in summer."],
["autumn","kuz","Leaves fall in autumn."],
["winter","qish","It snows in winter."]
],
dl:[
["Malika","What's the weather like today?","Bugun ob-havo qanday?"],
["Aziz","It's sunny and warm. Which season do you like best?","Quyoshli va iliq. Sizga qaysi fasl yoqadi?"],
["Malika","I like winter because it snows.","Menga qish yoqadi, chunki qor yog'adi."]
],
g:["Talking About Weather",
"We always use 'it' for weather: It is sunny. It is raining. This is a fixed pattern — always use 'it', never 'the weather is' as the main sentence.",
"Ob-havo haqida gapirish",
"Ob-havo haqida doim 'it' ishlatiladi: It is sunny. It is raining. Bu doimiy qolip — doim 'it' ishlating, asosiy gap sifatida 'the weather is' emas."],
qz:[
["Choose the correct sentence about weather.",["The weather is sunny today.","It is sunny today.","Sunny is today.","Today sunny is."],1],
["Which season comes after summer?",["Winter","Spring","Autumn","Rain"],2],
["'Sovuq' in English is ___.",["Hot","Cold","Sunny","Rainy"],1],
["What happens in winter?",["It's hot.","It snows.","Flowers bloom.","Leaves grow."],1]
],
sp:["Describe the weather in each season in your country.","Mamlakatingizdagi har bir fasldagi ob-havoni tasvirlab bering."],
ls:["Weather forecaster role-play: present tomorrow's weather.","Ob-havo bashoratchisi rolli o'yini: ertangi ob-havoni taqdim eting.",
"In pairs, ask and answer about weather in different seasons.","Juftlikda turli fasllardagi ob-havo haqida so'rang va javob bering."]
},

{d:75,w:15,wt:"Animals & Nature",wtUz:"Hayvonlar va tabiat",rev:true,
t:"Week 15 Review",tu:"15-hafta Takrorlash",
qz:[
["'Sher' in English is ___.",["Tiger","Lion","Bear","Wolf"],1],
["'Daryo' in English is ___.",["Lake","Sea","River","Ocean"],2],
["Choose the correct comparative for 'big'.",["More big","Bigger","Biggest","The bigger"],1],
["Choose the correct sentence about weather.",["The weather is sunny today.","It is sunny today.","Sunny is today.","Today sunny is."],1],
["Which animal can fly?",["Dog","Cat","Bird","Horse"],2],
["'Tog'' in English is ___.",["Forest","Mountain","River","Sea"],1],
["Choose the correct superlative for 'fast'.",["Faster","Fastest","The fastest","More fast"],2],
["Which season comes after summer?",["Winter","Spring","Autumn","Rain"],2]
],
sp:["Describe your favorite animal, a place in nature, and today's weather.","Sevimli hayvoningizni, tabiat joyini va bugungi ob-havoni tasvirlang."],
ls:["Class animal & nature quiz relay.","Sinf hayvonlar va tabiat bo'yicha estafeta so'rovi.",
"In pairs, review animals, nature, and weather.","Juftlikda hayvonlar, tabiat va ob-havoni takrorlang."]
}
,

{d:76,w:16,wt:"Town & Travel",wtUz:"Shahar va sayohat",
t:"Places in Town",tu:"Shahardagi joylar",
v:[
["shop","do'kon","There is a shop near my house."],
["hospital","kasalxona","The hospital is next to the park."],
["bank","bank","My father works at a bank."],
["park","park","Children play in the park."],
["school","maktab","My school is big."],
["market","bozor","My mother buys vegetables at the market."]
],
dl:[
["Malika","Excuse me, where is the nearest hospital?","Kechirasiz, eng yaqin kasalxona qayerda?"],
["Aziz","It's next to the park, near the bank.","U park yonida, bank yaqinida."]
],
g:["Talking About Places in Town",
"Use 'there is/are' to say what's in your town (There is a park) and prepositions of place (next to, near) to say exactly where — you know both already!",
"Shahardagi joylar haqida gapirish",
"Shahringizda nima borligini aytish uchun 'there is/are' (There is a park), aynan qayerda ekanini aytish uchun o'rin predloglari (next to, near) ishlatiladi — siz ikkalasini ham bilasiz!"],
qz:[
["'Kasalxona' in English is ___.",["Bank","Hospital","Shop","Market"],1],
["Choose the correct preposition: 'The bank is ___ the hospital.'",["next to","between","far","in"],0],
["Where do you buy vegetables?",["Bank","Hospital","Market","School"],2],
["Choose the correct sentence.",["There a shop near my house.","There is a shop near my house.","There shop is near my house.","Shop there is near my house."],1]
],
sp:["Describe your town: name 4 important places and where they are.","Shahringizni tasvirlang: 4 ta muhim joyni va ularning qayerda ekanini ayting."],
ls:["Draw a simple town map and label 5 places.","Oddiy shahar xaritasini chizing va 5 ta joyni nomlang.",
"In pairs, ask 'Where is the nearest...?'","Juftlikda 'Eng yaqin ... qayerda?' deb so'rang."]
},

{d:77,w:16,wt:"Town & Travel",wtUz:"Shahar va sayohat",
t:"Asking for Directions",tu:"Yo'l so'rash",
v:[
["turn left","chapga burilmoq","Turn left at the corner."],
["turn right","o'ngga burilmoq","Turn right at the traffic lights."],
["go straight","to'g'riga bormoq","Go straight for two blocks."],
["near","yaqinida","My house is near the park."],
["far","uzoqda","The airport is far from here."]
],
dl:[
["Aziz","Excuse me, how do I get to the station?","Kechirasiz, bekatga qanday borsam bo'ladi?"],
["Passerby","Go straight, then turn left. It's near.","To'g'ri boring, keyin chapga buriling. Yaqin."]
],
g:["Giving Directions",
"We give directions using imperatives, which you already know: Turn left. Go straight. Add 'please' when asking a stranger for directions.",
"Yo'l ko'rsatish",
"Yo'l ko'rsatishda siz allaqachon bilgan imperativlar ishlatiladi: Turn left. Go straight. Notanish odamdan yo'l so'raganda 'please' qo'shing."],
qz:[
["Choose the correct direction for turning left.",["Turn right","Turn left","Go straight","Stop here"],1],
["'Uzoqda' in English is ___.",["Near","Far","Left","Right"],1],
["Choose the correct imperative for directions.",["You turn left.","Turning left.","Turn left.","Turned left."],2],
["Choose the correct sentence.",["My house is near the park.","My house near the park.","My house is nearing the park.","My house near is the park."],0]
],
sp:["Give directions from your school to your house.","Maktabingizdan uyingizgacha yo'l ko'rsating."],
ls:["Blindfolded direction game: give directions, partner follows.","Ko'zi yumuq yo'l o'yini: yo'l ko'rsating, sherigi amal qilsin.",
"In pairs, use a simple map to give directions.","Juftlikda oddiy xarita yordamida yo'l ko'rsating."]
},

{d:78,w:16,wt:"Town & Travel",wtUz:"Shahar va sayohat",
t:"Transport",tu:"Transport",
v:[
["bus","avtobus","I go to school by bus."],
["car","mashina","My father has a new car."],
["train","poyezd","We traveled by train."],
["on foot","piyoda","I go to school on foot."],
["plane","samolyot","They flew by plane."]
],
dl:[
["Malika","How do you go to school?","Maktabga qanday borasiz?"],
["Aziz","I go to school by bus. And you?","Men maktabga avtobusda boraman. Sizchi?"],
["Malika","I go on foot, it's not far.","Men piyoda boraman, uzoq emas."]
],
g:["Talking About Transport",
"Use 'by + transport' (no article): by bus, by car, by train. The exception is walking: 'on foot' (not 'by foot').",
"Transport haqida gapirish",
"'By + transport' ishlatiladi (artiklsiz): by bus, by car, by train. Istisno — piyoda yurish: 'on foot' ('by foot' emas)."],
qz:[
["Choose the correct sentence.",["I go by foot.","I go on foot.","I go with foot.","I go in foot."],1],
["Choose the correct sentence.",["I go to school by the bus.","I go to school by bus.","I go to school with bus.","I go to school on bus."],1],
["'Samolyot' in English is ___.",["Train","Car","Plane","Bus"],2],
["How do you say traveling on your own feet?",["By bus","By car","On foot","By train"],2]
],
sp:["Describe how you and your family members travel to school/work.","Siz va oila a'zolaringiz maktab/ishga qanday borishingizni tasvirlang."],
ls:["Transport survey: ask how classmates come to school.","Transport so'rovi: sinfdoshlaringiz maktabga qanday kelishini so'rang.",
"In pairs, compare your journeys to school.","Juftlikda maktabgacha bo'lgan yo'lingizni solishtiring."]
},

{d:79,w:16,wt:"Town & Travel",wtUz:"Shahar va sayohat",
t:"Travel Experiences",tu:"Sayohat tajribalari",
v:[
["passport","pasport","Don't forget your passport."],
["suitcase","chamadon","I packed my suitcase."],
["abroad","chet elda","She wants to study abroad."],
["culture","madaniyat","I love learning about other cultures."]
],
dl:[
["Malika","Have you ever traveled abroad?","Chet elga sayohat qilganmisiz?"],
["Aziz","Yes, I have visited Turkey. It was a great experience.","Ha, men Turkiyaga borganman. Bu ajoyib tajriba bo'ldi."]
],
g:["Talking About Travel Experiences",
"Use present perfect for travel experiences (Have you ever traveled abroad? I have visited Turkey) and past simple for the specific trip details (We went there last year).",
"Sayohat tajribalari haqida gapirish",
"Sayohat tajribalari uchun present perfect (Have you ever traveled abroad? I have visited Turkey), sayohatning aniq tafsilotlari uchun past simple (We went there last year) ishlatiladi."],
qz:[
["Choose the correct question.",["Did you ever travel abroad?","Have you ever traveled abroad?","Do you ever traveled abroad?","Are you ever traveling abroad?"],1],
["'Pasport' in English is ___.",["Ticket","Passport","Luggage","Suitcase"],1],
["'Madaniyat' in English is ___.",["Culture","Tradition","Custom","Adventure"],0],
["Choose the correct sentence.",["I have visited Turkey last year.","I visited Turkey last year.","I have visit Turkey last year.","I was visited Turkey last year."],1]
],
sp:["Talk about a place you have visited or want to visit.","Tashrif buyurgan yoki bormoqchi bo'lgan joyingiz haqida gapiring."],
ls:["'Have you ever...?' mingle about travel.","Sayohat haqida 'Have you ever...?' aralashuvi.",
"In pairs, plan an imaginary trip abroad.","Juftlikda xayoliy chet el sayohatini rejalashtiring."]
},

{d:80,w:16,wt:"Town & Travel",wtUz:"Shahar va sayohat",rev:true,
t:"Week 16 Review",tu:"16-hafta Takrorlash",
qz:[
["'Kasalxona' in English is ___.",["Bank","Hospital","Shop","Market"],1],
["Choose the correct direction for turning left.",["Turn right","Turn left","Go straight","Stop here"],1],
["Choose the correct sentence.",["I go by foot.","I go on foot.","I go with foot.","I go in foot."],1],
["Choose the correct question.",["Did you ever travel abroad?","Have you ever traveled abroad?","Do you ever traveled abroad?","Are you ever traveling abroad?"],1],
["'Uzoqda' in English is ___.",["Near","Far","Left","Right"],1],
["'Samolyot' in English is ___.",["Train","Car","Plane","Bus"],2],
["Where do you buy vegetables?",["Bank","Hospital","Market","School"],2],
["'Madaniyat' in English is ___.",["Culture","Tradition","Custom","Adventure"],0]
],
sp:["Give directions to a place in town, and talk about a travel experience.","Shahardagi bir joyga yo'l ko'rsating va sayohat tajribangiz haqida gapiring."],
ls:["Class 'lost tourist' role-play.","Sinf 'adashgan sayyoh' rolli o'yini.",
"In pairs, review town places, directions, and transport.","Juftlikda shahar joylari, yo'nalishlar va transportni takrorlang."]
}
,

{d:81,w:17,wt:"Hobbies & Friends",wtUz:"Hobbi va do'stlar",
t:"Hobbies & Free Time",tu:"Hobbi va bo'sh vaqt",
v:[
["football","futbol","I play football every weekend."],
["swimming","suzish","Swimming is my favorite sport."],
["drawing","rasm chizish","Drawing is a relaxing hobby."],
["chess","shaxmat","I can play chess."],
["free time","bo'sh vaqt","What do you do in your free time?"]
],
dl:[
["Malika","What's your hobby?","Sizning hobbingiz nima?"],
["Aziz","My hobby is playing football. I like swimming too. What about you?","Mening hobbim — futbol o'ynash. Suzishni ham yoqtiraman. Sizchi?"],
["Malika","I like drawing.","Menga rasm chizish yoqadi."]
],
g:["Talking About Hobbies",
"After 'like/love', use verb + -ing for hobbies: I like swimming. I love drawing. You already know this pattern!",
"Hobbilar haqida gapirish",
"'Like/love' dan keyin hobbilar uchun fe'l + ing ishlatiladi: I like swimming. I love drawing. Siz bu qolipni allaqachon bilasiz!"],
qz:[
["Choose the correct sentence.",["I like swim.","I like swimming.","I like to swimming.","I likes swimming."],1],
["'Rasm chizish' in English is ___.",["Swimming","Drawing","Chess","Football"],1],
["'Bo'sh vaqt' in English is ___.",["Hobby","Free time","Sport","Game"],1],
["Choose the correct sentence.",["I can play chess.","I can plays chess.","I can playing chess.","I cans play chess."],0]
],
sp:["Talk about your hobbies and free time activities.","Hobbilaringiz va bo'sh vaqt mashg'ulotlaringiz haqida gapiring."],
ls:["Hobby mingle: find classmates who share your hobby.","Hobbi aralashuvi: hobbisi sizniki bilan bir xil sinfdoshlarni toping.",
"In pairs, discuss your hobbies.","Juftlikda hobbilaringizni muhokama qiling."]
},

{d:82,w:17,wt:"Hobbies & Friends",wtUz:"Hobbi va do'stlar",
t:"Technology",tu:"Texnologiya",
v:[
["phone","telefon","My phone is new."],
["call","qo'ng'iroq qilmoq","I will call you later."],
["internet","internet","I use the internet every day."],
["video call","video qo'ng'iroq","We made a video call to grandma."]
],
dl:[
["Malika","Can I call you tonight?","Bugun kechqurun sizga qo'ng'iroq qilsam bo'ladimi?"],
["Aziz","Sure! Or we can make a video call.","Albatta! Yoki video qo'ng'iroq qilsak ham bo'ladi."]
],
g:["Talking About Technology",
"Use 'will' for future plans with technology (I will call you) and present simple for habits (I use the internet every day) — both patterns you already know!",
"Texnologiya haqida gapirish",
"Texnologiya bilan bog'liq kelajak rejalar uchun 'will' (I will call you), odatlar uchun present simple (I use the internet every day) ishlatiladi — ikkalasini ham bilasiz!"],
qz:[
["Choose the correct sentence.",["I will calling you.","I will call you.","I calling you will.","I am will call you."],1],
["'Internet' in English is ___.",["Phone","Internet","Call","Video"],1],
["Choose the correct sentence for a habit.",["I use the internet every day.","I am using the internet every day.","I used the internet every day.","I will use the internet every day."],0],
["What do we call talking and seeing someone on the phone?",["A call","A video call","A text","An email"],1]
],
sp:["Talk about how you use your phone every day.","Telefoningizdan har kuni qanday foydalanishingiz haqida gapiring."],
ls:["Class tech survey: how often do you use social media?","Sinf texnologiya so'rovi.",
"In pairs, role-play arranging a video call.","Juftlikda video qo'ng'iroq tashkil qilishni ijro eting."]
},

{d:83,w:17,wt:"Hobbies & Friends",wtUz:"Hobbi va do'stlar",
t:"Friendship",tu:"Do'stlik",
v:[
["friendship","do'stlik","Friendship is very important."],
["trust","ishonmoq","I trust my best friend."],
["help","yordam bermoq","Friends help each other."],
["share","bo'lishmoq","We share our problems."]
],
dl:[
["Aziz","Malika is my best friend. We trust each other.","Malika mening eng yaqin do'stim. Biz bir-birimizga ishonamiz."],
["Teacher","That's wonderful! Good friends help and support each other.","Bu ajoyib! Yaxshi do'stlar bir-biriga yordam beradi va qo'llab-quvvatlaydi."]
],
g:["Each Other: Talking About Friendship",
"Use 'each other' when two people do the same thing to one another: We help each other. They trust each other.",
"Each Other: do'stlik haqida gapirish",
"Ikki kishi bir-biriga bir xil ishni qilganda 'each other' ishlatiladi: We help each other. They trust each other."],
qz:[
["'Ishonmoq' in English is ___.",["Trust","Share","Help","Like"],0],
["Choose the correct sentence.",["We help ourselves every day.","We help each other every day.","We help himself every day.","We help herself every day."],1],
["'Do'stlik' in English is ___.",["Friend","Friendship","Trust","Help"],1],
["Choose the correct sentence.",["Friends share ourselves problems.","Friends share their problems.","Friends shares their problems.","Friends sharing their problems."],1]
],
sp:["Talk about what makes a good friend.","Yaxshi do'st qanday bo'lishi kerakligi haqida gapiring."],
ls:["Friendship circle: name one quality of a good friend.","Do'stlik doirasi: yaxshi do'stning bir xususiyatini ayting.",
"In pairs, introduce your best friend.","Juftlikda eng yaqin do'stingizni tanishtiring."]
},

{d:84,w:17,wt:"Hobbies & Friends",wtUz:"Hobbi va do'stlar",
t:"Making Plans with Friends",tu:"Do'stlar bilan reja tuzish",
v:[
["would you like to","xohlaysizmi","Would you like to come to the cinema?"],
["let's","keling","Let's go to the park."],
["party","ziyofat","There's a party this Friday."]
],
dl:[
["Aziz","Would you like to come to my birthday party?","Tug'ilgan kunim ziyofatiga kelasizmi?"],
["Malika","I'd love to! What time?","Albatta xohlayman! Soat nechada?"],
["Aziz","Let's meet at five o'clock.","Soat beshda uchrashaylik."]
],
g:["Invitations: Would you like to...?",
"To invite someone politely, use 'Would you like to + verb?' To accept: 'I'd love to!' Use 'Let's + verb' to suggest doing something together.",
"Taklif qilish: Would you like to...?",
"Kimnidir odobli taklif qilish uchun 'Would you like to + fe'l?' ishlatiladi. Qabul qilish: 'I'd love to!' Birga biror narsa qilishni taklif qilish uchun 'Let's + fe'l' ishlatiladi."],
qz:[
["Choose the correct way to invite someone.",["You come to my party?","Would you like to come to my party?","Coming my party?","You want come party?"],1],
["Choose the correct way to accept enthusiastically.",["Sorry, I can't.","Maybe next time.","I'd love to!","No, thank you."],2],
["Choose the correct suggestion.",["Let's to go!","Let's go!","Let we go!","Lets going!"],1],
["'Ziyofat' in English is ___.",["Party","Friend","Plan","Game"],0]
],
sp:["Invite your partner to an event and role-play accepting.","Sherigingizni tadbirga taklif qiling va qabul qilishni ijro eting."],
ls:["Class party planning: plan a class party together.","Sinf ziyofatini birgalikda rejalashtiring.",
"In pairs, practice inviting each other to events.","Juftlikda bir-biringizni tadbirlarga taklif qilishni mashq qiling."]
},

{d:85,w:17,wt:"Hobbies & Friends",wtUz:"Hobbi va do'stlar",rev:true,
t:"Week 17 Review",tu:"17-hafta Takrorlash",
qz:[
["Choose the correct sentence.",["I like swim.","I like swimming.","I like to swimming.","I likes swimming."],1],
["Choose the correct sentence.",["I will calling you.","I will call you.","I calling you will.","I am will call you."],1],
["'Ishonmoq' in English is ___.",["Trust","Share","Help","Like"],0],
["Choose the correct way to invite someone.",["You come to my party?","Would you like to come to my party?","Coming my party?","You want come party?"],1],
["'Rasm chizish' in English is ___.",["Swimming","Drawing","Chess","Football"],1],
["'Internet' in English is ___.",["Phone","Internet","Call","Video"],1],
["Choose the correct sentence.",["We help ourselves every day.","We help each other every day.","We help himself every day.","We help herself every day."],1],
["Choose the correct way to accept enthusiastically.",["Sorry, I can't.","Maybe next time.","I'd love to!","No, thank you."],2]
],
sp:["Talk about your hobbies, how you use technology, and invite a friend to do something.","Hobbilaringiz, texnologiyadan qanday foydalanishingiz haqida gapiring va do'stingizni biror narsaga taklif qiling."],
ls:["Class 'plan a weekend' game.","Sinf 'dam olish kunini rejalashtirish' o'yini.",
"In pairs, review hobbies, technology, and friendship.","Juftlikda hobbi, texnologiya va do'stlikni takrorlang."]
}
,

{d:86,w:18,wt:"Our World",wtUz:"Bizning dunyomiz",
t:"Culture & Traditions",tu:"Madaniyat va an'analar",
v:[
["festival","bayram","Navruz is an important festival."],
["tradition","an'ana","Every country has its own traditions."],
["celebrate","nishonlamoq","We celebrate Navruz every spring."],
["hospitality","mehmondo'stlik","Uzbek people are famous for their hospitality."]
],
dl:[
["Malika","What is your favorite national holiday?","Sevimli milliy bayramingiz nima?"],
["Aziz","I love Navruz. We celebrate it with traditional food and songs.","Menga Navruz yoqadi. Biz uni milliy taomlar va qo'shiqlar bilan nishonlaymiz."]
],
g:["Talking About Culture",
"You know 'is famous for' + noun/gerund (Uzbek people are famous for their hospitality) and 'celebrate' + noun (We celebrate Navruz) — use them to talk about your culture!",
"Madaniyat haqida gapirish",
"Siz 'is famous for' + ot/gerund (Uzbek people are famous for their hospitality) va 'celebrate' + ot (We celebrate Navruz) ni bilasiz — o'z madaniyatingiz haqida gapirish uchun ulardan foydalaning!"],
qz:[
["'Bayram' in English is ___.",["Tradition","Festival","Culture","Custom"],1],
["Choose the correct sentence.",["We celebrate Navruz every spring.","We celebrating Navruz every spring.","We celebrates Navruz every spring.","We celebrated Navruz every spring always."],0],
["'Mehmondo'stlik' in English is ___.",["Hospitality","Respect","Heritage","Identity"],0],
["What do we call customs passed down through generations?",["Festival","Tradition","Celebration","Culture"],1]
],
sp:["Describe a traditional celebration or custom from your culture.","O'z madaniyatingizdan an'anaviy bayram yoki urf-odatni tasvirlab bering."],
ls:["Culture show and tell: describe an object representing your culture.","Madaniyat namoyishi: o'z madaniyatingizni ifodalovchi buyumni tasvirlang.",
"In pairs, discuss your favorite national holiday.","Juftlikda sevimli milliy bayramingiz haqida gaplashing."]
},

{d:87,w:18,wt:"Our World",wtUz:"Bizning dunyomiz",
t:"Protecting the Environment",tu:"Atrof-muhitni himoya qilish",
v:[
["environment","atrof-muhit","We must protect the environment."],
["recycle","qayta ishlamoq","We should recycle paper and plastic."],
["pollution","ifloslanish","Air pollution is a big problem."],
["plant a tree","daraxt ekmoq","We planted a tree at school."]
],
dl:[
["Teacher","What can we do to protect the environment?","Atrof-muhitni himoya qilish uchun nima qilishimiz mumkin?"],
["Student","We should recycle and plant trees. We mustn't pollute rivers.","Biz qayta ishlashimiz va daraxt ekishimiz kerak. Daryolarni ifloslantirmasligimiz kerak."]
],
g:["Talking About the Environment",
"Use 'should' for good environmental habits and 'must/mustn't' for strong rules — you know these already: We should recycle. We mustn't pollute rivers.",
"Atrof-muhit haqida gapirish",
"Yaxshi ekologik odatlar uchun 'should', kuchli qoidalar uchun 'must/mustn't' ishlatiladi — siz bularni allaqachon bilasiz: We should recycle. We mustn't pollute rivers."],
qz:[
["'Qayta ishlamoq' in English is ___.",["Reuse","Reduce","Recycle","Waste"],2],
["Choose the correct sentence for a strong rule.",["We should protect endangered animals.","We must protect endangered animals.","We can protect endangered animals.","We recycle endangered animals."],1],
["'Ifloslanish' in English is ___.",["Pollution","Recycling","Environment","Nature"],0],
["What should we plant to help the environment?",["Trees","Plastic","Cars","Factories"],0]
],
sp:["Talk about 3 things people should do to protect the environment.","Atrof-muhitni himoya qilish uchun odamlar qilishi kerak bo'lgan 3 ta ish haqida gapiring."],
ls:["Class 'green pledge': promise one eco-friendly action.","Sinf 'yashil va'dasi': bitta ekologik toza harakat qilishga va'da bering.",
"In pairs, discuss environmental problems and solutions.","Juftlikda ekologik muammolar va yechimlarni muhokama qiling."]
},

{d:88,w:18,wt:"Our World",wtUz:"Bizning dunyomiz",
t:"Careers & Future Ambitions",tu:"Kasblar va kelajak orzulari",
v:[
["career","karyera","She has a successful career."],
["dream job","orzu kasb","My dream job is to be a doctor."],
["qualification","malaka","You need good qualifications for this job."]
],
dl:[
["Malika","What's your dream job?","Orzu kasbingiz nima?"],
["Aziz","I want to be an engineer. I will study hard to achieve my goal.","Men muhandis bo'lishni xohlayman. Maqsadimga erishish uchun qattiq o'qiyman."]
],
g:["Talking About Your Future",
"Combine 'want to be' (I want to be an engineer) with 'will' for determination (I will study hard) — both patterns you already know, now used to talk about your dreams!",
"Kelajagingiz haqida gapirish",
"'Want to be' (I want to be an engineer) bilan qat'iyat uchun 'will' (I will study hard) ni birlashtiring — ikkalasini ham bilasiz, endi orzularingiz haqida gapirish uchun ishlating!"],
qz:[
["'Orzu kasb' in English is ___.",["Career","Dream job","Qualification","Salary"],1],
["Choose the correct sentence.",["I want to be an engineer.","I want be an engineer.","I want being an engineer.","I wants to be an engineer."],0],
["'Malaka' in English is ___.",["Skill","Qualification","Experience","Salary"],1],
["Choose the correct sentence about determination.",["I study hard to achieve my goal.","I will study hard to achieve my goal.","I studying hard to achieve my goal.","I studied hard to achieve my goal always."],1]
],
sp:["Talk about your dream job and what you will do to achieve it.","Orzu kasbingiz va unga erishish uchun nima qilishingiz haqida gapiring."],
ls:["Job charades: act out a job, class guesses.","Kasb pantomimasi: kasbni ijro eting, sinf topsin.",
"In pairs, discuss your dream jobs and goals.","Juftlikda orzu kasbingiz va maqsadlaringiz haqida gaplashing."]
},

{d:89,w:18,wt:"Our World",wtUz:"Bizning dunyomiz",
t:"Giving Opinions",tu:"Fikr bildirish",
v:[
["I think","menimcha","I think English is important."],
["agree","rozi bo'lmoq","I agree with you."],
["disagree","rozi bo'lmaslik","I disagree with that idea."],
["because","chunki","I think it's good because it helps us learn."]
],
dl:[
["Teacher","What's your opinion about homework?","Uy vazifasi haqida fikringiz qanday?"],
["Student1","I think homework is good because it helps us remember what we learned.","Menimcha, uy vazifasi yaxshi, chunki u o'rganganlarimizni eslab qolishga yordam beradi."],
["Student2","I disagree. I think it's too much sometimes.","Men rozi emasman. Menimcha, ba'zan u juda ko'p."]
],
g:["Expressing Opinions",
"Start with 'I think...' to share your opinion, and always give a reason with 'because'. To disagree politely, say 'I disagree' or 'Actually, I don't agree.'",
"Fikr bildirish",
"Fikringizni bildirish uchun 'I think...' bilan boshlang va doim 'because' bilan sabab keltiring. Odobli rad etish uchun 'I disagree' yoki 'Actually, I don't agree' deng."],
qz:[
["Choose the correct way to start giving your opinion.",["I opinion that...","I think...","My think is...","I am opinion..."],1],
["Choose the correct way to disagree politely.",["I disagree.","No! You're wrong!","That's stupid.","I hate that idea."],0],
["Choose the correct sentence with a reason.",["I think it's good because it helps us learn.","I think it's good, it helps us learn.","I think it's good so it helps us learn.","I think it's good but it helps us learn."],0],
["'Rozi bo'lmoq' in English is ___.",["Disagree","Agree","Think","Because"],1]
],
sp:["Give your opinion about a school topic and give a reason.","Maktab mavzusi haqida fikringizni bildiring va sabab keltiring."],
ls:["Class debate: discuss a simple topic in two groups.","Sinf bahsi: ikki guruhda oddiy mavzuni muhokama qiling.",
"In pairs, discuss and give opinions on 2 different topics.","Juftlikda 2 xil mavzu bo'yicha fikr bildiring."]
},

{d:90,w:18,wt:"Our World",wtUz:"Bizning dunyomiz",rev:true,final:true,
t:"Final Test — SpeakUp Graduation",tu:"Yakuniy sinov — SpeakUp Bitiruvi",
qz:[
["How do you say 'Salom' in English?",["Goodbye","Hello","Sorry","No"],1],
["Choose the correct word: 'She ___ a teacher.'",["am","is","are","be"],1],
["What is the past tense of 'go'?",["Goed","Went","Gone","Going"],1],
["Choose the correct comparative for 'tall'.",["More tall","Taller","Tallest","The taller"],1],
["Choose the correct sentence about a plan.",["I go to visit my aunt.","I am going to visit my aunt.","I going to visit my aunt.","I am go to visit my aunt."],1],
["Choose the correct question about experience.",["Did you ever visit London?","Have you ever visited London?","Do you ever visited London?","Are you ever visiting London?"],1],
["Choose the correct first conditional.",["If you study, you pass.","If you study, you will pass.","If you will study, you pass.","If you studied, you will pass."],1],
["Choose the correct passive sentence.",["English speaks worldwide.","English is spoken worldwide.","English spoken worldwide.","English is speaking worldwide."],1],
["Choose the correct sentence.",["A doctor is a person which helps sick people.","A doctor is a person who helps sick people.","A doctor is a person where helps sick people.","A doctor is a person whose helps sick people."],1],
["What does 'mustn't' mean?",["Not necessary","Forbidden","Optional","Recommended"],1],
["Choose the correct sentence.",["There is two windows.","There are two windows.","There a window.","Windows there are."],1],
["What is the plural of 'child'?",["Childs","Childes","Children","Childies"],2],
["Choose the correct word: '___ books do you have?'",["How much","How many","How","What"],1],
["Choose the correct second conditional.",["If I win the lottery, I will travel.","If I won the lottery, I would travel.","If I win the lottery, I would travel.","If I would win, I travel."],1],
["Choose the correct sentence about now.",["I read a book now.","I am reading a book now.","I reading a book now.","I reads a book now."],1],
["'Shifokor' in English is ___.",["Nurse","Doctor","Engineer","Farmer"],1],
["Choose the polite way to order food.",["I want a pizza.","I would like a pizza, please.","Give me a pizza.","Pizza now!"],1],
["Choose the correct way to invite someone.",["You come to my party?","Would you like to come to my party?","Coming my party?","You want come party?"],1],
["Choose the correct sentence for a strong rule.",["We should protect endangered animals.","We must protect endangered animals.","We can protect endangered animals.","We recycle endangered animals."],1],
["Choose the correct way to start giving your opinion.",["I opinion that...","I think...","My think is...","I am opinion..."],1]
],
sp:["Give a 3-minute final speech: introduce yourself, describe your family and hobbies, tell a story about a memorable experience, give your opinion on an important topic, and talk about your future plans and dream career.","3 daqiqalik yakuniy nutq so'zlang: o'zingizni tanishtiring, oilangiz va hobbilaringizni tasvirlang, unutilmas voqea haqida hikoya ayting, muhim mavzu bo'yicha fikringizni bildiring va kelajak rejalaringiz hamda orzu kasbingiz haqida gapiring."],
ls:["Host a class 'graduation ceremony': each student gives a 1-minute speech about their English journey.","Sinf 'bitiruv marosimi'ni o'tkazing: har bir o'quvchi o'zining ingliz tili safari haqida 1 daqiqalik nutq so'zlaydi.",
"In pairs, interview each other one last time covering topics from the whole course, then present your partner to the class.","Juftlikda butun kurs mavzularini qamrab olgan holda bir-biringizni oxirgi marta intervyu qiling, so'ng sherigingizni sinfga taqdim eting."]
}

];

if (typeof module !== "undefined") module.exports = CURRICULUM;
