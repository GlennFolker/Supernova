"use strict";

class Noncommand extends globalThis.Content{
    #execute;
    #accepted;

    constructor(name, execute = (msg, param, client) => {}, accepted = (msg, param) => true){
        super(name);

        this.#execute = execute;
        this.#accepted = accepted;
    };

    getContentType(){
        return globalThis.ContentType.noncommand;
    };

    exec(msg, param){
        this.#execute(msg, param, globalThis.Supernova.client);
    };

    accepts(msg, param){
        return this.#accepted(msg, param);
    };
};

globalThis.Noncommand = Noncommand;
