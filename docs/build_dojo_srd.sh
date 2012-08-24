#!/bin/sh

SRHOME=..
SRSRC=$SRHOME/lib/srd
DESTDIR=$SRHOME/build

rm -rf $DESTDIR/dojo
rm -rf $DESTDIR/dijit
rm -rf $DESTDIR/dojox
rm -rf $DESTDIR/srd

$SRHOME/lib/util/buildscripts/build.sh --require "$SRSRC/login_bootloader_iphone.js" --profile "$SRSRC/srd.profile.js" --releaseDir "$DESTDIR"
#$SRHOME/lib/util/buildscripts/build.sh  --profile "$SRSRC/srd.profile.js" --releaseDir "$DESTDIR"



