# Exercises — Programmatic Access

## Exercise 3.1 — Pull the workshop reference (CLI)

In your Day 1 project repository, add `scripts/01_fetch_reference.sh`. Use the `datasets` CLI to retrieve the workshop's reference assembly and annotation by accession (your instructor will provide the accession).

The script should:

1. Take the accession and an output directory as arguments.
2. Print the assembly summary first (so you can verify what you are about to download).
3. Download genomic FASTA, GFF3, and GTF.
4. Append a line to `versions.txt` recording the accession, the date, and the `datasets` version.

Commit the script and `versions.txt`. Do **not** commit the downloaded files (`.gitignore` should already cover this).

## Exercise 3.2 — A metadata table (R or Python)

Pick one lane:

- **R.** Adapt `R/biomart_query.R` to retrieve, for the workshop organism, every gene's stable ID, gene symbol, biotype, and chromosomal location. Write it to `data/processed/genes.tsv`.
- **Python.** Adapt `python/pyensembl_demo.py` to do the equivalent.

In either case, your script must record the release/date in `versions.txt`.

## Exercise 3.3 — Reproduce a teammate's query

Swap projects with another pair. Each pair clones the other's repo on the HPC and runs the retrieval script. Confirm the output is identical to what the original pair produced.

If it is *not* identical, you have found the gap. Common reasons:

- The release was not pinned (Ensembl shipped a new release between your run and theirs).
- The accession was hard-coded in one place but not another.
- The script writes to a path the cloner does not have permission to.

Fix the gap. Push. Re-run. Verify.

## Stretch — Exercise 3.4

Read `python/ensembl_rest.py`. Note that it uses an archive host (e.g., `jan2024.archive.ensembl.org`) when a release is supplied. Why is hitting an archive host more reproducible than hitting `rest.ensembl.org` even with a release-aware wrapper? (Answer: archive hosts serve historical data even after the wrapper's notion of "release N" has been updated. They are the closest thing to a versioned snapshot.)

Modify the script to default to release 111 instead of "latest". Discuss in your pair when a default like this is appropriate and when it is not.
