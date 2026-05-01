#!/usr/bin/env Rscript
# annotationhub_demo.R — retrieve a curated annotation through AnnotationHub.
#
# AnnotationHub is the Bioconductor cache for a wide catalog of curated
# annotations. Each resource has a stable AH ID and the release/snapshot date
# is recorded in the metadata — so the provenance you need is built in.
#
# Run:
#   Rscript annotationhub_demo.R <output_dir>

suppressPackageStartupMessages({
    library(AnnotationHub)
})

args <- commandArgs(trailingOnly = TRUE)
outdir <- if (length(args) >= 1) args[[1]] else "."
dir.create(outdir, recursive = TRUE, showWarnings = FALSE)

ah <- AnnotationHub(localHub = FALSE)

# Find the latest Ensembl GTF for human, GRCh38.
# We narrow by genome, source, and species, then pick the highest release.
hits <- query(ah, c("Ensembl", "GTF", "Homo sapiens", "GRCh38"))
message(sprintf("Found %d candidate resources", length(hits)))

if (length(hits) == 0) {
    stop("No matching AnnotationHub records. Check connectivity to the AnnotationHub backend.")
}

# Pick a specific record by AH ID for reproducibility. In a real project,
# you would commit this AH ID. For the demo, we take the most recent.
ah_id <- tail(names(hits), 1)
message(sprintf("Selected: %s — %s", ah_id, hits[[ah_id, "title"]]))

# Retrieve. The first time, this downloads to a local cache. Subsequent
# calls hit the cache.
gtf <- ah[[ah_id]]
message(sprintf("GTF has %d features", length(gtf)))

# Save a small summary for the project.
out <- file.path(outdir, "annotationhub_summary.tsv")
df <- data.frame(
    feature_type = names(table(gtf$type)),
    count        = as.integer(table(gtf$type))
)
write.table(df, out, sep = "\t", quote = FALSE, row.names = FALSE)

# Provenance — AH ID is the key.
versions <- file.path(outdir, "versions.txt")
cat(
    sprintf("annotationhub_id: %s\n", ah_id),
    sprintf("annotationhub_title: %s\n", hits[[ah_id, "title"]]),
    sprintf("annotationhub_query_date: %s\n", format(Sys.time(), "%Y-%m-%dT%H:%M:%SZ", tz = "UTC")),
    sprintf("AnnotationHub_version: %s\n", as.character(packageVersion("AnnotationHub"))),
    file = versions, append = TRUE
)
