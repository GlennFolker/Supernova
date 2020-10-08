"use strict";

/**
 * All listed content types
 * @type {Object}
*/
const ContentType = {
    /**
     * Command's content type
     * @type {Number}
     */
    command: 0,
    /**
     * Non-command's content type
     * @type {Number}
     */
    noncommand: 1,

    /**
     * Gets all content type
     * @returns {ContentType[]} All listed content types
     */
    get all(){
        return [
            this.command,
            this.noncommand
        ];
    }
};

Object.freeze(ContentType);

export default ContentType;
