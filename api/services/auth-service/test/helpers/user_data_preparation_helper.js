'use strict';

const uuid = require('uuid');

module.exports = class UserDataPreparationHelper {

    static createDefaultUser() {
        return {
            email: this.getDefaultEmail(),
            password: this.getDefaultPassword(),
        };
    }

    static createUpdatedUser() {
        return {
            email: this.getDefaultEmail(),
            password: this.getDefaultPassword(),
            _rev: 0
        };
    }

    static getDefaultEmail() {
        return "test_mail@testmail.com";
    }

    static getEmailWithoutAtSymbol() {
        return "test_mail.testmail.com";
    }

    static getEmailWithTldStartedWithDot() {
        return "test_mail@.testmail.com";
    }

    static getEmailWithoutCharactersBeforeAtSymbol() {
        return "@testmail.com";
    }

    static getEmailWithNotValidTld() {
        return "test_mail@testmail.c";
    }

    static getEmailStartedWithDot() {
        return ".test_mail@testmail.com";
    }

    static getEmailWithUnexpectedSymbols() {
        return "test_mail*()@testmail.com";
    }

    static getEmailWithDoubleDots() {
        return "test..mail@testmail.com";
    }

    static getDefaultPassword() {
        return "qwerty123";
    }

    static getShortPassword() {
        return "12345";
    }

    static getCognitoUserWithAttributes() {
        return {
            Attributes: [
                {Name: 'sub', Value: 'CognitoUserSub'}
            ]
        }
    }
};
