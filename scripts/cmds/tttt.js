const fs = require("fs-extra")
module.exports = {
	config: {
		name: "ttt",
		version: "1.1",
		author: "",
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
		guide: "{pn} ",
		envConfig: {
			deltaNext: 5
		}
	},

onStart: async function ({ event, message, getLang }) {

let form = {body:"",
           attachment: fs.createReadStream(__dirname + "/tmp/1.mp3")}
  message.reply(form)
}
}