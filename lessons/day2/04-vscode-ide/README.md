# Day 2 · Session 4 — VS Code as a Bioinformatics IDE

**Time.** 13:15–14:45 (90 min)
**Themes.** Workflow + Reproducible research.
**Slides.** `slides/day2-04-vscode-ide.pptx`

## Goal

By the end of this session, learners can:

1. Connect to the HPC from VS Code via Remote-SSH and edit a project as if it were local.
2. Point VS Code at the project's conda environment so every terminal, debugger, and notebook resolves to the right tools.
3. Use a linter and a formatter that run on save, in both Python and R.
4. Set a breakpoint, step through code, and inspect variables instead of using `print` debugging.
5. Stage, diff, commit, and push from inside the IDE.

## Outline

| Time | What you do |
|------|-------------|
| 13:15–13:30 | Why an IDE: a 5-minute "watch what changes" demo (vim → VS Code on the same broken script). |
| 13:30–13:45 | Remote-SSH connection. The pivotal demo. |
| 13:45–14:00 | Interpreter selection. Workspace settings. Why `settings.json` is committed. |
| 14:00–14:15 | Linting and formatting, on save. Python (`ruff`) and R (`lintr`/`styler`). |
| 14:15–14:35 | The debugger: break, step, inspect. Replaces `print`. |
| 14:35–14:45 | Integrated Git: stage, diff, commit, push. Notebooks done with proper diffs. |

## Live-coding script

### Open the project remotely

1. **VS Code** → Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) → "Remote-SSH: Connect to Host..." → pick the HPC.
2. Open the Day 1 project: File → Open Folder → `~/my-workshop-project`.
3. Open the integrated terminal (`Ctrl+\``). Note the prompt: it is the HPC. The terminal lives on the cluster; the editor lives on your laptop.

This is the demo that shifts how learners work. Pause here. Have helpers walk the room.

### Interpreter selection

```
Cmd+Shift+P → "Python: Select Interpreter" → pick the workshop conda env.
```

Now every terminal opened in this window auto-activates `workshop`, the debugger uses its Python, and Jupyter notebooks bind to its kernel. The single most common silent failure in bioinformatics — running a script against the wrong Python — disappears.

For R, install the **R extension**, then in workspace settings:

```jsonc
{
  "r.rterm.linux": "${env:CONDA_PREFIX}/bin/R",
  "r.rterm.option": ["--no-save", "--no-restore"]
}
```

### Workspace settings, committed

The `settings/` directory in this lesson contains `settings.json`, `extensions.json`, and `launch.json`. Copy them into `.vscode/` in the project. Verify they are tracked by Git (the project's `.gitignore` unignores `.vscode/settings.json` etc. specifically).

The point: the IDE's behavior in this project is part of the project. A teammate cloning the repo gets the same linting, the same debug configuration, the same recommended extensions.

### Linting and formatting on save

Open `exercises/broken_script.py`. Save the file. Watch `ruff` flag:

- An unused import.
- A shadowed variable.
- A line that is too long.

Run `ruff check --fix` to auto-fix the trivial issues. Discuss which of the remaining lints are real bugs (the shadowed variable) and which are stylistic (line length).

For R: open `exercises/broken_script.R`. `lintr` flags the same kinds of issues; `styler` reformats.

A teaching point: linters catch **real bugs**. The undefined name, the shadowed variable, the unused-import-that-should-have-been-different. They are not aesthetics.

### The debugger

Open `exercises/buggy_pipeline.py`. It computes a coverage summary that returns the wrong answer. Your job is to find why.

The instinct is to add `print` statements. The lesson is: don't.

1. Click in the gutter at the suspect line. A red dot — a breakpoint.
2. Run → Start Debugging (or F5). Use `launch.json` already configured.
3. The debugger pauses at your breakpoint. The Variables pane shows everything in scope. The Watch pane lets you evaluate expressions.
4. Step over (F10), step into (F11), continue (F5).
5. Find the bug. (It is an off-by-one in a slice.)

For learners who have never seen a real debugger, this is the segment that shifts how they work. Take the time.

### Integrated Git

VS Code's Source Control panel:

- File-level diff in the gutter (green/red bars next to changed lines).
- Stage hunks (not whole files) with the `+` icon next to a hunk in the diff view.
- Commit with a message in the panel.
- Push with the sync button.

Install **GitLens**. Hover over any line; see who changed it, when, and the commit message. For a project with history, this is the fastest "blame" experience anywhere.

### Notebooks with diffs that are readable

Open a `.ipynb` in VS Code. Make a change. `git diff` on the command line is unreadable JSON. In VS Code, the rich diff shows cell-by-cell changes. This alone justifies the IDE for notebook-heavy work.

Better still: **Quarto**. A `.qmd` file is plain text; `git diff` is readable; the same file renders to HTML, PDF, or a notebook. We recommend Quarto for any literate analysis you will share.

## Misconceptions to surface

- **"I'll just `cd` into the env in a terminal."** That works, but the editor doesn't know. Code completion, jump-to-definition, the debugger — all need the *interpreter* set, not a sourced env in a single terminal.
- **"Linting is style policing."** Some lints are. Many are bug detection. Read the message, decide.
- **"Print debugging is fine."** It is fine for a one-liner. For anything that calls more than three functions, the debugger is faster.
- **"Pushing from the IDE is dangerous."** It is `git push` either way. The IDE just shows you the diff first, which is *safer*, not more dangerous.

## Things to watch for

- Remote-SSH connection failures: the failure modes (SSH keys not loaded, two-factor prompt timing out, login-node MOTD breaking the handshake) are diverse. Have helpers ready.
- Learners on a slow network whose Remote-SSH session lags. They can fall back to local editing + `scp`/`rsync`, but the IDE's value is much reduced.
- The R extension's setup is fiddlier than Python's. Pair R-heavy learners with a helper who has used the R extension before.
