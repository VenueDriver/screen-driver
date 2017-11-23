#!/usr/bin/env bash

cd api/services
cd content-management-service/ && npm start &
    cd auth-service/ && npm start &
    cd maintenance-service/ && npm start
