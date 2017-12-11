'use strict';

const uuid = require('uuid');

class Screen {
    constructor(group) {
        if (group) {
            this.id = group.id;
            this.name = group.name;
            return;
        }
        this.screens = [];
    }

    validate() {
        if (!this.name) {
            throw Error("Screen couldn\'t be without name")
        }

    };

    generateId() {
        if (!this.id)
            this.id = uuid.v1();
    };

}


module.exports = Screen;
