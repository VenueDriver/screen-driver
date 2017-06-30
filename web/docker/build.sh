#!/bin/sh -x

cd ..

if test -z "$1"; then
  echo "Specify path to dist"
  exit 1
fi

if echo "$2" | grep -q "http"; then
  :
else
  echo "Specify correct URL to API host"
  exit 1
fi

echo "Build project with API_HOST=$2"

#install dependencies
docker build -f docker/Dockerfile.deps -t deps-image .
docker run --rm deps-image

#build dist
docker build -f docker/Dockerfile.build -t build-image
docker run --rm -v "$1:/app-dist" -e API_HOST=$2 build-image

echo "Project dist located in $1"