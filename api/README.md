# ScreenDriver Serverless REST API

## Using Docker

### Setup

Install Docker and Docker Compose.

Create `development.env` file using `development.env.sample`.

Before running the project the serverless app should be deployed to the AWS with stage `dev`. 
Stage should be specified in the `development.env` file (`AWS_STAGE` variable).   

### Run project offline

To run project just perform `docker-compose up` from root folder of the project.

All serverless services and the web app will be ran. Services will be ran with stage `dev`.

### Deployment

To deploy the project just perform `docker-compose -f docker-compose-deploy.yml up`. 
Do not forget to specify correct AWS and Pusher credentials as well as region and stage in the `development.env` file.

You can skip deployment of the web app if you are going to deploy it by another way.

**Note.** For the first time the order of the services deployment to the stage is important. 
First of all the `shared resources` service should be deployed. The `content-management-service` should be deployed last. 
The rest of the services can be deployed without an order.

After first deployment, all services could be deployed without an order.

### Import items to DB tables
To import items to the DB tables on project startup add the following files to the `db_items` directory:
    * `content-management-service-items.json`
    * `maintenance-service-items.json`
File name corresponds to a service name to which items will be imported. Those file names are specified in `data_import` 
service in `docker-compose.yml`. The files format should be equal to the one described in 
[the documentation](http://docs.aws.amazon.com/cli/latest/reference/dynamodb/batch-write-item.html#options)

> Those files are not required.

### Add first user
After first deployment a user should be added to the Cognito User Pool.
For doing it perform `docker-compose -f docker-compose-deploy.yml up api_create_user`.

User pool ID and email of the user should be specified in the `development.env` file.

### Testing

To run tests just perform `docker-compose -f docker-compose-test.yml up`.

## Without Docker

### Setup

1. `npm install -g serverless` 
1. Java Runtime Engine (JRE) version 6.x or newer should be installed 
([serverless-dynamodb-local](https://www.npmjs.com/package/serverless-dynamodb-local#this-plugin-requires) plugin requirement)
1. Set up environment variables:
    * `AWS_ACCESS_KEY_ID=any_key`
    * `AWS_SECRET_ACCESS_KEY=any_secret_key`
    * `PUSHER_APP_ID=<Pusher app ID>`
    * `PUSHER_KEY=<Pusher key>`
    * `PUSHER_SECRET=<Pusher secret>`
    * `PUSHER_CLUSTER=<Pusher cluster>`
1. Perform  `./scripts/install_dependencies.sh` from `api/` folder to install npm modules, Dynamodb local, and to create symbolic links to shared code in `api/services/lib`

### Run project offline

1. Perform  `./scripts/run.sh` from `api/` folder to start all services locally.

### Deployment
#### Before:
Before run deploy commands, set environment variables to have access to the AWS:
* `AWS_ACCESS_KEY_ID=<Your_AWS_access_key>`
* `AWS_SECRET_ACCESS_KEY=<Your_AWS_secret_access_key>`

or 

* `serverless config credentials --provider aws --key <Your_AWS_access_key> --secret <Your_AWS_secret_access_key>` to save credentials in serverless configs

#### Deploy project:
Use `deploy.sh` script from `scripts` directory to deploy services.

#### Deploy a single function:
Use `npm run deploy-function <function_name>` to deploy a single function of a service

### Invoke remote function
To invoke remote function use:
* `npm run invoke <function_name> -l`

### Testing
#### Integration tests for lambda functions

You should have DynamoDB ran on the specific port. 
To run DynamoDB locally with migrations use:
* `npm run db`

Use one of the following commands to run tests:
* `npm test`
* `serverless invoke test --stage test [-f <function_name>]`

#### Unit tests

To run unit tests separately from lambda functions install mocha by `npm i -g mocha` and perform `mocha --grep <file name>`.

## Services info

| Service name       | Local port | DynamoDB port |
| -------------------|:----------:|:-------------:|
| Content management | 3000       | 8000          |
| Auth               | 3001       | 8001          |
| Maintenance        | 3002       | 8002          |
| Shared resources   | -          | -             |

## Resources
Used plugins:

* [serverless-offline](https://github.com/dherault/serverless-offline)
* [serverless-dynamodb-local](https://github.com/99xt/serverless-dynamodb-local)
* [serverless-dynamodb-client](https://github.com/99xt/serverless-dynamodb-client)
* [serverless-mocha-plugin](https://github.com/SC5/serverless-mocha-plugin)
* [serverless-export-env](https://github.com/arabold/serverless-export-env)
* [serverless-plugin-browserifier](https://github.com/digitalmaas/serverless-plugin-browserifier)
