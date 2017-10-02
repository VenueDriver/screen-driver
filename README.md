# ScreenDriver

##### [AWS Lambda](api/README.md)

##### [Web app](web/README.md)

##### [Kiosk app](kiosk/README.md)


`config` folder contains current configuration for the screens. 
Remove it after deploy a serverless part of the app 


The following environment variables are setup for CI/CD:
#### AWS
* AWS_REGION=
* AWS_SECRET_ACCESS_KEY=
* AWS_ACCESS_KEY_ID=
* AWS_DEFAULT_REGION=
* AWS_S3_BUCKET_PRODUCTION=
* AWS_S3_BUCKET_STAGING=
* AWS_S3_BUCKET_KIOSK_PRODUCTION=
* AWS_S3_BUCKET_KIOSK_STAGING=

#### Endpoints
* STAGING_API_ENDPOINT=
* PRODUCTION_API_ENDPOINT=

#### Pusher
* PUSHER_APP_ID=
* PUSHER_KEY=
* PUSHER_SECRET=
* PUSHER_CLUSTER=