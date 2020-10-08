"use strict";

import ContentList from "./content/ContentList.js";

/**
 * A core class used as a reference to other class objects or other static variables
 */
class Vars{
    /**
     * Main URL path to Supernova's GitHub repository
     * @static
     * @type {String}
    */
    static githubURL = "https://github.com/GlennFolker/Supernova/";

    /**
     * Content lister for getting things related to content types
     * @static
     * @type {ContentList}
    */
    static content;

    /**
     * One-time initialization function
     * @static
    */
    static init(){
        this.content = new ContentList();

        this.content.init();
    };
};

export default Vars;
