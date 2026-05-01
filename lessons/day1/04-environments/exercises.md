# Exercises — Environments

## Exercise 4.1 — Pin a version

Edit `starter-env.yaml` so that `samtools` is pinned to a specific version (look up the latest at https://anaconda.org/bioconda/samtools). Recreate the environment under a new name:

```bash
# Edit the file first, then:
mamba env create -f starter-env.yaml -n my-project-pinned
mamba activate my-project-pinned
samtools --version | head -1
```

Confirm that the version matches what you pinned.

## Exercise 4.2 — Why pinning matters

In one sentence in the etherpad, answer: why would you pin `samtools=1.21` in a project YAML, but *not* pin `python=3.11.7` (only `python=3.11`)?

## Exercise 4.3 — Recovery

Imagine your collaborator emails you saying "I ran your pipeline; got different results." You suspect the env. List three commands you would ask them to run that would tell you whether the env is the culprit.

## Exercise 4.4 (stretch) — Lock files

Read `mamba env export -n my-project --no-builds` and `mamba env export -n my-project --explicit` (or `conda-lock` if it is installed). Note the difference. When would you use each?
