"use strict";

import Supernova from "../../Supernova.js";

import Content from "../Content.js";
import ContentType from "../ContentType.js";

class Noncommand extends Content{
    #execute;
    #accepted;

    constructor(name, execute = async (msg, param, client) => {}, accepted = async (msg, param) => true){
        super(name);

        this.#execute = execute;
        this.#accepted = accepted;
    };

    getContentType(){
        return ContentType.noncommand;
    };

    async exec(msg, param){
        await this.#execute(msg, param, Supernova.client);
    };

    async accepts(msg, param){
        return await this.#accepted(msg, param);
    };
};

export default Noncommand;
