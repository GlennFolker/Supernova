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
		for(let i = 0; i < this.params.length; i++){
			if(!this.params[i].isAccepted(param[i])){
				msg.reply("the command\'s parameter index \"" + i + "\" doesn\'t accept \"" + param[i] + "\".");
				
				let cur = "";
				let j = 0;
				
				this.params.forEach(param => {
					
				});
				
				return;
			};
		};
		
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
		
		isAccepted(param){
			if(this.#accepted.length < 1 || this.#optional) return true;
			
			let res = false;
			
			this.#accepted.forEach(accept => {
				if(accept == param) res = true;
			});
			
			return res;
		};
	};
};

globalThis.Command = Command;
