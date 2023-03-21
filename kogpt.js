require("dotenv").config();
const request = require("request");
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.botid;
const bot = new TelegramBot(token, { polling: true });

const REST_API_KEY = process.env.kogpt;
function kogptApi(prompt, max_tokens = 32, temperature, topP, n) {
    const url = "https://api.kakaobrain.com/v1/inference/kogpt/generation";
    const headers = {
        "Content-Type": "application/json",
        Authorization: `KakaoAK ${REST_API_KEY}`,
    };
    const options = {
        url,
        method: "POST",
        body: {
            prompt,
            max_tokens,
            temperature,
            top_p: topP,
            n,
        },
        headers,
        json: true,
    };

    request.post(options, (e, res, body) => {
        return body;
    });
}

const str_arr = [];
bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    for (let i = 0; i < text.length; i++) {
        str_arr.push(text[i]);
    }
    str_arr.push("\n");
    if (str_arr.length > 40) {
        while (str_arr.length > 40) {
            str_arr.shift();
        }
    }
    (async function () {
        const result = await kogptApi(str_arr.join(""), 32, 0.5, 0.7, 1);
        bot.sendMessage(chatId, result);
        for (let i = 0; i < result.length; i++) {
            str_arr.push(result[i]);
        }
        str_arr.push("\n");
        if (str_arr.length > 40) {
            while (str_arr.length > 40) {
                str_arr.shift();
            }
        }
    })();
})