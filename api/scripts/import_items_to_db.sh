#!/usr/bin/env bash

file_with_items="db_items/${1}"
db_port="${2}"

if [ -e ${file_with_items} ]; then
    aws configure set region us-east-1
    sleep 10

    echo Importing items from ${file_with_items} file to data base on port ${db_port} ...

    aws dynamodb batch-write-item --request-items file://${file_with_items} --endpoint-url http://localhost:${db_port}
else
    echo Skip items importing to data base on port ${db_port}
fi
