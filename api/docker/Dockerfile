FROM codeship/screendriver_serverless:latest

WORKDIR ..
ADD . /app-src/

RUN cp -r deps/node_modules app-src/services/content-management-service/
RUN cp -r deps/node_modules app-src/services/auth-service/
RUN cp -r deps/node_modules app-src/services/maintenance-service/
RUN cp -r deps/node_modules app-src/services/

WORKDIR /app-src

RUN npm install -g serverless

RUN cd services/content-management-service && npm install
RUN cd services/auth-service && npm install
RUN cd services/maintenance-service && npm install
