FROM electronuserland/electron-builder:wine

CMD cd ..
ADD package.json /app-src/
ADD package-lock.json /app-src/
WORKDIR /app-src

RUN npm install -g electron && npm install

ADD . /app-src/

# Mount app-dist directory is expected
CMD npm run win-installer && cp -r dist/* /app-dist/
