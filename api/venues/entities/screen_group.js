'use strict';

const uuid = require('uuid');

class ScreenGroup {
    constructor(group) {
        if (group) {
            this.id = group.id;
            this.name = group.name;
            this.screens = group.screens ? group.screens : [];
            return;
        }
        this.screens = [];
        this._rev = 0;
    }

    validate() {
        if (!this.name || this.name == '') throw new Error('Screen group couldn\'t be without name');

        this.screens.forEach(screen => {
            validateScreenNamesUniqueness(this.screens, screen);
            if (!screen.name) {
                throw Error("Screen couldn\'t be without name")
            }
        });

        function validateScreenNamesUniqueness(allScreeens, screen) {
            let matches = 0;
            allScreeens.forEach(element => {
                if (screen.name == element.name) matches++;
            });
            if (matches > 1) {
                throw new Error('Screens should have unique names');
            }
        }
    };

    generateId() {
        if (!this.id)
            this.id = uuid.v1();
    };

    generateIdForScreens() {
        this.screens.forEach(screen => {
            if (!screen.id) screen.id = uuid.v1()
        });
    };
}

module.exports = ScreenGroup;
