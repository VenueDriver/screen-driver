FROM node:6.10

CMD cd ..
RUN mkdir app-src
ADD package.json /app-src
ADD package-lock.json /app-src

WORKDIR /app-src
RUN npm install
ENV PATH ./node_modules/.bin:$PATH

ADD . /app-src/

CMD sh scripts/build.sh
