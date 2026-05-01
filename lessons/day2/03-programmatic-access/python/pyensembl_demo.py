#!/usr/bin/env python3
"""pyensembl_demo.py — fast, cached, local Ensembl lookups.

pyensembl downloads a release once, builds a local SQLite database, and answers
queries from it. After the first run, lookups are millisecond-fast and offline.

Demonstrates:
  - Pinning the Ensembl release at construction
  - Looking up a gene and its transcripts
  - Using `Genome` indexing for region queries

First run downloads ~200 MB and takes a few minutes. Subsequent runs are fast.

Run:
  python pyensembl_demo.py <output_dir> [<release>]
"""

from __future__ import annotations

import csv
import datetime as dt
import sys
from pathlib import Path

from pyensembl import EnsemblRelease, __version__ as pyensembl_version


def main(outdir: Path, release: int) -> None:
    outdir.mkdir(parents=True, exist_ok=True)

    # The release number is the only thing standing between this script
    # and silent answer-drift over time. Commit it.
    data = EnsemblRelease(release)
    data.download()   # idempotent
    data.index()      # idempotent

    # 1) Look up a gene by symbol; show its transcripts.
    gene = data.genes_by_name("TP53")[0]
    print(f"{gene.name} ({gene.gene_id}) on chr{gene.contig}:"
          f"{gene.start}-{gene.end} ({gene.strand}); "
          f"{len(gene.transcripts)} transcripts")

    # 2) Region query: what genes overlap a window?
    overlapping = data.genes_at_locus(contig="17", position=7_675_000)
    print(f"genes overlapping 17:7,675,000: "
          f"{[g.name for g in overlapping]}")

    # 3) Save a small per-transcript table for the gene above.
    out_tsv = outdir / "TP53_transcripts.tsv"
    with out_tsv.open("w", newline="") as fh:
        w = csv.writer(fh, delimiter="\t")
        w.writerow(["transcript_id", "name", "biotype",
                    "length", "is_protein_coding"])
        for t in gene.transcripts:
            w.writerow([t.transcript_id, t.name, t.biotype,
                        len(t), t.is_protein_coding])
    print(f"wrote {out_tsv}")

    # 4) Provenance.
    versions = outdir / "versions.txt"
    with versions.open("a") as fh:
        fh.write(f"pyensembl_release: {release}\n")
        fh.write(f"pyensembl_query_date: "
                 f"{dt.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')}\n")
        fh.write(f"pyensembl_version: {pyensembl_version}\n")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(f"Usage: {sys.argv[0]} <output_dir> [<release>]")
    out = Path(sys.argv[1])
    rel = int(sys.argv[2]) if len(sys.argv) > 2 else 111
    main(out, rel)
