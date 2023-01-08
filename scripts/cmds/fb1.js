const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");
module.exports = {
	config: {
		name: "fb",
		version: "1.0",
		author: "@Tas33n.",
		countDown: 5,
		role: 0,
		shortDescription: "Create fb Banner",
		longDescription: "",
		category: "image",
		guide: {
			en: "{p}{n} <name> | <subname> | <address> | <phone> | <email> | <color>",
		}
	},

	onStart: async function ({ message, args, event, api }) {
// let avatarUrl1;
// 	  if(event.type == "message_reply" && event.messageReply.attachments.length > 0 && (event.messageReply.attachments[0].type == "photo" || "animated_image")){
// var x = event.messageReply.attachments[0].url;
// avatarUrl1 = event.messageReply.attachments[0].url;
// } else{
// avatarUrl1 = `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
// };
	  
    const info = args.join(" ");
		if (!info){
			return message.reply(`- lol, wheres the info!`);
		}else {
		const msg = info.split("|");
		const name = msg[0];
		const subname = msg[1];
		const address = msg[2];
		const phone = msg[3];
		const email = msg[4];
		const color1 = msg[5];
    const color = color1.replace(/^\s+|\s+$/gm,'');
  
    const img = (`https://api2.misfitsdev.xyz/fbcover/v1?name=${name}&subname=${subname}&address=${address}&uid=${event.senderID}&sdt=${phone}&email=${email}&color=${color}`)			
                 const form = {
				body: ``
			};
				form.attachment = []
				form.attachment[0] = await global.utils.getStreamFromURL(img);
			message.reply(form);
			  }
}};