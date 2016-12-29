## Synopsis

This project is meant to serve as a starter template for creating a ME(!a)n application packaged as a .deb file. The (!a) implies thatthis is not meant to be have front end web page component. It is intended in this case for an Ubuntu 14.04 distro.

## Motivation

I find it pretty annoying when starting a new project to get the scaffolding of my application going. While this is just one way to do it, this is a way that I have found works pretty well for me.

## Installation

To develop the project, run the `set_dev_environment.sh` shell script. It will try to install node for you.
Then you can run the project in the `/src/opt/nodejs_deb_starter/` directory with `npm run dev`

To create a debian package run the `build_package.sh` shell script with: `build_package.sh -v BUILD_NUMBER`

## Application Traits

#### OS Stuff

* Syslogs using rsyslog to `/var/log/nodejs_deb_starter.log`
* Rotates log file after it grows to 4096k
* Starts on boot with upstart service name `nodejs_deb_starter`
* Can generate self signed certificate using openssl by running the `gen_certs.sh` script in the `certs` folder
* Everything under the `/src/**` folder mimicks exactly how the debian package will be installed
* Uses a 4 dot version number, The first three can be changed by editing version.txt - the build number is specified at the time of build

#### ME(!a)N Stuff

* Runs as an https server
* Default configuration parameters are in `lib/const.js`
* Mongo server data is kept in `/src/opt/nodejs_deb_starter/data/db`
* Uses winston and winston-syslog to manage syslog functionality

## License

MIT
