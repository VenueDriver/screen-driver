#!/bin/sh -x

access_key_id="$1"
secret="$2"

deps_image="screendriver-serverless-deps-image"
deps_container="screendriver-serverless-deps-container"

deploy_image="screendriver-serverless-deploy-image"

cd ..

docker build -f docker/Dockerfile.deps -t "$deps_image" .
docker run --name "$deps_container" "$deps_image"
docker commit "$deps_container" "$deps_image"
docker rm -v "$deps_container"

docker build -f docker/Dockerfile.deploy -t "$deploy_image" .
docker run --rm -e AWS_ACCESS_KEY_ID="$1" -e AWS_SECRET_ACCESS_KEY="$2" "$deploy_image"