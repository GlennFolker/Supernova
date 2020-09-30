"use strict";

const fs = require("fs");

class SetupHandler{
	constructor(){};
	
	set(server, key, val){
		fs.readFile("setup.json", "utf8", (e, data) => {
			if(e){
				console.error(e);
			}else{
				data = JSON.parse(data);
				
				let config = this.findConfig(this.findSetup(server, data), key);
				config.val = val;
				
				fs.writeFile("setup.json", JSON.stringify(data), "utf8", e => {
					if(e){
						console.error(e);
					};
				});
			};
		});
	};
	
	findSetup(server, data){
		let tgtServer = null;
		
		data.servers.forEach(srvr => {
			if(srvr.id == server.id) tgtServer = srvr;
		});
		
		if(tgtServer == null){
			let srvr = {
				id: server.id,
				setup: []
			};
			
			data.servers.push(srvr);
			
			return srvr.setup;
		}else{
			return tgtServer.setup;
		};
	};
	
	findConfig(setup, name){
		let tgtConfig = null;
		
		setup.forEach(config => {
			if(config.name == name) tgtConfig = config;
		});
		
		if(tgtConfig == null){
			let config = {
				name: name,
				val: undefined
			};
			
			setup.push(config);
			
			return config;
		}else{
			return tgtConfig;
		};
	};
};

globalThis.SetupHandler = SetupHandler;
