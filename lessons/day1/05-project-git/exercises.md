# Exercises — Project Structure and Git

## Exercise 5.1 — Initialize your project

In pairs, copy the `project-template/` directory to a new location and rename it:

```bash
cp -r project-template ~/my-workshop-project
cd ~/my-workshop-project
```

Initialize Git, commit the skeleton, and push to a fresh GitHub repo. Confirm the README renders on GitHub.

## Exercise 5.2 — Add and commit something real

Edit `README.md`: add a one-paragraph description of the project (you can invent one — say, "calling variants in three E. coli isolates") and add a "Methods" stub. Commit with a meaningful message.

## Exercise 5.3 — The .gitignore catches a mistake

Pretend you accidentally copied a FASTQ into `data/processed/` (we'll simulate it):

```bash
echo "ATGC" > data/processed/sample_01.fastq
git status
```

Verify Git is *not* offering to commit the FASTQ. Why not? (Answer: `.gitignore`.)

Now move it to `data/raw/`:

```bash
mv data/processed/sample_01.fastq data/raw/
git status
```

Confirm Git still does not see it. Discuss in your pair: what would happen if the entry for `data/raw/` were missing from `.gitignore`?

## Exercise 5.4 — Cloneability check

Swap projects with another pair. Each pair clones the other's repo, reads its README, and tries to follow the setup steps. Note in the etherpad anything ambiguous or missing in the README. Apply your own pair's feedback to your own README and re-push.

The point: a README is a contract. If the other pair cannot get started, your README has a gap.
