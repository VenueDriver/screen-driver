# ScreenDriver web app

## Development server

Perform `npm i` and `npm start` to run app locally. Navigate to [http://localhost:4200/](http://localhost:4200/).
Perform `npm run prod` to run app in prod mode.

## Build project

Run `npm run build`. If do it by this way do not forget to substitute `API_HOST` placeholder with real API URL in `src/environments/environment.prod.ts` file.  
The build artifacts will be placed in the `dist/` directory.

## Deploy to S3

Install AWS CLI (`apt-get install awscli`) and run the following command: 
`aws s3 sync <folder with dists> <S3 bucket name>`