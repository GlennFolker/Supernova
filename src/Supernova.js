"use strict";

import Config from "./Config.js";
import Vars from "./Vars.js";

import SetupHandler from "./SetupHandler.js";
import MessageHandler from "./MessageHandler.js";

import Discord from "discord.js";

/**
 * The main bot's class. Initializes everything on bot startup
 * @class
*/
class Supernova{
    /**
     * Discord package required for the bot to run
     * @type {Discord}
    */
    static discord = Discord;
    /**
     * The bot's client
     * @type {Discord.Client}
    */
    static client = new Discord.Client();

    /**
     * The bot's message handler
     * @type {MessageHandler}
    */
    static msgHandler;
    /**
     * The bot's setup handler
     * @type {SetupHandler}
    */
    static stpHandler;

    /** The main function that runs on bot startup */
    static main(){
        try{
            this.client.on("ready", () => {
                Vars.init();

                this.stpHandler = new SetupHandler();
                this.msgHandler = new MessageHandler();

                this.stpHandler.init();
                this.msgHandler.init();

                this.client.user.setActivity(`${Config.prefix}help`, {type: "LISTENING"});

                console.log("Supernova has been launched!");
            });

            this.client.login(Config.token);
        }catch(e){
            console.error(e);

            process.exit();
        };
    };
};

export default Supernova;

Supernova.main();
