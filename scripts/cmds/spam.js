const axios = require('axios');

module.exports = {
	config: {
		name: "spam",
		aliases: ["spam"],
		version: "1.0",
		author: "@tas33n",
		countDown: 5,
		role: 0,
		shortDescription: "spamm",
		longDescription: "",
		category: "useless",
		guide: "{pn} {{<name>}}"
	},

	onStart: async function ({ message, args, api, event }) {

      let reactions = ["😍","😢","😠","👎","❤","😮"]
		if(event.type == "message_reply") {
      if(!global.GoatBot.config.adminBot.includes(event.messageReply.senderID)){
      let ind = global.spam.findIndex(e => e.mid == event.messageReply.messageID)
//console.log(global.spam,ind)
		  if(!args.length){
        if(ind<0){
		global.spam.push({mid:event.messageReply.messageID, tmr:setInterval(function(){ api.setMessageReaction(reactions[Math.floor(Math.random()*reactions.length)], event.messageReply.messageID)
		 }, 2000)})} else{message.reply("করতাছি ই তো😒")}
      } else if(args[0] == "off"){
         
        if(ind<0){
          message.reply("স্প্যাম করলাম ই তো না\nঅফ করমু কি")
        } else{
        clearInterval(global.spam[ind].tmr);
          global.spam.splice(ind, 1)
    message.reply("আপনার কথায় মাফ কইরা দিলাম")
        }
         
      
    }
    }else{message.reply("That's my boss u know")}} else{
		  message.reply("Reply to any message")
		}
	}

};