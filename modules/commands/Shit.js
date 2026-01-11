module.exports = {
    config: { name: "سب" },
    run: async function({ api, event, args, globalData }) {
        const { threadID, messageID } = event;
        const action = args[0];
        if(action === "اون") {
            globalData.sexFilter = true;
            api.sendMessage("✅ تم تفعيل فلتر الكلمات الجنسية!", threadID, messageID);
        } else if(action === "اوف") {
            globalData.sexFilter = false;
            api.sendMessage("❌ تم إيقاف فلتر الكلمات الجنسية.", threadID, messageID);
        }
    }
};
