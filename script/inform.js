module.exports.config = {
    name: "inform",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "GeoDevz69",
    description: "Sends a message to all groups and can only be done by the admin.",
    usePrefix: true,
    commandCategory: "noti",
    usages: "[Text]",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const threadList = await api.getThreadList(25, null, ['INBOX']);
    let sentCount = 0;
    const custom = args.join(' ');

    async function sendMessage(thread) {
        try {
            await api.sendMessage(`•| 𝐍𝐎𝐓𝐈𝐂𝐄 𝐅𝐑𝐎𝐌 𝐀𝐃𝐌𝐈𝐍 |•\n\n『 𝗠𝗲𝘀𝘀𝗮𝗴𝗲 』\n"${custom}"\n\n•| 𝙰𝙳𝙼𝙸𝙽 : 𝙷𝙾𝙼𝙴𝚁 𝚁𝙴𝙱𝙰𝚃𝙸𝚂 |•`, thread.threadID);
            sentCount++;
        } catch (error) {
            console.error("Error sending a message:", error);
        }
    }

    for (const thread of threadList) {
        if (sentCount >= 20) {
            break;
        }
        if (thread.isGroup && thread.name != thread.threadID && thread.threadID != event.threadID) {
            await sendMessage(thread);
        }
    }

    if (sentCount > 0) {
        api.sendMessage(`› Admin notification send to all groups successfully.`, event.threadID);
    } else {
        api.sendMessage("› No eligible group threads found to send the message to.", event.threadID);
    }
};
