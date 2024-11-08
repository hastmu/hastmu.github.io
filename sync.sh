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

echo "- release.conf"

for BRANCH in stable unstable
do

cat > "${DIST[${BRANCH}.release]}/release.conf" <<BLOCK
APT::FTPArchive::Release::Origin "hastmu";
APT::FTPArchive::Release::Codename "${BRANCH}";
APT::FTPArchive::Release::Components "main";
APT::FTPArchive::Release::Label "Local APT Repository";
APT::FTPArchive::Release::Architectures "all";
BLOCK

   for arch in ${!ARCH[@]}
   do
      dpkg-scanpackages --arch "${arch}" "${DIST[${BRANCH}.pool.${arch}]}" > "${DIST[${BRANCH}.${arch}]}/Packages"
      gzip -kc "${DIST[${BRANCH}.${arch}]}/Packages" > "${DIST[${BRANCH}.${arch}]}/Packages.gz"
      apt-ftparchive contents "${DIST[${BRANCH}.pool.${arch}]}" > "${DIST[${BRANCH}.${arch}]}/Contents-${arch}"
      gzip -kc "${DIST[${BRANCH}.${arch}]}/Contents-${arch}" > "${DIST[${BRANCH}.${arch}]}/Contents-${arch}.gz"
      apt-ftparchive release  "${DIST[${BRANCH}.${arch}]}" > "${DIST[${BRANCH}.${arch}]}/Release"
      apt-ftparchive release -c "${DIST[${BRANCH}.release]}/release.conf" "${DIST[${BRANCH}.release]}" > "${DIST[${BRANCH}.release]}/Release"
   done
done

echo "- final push"
git commit -m "update web"
git push
