'use strict';
const Screen = require('./screen');

const uuid = require('uuid');

class ScreenGroup {
    constructor(group) {
        if (group) {
            this.id = group.id;
            this.name = group.name;
            this.screens = this.extractScreensInstances(group.screens);
            return;
        }
        this.screens = [];
    }

    extractScreensInstances(screens) {
        if (!screens) return [];
        return screens.map(screen => new Screen(screen));
    }

    validate() {
        if (!this.name || this.name === '') throw new Error('Screen group couldn\'t be without name');

        this.screens.forEach(screen => {
            screen.validate();
            validateScreenNamesUniqueness(this.screens, screen);
        });

        function validateScreenNamesUniqueness(allScreeens, screen) {
            let matches = 0;
            allScreeens.forEach(element => {
                if (screen.name === element.name) matches++;
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
            if (!screen.id) screen.generateId();
        });
    };
}

module.exports = ScreenGroup;
