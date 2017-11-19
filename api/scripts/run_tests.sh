#!/usr/bin/env bash

service_name="${1}"

if [ -d "services/${service_name}" ]; then
  cd services/${service_name}
fi

npm run db &

sleep 5
output="$(serverless invoke test --stage test --color=always)"
echo "${output}"

echo "${output}" | grep 'passing'
passing=$?

echo "${output}" | grep 'failing'
failing=$?

if [ $passing -eq 0 ] && [ $failing -ne 0 ]; then
    exit 0
else
    exit 1
fi
