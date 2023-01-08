

module.exports = {
	config: {
		name: "jskajajhdhdujsbabahsudbbd",
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
  

	onStart: async function ({ api, message, event, threadsData, args }) {
let resend = await threadsData.get(event.threadID, "settings.reSend");
		
			console.log(resend)
    if(resend === undefined){
      await threadsData.set(event.threadID, true, "settings.reSend");
    }
    console.log(await threadsData.get(event.threadID, "settings.reSend"))
		if (!["on", "off"].includes(args[0]))
			return message.reply("on or off")
		await threadsData.set(event.threadID, args[0] === "on", "settings.reSend");
    console.log(await threadsData.get(event.threadID, "settings.reSend"))
    if(args[0] == "on"){
      if(!global.reSend.hasOwnProperty(event.threadID)){
    global.reSend[event.threadID] = []
    }
    global.reSend[event.threadID] = await api.getThreadHistory(event.threadID, 100, undefined)
//console.log(global.reSend[event.threadID])
}
		return message.reply(`Is already ${args[0] === "on" ? "turn on" : "Turn off"}`);
	},

onChat: async function ({ api, threadsData, usersData, event, message }) {
  if(event.type !== "message_unsend"){
		let resend = await threadsData.get(event.threadID, "settings.reSend");
		if (!resend)
			return;
  
		if(!global.reSend.hasOwnProperty(event.threadID)){
    global.reSend[event.threadID] = []
    }
    global.reSend[event.threadID].push(event)

  if(global.reSend.length >50){
    global.reSend.shift()
  }
	}
}

  
}