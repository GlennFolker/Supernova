"use strict";

class MessageHandler{
	commands;
	
	constructor(client){
		client.on("message", msg => {
			if(msg.content.startsWith(globalThis.Config.prefix)){
				let args = msg.content.slice(globalThis.Config.prefix.length).trim().split(/ +/);
				let cmd = args.shift().toLowerCase();
				
				let toExec = null;
				
				this.commands.forEach(command => {
					if(command.getName() == cmd){
						toExec = command;
					};
				});
				
				if(toExec != null){
					if(toExec.adminOnly && !msg.member.hasPermission("ADMINISTRATOR")){
						msg.reply("who are you again, peasant?");
					}else{
						try{
							toExec.exec(msg, args);
						}catch(e){
							console.error(e);
							
							msg.reply("error while trying to execute command \"" + toExec.getName() + "\".");
						};
					};
				};
			};
		});
	};
	
	init(){
		this.commands = globalThis.Vars.content.getBy(globalThis.ContentType.command);
	};
};

globalThis.MessageHandler = MessageHandler;
