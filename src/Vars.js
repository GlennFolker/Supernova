"use strict";

require("./content/ContentList");

class Vars{
	static content;
	
	static init(){
		this.content = new globalThis.ContentList();
		
		this.content.init();
	};
};

globalThis.Vars = Vars;
