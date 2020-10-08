"use strict";

const ContentType = {
	command: 0,
	noncommand: 1,

	get all(){
		return [
			this.command,
			this.noncommand
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

export default ContentType;
