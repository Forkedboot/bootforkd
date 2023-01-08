const axios = require('axios');

module.exports = {
	config: {
		name: "milf",
		aliases: ["milf"],
		version: "1.0",
		author: "@tas33n",
		countDown: 5,
		role: 0,
		shortDescription: "get milf",
		longDescription: "",
		category: "anime",
		guide: "{pn}"
	},

	onStart: async function ({ message, args }) {
		const BASE_URL = `https://api.misfitsdev.xyz/anime/milf`;
		try {
			let res = await axios.get(BASE_URL)
			let res2 = res.data
            let img = res2.url
			const form = {
				body: ` ❤️🥵 `
			};
			if (img) {
				form.attachment = []
				form.attachment[0] = await global.utils.getStreamFromURL(img);

			}
			message(form);
		} catch (e) { message.send('🥺 Not Found') }

	}
};