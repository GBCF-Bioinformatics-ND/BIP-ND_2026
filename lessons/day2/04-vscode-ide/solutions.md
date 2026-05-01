# Solutions — VS Code as a Bioinformatics IDE

## Linting `broken_script.py`

What ruff catches, in order:

| Code | What it means | Action |
|------|---------------|--------|
| `F401` | `import json` is unused. | Auto-fix: remove. |
| `E501` | Line too long. | Reformat or split. |
| `PLW2901`-style | Loop variable `n` shadows outer `n`. | Real bug. Read the function. |
| `B007` | Loop variable not used in body. | Symptom of the same bug. |

The real issue in `summarize`: the function never accumulates. `n + n` is a no-op (the result is discarded). The intent was `total += n`. The function returns whatever the last row's `read_count` was, not the total.

A corrected version:

```python
def summarize(df):
    total = 0
    for n in df["read_count"]:
        total += n
    return total

# Or, idiomatically:
def summarize(df):
    return int(df["read_count"].sum())
```

The point: **ruff caught a real bug**, not just style. The lint about the unused import is style; the lint about the shadowed loop variable is the bug. Reading the lints means deciding which is which.

## Linting `broken_script.R`

What lintr catches:

- `unused_import_linter`: `library(stringr)` is unused.
- `assignment_linter`: `=` used for assignment instead of `<-`.
- `T_and_F_symbol_linter`: `T` is a variable assignment that shadows `TRUE`.
- `infix_spaces_linter`, `spaces_inside_linter`: stylistic.

The real bug: shadowing `T`. This is a classic R gotcha. After `T <- 0`, any code that uses `T` expecting `TRUE` is silently wrong.

A corrected version:

```R
summarize_reads <- function(df) {
  total <- 0
  for (n in df$read_count) {
    total <- total + n
  }
  total
}

# Or:
summarize_reads <- function(df) sum(df$read_count)
```

## Debugging `buggy_pipeline.py`

The exercise: run, see wrong numbers, debug.

What learners should do:

1. Run the script once. Note the output (e.g., `n_positions = 19` when the file has 20 data rows; mean depth slightly inflated because the lowest-depth row was dropped).
2. Set a breakpoint at `df = pd.read_csv(...)`. Inspect `df`. Note that `pd.read_csv` already consumed the header — `df` has 20 rows.
3. Step over `df = df.iloc[1:]`. Inspect `df` again. It now has 19 rows. The bug is the slice.
4. Remove the offending line. Re-run. Numbers are correct.

The teaching point: **the debugger let you see the data at each stage, without adding instrumentation**. That is what makes it faster than `print` for any non-trivial bug.

A discussion prompt: this bug only manifests as "the numbers are wrong by a little." If `position 1` had `depth 1000`, the bug would shift the mean by a lot and someone would notice. If positions are roughly uniform, the bug is silent. **Silent bugs are the dangerous ones.** Linters and tests catch them; print debugging usually does not.

## Configuring the workspace

The committed `.vscode/settings.json` and `.vscode/extensions.json` should travel with the project. A new collaborator clones, opens the project in VS Code, accepts the recommended-extensions prompt, and is in a working environment in under five minutes. That is the bar.
