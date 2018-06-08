#!/usr/bin/env bash

docker run --name huitparfait-sessions --rm -p 6379:6379 redis:4.0.9-alpine
