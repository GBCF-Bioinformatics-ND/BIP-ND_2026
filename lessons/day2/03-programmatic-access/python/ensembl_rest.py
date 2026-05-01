#!/usr/bin/env python3
"""ensembl_rest.py — direct REST calls to the Ensembl API.

Use this when the wrappers (biomaRt, pyensembl, gget) do not expose what you
need, or when you want maximum control over the query and response.

Demonstrates:
  - The canonical REST endpoint and headers
  - Polite client behavior (User-Agent, retry on 429)
  - Pinning by hitting an archive host for a specific release

Run:
  python ensembl_rest.py <output_dir> [<release>]
"""

from __future__ import annotations

import csv
import datetime as dt
import json
import sys
import time
from pathlib import Path

import requests

# Use the archive host to pin a release. The current host (rest.ensembl.org)
# follows the latest Ensembl release; archive hosts (e.g. nov2023.archive...)
# pin to a specific release. See https://www.ensembl.org/info/website/archives/
RELEASE_TO_HOST = {
    111: "https://jan2024.archive.ensembl.org",
    110: "https://jul2023.archive.ensembl.org",
    109: "https://feb2023.archive.ensembl.org",
}
LATEST_HOST = "https://rest.ensembl.org"


def get(host: str, path: str, params: dict | None = None) -> dict | list:
    """GET with polite retry on rate-limit (429)."""
    url = host + path
    headers = {
        "Accept": "application/json",
        "User-Agent": "workshop-demo/1.0 (you@institution.edu)",
    }
    for attempt in range(3):
        r = requests.get(url, params=params, headers=headers, timeout=30)
        if r.status_code == 429:
            # Ensembl publishes Retry-After in seconds when rate-limiting.
            wait = float(r.headers.get("Retry-After", "1"))
            time.sleep(wait)
            continue
        r.raise_for_status()
        return r.json()
    raise RuntimeError(f"rate-limited after retries: {url}")


def main(outdir: Path, release: int | None) -> None:
    outdir.mkdir(parents=True, exist_ok=True)
    host = RELEASE_TO_HOST.get(release, LATEST_HOST) if release else LATEST_HOST

    # 1) Look up a gene by symbol.
    gene = get(host, "/lookup/symbol/homo_sapiens/TP53",
               params={"expand": 1})
    print(f"TP53: {gene['id']} on {gene['seq_region_name']}:"
          f"{gene['start']}-{gene['end']}")

    # 2) Region query: features overlapping a window.
    feats = get(host, "/overlap/region/human/17:7674000-7676000",
                params={"feature": "gene"})
    out_tsv = outdir / "region_features.tsv"
    with out_tsv.open("w", newline="") as fh:
        w = csv.writer(fh, delimiter="\t")
        w.writerow(["id", "external_name", "biotype", "start", "end", "strand"])
        for f in feats:
            w.writerow([f.get("id"), f.get("external_name"),
                        f.get("biotype"), f.get("start"),
                        f.get("end"), f.get("strand")])
    print(f"wrote {out_tsv} ({len(feats)} features)")

    # 3) Save the raw gene record for inspection.
    (outdir / "TP53_lookup.json").write_text(json.dumps(gene, indent=2))

    # 4) Provenance.
    versions = outdir / "versions.txt"
    with versions.open("a") as fh:
        fh.write(f"ensembl_rest_host: {host}\n")
        fh.write(f"ensembl_rest_query_date: "
                 f"{dt.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')}\n")
        fh.write(f"requests_version: {requests.__version__}\n")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(f"Usage: {sys.argv[0]} <output_dir> [<release>]")
    out = Path(sys.argv[1])
    rel = int(sys.argv[2]) if len(sys.argv) > 2 else None
    main(out, rel)
