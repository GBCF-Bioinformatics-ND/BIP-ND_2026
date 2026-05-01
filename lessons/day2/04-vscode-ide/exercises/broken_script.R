# broken_script.R — a deliberately messy R script for the linting exercise.
#
# Open in VS Code with the R extension and lintr enabled. Save. The diagnostics
# appear. Some are stylistic; some are real bugs.

library(dplyr)
library(readr)
library(stringr)  # unused — lintr unused_import_linter

# Bug: assignment with = inside a function call boundary.
parse_samplesheet = function(path){
  df<-read_csv(path,show_col_types=FALSE)
  return(df)
}

# Bug: variable name `T` shadows TRUE.
summarize_reads = function(df){
  T = 0
  for (n in df$read_count){
    T = T+n
  }
  return(T)
}

main <- function(argv) {
  ss <- argv[1]
  df <- parse_samplesheet(ss)
  total <- summarize_reads(df)
  cat(sprintf("total reads across %d samples: %d\n", nrow(df), total))
}

args <- commandArgs(trailingOnly = TRUE)
main(args)
