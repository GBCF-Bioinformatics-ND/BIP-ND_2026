# Workshop data

The repository deliberately does not ship raw data. We never commit FASTQs, BAMs, or VCFs to Git, and the workshop teaches that practice from Day 1.

The workshop *is* designed around a small dataset that the instructor stages on the HPC ahead of delivery. The goal is something small enough to inspect in seconds and large enough to expose every file format and decision point in the canonical genomics chain.

## What to stage

A reference bacterial genome and 4–6 short-read samples is the recommended scaffold:

| File | Purpose |
|------|---------|
| `reference.fasta` | a few-Mb bacterial reference assembly |
| `reference.gff` | annotation matching the assembly |
| `samples/*.fastq.gz` | 4–6 paired-end short-read libraries, ~500k reads each |
| `samplesheet.csv` | sample name, condition, paths to R1/R2 |

A bacterial reference (a few Mb) is a deliberate choice: it indexes in seconds, aligns in seconds, and a learner can read the whole VCF if they want to. A human chromosome is too large for a 2-day workshop's pace.

## Where to get it

Two reliable choices:

1. **A real public dataset.** Pick a small bacterial study from SRA/ENA. *E. coli* O157:H7 outbreak isolates, *Mycobacterium tuberculosis* isolates, or *Streptococcus pneumoniae* serotypes all work well at this scale. A study with two visible groups (e.g., two outbreak clusters) lets the Day 2 wrap-up include a meaningful comparison.

2. **A synthetic dataset.** Simulate reads with `wgsim` or `dwgsim` from a small reference (e.g., *E. coli* K-12 MG1655). This gives you full control over coverage, expected variants, and contamination.

The workshop's pedagogical points do not depend on which of these you pick.

## Layout on the HPC

We recommend staging the data outside any learner's home directory, at a shared read-only path:

```
/path/to/workshop/data/
  reference.fasta
  reference.fasta.fai
  reference.gff
  samples/
    sample_01_R1.fastq.gz
    sample_01_R2.fastq.gz
    sample_02_R1.fastq.gz
    ...
  samplesheet.csv
```

Send the path to learners by email the day before Day 1. Each learner will copy the samplesheet into their own project on Day 1 afternoon, but never copy the FASTQs themselves — they will reference the shared path.

## A note on the .gitignore

The `.gitignore` at the repository root excludes `data/raw/` and `data/processed/`, plus all the common bioinformatics file extensions. This is the `.gitignore` we teach in `lessons/day1/05-project-git`. Do not commit data here, ever.
