"use strict";

class Commands{
	static help;
	
	constructor(){};
	
	init(){
		this.help = new globalThis.Command("help", (msg, param, client) => {
			if(param.length < 1){
				let commands = globalThis.Vars.content.getBy(globalThis.ContentType.command);
				
				commands.forEach(command => {});
			};
		});
		this.help.description = "Shows this monologue or explains other commands if supplied another inputs.";
	};
};

globalThis.Commands = Commands;
