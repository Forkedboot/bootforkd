const fs = require("fs")

const axios = require("axios")

const FormData = require('form-data');



module.exports = {

	config: {

		name: "cartoon",

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


let msg = args.join(" ")

if(msg){

}

if (event.type == "message_reply") {

			if (event.messageReply.attachments.length > 0 && (event.messageReply.attachments[0].type == "photo")) {

				try{

const file = await global.utils.getStreamFromURL(event.messageReply.attachments[0].url)


const form = new FormData();

form.append('file_type', 'image');

form.append('image', file , 'ctn.jpg;type=image/jpeg');


const res = await axios.post(

'https://cartoonize-lkqov62dia-de.a.run.app/cartoonize',

form,

{

headers: {

...form.getHeaders(),

'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',

'Content-Type': 'multipart/form-data'

}

}

)


let str = res.data

let ddd = str.slice(str.indexOf(`<div class="image">`)+66, str.indexOf(`</div>`, str.indexOf(`<div class="image">`))-35)


//message.reply(ddd.replaceAll("amp;", ""))

message.reply({attachment:await global.utils.getStreamFromURL(ddd.replaceAll("amp;", ""))})

}catch (e) {

					console.log(e)

					message.reply('🥺 server busy')

				}

			} else {

				message.reply("Only reply to images to make cartoons")

			}

		} else {

			message.reply("Only reply to images to make cartoons")

		}

		

}

}