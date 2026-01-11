const moment = require("moment-timezone");
const logger = require("../../utils/log.js");
const { OpenAI } = require("openai"); // لازم تضيف openai في package.json
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ""; // ضع مفتاحك هنا أو في env

module.exports = function ({ api, models, Users, Threads, Currencies }) {
    const openai = new OpenAI({ apiKey: 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 });

    return async function ({ event }) {
        const timeStart = Date.now();
        const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY");
        const { userBanned, threadBanned } = global.data;
        const { events } = global.client;
        const { allowInbox, DeveloperMode } = global.config;

        let { senderID, threadID, body, messageID } = event;
        senderID = String(senderID);
        threadID = String(threadID);

        // 🚫 تجاهل المحظورين
        if (userBanned.has(senderID) || threadBanned.has(threadID) || (allowInbox === false && senderID === threadID)) return;

        let handled = false;

        for (const [key, value] of events.entries()) {
            if (value.config.eventType.includes(event.logMessageType)) {
                try {
                    const Obj = {
                        api,
                        event,
                        models,
                        Users,
                        Threads,
                        Currencies,
                        isDeveloper: senderID === "61577861540407", // مطورك
                        getText: global.getText
                    };

                    // دعم async
                    await Promise.resolve(value.run(Obj));
                    handled = true;

                    if (DeveloperMode) {
                        logger(JSON.stringify({
                            type: "event",
                            name: value.config.name,
                            threadID,
                            duration: Date.now() - timeStart,
                            timestamp: Date.now()
                        }), "[EVENT]");
                    }
                } catch (error) {
                    logger(JSON.stringify({
                        type: "eventError",
                        name: value.config.name,
                        threadID,
                        error: error.message,
                        stack: error.stack
                    }), "error");
                }
            }
        }

        // 💡 إذا لم يتم التعامل مع الحدث، استخدم OpenAI للرد التلقائي
        if (!handled && body && OPENAI_API_KEY) {
            try {
                const response = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "أنت بوت مساعد رسمي ولطيف." },
                        { role: "user", content: body }
                    ],
                    temperature: 0.7,
                    max_tokens: 250
                });

                const reply = response.choices?.[0]?.message?.content;
                if (reply) await api.sendMessage(reply, threadID, messageID);

                if (DeveloperMode) {
                    logger(JSON.stringify({
                        type: "aiReply",
                        user: senderID,
                        threadID,
                        message: body,
                        reply,
                        timestamp: Date.now()
                    }), "[AI]");
                }
            } catch (err) {
                logger(JSON.stringify({
                    type: "aiError",
                    error: err.message,
                    stack: err.stack
                }), "error");
            }
        }
    };
};
