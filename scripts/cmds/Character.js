const axios = require('axios');

module.exports = {
	config: {
		name: "character",
		aliases: ["character"],
		version: "1.0",
		author: "@tas33n",
		countDown: 5,
		role: 0,
		shortDescription: "get character data",
		longDescription: "search and get character infos",
		category: "anime",
		guide: "{pn} {{<name>}}"
	},

	onStart: async function ({ message, args }) {
		const name = args.join(" ");
		if (!name)
			return message.reply(`ā ļø | Please enter character name!`);
		else {
			const BASE_URL = `https://api.safone.tech/anime/character?query=${name}`;
			try {
				let res = await axios.get(BASE_URL)


				let res2 = res.data
				let nm = res2.name.full + " " + res2.name.native
				let gen = res2.gender
				let ag = res2.age
				let heit = res2.height
				let anim = res2.media.edges[0].node.title.romaji + " šÆšµ " + res2.media.edges[0].node.title.native
				let desc = res2.description
				let img = res2.image.large
				const form = {
					body: `===ć Character Info ć===`
						+ `\n\nš¤ Name: ${nm}`
						+ `\nš» Gender: ${gen}`
						+ `\nšļø Age: ${ag}`
						+ `\nš Height: ${heit}`
						+ `\n\nšŗ Anime & Manga: ${anim}`
						+ `\n\nš Description: ${desc}`

				};
				if (img)
					form.attachment = await global.utils.getStreamFromURL(img);
				message.reply(form);
			} catch (e) { message.reply(`š„ŗ Not Found`) }

		}
	}
};