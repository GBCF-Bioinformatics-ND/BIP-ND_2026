#!/usr/bin/env python3
"""biopython_entrez.py — query NCBI through Biopython's Entrez module.

Demonstrates:
  - The required `Entrez.email` setting
  - `esearch` + `efetch` chained
  - Parsing the result and writing a small TSV
  - Recording provenance to versions.txt

Run:
  python biopython_entrez.py <output_dir> [<your-email>]
"""

from __future__ import annotations

import csv
import datetime as dt
import sys
from pathlib import Path

from Bio import Entrez

DEFAULT_EMAIL = "you@institution.edu"


def main(outdir: Path, email: str) -> None:
    outdir.mkdir(parents=True, exist_ok=True)

    # NCBI requires an email so they can contact you about misuse.
    Entrez.email = email

    # 1) Search for a few human gene records.
    term = "(BRCA1[gene] OR BRCA2[gene] OR TP53[gene]) AND human[orgn]"
    with Entrez.esearch(db="gene", term=term, retmax=10) as h:
        search_result = Entrez.read(h)
    gene_ids: list[str] = search_result["IdList"]
    print(f"esearch returned {len(gene_ids)} gene IDs")

    # 2) Fetch summaries for those IDs.
    with Entrez.esummary(db="gene", id=",".join(gene_ids)) as h:
        records = Entrez.read(h)

    # 3) Write a TSV.
    rows = []
    for r in records["DocumentSummarySet"]["DocumentSummary"]:
        rows.append({
            "gene_id": r.attributes["uid"],
            "symbol": str(r.get("Name", "")),
            "description": str(r.get("Description", "")),
            "chromosome": str(r.get("Chromosome", "")),
        })
    out_tsv = outdir / "ncbi_genes.tsv"
    with out_tsv.open("w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()), delimiter="\t")
        w.writeheader()
        w.writerows(rows)
    print(f"wrote {len(rows)} rows to {out_tsv}")

    # 4) Provenance.
    versions = outdir / "versions.txt"
    with versions.open("a") as fh:
        fh.write(f"biopython_entrez_query_date: "
                 f"{dt.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')}\n")
        try:
            from Bio import __version__ as biopython_version
            fh.write(f"biopython_version: {biopython_version}\n")
        except ImportError:
            pass


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(f"Usage: {sys.argv[0]} <output_dir> [<email>]")
    out = Path(sys.argv[1])
    addr = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_EMAIL
    if addr == DEFAULT_EMAIL:
        print("warning: using placeholder email; set your own for real work",
              file=sys.stderr)
    main(out, addr)
