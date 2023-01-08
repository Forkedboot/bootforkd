const axios = require('axios');

module.exports = {
	config: {
		name: "cont",
		aliases: ["cont, cpa"],
		version: "1.0",
		author: "@tas33n",
		countDown: 5,
		role: 0,
		shortDescription: "get container data",
		longDescription: "",
		category: "useless",
		guide: "{pn} {{<name>}}"
	},

	onStart: async function ({ message, args }) {
		const name = args.join(" ");
		if (!name)
			return message.reply(`⚠️ | Please enter container number!`);
		else {
			const BASE_URL = `http://portauthor.cf/cont.php?id=${name}`;
			try {
				let res = await axios.get(BASE_URL)
				let res2 = res.data

				let cnt = res2.cont
				let inf = res2.info
				//let img = res2.imageUrl

				const form = {
					body: `===「Container Info」===`
						+ `\n\n🔰 Container No: ${cnt}`
						+ `\n\n♻️ ${inf}`

				};
				//if (img)
				//	form.attachment = await global.utils.getStreamFromURL(img);
				message.reply(form);
			} catch (e) { message.reply(`🥺 Not Found`) }

		}
	}
};