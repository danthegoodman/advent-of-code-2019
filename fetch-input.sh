#!/usr/bin/env bash

die (){ echo "$@"; exit 1; }

[[ -z "$1" ]] && die "Usage: fetch-input [day]"

DAY="$1"
FILE="$DAY/input.txt"
URL="https://adventofcode.com/2019/day/${DAY#0}/input"

[[ -d "$1" ]] || die "Invalid day"

[[ -f "$FILE" ]] && die "Already downloaded"

source KEYS.sh
CONTENTS="$(curl --fail -H "cookie: session=${AOC_SESSION}" "$URL")"

[[ -z "$CONTENTS" ]] && die "Failed to get input"
echo "$CONTENTS" > "$FILE"

