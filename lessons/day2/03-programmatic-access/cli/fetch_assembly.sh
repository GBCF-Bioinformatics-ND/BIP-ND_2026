#!/usr/bin/env bash
#
# fetch_assembly.sh — pull a reference genome assembly and annotation from NCBI
# by accession, using the `datasets` CLI.
#
# Usage:
#   bash fetch_assembly.sh <ACCESSION> <OUTPUT_DIR>
#
# Example:
#   bash fetch_assembly.sh GCF_000005845.2 ./data/raw/ref
#
# Why an explicit accession argument: it forces the caller to commit the exact
# version. Don't accept a species name here — that is ambiguous over time.

set -euo pipefail

ACCESSION="${1:?Usage: $0 <ACCESSION> <OUTPUT_DIR>}"
OUTDIR="${2:?Usage: $0 <ACCESSION> <OUTPUT_DIR>}"

mkdir -p "$OUTDIR"

# Show what we're about to download. Inspect before you fetch.
datasets summary genome accession "$ACCESSION" \
    | jq '.reports[0] | {accession, organism: .organism.organism_name, assembly_level: .assembly_info.assembly_level, submission_date: .assembly_info.submission_date}'

# Download the genomic FASTA, GFF3, GTF, and protein FASTA.
datasets download genome accession "$ACCESSION" \
    --include genome,gff3,gtf,protein \
    --filename "$OUTDIR/${ACCESSION}.zip"

# Unpack and tidy.
unzip -o -q "$OUTDIR/${ACCESSION}.zip" -d "$OUTDIR/${ACCESSION}"
rm "$OUTDIR/${ACCESSION}.zip"

# Record what we just did.
{
    printf "ncbi_assembly: %s\n" "$ACCESSION"
    printf "ncbi_query_date: %s\n" "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    printf "datasets_version: %s\n" "$(datasets --version 2>&1)"
} >> "$OUTDIR/versions.txt"

echo "Done. Files in $OUTDIR/${ACCESSION}/"
