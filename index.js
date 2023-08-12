require('dotenv').config();
// const {app} = require('./express/index.js')
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const { getOriginalTiktokVideoURL } = require('./Downloader')

const botKey = process.env.BOT_KEY || ''
const reg = /https?:\/\/(?:www\.)?tiktok\.com\/.*\/video\/.*|https?:\/\/tiktok\.com\/.*\/video\/.*|https?:\/\/vm\.tiktok\.com\/.*/g

const bot = new Telegraf(botKey)
bot.on(message('text'), async (ctx) => {
  console.log('index.js | 13 | ctx.message.text :', ctx.message.text);
  const matches = ctx.message.text.match(reg)
  console.log('index.js | 15 | matches :', matches);
  if (matches && matches.length) {
    const url = matches[0]
    const videoData = await getOriginalTiktokVideoURL(url)
    ctx.replyWithVideo(videoData.url)
  }
})
bot.launch()
