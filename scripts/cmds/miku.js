const axios = require("axios")

module.exports = {
	config: {
		name: "miku",
		version: "1.1",
		author: "NIB",
		countDown: 5,
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

onStart: async function ({ event, message, getLang, usersData, api, args}) {


  let inp = args.join(" ")
  if(!inp) return message.reply(" Say something baka")

try{
  let resp = await axios.get(`https://simsimi.info/api/?text=${encodeURIComponent(inp)}&lc=bn`)

  message.reply(resp.data.message)
} catch(error){
  message.reply("I'm dizzy baka.")
  console.log("h", error)
}



}
}
