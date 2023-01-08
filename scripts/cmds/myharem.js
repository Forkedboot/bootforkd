const axios = require('axios');

module.exports = {
	config: {
		name: "myharem",
		aliases: ["myharem"],
		version: "1.0",
		author: "@tas33n",
		countDown: 5,
		role: 0,
		shortDescription: "View your harems",
		longDescription: "",
		category: "harem kings",
		guide: "{pn}"
	},

	onStart: async function ({ api, message, args, event }) {
		try {
			let res = await axios.get(`https://waifu.misfitsdev.xyz/myharem.php?uid=${event.senderID}&gid=${event.threadID}`)
			let res2 = res.data
      let fbid = res2.fb_uid
      let name = res2.name
      let waifus = res2.waifus
      let waifus_name = res2.waifus_name
			const form = {
					body: `╭「Harem Kings Candidate」`
				    + `\n│_`
					+ `\n❏ User id: ${fbid}`
					+ `\n❏ Name: ${name}`
					+ `\n❏ Waifus: ${waifus}`
					+ `\n↬ ${waifus_name}`
				};
			api.sendMessage(form, event.threadID, event.messageID);
		} catch (e) {
			console.log(e)
			message.reply('🥺 server busy')
		}

	}
};