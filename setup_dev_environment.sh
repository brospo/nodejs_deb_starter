#!/bin/bash

set -e

if [ "$EUID" -ne 0 ]; then
    echo "Error: Requested action requires superuser privileges"
    exit -1
fi

CHECKOUT_DIR=$(dirname $0)
APP_NAME=nodejs_deb_starter

echo "Installing build-essential package for G++ compiler."
sudo apt-get install -y --force-yes build-essential
echo "Installing nodejs and npm."
sudo dpkg -i $CHECKOUT_DIR/dev_dependencies/nodejs_6.9.2-1nodesource1-trusty1_amd64.deb
