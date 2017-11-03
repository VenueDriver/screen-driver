#!/usr/bin/env bash

service="${1}"

cd services/${service}

npm run db &> /dev/null &

sleep 5
sls invoke test --stage test
