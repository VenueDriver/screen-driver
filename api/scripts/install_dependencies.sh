#!/usr/bin/env bash

installDynamodb() {
    serverless dynamodb install --stage dev | grep -v "^$"
}

setSymbolicLinks() {
    cd node_modules
    rm lib || true
    ln -sf ../../lib ./
    cd ../
}

setAwsEnvironmentVariables() {
    serverless export-env --stage dev
}

cd services/
cd auth-service/ && npm install && installDynamodb && setSymbolicLinks && setAwsEnvironmentVariables &
    cd content-management-service/ && npm install && installDynamodb && setSymbolicLinks && setAwsEnvironmentVariables &
    cd maintenance-service/ && npm install && installDynamodb && setSymbolicLinks && setAwsEnvironmentVariables &
wait


rm -rf node_modules || true
cp -R content-management-service/node_modules ./
rm node_modules/lib || true
