"use strict";

import ContentList from "./content/ContentList.js";

/**
 * A core class used as a reference to other class objects or other static variables
 * @class
 */
class Vars{
    /**
     * Main URL path to Supernova's GitHub repository
     * @static
     * @type {String}
    */
    static githubURL = "https://github.com/GlennFolker/Supernova/tree/master/";
    /**
     * Main URL path to Supernova's raw GitHub repository
     * @static
     * @type {String}
     */
    static githubURLRaw = "https://raw.githubusercontent.com/GlennFolker/Supernova/master/";
    /**
     * URL path to Mechanical Warfare mod's GitHub repository
     * @static
     * @type {String}
     */
    static mwGithubURL = "https://github.com/JerichoFletcher/mechanical-warfare/tree/master/";
    /**
     * URL path to Mechanical Warfare mod's raw GitHub repository
     * @static
     * @type {String}
     */
    static mwGithubURLRaw = "https://raw.githubusercontent.com/JerichoFletcher/mechanical-warfare/master/";

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
