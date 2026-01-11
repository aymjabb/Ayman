module.exports = {
    config: { name: "سكوت" },
    run: async function({ api, event, args, globalData }) {
        const { threadID, messageID } = event;
        const action = args[0];
        if(action === "اون") {
            globalData.silence[threadID] = true;
            api.sendMessage(`
╔═════════════════════
║ 🤫 تم تفعيل سكوت!
╠═════════════════════
║ أي شخص يتحدث بعد تفعيل هذا الوضع سيتم تحذيره مرتين ثم طرده.
╚═════════════════════
            `, threadID, messageID);
        } else if(action === "اوف") {
            globalData.silence[threadID] = false;
            api.sendMessage("❌ تم إيقاف سكوت.", threadID, messageID);
        }
    }
};
