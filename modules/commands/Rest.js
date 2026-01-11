module.exports = {
    config: { name: "رست" },
    run: async function({ api, event }) {
        const { threadID, messageID } = event;
        api.sendMessage("🔄 جاري إعادة تشغيل ليلى...", threadID, messageID, () => process.exit(0));
    }
};
