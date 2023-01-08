const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ Cool Bot ]";
const characters = "━━━━━━━━━━━━━";
/** 
* @author NTKhang
* @author: do not delete it
* @message if you delete or edit it you will get a global ban
*/

module.exports = {
	config: {
		name: "help",
		version: "1.4",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "Xem cách dùng lệnh",
			en: "View command usage"
		},
		longDescription: {
			vi: "Xem cách sử dụng của các lệnh",
			en: "View command usage"
		},
		category: "info",
		guide: {
			vi: "{pn} [để trống | <số trang> | <tên lệnh>]",
			en: "{pn} [empty | <page number> | <command name>]"
		},
		priority: 1
	},

	onStart: async function ({ message, args, event, threadsData, getLang, role }) {
		const langCode = await threadsData.get(event.threadID, "data.lang") || global.GoatBot.config.languege;
		let customLang;
		if (fs.existsSync(`${path.join(__dirname, "..", "..", "languages", "cmds", `${langCode}.js`)}`))
			customLang = require(`${path.join(__dirname, "..", "..", "languages", "cmds", `${langCode}.js`)}`);
		else
			customLang = {};
		const { threadID } = event;
		const threadData = await threadsData.get(threadID);
		const prefix = getPrefix(threadID);
		let sortHelp = threadData.settings.sortHelp || "name";
		if (!["category", "name"].includes(sortHelp))
			sortHelp = "name";
		const commandName = (args[0] || "").toLowerCase();
		const command = commands.get(commandName) || commands.get(aliases.get(commandName));
		// ———————————————— LIST ALL COMMAND ——————————————— //
		if (!command && !args[0] || !isNaN(args[0])) {
			const arrayInfo = [];
			let msg = "";
			
				for (const [, value] of commands) {
					if (value.config.role > 1 && role < value.config.role)
						continue;
					if (arrayInfo.some(item => item.category == value.config.category.toLowerCase())) {
						const index = arrayInfo.findIndex(item => item.category == value.config.category.toLowerCase());
						arrayInfo[index].names.push(value.config.name);
					}
					else
						arrayInfo.push({
							category: value.config.category.toLowerCase(),
							names: [value.config.name]
						});
				}
				arrayInfo.sort((a, b) => (a.category < b.category ? -1 : 1));
				for (const data of arrayInfo) {
					const categoryUpcase = `━━━ ${data.category.toUpperCase()} ━━━`;
					data.names.sort();
					msg += `${categoryUpcase}\n↬ ${data.names.join(",\n↬ ")}\n\n`;
				}
				message.reply(getLang("help2", msg, characters, commands.size, prefix, doNotDelete));
			
		}
		// ———————————— COMMAND DOES NOT EXIST ———————————— //
		else if (!command && args[0]) {
			return message.reply(getLang("commandNotFound", args[0]));
		}
		// ————————————————— INFO COMMAND ————————————————— //
		else {
			const configCommand = command.config;
			const author = configCommand.author;

			const nameUpperCase = configCommand.name.toUpperCase();
			const title = `${characters}\n${nameUpperCase}\n${characters}`;

			const descriptionCustomLang = customLang[configCommand.name]?.longDescription;
			let description;
			if (descriptionCustomLang != undefined)
				description = '\n' + checkLangObject(descriptionCustomLang, langCode);
			else if (configCommand.longDescription)
				description = '\n' + checkLangObject(configCommand.description, langCode);
			const aliasesString = configCommand.aliases ? configCommand.aliases.join(", ") : getLang("doNotHave");
			const aliasesThisGroup = threadData.data.aliases ? (threadData.data.aliases[configCommand.name] || []).join(", ") : getLang("doNotHave");
			const roleText = configCommand.role == 0 ?
				getLang("roleText0") :
				configCommand.role == 1 ?
					getLang("roleText1") :
					getLang("roleText2");

			let guide;
			if (customLang[configCommand.name]?.guide != undefined)
				guide = customLang[configCommand.name].guide;
			else
				guide = configCommand.guide[langCode] || configCommand.guide["en"];
			guide = guide || {
				body: ""
			};
			if (typeof guide == "string")
				guide = { body: guide };
			const guideBody = guide.body
				.replace(/\{prefix\}|\{p\}/g, prefix)
				.replace(/\{name\}|\{n\}/g, configCommand.name)
				.replace(/\{pn\}/g, prefix + configCommand.name);

			const formSendMessage = {
				body: getLang("getInfoCommand", title, description, aliasesString, aliasesThisGroup, configCommand.version, roleText, configCommand.countDown || 1, author || "", guideBody)
			};

			if (guide.attachment) {
				if (typeof guide.attachment == "object") {
					formSendMessage.attachment = [];
					for (const pathFile in guide.attachment) {
						if (!fs.existsSync(pathFile)) {
							const cutFullPath = pathFile.split("/");
							cutFullPath.pop();
							for (let i = 0; i < cutFullPath.length; i++) {
								const path = cutFullPath.slice(0, i + 1).join('/');
								if (!fs.existsSync(path))
									fs.mkdirSync(path);
							}
							const getFile = await axios.get(guide.attachment[pathFile], { responseType: 'arraybuffer' });
							fs.writeFileSync(pathFile, Buffer.from(getFile.data));
						}
						formSendMessage.attachment.push(fs.createReadStream(pathFile));
					}
				}
			}
			return message.reply(formSendMessage);
		}
	}
};

function checkLangObject(data, langCode) {
	if (typeof data == "string")
		return data;
	if (typeof data == "object" && !Array.isArray(data))
		return data[langCode] || data.en || "";
	return "";
}