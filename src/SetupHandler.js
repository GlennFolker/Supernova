"use strict";

const fs = require("fs");

class SetupHandler{
	#setup;
	
	constructor(){
		this.#setup = {
			servers: []
		};
	};
	
	init(){
		fs.readFile("setup.json", "utf8", (e, data) => {
			if(e){
				console.error(e);
			}else{
				this.#setup = JSON.parse(data);
			};
		});
	};
	
	set(server, key, val){
		fs.readFile("setup.json", "utf8", (e, data) => {
			if(e){
				console.error(e);
			}else{
				this.#setup = JSON.parse(data);
				
				let config = this.findConfig(this.findSetup(server, this.#setup), key);
				config.val = val;
				
				fs.writeFile("setup.json", JSON.stringify(this.#setup), "utf8", ex => {
					if(ex){
						console.error(ex);
					};
				});
			};
		});
	};
	
	get(server, key){
		let config = this.findConfig(this.findSetup(server, this.#setup), key);
		
		fs.writeFile("setup.json", JSON.stringify(this.#setup), "utf8", e => {
			if(e){
				console.error(e);
			};
		});
		
		return config.val;
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
