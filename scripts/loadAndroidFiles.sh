#!/bin/sh

mkdir temp_files
cd temp_files
#wget http://download.dojotoolkit.org/release-1.7.3/dojo-release-1.7.3.tar.gz
wget http://www.sitrep.org/downloads/dojo-release-1.7.3.tar.gz
tar -zxvf dojo-release-1.7.3.tar.gz
mv dojo-release-1.7.3/* ../../lib/.

wget http://www.sitrep.org/downloads/android_theme.tar.gz
tar -zxvf android_theme.tar.gz
mv android ../../lib/dijit/themes/.

cd ..
rm -rf temp_files

mv ../lib/dojox/mobile/themes/iphone ../lib/dojox/mobile/themes/iphone.bad


