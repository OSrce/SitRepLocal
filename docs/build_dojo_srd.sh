#!/bin/sh

SRHOME=..
SRSRC=$SRHOME/lib_src/srd
DESTDIR=$SRHOME/lib

rm -rf $DESTDIR/dojo
rm -rf $DESTDIR/dijit
rm -rf $DESTDIR/dojox
rm -rf $DESTDIR/srd

$SRHOME/lib_src/util/buildscripts/build.sh --require "$SRSRC/run.js" --profile "$SRSRC/srd.profile.js" --releaseDir "$DESTDIR"
#$SRHOME/lib/util/buildscripts/build.sh --require "$SRSRC/login_bootloader_iphone.js" --profile "$SRSRC/srd.profile.js" --releaseDir "$DESTDIR"
#$SRHOME/lib/util/buildscripts/build.sh  --profile "$SRSRC/srd.profile.js" --releaseDir "$DESTDIR"



