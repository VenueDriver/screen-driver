#!/usr/bin/env bash

cd services/
cd content-management-service/ && npm start &
    cd auth-service/ && npm start &
    cd maintenance-service/ && npm start
