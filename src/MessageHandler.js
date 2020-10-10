"use strict";

import Config from "./Config.js";
import Supernova from "./Supernova.js";
import Vars from "./Vars.js";

import ContentType from "./content/ContentType.js";
import {GuildMember, Message} from "discord.js";

import Command from "./content/type/Command.js";
import Noncommand from "./content/type/Noncommand.js";

/**
 * The bot's message handler class
 * @class
*/
class MessageHandler{
    /**
     * The bot's command list
     * @type {Command[]}
    */
    commands;
    /**
     * The bot's noncommand list
     * @type {Noncommand[]}
    */
    noncommands;

    /** Creates a new instance of MessageHandler class and initializes the bot's client event handlers */
    constructor(){
        Supernova.client.on("message", async msg => {
            if(!msg.guild) return;
            if(msg.author == msg.guild.me.user) return;

            if(msg.content.startsWith(Config.prefix)){
                let args = msg.content.slice(Config.prefix.length).trim().split(/ +/);
                let cmd = args.shift().toLowerCase();

                let processed = [];

                let multiWord = false;
                let level = 0;
                let i = 0;

                args.forEach(arg => {
                    let tmp = [];

                    for(let i = 0; i < arg.length; i++){
                        let letter = arg.charAt(i);
                        let enclosing = Config.multiWord;

                        let shouldPush = true;

                        switch(letter){
                            case enclosing[0][0]:
                                if(level < 1){
                                    shouldPush = false;
                                };
                                level++;

                                break;

                            case enclosing[1][0]:
                                level--;
                                if(level < 1){
                                    shouldPush = false;
                                };

                                break;
                        };

                        if(shouldPush){
                            tmp[tmp.length] = letter;
                        };
                    };

                    if(level > 0 && multiWord == false){
                        multiWord = true;
                    };

                    arg = tmp.join("");

                    if(multiWord){
                        if(typeof(processed[i]) === "undefined") processed[i] = "";

                        if(processed[i].length > 0) processed[i] += " ";
                        processed[i] += arg;
                    }else{
                        processed[i] = arg;

                        i++;
                    };

                    if(level < 1 && multiWord == true){
                        multiWord = false;

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
                    if(
                        toExec.adminOnly && !msg.member.hasPermission("ADMINISTRATOR") ||
                        toExec.ownerOnly && msg.author.id !== msg.guild.owner.id
                    ){
                        let embed = new Supernova.discord.MessageEmbed();
                        embed.setColor("FF0066");
                        embed.setTitle("Lack of Necessary Permissions");
                        embed.setURL(`${Vars.githubURL}src/content/list/Commands.js`);
                        embed.setDescription(`Who are you again, peasant? Wanting me to execute \`${toExec.getName()}\` command?`);
                        embed.setThumbnail(msg.guild.me.user.displayAvatarURL({dynamic: true}));
                        embed.setTimestamp();

                        await msg.channel.send(embed);
                    }else{
                        try{
                            await toExec.exec(msg, args);
                        }catch(e){
                            console.error(e);

                            let embed = new Supernova.discord.MessageEmbed();
                            embed.setColor("FF0066");
                            embed.setTitle("Error");
                            embed.setDescription(`Error while trying to execute \`${toExec.getName()}\` command.`);
                            embed.setThumbnail(msg.guild.me.user.displayAvatarURL({dynamic: true}));
                            embed.setTimestamp();

                            await msg.channel.send(embed);
                        };
                    };
                }else{
                    let embed = new Supernova.discord.MessageEmbed();
                    embed.setColor("FF0066");
                    embed.setTitle("Invalid Command");
                    embed.setURL(`${Vars.githubURL}src/content/list/Commands.js`);
                    embed.setDescription(`There is either no command such as \`${cmd}\` or you just don't have the permission to view said command, imbecile.`);
                    embed.setThumbnail(msg.guild.me.user.displayAvatarURL({dynamic: true}));
                    embed.setTimestamp();

                    await msg.channel.send(embed);
                };
            }else{
                let args = msg.content.trim().split(/ +/);

                let toExec = [];

                for(let i = 0; i < this.noncommands.length; i++){
                    let noncommand = this.noncommands[i];
                    let accept = await noncommand.accepts(msg, args);

                    if(accept) toExec.push(noncommand);
                };

                for(let i = 0; i < toExec.length; i++){
                    await toExec[i].exec(msg, args);
                };
            };
        });

        Supernova.client.on("messageDelete", async msg => {
            try{
                if(!msg.guild) return;
                if(msg.content.startsWith(Config.prefix)) return;

                let msgChannelID = Supernova.stpHandler.get(msg.guild, "msg-channel-id");

                if(typeof(msgChannelID) !== "undefined"){
                    let messagesChannel = msg.guild.channels.cache.get(msgChannelID);

                    if(typeof(messagesChannel) !== "undefined"){
                        if(msg.content.length < 1) return;

                        let embed = new Supernova.discord.MessageEmbed();
                        embed.setColor("FF0066");
                        embed.setTitle("Message Deletion");
                        embed.setDescription("Successfully logged deleted message");
                        embed.setAuthor(msg.author.tag, msg.author.displayAvatarURL({dynamic: true}));
                        embed.addField(`Message by ${msg.author.tag} deleted in #${msg.channel.name}`, msg.content);
                        embed.setThumbnail(msg.guild.me.user.displayAvatarURL({dynamic: true}));
                        embed.setTimestamp();
                        embed.setFooter(`Message ID: ${msg.id}`, msg.author.displayAvatarURL({dynamic: true}));

                        await messagesChannel.send(embed);
                    };
                };
            }catch(e){
                console.error(e);
            };
        });
    };

    /** Initializes things for the message handler itself */
    init(){
        this.commands = Vars.content.getBy(ContentType.command);
        this.noncommands = Vars.content.getBy(ContentType.noncommand);
    };

    /**
     * Gets a guild member from a mention
     * @param {Message} msg The Message
     * @param {String} mention Mention string
     * @returns {GuildMember} The mentioned member
     */
    async parseMention(msg, mention){
        try{
            if(!mention) return;

            if(mention.startsWith("<@") && mention.endsWith(">")){
                mention = mention.slice(2, -1);

                if(mention.startsWith("!")){
                    mention = mention.slice(1);
                };

                let mentioned;

                let fetched = await msg.guild.members.fetch(mention);
                await fetched.then(m => mentioned = m);

                return mentioned;
            }
        }catch(e){
            console.error(e);
        };
    }
};

export default MessageHandler;
