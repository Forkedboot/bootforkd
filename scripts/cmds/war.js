const Canvas = require(`canvas`);

const GIFEncoder = require(`gifencoder`);

const fs = require("fs")
module.exports = {
	config: {
		name: "war",
		version: "1.1",
		author: "NIB",
		countDown: 5,
		role: 2,
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

onStart: async function ({ event, message, getLang, usersData, api, args}) {

 let arr = 
[
  "বেজন্মা",
  "মাদারচোদ",
  "খানকির পোলা",
"মাগির ছেলে",
  "শয়তান",
  " অসভ্য",
  " ফাজিল",
  "নোংরা",
  " ইতর",
  "অভদ্র",
  " বেয়াদব",
  " বেঈমান",
  " মুনাফেক",
 /* " কাফের",
  "মুফিজ ",
  " মুফিকার",
  " আতেল",
  " কুত্তা",
  " ঘাঘু",
  "চাংগা মাংগী",
  "কিপটা",
  "ফকির ফকিরনি",
  " দুষ্টু",
  " বুদাই",
  " মিছকা শয়তান",
  " আকাশের লাও",
  " শালা",
  "পুটকি চুদি",
  " মদন",
  " হাবলা",
  " কেবলা",
  " হাব্ব্র ",
  " বদ",
  " বদমাইশ",
  " লম্পট",
  " পাগলার বাচ্চা",
  " টিক টিকির ডিম",
  " মুরগীর বাচ্চা",
  " মুরগীর পুৎ",
  " হালার পুৎ হালা",
  " শালার বাচ্চা",
  " ননসেন্স",
  " ইডিয়ট",
  " স্টুপিড",
  " বাস্টার্ড",
  " ফাকার",
  " ফকির",
  " কুত্তা",
  " কুত্তার বাচ্চা",
  " শুয়োর",
  " শুয়োরের বাচ্চা",
  "হারামজাদ া হারামি",
  " কালপেট লাটু লাটাই",
  "হাওয়া",
  " হাওয়ার পো",
  " মগা",
  " হাঁদা",
  " হাঁদারাম",
  " পাগলাবাই",
  " পামুস ",
  "তুমুস",
  " হামুস",
  " মামুস",
  " চুদমারানি",
  " চোদনা",
  " চোদনখোর",
  " চোদোন খাইয়ে",
  " হারামখোর",
  " মাগি জাতির পুৎ",
  "তোর মায়রে",
  "বাল",
  " বালের বাচ্চা",
  "পোদমারানি",
  " পোদখোর",
  "জাওরা",
  " জাওরার পো",
  " বেশ্যার বাচ্চা বেশ্যা",
  " নটি মটর পো",
  " খানকি",
  " খানকি মাগি",
  "চুদমারানি",
  " মান্দার পো",
  " হুগার পো",
  "বান্দি",
  " বান্দির পো",
  " চুদি",
  "চুদিরভাই",
  " মাদারচোদ",
  " ফাদারচোদ",
  " চুদানিরপো",
  " পুকচুদ ভুদামারানি",
  "রেন্ডি",
  " হাওয়া চুদা",
  " রেন্ডিচুদা",
  " খানকিরপো",
  "মাদমারানির পো",
  " গুয়ার পো",
  " নর্তকির পোলা চ্যাটের বাল",
  " হরির পোলা ঘোরার বাল",*/
  " আদাচোদা"
]

let ment = Object.keys(event.mentions)
if(ment.length > 1) return message.reply("Mention someone")

let mid = Object.keys(event.mentions)[0]
let mtag = event.mentions[mid]
let time = 1000

let body = `Your account will be disabled in 10 minutes😈😈\nhttps://www.facebook.com/profile.php?id=${mid}`
  let url = await usersData.getAvatarUrl(mid)
let abc = await getImage(url)
const pathSave = `${__dirname}/tmp/target.gif`;

fs.writeFileSync(pathSave, Buffer.from(abc));

  

  
for(let i = 0; i<arr.length; i++){

setTimeout(function(){console.log(" pore "+arr[i])
message.send({body:mtag + " " +arr[i],mentions:[{id:mid,tag:mtag}]})},time)
  if(i==arr.length-1){
    setTimeout(function(){message.send({body:body,attachment: fs.createReadStream(pathSave)
		}, () => fs.unlinkSync(pathSave))}, time+1000)
  }
time+=1000

}

}
}




async function getImage(image, timeout = 15) {
        if (!image) throw new Error(`You must provide an image as a first argument.`);
        if (isNaN(timeout)) throw new Error(`The timeout argument must be a number.`);
        const base = await Canvas.loadImage("target.png");
        const img = await Canvas.loadImage(image);
        const GIF = new GIFEncoder(256, 310);
        GIF.start();
        GIF.setRepeat(0);
        GIF.setDelay(timeout);
        const canvas = Canvas.createCanvas(256, 310);
        const ctx = canvas.getContext(`2d`);
        const BR = 20;
        const LR = 10;
        for (var i = 0; i < 9; i++) {
            ctx.clearRect(0, 0, 256, 310);
            ctx.drawImage(img, Math.floor(Math.random() * BR) - BR, Math.floor(Math.random() * BR) - BR, 256 + BR, 310 - 54 + BR);
            ctx.fillStyle = `#FF000033`;
            ctx.fillRect(0, 0, 256, 310);
            ctx.drawImage(base, Math.floor(Math.random() * LR) - LR, 310 - 54 + Math.floor(Math.random() * LR) - LR, 256 + LR, 54 + LR);
            GIF.addFrame(ctx);
        }
        GIF.finish();
        return GIF.out.getData();
    }