# Solutions — Shell II + HPC

## 2.1 — Pipes practice

```bash
# 1. Lines that are not the header
tail -n +2 samplesheet.csv | wc -l
# or
grep -cv '^sample,' samplesheet.csv

# 2. Distinct conditions
cut -d, -f2 samplesheet.csv | tail -n +2 | sort -u | wc -l

# 3. Samples whose name contains 't' (case-insensitive)
cut -d, -f1 samplesheet.csv | tail -n +2 | grep -i 't'
```

## 2.2 — The script

The reference is at `count_reads.sh` in this directory. The minimum-correct version is:

```bash
#!/usr/bin/env bash
set -euo pipefail
DATA_DIR="${1:-.}"
for f in "$DATA_DIR"/*.fastq.gz; do
    n=$(zcat "$f" | awk 'END {print NR/4}')
    printf "%s\t%d\n" "$(basename "$f")" "$n"
done
```

The shipped reference adds: `nullglob` (so the loop is a no-op rather than a literal-`*` error if no files match), input-directory validation, and a mean-length calculation in a single `awk` pass.

## 2.3 — Submitting

```bash
mkdir -p logs
sbatch submit.sbatch "$WORKSHOP_DATA/samples"
squeue -u $USER
# Wait a moment; then:
cat logs/count_reads_*.out
cat logs/count_reads_*.err
```

If the job fails immediately and `.err` is empty: SLURM didn't accept it. Check `--time` and `--mem` syntax.

If `.err` contains "command not found: zcat" or similar: the conda env didn't activate on the compute node. Check the `source ... conda.sh` path and that the env exists.

## 2.4 — Reading from a samplesheet

```bash
#!/usr/bin/env bash
set -euo pipefail
SAMPLESHEET="${1:?Usage: $0 samplesheet.csv}"

tail -n +2 "$SAMPLESHEET" | while IFS=, read -r sample condition fq_r1 fq_r2; do
    n=$(zcat "$fq_r1" | awk 'END {print NR/4}')
    printf "%s\t%s\t%d\n" "$sample" "$condition" "$n"
done
```

Why this is better:

- Globbing iterates over whatever happens to be in the directory. A leftover `_old.fastq.gz` from someone else's experiment is now in your analysis.
- The samplesheet is the artifact you commit to Git. It is the *intent*. The filesystem is the *state*.
- Adding metadata (condition, batch, replicate) is now trivial — you already iterate over each row.
