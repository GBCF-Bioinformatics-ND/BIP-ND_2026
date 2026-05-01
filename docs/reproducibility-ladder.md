# The Reproducibility Ladder

Reproducibility is not a binary. It is a ladder. Each rung costs more effort and buys more confidence. We use this ladder as the closing frame of Day 2 because each rung corresponds to something learners will have *actually done* during the workshop.

## Rung 1 — Environment captured

You can name every package and every version your analysis used.

- A conda/mamba environment YAML in your project's `envs/`.
- For R: `sessionInfo()` printed at the end of every script, captured in the log.
- Versions pinned for the packages whose behavior actually changes between releases (caller defaults, normalization methods, statistics).

This is the baseline. You cannot debug a result you cannot reproduce on your own machine; an environment file is the cheapest possible insurance.

## Rung 2 — Code under version control

Every change to your analysis is in Git, with a history a stranger could follow.

- `git init` in the project root, with a `.gitignore` that excludes data from the very first commit.
- Commit messages that say *why*, not *what*. ("Lower MAPQ threshold to recover known variants in repeat regions" beats "fix mapq".)
- A README that walks a stranger through cloning, environment creation, and reproducing the figures.

This rung adds about 10 minutes a day to your workflow. It saves about 10 minutes a day in "wait, what was I doing?" recovery, even before you count the days you save when a collaborator joins or you come back to the project six months later.

## Rung 3 — Project structure self-documenting

The directory layout makes the data flow obvious. Anything in `data/processed/` and `results/` is regeneratable from `data/raw/` plus the code in `scripts/` and `notebooks/`.

```
project/
  data/
    raw/         # immutable, never edited, never committed
    processed/   # generated, reproducible from raw + code
  envs/          # conda YAMLs
  scripts/       # shell, R, Python
  results/       # figures, tables — also reproducible
  notebooks/
  README.md
  .gitignore
```

If you find yourself making a manual edit to a file in `data/processed/`, that edit is a reproducibility hole. Either move the file to `data/raw/` (and accept that it is now an input) or change the script that produces it.

## Rung 4 — Data provenance recorded

Every public-database query is a committed script, not a manual download. The release/date of every external resource is recorded.

- A `versions.txt` (or a `provenance/` directory) capturing the Ensembl release, the NCBI assembly accession, the date of every API query.
- The retrieval scripts themselves, in `scripts/`, runnable end-to-end.
- For SRA/ENA reads: the accession list committed; the download script committed; checksums recorded for the local files.

Rung 4 is what separates an analysis you can rerun from an analysis you can rerun *with the same inputs you used the first time*. Public databases update; without rung 4, "I used Ensembl" is not a reproducible statement.

## Rung 5 — Pipelines as code

The orchestration of multi-step workflows is itself code, and itself versioned.

- For analyses you will run more than twice: a Nextflow or Snakemake pipeline, or an nf-core pipeline used as-is.
- For one-off exploratory work: a shell script with `set -euo pipefail`, parameterized, with logged outputs.
- Pipeline runs leave a directory of provenance (work directory, logs, hashes of inputs) behind them.

Rung 5 has real overhead. Don't climb it for a one-off script. Climb it the moment you find yourself running the same eight-step workflow twice.

## Rung 6 — Coding setup that catches mistakes early

The IDE is configured to the project's environment. Linters run on save. The debugger replaces print statements. Notebooks are diffed properly.

This rung does not directly improve reproducibility, but it dramatically improves the *correctness* of the artifacts you commit. A linter that catches a shadowed variable saves you from a result that is reproducibly wrong, which is worse than a result that is irreproducibly right.

## Where to start

If you are at rung 0, climb to rung 1 today. The conda YAML takes ten minutes.

If you are at rung 1, climb to rung 2 this week. `git init`, push, write a real README.

If you are at rung 2, climb to rung 3 the next time you start a project. Adopting the layout retroactively is harder than starting with it.

The rest of the ladder you climb when the work demands it.
