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

# only do this if something is new 
git status
if [ 1 -eq 1 ]
then

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

      for tarch in ${!ARCH[@]}
      do
         ( 
            cd "${DIST[${BRANCH}.pool.${arch}]%%/*}" || true ;
            pwd
            echo "" > "${DIST[${BRANCH}.${tarch}]#*/}/Packages"
            echo "" > "${DIST[${BRANCH}.${tarch}]#*/}/Contents-${tarch}"
         )      
         for arch in ${ARCH[${tarch}]}
         do
            echo "- process ${BRANCH}/${tarch}/${arch}"
            echo "- scan packages of ${arch} for ${tarch} in ${DIST[${BRANCH}.pool.${arch}]#*/}"
            ( 
               cd "${DIST[${BRANCH}.pool.${arch}]%%/*}" || true 
               dpkg-scanpackages --arch "${arch}" "${DIST[${BRANCH}.pool.${arch}]#*/}" >> "${DIST[${BRANCH}.${tarch}]#*/}/Packages"
            )
            echo "- build contents..."

            ( cd "${DIST[${BRANCH}.pool.${arch}]%%/*}" ; apt-ftparchive contents "${DIST[${BRANCH}.pool.${arch}]#*/}" >> "${DIST[${BRANCH}.${tarch}]#*/}/Contents-${tarch}" )


         done
         gzip -kc "${DIST[${BRANCH}.${tarch}]}/Packages" > "${DIST[${BRANCH}.${tarch}]}/Packages.gz"
         gzip -kc "${DIST[${BRANCH}.${tarch}]}/Contents-${tarch}" > "${DIST[${BRANCH}.${tarch}]}/Contents-${tarch}.gz"
         ( cd "${DIST[${BRANCH}.${tarch}]%%/*}" ; apt-ftparchive release  "${DIST[${BRANCH}.${tarch}]#*/}" > "${DIST[${BRANCH}.${tarch}]#*/}/Release" )
         #( cd "${DIST[${BRANCH}.release]%%/*}" ; apt-ftparchive release -c "${DIST[${BRANCH}.release]#*/}/release.conf" "${DIST[${BRANCH}.release]#*/}" > "${DIST[${BRANCH}.release]#*/}/Release" )


         echo "- signing"
         ls -al "${DIST[${BRANCH}.${tarch}]}/Release"
         gpg -a --yes --output "${DIST[${BRANCH}.release]}/Release.gpg" --detach-sign "${DIST[${BRANCH}.${tarch}]}/Release"
         gpg -a --yes --clearsign --output "${DIST[${BRANCH}.release]}/InRelease" --detach-sign "${DIST[${BRANCH}.${tarch}]}/Release"

      done


   done


fi

echo "- final push"
git add -A 
git commit -m "update web"
git push
