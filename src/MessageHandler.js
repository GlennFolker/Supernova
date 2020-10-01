"use strict";

class MessageHandler{
	commands;
	
	constructor(client, discord){
		client.on("message", msg => {
			if(msg.content.startsWith(globalThis.Config.prefix)){
				let args = msg.content.slice(globalThis.Config.prefix.length).trim().split(/ +/);
				let cmd = args.shift().toLowerCase();
				
				let processed = [];
				
				let insideQuote = false;
				let i = 0;
				
				args.forEach(arg => {
					if(arg == "{"){
						insideQuote = true;
						
						return;
					}else if(arg == "}"){
						insideQuote = false;
						
						return;
					};
					
					if(insideQuote){
						if(typeof(processed[i]) === "undefined") processed[i] = "";
						
						if(processed[i].length > 0) processed[i] += " ";
						processed[i] += arg;
					}else{
						processed.push(arg);
						
						i++;
					};
				});
				
				args = processed;
				
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
		
		client.on("messageDelete", async msg => {
			if(!msg.guild) return;
			
			let fetched = await msg.guild.fetchAuditLogs({
				limit: 1,
				type: "MESSAGE_DELETE"
			});
			
			let deletion = fetched.entries.first();
			if(!deletion) return;
			
			let {executor, target} = deletion;
			
			if(target.id == msg.author.id){
				let embed = new discord.MessageEmbed();
				
			};
		});
	};
	
	init(){
		this.commands = globalThis.Vars.content.getBy(globalThis.ContentType.command);
	};
	
	async parseMention(msg, mention, client){
		if(!mention) return;
		
		if(mention.startsWith("<@") && mention.endsWith(">")){
			mention = mention.slice(2, -1);
			
			if(mention.startsWith("!")){
				mention = mention.slice(1);
			};
			
			let mentioned;
			
			await msg.guild.members.fetch(mention).then(m => {
				mentioned = m;
			}).catch(e => {
				console.error(e);
			});
			
			return mentioned;
		}
	};
};

globalThis.MessageHandler = MessageHandler;
