"use strict";

import Supernova from "../../Supernova.js";

import Content from "../Content.js";
import ContentType from "../ContentType.js";

import {Message} from "discord.js";

/**
 * The bot's command class
 * @class
*/
class Command extends Content{
    /**
     * The command's executable
     * @type {Function}
     */
    #execute;

    /**
     * The command's parameters
     * @type {Command.CommandParam[]}
     */
    params = [];

    /**
     * The command's description. Can be null
     * @type {String}
     */
    description = null;
    /**
     * Wether this command can only be executed by admins
     * @type {Boolean}
     */
    adminOnly = false;
    /**
     * Wether this command can only be executed by server owner
     * @type {Boolean}
     */
    ownerOnly = false;

    /**
     * Creates a new named command with an executor
     * @param {String} name The command's name
     * @param {Function} execute The command's executable
     */
    constructor(name, execute = async (msg, param, client) => {}){
        super(name);

        this.#execute = execute;
    };

    /**
     * The content type of command class
     * @returns {ContentType} The content type
     */
    getContentType(){
        return ContentType.command;
    };

    /**
     * Executes the command's executable
     * @param {Message} msg The message
     * @param {String[]} param The params
     */
    async exec(msg, param){
        for(let i = 0; i < this.params.length; i++){
            if(!this.params[i].isAccepted(param[i])){
                let description = `\`${this.getName()}\` command's parameter index \`${i}\` doesn't accept \`${param[i]}\`.`;

                let result = ``;

                for(let j = 0; j < this.params.length; j++){
                    let accepted = this.params[j].getAccepted();

                    if(accepted.length > 0){
                        result += `\`${j}\`: `;

                        for(let k = 0; k < accepted.length; k++){
                            result += `\`${accepted[k]}\`${k < accepted.length - 1 ? "," : "."}`;
                        };

                        result += `\n`;
                    };
                };

                let embed = new Supernova.discord.MessageEmbed();
                embed.setColor("FF0066");
                embed.setTitle("Invalid Parameters");
                embed.setDescription(description);
                embed.setThumbnail(msg.guild.me.user.displayAvatarURL({dynamic: true}));
                embed.addField("Reserved Parameters:", result);
                embed.setTimestamp();

                await msg.channel.send(embed);

                return;
            };
        };

        await this.#execute(msg, param, Supernova.client);
    };

    /**
     * The command's param's class
     * @class
     */
    static CommandParam = class CommandParam{
        /**
         * The param's name
         * @type {String}
         */
        #name;
        /**
         * Wether this param is optional
         * @type {Boolean}
         */
        #optional = false;
        /**
         * The whitelisted words of this param. Accepts everything if length == 0
         * @type {String[]}
         */
        #accepted = [];

        /**
         * Creates a new command param
         * @param {String} name The param's name
         * @param {Boolean} optional Wether this param is optional
         * @param {String[]} accepted The whitelisted keywords of this param. Accepts everything if length == 0
         */
        constructor(name, optional, accepted = []){
            this.#name = name;
            this.#optional = optional;
            this.#accepted = accepted;
        };

        /**
         * Gets the param's name
         * @returns {String} The param's name
         */
        getName(){
            return this.#name;
        };

        /**
         * Wether this param is optional
         * @returns {Boolean} The optional value
         */
        isOptional(){
            return this.#optional;
        };

        /**
         * Wether this param accepts the given keyword
         * @param {String} param The keyword
         */
        isAccepted(param){
            if(this.#accepted.length < 1 || (this.#optional && typeof(param) === "undefined")) return true;

            let res = false;

            this.#accepted.forEach(accept => {
                if(accept == param) res = true;
            });

            return res;
        };

        /**
         * Gets the whitelisted keywords
         * @returns {String[]} The whitelisted keywords
         */
        getAccepted(){
            return this.#accepted;
        };
    };
};

export default Command;
