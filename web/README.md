# ScreenDriver web app

## Development server

Perform `npm start` to run app locally. Navigate to `http://localhost:4200/`.
Perform `npm run prod` to run app in prod mode.

## Build project

##### Using Docker:

1. `docker build -f docker/Dockerfile.deps -t deps-image .`
1. `docker run --rm dist-image`
1. `docker build -f docker/Dockerfile.build -t build-image`
1. `docker run --rm -v "<output directory>:/app-dist" -e API_HOST=<URL to API> build-image`

##### Using NPM
Or run `npm run build`. If do it by this way do not forget to specify `API_HOST` in `src/environments/environment.prod.ts` file.  
The build artifacts will be stored in the `dist/` directory.
