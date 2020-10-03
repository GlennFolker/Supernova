"use strict";

require("./ContentType");

require("./Content");
require("./type/Command");
require("./type/Noncommand");

require("./list/Commands");
require("./list/Noncommands");

class ContentList{
	#content;
	#list;
	
	constructor(){
		this.#content = [];
		this.#list = [];
	};
	
	init(){
		for(const type of globalThis.ContentType.all){
			this.#content[type] = [];
		};
		
		this.#list.push(
			new globalThis.Commands(),
			new globalThis.Noncommands()
		);
		
		this.#list.forEach(list => list.init());
	};
	
	handleContent(content){
		this.#content[content.getContentType()].forEach(c => {
			if(c.getName() == content.getName()) throw new Error("Two of more contents cannot have the same name");
		});
		
		this.#content[content.getContentType()].push(content);
	};
	
	getBy(type){
		return this.#content[type];
	};
	
	getByName(type, name){
		let res = null;
		
		this.#content[type].forEach(c => {
			if(c.getName() == name) res = c;
		});
		
		return res;
	};
	
	getByID(type, id){
		let res = null;
		
		this.#content[type].forEach(c => {
			if(c.getID() == id) res = c;
		});
		
		return res;
	};
};

globalThis.ContentList = ContentList;
