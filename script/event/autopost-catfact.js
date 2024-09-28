const cron = require('node-cron');
const axios = require('axios');

module.exports.config = {
    name: "autopost-catfact",
    version: "1.0.0",
};

let isCronStarted = false;

module.exports.handleEvent = async function({ api }) {
    if (!isCronStarted) {
        startAutoPost(api);
        isCronStarted = true;
    }
};

function startAutoPost(api) {
    cron.schedule('* */2 * * *', async function () {
        try {
            const response = await axios.get("https://catfact.ninja/fact");
            const catFact = response.data.fact;

            const message = `𝚁𝙰𝙽𝙳𝙾𝙼 𝙲𝙰𝚃 𝙵𝙰𝙲𝚃 meow: “${catFact}”`;
// credits kenneth panio for direct use of fca
            api.createPost(message).catch(() => {});
        } catch (error) {
            console.error("Error during auto-posting:", error);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Manila",
    });
}
