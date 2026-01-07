module.exports = function({ api, event }) {
    const commandsList = ["اوامر", "نشاطي", "حضن", "تثبيت النص", "حماية"]; // ضع جميع أوامر البوت هنا
    const { body, threadID } = event;

    // إذا الأمر لا يبدأ بالـ prefix، تجاهله
    if (!body || !body.startsWith(".")) return;

    const command = body.slice(1).split(" ")[0]; // حذف النقطة وأخذ اسم الأمر

    if (!commandsList.includes(command)) {
        // اقتراح أقرب أمر (هنا ببساطة أول أمر يبدأ بنفس الحرف)
        let suggestion = commandsList.find(c => c.startsWith(command[0])) || "لا يوجد اقتراح";

        const msg = `
╭★━━━━━━━━★╮
   ⚠️ الأمر غير موجود ⚠️
   ✧ ${command} ✧
╰★━━━━━━━━★╯
💡 ربما تقصد: ${suggestion}
`;

        api.sendMessage(msg, threadID);
    }
};
