# Day 1 · Session 4 — Environments

**Time.** 13:15–14:45 (90 min)
**Theme.** Environments.
**Slides.** `slides/day1-04-environments.pptx`

## Goal

By the end of this session, learners can:

1. Explain why software environments exist and what an environment isolates.
2. Create a conda/mamba environment from a YAML, activate it, verify what is inside, and update it.
3. Write a YAML for a new project pinning the versions that matter.
4. Describe what containers add to environments and when to reach for them.
5. Reason about conflicts between HPC `module` systems and conda.

## Outline

| Time | What you do |
|------|-------------|
| 13:15–13:30 | Why environments. The "samtools 1.17 vs 1.9" story; demo how silently broken this can be. |
| 13:30–14:00 | Live: `mamba env create -f`, `mamba activate`, `which`, `--version`, `mamba env update`. |
| 14:00–14:20 | Writing a YAML from scratch. Channel order, version pinning, `pip` block. |
| 14:20–14:35 | Containers: what, when, how (conceptual + one demo `singularity run`). |
| 14:35–14:45 | Exercise: pin a version, recreate, verify. |

## Live-coding script

### Why environments exist

Open with the demo learners actually feel:

```bash
which python
python --version
which samtools 2>/dev/null || echo "no samtools"
```

Now activate the workshop env:

```bash
mamba activate workshop
which python
python --version
which samtools
samtools --version
```

The `which` output changed. That is what activation does — it adjusts your `PATH` so the tools resolve to the env's copies. Nothing magical; nothing that would persist across `mamba deactivate`.

### Creating from a YAML

```bash
cat envs/workshop.yaml
mamba env create -f envs/workshop.yaml
mamba activate workshop
mamba list | head
```

### Updating an environment

```bash
# Edit YAML, e.g. add 'tree'
mamba env update -f envs/workshop.yaml
# Or, in-place
mamba install -n workshop tree
```

A note: `env update` does not *remove* packages you removed from the YAML. To get a clean state, `mamba env remove -n workshop` and recreate.

### A YAML from scratch

```yaml
name: my-project
channels:
  - conda-forge
  - bioconda
  - nodefaults
dependencies:
  - python=3.11
  - samtools=1.21
  - bcftools=1.21
  - pip
  - pip:
      - some-pure-python-package==1.2.3
```

Three things to point out:

1. **Channel order matters.** `conda-forge` first, `bioconda` second, `nodefaults` to keep the slow `defaults` channel out. This is the consensus order today; mixing them in another order produces confusing solver failures.
2. **Pin what matters.** `samtools=1.21` is the kind of pin that protects you. Pinning *every* package's patch version on day one makes the env un-solvable in six months. Pin the tools whose behavior is the experimental variable; let the rest float.
3. **`pip` is for pure-Python packages not on conda.** Mixing pip and conda in the same env is fine if pip is the *last* thing installed and the package has no compiled dependencies.

### Containers

```bash
# Pull a container; runs the same anywhere Singularity does
singularity pull docker://quay.io/biocontainers/samtools:1.21--h50ea8bc_0
singularity exec samtools_1.21--h50ea8bc_0.sif samtools --version
```

When to reach for a container:

- The tool needs a system library not available through conda.
- You need bit-exact reproducibility (the env on disk + the OS userspace are pinned).
- A Bioconductor cocktail and a Python package fight each other; isolating each in a container resolves it.

When *not*:

- For most workshop-style work, conda is enough. Containers add a build step and a registry to manage. Don't pay that cost without the benefit.

### Modules vs. conda on HPC

If your HPC has a module system:

```bash
module avail samtools
module load samtools/1.17
which samtools
```

Two rules:

1. Don't mix conda and modules in the same shell session unless you know exactly what your `PATH` looks like.
2. If both exist for a tool, prefer conda — it is portable to your laptop and to other HPCs. Modules are local.

## Misconceptions to surface

- **`pip install` inside an active conda env can quietly break it.** Pip and conda do not communicate about dependency resolution. Conda packages that compile against a specific NumPy ABI can break when pip upgrades NumPy underneath them.
- **`base` is not where you should be installing.** The `base` env is for `conda` itself. Every project gets its own env.
- **`which` is your friend when something runs the wrong version.** If `samtools --version` reports an unexpected version, `which samtools` tells you which copy ran. Nine times out of ten the env is not active or the wrong env is active.
- **A `.yaml` and a `lock file` are different things.** The YAML says "I want these things"; the lock file says "I got exactly these versions on this platform on this date." For maximum reproducibility, use both. Today we ship YAMLs; lock files are a stretch goal.

## Common questions

- *"Why mamba and not conda?"* Mamba uses a faster solver. Same channels, same YAMLs. The newer `conda` (≥ 23.10) uses the same solver via `libmamba`, so the gap is narrowing. Either is fine.
- *"What about pixi/uv/poetry?"* Newer tools, often faster, often better for pure-Python work. Mention them as alternatives; conda/mamba is still the field default for bioinformatics because Bioconductor/bioconda live there.
- *"Do I have to recreate the env every time?"* No. Activate it, work in it, deactivate. The env persists in `$HOME/miniforge3/envs/<name>` until you `mamba env remove`.
