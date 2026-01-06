module.exports.config = {
  name: "رمضان",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "عمر",
  description: "الوقت المتبقي لرمضان 🐱✨",
  commandCategory: "خدمات",
  cooldowns: 5
}

module.exports.run = function ({ event, api }) {
    const targetDate = Date.parse("March 23, 2023 00:00:00");
    const now = Date.parse(new Date());
    const t = targetDate - now;

    if (t <= 0) {
        return api.sendMessage("🎉🐱😺 رمضان كريم! الوقت قد حان للصيام والتمر والحلويات 😋", event.threadID, event.messageID);
    }

    const seconds = Math.floor((t / 1000) % 60);
    const minutes = Math.floor((t / 1000 / 60) % 60);
    const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    const days = Math.floor(t / (1000 * 60 * 60 * 24));

    const message = `🌙🐱✨ العد التنازلي لشهر رمضان 🌙\n\n⏳ المتبقي: ${days} يوم، ${hours} ساعة، ${minutes} دقيقة و${seconds} ثانية\n\n😹 استعد للتمر، الفوانيس، والضحك مع سيرا تشان!`;

    return api.sendMessage(message, event.threadID, event.messageID);
};
