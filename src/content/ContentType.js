"use strict";

const ContentType = {
	command: 0,
	
	get all(){
		return [
			this.command
		];
	},
	
	name(num){
		var res = null;
		
		Object.keys(this).forEach(type => {
			if(this[type] == num) res = type;
		});
		
		return res;
	}
};

globalThis.ContentType = ContentType;
