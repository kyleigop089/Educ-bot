const axios = require("axios");

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    role: 0,
    credits: "kylepogi",
    description: "Fetch a response from GPT-4",
    hasPrefix: false,
    aliases: ["gpt", "gpt4response","gpt4"],
    usage: "[educ <prompt>]",
    cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        // Check if a prompt is provided
        if (args.length === 0) {
            api.sendMessage("ℹ️ Please provide a prompt:\n\n❗𝗲𝘅𝗮𝗺𝗽𝗹𝗲: ai Kyle is handsome?", event.threadID);
            return;
        }

        const prompt = args.join(" ");

        // Inform the user that the fetching process has started
        const initialMessage = await api.sendMessage("🔍 𝚜𝚎𝚊𝚛𝚌𝚑𝚒𝚗𝚐......", event.threadID);

        // Fetch the response from the GPT-4 API
        const response = await axios.get(`https://joshweb.click/gpt4?prompt=${encodeURIComponent(prompt)}&uid=100`);
        const gpt4Response = response.data.gpt4;

        // Check if the response contains valid data
        if (!gpt4Response) {
            api.sendMessage("No response found from GPT-4.", event.threadID);
            return;
        }

        // Format the response message
        const message = `👨🏻‍🏫 𝗘𝗗𝗨𝗖𝗔𝗧𝗜𝗢𝗡𝗔𝗟 𝗔.𝗜|𝙶𝙿𝚃𝟺\n━━━━━━━━━━━━━━━━━━\n${gpt4Response}\n━━━━━━━━━━━━━━━━━━\n𝘰𝘸𝘯𝘦𝘳|𝘦𝘥𝘶𝘤-𝘥𝘦𝘷𝘦𝘭𝘰𝘱𝘦𝘳: 𝗞𝘆𝗹𝗲 𝗟. 𝗕𝗮𝗶𝘁-𝗶𝘁\n𝘓𝘪𝘯𝘬: https://www.facebook.com/profile.php?id=61566232924755`;

        // Edit the initial message to show the final response
        await api.editMessage(message, initialMessage.messageID);

    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};
