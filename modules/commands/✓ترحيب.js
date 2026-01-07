const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "ترحيب",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Sera Chan",
  description: "ترحيب سيرا تشان عند دخول الكروب وأي عضو جديد",
  commandCategory: "الادارة",
  usages: ".ترحيب تشغيل/ايقاف",
  cooldowns: 5
};

// الصورة لأمر المكور
const mcImageURL = "https://i.ibb.co/6RF2LXMW/temp-1767738583265.jpg";

// حفظ حالة التفعيل لكل مجموعة
let enabledGroups = {}; // { threadID: true/false }
// حفظ الأعضاء المعادين بواسطة .ارجاع
let returnedUsers = {}; // { threadID: [userID, ...] }

module.exports.run = async function({ api, event, args }) {
  const { threadID } = event;
  if (!args[0]) return api.sendMessage("❌ استخدم: .ترحيب تشغيل/ايقاف", threadID);

  if (args[0].toLowerCase() === "تشغيل") {
    enabledGroups[threadID] = true;
    return api.sendMessage("✅ تم تفعيل نظام الترحيب في هذه المجموعة", threadID);
  }

  if (args[0].toLowerCase() === "ايقاف") {
    enabledGroups[threadID] = false;
    return api.sendMessage("⚠️ تم تعطيل نظام الترحيب في هذه المجموعة", threadID);
  }

  return api.sendMessage("❌ الخيار غير معروف، استخدم تشغيل أو ايقاف", threadID);
};

module.exports.handleEvent = async function({ api, event, Users }) {
  const { threadID, logMessageType, logMessageData, senderID } = event;

  if (!enabledGroups[threadID]) return; // النظام غير مفعل
  if (!returnedUsers[threadID]) returnedUsers[threadID] = [];

  // ترحيب سيرا عند دخولها الكروب
  const botID = api.getCurrentUserID();
  if (logMessageType === "log:subscribe" && logMessageData.addedParticipants.includes(botID)) {
    api.sendMessage(
      `👋 مرحبًا! أنا سيرا تشان 😼\n🎉 سأهتم بحماية الكروب وإضافة المرح لكل الأعضاء.\n⚡ بعد قليل سأرسل لكم أمر المكور مع صورة.`,
      threadID
    );

    const imgPath = path.join(__dirname, "cache", "mc.jpg");
    const res = await axios.get(mcImageURL, { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, Buffer.from(res.data));

    api.sendMessage({
      body: `💠 أمر المكور مفعل الآن!`,
      attachment: fs.createReadStream(imgPath)
    }, threadID, () => fs.unlinkSync(imgPath));
  }

  // ترحيب أي عضو جديد
  if (logMessageType === "log:subscribe") {
    const addedIDs = logMessageData.addedParticipants || [];
    for (let id of addedIDs) {
      if (id === botID) continue; // استثناء البوت نفسه
      if (returnedUsers[threadID].includes(id)) continue; // استثناء الأعضاء المعادين
      try {
        const name = await Users.getNameUser(id);
        api.sendMessage(
          `🥳 أهلاً ${name}! مرحبًا بك في الكروب 😸\nسيرا تشان تقول: "تعال نلعب ونمرح مع باقي الأعضاء!"`,
          threadID
        );
      } catch (e) {
        console.log("❌ خطأ في الترحيب:", e.message);
      }
    }
  }
};

// لتسجيل الأعضاء الذين أعيدوا بواسطة أمر .ارجاع
module.exports.markReturnedUser = function(threadID, userID) {
  if (!returnedUsers[threadID]) returnedUsers[threadID] = [];
  if (!returnedUsers[threadID].includes(userID)) returnedUsers[threadID].push(userID);
};
