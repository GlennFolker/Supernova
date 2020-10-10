"use strict";

import fetch from "node-fetch";
import HJSON from "hjson";

/**
 * Class used for listing all GitHub repositories with the tag #mindustry-mod
 * @class
 */
class ModList{
    /**
     * The internal mod list
     * @type {Object[]}
     */
    #list;

    /**
     * Creates a new instance of the mod lister and initializes the list
     */
    constructor(){
        this.#list = [];
    };

    /** Re-initializes the list to update the mods */
    async update(){
        this.#list = [];

        let list = await fetch("https://api.github.com/search/repositories?q=mindustry%20mod/").then(response => {
            return response.json();
        }).catch(e => {
            console.error(e);
        });

        list.items.forEach(async mod => {
            if(mod.full_name === "Anuken/ExampleMod") return;

            let src = mod.html_url.replace("github.com", "raw.githubusercontent.com");
            let raw;

            let errored = false;

            let hjson = false;
            raw = await fetch(`${src}/master/mod.json`).then(async response => {
                let json = await response.json();

                return json;
            }).catch(e => hjson = true);

            if(hjson){
                raw = await fetch(`${src}/master/mod.hjson`).then(async response => {
                    let text = await response.text();

                    return HJSON.parse(text);
                }).catch(e => errored = true);
            };

            if(!errored && typeof(raw.name) !== "undefined"){
                this.#list.push(mod);
            };
        });

        this.sort();
    };

    /**
     * Gets a mod info from the mod's name and author
     * @param {String} fullname The mod's name; format is Author/Repository
     * @returns {Object} The mod
     */
    get(fullname){
        let res;

        this.#list.forEach(mod => {
            if(mod.full_name.toLowerCase() === fullname.toLowerCase()) res = mod;
        });

        return res;
    };

    /**
     * Gets the whole mod list
     */
    getAll(){
        return this.#list;
    };

    /**
     * Sorts the list by the given option. Defaults to last updated
     * @param {String} option The option that will be used for sorting
     */
    sort(option = "stargazers_count"){
        switch(option){
            case "created_at":
                this.#list.sort((a, b) => {
                    return new Date(a[option]) - new Date(b[option]);
                });
                break;

            case "pushed_at":
                this.#list.sort((a, b) => {
                    return new Date(a[option]) - new Date(b[option]);
                });
                break;

            default:
                this.#list.sort((a, b) => {
                    return a[option] - b[option];
                });
                break;
        };
    };

    /**
     * Removes [#color] from string values
     * @param {Object} mod The mod
     * @returns {Object} The processed mod
     */
    parseString(mod){
        let processed = mod;

        Object.keys(processed).forEach(key => {
            let value = processed[key];

            if(typeof(value) === "string"){
                let result = [];
                let i = 0;

                let level = 0;
                let shouldPush = true;

                for(let j = 0; j < value.length; j++){
                    let letter = value.charAt(j);

                    switch(letter){
                        case "[":
                            level++;

                            break;
                        case "]":
                            level--;

                            break;
                    };

                    if(level > 0){
                        shouldPush = false;
                    };

                    if(shouldPush){
                        result[i] = letter;

                        i++;
                    };

                    if(level < 1){
                        shouldPush = true;
                    };
                };

                processed[key] = result.join("");
            };
        });

        return processed;
    };
};

export default ModList;
