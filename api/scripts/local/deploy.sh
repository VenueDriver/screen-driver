#!/usr/bin/env bash

region="${1:-us-east-1}"
stage="${2:-staging}"


echo Deploying to stage ${stage} and ${region} region ...

removeSymlink() {
    if [ -d "node_modules" ]; then
        cd node_modules
        rm lib || true
        cd ../
    fi
}

restoreSymlink() {
    if [ -d "node_modules" ]; then
        cd node_modules
        rm -rf lib || true
        ln -sf ../../lib ./
        cd ../
    fi
}

prepareLibToDeploy() {
    if [ -d "node_modules" ]; then
        cp -r ../lib ./node_modules/lib
    fi
}

deploy() {
    removeSymlink
    prepareLibToDeploy
    serverless deploy --verbose --region ${region} --stage ${stage}
    restoreSymlink
}

cd services/shared-resources-service
deploy

cd ../auth-service
deploy &

cd ../maintenance-service
deploy &

cd ../content-management-service
deploy