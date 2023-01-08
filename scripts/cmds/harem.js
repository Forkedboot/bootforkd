const axios = require('axios');

module.exports = {
	config: {
		name: "harem",
		aliases: ["harem"],
		version: "1.0",
		author: "@tas33n",
		countDown: 5,
		role: 0,
		shortDescription: "Build your harem with waifus",
		longDescription: "",
		category: "harem kings",
		guide: "{pn} Waifu Name"
	},

	onStart: async function ({ api, message, args, event }) {
    const waifu = args.join(" ");
    let info = await api.getUserInfo(event.senderID)
    let name = info[event.senderID].name
    
		if (event.type == "message_reply") {
			if (event.messageReply.attachments.length > 0 && (event.messageReply.attachments[0].type == "photo" || "animated_image")) {
				try {
					let res = await axios.get(`https://api.misfitsdev.xyz/harem/request.php?wid=${encodeURIComponent(event.messageReply.body)}&uid=${event.senderID}&gid=${event.threadID}&username=${name}&waifu=${waifu}`)
					let res2 = res.data
console.log(res2)
					const form = {
						body: res2.msg
					};

					api.sendMessage(form, event.threadID, event.messageID)
          if(res2.includes("congratulation")){
  message.unsend(event.messageReply.messageID)
          }
				} catch (e) {
					console.log(e)
					message.reply('🥺 server busy')
				}
			} else {
				message.reply("Only reply to waifu photo when they Appears.")
			}
		} else {
			message.reply("Only reply to waifu photo when they Appears.")
		}

	}
};