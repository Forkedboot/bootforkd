const axios = require('axios');

module.exports = {
	config: {
		name: "haremkings",
		aliases: ["kings"],
		version: "1.0",
		author: "tas33n",
		countDown: 5,
		role: 0,
		shortDescription: "See all Top HaremKings",
		longDescription: "",
		category: "harem kings",
		guide: "{pn}"
	},

	onStart: async function ({ api, message, args, event }) {
		const BASE_URL = `https://api.misfitsdev.xyz/harem/kings.php?gid=${event.threadID}`;
		try {
			let res = await axios.get(BASE_URL)
			let res2 = res.data


res2.sort((a, b) => {
    return b.waifus - a.waifus;
});
      var str = ""
for(var itm of res2){
	str += `${res2.indexOf(itm)+1} ↬ Uid : ${itm.uid}
   Name : ${itm.name}
 Waifus : ${itm.waifus}\n\n`
}
      
			const form = {
				body: str
			};
			// if (img) {
			// 	form.attachment = []
			// 	form.attachment[0] = await global.utils.getStreamFromURL(img);

			// }
			message.reply(form);
		} catch (e) { console.log(e)
      message.reply('🥺 Not Found') }

	}
};