"use strict";

class MessageHandler{
	commands;
	
	constructor(client, discord){
		client.on("message", msg => {
			if(msg.author == msg.guild.me.user) return;
			
			if(msg.content.startsWith(globalThis.Config.prefix)){
				let args = msg.content.slice(globalThis.Config.prefix.length).trim().split(/ +/);
				let cmd = args.shift().toLowerCase();
				
				let processed = [];
				
				let insideQuote = false;
				let level = 0;
				let i = 0;
				
				args.forEach(arg => {
					if(arg == "{"){
						level++;
					}else if(arg == "}"){
						level--;
					};
					
					if(level > 0 && insideQuote == false){
						insideQuote = true;
						
						return;
					}else if(level < 1 && insideQuote == true){
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
						let source = "https://github.com/GlennFolker/Supernova/tree/master/";
						
						let embed = new discord.MessageEmbed();
						embed.setColor("FF0066");
						embed.setTitle("Lack of Necessary Permissions");
						embed.setURL(source + "src/content/list/Commands.js");
						embed.setDescription("Who are you again, peasant? Wanting me to execute \`" + toExec.getName() + "\` command?");
						embed.setThumbnail(msg.guild.me.user.displayAvatarURL({dynamic: true}));
						embed.setTimestamp();
						
						msg.channel.send(embed);
					}else{
						try{
							toExec.exec(msg, args);
						}catch(e){
							console.error(e);
							
							let embed = new discord.MessageEmbed();
							embed.setColor("FF0066");
							embed.setTitle("Error");
							embed.setDescription("Error while trying to execute to execute \`" + toExec.getName() + "\` command.");
							embed.setThumbnail(msg.guild.me.user.displayAvatarURL({dynamic: true}));
							embed.setTimestamp();
							
							msg.channel.send(embed);
						};
					};
				}else{
					let source = "https://github.com/GlennFolker/Supernova/tree/master/";
					
					let embed = new discord.MessageEmbed();
					embed.setColor("FF0066");
					embed.setTitle("Invalid Command");
					embed.setURL(source + "src/content/list/Commands.js");
					embed.setDescription("There is either no command such as \`" + cmd + "\` or you just don\'t have the permission to view said command, imbecile.");
					embed.setThumbnail(msg.guild.me.user.displayAvatarURL({dynamic: true}));
					embed.setTimestamp();
					
					msg.channel.send(embed);
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
