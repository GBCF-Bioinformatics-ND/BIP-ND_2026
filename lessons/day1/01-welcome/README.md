# Day 1 · Session 1 — Welcome and the Mental Model

**Time.** 09:00–09:30 (30 min)
**Themes.** Preparations.
**Slides.** `slides/day1-01-welcome.pptx`

## Goal

By the end of this session, learners can:

1. Articulate, in one sentence each, the five themes that organize the workshop.
2. Draw the canonical genomics analysis chain (reads → QC → align/quantify → downstream → interpretation) and name what comes in and goes out at each step.
3. Explain why command-line and reproducibility are not aesthetic preferences but operational requirements.

## Outline

| Time | What you do |
|------|-------------|
| 09:00–09:05 | Welcome, code of conduct, etherpad pointer, sticky-note convention. |
| 09:05–09:10 | Introductions (each instructor and helper, 30s each). |
| 09:10–09:20 | The mental model: draw the analysis chain on the board; label the five themes. |
| 09:20–09:25 | Live demo: GUI vs. one shell command for the same task. |
| 09:25–09:30 | Schedule preview, expectations, questions. |

## Live demo: GUI vs. command line

The most effective opening of the workshop is a 5-minute side-by-side: do *exactly* the same thing twice, once by clicking and once by typing.

A defensible choice: count reads in a FASTQ file.

**The clicking version.** Open a file manager, navigate to the data, right-click → properties (size, but not read count). Open a text editor, open the file, scroll, give up because it is 500MB. This is the failure mode learners already know.

**The shell version.** In one line:

```bash
zcat sample.fastq.gz | wc -l | awk '{print $1/4}'
```

Narrate every piece. Don't explain the syntax in detail yet — that is the next session. The point is the *shape* of the answer: short, exact, scriptable, the same on every machine.

## The mental model

Draw this on the board (or use slide 5):

```
        [reads]                     [reference]
           │                            │
           ▼                            ▼
       ┌───────┐                    ┌────────┐
       │  QC   │                    │  index │
       └───┬───┘                    └───┬────┘
           │                            │
           └────────► [align/quantify]◄─┘
                            │
                            ▼
                   [counts | calls | peaks]
                            │
                            ▼
                  [downstream model: DE, GWAS, …]
                            │
                            ▼
                     [interpretation]
```

Three points to make explicitly while drawing:

1. **Most workflows share this backbone.** RNA-seq, variant calling, ATAC-seq, ChIP-seq — the boxes get renamed but the structure is the same.
2. **Each box is a decision.** Aligner choice. QC threshold. Normalization method. Statistical test. Most of bioinformatics is making and defending those decisions.
3. **The five themes are how we make those decisions defensible.** Preparations let you operate; environments make the decisions reproducible; workflow makes them legible to others; data acquisition gives them defensible inputs; reproducibility ties the whole thing together.

## Common misconceptions to surface

- "Bioinformatics is statistics." It is, but it is also operations. The hardest bug in your analysis is rarely a wrong test; it is a wrong file, a wrong path, or a wrong version.
- "I'll learn the shell when I need it." You need it now. Every tool worth using has a command-line interface as its primary interface.
- "Reproducibility is for big labs." Reproducibility is for *you*, six months from now, when a reviewer asks a question and you have to rerun the analysis.

## What learners walk away with

- The diagram above, on a sticky note or in the etherpad.
- The five theme names.
- A first taste of what command-line work looks like, before they have to type anything themselves.

## Helper notes

- Watch for learners who are silent during introductions. Pair them with a helper during the first exercise of Session 2.
- Make sure the etherpad URL is on a screen everyone can see. Write it on the board if the projector is unreliable.
