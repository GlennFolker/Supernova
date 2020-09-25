"use strict";

class Commands{
	static help;
	
	constructor(){};
	
	init(){
		this.help = new globalThis.Command("help", (msg, param, client) => {
			let commands = globalThis.Vars.content.getBy(globalThis.ContentType.command);
			
			if(param.length < 1){
				let result = "";
				
				commands.forEach(command => {
					result += "_";
					
					result += globalThis.Config.prefix + "**" + command.getName() + "**";
					
					command.params.forEach(param => {
						let optional = param.isOptional();
						
						result += " " + (optional ? "[" : "<") + param.getName() + (optional ? "]" : ">");
					});
					
					result += "_";
					
					if(command.description != null){
						result += " - " + command.description;
					};
				});
				
				let embed = new globalThis.Supernova.discord.MessageEmbed();
				embed.addField("Command List: ", result, true);
				embed.setColor("00BBFF");
				
				msg.channel.send(embed);
			}else{
				param = param.shift();
				
				let result = "";
				let selectedCmd = null;
				
				commands.forEach(command => {
					if(command.getName() == param) selectedCmd = command;
				});
				
				if(selectedCmd != null){
					result += "Usage: \n_"
					
					result += globalThis.Config.prefix + "**" + selectedCmd.getName() + "**";
					
					selectedCmd.params.forEach(param => {
						let optional = param.isOptional();
						
						result += " " + (optional ? "[" : "<") + param.getName() + (optional ? "]" : ">");
					});
					
					result += "_";
					
					if(selectedCmd.description != null){
						result += " - " + selectedCmd.description;
					};
					
					let embed = new globalThis.Supernova.discord.MessageEmbed();
					embed.addField(globalThis.Config.prefix + param, result, true);
					embed.setColor("00BBFF");
					
					msg.channel.send(embed);
				}else{
					msg.reply("there is no such command as " + param + ", imbecile.");
				};
			};
		});
		this.help.description = "Shows this monologue or explains other commands if supplied another inputs.";
		this.help.params[0] = new globalThis.Command.CommandParam("command", true);
	};
};

globalThis.Commands = Commands;
