module.exports.config = {
  name: "ضبط",
  version: "1.0.1",
  hasPermssion: 1, // للأدمن والمطور
  credits: "Sera Chan",
  description: "تغيير إعدادات الكروب بسرعة (الاسم أو الكنية)",
  commandCategory: "إدارة",
  usages: "ضبط اسم [الاسم الجديد] / ضبط كنية [الكنية]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, mentions, type, messageReply } = event;
  const action = args[0];
  const content = args.slice(1).join(" ");

  try {
    // تغيير اسم المجموعة
    if (action === "اسم") {
      if (!content) return api.sendMessage("❌ يرجى كتابة الاسم الجديد.", threadID, messageID);
      await api.setTitle(content, threadID);
      return api.sendMessage(`✅ تم تغيير اسم المجموعة إلى: ${content}\n🐾 بواسطة سيرا تشان`, threadID);
    }

    // تغيير كنية عضو
    if (action === "كنية") {
      let targetID = type === "message_reply" ? messageReply.senderID : Object.keys(mentions)[0];
      if (!targetID) return api.sendMessage("❌ منشن العضو أو رد على رسالته لتغيير كنيته.", threadID, messageID);

      const name = args.slice(2).join(" "); // تجاهل "كنية" واسم المستخدم
      if (!name) return api.sendMessage("❌ اكتب الكنية الجديدة.", threadID, messageID);

      await api.setUserNickname(name, threadID, targetID);
      return api.sendMessage(`✅ تم تغيير كنية العضو إلى: ${name}\n🐾 بواسطة سيرا تشان`, threadID);
    }

    // إذا لم يتم اختيار خيار صحيح
    return api.sendMessage("⚙️ خيارات الضبط المتاحة: اسم / كنية", threadID, messageID);

  } catch (error) {
    console.error("خطأ في أمر الضبط:", error);
    return api.sendMessage("❌ حدث خطأ أثناء محاولة الضبط. حاول مرة أخرى.", threadID, messageID);
  }
};
