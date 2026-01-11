module.exports = {
    config: { name: "سبام" },
    run: async function({ api, event, args, globalData }) {
        const { threadID, messageID } = event;
        const action = args[0];
        if(action === "اون") {
            globalData.spamFilter = true;
            api.sendMessage("✅ تم تفعيل فلتر السبام!", threadID, messageID);
        } else if(action === "اوف") {
            globalData.spamFilter = false;
            api.sendMessage("❌ تم إيقاف فلتر السبام.", threadID, messageID);
        }
    }
};
