const axios = require('axios');
const chance = (percentage) => Math.random() * 100 < percentage;
const deltaNext = global.GoatBot.configCommands.envCommands.rank.deltaNext;
const expToLevel = exp => Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);

module.exports = {
	config: {
		name: "harembot",
		version: "1.0",
		author: "@tas33n",
		countDown: 1,
		role: 0,
		shortDescription: "Enable/disable Waifu Harem",
		longDescription: "",
		category: "harem kings",
		guide: "{pn} {{[on | off]}}",
		envConfig: {
			deltaNext: 5
		}
	},
  

	onStart: async function ({ message, event, threadsData, args }) {
		if (!["on", "off"].includes(args[0]))
			return message.reply("Please choose {{`on`}} or {{`off`}}");
		await threadsData.set(event.threadID, args[0] === "on", "settings.sendRankupMessage");
		return message.reply(`Is already ${args[0] === "on" ? "turn on" : "Turn off"}`);
	},

	onChat: async function ({ api, threadsData, usersData, event, message }) {

    
		const sendRankupMessage = await threadsData.get(event.threadID, "settings.sendRankupMessage");
		if (!sendRankupMessage)
			return;

    
      
		if(!global.waifu.hasOwnProperty(event.threadID)){
    global.waifu[event.threadID] = 1;
    }
    global.waifu[event.threadID]++
    if(global.waifu[event.threadID] == 3) { 
      let time = Math.floor((Math.random()*1)+1)
      console.log(`waifu timer started for ${time}minutes`)
      setTimeout(async function(){
			const BASE_URL = `https://api.misfitsdev.xyz/harem/waifu.php`;
			try {
				let res = await axios.get(BASE_URL)
				let res2 = res.data
				let id = res2.id
				let img = res2.url
				const form = {
					body: `${id}`
				};
				if (img) {
					form.attachment = []
					form.attachment[0] = await global.utils.getStreamFromURL(img);

				}
				message.send(form, (err, info) => {global.fff.push(info.messageID)

                                     });
				message.send('A qt waifu appeared! Add them to your harem by replying /harem character name')
        global.waifu[event.threadID] = 0
        let stime = Math.floor((Math.random()*1)+1)
        if(chance(90)){
          console.log("sabotage will come in minutes: "+stime)
          setTimeout(function(){
        api.sendMessage("sabotage chance", event.threadID, (err,info) => {
          
            global.sabotage.push(info.messageID)
    setTimeout(function (){
      global.sabotage.splice(global.sabotage.indexOf(info.messageID),1)
    }, 30000)
                   } )
        
      }, stime*60000)
    
        }else{console.log("sabotage wont come")}
			} catch (e) { message.reply('🥺 server busy') };
		}, time*6000)}
	}
}