const axios = require('axios');

module.exports = {
	config: {
		name: "anime",
		aliases: ["anime, manga"],
		version: "1.0",
		author: "@tas33n",
		countDown: 5,
		role: 0,
		shortDescription: "get anime data",
		longDescription: "search and get anime infos",
		category: "anime",
		guide: "{pn} {{<name>}}"
	},

	onStart: async function ({ message, args }) {
		const name = args.join(" ");
		if (!name)
			return message.reply(`⚠️ | Please enter anime name!`);
		else {
			const BASE_URL = `https://api.jikan.moe/v4/anime?q=${name}`;
			try {
				let res = await axios.get(BASE_URL)


				let res2 = res.data.data

				let titl = res2.title.english + " " + res2.title.native
				let statu = res2.status
				let dura = res2.duration
				let episode = res2.episodes
				let startDat = res2.startDate.day + "/" + res2.startDate.month + "/" + res2.startDate.year
				let endDat = res2.endDate.day + "/" + res2.endDate.month + "/" + res2.endDate.year, l
				let genre = res2.genres
				let studio = res2.studios
				let score = res2.averageScore
				let desc = res2.description
				let img = res2.imageUrl

				const form = {
					body: `===「Anime Info」===`
						+ `\n\n🔰 Name: ${titl}`
						+ `\n♻️ Status: ${statu}`
						+ `\n✅ Episode: ${episode}`
						+ `\n🕙 Duration: ${dura}`
						+ `\n⭐ Score: ${score}`
						+ `\n📅 Started: ${startDat}`
						+ `\n📅 Ended: ${endDat}`
						+ `\n\n💾 Genres: ${genre}`
						+ `\n\n📺 Studios: ${studio}`
						+ `\n\n🔉 Description: ${desc}`

				};
				if (img)
					form.attachment = await global.utils.getStreamFromURL(img);
				message.reply(form);
			} catch (e) { message.reply(`🥺 Not Found`) }

		}
	}
};