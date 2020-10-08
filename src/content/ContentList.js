"use strict";

import ContentType from "./ContentType.js";

import Content from "./Content.js";

import Commands from "./list/Commands.js";
import Noncommands from "./list/Noncommands.js";

/**
 * Class for listing content objects
 * @class
*/
class ContentList{
    /**
     * Array of content type based array of content objects
     * @type {Content[][]}
    */
    #content;
    /**
     * Array of content type lists
     * @type {Content[]}
     */
    #list;

    /** Creates a new content lister object */
    constructor(){
        this.#content = [];
        this.#list = [];
    };

    /** Initializes content type lists */
    init(){
        for(const type of ContentType.all){
            this.#content[type] = [];
        };

        this.#list.push(
            new Commands(),
            new Noncommands()
        );

        this.#list.forEach(list => list.init());
    };

    /**
     * Puts a content object into the content list
     * @param {Content} content The content object that will be put into the list
     */
    handleContent(content){
        this.#content[content.getContentType()].forEach(c => {
            if(c.getName() == content.getName()) throw new Error("Two of more contents cannot have the same name");
        });

        this.#content[content.getContentType()].push(content);
    };

    /**
     * Gets a content type list of the given content type
     * @param {ContentType} type
     * @returns {Content[]} The content type list
     */
    getBy(type){
        return this.#content[type];
    };

    /**
     * Gets a content by the given content type and name
     * @param {ContentType} type The content type
     * @param {String} name The content's name
     * @returns {Content} The content
     */
    getByName(type, name){
        let res = null;

        this.#content[type].forEach(c => {
            if(c.getName() == name) res = c;
        });

        return res;
    };

    /**
     * Gets a content by the given content type and ID
     * @param {ContentType} type The content type
     * @param {Number} id The content's ID
     * @returns {Content} The content
     */
    getByID(type, id){
        let res = null;

        this.#content[type].forEach(c => {
            if(c.getID() == id) res = c;
        });

        return res;
    };
};

export default ContentList;
