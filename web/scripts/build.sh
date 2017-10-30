#!/usr/bin/env bash

cd src/environments
echo "Set up $API_HOST as host URL"
sed -i 's@API_HOST@'"$API_HOST"'@' environment.prod.ts
cd ../../

ng build --prod --aot --no-sourcemap
