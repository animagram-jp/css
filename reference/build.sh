#!/bin/sh
set -eu
cd "$(dirname "$0")/.."

OUT="target/animagram_css.css"

mkdir -p "$(dirname "$OUT")"
awk '
    /^@import url\("[^"\/]+\.css"\);$/ {
        file = "css/" substr($0, 14, length($0) - 16)
        while ((status = (getline line < file)) > 0) print line
        if (status < 0) { print "missing: " file > "/dev/stderr"; exit 1 }
        close(file)
        next
    }
    /@import/ { print "unresolved: " $0 > "/dev/stderr"; exit 1 }
    { print }
' css/import.css > "$OUT"
