# ScreenDriver Serverless REST API

## Setup

1. ```npm install -g serverless```
1. ```npm i``` 

## Run project offline
###  Before:
1. Java Runtime Engine (JRE) version 6.x or newer should be installed ([serverless-dynamodb-local](https://www.npmjs.com/package/serverless-dynamodb-local#this-plugin-requires) plugin requirement)
1. Make next steps for each service in ```services/``` directory (excluding ```lib/```):
    * Setup serverless-dynamodb-local plugin before start: ```sls dynamodb install --stage dev```
    * Set environment variables:

      * `AWS_ACCESS_KEY_ID=any_key`
      * `AWS_SECRET_ACCESS_KEY=any_secret_key`
      * `PUSHER_APP_ID=<Pusher app ID>`
      * `PUSHER_KEY=<Pusher key>`
      * `PUSHER_SECRET=<Pusher secret>`
      * `PUSHER_CLUSTER=<Pusher cluster>`
    * Use ```serverless export-env --stage <stage>``` to export some environment variables from AWS to ```.env``` file automatically.
    * Use ```npm start``` to run service locally.

## Deployment
### Before:
Before run deploy commands, set environment variables to have access to AWS:
* ```export AWS_ACCESS_KEY_ID=<Your_AWS_access_key>```
* ```export AWS_SECRET_ACCESS_KEY=<Your_AWS_secret_access_key>```

or 

* `sls config credentials --provider aws --key <Your_AWS_access_key> --secret <Your_AWS_secret_access_key>` to save credentials in serverless configs

###  Deploy project:
Use ```npm run deploy``` to deploy project

###  Deploy a single function:
Use ```npm run deploy-function <function_name> ``` to deploy a single function

## Add first user

### For local and remote environments 

* Add first admin user to Cognito using: 
    
    ```
    aws cognito-idp admin-create-user 
    --user-pool-id <your_user_pool_id> 
    --username <email@adress> 
    --user-attributes Name=email,Value=<the_same_email@adress> Name=custom:admin,Value=true
    ```  

### For local environment

Add first admin user to local Dynamo DB using:
  * Visit [http://localhost:8001/shell/](http://localhost:8001/shell/)
  * Add user using script (use id from Cognito user 'sub')
    
    ```
    var params = {
        TableName: 'screen-driver-auth-api-users-<stage>',
        Item: {
            "id":"<id>",
            "email":"<email>",
            "username":"<email>",
            "isAdmin": <boolean>,
            "_rev":0
        }
    };
    
    ppJson(params);
    docClient.put(params, function(err, data) {
        if (err) ppJson(err);
        else console.log("PutItem returned successfully");
    });
    ```

### For remote environment
  * Visit [DynamoDB console -> tables](https://console.aws.amazon.com/dynamodb/home?tables#tables:)
  * Select user table
  * Add user to database (use id from Cognito user 'sub')
  ```
  { 
    "_rev":0,
    "id":"<id>",
    "isAdmin": <boolean>,
    "email":"<cognito_user_email>",
    "username":"<cognito_user_username>"
  }
  ```

## Invoke remote function
To invoke remote function use:
* ```npm run invoke <function_name>```

To invoke with logging use ``-l`` flag (i.e. ```npm run invoke <function_name> -l```)

## Testing

#### Integration tests for lambda functions

You should have running dynamodb on port 8000 (for `content-management-service`) or 8001 (for `auth-service`). 
To run dynamodb locally with migrations use:
* ```npm run db```

Use one of the following commands to run tests:
* ```npm test```
* ```sls invoke test --stage test [-f <function_name>]```

#### Unit tests

To run unit tests separately from lambda functions install mocha by `npm i -g mocha` and perform `mocha --grep <file name>`.

## Resources
Used plugins:

* [serverless-offline](https://github.com/dherault/serverless-offline)
* [serverless-dynamodb-local](https://github.com/99xt/serverless-dynamodb-local)
* [serverless-dynamodb-client](https://github.com/99xt/serverless-dynamodb-client)
* [serverless-mocha-plugin](https://github.com/SC5/serverless-mocha-plugin)
* [serverless-export-env](https://github.com/arabold/serverless-export-env)
