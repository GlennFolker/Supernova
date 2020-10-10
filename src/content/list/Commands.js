"use strict";

import fetch from "node-fetch";
import HJSON from "hjson";

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
     * The bot's "mods" command
     * @type {Command}
     */
    static mods;
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

        this.mods = new Command("mods", async (msg, param, client) => {
            if(typeof(param[0]) !== "undefined"){
                Supernova.modList.sort(param[0]);
            }else{
                Supernova.modList.sort();
            };

            let mods = Supernova.modList.getAll();
            mods = mods.slice(Math.max(mods.length - 20, 0));

            let embed = new Supernova.discord.MessageEmbed();
            embed.setColor("00BBFF");
            embed.setTitle("Mindustry Mods");
            embed.setURL("https://github.com/topics/mindustry-mod/");
            embed.setDescription("Currently listed sorted mods");
            embed.setTimestamp();

            for(let i = 0; i < 20; i++){
                let mod = mods[i];
                let src = mod.html_url.replace("github.com", "raw.githubusercontent.com");
                let raw;

                let hjson = false;
                raw = await fetch(`${src}/master/mod.json`).then(async response => {
                    let json = await response.json();

                    return json;
                }).catch(e => {
                    hjson = true;
                });

                if(hjson){
                    raw = await fetch(`${src}/mod.hjson`).then(async response => {
                        let string = await response.text();

                        return HJSON.parse(string);
                    }).catch(e => {
                        console.log(`${mod.full_name} couldn't be put into the embed message.`);
                        console.error(e);
                    });
                };

                if(typeof(raw.name) === "undefined") continue;

                raw = Supernova.modList.parseString(raw);

                let res = `${mod.stargazers_count}☆ | ${mod.forks_count}⑂ ${typeof(mod.subscribers_count) !== "undefined" ? `| ${mod.subscribers_count}👁` : ""}\n\n`;

                if(typeof(raw.description !== "undefined")){
                    res += `${raw.description}\n`;
                };

                if(typeof(raw.version) !== "undefined"){
                    res += `**Version**: _${raw.version}_\n`;
                };

                if(typeof(raw.minGameVersion) !== "undefined"){
                    res += `**Minimum game version**: _${raw.minGameVersion}_\n`;
                };

                res += `**Created at**: ${new Date(mod.created_at).toUTCString()}\n`;
                res += `**Last updated**: ${new Date(mod.pushed_at).toUTCString()}\n\n`;

                embed.addField(mod.full_name, res);
            };

            await msg.author.send(embed);
            await msg.react("👍");
        });
        this.mods.description = "DM's you 20 mindustry mods sorted by given option.";
        this.mods.params[0] = new Command.CommandParam("option", true, [
            "created_at",
            "pushed_at",

            "stargazers_count",
            "forks_count"
        ]);

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
