'use strict';

const uuid = require('uuid');

class Screen {
    constructor(screen) {
        if (screen) {
            this.id = screen.id;
            this.name = screen.name;
        }
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
