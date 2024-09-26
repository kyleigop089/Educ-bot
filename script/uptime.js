const chilli = require('os');
const bingchilling = require('pidusage');
const chungkilss = require('axios');
const pogi = require('fs');
const churchillitos = require('path');

module.exports.config = {
    name: "uptime",
    version: "1.0.2",
    role: 0,
    credits: "GeoDevz69",
    description: "uptime",
    hasPrefix: false,
    cooldowns: 5,
    aliases: ["up"]
};

function byte2mb(bytes) {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(bytes, 10) || 0;
    while (n >= 1024 && ++l) n = n / 1024;
    return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
}

function getUptime(uptime) {
    const days = Math.floor(uptime / (3600 * 24));
    const hours = Math.floor((uptime % (3600 * 24)) / 3600);
    const mins = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    return { days, hours, mins, seconds };
}

module.exports.run = async ({ api, event }) => {
    const time = process.uptime();
    const { days, hours, mins, seconds } = getUptime(time);

    const usage = await bingchilling(process.pid);

    const osInfo = {
        platform: chilli.platform(),
        architecture: chilli.arch()
    };

    const botName = "█▓▒▒░░░BOGART AI BOT░░░▒▒▓█";
    const instag = "bogartpogi321";
    const ghub = "Puyit321";
    const fb = "@Bogart magalpok";

    const avatarId = Math.floor(Math.random() * 800) + 1;

    const apiUrl = `https://deku-rest-api.gleeze.com/canvas/uptime?id=${avatarId}&instag=${instag}&ghub=${ghub}&fb=${fb}&hours=${hours}&minutes=${mins}&seconds=${seconds}&botname=${botName}`;

    try {
        const response = await chungkilss.get(apiUrl, { responseType: 'arraybuffer' });
        const imagePath = churchillitos.join(__dirname, "uptime.jpg");

        pogi.writeFileSync(imagePath, response.data);

        const timeStart = Date.now();
        const returnResult = `█▓▒▒░░░BOGART AI BOT░░░▒▒▓█\n━━━━━━━━━━━━━━━━━━\nBOT has been working for ${hours} hour(s) ${mins} minute(s) ${seconds} second(s).\n\n❖ Cpu usage: ${usage.cpu.toFixed(1)}%\n❖ RAM usage: ${byte2mb(usage.memory)}\n❖ Cores: ${chilli.cpus().length}\n❖ Ping: ${Date.now() - timeStart}ms\n❖ Operating System Platform: ${osInfo.platform}\n❖ System CPU Architecture: ${osInfo.architecture}\n━━━━━━━━━━━━━━━━━━\n💕 ғʀᴏᴍ: ᴀᴅᴍɪɴ ɢᴇᴏʀᴀʏ 💕`;

        api.sendMessage({
            body: returnResult,
            attachment: pogi.createReadStream(imagePath)
        }, event.threadID, () => {
            pogi.unlinkSync(imagePath);
        });
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};
