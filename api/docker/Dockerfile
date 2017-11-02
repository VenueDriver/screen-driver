FROM cdornbusch/docker-java-node:6.x

CMD cd ..
WORKDIR /app-src
ADD . /app-src/

RUN npm install -g serverless
RUN cd $(npm root -g)/npm &&  npm install fs-extra && sed -i -e s/graceful-fs/fs-extra/ -e s/fs.rename/fs.move/ ./lib/utils/rename.js
RUN cd services/auth-service && npm install
RUN cd services/content-management-service && npm install
RUN cd services/maintenance-service && npm install


#RUN sls dynamodb install --stage test
#ENV PATH ./node_modules/.bin:$PATH
#CMD sls offline start --noEnvironment --host 0.0.0.0 --stage test
