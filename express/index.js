const express = require('express')
const path = require("path");
const {downloadTiktokVideo} = require('../Downloader/index.js')

const app = express()
const port = 3000
const URL = 'https://www.tiktok.com/@florin/video/7237471629893176603'

app.get('/', (req, res) => {
  console.log('index.js | 6 | req :', req);
  res.send('Hello World!')
})

app.get('/download', (req, res) => {
  console.log('index.js | 6 | req :', req.headers);
  download()
  res.sendFile(path.resolve(__dirname, "./downloads.html"))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

async function download() {
  downloadTiktokVideo(URL)
}

module.exports = {
  app
}
