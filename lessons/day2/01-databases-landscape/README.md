# Day 2 · Session 1 — Recap and the Landscape of Genomic Databases

**Time.** 09:00–09:30 (30 min)
**Themes.** Data acquisition + Preparations.
**Slides.** `slides/day2-01-databases-landscape.pptx`

## Goal

By the end of this session, learners can:

1. Recall the five themes and the project layout from Day 1.
2. Name the major public resources for sequence, annotation, expression, variants, regulatory, and protein data — and what each holds.
3. Explain why "I used Ensembl" without a release number is not a reproducible statement.

## Outline

| Time | What you do |
|------|-------------|
| 09:00–09:05 | Day 1 retrospective: read sticky notes aloud, address common confusions. |
| 09:05–09:20 | The database landscape: a single concept map, organized by what each holds. |
| 09:20–09:25 | The "release matters" point — RefSeq vs. Ensembl, lift-over, cross-resource ID mapping. |
| 09:25–09:30 | What we will do for the rest of the morning. |

## The map

Two slides (`slides/day2-01-databases-landscape.pptx`) cover this. The map below is what learners should leave with.

| Category | Resources |
|---|---|
| **Sequence and assemblies** | NCBI GenBank/RefSeq · Ensembl / Ensembl Genomes · UCSC · DDBJ / ENA |
| **Raw sequencing reads** | SRA (NCBI) · ENA (EMBL-EBI) · DDBJ DRA |
| **Functional annotation** | Gene Ontology · Reactome · KEGG (note licensing) · MSigDB |
| **Variants** | dbSNP · ClinVar · gnomAD · COSMIC |
| **Expression** | GEO · ArrayExpress / BioStudies · GTEx · Human Protein Atlas |
| **Single-cell** | CellxGene · Human Cell Atlas |
| **Regulatory / epigenomic** | ENCODE · JASPAR · Roadmap Epigenomics |
| **Proteins / structures** | UniProt · InterPro · AlphaFold DB · PDB |
| **Non-model and microbial** | Ensembl Genomes · Phytozome · TAIR · GTDB · MGnify · OrthoDB |

The point is the *map*, not the catalog. Learners do not memorize accessions; they learn where to look.

## Two principles to repeat

1. **The right resource is the one whose curation choices match your question.** RefSeq and Ensembl annotate the same human genome and disagree on hundreds of genes' boundaries. Pick one. Document the choice.
2. **A resource without a release/date is not a reproducible source.** Ensembl ships a numbered release on a schedule. dbSNP has builds. ClinVar has dated dumps. SRA accessions are stable, but the underlying metadata can be revised. Record the version of every resource you query.

## Common misconceptions

- **"Mapping by gene symbol is fine."** It is not. Symbols are aliased, deprecated, and renamed. Use stable IDs (Ensembl IDs, NCBI Gene IDs) and convert at the boundary, not in the middle.
- **"Coordinates are coordinates."** They are not. GRCh37 ≠ GRCh38; mm9 ≠ mm10 ≠ mm39. Lift-over is lossy at the edges (regions absent from one assembly, regions inverted between them).
- **"Mixing RefSeq and Ensembl annotations in one analysis is fine."** It is not. The transcripts disagree. Pick one.

## Helper notes

This is a quick session. The risk is that learners feel like they are drinking from a firehose and lose the through-line. End the session with the *one* takeaway: "for every external resource you use today, you will commit a query script and a release/date. Watch how this changes what your repo looks like."
