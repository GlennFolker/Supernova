"use strict";

class Supernova{
	static discord = require("discord.js");
	static client = new this.discord.Client();
	
	static msgHandler;
	static stpHandler;
	
	static main(){
		try{
			require("./Config");
			require("./Vars");

			require("./SetupHandler");
			require("./MessageHandler");

			this.client.on("ready", () => {
				globalThis.Vars.init();
				this.stpHandler = new globalThis.SetupHandler();
				this.msgHandler = new globalThis.MessageHandler();

				this.stpHandler.init();
				this.msgHandler.init();

				this.client.user.setActivity(globalThis.Config.prefix + "help", {type: "LISTENING"});

				console.log(globalThis);
			});

			this.client.login(globalThis.Config.token);
		}catch(e){
			console.error(e);

			process.exit();
		};
	};
};

globalThis.Supernova = Supernova;

Supernova.main();
