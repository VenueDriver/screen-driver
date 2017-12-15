FROM node:alpine AS deps

ADD package.json .
ADD package-lock.json .

RUN npm install
ENV PATH ./node_modules/.bin:$PATH


FROM electronuserland/electron-builder:wine

WORKDIR ../app-src
COPY --from=deps node_modules node_modules
ADD . /app-src/

# Mount app-dist directory is expected
CMD sed -i 's@API_HOST@'"$API_HOST"'@' properties/app.properties && \
    npm run win-installer
