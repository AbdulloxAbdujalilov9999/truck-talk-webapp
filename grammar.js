/* TRUCK TALK ENGLISH — Grammar Book
   33 units across 8 categories, written for Uzbek-speaking drivers: every
   "mistake" callout targets a real, specific difference between Uzbek and
   English grammar (word order, articles, do-support, etc.), not a generic
   ESL note. Each unit also carries an optional "teach" field — short,
   teacher-facing notes (classroom drills, what to prioritize) shown only to
   non-student roles; see renderGrammarUnit() in app.js. */
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
["The short form of 'she is' is:",["she's","shes'","she're","she'r"],0]],teach:["Drill out loud before explaining the rule: point at yourself (I am), the student (you are), a third object (it is) rapidly in random order until answers are automatic — Uzbek speakers often know the rule but still drop the verb under pressure.", "Catch every dropped am/is/are in speaking practice immediately; it's the single most common Uzbek-speaker slip in this course."]},

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
["'She works at ___ warehouse downtown.' (one specific warehouse)",["a","an","the","(no article)"],2]],teach:["Don't expect mastery — even advanced Uzbek speakers get articles wrong for years. Focus class time on the highest-value case: 'the' for something both people already know (the dispatcher, the load) vs 'a/an' for something new.", "Quick drill: describe an object twice, first as brand new ('a wrench') then as already mentioned ('the wrench') — repetition builds the ear for it faster than the rule does."]},

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
["'Dispatchers ___ (assign) new loads every morning.'",["assign","assigns","assigning","assigned"],0]],teach:["The -s ending is nearly silent in fast speech, so students often can't hear it even when it's said correctly — have them tap the table on '-s' sounds while reading examples aloud to build the habit by feel, not just by ear."]},

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
["'Right now, the mechanic ___ (fix) my tire.'",["fix","fixes","is fixing","fixed"],2]],teach:["Contrast this directly against present-simple in the same lesson: 'I drive a truck' vs 'I am driving to Dallas' — side-by-side minimal pairs make the difference click faster than teaching either tense alone."]},

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
["Which sentence correctly reports a past event?",["Yesterday I drive 400 miles.","Yesterday I drove 400 miles.","Yesterday I driving 400 miles.","Yesterday I driven 400 miles."],1]],teach:["Irregular past-tense verbs (went, found, drove, said) are the real obstacle, not the grammar rule itself — spend most of class time drilling the irregular verbs that come up in this course rather than the regular -ed pattern, which students usually pick up quickly."]},

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
["The short form of 'I will' is:",["I'll","I'l","Ill","I'ill"],0]],teach:["Keep it simple at this level: 'going to' for a plan already decided, 'will' for a decision made right now or a promise. Most real trucking talk only needs these two uses — don't over-explain finer native-speaker distinctions."]},

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
["'___ this truck have a sleeper berth?'",["Do","Does","Did","Is"],1]],teach:["The word-order flip (Do you...? not You do...?) is the hard part, not vocabulary — drill the question pattern as a chant (Do + subject + verb) before moving to real content."]},

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
["'___ is the dispatcher on the phone?' (asking a person)",["What","Who","Where","When"],1]],teach:["Teach wh-word + do/does/did + subject + verb as one fixed template ('Where do you...', 'What did you...') rather than explaining each wh-word separately — the structure is identical across all of them."]},

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
["'They ___ ready.' (to be, plural)",["isn't","aren't","don't","doesn't"],1]],teach:["Students who've mastered yes/no questions usually pick up negatives fast, since both use do/does/did — teach this unit right after questions and point out the shared structure explicitly."]},

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
["'Drivers ___ carry proof of insurance.' (required by law)",["should","must","might","could"],1]],teach:["'Must' and 'have to' feel interchangeable to a beginner, but the real classroom value is teaching when NOT to use them — e.g. giving advice ('you should') vs stating a hard rule ('you must') matters a lot in DOT contexts."]},

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
["Which is correct?",["I can to help you.","I can helping you.","I can help you.","I cans help you."],2]],teach:["Can/could/may cover three different jobs (ability, past ability, permission) in one short word — ask three quick real-life questions in a row ('Can you drive stick?' 'Could you drive at 18?' 'May I park here?') so students feel the difference rather than memorize a list."]},

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
["'She works ___ the warehouse downtown.'",["at","to","from","on"],0]],teach:["Prepositions rarely translate word-for-word from Uzbek, so treat 'at the dock', 'in the cab', 'on the highway' as fixed phrases to memorize rather than deriving them from a rule — flashcards work better here than explanation."]},

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
["'We usually eat ___ the morning.'",["at","on","in","for"],2]],teach:["Give students the three-word cheat sheet up front: 'at' for a clock time, 'on' for a day/date, 'in' for a longer period (month, year) — this one sentence covers almost every real case they'll need."]},

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
["'___ I arrive, I'll call you.' (certain to happen)",["If","When","But","So"],1]],teach:["'Because' and 'so' are the two truckers use constantly in real explanations (why they're late, why a load is delayed) — prioritize those two over 'if/when', which students already partly get from the conditionals unit."]},

