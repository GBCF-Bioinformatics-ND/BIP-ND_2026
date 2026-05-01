# Solutions — Programmatic Access

## 3.1 — Pull the workshop reference

The reference solution is `cli/fetch_assembly.sh`. Walk through the three teaching points:

1. **Inspect before fetch.** `datasets summary genome accession ...` prints metadata. If the assembly level, organism, or date looks wrong, stop before downloading.
2. **`--include` lists what you want.** `genome,gff3,gtf,protein` is a defensible default for a reference. For most workshops you will not need `cds` separately — it is in the GFF.
3. **`versions.txt` is appended, not overwritten.** Multiple scripts contribute to it over the project's life.

Common failures:

- `command not found: datasets` → the env is not active or the wrong env is active. `which datasets`.
- `Error: Internal Server Error` → NCBI was flaking. Retry; the CLI is idempotent.
- An empty `versions.txt` after a successful run → check that `>>` is being used, not `>`.

## 3.2 — A metadata table

The reference solutions are `R/biomart_query.R` and `python/pyensembl_demo.py`. Walk through the patterns rather than the specific syntax:

- Pin the release at the top of the script. Comment briefly *why*.
- Build the result, write the result, then write provenance. In that order, so a failure in the query does not leave a half-truthful `versions.txt`.
- Use stable IDs as the join key in any downstream merge (Ensembl gene ID, NCBI Gene ID — never the symbol).

## 3.3 — Reproducing a teammate's query

The exercise *should* surface gaps. The most common ones, by frequency:

- **No release pin.** The fix is one line.
- **Hard-coded paths.** The fix is parameterizing the script with arguments.
- **No `mkdir -p` for the output directory.** The fix is one line.
- **Different versions of the wrapper between teammates' environments.** The fix is the env YAML; if both pairs are using the workshop env, this should not happen, which is the point of the env discipline.

If the outputs *are* identical, congratulate the pair on rung 4 of the reproducibility ladder. They have committed runnable provenance, and that is what the rest of Day 2 builds on.

## 3.4 — Archive hosts vs. release-aware wrappers

`rest.ensembl.org` is a *current* host. When Ensembl ships a new release, the host's behavior changes. Even if your wrapper says "release 111", a low-level REST call to the current host can return different data after a new release ships, because some endpoints follow current data regardless of any `version` parameter.

Archive hosts (`jan2024.archive.ensembl.org`, etc.) are pinned snapshots. They serve the data as it was on that date, indefinitely (or until Ensembl retires them, which is rare and well-publicized). For analyses that you might rerun in three years, archive hosts are the safer choice.

When is a default release appropriate? When the script is part of an analysis with a *single* committed methods statement. Make the release a constant at the top of the script; if you need to update it, the diff is visible in Git.

When is a default release inappropriate? In a library or a tool. There you want the user to make the choice explicitly.
