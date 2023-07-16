#!/bin/bash

cp ../../The_amazing_1x1_trainer/index.cdn.html 1x1/index.cdn.html
cp ../../The_amazing_1x1_trainer/1x1.js 1x1/1x1.js
cp ../../The_amazing_1x1_trainer/lang.js 1x1/lang.js

git add 1x1/index.cdn.html 1x1/1x1.js 1x1/lang.js
git commit -m "update web"
git push


