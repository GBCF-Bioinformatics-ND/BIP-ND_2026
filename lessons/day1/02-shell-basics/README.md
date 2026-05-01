# Day 1 · Session 2 — Shell I: Navigation and Files

**Time.** 09:30–10:30 (60 min)
**Themes.** Preparations.
**Slides.** `slides/day1-02-shell-basics.pptx`

## Goal

By the end of this session, learners can:

1. Move around a filesystem with `pwd`, `ls`, `cd`, and tab completion.
2. Distinguish absolute and relative paths and predict which files a relative path resolves to.
3. Inspect files with `cat`, `less`, `head`, `tail`, `wc`.
4. Copy, move, and remove files with `cp`, `mv`, `rm`, and explain why `rm` has no trash.
5. Use globbing (`*`, `?`, `[abc]`) to operate on multiple files at once.

## Outline

| Time | What you do |
|------|-------------|
| 09:30–09:35 | Open a terminal, set the font size, narrate the prompt. |
| 09:35–09:50 | `pwd`, `ls`, `cd`, paths (the absolute-vs-relative slide is here). |
| 09:50–10:00 | `man`, tab completion, history, `↑`/`↓`. |
| 10:00–10:15 | `cat`, `less`, `head`, `tail`, `wc`. Inspect a real FASTQ. |
| 10:15–10:25 | `cp`, `mv`, `rm`. Globbing. The `rm -rf` warning. |
| 10:25–10:30 | Exercise (in `exercises.md`). |

## Live-coding script

```bash
# Where am I?
pwd

# What is here?
ls
ls -l
ls -la
ls -lah        # h = human-readable sizes

# Move
cd ~
pwd
cd /tmp
pwd
cd -           # "back where I was"

# Tab completion is your spell checker
cd ~/wo<TAB>   # completes to ~/workshop/

# Help
man ls
ls --help

# Look inside files
cat envs/workshop.yaml
less envs/workshop.yaml   # q to quit
head -n 20 envs/workshop.yaml
tail -n 5  envs/workshop.yaml
wc envs/workshop.yaml     # lines, words, bytes
wc -l envs/workshop.yaml

# A real bioinformatics file: a FASTQ
zcat /path/to/workshop/data/samples/sample_01_R1.fastq.gz | head -4
zcat /path/to/workshop/data/samples/sample_01_R1.fastq.gz | wc -l

# Copy, move, remove
cp envs/workshop.yaml /tmp/workshop.yaml
mv /tmp/workshop.yaml /tmp/workshop-copy.yaml
rm /tmp/workshop-copy.yaml

# Globbing: * matches anything, ? matches one character
ls envs/*.yaml
```

## Misconceptions to surface

- **The working directory is not where the script lives.** A script that says `read_data("data/raw/x.csv")` resolves that relative path against *the working directory at execution time*, not against the script's location. This catches every single learner eventually.
- **`~` is a shell expansion, not a filesystem root.** `~` expands to your home directory; it has no meaning to a Python program reading a config file unless that program expands it.
- **`rm` has no trash.** Once you run `rm`, the file is gone. There is no `.Trash` folder. We say this twice.
- **Spaces in filenames break naive scripts.** `My File.fastq.gz` is two arguments to most tools unless quoted. Don't put spaces in filenames you're going to script against.
- **Tab completion is not a convenience, it is a correctness tool.** It prevents the most common error (mis-typed paths) and shows you whether the file actually exists before you press enter.

## Things to watch for

- Learners who try to fight tab completion ("I'll just type it") — gently insist they use it. Once it is muscle memory, they stop making path typos.
- Learners who quit `less` with `Ctrl-C` instead of `q`. Show them `q` once, then twice if they forget.
- Learners on Windows whose paths show backslashes — they are not in WSL2. Pair them with a helper to fix this *now*, not later.
