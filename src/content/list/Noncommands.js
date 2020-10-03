"use strict";

class Noncommands{
    static baguette;

    constructor(){};

    init(){
        this.baguette = new globalThis.Noncommand("baguette", (msg, param, client) => {
            msg.react("🥖");
        }, (msg, param) => {
            let res = false;

            let tmp = (" " + msg.content).slice(1);

            let wordTable = [
                "baguette",
                "baget",
                "bread",
                "france",
                "french"
            ];

            wordTable.forEach(word => {
                if(tmp.includes(word)) res = true;
            });

            return res;
        });
    };
};

globalThis.Noncommands = Noncommands;
