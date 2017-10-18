FROM joakimbeng/java-node

CMD cd ../..
WORKDIR /app-src
ADD services/auth-service /app-src/auth-service
ADD services/lib /app-src/lib

WORKDIR auth-service
RUN npm install -g serverless
RUN npm install
RUN serverless dynamodb install --stage test
