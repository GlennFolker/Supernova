"use strict";

require("./Config");
require("./Vars");
require("./MessageHandler");

class Supernova{
	static discord = require("discord.js");
	static client = new this.discord.Client();
	
	static handler;
	
	static main(){
		this.client.on("ready", () => {
			globalThis.Vars.init();
			this.handler = new globalThis.MessageHandler(this.client);
			
			this.handler.init();
			
			this.client.user.setActivity(globalThis.Config.prefix + "help", {type: "LISTENING"});
			
			console.log(globalThis);
		});
		
		this.client.login(globalThis.Config.token);
	};
};

Supernova.main();

globalThis.Supernova = Supernova;
