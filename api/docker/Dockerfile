FROM codeship/screendriver_serverless:latest

WORKDIR ..
ADD . /app-src/

RUN cp -r deps/node_modules app-src/services/content-management-service/ && \
    cp -r deps/node_modules app-src/services/auth-service/ && \
    cp -r deps/node_modules app-src/services/maintenance-service/ && \
    cp -r deps/node_modules app-src/services/

WORKDIR /app-src

RUN cd services/content-management-service && npm install
RUN cd services/auth-service && npm install
RUN cd services/maintenance-service && npm install
