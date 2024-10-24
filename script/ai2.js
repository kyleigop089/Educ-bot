const axios = require('axios');

module.exports.config = {
    name: "ai2",
    version: "1.0.0",
    hasPermission: 0,
    credits: "kylepogi",//api by jerome
    description: "Gpt architecture",
    hasPrefix: false,
    commandCategory: "GPT4",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { messageID, messageReply } = event;
        let prompt = args.join(' ');

        if (messageReply) {
            const repliedMessage = messageReply.body;
            prompt = `${repliedMessage} ${prompt}`;
        }

        if (!prompt) {
            return api.sendMessage('ℹ Please type a question.', event.threadID, messageID);
        }
        api.sendMessage('🔍 Searching your question please wait...', event.threadID);

        // Delay
        await new Promise(resolve => setTimeout(resolve, 2000)); // Adjust the delay time as needed

        const gpt4_api = `https://gpt4withcustommodel.onrender.com/gpt?query=${encodeURIComponent(prompt)}&model=gpt-4-32k-0314`;

        const response = await axios.get(gpt4_api);

        if (response.data && response.data.response) {
            const generatedText = response.data.response;

            // Ai Answer Here
            api.sendMessage(`🤖 𝗘𝗱𝘂𝗰𝗮𝘁𝗶𝗼𝗻𝗮𝗹 (𝗔.𝗜)\n💡𝗮𝗻𝘀𝘄𝗲𝗿: ${generatedText}\n\n𝑐𝑟𝑒𝑎𝑡𝑒 𝑦𝑜𝑢'𝑟𝑒 𝑜𝑤𝑛 𝐴𝑖 ℎ𝑒𝑟𝑒:\n𝑜𝑤𝑛𝑒𝑟: 𝙆𝙮𝙡𝙚 𝙇. 𝘽𝙖𝙞𝙩-𝙞𝙩`, event.threadID, messageID);
        } else {
            console.error('API response did not contain expected data:', response.data);
            api.sendMessage(`❌ 𝙰𝙽 𝙴𝚁𝚁𝙾𝚁 𝙾𝙲𝙲𝚄𝚁𝚁𝙴𝙳 𝚆𝙷𝙸𝙻𝙴 𝙶𝙴𝙽𝙴𝚁𝙰𝚃𝙸𝙽𝙶 𝚃𝙷𝙴 𝚃𝙴𝚇𝚃 𝚁𝙴𝚂𝙿𝙾𝙽𝚂𝙴. 𝙿𝙻𝙴𝙰𝚂𝙴 𝚃𝚁𝚈 𝙰𝙶𝙰𝙸𝙽 𝙻𝙰𝚃𝙴𝚁. 𝚁𝙴𝚂𝙿𝙾𝙽𝚂𝙴 𝙳𝙰𝚃𝙰: ${JSON.stringify(response.data)}`, event.threadID, messageID);
        }
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage(`❌  error occurred while generating the text response. Please try again later. Error details: ${error.message}`, event.threadID, event.messageID);
    }
};
