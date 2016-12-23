#!/bin/bash

set -e # Exit on failure
clear;

if [ "$EUID" -ne 0 ]; then
    echo "Error: Requested action requires superuser privileges"
    exit -1
fi

BUILD_VERSION=""

while getopts ":v:" opt; do
    case $opt in
        v)
            BUILD_VERSION=$OPTARG
        ;;
    \?)
        echo "Invalid option: -$OPTARG" >&2
        exit -1
        ;;
    esac
done

if [ ! -n "${BUILD_VERSION}" ]; then
    echo "Usage: -v [build number]"
    exit -1
fi

CHECKOUT_DIR=$(dirname $0)
SOURCE_DIR=$CHECKOUT_DIR/src
APP_NAME='nodejs_scaffold'
VERSION=$(cat ${CHECKOUT_DIR}/version.txt)
ARCH=$(uname -m)
PACKAGE_NAME=${APP_NAME}_${VERSION}.${BUILD_VERSION}_${ARCH}.deb
NODE_APP_DIR=$SOURCE_DIR/opt/$APP_NAME

echo "-------------------- SUMMARY --------------------"
echo "Build Version      : $BUILD_VERSION"
echo "Packaging Directory: $CHECKOUT_DIR"
echo "Source Directory   : $SOURCE_DIR"
echo "Package Version    : $VERSION"
echo "Application Name   : $APP_NAME"
echo "Debian Package Name: $PACKAGE_NAME"
echo "Node App Directory : $NODE_APP_DIR"

echo "-------------- ENVIRONMENT SETUP ----------------"
echo "Ensuring build dependencies are installed..."
$CHECKOUT_DIR/setup_dev_environment.sh

echo "Installing NPM Packages..."
# Make sure that we don't have any dev dependencies installed
rm -rf $NODE_APP_DIR/node_modules
npm --prefix $NODE_APP_DIR install --production
# The --prefix option has a bug that makes an erroneous /etc dir
rm -r $NODE_APP_DIR/etc

echo "-------------- PREP BUILD CHECKOUT ----------------"
echo "Updating $SOURCE_DIR/DEBIAN/control version to $VERSION.$BUILD_VERSION"
sed -i "s/Version:.*/Version: $VERSION.$BUILD_VERSION/" $SOURCE_DIR/DEBIAN/control
echo "Updating $NODE_APP_DIR/package.json version to $VERSION-build.$BUILD_VERSION"
sed -i "s/\"version\":.*/\"version\": \"$VERSION-build.$BUILD_VERSION\",/" $NODE_APP_DIR/package.json

echo "------------- BUILD DEBIAN PACKAGE ----------------"
dpkg-deb --build $SOURCE_DIR $CHECKOUT_DIR/$PACKAGE_NAME
