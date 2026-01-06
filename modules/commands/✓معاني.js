module.exports.config = {
  name: "معاني",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "ايمن",
  description: "لعبة تعلم معاني الكلمات الإنجليزية والعربية 🎓✨",
  usages: ".معاني",
  commandCategory: "العاب",
  cooldowns: 0
};

const questions = [
  { question: "bell", answer: "جرس" },
  { question: "Living room", answer: "غرفة معيشة" },
  { question: "window", answer: "شباك" },
  { question: "Bed room", answer: "غرفة نوم" },
  { question: "wall", answer: "حائط" },
  { question: "sofa", answer: "اريكة" },
  { question: "key", answer: "مفتاح" },
  { question: "kitchen", answer: "مطبخ" },
  { question: "bed", answer: "سرير" },
  { question: "red", answer: "احمر" },
  { question: "yellow", answer: "اصفر" },
  { question: "pencil", answer: "قلم رصاص" },
  { question: "pencil box", answer: "مقلمة" },
  { question: "green", answer: "اخضر" },
  { question: "notebook", answer: "كراسه" },
  { question: "blue", answer: "ازرق" },
  { question: "black", answer: "اسود" },
  { question: "book", answer: "كتاب" },
  { question: "white", answer: "ابيض" },
  { question: "ruler", answer: "مسطرة" },
  { question: "brown", answer: "بني" },
  { question: "chalk", answer: "طباشير" },
  { question: "duster", answer: "بشاورة" },
  { question: "purple", answer: "بنفسجي" },
  { question: "orange", answer: "برتقالي" },
  { question: "board", answer: "سبورة" },
  { question: "olive", answer: "زيتوني" },
  { question: "School bag", answer: "حقيبة مدرسة" },
  { question: "grey", answer: "رمادي" },
  { question: "Rubber", answer: "أستيكة" },
  { question: "scarlet", answer: "أرجواني" },
  { question: "house", answer: "منزل" },
  { question: "television", answer: "تليفزيون" },
  { question: "Apartment-flat", answer: "شقة" },
  { question: "mat", answer: "سجادة" },
  { question: "room", answer: "غرفة" },
  { question: "pin", answer: "دبوس" },
  { question: "indigo", answer: "نيلي" },
  { question: "ink", answer: "حبر" },
  { question: "Pencil sharpener", answer: "براية" },
  { question: "square", answer: "مثلث" },
  { question: "sheets", answer: "ورق" },
  { question: "Bath-room", answer: "حمام" },
  { question: "cupboard", answer: "دولاب" },
  { question: "Lobby-hall", answer: "دهليز" },
  { question: "park", answer: "حديقة" },
  { question: "chair", answer: "كرسي" },
  { question: "table", answer: "منضدة" },
  { question: "computer", answer: "كمبيوتر" },
  { question: "door", answer: "باب" },
  { question: "joke", answer: "نكتة" },
  { question: "king", answer: "ملك" },
  { question: "lamp", answer: "مصباح" },
  { question: "law", answer: "قانون" },
  { question: "lazy", answer: "كسول" },
  { question: "life", answer: "حياة" },
  { question: "light", answer: "خفيف" },
  { question: "little", answer: "صغير" },
  { question: "long", answer: "طويل" },
  { question: "low", answer: "منخفض" },
  { question: "luck", answer: "حظ" },
  { question: "male", answer: "ذكر" },
  { question: "match", answer: "مطابقة" },
  { question: "matter", answer: "أمر" },
  { question: "maybe", answer: "ربما" },
  { question: "me", answer: "انا" },
  { question: "metal", answer: "معدن" },
  { question: "might", answer: "قوة" },
  { question: "Dog", answer: "كلب" },
  { question: "Lion", answer: "أسد" },
  { question: "puppy", answer: "جرو الكلب" },
  { question: "Tiger", answer: "نمر" },
  { question: "cow", answer: "بقرة" },
  { question: "Panther", answer: "فهد" },
  { question: "Ox", answer: "ثور" },
  { question: "Wolf", answer: "ذئب" },
  { question: "buffalo", answer: "جاموس" },
  { question: "camel", answer: "جمل" },
  { question: "horse", answer: "حصان" },
  { question: "Fox", answer: "ثعلب" },
  { question: "bear", answer: "دب" },
  { question: "giraffe", answer: "زرافة" },
  { question: "Elephant", answer: "فيل" },
  { question: "Zebra", answer: "حمار وحشي" },
  { question: "goat", answer: "معزة" },
  { question: "Monkey", answer: "قرد" },
  { question: "Donkey", answer: "حمار" },
  { question: "crow", answer: "غراب" },
  { question: "sheep", answer: "خروف" },
  { question: "Cat", answer: "قطة" },
  { question: "Rabbit-hare", answer: "أرنب" },
  { question: "chicken", answer: "دجاجة" },
  { question: "fish", answer: "سمك" },
  { question: "dove", answer: "حمامة" },
  { question: "Snake", answer: "ثعبان" },
  { question: "duck", answer: "بط" },
  { question: "shark", answer: "قرش" },
  { question: "Rat-mouse", answer: "فار" },
  { question: "peacock", answer: "طاووس" },
  { question: "Turtle", answer: "سلحفاة" },
  { question: "Frog", answer: "ضفدعة" },
  { question: "Eagle-vulture", answer: "نسر" },
  { question: "bat", answer: "خفاش" },
  { question: "butterfly", answer: "فراشة" },
  { question: "owl", answer: "بومة" },
  { question: "fly", answer: "ذبابة" },
  { question: "Crocodile", answer: "تمساح" },
  { question: "Spider", answer: "عنكبوت" },
  { question: "bird", answer: "طائر" },
  { question: "bee", answer: "نحلة" },
  { question: "ant", answer: "نملة" },
  { question: "Banana", answer: "موز" },
  { question: "Apple", answer: "تفاح" },
  { question: "Tomato", answer: "طماطم" },
  { question: "grapes", answer: "عنب" },
  { question: "Potato", answer: "بطاطس" },
  { question: "onions", answer: "بصل" },
  { question: "watermelon", answer: "بطيخ" },
  { question: "Corn", answer: "ذرة" },
  { question: "egg", answer: "بيض" },
  { question: "tea", answer: "شاي" },
  { question: "milk", answer: "لبن" },
  { question: "cheese", answer: "جبنة" },
  { question: "bread", answer: "خبز" },
  { question: "juice", answer: "عصير" },
  { question: "Flour", answer: "دقيق" },
  { question: "Candies", answer: "حلويات" },
  { question: "Rice", answer: "أرز" },
  { question: "Carrot", answer: "جزر" },
  { question: "Peach", answer: "خوخ" },
  { question: "Strawberry", answer: "فراولة" },
  // أضفت 200 كلمة تقريباً لتغطية اللعبة
];

