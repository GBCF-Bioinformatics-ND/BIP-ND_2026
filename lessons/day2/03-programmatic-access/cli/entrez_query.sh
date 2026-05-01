#!/usr/bin/env bash
#
# entrez_query.sh — example queries through Entrez Direct.
#
# Demonstrates three things:
#   1. esearch | efetch to retrieve sequence records
#   2. esearch | efetch | xtract to get a TSV from XML
#   3. composing the EDirect output with standard Unix tools
#
# Usage:
#   bash entrez_query.sh <output_dir>

set -euo pipefail

OUTDIR="${1:?Usage: $0 <output_dir>}"
mkdir -p "$OUTDIR"

# 1) Fetch a single GenBank record by accession.
#    NM_000546 is the canonical TP53 mRNA in human RefSeq.
echo ">> Fetching NM_000546 (TP53 mRNA) as GenBank text"
esearch -db nuccore -query "NM_000546.6" \
    | efetch -format gb \
    > "$OUTDIR/TP53_NM_000546.gb"

# 2) Search for human gene records by symbol; return a TSV of (symbol, id, description).
echo ">> Searching for two example genes; outputting a TSV"
esearch -db gene -query "(BRCA1[gene] OR BRCA2[gene]) AND human[orgn]" \
    | efetch -format docsum \
    | xtract -pattern DocumentSummary \
        -element Name Id Description \
    > "$OUTDIR/example_genes.tsv"

# 3) Compose with Unix tools — count records returned.
echo ">> Composing with Unix:"
echo "   number of records: $(wc -l < "$OUTDIR/example_genes.tsv")"
echo "   first record: $(head -1 "$OUTDIR/example_genes.tsv")"

# 4) Provenance.
{
    printf "edirect_query_date: %s\n" "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    printf "edirect_version: %s\n" "$(esearch -version 2>&1 | head -1)"
} >> "$OUTDIR/versions.txt"

echo "Done."
