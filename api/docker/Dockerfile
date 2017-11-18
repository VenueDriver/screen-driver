FROM codeship/screendriver_serverless:latest

WORKDIR ..
ADD . /app-src/

RUN cp -r dynamodb/node_modules app-src/services/content-management-service/ && \
    cp -r dynamodb/node_modules app-src/services/auth-service/ && \
    cp -r dynamodb/node_modules app-src/services/maintenance-service/

WORKDIR /app-src

RUN cd services/content-management-service && npm install
RUN cp -r services/lib services/content-management-service/node_modules/lib

RUN cd services/auth-service && npm install
RUN cp -r services/lib services/auth-service/node_modules/lib

RUN cd services/maintenance-service && npm install
RUN cp -r services/lib services/maintenance-service/node_modules/lib
