const axios = require('axios');
const { getStreamFromURL } = global.utils;

module.exports = {
	config: {
		name: "cover",
		author: "tas33n",
		version: "1.1",
		cooldowns: 5,
		role: 0,
		shortDescription: {
			en: "create cover"
		},
		longDescription: {
			en: ""
		},
		category: "image",
		guide: {
			en: "{p}{n} <character id or character name> | <Name> | <subname> | <color>"
				+ "\n{p}{n} help: view how to use this command"
		}
	},

	langs: {
		en: {
			initImage: "please wait, i'm making your cover...",
			invalidCharacter: "Currently there are only %1 characters on the system, please enter a character id less than",
			notFoundCharacter: "No character named %1 was found in the character list",
			errorGetCharacter: "An error occurred while getting character data:\n%1: %2",
			success: "✅ Your avatar\nCharacter: %1\nID: %2\nBackground text: %3\nSignature: %4\nColor: %5",
			defaultColor: "default",
			error: "An error occurred\n%1: %2"
		}
	},

	onStart: async function ({ args, message, getLang }) {
		message.reply(getLang("initImage"));
		const content = args.join(" ").split("|").map(item => item = item.trim());
		let idNhanVat, tenNhanvat;
		const name = content[1];
		const subname = content[2];
		const colorBg = content[3];
		try {
			const dataChracter = (await axios.get("https://api2.misfitsdev.xyz/taoanhdep/list")).data.listAnime;
			if (!isNaN(content[0])) {
				idNhanVat = parseInt(content[0]);
				const totalCharacter = dataChracter.length - 1;
				if (idNhanVat > totalCharacter)
					return message.reply(getLang("invalidCharacter", totalCharacter));
				tenNhanvat = dataChracter[idNhanVat].name;
			}
			else {
				const findChracter = dataChracter.find(item => item.name.toLowerCase() == content[0].toLowerCase());
				if (findChracter) {
					idNhanVat = findChracter.ID;
					tenNhanvat = content[0];
				}
				else
					return message.reply(getLang("notFoundCharacter", content[0]));
			}
		}
		catch (error) {
			const err = error.response.data;
			return message.reply(getLang("errorGetCharacter", err.error, err.message));
		}

		const endpoint = `https://api2.misfitsdev.xyz/fbcover/v2?`;
		const params = {
			id: idNhanVat,
			name,
			subname,
		};
		if (colorBg)
			params.colorBg = colorBg;

		try {
			const avatarImage = await getStreamFromURL(endpoint, "avatar.png", { params });
			message.reply({
				body:``,
				attachment: avatarImage
			});
		}
		catch (error) {
			console.log(error)
			error.response.data.on("data", function (e) {
				const err = JSON.parse(e);
				message.reply(getLang("error", err.error, err.message));
			});
		}
	}
};