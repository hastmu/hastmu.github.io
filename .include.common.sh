declare -A DIST
DIST["stable.amd64"]="repo/dists/stable/main/binary-amd64"
DIST["unstable.amd64"]="repo/dists/unstable/main/binary-amd64"
DIST["stable.pool.all"]="repo/pool/stable-all"
DIST["unstable.pool.all"]="repo/pool/unstable-all"
DIST["stable.pool.amd64"]="repo/pool/stable-amd64"
DIST["unstable.pool.amd64"]="repo/pool/unstable-amd64"
DIST["root"]="$(pwd)"

DIST["stable.release"]="repo/dists/stable"
DIST["unstable.release"]="repo/dists/unstable"

declare -A ARCH
ARCH["amd64"]="1"