{id:"comparatives", cat:"Numbers & Comparisons", title:"Comparatives & Superlatives — faster, the fastest", titleUz:"Qiyosiy va orttirma daraja — faster, the fastest",
ruleUz:"Qisqa sifatlarga -er/-est, uzun sifatlarga more/most qo'shiladi; ba'zilari tartibsiz (good→better→best).",
explain:[
"For short adjectives (one syllable, or two ending in -y), add -er to compare two things and -est for the top of a group: fast → faster → the fastest, heavy → heavier → the heaviest (y changes to i).",
"For longer adjectives, use 'more'/'most' instead of changing the word: expensive → more expensive → the most expensive. A few common words are irregular and must be memorized: good → better → the best, bad → worse → the worst, far → farther → the farthest."
],
examples:[["This route is faster than the highway.","Bu marshrut shossedan tezroq."],["That's the biggest truck stop I've seen.","Bu men ko'rgan eng katta bekat."],["Diesel is more expensive this month.","Bu oy dizel qimmatroq."],["My new truck is better than the old one.","Yangi mashinam eskisidan yaxshiroq."],["This is the worst traffic I've seen today.","Bu bugun ko'rgan eng yomon tirbandlik."]],
mistakeWrong:"more faster, the most fastest",
mistakeRight:"faster, the fastest",
mistakeWhy:"Never combine both methods on one word — a short adjective takes EITHER -er/-est OR more/most, never both together.",
quiz:[
["'This route is ___ than the highway.' (fast)",["more fast","fastest","faster","most fast"],2],
["'That's ___ truck stop I've seen.' (big, top of the group)",["bigger","the biggest","more big","most big"],1],
["'Diesel is ___ this month.' (expensive, longer word)",["expensiver","more expensive","most expensive","the expensivest"],1],
["'My new truck is ___ than the old one.' (good, irregular)",["gooder","more good","better","best"],2],
["Which is correct?",["This is more faster.","This is the most fastest.","This is faster.","This is fastest than that."],2],
["'This is ___ traffic I've seen today.' (bad, top of the group)",["worse","the worst","more bad","badder"],1]],teach:["Trucker context makes this concrete fast: compare two routes, two trucks, two loads out loud ('this route is faster', 'that load is the heaviest') — real comparisons stick better than abstract examples."]},

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
["Which is correct?",["five box","five boxs","five boxes","five boxies"],2]],teach:["Countable vs uncountable (many trucks vs much fuel) is the crux — have students sort a quick list of trucking nouns into two columns (countable / uncountable) as a warm-up before the explanation."]},

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
["'If the scale shows overweight, you ___ adjust the load.' (a rule)",["should","might","must","could"],2]],teach:["This unit covers real safety language ('if the brakes fail, pull over') — lean into that: have students write or say their own 'if X, then Y' safety rule, which is both grammar practice and genuinely useful content."]},

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
["Which is a polite instruction?",["Wait here.","Please wait here.","You wait here.","Waiting here."],1]],teach:["Imperatives are how every trainer/mechanic gives instructions in this course — teach it through role-play: have the student give YOU inspection instructions ('open the hood', 'check the oil') instead of just reading examples."]},

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
["Which is correct?",["The officer my documents checked.","The officer checked my documents.","My documents the officer checked.","Checked the officer my documents."],1]],teach:["Basic S-V-O order differs from Uzbek's S-O-V, so this unit is foundational — if a student keeps making mistakes elsewhere, it's often actually a word-order problem underneath, so revisit this unit before assuming it's a tense or vocabulary issue."]},

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
["Which is correct?",["Me truck is parked outside.","My truck is parked outside.","I truck is parked outside.","Mine truck is parked outside."],1]],teach:["Confusing 'your'/'you're' or 'their'/'there'/'they're' in writing is common even at higher levels — if you're teaching literacy alongside speaking, spend extra time on the written forms specifically."]},

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
["'We have ___ miles left.' (1,200)",["twelve hundred","one twelve hundred","hundred twelve","twelve thousand"],0]],teach:["Ordinal numbers (1st, 2nd, 3rd) matter for real trucking situations — exit numbers, dates, addresses — more than students expect; don't treat this as a 'beginner' unit to rush through."]},

