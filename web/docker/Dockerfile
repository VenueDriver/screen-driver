FROM node:6.10

CMD cd ..
ADD . /app-src/
WORKDIR /app-src

RUN npm install
ENV PATH ./node_modules/.bin:$PATH

RUN ng build --prod --aot

#CMD sed -i 's@API_HOST@'"$API_HOST"'@' src/environments/environment.prod.ts && \
    #node_modules/.bin/ng build --prod --aot --no-sourcemap && \
    #cp -r dist/* /app-dist/
