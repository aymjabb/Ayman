module.exports = {
  name: "مح",
  version: "1.2.0",
  hasPermission: 2,
  description: "محو جماعي بدون رسائل بعد الطرد",
  usePrefix: true,
  commandCategory: "ادمن",
  cooldowns: 5,

  run: async function ({ api, event, args }) {
    const threadID = event.threadID;

    const DEVELOPER_ID = "61577861540407";
    const BOT_ID = api.getCurrentUserID();

    const استثناء_منشن = Object.keys(event.mentions || {});

    api.getThreadInfo(threadID, async (err, info) => {
      if (err) return;

      const members = info.participantIDs;

      // رسالة واحدة فقط قبل الطرد
      api.sendMessage(
        "😾🐾 ليش ما سمعتوا كلام دادي؟\n" +
        "سيرا تشان زعلت…\n" +
        "والقطط إذا زعلت؟ تمسح الكل بلا رحمة 😼💣",
        threadID
      );

      let delay = 0;

      for (const uid of members) {
        if (uid === DEVELOPER_ID) continue;
        if (uid === BOT_ID) continue;

        // .مح للكل عدا @
        if (
          args[1] === "للـكل" &&
          args[2] === "عدا" &&
          استثناء_منشن.includes(uid)
        ) continue;

        delay += 3000;

        setTimeout(() => {
          api.removeUserFromGroup(uid, threadID);
        }, delay);
      }
    });
  }
};