{id:"present-perfect", cat:"Tenses", title:"Present Perfect — Experience & Recent Events", titleUz:"Hozirgi tugallangan zamon — tajriba va yaqinda sodir bo'lgan voqealar",
ruleUz:"have/has + o'tgan zamon shakli (participle) — tajriba yoki hozirgacha davom etayotgan vaqtni bildiradi.",
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
["'She ___ (work) here since 2020.'",["work","worked","has worked","working"],2]],teach:["This is one of the hardest tenses for Uzbek speakers, since Uzbek doesn't distinguish 'I have driven' (experience, unspecified time) from 'I drove' (a specific past time) the same way — contrast the two directly using the same verb in both forms."]},

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
["Past continuous is formed with:",["will + verb-ing","was/were + verb-ing","have + verb-ing","did + verb-ing"],1]],teach:["Pair this with past-simple in the same session: 'I was driving when the tire blew' — past continuous sets the scene, past simple is the interrupting event. This pairing is common in real incident storytelling."]},

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
["'Do you know how long the delay ___?'",["will be","is will be","be will","will it be"],0]],teach:["This unit is really about softening direct questions for customer-facing situations (dispatch, warehouse staff, DOT officers) — role-play a polite version of a question the student would normally ask bluntly."]},

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
["'The scale ___ be closed tonight.' (uncertain)",["could","must","should","can"],0]],teach:["Might/may/could for possibility is subtle even for advanced learners — keep this unit light and example-heavy rather than rule-heavy; recognizing it in context (weather/traffic reports) matters more than producing it perfectly."]},

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
["'Drop off' the cargo means:",["Collect it","Deliver it","Weigh it","Inspect it"],1]],teach:["See the notes on 'Phrasal Verbs Truckers Use II' for a shared drill idea — mime or act out each phrasal verb while saying it; the physical action anchors the meaning better than a definition does."]},

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
["'We leave at noon and arrive by ___ PM.' (6:00)",["six","sixth","sixty","six's"],0]],teach:["Reading dates and clock times out loud is a real daily task (logbooks, appointments) — spend more time having students SAY dates/times than read the rule; this is a fluency unit, not a comprehension one."]},

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
["'Dispatch said they ___ call back.' (future, reported)",["will","would","are going","go"],1]],teach:["This is advanced and genuinely hard — only introduce it once present/past tenses feel solid. Real use case: relaying what a dispatcher said ('He said the load was ready') comes up constantly on the job, so it's worth the difficulty."]},

