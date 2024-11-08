declare -A DIST
DIST["stable.all"]="repo/dist/stable/main/noarch"
DIST["unstable.all"]="repo/dist/unstable/main/noarch"
DIST["stable.release"]="repo/dist/stable"
DIST["unstable.release"]="repo/dist/unstable"
DIST["stable.pool.all"]="repo/pool/stable-noarch"
DIST["unstable.pool.all"]="repo/pool/unstable-noarch"
DIST["root"]="$(pwd)"

declare -A ARCH
ARCH["all"]="1"
