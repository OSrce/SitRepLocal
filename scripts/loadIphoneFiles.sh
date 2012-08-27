#!/bin/sh

mkdir temp_files
cd temp_files
#wget http://download.dojotoolkit.org/release-1.7.3/dojo-release-1.7.3.tar.gz
#wget http://www.sitrep.org/downloads/dojo-release-1.7.3.tar.gz
wget http://www.sitrep.org/downloads/dojo-release-1.8.0.tar.gz
tar -zxvf dojo-release-1.8.0.tar.gz
mv dojo-release-1.8.0/* ../../lib_src/.

echo -e "*\n!.gitignore\n" >../../lib_src/dojo/.gitignore
echo -e "*\n!.gitignore\n" >../../lib_src/dijit/.gitignore
echo -e "*\n!.gitignore\n" >../../lib_src/dojox/.gitignore


#wget http://www.sitrep.org/downloads/iphone_theme.tar.gz
#tar -zxvf iphone_theme.tar.gz
#mv iphone ../../lib/dijit/themes/.

cd ..
rm -rf temp_files


