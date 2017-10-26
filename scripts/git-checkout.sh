#!/bin/sh
taskName="$1"
branch=$(echo "$taskName" | sed -e 's/[;,()%$#!.'\'']/ /g;s/  */ /g' | sed 's/.*/\L&/' |  sed 's/\ /-/g')
git checkout -b "$branch"
