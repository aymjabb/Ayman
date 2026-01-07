const DEV = ["61577861540407"]; // ايدي المطور

module.exports.config = {
  name: "كنيةسيرا",
  version: "1.0.0",
  hasPermssion: 1, // 1 = الأدمن، 2 = المطور
  credits: "Sera Chan",
  description: "يثبت كنية سيرا تشان بالإنكليزي ويمنع تعديلها من أي شخص",
  commandCategory: "حماية",
  usages: ".كنيةسيرا",
  cooldowns: 0
};

// تابع الحدث
module.exports.handleEvent = async function({ api, event }) {
  const { logMessageType, logMessageData, threadID, senderID } = event;

  if (logMessageType !== "log:thread-nickname") return; // فقط تغييرات الكنية
  if (DEV.includes(senderID)) return; // المطور مسموح له

  const desiredNickname = "𝙎𝙀𝙍𝘼 𝘾𝙃𝘼𝙉"; // الكنية الثابتة

  // إعادة الكنية تلقائيًا
  try {
    await api.changeNickname(desiredNickname, threadID, api.getCurrentUserID());
    api.sendMessage(`⚡ لا يمكنك تغيير كنية سيرا تشان! تم استرجاع الكنية إلى "${desiredNickname}" 😼`, threadID);
  } catch (err) {
    console.log("❌ خطأ في إعادة الكنية:", err.message);
  }
};
