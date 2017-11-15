FROM node:6.10

WORKDIR /app-src

RUN npm install --global @angular/cli@1.5.0

ADD package.json .
ADD package-lock.json .

RUN npm install

ENV PATH ./node_modules/.bin:$PATH

ADD . /app-src/

CMD sh scripts/build.sh
