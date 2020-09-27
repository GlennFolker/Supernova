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
		#accepted = [];
		
		constructor(name, optional, accepted){
			this.#name = name;
			this.#optional = optional;
			this.#accepted = accepted;
		};
		
		getName(){
			return this.#name;
		};
		
		isOptional(){
			return this.#optional;
		};
		
		isAccepted(){
			return this.#accepted;
		};
	};
};

globalThis.Command = Command;
