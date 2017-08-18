FROM electronuserland/electron-builder:wine

CMD cd ..
ADD . /app-src/
WORKDIR /app-src

RUN npm install -g electron && npm install
ENV PATH ../node_modules/.bin:$PATH

# Mount app-dist directory is expected
CMD npm run win-installer && cp -r dist/* /app-dist/
