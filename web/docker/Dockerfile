FROM node:6.10 AS deps

ADD package.json .
ADD package-lock.json .

RUN npm install


FROM node:6.10

CMD cd ..

WORKDIR /app-src
COPY --from=deps node_modules node_modules
ENV PATH ./node_modules/.bin:$PATH

ADD . /app-src/

CMD sh scripts/build.sh
