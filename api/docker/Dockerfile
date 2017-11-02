FROM codeship_serverless as deps

CMD cd ..
WORKDIR /app-src
ADD . /app-src/

COPY --from=deps deps/node_modules services/content-management-service/node_modules
COPY --from=deps deps/node_modules services/auth-service/node_modules
COPY --from=deps deps/node_modules services/maintenance-service/node_modules
COPY --from=deps deps/node_modules services/node_modules

RUN npm install -g serverless
RUN cd $(npm root -g)/npm && \
    npm install fs-extra && \
    sed -i -e s/graceful-fs/fs-extra/ -e s/fs.rename/fs.move/ ./lib/utils/rename.js

RUN cd services/content-management-service && npm install
RUN cd services/auth-service && npm install
RUN cd services/maintenance-service && npm install
