# Day 1 · Session 5 — Project Structure and Version Control

**Time.** 15:00–16:15 (75 min)
**Themes.** Workflow + Reproducible Research.
**Slides.** `slides/day1-05-project-git.pptx`

## Goal

By the end of this session, learners can:

1. Lay out a bioinformatics project directory that makes the data flow obvious.
2. Initialize a Git repository, write a meaningful `.gitignore`, and commit incrementally.
3. Push a project to GitHub and confirm a stranger could clone it.
4. Explain why we never commit raw data, ever.

## Outline

| Time | What you do |
|------|-------------|
| 15:00–15:20 | The project layout. Walk through `project-template/` slowly. The "regeneratable from raw + code" rule. |
| 15:20–15:50 | Live: `git init`, `git status`, `git add`, `git commit`, `git log`, `git diff`. |
| 15:50–16:05 | `.gitignore` for bioinformatics. Push to GitHub. Show the rendered README. |
| 16:05–16:15 | Exercise: each pair pushes a project skeleton. |

## Project layout

```
project/
  data/
    raw/         # immutable, never edited, never committed
    processed/   # generated, reproducible from raw + code
  envs/          # conda YAMLs
  scripts/       # shell, R, Python
  results/       # figures, tables — also reproducible
  notebooks/
  README.md
  .gitignore
```

The principle: **anything in `data/processed/` and `results/` should be regeneratable from `data/raw/` plus the code in `scripts/` and `notebooks/`.**

A consequence: if you find yourself making a manual edit inside `data/processed/`, that edit is a reproducibility hole. Either move the file to `data/raw/` (and accept that it is now an input) or change the script that produces it.

The starter copy of this layout lives in `project-template/` in this directory.

## Live-coding script

```bash
# Start from the template
cp -r project-template my-first-project
cd my-first-project

# Initialize
git init
git status

# Stage everything
git add .
git status

# First commit
git commit -m "Initial project skeleton"
git log --oneline

# Make a change
echo "## Day 1 setup" >> README.md
git status
git diff
git add README.md
git commit -m "Document Day 1 setup in README"
git log --oneline
```

### `.gitignore`

The template ships with a `.gitignore` we walk through line by line. The bioinformatics-relevant entries:

```
# Never commit data
data/raw/
data/processed/
*.fastq
*.fastq.gz
*.bam
*.vcf
*.vcf.gz

# Pipeline artifacts
work/
.nextflow*
.snakemake/

# Environments
.conda/
.venv/
__pycache__/

# IDE
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json

# OS clutter
.DS_Store
```

The `!` lines are unignore patterns: they pull specific files back in. We unignore `settings.json` and `extensions.json` because we *want* those committed (they are the IDE config we teach in Day 2).

### Push to GitHub

```bash
# Once: configure your name/email globally
git config --global user.name "Your Name"
git config --global user.email "you@institution.edu"

# Create a repo on GitHub through the web UI, then:
git remote add origin git@github.com:<you>/my-first-project.git
git branch -M main
git push -u origin main
```

Reload the GitHub page; the README renders. That is the artifact a reviewer or collaborator sees.

## Misconceptions to surface

- **"Just this once" committing data is not just-this-once.** Once a 500MB FASTQ is in the history, it is in every clone of the repo forever, even if you `rm` it later. Removing files from history is annoying (`git filter-repo`, `bfg-repo-cleaner`); preventing them in the first place is one line in `.gitignore`.
- **`git add .` is convenient and dangerous in a directory full of BAMs.** Use `git status` first. Trust the `.gitignore`. When in doubt, `git add` named files explicitly.
- **Branches are not advanced.** They are routine. We don't teach them today because the skeleton-push doesn't need them, but learners should know branches exist and read the linked Carpentries Git lesson before their second project.
- **A README is not optional.** A README that explains how to recreate the env, where the data lives, and how to run the analysis is the difference between a project a stranger can revive and a tarball nobody opens.

## Common questions

- *"What about Git LFS for large files?"* Possible, but pricey at scale and not free on GitHub. For genomics, the right answer is "don't put it in Git." Use a data archive (Zenodo, Figshare, an institutional store) and link to it from the README.
- *"How do I undo a commit?"* `git reset HEAD~1` (keeps changes), `git reset --hard HEAD~1` (discards them — be careful). The full Git lesson covers this; today, we keep it linear.
- *"What if I accidentally committed a FASTQ?"* Mention `git filter-repo`. Don't demo it. Tell them to ask the core facility.
