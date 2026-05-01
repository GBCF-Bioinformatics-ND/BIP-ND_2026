# Solutions — Environments

## 4.1 — Pin a version

The relevant YAML edit:

```yaml
dependencies:
  - python=3.11
  - samtools=1.21
  - bcftools=1.21
```

Verification:

```bash
mamba env create -f starter-env.yaml -n my-project-pinned
mamba activate my-project-pinned
samtools --version | head -1     # should show 1.21
```

## 4.2 — Why pinning matters

A short, defensible answer:

> Pin `samtools=1.21` because tool behavior (defaults for filters, MAPQ thresholds, output formats) changes between versions and is part of the experimental method you are reporting. Don't pin `python=3.11.7` because the patch version is a runtime detail that does not change the *result*; pinning it tightens the env's solvability without buying you any reproducibility.

The general rule: pin what is on the experimental path. Let the rest float.

## 4.3 — Recovery

Three commands worth asking for:

```bash
mamba list                                 # what is in the active env
which samtools && samtools --version       # is the right samtools active
mamba env export --no-builds               # full snapshot, ready to diff
```

Together these tell you (a) which env is active, (b) which version of the tool is on PATH, (c) the full installed set you can diff against your own.

## 4.4 — Lock files

`mamba env export --no-builds` produces a portable, human-readable list of `name=version` entries. It is what most people share alongside (or instead of) the YAML.

`mamba env export --explicit` produces a fully resolved list of URLs to the exact package builds. It is platform-specific and reproduces *bit-exactly* on the same OS/architecture, but is unusable on a different one.

Use the first for portable "I want to be able to recreate this on my collaborator's Mac." Use the second when you need true bit-exactness, typically as a CI artifact or a release pin. `conda-lock` and `pixi` produce multi-platform lock files and are increasingly the right tool here.
