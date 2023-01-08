module.exports = {
	config: {
		name: "lyrics",
		version: "1.1",
		author: "NIB",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "",
			en: "song lyrics"
		},
		longDescription: {
			vi: "",
			en: "find song lyrics"
		},
		category: "",
		guide: "{pn} <song name> ",
		
		
	},

onStart: async function ({ api, event, message, args, getLang }) {


const lyricsFinder = require('lyrics-finder');
  let abc = args.join(" ")
  let def = abc.split("|")
    let lyrics = await lyricsFinder(args.join(" ")) || "Not Found!";
    console.log(lyrics);
api.sendMessage(`${lyrics}`, event.threadID, event.messageID);


  
}
}