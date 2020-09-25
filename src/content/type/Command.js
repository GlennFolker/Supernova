"use strict";

class Command extends globalThis.Content{
	#execute;
	
	constructor(name, execute){
		super(name);
		
		this.#execute = execute;
	};
	
	getContentType(){
		return globalThis.ContentType.command;
	};
	
	exec(msg, param){
		this.#execute(msg, param, globalThis.Supernova.client);
	};
};

globalThis.Command = Command;
