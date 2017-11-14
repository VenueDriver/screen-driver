# ScreenDriver web app

## Development server

Perform `npm install` and `npm start` to run app locally. Navigate to [http://localhost:4200/](http://localhost:4200/).
Perform `npm run prod` to run app in prod mode.

#### Using Docker
Perform `docker-compose up web` from the root folder of the project.

## Build project

Run `npm run build`. If do it by this way do not forget to substitute `API_HOST` placeholder with real API URL in `src/environments/environment.prod.ts` file.  
The build artifacts will be placed in the `dist/` directory.

#### Using Docker

Run `docker-compose -f docker-compose-deployment.yml up build_web`. 
Host URL should be specified in the `development.env` file.

## Deploy to S3

Install AWS CLI (`apt-get install awscli`) and run the following command: 
`aws s3 sync <folder with dists> <S3 bucket name>`.

#### Using Docker

Run `docker-compose -f docker-compose-deployment.yml up deploy_web`. 
S3 bucket should be specified in the `development.env` file.
