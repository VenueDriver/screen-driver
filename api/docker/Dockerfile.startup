FROM screendriver_serverless

ARG SERVICE

WORKDIR ../app-src
RUN mkdir $SERVICE
RUN cp -r ../deps/node_modules $SERVICE/node_modules
ADD services/$SERVICE /app-src/$SERVICE
ADD services/lib /app-src/lib
WORKDIR $SERVICE

RUN npm install
