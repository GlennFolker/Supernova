"use strict";

import Supernova from "../../Supernova.js";
import Config from "../../Config.js";
import Vars from "../../Vars.js";

import ContentType from "../ContentType.js";

import Command from "../type/Command.js";

class Commands{
    static help;
    static setup;
    static say;
    static func;

    constructor(){};

    init(){
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

        this.func = new Command("func", async (msg, param, client) => {
            let func = new Function("msg", "param", "supernova", param[0]);

            await func(msg, param);
            await msg.reply("function execution is finished.");
        });
        this.func.ownerOnly = true;
        this.func.description = "Executes a function supplied with `msg` and `param`.";
        this.func.params[0] = new Command.CommandParam("code", false);
    };
};

export default Commands;
