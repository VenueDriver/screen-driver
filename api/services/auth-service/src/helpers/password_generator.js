'use strict';

const exec = require('child_process').exec;

module.exports.generate = () => {
    return new Promise((resolve, reject) => {
        exec('date +%s%N | md5sum | cut -d " " -f1', (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            if (stderr) {
                reject(stderr);
            }
            resolve(stdout.trim());
        });
    });
};
