FROM joakimbeng/java-node

CMD cd ..
WORKDIR /app-src
ADD . /app-src/

RUN npm install -g serverless
RUN cd services/auth-service && npm install
RUN cd ../content-management-service && npm install


#RUN sls dynamodb install --stage test
#ENV PATH ./node_modules/.bin:$PATH
#CMD sls offline start --noEnvironment --host 0.0.0.0 --stage test
