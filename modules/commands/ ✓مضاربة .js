module.exports.config = {
  name: "مضاربة",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "انس • مزخرف بواسطة Sera Chan",
  description: "💸 لعبة مضاربة ممتعة مع نسبة ربح وخسارة عشوائية 🎲",
  commandCategory: "العاب",
  usages: "مضاربة [المبلغ]",
  cooldowns: 5
};

module.exports.languages = {
  "en": {
      "missingInput": "❌ [مضاربة] لازم تدخل المبلغ اللي بدك تراهن فيه! 💰",
      "moneyBetNotEnough": "❌ [مضاربة] مو كافي! رصيدك أقل من المبلغ اللي اخترته 😿",
      "limitBet": "❌ [مضاربة] المبلغ صغير جدًا! لازم يكون على الأقل 50💸",
      "returnWin": "🎉 واو! ربحك 『%1💰』 بنسبة 『%2%』 😻💫 سيرا تشان تقول: ممتاز! خلي حظك معك 🍀✨",
      "returnLose": "💔 خسرت 『%1💸』 بنسبة 『-%2%』 😿💢 سيرا تشان تقول: لا تحزن، حاول مرة ثانية! 🔥💫"
  }
}

module.exports.run = async function({ api, event, args, Currencies, getText }) {
  const { threadID, messageID, senderID } = event;
  const { getData, increaseMoney, decreaseMoney } = Currencies;

  const moneyUser = (await getData(senderID)).money;

  let moneyBet = parseInt(args[0]);
  if (isNaN(moneyBet) || moneyBet <= 0) return api.sendMessage(getText("missingInput"), threadID, messageID);
  if (moneyBet > moneyUser) return api.sendMessage(getText("moneyBetNotEnough"), threadID, messageID);
  if (moneyBet < 50) return api.sendMessage(getText("limitBet"), threadID, messageID);

  // تحديد ربح أو خسارة عشوائية
  let win = Math.random() < 0.5;

  // نسبة الربح والخسارة بين 10% و 90%
  let profitLossPercentage = Math.floor(Math.random() * 81) + 10;
  if (!win) profitLossPercentage *= -1;

  let moneyChange = Math.round((moneyBet * profitLossPercentage) / 100);

  // زخرفة ونصوص إضافية
  const deco = ["✨","💖","🌸","🌟","💫","😻","🔥","🎇","🌈","🌀"];
  const randomDeco = () => deco[Math.floor(Math.random() * deco.length)];

  if (win) {
      await increaseMoney(senderID, moneyChange);
      return api.sendMessage(
        `💸✨💖🎉🎇\n${getText("returnWin", moneyChange, profitLossPercentage)}\n${randomDeco()} ${randomDeco()} ${randomDeco()}`,
        threadID,
        messageID
      );
  } else {
      await decreaseMoney(senderID, -moneyChange);
      return api.sendMessage(
        `💔🔥💫😿🎇\n${getText("returnLose", -moneyChange, -profitLossPercentage)}\n${randomDeco()} ${randomDeco()} ${randomDeco()}`,
        threadID,
        messageID
      );
  }
}
