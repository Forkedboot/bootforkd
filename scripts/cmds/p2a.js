const fs = require("fs")
const axios = require("axios")
const Jimp = require("jimp")

module.exports = {
	config: {
		name: "p2a",
		version: "1.1",
		author: "NIB",
		countDown: 2,
		role: 0,
		shortDescription: {
			vi: "",
			en: ""
		},
		longDescription: {
			vi: "",
			en: ""
		},
		category: "",
		guide: "",
		
	},

onStart: async function ({ event, message, getLang, threadsData, api, args}) {
/*let ctn = await threadsData.get(event.threadID, "settings.ctn");
		
			
if(args[0]=="approve" && args[1]){
  if(global.GoatBot.config.adminBot.includes(event.senderID)){
    try{
      if(ctn == true){
        message.reply("Already approved boss")
      } else{
        await threadsData.set(event.threadID, true, "settings.ctn")
message.reply("Approved boss.")

      }
    }catch(e){
      console.log(e)
      message.send("Baka problem with group id.")
    }
  } else{
    message.reply("hehe. fak u. donate to my admins to use premium commands.")
  }
}else*/ if (event.type == "message_reply") {
			if (event.messageReply.attachments.length > 0 && (event.messageReply.attachments[0].type == "photo")) {
				try{

message.reply("Creating your anime style picture. Please wait.......")

let base = await getbase64(event.messageReply.attachments[0].url)

const res = await axios.post(
    'https://ai.tu.qq.com/trpc.shadow_cv.ai_processor_cgi.AIProcessorCgi/Process',
    {
        'busiId': 'ai_painting_anime_img_entry',
        'images': [base],
        'extra': '{"face_rects":[],"version":2,"platform":"web","data_report":{"parent_trace_id":"507bb851-89d9-e7fe-1760-3a15fcf2e640","root_channel":"","level":0}}'
    
    },
    {
        headers: {
            'Accept-Language': 'en-US,en;q=0.9',
            'Connection': 'keep-alive',
            'Origin': 'https://h5.tu.qq.com',
            'Referer': 'https://h5.tu.qq.com/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            /*'User-Agent': 'Mozilla/5.0 (Linux; Android 12; RMX3095) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36',*/
            'sec-ch-ua': '"Chromium";v="107", "Not=A?Brand";v="24"',
            'sec-ch-ua-mobile': '?1',
            'sec-ch-ua-platform': '"Android"'
        }
    }
)
console.log(res.data)
let des = JSON.parse(res.data.extra)

  const pathSave = `${__dirname}/tmp/p2a.png`;
          
let image = await Jimp.read(des["img_urls"][0])
let w = image.bitmap.width; //  width of the image
    let h = image.bitmap.height;
   await image.crop(0,0,w,h-185)
     await image.writeAsync(pathSave)
     message.reply({
			attachment: fs.createReadStream(pathSave)
		})// () => fs.unlinkSync(pathSave));
          
        }catch (e) {
					console.log(e)
					message.reply('🥺 server busy')
				}
			} else {
				message.reply("Only reply to images to make cartoons")
			}
		} else {
			message.reply("Only reply to images to make cartoons")
		}
		
}
}


async function getbase64(url){
  let resp = await axios.get(url, {responseType: 'arraybuffer'})
let base64 = Buffer.from(resp.data).toString('base64')

  return base64
}