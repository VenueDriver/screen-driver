FROM joakimbeng/java-node

CMD cd ../..
WORKDIR /app-src
ADD services/content-management-service /app-src/content-management-service
ADD services/lib /app-src/lib

WORKDIR content-management-service
RUN npm install -g serverless
RUN npm install
RUN serverless dynamodb install --stage test
