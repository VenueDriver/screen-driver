#!/usr/bin/env bash
npm run db &> /dev/null &

sleep 3
sls invoke test --stage test
