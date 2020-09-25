"use strict";

class Content{
	static #lastID = 0;
	
	#name;
	#id;
	
	constructor(name){
		if(this.constructor != Content){
			this.#name = name;
			this.#id = Content.#lastID++;
			
			globalThis.Vars.content.handleContent(this);
		}else{
			throw new Error("Cannot instantiate abstract class");
		};
	};
	
	getName(){
		return this.#name;
	};
	
	getID(){
		return this.#id;
	};
	
	getContentType(){
		throw new Error("Did not extend abstract method");
	};
};

globalThis.Content = Content;
