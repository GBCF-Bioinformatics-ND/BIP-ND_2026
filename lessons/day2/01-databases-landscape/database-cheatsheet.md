# Database Cheatsheet

A one-page reference of the resources we touch during the workshop and the canonical entry points. Print this; pin it next to your monitor.

## Sequence and annotation

| Resource | URL | What you go there for | Programmatic |
|---|---|---|---|
| NCBI Datasets | https://www.ncbi.nlm.nih.gov/datasets/ | assemblies, annotations, gene records | `datasets` CLI |
| RefSeq | https://www.ncbi.nlm.nih.gov/refseq/ | curated reference annotation | via `datasets`, EDirect |
| Ensembl | https://ensembl.org | reference annotation, BioMart | `biomaRt`, `pyensembl`, REST |
| Ensembl Genomes | https://ensemblgenomes.org | non-vertebrate Ensembl (plants, fungi, protists, bacteria, metazoa) | same as above |
| UCSC | https://genome.ucsc.edu | browser, Table Browser, custom tracks | UCSC API, `rtracklayer` |
| GENCODE | https://www.gencodegenes.org | extended Ensembl annotation for human/mouse | FTP, REST |

## Raw reads

| Resource | URL | Note |
|---|---|---|
| NCBI SRA | https://www.ncbi.nlm.nih.gov/sra | `prefetch` + `fasterq-dump` (SRA Toolkit) |
| ENA | https://www.ebi.ac.uk/ena | direct FASTQ FTP — often easier than SRA |
| DDBJ DRA | https://www.ddbj.nig.ac.jp/dra/ | the Japanese mirror |

## Variants

| Resource | URL | Note |
|---|---|---|
| dbSNP | https://www.ncbi.nlm.nih.gov/snp/ | known variants, builds versioned |
| ClinVar | https://www.ncbi.nlm.nih.gov/clinvar/ | clinical interpretation; dated VCF dumps |
| gnomAD | https://gnomad.broadinstitute.org | population frequencies; v2 vs v3 vs v4 are different cohorts |
| COSMIC | https://cancer.sanger.ac.uk/cosmic | somatic in cancer; license terms apply |

## Expression and function

| Resource | URL | Note |
|---|---|---|
| GEO | https://www.ncbi.nlm.nih.gov/geo/ | series (GSE) and samples (GSM) |
| ArrayExpress / BioStudies | https://www.ebi.ac.uk/biostudies | EBI's archive |
| GTEx | https://gtexportal.org | normal-tissue expression |
| Human Protein Atlas | https://www.proteinatlas.org | tissue expression at protein and RNA level |
| Gene Ontology | http://geneontology.org | functional categories; hierarchical |
| Reactome | https://reactome.org | pathways, free programmatic access |
| KEGG | https://www.kegg.jp | pathways; **bulk programmatic use is licensed** |
| MSigDB | https://www.gsea-msigdb.org | curated gene sets for GSEA |

## Single-cell

| Resource | URL | Note |
|---|---|---|
| CellxGene | https://cellxgene.cziscience.com | curated single-cell datasets |
| Human Cell Atlas | https://www.humancellatlas.org | data and tools |

## Regulatory / epigenomic

| Resource | URL | Note |
|---|---|---|
| ENCODE | https://www.encodeproject.org | regulatory elements, ChIP-seq, ATAC-seq |
| JASPAR | https://jaspar.genereg.net | TF binding motifs |
| Roadmap Epigenomics | https://egg2.wustl.edu/roadmap/ | reference epigenomes |

## Proteins and structures

| Resource | URL | Note |
|---|---|---|
| UniProt | https://www.uniprot.org | curated protein records; REST API |
| InterPro | https://www.ebi.ac.uk/interpro/ | protein domains and families |
| AlphaFold DB | https://alphafold.ebi.ac.uk | predicted structures |
| PDB | https://www.rcsb.org | experimental structures |

## Non-model and microbial

| Resource | URL | Note |
|---|---|---|
| Ensembl Genomes | https://ensemblgenomes.org | plants, fungi, protists, bacteria, metazoa |
| Phytozome | https://phytozome-next.jgi.doe.gov | plants (JGI) |
| TAIR | https://www.arabidopsis.org | *Arabidopsis* |
| GTDB | https://gtdb.ecogenomic.org | genome-based bacterial/archaeal taxonomy |
| MGnify | https://www.ebi.ac.uk/metagenomics/ | metagenomics |
| OrthoDB | https://www.orthodb.org | orthology across the tree of life |

## Provenance: what to record for every query

For every resource you query in an analysis, record:

- **Resource name** (e.g., Ensembl)
- **Release / build / date** (e.g., release 111, dbSNP build 156, ClinVar 2024-04-01)
- **Assembly** if applicable (e.g., GRCh38)
- **Query / accession** (the gene, the chromosome region, the dataset ID)
- **Date you ran the query**

Put this in `versions.txt` (or a structured `provenance.yaml`) at the project root and commit it. Do this from the start; it is far easier than reconstructing it later.
