#!/bin/sh

mkdir temp_files
cd temp_files
wget http://download.dojotoolkit.org/release-1.7.3/dojo-release-1.7.3.tar.gz
tar -zxvf dojo-release-1.7.3.tar.gz
mv dojo-release-1.7.3/* ../../lib/.
cd ..
rm -rf temp_files


