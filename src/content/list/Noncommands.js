"use strict";

import Noncommand from "../type/Noncommand.js";

class Noncommands{
    static baguette;

    constructor(){};

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
