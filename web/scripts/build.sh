#!/usr/bin/env bash

cd src/environments
cp environment.prod.ts environment.prod.ts.tmp
sed -i 's@API_HOST@'"$API_HOST"'@' environment.prod.ts
cat environment.prod.ts
cd ../../

ng build --prod --aot --no-sourcemap

cd src/environments
cp environment.prod.ts.tmp environment.prod.ts
rm environment.prod.ts.tmp
cat environment.prod.ts
