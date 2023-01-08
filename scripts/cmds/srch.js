const axios = require('axios');
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "srch",
    author: "NIB",
    version: "1.1",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: "serch for cover characters"
    },
    longDescription: {
      en: ""
    },
    category: "image",
    guide: {
      en: "{p}{n} character name"
        + "\n{p}{n} anime name"
    }
  },

  langs: {

  },

  onStart: async function ({ args, message, getLang }) {
    ;
    if (!args.length) return message.reply("enter a character name")
    let type, name;
    if (["character", "anime"].includes(args[0])) {
      type = args[0]
      args.shift()
      name = args.join(" ")
    } else {
      type = "character"
      name = args.join(" ")
    }

    const dataChracter = (await axios.get("https://api2.misfitsdev.xyz/cover/list")).data

    switch (type) {
      case "character":
        let arr = []
        dataChracter.forEach(e => {
          if (e.name.toLowerCase().includes(name.toLowerCase())) {
            arr.push("~ " + e.name)
          }
        })

        if (!arr.length) return message.reply("no charachter found")

        message.reply(`Numbers of charachter found: ${arr.length}\n\nCharachter are:\n${arr.join("\n")}`)
        break;
      case "anime":
        let obj = {}
        dataChracter.forEach(e => {
          if (e.dm.toLowerCase().includes(name.toLowerCase())) {
            if (!obj[e.dm]) obj[e.dm] = []
            obj[e.dm].push(e.name)
          }
        })

        if (Object.keys(obj).length === 0) return message.reply("no anime found")

        let form = ""
        for (var item in obj) {
          form += `\n\n*Anime: ${item}\nCharachters:`
          for (var iitem of obj[item]) {
            form += `\n~${iitem}`
          }
        }

        message.reply(form)


        break;

    }
  }

}