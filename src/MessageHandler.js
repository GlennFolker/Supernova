"use strict";

class MessageHandler{
	commands;
	noncommands;
	
	constructor(){
		globalThis.Supernova.client.on("message", msg => {
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
						i++;
						
						return;
					};
					
					if(insideQuote){
						if(typeof(processed[i]) === "undefined") processed[i] = "";
						
						if(processed[i].length > 0) processed[i] += " ";
						processed[i] += arg;
					}else{
						processed[i] = arg;

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
						
						let embed = new globalThis.Supernova.discord.MessageEmbed();
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
							
							let embed = new globalThis.Supernova.discord.MessageEmbed();
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
					
					let embed = new globalThis.Supernova.discord.MessageEmbed();
					embed.setColor("FF0066");
					embed.setTitle("Invalid Command");
					embed.setURL(source + "src/content/list/Commands.js");
					embed.setDescription("There is either no command such as \`" + cmd + "\` or you just don\'t have the permission to view said command, imbecile.");
					embed.setThumbnail(msg.guild.me.user.displayAvatarURL({dynamic: true}));
					embed.setTimestamp();
					
					msg.channel.send(embed);
				};
			}else{
				let args = msg.content.trim().split(/ +/);

				let toExec = [];

				this.noncommands.forEach(noncommand => {
					if(noncommand.accepts(msg, args)) toExec.push(noncommand);
				});

				toExec.forEach(noncommand => noncommand.exec(msg, args));
			};
		});
		
		globalThis.Supernova.client.on("messageDelete", msg => {
			try{
				if(!msg.guild) return;

				let msgChannelID = globalThis.Supernova.stpHandler.get(msg.guild, "msg-channel-id");

				if(typeof(msgChannelID) !== "undefined"){
					let messagesChannel = msg.guild.channels.cache.get(msgChannelID);

					if(typeof(messagesChannel) !== "undefined"){
						if(msg.content.length < 1) return;

						let embed = new globalThis.Supernova.discord.MessageEmbed();
						embed.setColor("FF0066");
						embed.setTitle("Message Deletion");
						embed.setDescription("Successfully logged deleted message");
						embed.setAuthor(msg.author.tag, msg.author.displayAvatarURL({dynamic: true}));
						embed.addField("Message by " + msg.author.tag + " deleted in #" + msg.channel.name, msg.content);
						embed.setThumbnail(msg.guild.me.user.displayAvatarURL({dynamic: true}));
						embed.setTimestamp();
						embed.setFooter("Message ID: " + msg.id, msg.author.displayAvatarURL({dynamic: true}));
						
						messagesChannel.send(embed);
					};
				};
			}catch(e){
				console.error(e);
			};
		});
	};

	init(){
		this.commands = globalThis.Vars.content.getBy(globalThis.ContentType.command);
		this.noncommands = globalThis.Vars.content.getBy(globalThis.ContentType.noncommand);
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
