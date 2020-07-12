import express from 'express';
import line from '@line/bot-sdk';
const server = express();

const LINE_CONFIG = {
  channelId: process.env.LINE_CHANNEL_ID,
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

server.listen(process.env.PORT || 8000);
server.post('/v1/webhook', line.middleware(LINE_CONFIG), (request, response, next) => {
  response.sendStatus(200);
  console.log(req.body);
});
