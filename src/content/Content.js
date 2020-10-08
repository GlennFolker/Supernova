"use strict";

import Vars from "../Vars.js";

import ContentType from "./ContentType.js";

/**
 * The bot's content class. Must inherit
 * @abstract
 * @class
 */
class Content{
    /**
     * The content's name
     * @type {String}
     */
    #name;
    /**
     * The content's ID
     * @type {Number}
     */
    #id;

    /**
     * Creates a new named content. Do not use directly
     * @param {String} name The content's name
     */
    constructor(name){
        if(this.constructor != Content){
            this.#name = name;
            this.#id = Vars.content.getBy(this.getContentType()).length;

            Vars.content.handleContent(this);
        }else{
            throw new Error("Cannot instantiate abstract class");
        };
    };

    /**
     * Gets the content's name
     * @returns {String} The content's name
     */
    getName(){
        return this.#name;
    };

    /**
     * Gets the content's ID
     * @returns {Number} The content's ID
     */
    getID(){
        return this.#id;
    };

    /**
     * Gets the content type of the content
     * @returns {ContentType} The content type
     */
    getContentType(){
        throw new Error("Did not extend abstract method");
    };
};

export default Content;
