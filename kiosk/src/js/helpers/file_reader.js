'use strict';

const fs = require('fs');

class FileReader {

    static readFile(filePath) {
        let lines = '';
        if (fs.existsSync(filePath)) {
            lines = fs.readFileSync(filePath, 'utf8');
        }
        return lines;
    }
}

module.exports = FileReader;