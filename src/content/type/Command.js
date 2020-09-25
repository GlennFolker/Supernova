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
	
	static CommandParam = class CommandParam{
		#name;
		#optional = false;
		
		constructor(name, optional){
			this.#name = name;
			this.#optional = optional;
		};
		
		getName(){
			return this.#name;
		};
		
		isOptional(){
			return this.#optional;
		};
	};
};

globalThis.Command = Command;
