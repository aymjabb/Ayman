module.exports = {
    config: { name: "حماية" },
    run: async function({ api, event, args, globalData }) {
        const { threadID, messageID } = event;
        const action = args[0];
        if(action === "اون") {
            globalData.adminLock[threadID] = true;
            api.sendMessage(`
╔═════════════════════
║ 🛡️ حماية الادمنيات مفعلة
╠═════════════════════
║ أي محاولة لترقية أي شخص سيتم إلغاؤها فوراً!
╚═════════════════════
            `, threadID, messageID);
        } else if(action === "اوف") {
            globalData.adminLock[threadID] = false;
            api.sendMessage("❌ تم إيقاف حماية الادمنيات.", threadID, messageID);
        }
    }
};
