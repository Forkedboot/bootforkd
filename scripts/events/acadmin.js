module.exports = {
	config: {
		name: "test",
		version: "1.1",
		author: "NIB",
		countDown: 5,
		role: 2,
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

onStart: async function ({ event, message, getLang, api, threadsData, args}) {


const { logMessageType, logMessageData, senderID } = event;
 	let acadmin = await threadsData.get(event.threadID, "settings.acadmin");
  
 	
    if (acadmin == true ) { //Guard True
        //Switch Log Sms
        
        
        
        
      
        
          if(logMessageType =="log:thread-admins") { 
            if (logMessageData.ADMIN_EVENT == "add_admin") { // add admin
              if(event.author == api.getCurrentUserID() || global.GoatBot.config.adminBot.includes(event.author)) return
              if(logMessageData.TARGET_ID == api.getCurrentUserID()) return
              else { // else
                
                api.changeAdminStatus(event.threadID, logMessageData.TARGET_ID, false)
                function editAdminsCallback(err) {
                  if (err) return api.sendMessage("🥹", event.threadID);
                  
                  
                    return api.sendMessage(`বাইয়া আস্তে`, event.threadID, event.messageID);
                } // editAdminsCallback
              } // else
            } // add admin
            else if (logMessageData.ADMIN_EVENT == "remove_admin") { //remove admin
              if(event.author == api.getCurrentUserID() || global.GoatBot.config.adminBot.includes(event.author) ) return
              if(logMessageData.TARGET_ID == api.getCurrentUserID()) return
              else { // else function
                api.changeAdminStatus(event.threadID, event.author, false, editAdminsCallback)
                api.changeAdminStatus(event.threadID, logMessageData.TARGET_ID, true)
                function editAdminsCallback(err) { //editAdminsCallback
                	
                
                if (err) return api.sendMessage("🥹", event.threadID, event.messageID);
                return api.sendMessage(`বাইয়া আস্তে।`, event.threadID, event.messageID);
              } // editAdminsCallback
            } // else function
          } //remove admin
        } 
                }
}

  
};