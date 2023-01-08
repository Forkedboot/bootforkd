const axios = require('axios');

module.exports = {
	config: {
		name: "addwaifu",
		aliases: ["addwaifu"],
		version: "1.0",
		author: "@tas33n",
		countDown: 5,
		role: 2,
		shortDescription: "add waifu for waifu harem bot",
		longDescription: "",
		category: "harem kings",
		guide: "{pn} waifu Name"
	},

	onStart: async function ({ message, args, event }) {
    const name = args.join(" ");
    let url = encodeURIComponent(event.messageReply.attachments[0].url)
    
		try {
			let res = await axios.get(`https://api.misfitsdev.xyz/harem/upload.php?uid=${event.senderID}&name=${name}&url=${url}`)
			let res2 = res.data

			const form = {
				body: res2.status.toString()
			};
			message.reply(form);
		} catch (e) {
			console.log(e)
			message.reply('🥺 error')
		}

	}
};