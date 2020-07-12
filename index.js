const express = require('express')();
const line = require('@line/bot-sdk')

const LINE_CONFIG = {
  channelId: process.env.LINE_CHANNEL_ID,
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};
const ANIME_API_BASEURL = "http://api.moemoe.tokyo/anime/v1/master/"
const lineClient = new line.Client(LINE_CONFIG);

express.listen(process.env.PORT || 8000);
express.post('/v1/webhook', line.middleware(LINE_CONFIG), async (request, response, next) => {
  response.sendStatus(200);
  const promises = [];
  await request.body.events.forEach(async (event) => {
    if(event.type === "message" && event.message.type === "text") {
      const messageText = event.message.text;
      const yearAndCourPattern = /^\d{4}\s[1-4]{1}$/g;
      if (yearAndCourPattern.test(messageText)) {
        console.log(ANIME_API_BASEURL + messageText.replace(' ', '/'));
        const fetchResult = await fetch(ANIME_API_BASEURL + messageText.replace(' ', '/'), {method: 'GET'});
        if (!fetchResult.ok) {
          promises.push(lineClient.replyMessage(event.replyToken, {
            type: "text",
            text: "正しい形式で入力してください！！ (例：2019 1)"
          }));
          return;
        };
        const resultJson = await fetchResult.json();
        let replyText = '';
        resultJson.forEach((anime) => {
          replyText += anime.title;
          replyText += '\n';
          replyText += anime.public_url;
          replyText += '\v';
        })
        promises.push(lineClient.replyMessage(event.replyToken, {
          type: "text",
          text: replyText,
        }));
      } else {
        promises.push(lineClient.replyMessage(event.replyToken, {
          type: "text",
          text: "正しい形式で入力してください！！ (例：2019 1)"
        }));
      };
    };
  });
  Promise.all(promises)
      .then((response) => {
        console.log(response, ' - proceed');
      }).catch((error) => {
        console.log(error);
      })
});
