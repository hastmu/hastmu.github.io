#!/bin/bash

# copyright 2024 by gh-hastmu@gmx.de
# homed at: https://github.com/hastmu/

if [ $(id -u) -ne 0 ]
then
   echo "Sorry i have to run as root, e.g. via sudo."
   exit 1
fi

BRANCH=${BRANCH:="$1"}
if [ -z "${BRANCH}" ]
then
   echo "which branch? (stable|unstable)"
   read BRANCH
fi

if [ "${BRANCH}" == "stable" ] || [ "${BRANCH}" == "unstable" ]
then
   base="https://hastmu.github.io"
   if wget -O /etc/apt/trusted.gpg.d/hastmu.gpg ${base}/hastmu.gpg
   then
      echo "deb ${base}/repo ${BRANCH} main" > /etc/apt/sources.list.d/hastmu.list
      echo "hastmu repo enabled"
      exit 0
   else
      echo "- gpg key download failed."
      exit 1
   fi
else
   echo "only 'stable' and 'unstable' are valid branches"
   exit 1
fi



