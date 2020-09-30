"use strict";

require("./Config");
require("./Vars");

require("./MessageHandler");
require("./SetupHandler");

class Supernova{
	static discord = require("discord.js");
	static client = new this.discord.Client();
	
	static msgHandler;
	static stpHandler;
	
	static main(){
		this.client.on("ready", () => {
			globalThis.Vars.init();
			this.msgHandler = new globalThis.MessageHandler(this.client);
			this.stpHandler = new globalThis.SetupHandler();
			
			this.msgHandler.init();
			this.stpHandler.init();
			
			this.client.user.setActivity(globalThis.Config.prefix + "help", {type: "LISTENING"});
			
			console.log(globalThis);
		});
		
		this.client.login(globalThis.Config.token);
	};
};

Supernova.main();

globalThis.Supernova = Supernova;
