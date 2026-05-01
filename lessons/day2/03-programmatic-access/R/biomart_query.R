#!/usr/bin/env Rscript
# biomart_query.R — pull a metadata table from Ensembl BioMart.
#
# Demonstrates:
#   - Pinning the Ensembl release for reproducibility
#   - A typical attribute/filter combination
#   - Writing both the result and a versions.txt
#
# Run:
#   Rscript biomart_query.R <output_dir> [<ensembl_release>]

suppressPackageStartupMessages({
    library(biomaRt)
})

args <- commandArgs(trailingOnly = TRUE)
outdir <- if (length(args) >= 1) args[[1]] else "."
release <- if (length(args) >= 2) as.integer(args[[2]]) else NULL

dir.create(outdir, recursive = TRUE, showWarnings = FALSE)

# Pin the release. Without `version`, BioMart serves whatever is current,
# and your query becomes irreproducible the moment Ensembl ships its next release.
mart <- if (!is.null(release)) {
    useEnsembl(biomart = "genes", dataset = "hsapiens_gene_ensembl",
               version = release)
} else {
    useEnsembl(biomart = "genes", dataset = "hsapiens_gene_ensembl")
}

# What do we want? A table of every protein-coding gene on chromosome 17,
# with its Ensembl ID, symbol, biotype, and one-line description.
res <- getBM(
    attributes = c("ensembl_gene_id", "external_gene_name", "gene_biotype",
                   "chromosome_name", "start_position", "end_position",
                   "description"),
    filters    = c("chromosome_name", "biotype"),
    values     = list("17", "protein_coding"),
    mart       = mart
)

# Write the result as TSV; commit this and the script.
out_tsv <- file.path(outdir, "chr17_protein_coding_genes.tsv")
write.table(res, file = out_tsv, sep = "\t", quote = FALSE, row.names = FALSE)
message(sprintf("wrote %d rows to %s", nrow(res), out_tsv))

# Provenance.
versions <- file.path(outdir, "versions.txt")
cat(
    sprintf("ensembl_release: %s\n",
            ifelse(is.null(release),
                   sub(".* version: ", "", capture.output(mart)[[1]]),
                   as.character(release))),
    sprintf("ensembl_query_date: %s\n", format(Sys.time(), "%Y-%m-%dT%H:%M:%SZ", tz = "UTC")),
    sprintf("biomaRt_version: %s\n", as.character(packageVersion("biomaRt"))),
    sprintf("R_version: %s\n", paste(R.version$major, R.version$minor, sep = ".")),
    file = versions, append = TRUE
)

# A snapshot of the full session, for the most pedantic reproducibility.
sink(file.path(outdir, "sessionInfo.txt"))
sessionInfo()
sink()
