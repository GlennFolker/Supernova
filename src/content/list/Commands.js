"use strict";

class Commands{
	static help;
	
	constructor(){};
	
	init(){
		this.help = new globalThis.Command("help", (msg, param, client) => {
			
		});
	};
};

globalThis.Commands = Commands;
