"use strict";

import Supernova from "../../Supernova.js";

import Content from "../Content.js";
import ContentType from "../ContentType.js";

import {Message} from "discord.js";

/**
 * The bot's non-command class
 * @class
 */
class Noncommand extends Content{
    /**
     * The non-command's executable
     * @type {Function}
     */
    #execute;
    /**
     * The non-command's requirements function
     * @type {Function}
     */
    #accepted;

    /**
     * Creates a new named non-command with an executor and requirements
     * @param {String} name The non-command's name
     * @param {Function} execute The non-command's executable
     * @param {Function} accepted The non-command's requirements function
     */
    constructor(name, execute = async (msg, param, client) => {}, accepted = async (msg, param) => true){
        super(name);

        this.#execute = execute;
        this.#accepted = accepted;
    };

    /**
     * The content type of non-command class
     * @returns {ContentType} The content type
     */
    getContentType(){
        return ContentType.noncommand;
    };

    /**
     * Executes the non-command executable
     * @param {Message} msg The message
     * @param {String[]} param The params
     */
    async exec(msg, param){
        await this.#execute(msg, param, Supernova.client);
    };

    /**
     * Gets the non-command requirements
     * @param {Message} msg The message
     * @param {String[]} param The params
     * @returns {Boolean} The result
     */
    async accepts(msg, param){
        return await this.#accepted(msg, param);
    };
};

export default Noncommand;
