#!/bin/bash

set -e

VERSION=$(node -p -e "require('./package.json').version")
TIME_STAMP=`date +%Y%m%d%H%M%S`
VERSION=${VERSION/SNAPSHOT/$TIME_STAMP}
PACKAGE_NAME=hsp-fo-app_${VERSION}_all

mkdir -p target/${PACKAGE_NAME}
cp -r deb/* target/${PACKAGE_NAME}
sed -i "s/<VERSION>/${VERSION}/g" target/${PACKAGE_NAME}/DEBIAN/control
rm -rf node_modules
npm install --only=prod
cp -r package.json node_modules dist server target/${PACKAGE_NAME}/usr/local/SBB/usr/local/hsp-fo-app
cp env-*.sh target/${PACKAGE_NAME}/etc/SBB/hsp-fo-app
cd target
dpkg-deb --build $PACKAGE_NAME

exit 0