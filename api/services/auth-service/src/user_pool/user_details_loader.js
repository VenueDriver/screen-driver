'use strict';

const awsCli = require('aws-cli-js');
const Aws = awsCli.Aws;
const UserPoolHelper = require('./user_pool_helper');

class UserDetailsLoader {

    static loadUserByUsername(username) {
        let aws = new Aws();
        let userPoolData = UserPoolHelper.buildUserPoolData();
        let command = `cognito-idp admin-get-user --user-pool-id ${userPoolData.UserPoolId} --username ${username}`;
        return new Promise((resolve, reject) => aws.command(command, (err, data) => {
            err ? reject(err) : resolve(data.object);
        }));
    }
}

module.exports = UserDetailsLoader;
