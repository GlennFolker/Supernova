"use strict";

const fs = require("fs");

class Commands{
	static help;
	static setup;
	static say;
	
	constructor(){};
	
	init(){
		this.help = new globalThis.Command("help", (msg, param, client) => {
			let commands = globalThis.Vars.content.getBy(globalThis.ContentType.command);
			
			if(param.length < 1){
				let result = "";
				
				commands.forEach(command => {
					if(command.adminOnly && !msg.member.hasPermission("ADMINISTRATOR")) return;
					
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
					
					result += "\n"
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
				
				if(selectedCmd != null && (!selectedCmd.adminOnly || msg.member.hasPermission("ADMINISTRATOR"))){
					if(selectedCmd.description != null){
						result += selectedCmd.description + " \n";
					};
					
					result += "Usage: \n_"
					
					result += globalThis.Config.prefix + "**" + selectedCmd.getName() + "**";
					
					selectedCmd.params.forEach(param => {
						let optional = param.isOptional();
						
						result += " " + (optional ? "[" : "<") + param.getName() + (optional ? "]" : ">");
					});
					
					result += "_";
					
					let embed = new globalThis.Supernova.discord.MessageEmbed();
					embed.addField(globalThis.Config.prefix + param, result, true);
					embed.setColor("00BBFF");
					
					msg.channel.send(embed);
				}else{
					msg.reply("there is either no command such as " + param + " or you just don\'t have the permission to view said command, imbecile.");
				};
			};
		});
		this.help.description = "Shows this monologue or explains other commands if supplied another inputs.";
		this.help.params[0] = new globalThis.Command.CommandParam("command", true);
		
		this.setup = new globalThis.Command("setup", (msg, param, client) => {
			let key = param[0];
			let val = param[1];
			
			globalThis.Supernova.stpHandler.set(msg.guild, key, val);
			
			msg.reply("\"" + key + "\" in this server is now \"" + val + "\".");
		});
		this.setup.adminOnly = true;
		this.setup.description = "Configures things for this server.";
		this.setup.params[0] = new globalThis.Command.CommandParam("type", false, [
			"mod-channel-id"
		]);
		this.setup.params[1] = new globalThis.Command.CommandParam("value", false);
		
		this.say = new globalThis.Command("say", (msg, param, client) => {
			param = param.join(" ").split("[]#");
			
			let result = "";
			
			for(let i = 0; i < param.length; i++){
				if(i % 2 == 1){
					let emoji = msg.guild.emojis.cache.find(e => e.name == param[i]);
					
					result += emoji;
				}else{
					result += param[i];
				};
			};
			
			if(result.length > 0){
				msg.delete();
				msg.channel.send(result);
			};
		});
		this.say.adminOnly = true;
		this.say.description = "I will say the exact same thing.";
		this.say.params[0] = new globalThis.Command.CommandParam("phrase", false);
	};
};

globalThis.Commands = Commands;
