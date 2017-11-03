#!/usr/bin/env bash

region="${1:-us-east-1}"
stage="${2:-staging}"

cd services/auth-service
serverless deploy --verbose --region ${region} --stage ${stage} &

cd ../maintenance-service
serverless deploy --verbose --region ${region} --stage ${stage} &

cd ../content-management-service
serverless deploy --verbose --region ${region} --stage ${stage}