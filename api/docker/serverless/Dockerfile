FROM joakimbeng/java-node

CMD cd ../..
WORKDIR /deps
ADD services/content-management-service/serverless.yml .
ADD services/content-management-service/serverless serverless
ADD services/content-management-service/package.json .
ADD services/content-management-service/package-lock.json .

RUN npm install -g serverless
RUN cd $(npm root -g)/npm && npm install fs-extra && sed -i -e s/graceful-fs/fs-extra/ -e s/fs.rename/fs.move/ ./lib/utils/rename.js
RUN npm install --only=dev
RUN npm install serverless
RUN serverless dynamodb install --stage dev
