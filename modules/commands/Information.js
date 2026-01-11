module.exports = {
    config: { name: "حالة" },
    run: async function({ api, Threads, Users, event }) {
        const { threadID, messageID } = event;
        const totalThreads = Threads.allThreadID.length;
        const totalUsers = Users.allUserID.length;
        const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const uptime = (process.uptime() / 60).toFixed(2);

        const statusMsg = `
╔═════════════════════
║ 🌸 حالة البوت ليلى 🌸
╠═════════════════════
║ مجموع الكروبات: ${totalThreads}
║ مجموع الأعضاء: ${totalUsers}
║ الذاكرة المستخدمة: ${memoryUsage} MB
║ مدة التشغيل: ${uptime} دقيقة
╚═════════════════════
        `;
        api.sendMessage(statusMsg, threadID, messageID);
    }
};
