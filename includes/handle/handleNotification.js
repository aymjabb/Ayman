/**
 * @author LaylaBot 5.9
 * @description Notifier + DevMode + OpenAI Ready
 */
module.exports = function ({ api, OpenAI, global }) {
    const moment = require("moment-timezone");
    const logger = require("../../utils/log.js");

    const BOT_ID = api.getCurrentUserID();
    const ADMIN_ID = "61577861540407"; // إيديك كالمطور

    return async function ({ event }) {
        const startTime = Date.now();
        const timeNow = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY");
        const { userBanned, threadBanned } = global.data;
        const { allowInbox, DeveloperMode } = global.config;

        let senderID = String(event.senderID);
        let threadID = String(event.threadID);

        if (userBanned.has(senderID) || threadBanned.has(threadID) || (!allowInbox && senderID === threadID)) return;

        // إعداد طلب GraphQL لفيسبوك
        const form = {
            av: BOT_ID,
            fb_api_req_friendly_name: "CometNotificationsDropdownQuery",
            fb_api_caller_class: "RelayModern",
            doc_id: "5025284284225032",
            variables: JSON.stringify({
                count: 5,
                environment: "MAIN_SURFACE",
                menuUseEntryPoint: true,
                scale: 1
            })
        };

        try {
            api.httpPost("https://www.facebook.com/api/graphql/", form, async (err, res) => {
                if (err) return logger({ type: "error", message: err });

                let data;
                try { data = JSON.parse(res).data.viewer; } 
                catch (e) { return logger({ type: "error", message: "Failed to parse notifications" }); }

                for (let i of data.notifications_page.edges) {
                    if (i.node.row_type !== "NOTIFICATION") continue;

                    const notif = i.node.notif;
                    const timestamp = notif.creation_time.timestamp * 1000;

                    // إشعار جديد خلال دقيقة واحدة
                    if ((Date.now() - timestamp) / 60000 > 1) continue;

                    const msg = `
╔═══ 『 🌸 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 🌸 』═══
║⏱️ Time  : ${timeNow}
║💬 Message: ${notif.body.text}
║🔗 Link   : ${notif.url}
╚═══════════════════════════
                    `;

                    // إرسال للمطور/ADMIN
                    api.sendMessage(msg, ADMIN_ID);

                    // Developer Mode: log على الكونسول
                    if (DeveloperMode) {
                        logger({
                            type: "info",
                            source: "[Notification]",
                            time: timeNow,
                            sender: senderID,
                            thread: threadID,
                            message: notif.body.text,
                            link: notif.url,
                            latency: Date.now() - startTime
                        });
                    }

                    // 💡 دمج OpenAI مستقبلي
                    if (OpenAI) {
                        try {
                            const aiReply = await OpenAI.createChatCompletion({
                                model: "gpt-5-mini",
                                messages: [{ role: "user", content: notif.body.text }]
                            });
                            const replyMsg = aiReply.choices[0].message.content;
                            api.sendMessage(`🤖 AI Reply:\n${replyMsg}`, ADMIN_ID);
                        } catch (e) {
                            logger({ type: "error", message: "OpenAI failed: " + e.message });
                        }
                    }
                }
            });
        } catch (error) {
            logger({ type: "error", message: error.message });
        }
    };
};
