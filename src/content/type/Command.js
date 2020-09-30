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
				let result = "\`" + this.getName() + "\` command\'s parameter index \`" + i + "\` doesn\'t accept \`" + param[i] + "\`.";
				
				result += "\n\nReserved parameters:\n"
				
				for(let j = 0; j < this.params.length; j++){
					let accepted = this.params[j].getAccepted();
					
					if(accepted.length > 0){
						result += "\`" + j + "\`: ";
						
						for(let k = 0; k < accepted.length; k++){
							result += "\`" + accepted[k] + "\`";
							result += k < accepted.length - 1 ? ", " : "."
						};
						
						result += "\n";
					};
				};
				
				let embed = new globalThis.Supernova.discord.MessageEmbed();
				embed.addField("Invalid parameters", result);
				embed.setColor("FF0066");
				
				msg.channel.send(embed);
				
				return;
			};
		};
		
		this.#execute(msg, param, globalThis.Supernova.client);
	};
	
	static CommandParam = class CommandParam{
		#name;
		#optional = false;
		#accepted = [];
		
		constructor(name, optional, accepted = []){
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
		
		getAccepted(){
			return this.#accepted;
		};
	};
};

globalThis.Command = Command;
