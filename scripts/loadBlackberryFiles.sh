#!/bin/sh

mkdir temp_files
cd temp_files
#wget http://download.dojotoolkit.org/release-1.7.3/dojo-release-1.7.3.tar.gz
wget http://www.sitrep.org/downloads/dojo-release-1.7.3.tar.gz
tar -zxvf dojo-release-1.7.3.tar.gz
mv dojo-release-1.7.3/* ../../lib/.

wget http://www.sitrep.org/downloads/blackberry_theme.tar.gz
tar -zxvf blackberry_theme.tar.gz
mv blackberry ../../lib/dijit/themes/.

cd ..
rm -rf temp_files


