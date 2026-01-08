module.exports = {
  name: "تحذير",
  version: "1.0.0",
  hasPermission: 2,
  description: "تحذير مرعب (مطور فقط)",
  usePrefix: true,
  commandCategory: "developer",
  cooldowns: 5,

  run: async function ({ api, event }) {
    if (event.senderID !== "61577861540407") return;

    api.sendMessage(
      "⚠️ تنبيه من النظام\n\n" +
      "تم رصد مخالفات سلوكية داخل هذه المجموعة.\n" +
      "في حال استمرار النشاط، سيتم اتخاذ إجراء تلقائي.\n\n" +
      "😾 النظام يراقب…",
      event.threadID
    );
  }
};
