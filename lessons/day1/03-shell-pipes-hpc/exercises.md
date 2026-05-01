# Exercises — Shell II + HPC

## Exercise 2.1 — Pipes practice

Using only commands from this session and the previous one, answer:

1. How many lines in `samplesheet.csv` are *not* the header?
2. How many distinct values appear in the `condition` column?
3. Which sample names contain the letter `t` (case-insensitive)?

## Exercise 2.2 — Write the script

Write a 12-line shell script `count_reads.sh` that:

1. Takes a directory as its first argument.
2. Loops over every `.fastq.gz` file in it.
3. Prints, for each file: the basename, the read count, and the average read length.

Use `set -euo pipefail`. Use double quotes around variables. Don't peek at the reference solution until you have tried.

## Exercise 2.3 — Submit it as a SLURM job

Adapt `submit.sbatch` to:

1. Create a `logs/` directory if missing.
2. Submit `count_reads.sh` against the workshop dataset.
3. Confirm it ran: `squeue -u $USER`, then `cat logs/count_reads_*.out`.

If the job fails, find out why from `logs/count_reads_*.err` and fix it.

## Stretch — Exercise 2.4

Modify `count_reads.sh` so that instead of `for f in *.fastq.gz`, it reads filenames from a samplesheet (column 3 = R1 path). Hint: `tail -n +2 samplesheet.csv | cut -d, -f3 | while read f; do …`.

Why is reading from a samplesheet better than globbing the filesystem? (Answer: because the samplesheet is the *contract* with the rest of your project; the filesystem is what happens to be there today.)