{id:"gerunds-infinitives", cat:"Advanced", title:"Gerunds vs. Infinitives — Verb + -ing vs Verb + to", titleUz:"Gerundiy va infinitiv — fe'l + -ing yoki fe'l + to",
ruleUz:"Ba'zi fe'llardan keyin boshqa fe'l -ing bilan, ba'zilaridan keyin esa 'to' bilan keladi — buni qoida bilan emas, har bir fe'l uchun alohida yodlash kerak.",
explain:[
"Some verbs are followed by another verb ending in -ing (a gerund): enjoy, avoid, finish, practice, keep on. \"I enjoy driving at night.\" \"We finished loading the trailer.\" Other verbs are followed by \"to\" + the base verb (an infinitive): want, need, plan, decide, agree. \"She wants to become an owner-operator.\"",
"There's no shortcut rule for which is which — you have to learn each verb individually, the same way you'd learn a new vocabulary word. A short list of the most common ones is enough to cover most real trucking conversation."
],
examples:[["I enjoy driving long routes.","Men uzun marshrutlarda haydashni yoqtiraman."],["She wants to become an owner-operator.","U mustaqil haydovchi bo'lishni xohlaydi."],["We finished loading the trailer.","Biz tirkamani yuklashni tugatdik."],["He avoided hitting the pothole.","U chuqurga tushib ketishdan qochdi."],["They plan to leave at 5 AM.","Ular ertalab soat 5 da jo'nashni rejalashtirmoqda."]],
mistakeWrong:"I want driving fast. She enjoys to drive at night.",
mistakeRight:"I want to drive fast. She enjoys driving at night.",
mistakeWhy:"Uzbek doesn't have this to/-ing split, so after a verb like 'want' (xohlamoq) it feels natural to just add -ing the same way you would after 'enjoy.' Which pattern a verb takes has to be memorized case by case.",
quiz:[
["I enjoy ___ (drive) long routes.",["drive","to drive","driving","drove"],2],
["She wants ___ (become) an owner-operator.",["become","becoming","to become","became"],2],
["We finished ___ (load) the truck.",["load","to load","loading","loaded"],2],
["He avoided ___ (hit) the curb.",["hit","to hit","hitting","hits"],2],
["They plan ___ (leave) at 5 AM.",["leave","to leave","leaving","left"],1],
["I need ___ (check) my tires.",["check","to check","checking","checked"],1],
["Which is correct?",["I enjoy to drive.","I enjoy driving.","I enjoy drive.","I enjoy drove."],1],
["She practices ___ (speak) English every day.",["speak","to speak","speaking","spoke"],2]],
teach:["Give students a short list of 'gerund verbs' (enjoy, avoid, finish, practice) vs 'infinitive verbs' (want, need, plan, decide) and have them memorize it like vocabulary, not a grammar rule — there's no shortcut, so treat each verb as its own flashcard.","Quick drill: say a verb from the list and have each driver make one true sentence about their own job on the spot — this builds the habit faster than worksheets."]},

{id:"passive-voice", cat:"Advanced", title:"Passive Voice — Reporting What Happened", titleUz:"Majhul nisbat — sodir bo'lgan voqeani bildirish",
ruleUz:"Majhul nisbat 'was/were' yoki 'is/are' + fe'lning III shakli bilan yasaladi va harakatni kim qilgani emas, nima sodir bo'lganiga urg'u beradi.",
explain:[
"Use the passive voice (was/were, or is/are + the past participle) when the action matters more than who did it — this is common in reports: \"The trailer was loaded at 6 AM\" focuses on what happened, not who loaded it.",
"Form it with is/are (present) or was/were (past) + the past participle of the verb: \"The truck is inspected every morning.\" \"The load was delivered on time.\""
],
examples:[["The truck was inspected this morning.","Yuk mashinasi bugun ertalab tekshirildi."],["The load was delivered on time.","Yuk o'z vaqtida yetkazib berildi."],["The brakes were checked before the trip.","Tormozlar sayohatdan oldin tekshirildi."],["The paperwork is signed at the dock.","Hujjatlar dokda imzolanadi."],["The accident was reported to dispatch.","Baxtsiz hodisa dispetcherga xabar qilindi."]],
mistakeWrong:"The truck inspected this morning. The load delivered yesterday.",
mistakeRight:"The truck was inspected this morning. The load was delivered yesterday.",
mistakeWhy:"Uzbek passive forms (masalan, 'tekshirildi') are a single word, so it's easy to forget the English 'was/were' helper and use only the past participle — English always needs the be-verb.",
quiz:[
["The load ___ (deliver) yesterday.",["delivered","was delivered","is delivered","deliver"],1],
["The trailer ___ (inspect) every week.",["inspects","inspected","is inspected","inspecting"],2],
["Which sentence is passive?",["The mechanic fixed the truck.","The truck was fixed by the mechanic.","The mechanic fixes trucks.","The mechanic is fixing the truck."],1],
["The report ___ (send) to dispatch this morning.",["sent","was sent","sends","is sending"],1],
["All drivers ___ (require) to log their hours.",["require","required","are required","requiring"],2],
["The tires ___ (check) before every trip.",["check","checked","are checked","checking"],2],
["My license ___ (renew) last month.",["renewed","was renewed","is renewed","renews"],1],
["The cargo ___ (secure) with straps.",["secured","was secured","secures","securing"],1]],
teach:["Passive voice is genuinely useful for real DOT/incident reports, where a driver needs to describe what happened without pointing blame ('the trailer was damaged' rather than 'I damaged the trailer') — frame it that way rather than as an abstract rule.","Drill: give a short incident scenario (e.g. a flat tire) and have the driver describe it in 2-3 passive sentences, like a real report."]},

