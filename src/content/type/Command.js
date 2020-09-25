"use strict";

class Command extends globalThis.Content{
	#execute;
	
	params = [];
	
	description = null;
	adminOnly = false;
	
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
	
	class CommandParam{
		#base;
		
		#optional = false;
		
		constructor(base, optional){
			this.#base = base;
			this.#optional = optional;
		};
	};
};

globalThis.Command = Command;
