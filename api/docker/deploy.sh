#!/bin/sh -x

access_key_id="$1"
secret_access_key="$2"

deps_image="screendriver-serverless-deps-image"
deps_container="screendriver-serverless-deps-container"

deploy_image="screendriver-serverless-deploy-image"

if test -z "$access_key_id" || test -z "$secret_access_key"; then
  echo "AWS Access Key ID and AWS Secret Access Key should be specified"
  exit 1
fi

cd ..

echo "Installing dependencies ..."
echo

docker build -f docker/Dockerfile.deps -t "$deps_image" .
docker run --name "$deps_container" "$deps_image"
docker commit "$deps_container" "$deps_image"
docker rm -v "$deps_container"

echo
echo "Deploying project to AWS ..."
echo

docker build -f docker/Dockerfile.deploy -t "$deploy_image" .
docker run --rm -e AWS_ACCESS_KEY_ID="$1" -e AWS_SECRET_ACCESS_KEY="$2" "$deploy_image"