# Day 2 · Session 6 — Putting It Together

**Time.** 15:45–16:30 (45 min)
**Theme.** Reproducible research.
**Slides.** `slides/day2-06-wrap-up.pptx`

## Goal

The closing session brings the two days together. By the end:

1. Learners walk through a full workflow once more — in VS Code, on the HPC, in their own project — to see every piece working together.
2. They locate themselves on the reproducibility ladder and pick which rung they will climb next.
3. They leave with a map of next-step tracks and a path to the core facility.

## Outline

| Time | What you do |
|------|-------------|
| 15:45–16:15 | The closing live walk-through (below). |
| 16:15–16:25 | The reproducibility ladder, made concrete by what they did. |
| 16:25–16:30 | Next-step tracks, feedback form, close. |

## The closing walk-through

Open VS Code. Connect to the HPC via Remote-SSH. Open yesterday's project. Activate the workshop env in the integrated terminal.

Then, in a single take, do this:

```bash
# 1. Pull a fresh annotation through the programmatic interface.
bash scripts/01_fetch_reference.sh "$ACCESSION" data/raw/ref

# 2. A small downstream script that produces a summary table.
python scripts/02_summarize_genes.py data/raw/ref/*/genomic.gff > results/gene_summary.tsv

# 3. Inspect the result in the IDE.
code results/gene_summary.tsv

# 4. Commit the new outputs (results are gitignored; the script and the
#    versions.txt are not).
git status
git add scripts/02_summarize_genes.py versions.txt
git commit -m "Add gene summary script and record annotation provenance"
git push
```

Then load the GitHub page on the projector. The README renders. The history shows the commits. The `versions.txt` is committed. A stranger could clone this, recreate the env, run the scripts, and reproduce the table. **That is the artifact.** That is what the two days were for.

A note: if compute nodes do not have outbound network egress, run the fetch on the login node, then `git push` from there. The lesson is the same.

## The reproducibility ladder

Walk through it on the projector (`docs/reproducibility-ladder.md`). For each rung, ask the room: "raise your hand if you climbed this rung today." Most hands go up for rungs 1–4. Some for rung 5. Rung 6 (the IDE setup) is what they did this afternoon — every hand should go up.

Then ask the harder question: "raise your hand if your *current* projects are at rung 4." Fewer hands. The point lands.

## Next-step tracks

A short, honest map. Resist the temptation to recommend everything; pick the two or three that match the audience.

- **Bulk RNA-seq.** A salmon → tximeta → DESeq2 thread. Add edgeR/limma for breadth. The next workshop the audience is likely to want.
- **Single-cell RNA-seq.** Scanpy or Seurat. Big, opinionated. We point at OSCA (Bioconductor) and the scanpy tutorials.
- **Variant calling.** Bacterial vs. human are different problems. nf-core/sarek for human; nf-core/bacass or `snippy` for bacterial.
- **ATAC-seq / multiome.** A more involved workflow. nf-core/atacseq is a defensible starting point.
- **Networks and integration.** Topic-specific; we recommend talking to the core facility.
- **Statistics for genomics.** A real course, not a session. Recommend a textbook (Modern Statistics for Modern Biology by Holmes & Huber is freely online).

## The core facility

Tell learners how to engage. Office hours, request form, email. Be specific about what consultation can do and what it cannot. Set expectations.

## Feedback

Anonymous form, sent right now while the room is full. Read the responses on the train home; act on them in the next iteration of the workshop.

## Final note

The two days end the same way they began: with the diagram. Redraw the analysis chain. Now ask the room to point at every place where what they did this week made each step more defensible. There should be a hand for every box.
