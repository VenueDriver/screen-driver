FROM node:6.10

RUN npm install --global @angular/cli@1.2.6

WORKDIR /app-src

ADD package.json .
ADD package-lock.json .

RUN npm install

ENV PATH ./node_modules/.bin:$PATH

ADD . /app-src/

CMD sh scripts/build.sh
