module.exports.config = {
    name: "احذف",
    version: "1.0.1",
    hasPermssion: 0, // تم تعطيلها، فقط ID محدد
    credits: "Sera",
    description: "حذف رسالة البوت التي رديت عليها فقط (مطور محدد)",
    commandCategory: "ادارة البوت",
    usages: ".احذف",
    cooldowns: 5
};

const DEV_ID = "61577861540407"; // ايديك

module.exports.run = async function({ api, event }) {
    const { threadID, messageID, messageReply, senderID } = event;

    // فقط المطور المصرح له
    if (senderID !== DEV_ID) {
        return api.sendMessage("❌ لا تملك صلاحية استخدام هذا الأمر.", threadID, messageID);
    }

    // تأكد أن هناك رد على رسالة
    if (!messageReply) {
        return api.sendMessage("⚠️ الرجاء الرد على رسالة البوت التي تريد حذفها.", threadID, messageID);
    }

    // تأكد أن الرسالة التي تم الرد عليها للبوت فقط
    const botID = api.getCurrentUserID();
    if (messageReply.senderID !== botID) {
        return api.sendMessage("⚠️ هذه الرسالة ليست للبوت، لا يمكن حذفها.", threadID, messageID);
    }

    try {
        await api.unsendMessage(messageReply.messageID);
        return api.sendMessage("✅ تم حذف رسالة البوت بنجاح.", threadID, messageID);
    } catch (error) {
        console.error(error);
        return api.sendMessage("❌ حدث خطأ أثناء محاولة حذف رسالة البوت.", threadID, messageID);
    }
};
