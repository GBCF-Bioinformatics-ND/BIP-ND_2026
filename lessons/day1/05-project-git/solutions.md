# Solutions — Project Structure and Git

## 5.1 — Initialize

```bash
cp -r project-template ~/my-workshop-project
cd ~/my-workshop-project
git init
git add .
git commit -m "Initial project skeleton"
# Create the GitHub repo through the web UI, then:
git remote add origin git@github.com:<you>/my-workshop-project.git
git branch -M main
git push -u origin main
```

Common failure: `Permission denied (publickey)` on push. The fix is the SSH key, not the URL. Verify with `ssh -T git@github.com`.

## 5.2 — Add and commit something real

```bash
# Edit README.md with your editor of choice
git diff README.md
git add README.md
git commit -m "Describe project goal and stub Methods section"
git push
```

If the commit message is "wip" or "update", push back during review: messages are read by collaborators (including future-you). They are worth thirty seconds of thought.

## 5.3 — The .gitignore catches a mistake

`git status` does not show the FASTQ because:

- Anything matching `*.fastq` is ignored.
- `data/processed/` and `data/raw/` are themselves ignored.

Belt and suspenders: even if one pattern were removed, the other would still hide the file.

If `data/raw/` were *not* in `.gitignore` and the file extension entries were *also* missing, `git add .` in this state would commit the FASTQ. The history would then contain the file forever, even after `rm` and a new commit. The fix in that scenario is `git filter-repo` or `bfg-repo-cleaner`, which is annoying enough that we make a habit of avoiding it.

## 5.4 — Cloneability check

The point of the exercise is the gap, not the fix. Common gaps surfaced in workshops:

- The README references `<env-name>` without saying what it is.
- The data path is internal to one HPC and not documented.
- The "run" command assumes a directory the cloner does not have.

Iterate the README until it is, in fact, runnable by a stranger. That is the bar.
