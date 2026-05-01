# Workshop Glossary

A short glossary covering terms that matter across both days. We define them once here so the lesson notes can use them without re-teaching.

## Operational

**Shell.** The program that turns text you type into commands that run. Bash is the most common shell on Linux and macOS. The terminal is the window the shell runs in.

**Working directory.** The folder the shell is "in" right now. `pwd` prints it. Relative paths are interpreted relative to it.

**Path.** The address of a file. *Absolute* paths start at `/` and work everywhere; *relative* paths depend on the working directory.

**Login node.** The HPC computer you `ssh` into. It is shared and not for heavy work — only for editing files, submitting jobs, and small commands.

**Compute node.** The HPC computer your job actually runs on. You reach it via the scheduler (`sbatch`, `srun`).

**Scheduler.** The program that decides which compute node runs which job, and when. SLURM is the most common.

**Module system.** A mechanism (`module load`) some HPCs use to expose preinstalled software. Distinct from conda environments.

## Software environments

**Environment.** A self-contained directory of installed packages, isolated from the system Python or system R. Conda and mamba create environments. Activating one adjusts your `PATH` so `samtools`, `python`, etc., resolve to the env's copies.

**Conda / mamba.** Conda is the original package manager; mamba is a faster reimplementation that uses the same channels and YAMLs. Use mamba.

**Channel.** A repository conda pulls packages from. `bioconda` is the canonical channel for bioinformatics tools; `conda-forge` is the canonical channel for general scientific software.

**YAML file.** A plain-text file describing an environment (channels, packages, versions). It is the *artifact* you commit and ship.

**Container.** A more isolated environment that bundles the OS-level dependencies as well. Docker is the dominant local tool; Singularity/Apptainer is its HPC-friendly cousin.

## Genomics file formats

**FASTA.** Plain-text sequence (DNA, RNA, protein), one or more entries each with a `>` header line.

**FASTQ.** Sequencing reads — one entry per read, four lines: header, sequence, `+`, quality string. Quality is Phred-encoded as ASCII.

**Phred score.** `Q = -10 · log10(P)`, where `P` is the probability the base call is wrong. Q30 = 1 in 1000.

**SAM / BAM / CRAM.** Aligned reads. SAM is plain text; BAM is its binary form; CRAM is reference-compressed BAM.

**MAPQ.** A quality score in the SAM/BAM `MAPQ` column. Reflects confidence that the alignment is unique, *not* the quality of the underlying sequence.

**BED.** Genomic intervals (chrom, start, end, ...). 0-based, half-open.

**GFF / GTF.** Annotation features (gene, transcript, exon). 1-based, inclusive. GTF is a stricter dialect of GFF.

**VCF / BCF.** Variant calls. VCF is plain text; BCF is its binary form. 1-based, inclusive.

## Public databases

**RefSeq.** NCBI's curated reference annotation. Conservative, slow-moving.

**Ensembl.** EMBL-EBI's reference annotation. Released on a schedule (a number every quarter or so), faster-moving than RefSeq.

**Genome assembly.** A specific build of a reference genome (e.g., human GRCh38). Coordinates are not interchangeable between assemblies.

**Lift-over.** The process of translating coordinates between assembly versions. Lossy at the edges.

**SRA / ENA.** The two main archives of raw sequencing reads. Same data, two front doors.

**dbSNP / ClinVar / gnomAD.** Variant databases — known variants, clinically interpreted variants, and population-frequency data, respectively.

**GO / Reactome / KEGG.** Functional and pathway resources used in enrichment analysis.

## Statistical and analytical

**Coverage.** The number of reads overlapping a position. *Mean coverage* is a summary; the *distribution* is what matters.

**Duplicates.** Reads with identical alignment positions. Often artifacts of PCR; for amplicon protocols they are expected and not removed.

**Multiple testing.** When you test many hypotheses at once, controlling the per-test error rate (e.g., p < 0.05) leaves you with many false positives. Use FDR (BH) or family-wise (Bonferroni) correction; report adjusted p-values.

## Reproducibility

**Provenance.** A record of where data came from and how it was processed — input files, tool versions, parameters, command line, date.

**Pinning.** Specifying exact versions in a YAML or `requirements.txt` rather than letting "latest" drift over time.

**Pipeline manager.** A tool (Nextflow, Snakemake) that orchestrates multi-step workflows with provenance, resumption, and portability built in.

**nf-core.** A community-curated set of best-practice Nextflow pipelines for common analyses.
