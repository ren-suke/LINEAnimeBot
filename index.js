const express = require('express');
const line = require('@line/bot-sdk')

const LINE_CONFIG = {
  channelId: process.env.LINE_CHANNEL_ID,
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

express.listen(process.env.PORT || 8000);
express.post('/v1/webhook', line.middleware(LINE_CONFIG), (request, response, next) => {
  response.sendStatus(200);
  console.log(req.body);
});
