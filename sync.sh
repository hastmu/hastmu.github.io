#!/bin/bash

cp ../../The_amazing_1x1_trainer/index.cdn.html 1x1/index.cdn.html
cp ../../The_amazing_1x1_trainer/1x1.js 1x1/1x1.js
cp ../../The_amazing_1x1_trainer/lang.js 1x1/lang.js

cat > 1x1/index.html <<EOF
<html>
<body>
By clicking here you accept the terms of usage and tracking of jsdelivr.net, as this is used on the demo page.
<a href="index.cdn.html">I accept and get forwarded</a>
</body>
</html>
EOF

git add 1x1/index.cdn.html 1x1/1x1.js 1x1/lang.js 1x1/index.html

# deploy packages

source ".include.common.sh"

for item in ${!DIST[@]}
do
   [ ! -x "${DIST[${item}]}" ] && mkdir -p "${DIST[${item}]}"
done

for item in $(find ../.. -name "deploy-deb.sh" -type f)
do
   echo "- run ${item}"
   ${item}
done

git commit -m "update web"
git push
