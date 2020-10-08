"use strict";

import Noncommand from "../type/Noncommand.js";

/**
 * The bot's non-command list class
 * @class
*/
class Noncommands{
    /**
     * Reacts with "🥖" whenever a message contains either "baguette", "baget", "bread", "france", or "french"
     * @type {Noncommand}
     */
    static baguette;

    constructor(){};

    /** Initializes all non-commands */
    init(){
        this.baguette = new Noncommand("baguette", async (msg, param, client) => {
            await msg.react("🥖");
        }, async (msg, param) => {
            let res = false;

            let wordTable = [
                "baguette",
                "baget",
                "bread",
                "france",
                "french"
            ];

            wordTable.forEach(word => {
                if(msg.content.toLowerCase().includes(word)){
                    res = true;
                };
            });

            return res;
        });
    };
};

export default Noncommands;