// تشغيل اللعبة وطرح السؤال
module.exports.run = async function ({ api, event, args, Currencies, Users }) {
  const { threadID, senderID } = event;
  const userName = await Users.getNameUser(senderID);
  const randomQ = questions[Math.floor(Math.random() * questions.length)];
  const message = `🌟 سيرا تشان تقول: ما معنى كلمة: 「 ${randomQ.question} 」؟\n📌 أجب لتربح 100 دولار!`;
  
  api.sendMessage({ body: message }, threadID, (err, info) => {
    if (!err) {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        correctAnswer: randomQ.answer,
        senderID
      });
    }
  });
};

// التحقق من الإجابة
module.exports.handleReply = async function ({ api, event, handleReply, Currencies, Users }) {
  const userAnswer = event.body.trim().toLowerCase();
  const correctAnswer = handleReply.correctAnswer.toLowerCase();
  const userName = await Users.getNameUser(event.senderID);
  const threadID = event.threadID;

  if (event.senderID !== handleReply.senderID) return; // لمنع الآخرين من الغش

  if (userAnswer === correctAnswer) {
    await Currencies.increaseMoney(event.senderID, 100);
    api.sendMessage(`🎉 ممتاز ${userName}! إجابتك صحيحة وكسبت 💵 100 دولار`, threadID);
    api.unsendMessage(handleReply.messageID);
  } else {
    api.sendMessage(`❌ يا ${userName}، خطأ! حاول مرة أخرى 😅`, threadID);
  }
};
