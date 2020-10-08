"use strict";

import fs from "fs";

import {Guild} from "discord.js";

/**
 * The bot's server setup handler class
 * @class
 */
class SetupHandler{
    /**
     * Internal setup object
     * @private
     * @type {object}
     */
    #setup;

    /** Initializes setup handler for servers */
    constructor(){
        this.#setup = {
            servers: []
        };
    };

    /** Initializes the internal setup object */
    init(){
        fs.readFile("setup.json", "utf8", (e, data) => {
            if(e){
                console.error(e);
            }else{
                this.#setup = JSON.parse(data);
            };
        });
    };

    /**
     * Sets the given value of given key in the given server
     * @param {Guild} server The server
     * @param {String} key The setup's key
     * @param {String} val The setup's value
     */
    set(server, key, val){
        fs.readFile("setup.json", "utf8", (e, data) => {
            if(e){
                console.error(e);
            }else{
                this.#setup = JSON.parse(data);

                let config = this.findConfig(this.findSetup(server, this.#setup), key);
                config.val = val;

                writeFile("setup.json", JSON.stringify(this.#setup), "utf8", ex => {
                    if(ex){
                        console.error(ex);
                    };
                });
            };
        });
    };

    /**
     * Gets the given key in the given server
     * @param {Guild} server The server
     * @param {String} key The setup's key
     * @returns {String} The returned value
     */
    get(server, key){
        let config = this.findConfig(this.findSetup(server, this.#setup), key);

        fs.writeFile("setup.json", JSON.stringify(this.#setup), "utf8", e => {
            if(e){
                console.error(e);
            };
        });

        return config.val;
    };

    /**
     * Finds the server's setup in the given data.
     * If not found, it will create a new setup, appends it to the given data, and returns it
     * @private
     * @param {Guild} server The server
     * @param {object} data The setup data
     * @returns {object} The server's setup
     */
    findSetup(server, data){
        let tgtServer = null;

        data.servers.forEach(srvr => {
            if(srvr.id == server.id) tgtServer = srvr;
        });

        if(tgtServer == null){
            let srvr = {
                id: server.id,
                setup: []
            };

            data.servers.push(srvr);

            return srvr.setup;
        }else{
            return tgtServer.setup;
        };
    };

    /**
     * Finds the setup's configuration in the given setup.
     * If not found, it will create a new configuration, appends it to the given setup, and returns is
     * @param {object} setup The setup data
     * @param {string} name The configuration's name
     * @returns {object} The setup's configuration
     */
    findConfig(setup, name){
        let tgtConfig = null;

        setup.forEach(config => {
            if(config.name == name) tgtConfig = config;
        });

        if(tgtConfig == null){
            let config = {
                name: name,
                val: undefined
            };

            setup.push(config);

            return config;
        }else{
            return tgtConfig;
        };
    };
};

export default SetupHandler;
