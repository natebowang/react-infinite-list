gzipkeep() {
    if [ -f "$1" ] ; then
        gzip -c "$1" > "$1.gz"
    fi
}
# have to export to bash, `find -exec` can not execute bash function.
export -f gzipkeep

rm -rf dist && \
webpack --env prod && \
find dist -type f -exec bash -c 'gzipkeep "$0"' "{}" \; && \
echo -n '  Build on: ' > dist/version && date -R >> dist/version && git branch -vv >> dist/version
