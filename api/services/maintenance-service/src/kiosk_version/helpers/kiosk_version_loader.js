'use strict';

const dbHelper = require('../../helpers/db_helper');

class KioskVersionLoader {

    static getAllVersions() {
        return dbHelper.findAll(process.env.SCREENS_VERSIONS_TABLE)
    }
}

module.exports = KioskVersionLoader;
