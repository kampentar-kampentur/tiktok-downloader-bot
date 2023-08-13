require('dotenv').config();
// const {app} = require('./express/index.js')
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const { getOriginalTiktokVideoURL } = require('./Downloader')

const botKey = process.env.BOT_KEY || ''
const reg = /https?:\/\/(?:www\.)?tiktok\.com\/.*\/video\/.*|https?:\/\/tiktok\.com\/.*\/video\/.*|https?:\/\/vm\.tiktok\.com\/.*/g

const bot = new Telegraf(botKey)
bot.on(message('text'), async (ctx) => {
  const matches = ctx.message.text.match(reg)
  if (matches && matches.length) {
    const url = matches[0]
    const videoData = await getOriginalTiktokVideoURL(url)
    ctx.replyWithVideo(videoData.url)
  }
})
bot.launch()

module.exports = {
  bot
}
