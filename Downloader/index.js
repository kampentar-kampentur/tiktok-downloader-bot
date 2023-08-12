const { tiktokHeaders } = require('./Headers.js');
const fs = require('fs/promises')
const fsStandard = require('fs');
const path = require("path");

async function getRedirectURLTiktok(url) {
  try {
    if(!validateTiktokURL(url)){
      throw new Error('Url is not valid!!!');
    }
    url = await fetch(url, {
        redirect: "follow",
        follow: 10,
    });
    url = url.url;
    console.log("[*] Redirecting to: " + url);
    return url;
  } catch (error) {
    console.error(e)
  }
}
function getTiktokIdFromURL(url) {
  const regex = /\/video\/(\d+)/;
  const match = url.match(regex);
  if (match) {
    const id = match[1];
    return id
  } else {
    throw new Error('Id is not matched!!!');
  }
}
async function getTiktokMetaDataById(id) {
  const API_URL = `https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${id}`
  const req = await fetch(API_URL, {
    method: 'GET',
    headers: tiktokHeaders
  })
  const body = await req.text();
  let res
  try {
    res = JSON.parse(body);
  } catch (err) {
    console.error("Error:", err);
    console.error("Response body:", body);
  }
  const urlMedia = res.aweme_list[0].video.play_addr.url_list[0]
  const data = {
    id,
    url: urlMedia,
    data: res
  }
  return data
}
function validateTiktokURL(url) {
  return typeof url === 'string' || url.includes('tiktok.com')
}
async function downloadVideo(item) {
  const folder = path.resolve(__dirname, './downloads');
  try {
    await fs.access(folder);
  } catch (error) {
    await fs.mkdir(folder);
  }
  
  const fileName = `${item.id}.mp4`;
  const downloadFile = await fetch(item.url);
  await fs.writeFile(path.resolve(folder, fileName), downloadFile.body)
}
async function downloadTiktokVideo(url) {
  const videoData = await getOriginalTiktokVideoURL(url)
  downloadVideo(videoData)
}

async function getOriginalTiktokVideoURL(url) {
  if(!validateTiktokURL(url)){
    throw new Error('Url is not valid!!!');
  }
  const originURL = await getRedirectURLTiktok(url)
  const videoId = getTiktokIdFromURL(originURL)
  const videoData = await getTiktokMetaDataById(videoId)
  return videoData
}

module.exports = {
  getRedirectURLTiktok,
  getTiktokIdFromURL,
  getTiktokMetaDataById,
  validateTiktokURL,
  downloadTiktokVideo,
  getOriginalTiktokVideoURL
}
