"use strict";

import fetch from "node-fetch";
import got from "got";

import Supernova from "../../Supernova.js";
import Config from "../../Config.js";
import Vars from "../../Vars.js";

import ContentType from "../ContentType.js";

import Command from "../type/Command.js";

/**
 * The bot's command list class
 * @class
*/
class Commands{
    // user commands
    /**
     * The bot's "help" command
     * @type {Command}
     */
    static help;
    /**
     * The bot's "modinfo" command
     * @type {Command}
     */
    static modinfo;
    // end region

    // admin commands
    /**
     * The bot's "setup" command
     * @type {Command}
     */
    static setup;
    /**
     * The bot's "say" command
     * @type {Command}
     */
    static say;
    // end region

    // owner commands
    /**
     * The bot's "func" command
     * @type {Command}
     */
    static func;
    // end region

    constructor(){};

    /** Initializes all commands */
    init(){
        // user commands

        this.help = new Command("help", async (msg, param, client) => {
            let commands = Vars.content.getBy(ContentType.command);

            if(param.length < 1){
                let result = ``;

                commands.forEach(command => {
                    if(
                        command.adminOnly && !msg.member.hasPermission("ADMINISTRATOR") ||
                        command.ownerOnly && msg.author.id !== msg.guild.owner.id
                    ) return;

                    result += `_`;

                    result += `${Config.prefix}**${command.getName()}**`;

                    command.params.forEach(p => {
                        let optional = p.isOptional();

                        result += ` ${optional ? "[" : "<"}${p.getName()}${optional ? "]" : ">"}`;
                    });

                    result += `_`;

                    if(command.description != null){
                        result += ` - ${command.description}`;
                    };

                    result += `\n`
                });

                let embed = new Supernova.discord.MessageEmbed();
                embed.setColor("00BBFF");
                embed.setTitle("Supernova Commands");
                embed.setURL(`${Vars.githubURL}src/content/list/Commands.js`);
                embed.setDescription("Shows all available commands to execute");
                embed.setThumbnail(msg.guild.me.user.displayAvatarURL({dynamic: true}));
                embed.addField("Command List:", result, true);
                embed.setTimestamp();

                await msg.channel.send(embed);
            }else{
                param = param.shift();

                let result = ``;
                let selectedCmd = null;

                commands.forEach(command => {
                    if(command.getName() == param) selectedCmd = command;
                });

                if(selectedCmd != null && (!selectedCmd.adminOnly || msg.member.hasPermission("ADMINISTRATOR"))){
                    result += `_${Config.prefix}**${selectedCmd.getName()}**`;

                    selectedCmd.params.forEach(p => {
                        let optional = p.isOptional();

                        result += ` ${optional ? "[" : "<"}${p.getName()}${optional ? "]" : ">"}`;
                    });

                    result += `_`;

                    let embed = new Supernova.discord.MessageEmbed();
                    embed.setColor("00BBFF");
                    embed.setTitle(`"${selectedCmd.getName()}" Command`);
                    embed.setURL(`${Vars.githubURL}src/content/list/Commands.js`);
                    if(selectedCmd.description != null){
                        embed.setDescription(selectedCmd.description);
                    };
                    embed.setThumbnail(msg.guild.me.user.displayAvatarURL({dynamic: true}));
                    embed.addField("Usage:", result, true);
                    embed.setTimestamp();

                    await msg.channel.send(embed);
                }else{
                    let embed = new Supernova.discord.MessageEmbed();
                    embed.setColor("FF0066");
                    embed.setTitle("Invalid Command");
                    embed.setURL(`${Vars.githubURL}src/content/list/Commands.js`);
                    embed.setDescription(`There is either no command such as \`${param}\` or you just don't have the permission to view said command, imbecile.`);
                    embed.setThumbnail(msg.guild.me.user.displayAvatarURL({dynamic: true}));
                    embed.setTimestamp();

                    await msg.channel.send(embed);
                };
            };
        });
        this.help.description = "Shows this monologue or explains other commands if supplied another inputs.";
        this.help.params[0] = new Command.CommandParam("command", true);

        this.modinfo = new Command("modinfo", async (msg, param, client) => {
            msg.channel.send("Fetching mod data...");

            let mod = await fetch(`${Vars.mwGithubURLRaw}mod.json`).then(response => {
                return response.json();
            }).catch(e => {
                msg.reply("there was an error while trying to fetch mod data.");

                console.error(e);
            });

            if(!mod) return;

            let ghData = await got("https://api.github.com/repos/JerichoFletcher/mechanical-warfare").then(request => {
                return JSON.parse(request.body);
            }).catch(e => {
                console.error(e);
            });

            Object.keys(mod).forEach(key => {
                let value = mod[key];

                if(typeof(value) === "string"){
                    let result = [];
                    let i = 0;

                    let level = 0;
                    let shouldPush = true;

                    for(let j = 0; j < value.length; j++){
                        let letter = value.charAt(j);

                        switch(letter){
                            case "[":
                                level++;

                                break;
                            case "]":
                                level--;

                                break;
                        };

                        if(level > 0){
                            shouldPush = false;
                        };

                        if(shouldPush){
                            result[i] = letter;

                            i++;
                        };

                        if(level < 1){
                            shouldPush = true;
                        };
                    };

                    mod[key] = result.join("");
                };
            });

            let embed = new Supernova.discord.MessageEmbed();
            embed.setColor("FFBB00");
            embed.setTitle(mod.displayName);
            embed.setURL(Vars.mwGithubURL);
            embed.setDescription(mod.description);
            embed.setAuthor(ghData.owner.login, ghData.owner.avatar_url);
            embed.setThumbnail(`${Vars.mwGithubURLRaw}icon.png`);
            embed.addFields(
                {name: "Version:", value: mod.version},
                {name: "Minimum game version:", value: mod.minGameVersion},

                {name: "Created at:", value: new Date(ghData.created_at).toUTCString(), inline: true},
                {name: "Last updated:", value: new Date(ghData.pushed_at).toUTCString(), inline: true}
            );
            embed.setFooter(`${ghData.stargazers_count}☆ | ${ghData.forks_count}⑂ | ${ghData.subscribers_count}👁`, `${Vars.mwGithubURLRaw}icon.png`);

            await msg.channel.send(embed);
        });
        this.modinfo.description = "Informations about the Mechanical Warfare mod.";

        // end region

        // admin commands

        this.setup = new Command("setup", async (msg, param, client) => {
            let key = param[0];
            let val = param[1];

            if(typeof(val) !== "undefined"){
                Supernova.stpHandler.set(msg.guild, key, val);

                await msg.reply(`\`${key}\` in this server is now \`${val}\`.`);
            }else{
                val = Supernova.stpHandler.get(msg.guild, key);

                await msg.reply(`\`${key}\` in this server is currently \`${val}\`.`);
            };
        });
        this.setup.adminOnly = true;
        this.setup.description = "Configures things for this server.";
        this.setup.params[0] = new Command.CommandParam("type", false, [
            "mod-channel-id",
            "msg-channel-id"
        ]);
        this.setup.params[1] = new Command.CommandParam("value", true);

        this.say = new Command("say", async (msg, param, client) => {
            await msg.delete();
            await msg.channel.send(param);
        });
        this.say.adminOnly = true;
        this.say.description = "I will say the exact same thing.";
        this.say.params[0] = new Command.CommandParam("...phrase", false);

        // end region

        // owner commands

        this.func = new Command("func", async (msg, param, client) => {
            let func = new Function("msg", "param", "supernova", param[0]);

            await func(msg, param);
            await msg.reply("function execution is finished.");
        });
        this.func.ownerOnly = true;
        this.func.description = "Executes a function supplied with `msg` and `param`.";
        this.func.params[0] = new Command.CommandParam("code", false);

        this.shutdown = new Command("shutdown", async (msg, param, client) => {
            await msg.channel.send("Exited.");

            client.emit("exit", 1);
        });
        this.shutdown.adminOnly = true;
        this.shutdown.description = "Shuts down the bot. Just in case.";

        // end region
    };
};

export default Commands;
