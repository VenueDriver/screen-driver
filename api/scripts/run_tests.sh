#!/usr/bin/env bash

service="${1}"

cd services/${service}

serverless dynamodb start --stage test &> /dev/null &

sleep 5
serverless invoke test --stage test
