const axios = require("axios");

module.exports.config = {
  name: "مسابقة",
  version: "1.5.0",
  hasPermssion: 0,
  credits: "Ayman & Sera",
  description: "نظام مسابقات (أسئلة وسرعة) لزيادة تفاعل الكروب",
  commandCategory: "ترفيه",
  usages: ".مسابقة",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID } = event;

  // قائمة الأسئلة والأجوبة (يمكنك زيادة الأسئلة هنا)
  const games = [
    { q: "ما هو الشيء الذي يكتب ولا يقرأ؟", a: "القلم" },
    { q: "ما هو الشيء الذي كلما زاد نقص؟", a: "العمر" },
    { q: "ما هو كوكب المريخ؟ (أحمر/أزرق/أخضر)", a: "أحمر" },
    { q: "ما هو الشيء الذي له أسنان ولا يعض؟", a: "المشط" },
    { q: "ماهي عاصمة العراق؟", a: "بغداد" },
    { q: "اسرع كائن حي على وجه الارض؟", a: "الفهد" },
    { q: "كم عدد ألوان قوس قزح؟", a: "7" }
  ];

  const game = games[Math.floor(Math.random() * games.length)];

  const msg = `
🎮 مـسـابـقـة سـيـرا الـسـريـعـة 🎮
──────────────────
💡 الـسـؤال:
【 ${game.q} 】
──────────────────
⏳ لـديـك 20 ثـانـيـة لـلإجـابـة!
(رد عـلـى هـذه الـرسـالـة بـالإجـابـة)
  `;

  return api.sendMessage(msg, threadID, (err, info) => {
    global.client.handleReply.push({
      name: "مسابقة",
      messageID: info.messageID,
      author: event.senderID,
      answer: game.a
    });
  }, messageID);
};

module.exports.handleReply = async ({ api, event, handleReply }) => {
  const { body, threadID, senderID, messageID } = event;
  
  if (handleReply.name !== "مسابقة") return;

  if (body.toLowerCase() === handleReply.answer.toLowerCase()) {
    const successMsg = `
🎊 مـبـرووك يـا بـطـل! 🎊
──────────────────
👤 الـفـائـز: [ ${senderID} ]
✅ الإجـابـة: ${handleReply.answer}
──────────────────
✨ لـقـد حـصـلـت عـلـى 500 نـقـطـة تـقـديـراً لـذكـائـك! 🐾
    `;
    api.sendMessage(successMsg, threadID, messageID);
    
    // إزالة بيانات الرد لمنع تكرار الإجابة
    const index = global.client.handleReply.findIndex(item => item.messageID === handleReply.messageID);
    if (index !== -1) global.client.handleReply.splice(index, 1);
    
  } else {
    api.sendMessage("❌ إجابة خاطئة! حاول مرة أخرى بتركيز.. 🐾", threadID, messageID);
  }
};
