/* 텔레그램봇 호출. */
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.botid;
const bot = new TelegramBot(token, { polling: true });

/* openai 호출. */
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const str_arr = [];
bot.on("message", (msg) => {
  //   const str_arr = [];
  const chatId = msg.chat.id;
  const text = msg.text;
  //   const text = "Human: " + msg.text;
  for (let i = 0; i < text.length; i++) {
    str_arr.push(text[i]);
  }
  str_arr.push("\n");
  if (str_arr.length > 40) {
    while (str_arr.length > 40) {
      str_arr.shift();
    }
  }
  //   console.log(str_arr);
  (async function () {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt:
        // "Marv is a chatbot that reluctantly answers questions with sarcastic responses:\n\n" +
        str_arr.join(""),
      max_tokens: 4000,
      temperature: 0.5,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      n: 1,
    });
    const result = await response.data.choices[0].text;
    // console.log(result);
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
    // console.log(str_arr.join(""));
    // console.log(str_arr);
  })();
});
console.log("봇 연결.");
