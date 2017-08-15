# ScreenDriver Serverless REST API

## Setup

1. ```npm install -g serverless```
1. ```npm i``` 

## Run project offline
###  Before:
1. Java Runtime Engine (JRE) version 6.x or newer should be installed ([serverless-dynamodb-local](https://www.npmjs.com/package/serverless-dynamodb-local#this-plugin-requires) plugin requirement)
1. Setup serverless-dynamodb-local plugin before start: ```sls dynamodb install``` 
1. Set environment variables:

  * `AWS_ACCESS_KEY_ID=any_key`
  * `AWS_SECRET_ACCESS_KEY=any_secret_key`
  * `PUSHER_APP_ID=<Pusher app ID>`
  * `PUSHER_KEY=<Pusher key>`
  * `PUSHER_SECRET=<Pusher secret>`
  * `PUSHER_CLUSTER=<Pusher cluster>`


Use ```npm start``` to run project locally.

## Deployment
###  Before:
Before run deploy commands, set environment variables to have access to AWS:
* ```export AWS_ACCESS_KEY_ID=<Your_AWS_access_key>```
* ```export AWS_SECRET_ACCESS_KEY=<Your_AWS_secret_access_key>```

or 

* `sls config credentials --provider aws --key <Your_AWS_access_key> --secret <Your_AWS_secret_access_key>` to save credentials in serverless configs

###  Deploy project:
Use ```npm run deploy``` to deploy project

###  Deploy a single function:
Use ```npm run deploy-function <function_name> ``` to deploy a single function


## Invoke remote function
To invoke remote function use:
* ```npm run invoke <function_name>```

To invoke with logging use ``-l`` flag (i.e. ```npm run invoke <function_name> -l```)

## Testing
You should have running dynamodb on port 8000. Run local dynamodb with migrations use:
* ```npm run db```

Use one of the following commands to start testing:
* ```npm test```
* ```sls invoke test --stage test```



## Resources
Used plugins:

* [serverless-offline](https://github.com/dherault/serverless-offline)
* [serverless-dynamodb-local](https://github.com/99xt/serverless-dynamodb-local)
* [serverless-dynamodb-client](https://github.com/99xt/serverless-dynamodb-client)
* [serverless-mocha-plugin](https://github.com/SC5/serverless-mocha-plugin)
