# Buildpack storing resulting binaries in Redis

[![Build Status](https://travis-ci.org/spark/buildpack-store.svg?branch=master)](https://travis-ci.org/spark/buildpack-store) [![](https://imagelayers.io/badge/particle/buildpack-store:latest.svg)](https://imagelayers.io/?images=particle/buildpack-store:latest 'Get your own badge on imagelayers.io')


This buildpack takes all files from input directory (`/input`) and stores them in Redis instance.

## Building image

**Before building this image, build or fetch [buildpack-base](https://github.com/spark/buildpack-base).**

```bash
$ export BUILDPACK_IMAGE=store
$ git clone "git@github.com:spark/buildpack-${BUILDPACK_IMAGE}.git"
$ cd buildpack-$BUILDPACK_IMAGE
$ docker build -t particle/buildpack-$BUILDPACK_IMAGE .
```

## Running

This buildpack is designed to be run by [Dray](https://github.com/spark/dray) but can be also used outside of it by specifying following environment variables:

* `DRAY_JOB_ID` - Identifier to be used as key when storing the files
* `REDIS_URL` - URL to Redis instance
* `REDIS_EXPIRE_IN` - TTL of stored key in Redis. Defaults to 10 minutes

```bash
$ docker run --rm \
  -v ~/tmp/input:/input \
  -e REDIS_URL="redis://192.168.0.10:6379" \
  -e DRAY_JOB_ID="job-1" \
  particle/buildpack-store
```
