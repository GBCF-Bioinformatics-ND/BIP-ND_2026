# Day 2 · Session 3 — Programmatic Access

**Time.** 10:45–12:15 (90 min)
**Themes.** Data acquisition + Workflow.
**Slides.** `slides/day2-03-programmatic-access.pptx`

## Goal

By the end of this session, learners can:

1. Pull a reference assembly and its annotation by accession with the NCBI `datasets` CLI.
2. Run an Entrez Direct query and pipe the result through standard Unix tools.
3. Run a `biomaRt` query in R and a `pyensembl` query in Python, and explain when to use which.
4. Commit retrieval scripts and a `versions.txt` so the same data can be regenerated later.

## Outline

| Time | What you do |
|------|-------------|
| 10:45–11:05 | CLI lane: `datasets`, `efetch`/`esearch`. |
| 11:05–11:35 | R lane: `biomaRt`, `AnnotationHub`. |
| 11:35–12:00 | Python lane: `biopython`, `pyensembl`, REST. |
| 12:00–12:15 | Exercise: each pair commits a query script + `versions.txt` to the Day 1 project. |

## CLI lane

Two tools cover most NCBI work:

- `datasets` for assemblies, annotations, gene records — modern, fast, returns ZIPs.
- Entrez Direct (`esearch`, `efetch`, `xtract`) for everything else — older, but composes with `awk`, `grep`, `sort`.

See `cli/fetch_assembly.sh` and `cli/entrez_query.sh` in this directory.

The teaching points to make:

1. Every CLI run is a committed script. The web walk-through earlier was a click; this is a record.
2. `datasets summary` is your friend before `datasets download`. Inspect what you are about to fetch.
3. EDirect outputs XML; `xtract` turns it into TSV. Pipe into `cut`, `sort`, `uniq -c` like any other text stream.

## R lane

Two libraries cover most of what learners need:

- `biomaRt` for Ensembl queries: gene IDs, biotypes, orthologs, sequences. The same XML language as the web BioMart, callable from R.
- `AnnotationHub` for cached, versioned access to a wide catalog of curated annotations: ENCODE BEDs, ChEA TF-target tables, model organism resources.

See `R/biomart_query.R` and `R/annotationhub_demo.R`.

A common stumbling block: BioMart's host occasionally goes down. Use `useEnsembl(..., mirror = "asia")` (or `"useast"`, `"uswest"`) as a fallback. For maximum reproducibility, point at an archive: `useEnsembl(..., version = 111)`.

## Python lane

Three patterns cover most Python work:

- `biopython.Entrez` for the same NCBI queries as EDirect, returned as Python objects.
- `pyensembl` for fast, cached, local Ensembl lookups when you need to do many of them.
- `requests` against the Ensembl REST API for queries the wrappers do not expose.

See `python/biopython_entrez.py`, `python/pyensembl_demo.py`, `python/ensembl_rest.py`.

A note on `gget`: it bundles convenient wrappers around several of these. Mention it; teach the underlying APIs anyway, so learners can debug when the wrapper hides the failure.

## The provenance discipline

Every script in this session, when it runs, also writes to a `versions.txt`:

```
ensembl_release: 111
ensembl_query_date: 2024-04-15
ncbi_assembly: GCF_000005845.2
ncbi_query_date: 2024-04-15
biomart_url: https://www.ensembl.org/biomart
```

Commit this. Without it, "I queried Ensembl" is not a reproducible statement.

## Exercise

Each pair adds to their Day 1 project repo:

1. A script (CLI, R, or Python — pair's choice) that retrieves the workshop reference and annotation by accession.
2. A small metadata table built from a BioMart or `biomaRt` query (or `pyensembl`, depending on the lane chosen).
3. A `versions.txt` recording the release/date of every resource queried.

Commit and push.

## Common misconceptions to surface

- **"I downloaded it once, so it's reproducible."** Not if you cannot say which release.
- **"The API gave me a different answer last week."** Yes, because Ensembl releases on a schedule and BioMart serves the current release by default. Pin the release.
- **"The wrapper is the API."** It is not. When the wrapper breaks, you fall back to the underlying API. Knowing that the underlying API exists is the point.
- **"Caching is automatic."** It is automatic in `pyensembl` and `AnnotationHub`. It is not in `biopython.Entrez` or raw `requests`. For repeated queries, cache by hand (file, sqlite, `requests-cache`).
