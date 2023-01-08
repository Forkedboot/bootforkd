const axios = require('axios');

module.exports = {
	config: {
		name: "chika",
		aliases: ["chika"],
		version: "1.0",
		author: "Taseen",
		countDown: 5,
		role: 0,
		shortDescription: "chikas thought",
		longDescription: "",
		category: "useless",
		guide: "{pn} {{<name>}}"
	},

	onStart: async function ({ event, message, args }) {
		const name = args.join(" ");
		if (event.body && event.body.toLowerCase() === "chika")
			return message.reply(`⚠️ | Hey, I'm here!`);
		else {
			const BASE_URL = `http://api.misfitsdev.xyz/chika.php?query=${name}`;
			try {
				let res = await axios.get(BASE_URL)
				let res2 = res.data

				let chika = res2.chika
				//let img = res2.imageUrl

				const form = {
					body: `${chika}`

				};
				//if (img)
				//	form.attachment = await global.utils.getStreamFromURL(img);
				message.reply(form);
			} catch (e) { message.reply(`🥺 chika busy.`) }

		}
	}
};


onChat: async function ({ event, message }) {
		if (event.body && event.body.toLowerCase() === "chika")
			return () => {
				return message.reply(`hey, I'm here.);
			};
	}