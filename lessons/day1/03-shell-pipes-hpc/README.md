# Day 1 · Session 3 — Shell II: Pipes, Scripting, and the HPC

**Time.** 10:45–12:15 (90 min)
**Themes.** Preparations + Workflow.
**Slides.** `slides/day1-03-shell-pipes-hpc.pptx`

## Goal

By the end of this session, learners can:

1. Combine `grep`, `cut`, `sort`, `uniq`, `wc` with pipes and redirection to answer questions about text files.
2. Write a shell script with a shebang, `set -euo pipefail`, variables, and a `for` loop.
3. Recognize the components of an `sbatch` submission and what login-vs-compute-node means.
4. Submit a job, find its stdout/stderr, and explain why their job died (when it does).

## Outline

| Time | What you do |
|------|-------------|
| 10:45–11:05 | Pipes and redirection (`|`, `>`, `>>`, `2>`, `2>&1`). |
| 11:05–11:25 | `grep`, `cut`, `sort`, `uniq -c`, `wc -l` with worked examples. |
| 11:25–11:50 | Writing a shell script: shebang, `set -euo pipefail`, variables, `for` loop. |
| 11:50–12:05 | HPC etiquette: login vs. compute, `sbatch`, `srun`, `squeue`, scratch vs. home. |
| 12:05–12:15 | Exercise: submit `count_reads.sh` as a SLURM job; recover stdout and stderr. |

## Live-coding script

### Pipes and redirection

```bash
# A pipe sends the stdout of one command to the stdin of the next.
ls -l envs/ | wc -l

# Redirection writes stdout to a file.
ls -l envs/ > /tmp/listing.txt
cat /tmp/listing.txt

# Append, don't overwrite.
echo "added later" >> /tmp/listing.txt

# stderr is a separate stream.
ls /tmp/does-not-exist 2> /tmp/err.txt
cat /tmp/err.txt

# Combine streams.
ls /tmp/does-not-exist > /tmp/out.txt 2>&1
```

### The Unix toolbox

```bash
# A real example. Given a samplesheet:
#   sample,condition,fastq_r1,fastq_r2
#   s01,control,/data/s01_R1.fq.gz,/data/s01_R2.fq.gz
#   s02,control,...
#   s03,treated,...

# How many samples per condition?
cut -d, -f2 samplesheet.csv | tail -n +2 | sort | uniq -c

# Which samples are 'treated'?
grep ',treated,' samplesheet.csv | cut -d, -f1
```

### A shell script

```bash
#!/usr/bin/env bash
# count_reads.sh — print the read count of every FASTQ in a directory.
set -euo pipefail

DATA_DIR="${1:-.}"

for f in "$DATA_DIR"/*.fastq.gz; do
    n=$(zcat "$f" | awk 'END {print NR/4}')
    printf "%s\t%d\n" "$(basename "$f")" "$n"
done
```

Three things to point out:

1. `set -euo pipefail`. `-e` exits on any failed command; `-u` errors on unset variables; `-o pipefail` makes pipelines fail when any stage does. Always.
2. `"${1:-.}"`. The first argument, defaulting to `.` if not provided.
3. The double quotes around `"$DATA_DIR"` and `"$f"`. Without them, a path with a space breaks the loop.

### HPC

The slide diagram: laptop → SSH → login node → SLURM → compute node.

```bash
# What scheduler do we have?
which sbatch sinfo squeue

# A minimal sbatch script
cat > /tmp/job.sbatch <<'EOF'
#!/usr/bin/env bash
#SBATCH --job-name=count
#SBATCH --time=00:05:00
#SBATCH --mem=1G
#SBATCH --cpus-per-task=1
#SBATCH --output=count_%j.out
#SBATCH --error=count_%j.err

set -euo pipefail
bash count_reads.sh "$WORKSHOP_DATA/samples"
EOF

sbatch /tmp/job.sbatch
squeue -u $USER
```

Discuss the `%j` substitution (the job ID), why we always set `--time` and `--mem`, and what scratch is for.

## Misconceptions to surface

- **`>` overwrites silently.** No prompt, no confirmation, no recovery. `>>` appends.
- **A `for` loop is not parallelism.** It runs the iterations one at a time. Real parallelism comes from a job array, GNU `parallel`, or a workflow manager.
- **`$VAR` vs. `"$VAR"` is not stylistic.** Unquoted `$VAR` undergoes word splitting and globbing. Quote your variables.
- **The login node is not for analysis.** It is shared. Running an alignment on it is anti-social and your sysadmin will notice.
- **A failed `sbatch` job is not an error.** SLURM accepted it; what failed is your *job*. The error is in the `--error=` file, not the `sbatch` return value.
