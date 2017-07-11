#!/bin/sh -x

output_dir_name="$1"
host_api_url="$2"

deps_image="screendriver-web-app-deps-image"
deps_container="screendriver-web-app-deps-container"

build_image="screendriver-web-app-build-image"

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

docker build -f docker/Dockerfile.deps -t "$deps_image" .
docker run --name "$deps_container" "$deps_image"
docker commit "$deps_container" "$deps_image"
docker rm -v "$deps_container"

echo
echo "Building project with API_HOST=$host_api_url ..."
echo

docker build -f docker/Dockerfile.build -t "$build_image" .
if docker run --rm -v "$output_dir_name:/app-dist" -e API_HOST=$host_api_url "$build_image"; then
  echo
  echo "Project was built successfully. Dist located in $output_dir_name"
fi