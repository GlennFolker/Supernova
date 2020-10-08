"use strict";

import Vars from "../Vars.js";

class Content{
	#name;
	#id;
	
	constructor(name){
		if(this.constructor != Content){
			this.#name = name;
			this.#id = Vars.content.getBy(this.getContentType()).length;
			
			Vars.content.handleContent(this);
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

export default Content;
