# Day 2 · Session 2 — Web-First: NCBI, Ensembl, UCSC

**Time.** 09:30–10:30 (60 min)
**Theme.** Data acquisition.
**Slides.** `slides/day2-02-web-portals.pptx`

## Goal

By the end of this session, learners can:

1. Find a gene record, its assembly, and its annotation files on NCBI.
2. Use Ensembl BioMart to extract a metadata table (gene IDs, biotypes, orthologs) without writing code.
3. Use UCSC's Genome Browser and Table Browser to load a custom track and extract intervals.
4. Identify the assembly version and resource release of any record they retrieve.

## Outline

| Time | What you do |
|------|-------------|
| 09:30–09:50 | NCBI walk-through. |
| 09:50–10:10 | Ensembl walk-through. |
| 10:10–10:25 | UCSC walk-through. |
| 10:25–10:30 | Common pitfalls; bridge to the programmatic session. |

## NCBI walk-through

A target task: starting from a gene name, end with downloadable annotation files.

1. Go to https://www.ncbi.nlm.nih.gov/gene/ and search for a gene (e.g., **TP53** for human; for the workshop microbe, pick one of its genes from `reference.gff`).
2. Land on the gene's record. Note the chromosome, the canonical RefSeq transcript, the gene type.
3. From the gene record, follow to the **Assembly** for the organism. Note the assembly name (e.g., GRCh38.p14) and the date.
4. On the assembly page, click "Download Assembly". Show the file types: genomic FASTA, GTF/GFF, protein FASTA, CDS FASTA. Stop short of downloading.
5. From the gene record, follow "SRA" or use **SRA Run Selector** (https://www.ncbi.nlm.nih.gov/Traces/study/) to find raw reads associated with a study.

Two things to point at:

- The **assembly accession** (e.g., `GCF_000001405.40`) is the stable handle. Save it.
- The download is one click in the web UI; the equivalent `datasets download genome accession GCF_000001405.40 --include gff3,gtf,protein` is one shell command in the next session. Both are reproducible *if and only if* you record the accession.

## Ensembl walk-through

Two things on Ensembl: the gene page, and BioMart.

### Gene page

1. https://ensembl.org → search for the same gene. Note the Ensembl gene ID (e.g., `ENSG00000141510`).
2. The release number is in the page header. Always record it.
3. Show "Comparative Genomics → Orthologues" — the cross-species ortholog table.
4. Show "Genomic alignments" if relevant.

### BioMart

1. Click **BioMart** (top nav) → choose **Ensembl Genes** → select species.
2. **Filters**: e.g., chromosome 17. **Attributes**: Gene stable ID, Gene name, Biotype, Description.
3. **Results** as TSV. This is a metadata extraction without writing a line of code.
4. Save the **XML query** (top right). This is what you commit to `scripts/biomart_query.xml` for reproducibility.

Why this matters: BioMart and `biomaRt` (R) speak the same XML query format. Once you know how to point-and-click a BioMart query, you can drop the XML into an R script and rerun it programmatically. The provenance survives.

## UCSC walk-through

UCSC's value is the browser plus the Table Browser; we demo both briefly.

### Genome Browser

1. https://genome.ucsc.edu → Genome Browser.
2. Pick the assembly that matches your data. **Read this twice.** GRCh37 vs. GRCh38 is the most common silent error.
3. Navigate to a region (a gene of interest). Show the default tracks: Genes, RefSeq, ENCODE.
4. **Add a custom track**: load a small BED or BedGraph from your project. The browser displays it in context. This is genuinely useful — five minutes of looking at a track in context catches errors that a coverage histogram does not.

### Table Browser

1. **Tools → Table Browser**.
2. Choose group/track (e.g., RefSeq Genes), set a region, output format BED.
3. Click **get output**. You now have an annotation BED you can use downstream.

Mention `liftOver` here: UCSC provides chain files and the `liftOver` tool to convert coordinates between assemblies. Lossy at the edges; record the chain file used.

## Common pitfalls to surface

- **Assembly mismatch.** A BED of variants from GRCh37 loaded onto GRCh38 will silently look wrong, not error out. Verify the assembly before you load tracks.
- **Symbol-based lookups.** "Search for gene X" using a symbol can return different records on NCBI and Ensembl. Use stable IDs once you have them.
- **Release drift.** A BioMart query rerun next month against the latest release returns different rows because the underlying annotation has changed. Pin the release in the query (Archive sites: https://archive.ensembl.org/).

## Bridge to the next session

Every action you did by clicking can be done by typing. The advantage of typing: it commits to the repo, it reruns identically, and it composes with the rest of your scripts. We turn to that now.
