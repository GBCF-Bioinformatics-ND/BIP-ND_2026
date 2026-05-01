# Pre-Workshop Setup

Read this email a week before the workshop. The setup itself takes 30–60 minutes; the drop-in help session the afternoon before Day 1 exists to handle the parts that go wrong on your particular laptop. Do not skip it.

## What you need before Day 1

1. **A laptop with a working terminal.**
   - macOS: the built-in Terminal is fine.
   - Linux: any terminal emulator.
   - Windows: install [Windows Subsystem for Linux 2 (WSL2)](https://learn.microsoft.com/en-us/windows/wsl/install) and use Ubuntu. Git Bash is acceptable as a fallback but loses functionality.
2. **An account on the HPC** that the workshop runs on. Test that you can `ssh` in. If two-factor authentication is required, make sure your second factor is set up and working.
3. **Mamba** (preferred) or **conda** installed *on the HPC* (or locally if you do not have HPC access). Miniforge is the easiest installer:
   ```bash
   wget "https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-$(uname)-$(uname -m).sh"
   bash Miniforge3-$(uname)-$(uname -m).sh -b -p "$HOME/miniforge3"
   "$HOME/miniforge3/bin/mamba" init bash
   exec bash
   ```
4. **VS Code** installed locally. From inside VS Code, install these extensions:
   - Remote - SSH (Microsoft)
   - Python (Microsoft)
   - R (REditorSupport)
   - Jupyter (Microsoft)
   - GitLens (GitKraken)
   - YAML (Red Hat)
5. **A GitHub account.** [Create one](https://github.com/join) if you do not have one. Generate an SSH key on your laptop and on the HPC, and add both public keys to your GitHub account ([instructions](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)).
6. **The workshop conda environments**, created from the YAMLs in this repository:
   ```bash
   git clone https://github.com/<workshop-org>/BIP-ND-2026.git
   cd BIP-ND-2026
   mamba env create -f envs/workshop.yaml
   ```

## Verify your setup

After installing everything, run:

```bash
bash scripts/setup-check.sh
```

It prints versions of every tool the workshop uses and exits with a non-zero status if anything is missing. Bring the output to the drop-in help session if anything fails.

## What we will provide

- The workshop dataset (a small bacterial reference and short-read samples), staged on the HPC at a path we will share by email the day before Day 1.
- An etherpad/HackMD link for shared notes and questions.
- A workshop GitHub organization where each pair will push their project repo.

## Code of conduct and accessibility

This workshop follows [The Carpentries Code of Conduct](https://docs.carpentries.org/policies/coc/). Read it. If you need any accessibility accommodation (captioning, larger fonts in live coding, breaks beyond the schedule), email the instructor before the workshop — we would much rather adjust the delivery than have you struggle silently.

## What if I cannot get the setup working?

Come to the drop-in session, or email the instructor. We would rather spend an hour with you the day before than have you miss Day 1 morning debugging a path issue.
