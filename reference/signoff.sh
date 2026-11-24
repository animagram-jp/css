#!/bin/sh
set -eu
cd "$(dirname "$0")/.."

status=0
for commit in $(git rev-list --no-merges "$BASE..$HEAD"); do
    email="$(git show -s --format=%ae "$commit")"
    if [ "${OPENER:-}" = "dependabot[bot]" ] && [ "$email" = "49699333+dependabot[bot]@users.noreply.github.com" ]; then
        continue
    fi
    if ! git show -s --format='%(trailers:key=Signed-off-by,valueonly)' "$commit" | grep -q -i -F "<$email>"; then
        echo "::error::commit $commit has no Signed-off-by trailer of its author <$email>"
        status=1
    fi
done
exit "$status"
