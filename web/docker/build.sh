#!/bin/sh -x

output_dir_name="$1"
host_api_url="$2"

cd ..

if test -z "$output_dir_name"; then
  echo "Specify path to dist"
  exit 1
fi

if echo "$host_api_url" | grep -q "http"; then
  :
else
  echo "Specify correct URL to API host"
  exit 1
fi

echo "Installing dependencies ..."
echo

docker build -f docker/Dockerfile.deps -t screendriver-web-app-deps-image .
docker run --rm screendriver-web-app-deps-image

echo
echo "Building project with API_HOST=$host_api_url ..."
echo

docker build -f docker/Dockerfile.build -t screendriver-web-app-build-image .
docker run --rm -v "$output_dir_name:/app-dist" -e API_HOST=$host_api_url screendriver-web-app-build-image

echo
echo "Project was built successfully. Dist located in $output_dir_name"