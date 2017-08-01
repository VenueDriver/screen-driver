FROM joakimbeng/java-node

CMD cd ..
ADD package.json /app-src/
ADD package-lock.json /app-src/
WORKDIR /app-src

RUN npm install -g serverless && npm install

ADD . /app-src/
RUN sls dynamodb install --stage test
ENV PATH ./node_modules/.bin:$PATH
CMD sls offline start --noEnvironment --host 0.0.0.0 --stage test
