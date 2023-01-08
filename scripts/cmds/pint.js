
const fs = require("fs-extra")
const axios = require("axios")
module.exports = {
	config: {
		name: "pint",
		version: "1.1",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "Xem uid",
			en: "View uid"
		},
		longDescription: {
			uid: "Xem user id facebook của người dùng",
			en: "View facebook user id of user"
		},
		category: "info",
		guide: {
			vi: "   {pn}: dùng để xem id facebook của bạn"
				+ "\n   {pn} @tag: xem id facebook của những người được tag"
				+ "\n   {pn} <link profile>: xem id facebook của link profile",
			en: "   {pn}: use to view your facebook user id"
				+ "\n   {pn} @tag: view facebook user id of tagged people"
				+ "\n   {pn} <profile link>: view facebook user id of profile link"
		}
	},

	langs: {
		vi: {
			syntaxError: "Vui lòng tag người muốn xem uid hoặc để trống để xem uid của bản thân"
		},
		en: {
			syntaxError: "Please tag the person you want to view uid or leave it blank to view your own uid"
		}
	},

	onStart: async function ({ api, message, event, args, getLang }) 
  {
    
    const keySearch = args.join(" ");
    if(keySearch.includes("-") == false) return api.sendMessage('Please enter in the format, example: pinterest Naruto - 10 (it depends on you how many images you want to appear in the result)', event.threadID, event.messageID)
    const keySearchs = keySearch.substr(0, keySearch.indexOf('-'))
    let numberSearch = keySearch.split("-").pop() || 6
    if(numberSearch>9){
      numberSearch = 9
    }
    const res = await axios.get(`https://api-dien.senthanh20055.repl.co/pinterest?search=${encodeURIComponent(keySearchs)}`);
    const data = res.data.data;
    var num = 0;
    var imgData = [];
    for (var i = 0; i < parseInt(numberSearch); i++) {
      let path = __dirname + `/tmp/${num+=1}.jpg`;
      let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
      imgData.push(fs.createReadStream(__dirname + `/tmp/${num}.jpg`));
    }
    api.sendMessage({
        attachment: imgData,
        body: numberSearch + 'Search results for keyword: '+ keySearchs
    }, event.threadID, event.messageID)
    for (let ii = 1; ii < parseInt(numberSearch); ii++) {
        fs.unlinkSync(__dirname + `/tmp/${ii}.jpg`)
    }
}
  
};