/* TRUCK TALK ENGLISH — Grammar Book
   18 units across 6 categories, written for Uzbek-speaking drivers: every
   "mistake" callout targets a real, specific difference between Uzbek and
   English grammar (word order, articles, do-support, etc.), not a generic
   ESL note. */
const GRAMMAR = [

{id:"to-be", cat:"Foundations", title:"The Verb \"To Be\" — am / is / are", titleUz:"\"To be\" fe'li — am / is / are",
ruleUz:"Ingliz tilida 'bo'lmoq' fe'li shaxsga qarab am, is yoki are bo'ladi va deyarli har doim gapda bo'lishi shart.",
explain:[
"In English, the verb \"to be\" changes depending on who you're talking about: I am, he/she/it is, you/we/they are. Unlike Uzbek, English almost never drops this verb — even in short sentences like \"I am tired\" or \"The load is heavy,\" the am/is/are must be there.",
"In speech, English speakers usually shorten it: I'm, you're, he's, she's, it's, we're, they're. Both forms are correct — contractions just sound more natural."
],
examples:[["I am a truck driver.","Men haydovchiman."],["You are late today.","Siz bugun kechikdingiz."],["He is at the weigh station.","U tarozi bekatida."],["The trailer is heavy.","Tirkama og'ir."],["We are ready to go.","Biz jo'nashga tayyormiz."]],
mistakeWrong:"I driver. The load heavy.",
mistakeRight:"I am a driver. The load is heavy.",
mistakeWhy:"Uzbek often leaves out 'bo'lmoq' in the present tense (u haydovchi — literally \"he driver\"), so it feels natural to drop am/is/are in English too. English needs it every time.",
quiz:[
["Complete: 'I ___ a truck driver.'",["is","am","are","be"],1],
["Complete: 'The road ___ icy today.'",["am","are","is","be"],2],
["Complete: 'We ___ ready for the trip.'",["is","am","are","be"],2],
["Which sentence is correct?",["He driver.","He a driver.","He is a driver.","He are a driver."],2],
["Complete: 'They ___ at the dock now.'",["is","am","are","be"],2],
["The short form of 'she is' is:",["she's","shes'","she're","she'r"],0]]},

{id:"articles", cat:"Foundations", title:"Nouns, Articles & Plurals — a / an / the", titleUz:"Otlar, artikllar va ko'plik — a / an / the",
ruleUz:"O'zbek tilida artikl (a, an, the) yo'q, shuning uchun bu ingliz tilidagi eng qiyin qoidalardan biri.",
explain:[
"Uzbek has no articles at all — this is genuinely one of the hardest parts of English for Uzbek speakers, so don't worry if it takes time. Use 'a' or 'an' the first time you mention something, when it could be any one of many: \"I need a wrench\" (any wrench). Use 'an' before a vowel sound: an inspector, an hour.",
"Use 'the' when both speakers already know which one you mean: \"Park at the truck stop\" (the specific one you both know), or when there's only one: \"the highway we're on.\"",
"For general statements about a whole category (plural, no specific one), use no article at all: \"Trucks need regular inspections\" (trucks in general)."
],
examples:[["I need a wrench.","Menga kalit kerak (har qanday)."],["Call an inspector.","Inspektorga qo'ng'iroq qiling."],["Park at the truck stop we always use.","Doim foydalanadigan bekatimizga to'xtang."],["Trucks need regular inspections.","Yuk mashinalariga muntazam tekshiruv kerak."],["The weigh station is open.","Tarozi bekati ochiq (aniq bittasi)."]],
mistakeWrong:"I saw inspector. Truck is on highway.",
mistakeRight:"I saw an inspector. The truck is on the highway.",
mistakeWhy:"Since Uzbek has no equivalent word, it's easy to skip articles entirely. Native English speakers notice missing articles immediately, even though the sentence is still understandable.",
quiz:[
["'I need ___ wrench.' (any wrench)",["a","an","the","(no article)"],0],
["'Call ___ inspector.' (starts with a vowel sound)",["a","an","the","(no article)"],1],
["'Park at ___ truck stop we always use.' (a specific one)",["a","an","the","(no article)"],2],
["'___ trucks need regular inspections.' (trucks in general)",["A","An","The","(no article)"],3],
["Which is correct?",["I am driver.","I am a driver.","I am the driver of.","I driver am."],1],
["'She works at ___ warehouse downtown.' (one specific warehouse)",["a","an","the","(no article)"],2]]},

{id:"present-simple", cat:"Tenses", title:"Present Simple — Routines, Facts & Rules", titleUz:"Hozirgi oddiy zamon — odatlar, faktlar va qoidalar",
ruleUz:"Present Simple odatiy harakatlar, faktlar va qoidalar uchun ishlatiladi; he/she/it bilan fe'lga -s qo'shiladi.",
explain:[
"Use the present simple for routines, facts, and rules that are always true — not just what's happening this second. \"I check my truck every morning\" (a routine). \"The speed limit changes here\" (a fact). \"Truckers file logs every day\" (a rule).",
"The only tricky part: with he/she/it, add -s (or -es) to the verb: I check → he checks, I go → she goes, I do → it does."
],
examples:[["I check my truck every morning.","Men har kuni ertalab mashinamni tekshiraman."],["He drives for Speedline Logistics.","U Speedline Logistics uchun haydaydi."],["The speed limit changes here.","Bu yerda tezlik chegarasi o'zgaradi."],["She works the night shift.","U tungi smenada ishlaydi."],["Drivers file their logs every day.","Haydovchilar har kuni jurnal to'ldiradilar."]],
mistakeWrong:"He drive fast. She check the oil.",
mistakeRight:"He drives fast. She checks the oil.",
mistakeWhy:"Uzbek verb endings don't work like English -s. It's easy to forget the -s on he/she/it — but native speakers hear a missing -s immediately, the same way you'd hear a wrong word ending in Uzbek.",
quiz:[
["'He ___ (drive) a flatbed truck.'",["drive","drives","driving","drove"],1],
["'I ___ (check) my mirrors before every trip.'",["check","checks","checking","checked"],0],
["'The company ___ (pay) drivers weekly.'",["pay","pays","paying","paid"],1],
["'She ___ (not/like) driving at night.'",["not like","don't like","doesn't like","isn't like"],2],
["Which sentence describes a routine correctly?",["He check the truck daily.","He checks the truck daily.","He checking the truck daily.","He checked the truck daily."],1],
["'Dispatchers ___ (assign) new loads every morning.'",["assign","assigns","assigning","assigned"],0]]},

{id:"present-continuous", cat:"Tenses", title:"Present Continuous — Right Now", titleUz:"Hozirgi davomli zamon — hozir sodir bo'layotgan ish",
ruleUz:"am/is/are + fe'l-ing shakli hozir sodir bo'layotgan yoki vaqtinchalik harakatni bildiradi.",
explain:[
"Use am/is/are + verb-ing for something happening right now, or a temporary situation (not a permanent routine). \"I am driving on I-40 right now.\" \"We are waiting at the dock.\" \"He is fixing the brakes.\"",
"Compare with present simple: \"I drive a truck\" (my job, a routine) vs. \"I am driving to Dallas\" (right now, this trip). Both are correct — they just answer different questions."
],
examples:[["I am driving on I-40 right now.","Men hozir I-40 bo'ylab ketyapman."],["We are waiting at the dock.","Biz maydonchada kutyapmiz."],["He is fixing the brakes.","U tormozlarni tuzatyapti."],["The dispatcher is calling me.","Dispetcher menga qo'ng'iroq qilyapti."],["They are loading the trailer now.","Ular hozir tirkamani yuklashyapti."]],
mistakeWrong:"I drive to Dallas now. (for something happening this moment)",
mistakeRight:"I am driving to Dallas now.",
mistakeWhy:"Because Uzbek's -yap- present tense often maps to English present simple in learners' minds, it's common to skip am/is/are + -ing for 'right now' actions. Use present simple only for routines and facts.",
quiz:[
["'I ___ (drive) right now — call me back later.'",["drive","am driving","drives","drove"],1],
["'They ___ (load) the truck at the moment.'",["load","loads","are loading","loaded"],2],
["Which describes an action happening right now?",["I check the engine every week.","I am checking the engine right now.","I checked the engine.","I check engines."],1],
["'She ___ (talk) to dispatch — please wait.'",["talk","talks","is talking","talked"],2],
["'We usually ___ (eat) at this truck stop.' (routine, not now)",["eat","are eating","eats","ate"],0],
["'Right now, the mechanic ___ (fix) my tire.'",["fix","fixes","is fixing","fixed"],2]]},

{id:"past-simple", cat:"Tenses", title:"Past Simple — Reporting What Happened", titleUz:"O'tgan oddiy zamon — sodir bo'lgan voqeani aytib berish",
ruleUz:"Muntazam fe'llarga -ed qo'shiladi, lekin ko'p muhim fe'llar tartibsiz (noto'g'ri) shaklga ega.",
explain:[
"Use the past simple to report something that already happened — an inspection, an incident, a delivery. Regular verbs add -ed: check → checked, inspect → inspected, arrive → arrived.",
"Many common verbs are irregular and don't follow the -ed rule — these just have to be memorized: go → went, have → had, see → saw, drive → drove, hit → hit, break → broke, give → gave, find → found, tell → told."
],
examples:[["I drove to Dallas yesterday.","Kecha Dallasga haydab bordim."],["The officer checked my logbook.","Ofitser jurnalimni tekshirdi."],["We arrived two hours late.","Biz ikki soat kech yetib keldik."],["I saw an accident on the highway.","Shosseda avariyani ko'rdim."],["The trailer broke down near mile marker 90.","Tirkama 90-milya belgisi yaqinida buzildi."]],
mistakeWrong:"I drive to Dallas yesterday. I seen an accident.",
mistakeRight:"I drove to Dallas yesterday. I saw an accident.",
mistakeWhy:"Two common slips: using the base verb instead of the past form after a past time word like 'yesterday,' and mixing up the past simple (saw) with the past participle (seen), which needs 'have' — 'I have seen,' not 'I seen.'",
quiz:[
["'I ___ (drive) to Dallas yesterday.'",["drive","drives","drove","driven"],2],
["'The officer ___ (check) my logbook.'",["check","checks","checked","checking"],2],
["Past tense of 'see' is:",["seed","saw","seen","seeing"],1],
["'We ___ (arrive) two hours late.'",["arrive","arrives","arrived","arriving"],2],
["Past tense of 'go' is:",["goed","went","gone","going"],1],
["Which sentence correctly reports a past event?",["Yesterday I drive 400 miles.","Yesterday I drove 400 miles.","Yesterday I driving 400 miles.","Yesterday I driven 400 miles."],1]]},

{id:"future", cat:"Tenses", title:"Talking About the Future — will / going to", titleUz:"Kelasi zamon haqida gapirish — will / going to",
ruleUz:"'Will' qaror va va'dalar uchun, 'going to' esa oldindan rejalashtirilgan ishlar uchun ishlatiladi.",
explain:[
"Use 'will' for decisions made right now, promises, and predictions: \"I will call dispatch\" (deciding now), \"I will be there by 6\" (a promise). Will + base verb, no -ing.",
"Use 'going to' for plans you already made before this moment: \"I'm going to deliver this afternoon\" (already planned). Structure: am/is/are + going to + base verb.",
"In everyday speech the difference is small, but 'going to' sounds more like a fixed plan, while 'will' sounds more like a decision or offer in the moment."
],
examples:[["I will call dispatch now.","Hozir dispetcherga qo'ng'iroq qilaman."],["I'm going to deliver this afternoon.","Bugun tushdan keyin yetkazib beraman (reja)."],["It will rain later today.","Bugun keyinroq yomg'ir yog'adi."],["We are going to stop at the next rest area.","Keyingi dam olish joyida to'xtaymiz (reja)."],["I'll text you my ETA.","Sizga taxminiy yetib borish vaqtimni SMS qilaman."]],
mistakeWrong:"I go to Dallas tomorrow. (as a plan)",
mistakeRight:"I'm going to go to Dallas tomorrow. / I will go to Dallas tomorrow.",
mistakeWhy:"Present simple alone doesn't mark future in English the way context sometimes does in Uzbek — you need 'will' or 'going to' to clearly mark future plans and decisions.",
quiz:[
["Deciding right now: 'Okay, I ___ call dispatch.'",["am going to","will","go","went"],1],
["Already planned: 'I ___ deliver this load at 3 PM.' (planned yesterday)",["will","am going to","go","went"],1],
["'It ___ rain later — look at those clouds.' (prediction)",["is going to","went","drove","did"],0],
["Which is a promise made right now?",["I will help you.","I am helping you yesterday.","I help you every day.","I helped you."],0],
["'We ___ stop at the next rest area.' (decided in advance)",["will","are going to","go","went"],1],
["The short form of 'I will' is:",["I'll","I'l","Ill","I'ill"],0]]},

{id:"yesno-questions", cat:"Questions", title:"Yes/No Questions — Do / Does / Did", titleUz:"Ha/Yo'q savollari — Do / Does / Did",
ruleUz:"Ingliz tilida savol berish uchun gap boshiga Do, Does yoki Did qo'yiladi — bu o'zbek tilida yo'q qoida.",
explain:[
"This is one of the biggest structural differences between Uzbek and English. Uzbek turns a statement into a question with a small suffix (-mi) added to the word being asked about — no extra word is needed. English instead adds 'Do' (or 'Does' for he/she/it, 'Did' for past) to the FRONT of the sentence, and the main verb goes back to its base form.",
"Statement: \"You have your CDL.\" → Question: \"Do you have your CDL?\" Statement: \"She checked the oil.\" → Question: \"Did she check the oil?\" (checked → check, because 'did' already carries the past tense).",
"For 'to be,' there's no do/does/did — just move am/is/are to the front: \"You are ready\" → \"Are you ready?\""
],
examples:[["Do you have your CDL?","CDL'ingiz bormi?"],["Does the load need a permit?","Yuk uchun ruxsatnoma kerakmi?"],["Did you inspect the brakes?","Tormozlarni tekshirdingizmi?"],["Are you ready to go?","Ketishga tayyormisiz?"],["Does this truck have a sleeper berth?","Bu mashinada uxlash bo'limi bormi?"]],
mistakeWrong:"You have your CDL? She checked the oil?",
mistakeRight:"Do you have your CDL? Did she check the oil?",
mistakeWhy:"Without do/does/did, the sentence sounds like a surprised statement, not a real question, to a native English speaker — even though the meaning is guessable from tone alone.",
quiz:[
["'___ you have your CDL?'",["Do","Does","Did","Are"],0],
["'___ the load need a permit?' (load = it)",["Do","Does","Did","Is"],1],
["'___ you inspect the brakes yesterday?'",["Do","Does","Did","Were"],2],
["Turn into a question: 'She checked the oil.'",["She checked the oil?","Does she checked the oil?","Did she check the oil?","Did she checked the oil?"],2],
["'___ you ready to go?' (using 'to be', no do/does)",["Do","Are","Does","Did"],1],
["'___ this truck have a sleeper berth?'",["Do","Does","Did","Is"],1]]},

{id:"wh-questions", cat:"Questions", title:"Wh- Questions — What / Where / When / Why / How", titleUz:"Wh- savollari — What / Where / When / Why / How",
ruleUz:"Wh- so'zi doim gap boshida keladi: Wh-so'z + do/does/did (yoki is/are) + ega + fe'l.",
explain:[
"Wh- questions (what, where, when, why, how, who) always start with the question word, followed by the same do/does/did (or is/are) pattern as yes/no questions: Wh-word + do/does/did + subject + verb.",
"\"Where are you headed?\" \"What are you hauling?\" \"How long have you been driving?\" \"Why did you stop here?\"",
"Uzbek word order is subject-object-verb, and the question word often stays near where the answer would go, not always at the front. In English, the question word must move all the way to the front of the sentence — always."
],
examples:[["Where are you headed?","Qayerga ketyapsiz?"],["What are you hauling?","Nima tashiyapsiz?"],["How long have you been driving?","Qancha vaqtdan beri haydayapsiz?"],["Why did you stop here?","Nega bu yerda to'xtadingiz?"],["When does the dock open?","Maydoncha qachon ochiladi?"]],
mistakeWrong:"You are headed where? You stopped here why?",
mistakeRight:"Where are you headed? Why did you stop here?",
mistakeWhy:"In Uzbek, word order is more flexible, so the question word can feel natural at the end. In English, the Wh-word must move to the very front, every time.",
quiz:[
["'___ are you headed?'",["What","Where","Who","How"],1],
["'___ are you hauling?'",["Where","What","When","Why"],1],
["'___ long have you been driving?'",["What","How","Where","Which"],1],
["Correct word order:",["You stopped why here?","Why you stopped here?","Why did you stop here?","Why did stopped you here?"],2],
["'___ does the dock open?'",["When","What","Who","Which"],0],
["'___ is the dispatcher on the phone?' (asking a person)",["What","Who","Where","When"],1]]},

{id:"negatives", cat:"Questions", title:"Negatives — don't / doesn't / didn't / isn't", titleUz:"Bo'lishsizlik — don't / doesn't / didn't / isn't",
ruleUz:"'To be' bilan 'not' qo'shiladi (isn't, aren't); boshqa fe'llar bilan don't/doesn't/didn't ishlatiladi.",
explain:[
"To make a sentence negative with 'to be,' just add 'not': is not (isn't), are not (aren't), was not (wasn't). \"I am not tired\" → \"I'm not tired.\"",
"For every other verb, use don't/doesn't (present) or didn't (past) + the base verb — never add 'not' directly to the main verb. \"I don't know.\" \"He doesn't drive at night.\" \"We didn't stop.\""
],
examples:[["I don't know the address.","Manzilni bilmayman."],["He doesn't drive at night.","U kechasi haydamaydi."],["We didn't stop at that station.","Biz o'sha bekatda to'xtamadik."],["The load isn't secure yet.","Yuk hali mahkamlanmagan."],["They aren't ready.","Ular tayyor emas."]],
mistakeWrong:"I not know. I no have time.",
mistakeRight:"I don't know. I don't have time.",
mistakeWhy:"Uzbek negation attaches directly to the verb as a suffix (bil-ma-yman), so it's natural to try putting 'not' or 'no' directly next to the English verb. English instead needs don't/doesn't/didn't in front of the base verb.",
quiz:[
["'I ___ know the address.'",["not","no","don't","isn't"],2],
["'He ___ drive at night.'",["don't","doesn't","not","no"],1],
["'We ___ stop at that station.' (past)",["don't","doesn't","didn't","isn't"],2],
["'The load ___ secure yet.' (to be)",["don't","doesn't","isn't","didn't"],2],
["Which is correct?",["I not have my CDL.","I don't have my CDL.","I doesn't have my CDL.","I no have my CDL."],1],
["'They ___ ready.' (to be, plural)",["isn't","aren't","don't","doesn't"],1]]},

{id:"modals-obligation", cat:"Modals & Rules", title:"Must / Have To / Should — Rules & Advice", titleUz:"Must / have to / should — qoida va maslahat",
ruleUz:"'Must' va 'have to' majburiyatni, 'should' esa maslahatni bildiradi; 'must not' va 'don't have to' esa qarama-qarshi ma'noga ega.",
explain:[
"Use 'must' or 'have to' for a rule or legal requirement: \"You must stop at a weigh station\" — both mean it's required. Use 'should' for advice, not a hard rule: \"You should take a break\" (a good idea, not the law).",
"WARNING — these two look similar but mean the OPPOSITE thing: \"You must not park here\" means it's forbidden (illegal). \"You don't have to park here\" means it's optional — you can if you want, but nobody's making you. Confusing these two completely reverses the meaning."
],
examples:[["You must stop at every weigh station.","Har bir tarozi bekatida to'xtashingiz shart."],["Drivers have to carry a medical card.","Haydovchilar tibbiy karta olib yurishi kerak."],["You should take a break every few hours.","Bir necha soatda tanaffus qilganingiz ma'qul."],["You must not park in a no-parking zone.","To'xtash taqiqlangan joyda to'xtamang (taqiqlangan)."],["You don't have to fill out this form today.","Bu formani bugun to'ldirishingiz shart emas (ixtiyoriy)."]],
mistakeWrong:"Treating 'must not' and 'don't have to' as the same thing.",
mistakeRight:"Must not = forbidden. Don't have to = optional, not required.",
mistakeWhy:"These two are a common trap for English learners everywhere, not just Uzbek speakers — the negative forms of 'must' and 'have to' go in completely different directions, unlike the positive forms which mean almost the same thing.",
quiz:[
["'You ___ stop at every weigh station.' (it's the law)",["should","must","could","might"],1],
["'You ___ park here.' (it's forbidden)",["don't have to","must not","should","can"],1],
["'You ___ fill out this form.' (optional, not required)",["must not","don't have to","must","have to"],1],
["'You ___ take a break — you look tired.' (advice, not a rule)",["must","have to","should","must not"],2],
["Which describes a legal requirement?",["You should have a CDL.","You have to have a CDL.","You might have a CDL.","You could have a CDL."],1],
["'Drivers ___ carry proof of insurance.' (required by law)",["should","must","might","could"],1]]},

{id:"modals-ability", cat:"Modals & Rules", title:"Can / Could / May — Ability & Permission", titleUz:"Can / could / may — qobiliyat va ruxsat",
ruleUz:"'Can' hozirgi qobiliyat/ruxsat, 'could' o'tgan qobiliyat yoki xushmuomala so'rov, 'may' rasmiy ruxsat uchun.",
explain:[
"Use 'can' for present ability or informal permission: \"I can drive a manual transmission\" (ability), \"Can I use the restroom?\" (asking permission, casual). Use 'could' for past ability or a more polite request: \"I could drive a manual truck when I was 20\" (past ability), \"Could you repeat that?\" (polite).",
"Use 'may' for formal permission, often from an authority: \"You may proceed\" (an officer allowing you through). All three are followed by the base verb — never add -ing or -s."
],
examples:[["I can drive a manual transmission.","Men mexanika uzatmali mashinani hayday olaman."],["Can I see your license, please?","Guvohnomangizni ko'rsam bo'ladimi?"],["Could you repeat that?","Buni qaytara olasizmi?"],["You may proceed, sir.","Davom etishingiz mumkin, janob."],["I couldn't find the address last night.","Kecha manzilni topa olmadim."]],
mistakeWrong:"I can to drive. She can drives.",
mistakeRight:"I can drive. She can drive.",
mistakeWhy:"After can/could/may, always use the base verb with no 'to' and no -s — even for he/she/it. This is different from most other verbs, so it's an easy slip.",
quiz:[
["'I ___ drive a manual transmission.'",["can to","can","cans","canning"],1],
["'___ I see your license, please?'",["Can","Cans","Could to","May to"],0],
["'She ___ drive a flatbed truck.' (ability)",["can drives","can drive","cans drive","can to drive"],1],
["Most formal way to give permission:",["can","could","may","might"],2],
["'___ you repeat that?' (polite request)",["Can","Could","May","Must"],1],
["Which is correct?",["I can to help you.","I can helping you.","I can help you.","I cans help you."],2]]},

{id:"prepositions-place", cat:"Prepositions & Connectors", title:"Prepositions of Place & Direction — at / in / on / to / from", titleUz:"O'rin va yo'nalish predloglari — at / in / on / to / from",
ruleUz:"O'zbek tilida predloglar so'zdan keyin qo'shimcha sifatida keladi (uy-da), ingliz tilida esa alohida so'z sifatida oldin keladi.",
explain:[
"Use 'at' for a specific point: at the weigh station, at mile marker 90. Use 'in' for something enclosed: in the cab, in the trailer, in Texas. Use 'on' for a surface or route: on the highway, on I-40, on the dock.",
"For direction, use 'to' (destination) and 'from' (origin): \"I'm driving to Dallas from Houston.\" Use 'onto' when getting onto a surface (merge onto the highway) and 'into' when entering an enclosed space (walk into the office).",
"Uzbek attaches this meaning as a suffix directly onto the noun (uy-da = \"at home\"), while English uses a separate word placed BEFORE the noun. Getting the position right, and picking the right one of at/in/on, both take practice."
],
examples:[["Meet me at the truck stop.","Meni yuk mashinalari bekatida kutib turing."],["The documents are in the glove box.","Hujjatlar bardachokda."],["We're on Interstate 40 now.","Biz hozir I-40 shossesidamiz."],["I'm driving to Dallas from Houston.","Men Xyustondan Dallasga ketyapman."],["Merge onto the highway carefully.","Shosseyga ehtiyotkorlik bilan qo'shiling."]],
mistakeWrong:"I am truck stop. Documents glove box.",
mistakeRight:"I am at the truck stop. The documents are in the glove box.",
mistakeWhy:"Because Uzbek marks location with a suffix on the noun itself, it's easy to forget that English needs a separate preposition word before the noun — dropping it entirely, not just picking the wrong one, is the most common version of this mistake.",
quiz:[
["'Meet me ___ the truck stop.' (specific point)",["in","on","at","to"],2],
["'The documents are ___ the glove box.' (enclosed space)",["at","in","on","to"],1],
["'We're ___ Interstate 40 now.' (a road/route)",["at","in","on","to"],2],
["'I'm driving ___ Dallas ___ Houston.'",["to / from","from / to","at / in","in / on"],0],
["'Merge ___ the highway.' (getting onto a surface)",["into","onto","in","at"],1],
["'She works ___ the warehouse downtown.'",["at","to","from","on"],0]]},

{id:"prepositions-time", cat:"Prepositions & Connectors", title:"Prepositions of Time — at / in / on / for / since", titleUz:"Vaqt predloglari — at / in / on / for / since",
ruleUz:"at — aniq vaqt, in — oy/yil/davr, on — kun/sana, for — davomiylik, since — boshlanish nuqtasi.",
explain:[
"Use 'at' for a clock time: at 6 AM, at noon, at midnight. Use 'in' for a month, year, or longer period: in July, in 2024, in the morning. Use 'on' for a specific day or date: on Monday, on July 4th.",
"Use 'for' to say how long something lasts: for three hours, for two weeks. Use 'since' to say when something started: since morning, since Monday — since always pairs with a starting point, not a length of time."
],
examples:[["I start driving at 6 AM.","Men soat 6 da haydashni boshlayman."],["The rule changed in 2024.","Qoida 2024-yilda o'zgardi."],["I have an appointment on Monday.","Dushanba kuni uchrashuvim bor."],["I've been driving for three hours.","Uch soatdan beri haydayapman."],["I've been awake since 4 AM.","Soat 4 dan beri uyg'oqman."]],
mistakeWrong:"I drive since three hours. I start on 6 AM.",
mistakeRight:"I've been driving for three hours. I start at 6 AM.",
mistakeWhy:"'Since' and 'for' are often confused because both can translate similarly in casual Uzbek speech — remember: for + a length of time (for 3 hours), since + a starting point (since 6 AM).",
quiz:[
["'I start driving ___ 6 AM.'",["in","on","at","for"],2],
["'The rule changed ___ 2024.'",["at","in","on","since"],1],
["'I have an appointment ___ Monday.'",["at","in","on","for"],2],
["'I've been driving ___ three hours.' (a length of time)",["since","for","at","on"],1],
["'I've been awake ___ 4 AM.' (a starting point)",["for","since","at","in"],1],
["'We usually eat ___ the morning.'",["at","on","in","for"],2]]},

{id:"connectors", cat:"Prepositions & Connectors", title:"Joining Ideas — and / but / because / so / if / when", titleUz:"Fikrlarni bog'lash — and / but / because / so / if / when",
ruleUz:"and (qo'shish), but (qarama-qarshilik), because (sabab), so (natija), if (shart), when (vaqt) gaplarni bog'laydi.",
explain:[
"Use 'and' to add ideas, 'but' to contrast them: \"I checked the oil and the tires, but I forgot the mirrors.\" Use 'because' to give a reason, 'so' to give a result — they work in opposite directions: \"I stopped because I was tired\" (reason) vs. \"I was tired, so I stopped\" (result).",
"Use 'if' to introduce a condition and 'when' for something that's certain to happen (a fact or routine), not just possible: \"If it rains, I'll slow down\" (might rain) vs. \"When I arrive, I'll call you\" (arrival is certain)."
],
examples:[["I checked the oil and the tires.","Moy va shinalarni tekshirdim."],["The load is heavy, but it's legal.","Yuk og'ir, lekin qonuniy."],["I stopped because I was tired.","Charchaganim uchun to'xtadim."],["I was tired, so I stopped.","Charchagan edim, shuning uchun to'xtadim."],["If it rains, I'll slow down.","Agar yomg'ir yog'sa, sekinlashaman."]],
mistakeWrong:"Mixing up because and so, or using them both in one sentence.",
mistakeRight:"I stopped because I was tired. OR I was tired, so I stopped. (not both)",
mistakeWhy:"In some languages you can use a reason-word and a result-word together in one sentence — in English, pick one: 'because' names the reason, 'so' names the result, and using both together is considered a mistake.",
quiz:[
["'I checked the oil ___ the tires.' (adding)",["but","and","because","so"],1],
["'The load is heavy, ___ it's legal.' (contrast)",["and","because","but","so"],2],
["'I stopped ___ I was tired.' (giving the reason)",["so","because","but","if"],1],
["'I was tired, ___ I stopped.' (giving the result)",["because","so","but","when"],1],
["'___ it rains, I'll slow down.' (a possibility)",["When","If","Because","So"],1],
["'___ I arrive, I'll call you.' (certain to happen)",["If","When","But","So"],1]]},

{id:"comparatives", cat:"Numbers & Comparisons", title:"Comparatives & Superlatives — faster, the fastest", titleUz:"Qiyosiy va orttirma daraja — faster, the fastest",
ruleUz:"Qisqa sifatlarga -er/-est, uzun sifatlarga more/most qo'shiladi; ba'zilari tartibsiz (good→better→best).",
explain:[
"For short adjectives (one syllable, or two ending in -y), add -er to compare two things and -est for the top of a group: fast → faster → the fastest, heavy → heavier → the heaviest (y changes to i).",
"For longer adjectives, use 'more'/'most' instead of changing the word: expensive → more expensive → the most expensive. A few common words are irregular and must be memorized: good → better → the best, bad → worse → the worst, far → farther → the farthest."
],
examples:[["This route is faster than the highway.","Bu marshrut shosseдан tezroq."],["That's the biggest truck stop I've seen.","Bu men ko'rgan eng katta bekat."],["Diesel is more expensive this month.","Bu oy dizel qimmatroq."],["My new truck is better than the old one.","Yangi mashinam eskisidan yaxshiroq."],["This is the worst traffic I've seen today.","Bu bugun ko'rgan eng yomon tirbandlik."]],
mistakeWrong:"more faster, the most fastest",
mistakeRight:"faster, the fastest",
mistakeWhy:"Never combine both methods on one word — a short adjective takes EITHER -er/-est OR more/most, never both together.",
quiz:[
["'This route is ___ than the highway.' (fast)",["more fast","fastest","faster","most fast"],2],
["'That's ___ truck stop I've seen.' (big, top of the group)",["bigger","the biggest","more big","most big"],1],
["'Diesel is ___ this month.' (expensive, longer word)",["expensiver","more expensive","most expensive","the expensivest"],1],
["'My new truck is ___ than the old one.' (good, irregular)",["gooder","more good","better","best"],2],
["Which is correct?",["This is more faster.","This is the most fastest.","This is faster.","This is fastest than that."],2],
["'This is ___ traffic I've seen today.' (bad, top of the group)",["worse","the worst","more bad","badder"],1]]},

{id:"quantifiers", cat:"Numbers & Comparisons", title:"Countable & Uncountable Nouns — some / any / much / many", titleUz:"Sanaladigan va sanalmaydigan otlar — some / any / much / many",
ruleUz:"Sanaladigan otlar (tire, box) many bilan, sanalmaydiganlar (fuel, traffic) much bilan ishlatiladi; raqamdan keyin ko'plik -s unutilmasin.",
explain:[
"Countable nouns can be counted one by one and have a plural form: one tire, two tires, many boxes. Uncountable nouns describe things treated as a whole, with no plural: fuel, traffic, cargo, information, equipment, weather.",
"Use 'many' and 'a few' with countable nouns, 'much' and 'a little' with uncountable ones: \"How many tires?\" / \"How much fuel?\" Use 'some' in positive sentences and 'any' in questions/negatives for both types: \"I have some tools\" / \"Do you have any tools?\"",
"After a number, always keep the plural -s on countable nouns — this is one you'll use constantly: three trucks, five boxes, two hours."
],
examples:[["I have some tools in the back.","Orqada bir nechta asbobim bor."],["Do you have any spare parts?","Ehtiyot qismlaringiz bormi?"],["How much fuel is left?","Qancha yoqilg'i qoldi?"],["How many tires need replacing?","Nechta shina almashtirilishi kerak?"],["We have three trucks on this route.","Bu marshrutda uchta mashinamiz bor."]],
mistakeWrong:"three truck. much tires. How many fuel?",
mistakeRight:"three trucks. many tires. How much fuel?",
mistakeWhy:"Uzbek usually doesn't pluralize a noun after a number (uch kitob, not \"uch kitoblar\"), so it's easy to forget the -s after a number in English. Also watch much (uncountable) vs. many (countable) — fuel takes much, tires take many.",
quiz:[
["'We have three ___ on this route.'",["truck","trucks","a truck","trucking"],1],
["'How ___ fuel is left?' (uncountable)",["many","much","some","a few"],1],
["'How ___ tires need replacing?' (countable)",["much","many","a little","any"],1],
["'I have ___ tools in the back.' (positive sentence)",["any","some","much","many"],1],
["'Do you have ___ spare parts?' (a question)",["some","any","much","a little"],1],
["Which is correct?",["five box","five boxs","five boxes","five boxies"],2]]},

{id:"conditionals", cat:"Advanced", title:"If-Sentences — Rules, Warnings & Advice", titleUz:"If gaplari — qoida, ogohlantirish va maslahat",
ruleUz:"If + hozirgi zamon, ... + will/must/should — qoida, ogohlantirish yoki maslahat berishning eng keng tarqalgan usuli.",
explain:[
"This pattern is everywhere in trucking English — rules, warnings, and advice almost always use \"If + present simple, ... will/must/should/can + base verb.\" \"If you speed, you'll get a ticket.\" \"If the light is red, you must pull in.\" \"If you feel tired, you should stop.\"",
"Important: after 'if,' use present simple even though you're talking about the future — never 'will' in the if-part. \"If it rains\" is correct; \"if it will rain\" is not."
],
examples:[["If you speed, you'll get a ticket.","Agar tezlik oshirsangiz, jarima olasiz."],["If the light is red, you must pull in.","Agar chiroq qizil bo'lsa, kirishingiz shart."],["If you feel tired, you should stop.","Agar charchagan bo'lsangiz, to'xtashingiz kerak."],["If your ELD malfunctions, switch to paper logs.","Agar ELD buzilsa, qog'oz jurnalga o'ting."],["If the scale shows overweight, you must adjust the load.","Agar tarozi ortiqcha og'irlikni ko'rsatsa, yukni sozlashingiz kerak."]],
mistakeWrong:"If it will rain, I will slow down.",
mistakeRight:"If it rains, I will slow down.",
mistakeWhy:"Even though the if-clause talks about the future, English never uses 'will' right after 'if.' Use present simple in the if-part, and save 'will' (or must/should/can) for the result.",
quiz:[
["'If you ___ (speed), you'll get a ticket.'",["will speed","speed","speeds","speeded"],1],
["'If the light ___ red, you must pull in.'",["will be","is","was","be"],1],
["'If you feel tired, you ___ stop.' (advice)",["must","should","will be","are"],1],
["Which is correct?",["If it will rain, I'll slow down.","If it rains, I'll slow down.","If it rain, I'll slow down.","If it raining, I'll slow down."],1],
["'If your ELD malfunctions, ___ to paper logs.' (instruction)",["switch","switches","switched","will switch"],0],
["'If the scale shows overweight, you ___ adjust the load.' (a rule)",["should","might","must","could"],2]]},

{id:"imperatives", cat:"Advanced", title:"Giving Instructions — Imperatives", titleUz:"Ko'rsatma berish — buyruq gaplari",
ruleUz:"Buyruq gaplarda ega tushiriladi va fe'l boshlang'ich shaklda ishlatiladi; iltimos uchun 'please' qo'shiladi.",
explain:[
"For instructions and commands, drop the subject and start with the base verb: \"Check the mirror.\" \"Open the trailer doors.\" \"Wait here.\" Add 'please' to sound more polite, especially in professional settings: \"Please wait here.\"",
"For a negative command, add 'don't' before the base verb: \"Don't park here.\" \"Don't forget your logbook.\" This is exactly how trainers, inspectors, and dock workers give instructions all day — it's a very common pattern in trucking English."
],
examples:[["Check the mirror before you turn.","Burilishdan oldin oynani tekshiring."],["Please wait here.","Iltimos, shu yerda kuting."],["Open the trailer doors.","Tirkama eshiklarini oching."],["Don't park in this area.","Bu hududda to'xtamang."],["Don't forget your logbook.","Jurnalingizni unutmang."]],
mistakeWrong:"You check the mirror. You don't park here.",
mistakeRight:"Check the mirror. Don't park here.",
mistakeWhy:"Adding 'you' before an instruction makes it sound like a statement about someone, not a direct instruction. Real commands and instructions in English drop the subject entirely and start right with the verb.",
quiz:[
["Give an instruction: '(check) the mirror.'",["You check","Checking","Check","Checked"],2],
["Polite instruction: '(wait) here.'",["Please wait","Please waiting","You please wait","Waits please"],0],
["Negative command: '(park) here.'",["Not park","No park","Don't park","Doesn't park"],2],
["Which sounds like a direct instruction?",["You should open the doors.","You open the doors.","Open the doors.","Opening the doors."],2],
["'___ forget your logbook.'",["Not","No","Don't","Doesn't"],2],
["Which is a polite instruction?",["Wait here.","Please wait here.","You wait here.","Waiting here."],1]]},

{id:"word-order", cat:"Foundations", title:"Basic Word Order — Subject + Verb + Object", titleUz:"Asosiy so'z tartibi — Ega + Fe'l + To'ldiruvchi",
ruleUz:"Ingliz tilida gap tuzilishi ega+fe'l+to'ldiruvchi (SVO) tartibida bo'ladi, o'zbek tilida esa fe'l odatda gap oxirida keladi (SOV).",
explain:[
"English sentences follow a fixed order: Subject + Verb + Object. \"I (subject) drive (verb) a truck (object).\" The verb comes right after the subject — almost never at the end of the sentence.",
"Uzbek instead puts the verb at the end (Subject-Object-Verb): \"Men mashina haydayman\" literally means \"I truck drive.\" When building English sentences, the verb has to move to the middle, right after the subject. This one habit affects almost every sentence you build, so it's worth practicing on purpose."
],
examples:[["I drive a truck.","Men mashina haydayman."],["She checks the engine every morning.","U har kuni ertalab dvigatelni tekshiradi."],["We deliver furniture to Phoenix.","Biz Feniksga mebel yetkazamiz."],["The officer checked my documents.","Ofitser hujjatlarimni tekshirdi."],["Dispatch sent me a new load.","Dispetcher menga yangi yuk yubordi."]],
mistakeWrong:"I truck drive. Furniture to Phoenix deliver.",
mistakeRight:"I drive a truck. I deliver furniture to Phoenix.",
mistakeWhy:"Because Uzbek puts the verb last, it feels natural to build English sentences the same way. Always place the verb right after the subject, not at the end.",
quiz:[
["Put in order: 'a truck / I / drive'",["A truck I drive.","I drive a truck.","I a truck drive.","Drive I a truck."],1],
["Put in order: 'the engine / checks / she / every morning'",["She checks the engine every morning.","She the engine checks every morning.","Every morning she the engine checks.","Checks she the engine every morning."],0],
["Which sentence has correct English word order?",["Furniture to Phoenix I deliver.","I furniture deliver to Phoenix.","I deliver furniture to Phoenix.","Deliver I furniture to Phoenix."],2],
["'Dispatch ___ me a new load.' (correct verb position)",["a new load sent","sent","me sent","load sent me"],1],
["Where does the verb usually go in an English sentence?",["At the end","Right after the subject","Before the subject","Anywhere"],1],
["Which is correct?",["The officer my documents checked.","The officer checked my documents.","My documents the officer checked.","Checked the officer my documents."],1]]},

{id:"pronouns-possessives", cat:"Foundations", title:"Subject Pronouns & Possessives — I/my, you/your...", titleUz:"Ega olmoshlari va egalik shakli — I/my, you/your...",
ruleUz:"Subject olmoshlari (I, you, he...) ega o'rnida, egalik olmoshlari (my, your, his...) esa kimga tegishli ekanini bildiradi.",
explain:[
"Subject pronouns replace the doer of the action: I, you, he, she, it, we, they. \"He checks the load\" (not \"Him checks the load\").",
"Possessive adjectives show who something belongs to, and go right before a noun: my truck, your license, his trailer, her route, its engine, our company, their schedule. Don't confuse them with subject pronouns — \"I truck\" is wrong; you need \"my truck.\"",
"For a person's name or a noun, add 's to show possession: the driver's log, the company's policy, Aziz's truck."
],
examples:[["My truck needs an oil change.","Mening mashinamga moy almashtirish kerak."],["Is this your logbook?","Bu sizning jurnalingizmi?"],["Her route goes through Denver.","Uning marshruti Denver orqali o'tadi."],["The driver's log was up to date.","Haydovchining jurnali yangilangan edi."],["Our company covers fuel costs.","Bizning kompaniyamiz yoqilg'i xarajatlarini qoplaydi."]],
mistakeWrong:"Me truck. This is I logbook.",
mistakeRight:"My truck. This is my logbook.",
mistakeWhy:"It's easy to reach for the subject pronoun (I, he, they) even when you need the possessive form (my, his, their) right before a noun. If a noun follows, use the possessive form.",
quiz:[
["'___ truck needs an oil change.' (belongs to me)",["I","Me","My","Mine"],2],
["'Is this ___ logbook?' (belongs to you)",["you","your","yours","you're"],1],
["'___ route goes through Denver.' (belongs to her)",["She","Her","Hers","He"],1],
["Correct possessive for a noun: 'the driver ___ log'",["driver's","drivers","driver","driver're"],0],
["'___ company covers fuel costs.' (belongs to us)",["We","Us","Our","Ours"],2],
["Which is correct?",["Me truck is parked outside.","My truck is parked outside.","I truck is parked outside.","Mine truck is parked outside."],1]]},

{id:"numbers-cardinal-ordinal", cat:"Foundations", title:"Numbers — Cardinal & Ordinal", titleUz:"Sonlar — mikdor va tartib sonlar",
ruleUz:"Cardinal sonlar sanash uchun (one, two, three), ordinal sonlar esa tartib uchun (first, second, third) ishlatiladi.",
explain:[
"Cardinal numbers count things: one, two, three, twenty, eighty thousand. Use them for weights, quantities, and most numbers: \"eighty thousand pounds,\" \"three trucks.\"",
"Ordinal numbers show order or position: first, second, third, fourth... fifth, and are used for dates and exits: \"March fifth\" (not \"March five\"), \"take the third exit.\" Most ordinals add -th to the cardinal number, but first, second, and third are irregular.",
"For large numbers, break them into groups: 80,000 = \"eighty thousand.\" 1,200 = \"one thousand two hundred\" or \"twelve hundred.\""
],
examples:[["The gross weight is eighty thousand pounds.","Umumiy og'irlik sakson ming funt."],["Take the third exit.","Uchinchi chiqishdan chiqing."],["My delivery is on March fifth.","Mening yetkazib berishim mart oyining beshinchisida."],["This is my first trip to Chicago.","Bu mening Chikagoga birinchi safarim."],["We have twelve hundred miles left.","Bizda 1200 milya qoldi."]],
mistakeWrong:"March five. The two exit.",
mistakeRight:"March fifth. The second exit.",
mistakeWhy:"Dates and ordered positions (exits, floors, anniversaries) use ordinal numbers (fifth, second), not cardinal numbers (five, two) — this trips up almost every English learner at first.",
quiz:[
["'My delivery is on March ___.' (the 5th)",["five","fifth","fives","fifth's"],1],
["'Take the ___ exit.' (the 3rd)",["three","threeth","third","thirdth"],2],
["'The gross weight is ___ pounds.' (80,000)",["eight thousand","eighty thousand","eighty hundred","eight hundred thousand"],1],
["'This is my ___ trip to Chicago.' (the 1st)",["one","first","oneth","1th"],1],
["Which is the ordinal form of 'two'?",["twoth","second","two-th","twond"],1],
["'We have ___ miles left.' (1,200)",["twelve hundred","one twelve hundred","hundred twelve","twelve thousand"],0]]},

{id:"present-perfect", cat:"Tenses", title:"Present Perfect — Experience & Recent Events", titleUz:"Hozirgi tugallangan zamon — tajriba va yaqinda sodir bo'lgan voqealar",
ruleUz:"have/has + o'tgan zamon shakli (participle) — tajriba yoki hozirgача davom etayotgan vaqtni bildiradi.",
explain:[
"Use have/has + past participle to talk about life experience (not a specific time), or something that started in the past and connects to now: \"I have driven for 10 years\" (still true now). \"Have you ever driven a tanker?\" (at any point in your life).",
"This is different from past simple, which names a finished, specific time: \"I drove to Dallas yesterday\" (done, specific day) vs. \"I have driven to Dallas many times\" (experience, no specific day named).",
"Many past participles are irregular and different from the past simple form: drive → drove → driven, see → saw → seen, go → went → gone, do → did → done."
],
examples:[["I have driven for ten years.","O'n yildan beri haydab kelaman."],["Have you ever driven a tanker?","Hech qachon sisterna haydaganmisiz?"],["I have already inspected the truck.","Men mashinani allaqachon tekshirdim."],["She has worked here since 2020.","U bu yerda 2020-yildan beri ishlaydi."],["We haven't received the new schedule yet.","Biz hali yangi jadvalni olmadik."]],
mistakeWrong:"I drive trucks for ten years. I never drove a tanker (meaning: in my whole life).",
mistakeRight:"I have driven trucks for ten years. I have never driven a tanker.",
mistakeWhy:"When talking about experience up to now, or something that started in the past and continues, English needs have/has + past participle — past simple alone only works for a specific, finished time.",
quiz:[
["'I ___ (drive) for ten years.' (still true now)",["drive","drove","have driven","driving"],2],
["'___ you ever driven a tanker?'",["Do","Did","Have","Are"],2],
["'I have already ___ (inspect) the truck.'",["inspect","inspected","inspecting","inspects"],1],
["Past participle of 'go' is:",["went","gone","going","goed"],1],
["Which sentence describes a specific finished time?",["I have driven to Dallas many times.","I drove to Dallas yesterday.","I have never driven a tanker.","She has worked here since 2020."],1],
["'She ___ (work) here since 2020.'",["work","worked","has worked","working"],2]]},

{id:"past-continuous", cat:"Tenses", title:"Past Continuous — What Was Happening", titleUz:"O'tgan davomli zamon — nima sodir bo'layotgan edi",
ruleUz:"was/were + fe'l-ing — o'tgan bir paytda davom etayotgan harakatni bildiradi, ko'pincha boshqa qisqa harakat uni to'xtatadi.",
explain:[
"Use was/were + verb-ing to describe an action that was already in progress at a specific point in the past — very useful for describing what was happening right before or during an incident: \"I was driving when the deer ran into the road.\"",
"This pairs naturally with the past simple: the past continuous sets the scene (the longer action in progress), and the past simple names the shorter action that interrupted it. \"I was checking the brakes when the phone rang.\""
],
examples:[["I was driving when the deer ran into the road.","Kiyik yo'lga chiqqanda men haydab ketayotgan edim."],["We were waiting at the dock when the call came.","Qo'ng'iroq kelganda biz maydonchada kutayotgan edik."],["I was checking the brakes when the phone rang.","Telefon jiringlaganda tormozlarni tekshirayotgan edim."],["She was sleeping in the berth during the stop.","To'xtash paytida u uxlash bo'limida uxlayotgan edi."],["It was raining heavily when the accident happened.","Avariya sodir bo'lganda kuchli yomg'ir yog'ayotgan edi."]],
mistakeWrong:"I drove when the deer ran into the road. (losing the 'in progress' meaning)",
mistakeRight:"I was driving when the deer ran into the road.",
mistakeWhy:"Using plain past simple for both actions loses the important distinction between the longer background action (was driving) and the sudden interrupting action (ran) — both details matter in an incident report.",
quiz:[
["'I ___ (drive) when the deer ran into the road.'",["drove","was driving","drive","have driven"],1],
["'We ___ (wait) at the dock when the call came.'",["waited","was waiting","were waiting","wait"],2],
["'I was checking the brakes when the phone ___ (ring).'",["was ringing","rang","rings","ring"],1],
["Which action is the 'in progress' one in: 'She was sleeping when dispatch called'?",["called","was sleeping","dispatch","when"],1],
["'It ___ (rain) heavily when the accident happened.'",["rained","rains","was raining","rain"],2],
["Past continuous is formed with:",["will + verb-ing","was/were + verb-ing","have + verb-ing","did + verb-ing"],1]]},

{id:"polite-questions", cat:"Questions", title:"Polite & Indirect Questions", titleUz:"Xushmuomala va bilvosita savollar",
ruleUz:"Bilvosita savollarda gap tartibi to'g'ridan-to'g'ri savoldagidek emas, balki oddiy gap tartibida bo'ladi.",
explain:[
"For a more polite or formal question, wrap it inside a phrase like \"Could you tell me...\" or \"Do you know...\" This softens the question, which is useful with customers, officers, or anyone you want to sound extra respectful toward.",
"The tricky part: inside the polite wrapper, word order goes back to normal STATEMENT order (subject before verb) — not the inverted order of a direct question. Direct: \"Where is the office?\" Polite/indirect: \"Could you tell me where the office is?\" (not \"...where is the office?\")."
],
examples:[["Could you tell me where the office is?","Ofis qayerdaligini ayta olasizmi?"],["Do you know if the dock is open?","Maydoncha ochiqligini bilasizmi?"],["Could you tell me what time the gate opens?","Darvoza soat nechada ochilishini ayta olasizmi?"],["Do you know where I can park overnight?","Tunda qayerda to'xtay olishimni bilasizmi?"],["Could you tell me how long the delay will be?","Kechikish qancha davom etishini ayta olasizmi?"]],
mistakeWrong:"Could you tell me where is the office?",
mistakeRight:"Could you tell me where the office is?",
mistakeWhy:"It's natural to keep the inverted word order from a direct question, but inside a polite wrapper like 'Could you tell me...' the rest of the sentence goes back to normal subject-then-verb order.",
quiz:[
["'Could you tell me where the office ___?'",["is","is it","it is","does it"],0],
["'Do you know if the dock ___?' (is open)",["is open","open is","does open","is it open"],0],
["Which is correctly polite/indirect?",["Could you tell me where is the restroom?","Could you tell me where the restroom is?","Could you tell me the restroom where is?","Could you tell me is where the restroom?"],1],
["'Could you tell me what time the gate ___?'",["does open","opens","open does","is opens"],1],
["Direct question: 'Where is the manager?' — Polite version:",["Do you know where is the manager?","Do you know where the manager is?","Do you know the manager where is?","Do you know is the manager where?"],1],
["'Do you know how long the delay ___?'",["will be","is will be","be will","will it be"],0]]},

{id:"modals-possibility", cat:"Modals & Rules", title:"Might / May / Could — Possibility", titleUz:"Might / may / could — ehtimollik",
ruleUz:"Might, may va could hozirgi yoki kelasi vaqtdagi ehtimollikni, taxminni bildiradi — ruxsat yoki qobiliyat emas.",
explain:[
"Use might, may, or could when you're not sure about something and you're making a guess: \"It might rain later.\" \"The delay could be traffic.\" \"He may already be at the dock.\" All three are pretty similar in meaning here — a genuine guess about present or future.",
"Don't confuse this with 'can,' which usually states a general ability or fact, not a specific guess: \"It can rain in spring\" (a general fact about spring) vs. \"It might rain today\" (a specific guess about today's weather)."
],
examples:[["It might rain later today.","Bugun keyinroq yomg'ir yog'ishi mumkin."],["The delay could be traffic.","Kechikish tirbandlik tufayli bo'lishi mumkin."],["He may already be at the dock.","U allaqachon maydonchada bo'lishi mumkin."],["We might need to reroute.","Bizga marshrutni o'zgartirish kerak bo'lishi mumkin."],["The scale could be closed tonight.","Tarozi bugun kechqurun yopiq bo'lishi mumkin."]],
mistakeWrong:"It can rain today. (as a specific guess about today)",
mistakeRight:"It might rain today.",
mistakeWhy:"'Can' usually describes a general possibility or fact, while 'might/may/could' express a specific, uncertain guess about one particular situation — mixing them up changes how confident or general your statement sounds.",
quiz:[
["'It ___ rain later today.' (a guess)",["can","might","must","should"],1],
["'The delay ___ be traffic.' (uncertain guess)",["must","could","should","can"],1],
["'He ___ already be at the dock.' (possible)",["may","must","should","can"],0],
["Which expresses a general fact, not a specific guess?",["It might rain today.","It can rain in spring.","It could rain tonight.","It may rain this afternoon."],1],
["'We ___ need to reroute.' (possibility)",["must","might","should","can"],1],
["'The scale ___ be closed tonight.' (uncertain)",["could","must","should","can"],0]]},

{id:"phrasal-verbs", cat:"Prepositions & Connectors", title:"Phrasal Verbs Truckers Use", titleUz:"Haydovchilar ishlatadigan fe'l+old ko'makchi birikmalar",
ruleUz:"Fe'l+old ko'makchi birikmasi (phrasal verb) alohida ma'noga ega bo'ladi — so'zma-so'z tarjima qilib bo'lmaydi.",
explain:[
"A phrasal verb combines a verb with a small word (up, off, over, down...) to make a new meaning that you often can't guess from the verb alone. Trucking English uses these constantly: pull over (stop the vehicle), check in (arrive and register), load up (put cargo in), fill up (add fuel), break down (stop working, mechanically), pick up (collect cargo), drop off (deliver cargo).",
"These can't be translated word-by-word into Uzbek — the meaning belongs to the whole phrase, so it's best to learn each one as a single vocabulary item, the same way you'd learn any other word."
],
examples:[["Pull over at the next exit.","Keyingi chiqishda chetga to'xtang."],["Check in at the front office first.","Avval old ofisda ro'yxatdan o'ting."],["We need to load up before noon.","Tushgacha yuklashimiz kerak."],["Fill up before you hit the highway.","Shosseyga chiqishdan oldin yoqilg'i quying."],["The truck broke down near mile marker 90.","Mashina 90-milya belgisi yaqinida buzildi."]],
mistakeWrong:"Translating 'pull over' or 'break down' word-by-word into Uzbek and back.",
mistakeRight:"Learn the whole phrase as one unit: pull over = stop the vehicle; break down = stop working.",
mistakeWhy:"Phrasal verbs are a known trap for every English learner, not just Uzbek speakers — the individual words often give no hint at all about the combined meaning, so they have to be memorized as complete units.",
quiz:[
["'Pull over' means:",["Speed up","Stop the vehicle at the side","Turn around","Load cargo"],1],
["'Check in' means:",["Leave quickly","Arrive and register","Refuel","Break down"],1],
["'Fill up' means:",["Add fuel until full","Unload cargo","Stop the truck","Check documents"],0],
["'The truck broke down' means:",["The truck was cleaned","The truck stopped working","The truck was loaded","The truck was inspected"],1],
["'Pick up' the cargo means:",["Deliver it","Collect it","Weigh it","Secure it"],1],
["'Drop off' the cargo means:",["Collect it","Deliver it","Weigh it","Inspect it"],1]]},

{id:"dates-times", cat:"Numbers & Comparisons", title:"Saying Dates & Times", titleUz:"Sana va vaqtni aytish",
ruleUz:"Sana aytishda tartib sonlar (fifth), vaqt aytishda soat va daqiqalar (six thirty) ishlatiladi.",
explain:[
"Say clock times as hour + minutes: 6:30 = \"six thirty,\" 7:15 = \"seven fifteen.\" For the top and bottom of the hour, you can also say \"half past six\" (6:30) or \"a quarter past seven\" (7:15). Always add AM or PM when it's not obvious from context.",
"Say dates with the month first, then the ordinal day: March 5th = \"March fifth.\" You can also say \"the fifth of March.\" Years are usually split in pairs: 2024 = \"twenty twenty-four.\""
],
examples:[["My appointment is at six thirty AM.","Uchrashuvim ertalab soat oltiyu o'ttizda."],["The dock closes at a quarter past five.","Maydoncha besh yarim (5:15) da yopiladi."],["Delivery is scheduled for March fifth.","Yetkazib berish mart oyining beshinchisiga rejalashtirilgan."],["I started this job in twenty twenty-two.","Men bu ishni 2022-yilda boshladim."],["We leave at noon and arrive by six PM.","Peshinda jo'nab, kechqurun soat oltigacha yetib boramiz."]],
mistakeWrong:"March five. Twenty two thousand twenty-four.",
mistakeRight:"March fifth. Twenty twenty-four.",
mistakeWhy:"Dates use ordinal numbers (fifth, not five), and years are almost always split into two pairs of digits when spoken (twenty twenty-four), not read as one long number.",
quiz:[
["'My appointment is at ___ AM.' (6:30)",["six thirty","six three zero","half six","six and thirty"],0],
["'Delivery is scheduled for March ___.' (the 5th)",["five","fifth","5th's","fives"],1],
["How do you usually say the year 2024?",["Two thousand twenty-four","Twenty twenty-four","Two zero two four","Both A and B are common"],3],
["'The dock closes at a ___ past five.' (5:15)",["quarter","half","third","fifth"],0],
["Which correctly says 6:30?",["Six thirty","Half past six","Both A and B","Neither"],2],
["'We leave at noon and arrive by ___ PM.' (6:00)",["six","sixth","sixty","six's"],0]]},

{id:"reported-speech", cat:"Advanced", title:"Reported Speech — Relaying What Someone Said", titleUz:"Ko'chirma gap — kimningdir aytganini yetkazish",
ruleUz:"Kimningdir gapini o'z so'zlaring bilan aytib berganda, fe'l zamoni odatda bir bosqich orqaga suriladi (said/told).",
explain:[
"When you relay what someone said — reporting to dispatch what an officer told you, or telling a coworker what dispatch said — use 'said' (no listener named) or 'told' (must name who was told): \"He said (that) the road was closed.\" \"She told me to wait here.\"",
"The verb tense usually shifts one step into the past: \"is\" becomes \"was,\" \"will\" becomes \"would,\" present simple becomes past simple. Direct: \"The road is closed.\" Reported: \"He said the road was closed.\"",
"For a reported command or instruction, use told + person + to + base verb: \"She told me to wait here\" (not \"She told me that I should wait\")."
],
examples:[["He said the road was closed.","U yo'l yopilganini aytdi."],["She told me to wait here.","U menga shu yerda kutishni aytdi."],["Dispatch said they would call back.","Dispetcher qayta qo'ng'iroq qilishlarini aytdi."],["The officer told me to pull over.","Ofitser menga chetga to'xtashni aytdi."],["He said he had already inspected the trailer.","U tirkamani allaqachon tekshirganini aytdi."]],
mistakeWrong:"She told that I should wait. He said me the road is closed.",
mistakeRight:"She told me to wait. He said the road was closed.",
mistakeWhy:"'Said' never takes a listener directly after it (no 'said me') — use 'told' instead when you name who was spoken to. And remember the tense usually shifts back one step: 'is' becomes 'was.'",
quiz:[
["'He ___ the road was closed.' (no listener named)",["told","said","told me","tells"],1],
["'She ___ me to wait here.' (listener named)",["said","told","says","tell"],1],
["Direct: 'The dock is open.' Reported: 'He said the dock ___ open.'",["is","was","will be","has been"],1],
["'The officer told me ___ pull over.'",["that I","to","should","that"],1],
["Which is correct?",["He said me the truck was ready.","He told me the truck was ready.","He told that the truck was ready.","He said that me the truck was ready."],1],
["'Dispatch said they ___ call back.' (future, reported)",["will","would","are going","go"],1]]},

];
if (typeof module !== "undefined") { module.exports = GRAMMAR; }