{id:"tag-questions", cat:"Questions", title:"Tag Questions — aren't you? / didn't you?", titleUz:"Qo'shimcha savollar — aren't you? / didn't you?",
ruleUz:"Gap tasdiq bo'lsa, oxiridagi qisqa savol inkor bo'ladi; gap inkor bo'lsa, qisqa savol tasdiq bo'ladi.",
explain:[
"A tag question is a short question added to the end of a statement, used to confirm something or start small talk: \"You're new here, aren't you?\" If the sentence is positive, the tag is negative (aren't you); if the sentence is negative, the tag is positive (did you).",
"The tag matches the main verb: \"You are... aren't you?\" \"You can... can't you?\" \"You didn't... did you?\" Truckers use these constantly in casual talk with dispatchers and other drivers."
],
examples:[["You're the new driver, aren't you?","Siz yangi haydovchisiz, shunday emasmi?"],["You didn't forget the paperwork, did you?","Hujjatlarni unutmadingiz, shundaymi?"],["This is your first route, isn't it?","Bu sizning birinchi marshrutingiz, shunday emasmi?"],["You can drive a manual, can't you?","Siz mexanika bilan hayday olasiz, shunday emasmi?"],["The load isn't ready yet, is it?","Yuk hali tayyor emas, shundaymi?"]],
mistakeWrong:"You are new here, are you? He can drive, can he?",
mistakeRight:"You are new here, aren't you? He can drive, can't he?",
mistakeWhy:"Since Uzbek has no positive/negative flip like this, it feels natural to just repeat the same verb form — but English tags almost always flip polarity: a positive statement gets a negative tag, and the reverse.",
quiz:[
["You're tired, ___?",["are you","aren't you","is you","isn't you"],1],
["She didn't call dispatch, ___?",["does she","did she","didn't she","doesn't she"],1],
["He can fix the brakes, ___?",["can he","can't he","does he","doesn't he"],1],
["This isn't the right exit, ___?",["is it","isn't it","was it","wasn't it"],0],
["You checked the oil, ___?",["did you","didn't you","do you","don't you"],1],
["They are on schedule, ___?",["are they","aren't they","do they","don't they"],1],
["You don't have a CDL, ___?",["do you","don't you","did you","have you"],0],
["We're stopping here, ___?",["are we","aren't we","do we","don't we"],1]],
teach:["Tag questions are almost entirely about the flip in polarity (positive statement to negative tag, or the reverse) — drill this pattern out loud rather than explaining the grammar term; most students pick it up faster by ear than by rule.","Quick pair drill: one driver makes a true statement about the other ('You're from Tashkent'), the partner adds the correct tag out loud ('...aren't you?') and confirms or corrects it."]},

{id:"confusing-pairs", cat:"Common Mix-ups", title:"Confusing Word Pairs — too / either, a little / a few, still / yet", titleUz:"Chalkashtiriladigan so'z juftliklari — too / either, a little / a few, still / yet",
ruleUz:"Bu so'z juftliklari o'zbek tilidagi bitta so'zga to'g'ri kelmaydi, shuning uchun gap turi (tasdiq/inkor, sanaladigan/sanalmaydigan)ga qarab to'g'ri so'zni tanlash kerak.",
explain:[
"'Too' agrees with a positive statement (\"I'm tired too\"); 'either' agrees with a negative one (\"I'm not tired either\"). 'A little' is for uncountable nouns (a little fuel), 'a few' is for countable ones (a few miles).",
"'Still' means something is continuing (\"I'm still driving\"); 'yet' is used in questions or negatives about something expected (\"Are we there yet?\" \"I haven't arrived yet\"). 'Lend' means giving something (I'll lend you my wrench); 'borrow' means receiving it (Can I borrow your wrench?)."
],
examples:[["I'm hungry too. — I'm not hungry either.","Men ham ochman. — Men ham och emasman."],["We have a little fuel left.","Bizda biroz yoqilg'i qoldi."],["We have a few miles left.","Bizda bir necha milya qoldi."],["We haven't arrived yet.","Biz hali yetib bormadik."],["Can I borrow your flashlight? — Sure, I'll lend it to you.","Fonaringizni olsam bo'ladimi? — Albatta, beraman."]],
mistakeWrong:"I'm not tired too. We have a little miles left.",
mistakeRight:"I'm not tired either. We have a few miles left.",
mistakeWhy:"These pairs don't map onto single Uzbek words, so it's easy to use the same word (e.g. 'ham' for both too/either) in both positive and negative sentences, or to mix up countable and uncountable nouns.",
quiz:[
["I don't like this route ___.",["too","either","also","neither"],1],
["She likes this route ___.",["too","either","neither","also too"],0],
["We have ___ time before we need to leave. (uncountable)",["a few","many","a little","much of"],2],
["There are ___ trucks ahead of us. (countable)",["a little","much","a few","little"],2],
["Are we there ___?",["still","yet","already","more"],1],
["I am ___ waiting for the dispatcher.",["yet","already","still","more"],2],
["Can I ___ your pen? — Sure, I'll ___ it to you.",["borrow / lend","lend / borrow","borrow / borrow","lend / lend"],0],
["He didn't sleep well, and I didn't ___.",["too","either","also","neither"],1]],
teach:["These pairs don't translate cleanly to Uzbek, so drilling them as fixed chunks (I'm tired too / I'm not tired either) works better than explaining the rule abstractly — have students repeat both versions of each pair back to back.","Borrow/lend is worth a quick role-play: one driver asks to borrow a tool, the other offers to lend it — this is a genuinely common real exchange at a truck stop."]},

