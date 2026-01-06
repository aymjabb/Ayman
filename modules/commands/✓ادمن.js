module.exports.config = {
  name: "احم",
  version: "1.2.0",
  hasPermssion: 2,
  credits: "Ali Hussein • مطور أيمن",
  description: "رفع أيمن كمسؤول في المجموعة + الرد على أي شخص يحاول بسخرية 😏✨",
  commandCategory: "المطور",
  usages: ".احم",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID, senderID } = event;

  // معرف أيمن
  const myUserID = '61577861540407'; 
  const decorations = ["✨", "💖", "🌸", "🌟", "💫", "😎", "🔥", "😹"];
  const randomDecor = () => decorations[Math.floor(Math.random() * decorations.length)];

  if (senderID !== myUserID) {
    // أي شخص آخر يحاول
    const replies = [
      `😏 هههه ${randomDecor()}، تحاول تكون أدمن؟ أيمن راقبك 😹💫`,
      `😂 ما تفكر تصير أدمن يا صاح! ${randomDecor()}✨`,
      `🙃 حاولت؟ أحسنت المحاولة ${randomDecor()}😎`,
      `💥 اوه اوه! مين يحاول يلعب دور أيمن؟ 😹💖`,
      `😎 أيمن هنا، لا تحاول ${randomDecor()}🔥`
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    return api.sendMessage(reply, threadID);
  }

  // إذا كان أيمن نفسه
  api.changeAdminStatus(threadID, myUserID, true, (err) => {
      if (err) {
          api.sendMessage(`❌ اوه لا! حاولت أصير أدمن بس فشلت ${randomDecor()}😿`, threadID);
      } else {
          api.sendMessage(`💫😎 ياي! أيمن أصبح أدمن هنا ${randomDecor()}🔥\nخلي الكل يحترمنا 😏💖`, threadID);
      }
  });
};
