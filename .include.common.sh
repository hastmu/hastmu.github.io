declare -A DIST
DIST["stable.binary-amd64"]="repo/dists/stable/main/binary-amd64"
DIST["unstable.binary-amd64"]="repo/dist/unstable/main/binary-amd64"
DIST["stable.release"]="repo/dists/stable"
DIST["unstable.release"]="repo/dists/unstable"
DIST["stable.pool.all"]="repo/pool/stable-all"
DIST["unstable.pool.all"]="repo/pool/unstable-all"
DIST["stable.pool.amd64"]="repo/pool/stable-amd64"
DIST["unstable.pool.amd64"]="repo/pool/unstable-amd64"
DIST["root"]="$(pwd)"

declare -A ARCH
ARCH["binary-amd64"]="amd64 all"
