const axios = require('axios');

module.exports.config = {
    name: "ai2",
    hasPermssion: 0,
    version: "1.0.0",
    credits: "GeoDevz69",
    description: "EDUCATIONAL",
    usePrefix: false,
    commandCategory: "AI",
    usages: "[question]",
    cooldowns: 2,
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
    const { messageID, threadID } = event;
    const id = event.senderID;

    const apiUrl = `https://jonellccprojectapis10.adaptable.app/api/gptconvo?ask=${encodeURIComponent(event.body)}&id=${id}`;

    try {
        const lad = await api.sendMessage("🔎 Searching for an answer. Please wait...", threadID, messageID);
        const response = await axios.get(apiUrl);
        const { response: result } = response.data;

        const responseMessage = `${result}`;
        api.editMessage(responseMessage, lad.messageID, threadID, messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", threadID, messageID);
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { messageID, threadID } = event;
    const id = event.senderID;

    if (!args[0]) return api.sendMessage("Please provide your question.\n\nExample: ai what is the solar system?", threadID, messageID);

    const apiUrl = `https://jonellccprojectapis10.adaptable.app/api/gptconvo?ask=${encodeURIComponent(args.join(" "))}&id=${id}`;

    const lad = await api.sendMessage("💬 Responding...", threadID, messageID);

    try {
        if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments[0]) {
            const attachment = event.messageReply.attachments[0];

            if (attachment.type === "photo") {
                const imageURL = attachment.url;

                const geminiUrl = `https://joncll.serv00.net/chat.php?ask=${encodeURIComponent(args.join(" "))}&imgurl=${encodeURIComponent(imageURL)}`;
                const response = await axios.get(geminiUrl);
                const { vision } = response.data;

                if (vision) {
                    return api.editMessage(`${vision}`, lad.messageID, event.threadID, event.messageID);
                } else {
                    return api.sendMessage("🤖 Failed to recognize the image.", threadID, messageID);
                }
            }
        }

        const response = await axios.get(apiUrl);
        const { response: result } = response.data;

        const responseMessage = `${result}`;
        api.editMessage(responseMessage, lad.messageID, event.threadID, event.messageID);
        global.client.handleReply.push({
            name: this.config.name,
            messageID: lad.messageID,
            author: event.senderID
        });
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", threadID, messageID);
    }
};