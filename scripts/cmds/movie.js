const axios = require("axios")
module.exports = {
	config: {
		name: "movie",
		version: "1.1",
		author: "NIB",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "",
			en: ""
		},
		longDescription: {
			vi: "",
			en: ""
		},
		category: "",
		guide: "",
		
	},

onStart: async function ({ event, message, getLang, usersData, api, args}) {

  let query = args.join(" ")
  if(!query) return message.reply("Give a movie name baka")
  try{
  let res = await axios.get(`https://api.popcat.xyz/imdb?q=${encodeURIComponent(query)}`)
    
      let title = res.data.title,
        date = res.data.year,
        time = res.data.runtime,
        genres = res.data.genres,
        director = res.data.director,
        actors = res.data.actors,
        plot = res.data.plot
      var poster = res.data.poster;
     // console.log(res)
        message.reply(
        {
          body: `Title: ${title}\n\nActors: ${actors}\n\nRelease Date: ${date}\n\nGenres: ${genres}\n\nDirector: ${director}\n\nPlot: ${plot}`,
          attachment: await global.utils.getStreamFromURL(poster)})
  } catch(e){
    console.log(e)
    message.reply("Could not found🫠")
  }

            
}
}