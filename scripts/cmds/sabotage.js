const axios = require('axios');

module.exports = {
	config: {
		name: "sabotage",
		aliases: ["sabotage"],
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
    
    //let info = await api.getUserInfo(event.senderID)
   // let name = info[event.attachments].name
    const uid = Object.keys(event.mentions)[0];
		if (event.type == "message_reply") {
      
      
    
			if(global.sabotage.includes(event.messageReply.messageID)){
if(uid){
  try{
let res= await axios.get(`https://api.misfitsdev.xyz/harem/sabotage.php?gid=${event.threadID}&uid=${uid}`)
    console.log(res)
let res2 = res.data
      console.log(res2)
    message.reply(res2.status)
    global.sabotage.splice(global.sabotage.indexOf(event.messageReply.messageID), 1)
      }catch(e){
        console.log(e)
      message.reply("server goes bruh")
      }
}else{message.reply("Baka....\nMention someone")}
  }
else{ if(event.messageReply.senderID == api.getCurrentUserID() && event.messageReply.body == "sabotage chance"){message.reply("Baka timeover")}else{
        message.reply("Not a sabotage chance")}
      }
      
      
       		} else {
			message.reply("Only reply to sabotage chance when they Appears.")
		}

	}
};