{id:"phrasal-verbs-2", cat:"Prepositions & Connectors", title:"Phrasal Verbs Truckers Use II", titleUz:"Haydovchilar ishlatadigan fe'l+old ko'makchi birikmalar — II",
ruleUz:"Bu fe'l birikmalarining ma'nosi ham so'zma-so'z tarjimadan chiqmaydi — har birini alohida so'z sifatida yodlash kerak.",
explain:[
"More phrasal verbs common on the road: back up (reverse), pull out (leave a spot), turn off (shut down the engine), run out of (have none left), watch out for (be alert to a hazard), hold up (delay), catch up (get caught up on something behind).",
"Some of these need a preposition after them to complete the meaning — run out OF fuel, watch out FOR ice. Dropping that small word changes or breaks the meaning, so learn the whole phrase together, preposition included."
],
examples:[["Back up slowly — I'll guide you.","Sekin orqaga yuring — men sizga yo'l ko'rsataman."],["We pulled out of the yard at 5 AM.","Biz ertalab soat 5 da hovlidan chiqdik."],["Turn off the engine before you check the oil.","Moyni tekshirishdan oldin dvigatelni o'chiring."],["Don't run out of fuel on the highway.","Shosseyda yoqilg'ingiz tugab qolmasin."],["Watch out for black ice this morning.","Bugun ertalab muzga ehtiyot bo'ling."]],
mistakeWrong:"I ran out gas. Watch out ice.",
mistakeRight:"I ran out of gas. Watch out for ice.",
mistakeWhy:"Some phrasal verbs need a small connecting word (of, for) that's easy to drop since Uzbek doesn't mark it the same way — these three-word combinations are their own trap on top of the simpler two-word phrasal verbs.",
quiz:[
["___ slowly so I can guide you into the dock.",["Back up","Back off","Back down","Back out"],0],
["We ___ of the yard before sunrise.",["pulled off","pulled out","pulled up","pulled over"],1],
["Always ___ the engine before checking the oil.",["turn off","turn out","turn down","turn over"],0],
["Don't ___ fuel on a long stretch of highway.",["run out","run out of","run off","run low of"],1],
["___ black ice — the road is slippery.",["Watch out for","Watch out","Look out","Look for"],0],
["The accident ___ traffic for an hour.",["held up","held on","held off","held back"],0],
["I need to ___ on my paperwork.",["catch on","catch up","catch out","catch in"],1],
["Which phrasal verb needs 'of' right after it?",["watch out","run out","turn off","pull out"],1]],
teach:["Phrasal verbs are pure memorization — there's no shortcut rule, so treat each one exactly like a vocabulary flashcard rather than trying to explain the grammar behind it.","Good classroom drill: act out or mime the phrasal verb (backing up, turning a key to turn off) while saying the sentence — physical action plus the phrase sticks better than the phrase alone."]},

];
if (typeof module !== "undefined") { module.exports = GRAMMAR; }
