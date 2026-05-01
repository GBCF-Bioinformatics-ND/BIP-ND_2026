#!/usr/bin/env bash
#
# count_reads.sh
# Print the read count and average read length of every FASTQ in a directory.
#
# Usage:
#   bash count_reads.sh /path/to/data
#
# Exits non-zero if the directory has no FASTQs or if any file is unreadable.

set -euo pipefail

DATA_DIR="${1:-.}"

if [[ ! -d "$DATA_DIR" ]]; then
    echo "error: not a directory: $DATA_DIR" >&2
    exit 2
fi

shopt -s nullglob
files=("$DATA_DIR"/*.fastq.gz "$DATA_DIR"/*.fq.gz)
if (( ${#files[@]} == 0 )); then
    echo "error: no fastq.gz files in $DATA_DIR" >&2
    exit 1
fi

printf "file\treads\tmean_length\n"
for f in "${files[@]}"; do
    # Each FASTQ record is 4 lines. Sequence is line 2.
    # awk single pass: count records and sum sequence lengths.
    read -r n total < <(
        zcat "$f" \
        | awk 'NR%4==2 {n++; total += length($0)} END {print n, total}'
    )
    if (( n > 0 )); then
        mean=$(awk -v t="$total" -v n="$n" 'BEGIN {printf "%.1f", t/n}')
    else
        mean="0.0"
    fi
    printf "%s\t%d\t%s\n" "$(basename "$f")" "$n" "$mean"
done
