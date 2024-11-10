declare -A DIST
DIST["stable.all"]="repo/dists/sstable/main/all"
DIST["unstable.all"]="repo/dist/unstable/main/all"
DIST["stable.release"]="repo/dists/stable"
DIST["unstable.release"]="repo/dists/unstable"
DIST["stable.pool.all"]="repo/pool/stable-all"
DIST["unstable.pool.all"]="repo/pool/unstable-all"
DIST["root"]="$(pwd)"

declare -A ARCH
ARCH["all"]="1"
