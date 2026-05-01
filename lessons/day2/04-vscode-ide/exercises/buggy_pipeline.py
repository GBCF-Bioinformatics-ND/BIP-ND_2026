"""buggy_pipeline.py — a coverage summary that returns the wrong answer.

Run it once to see it produce a wrong number, then debug it under VS Code's
debugger. The bug is one off-by-one slice. Find it without adding `print`.

Usage:
  python buggy_pipeline.py sample_coverage.tsv

The TSV (one is provided next to this file) has columns:
  position    depth

The script's intent is to compute mean depth and the fraction of positions
covered at depth >= 10, but it gives wrong answers because of a slicing bug.
"""

from __future__ import annotations

import sys
from pathlib import Path

import pandas as pd


def load_coverage(path: Path) -> pd.DataFrame:
    """Load a tab-separated position/depth table.

    The first row of the file is a header. The bug is below — see if you
    can spot it before the debugger does.
    """
    df = pd.read_csv(path, sep="\t")
    # BUG: drops the first row of *data*, not the header. read_csv already
    # consumed the header; this line removes a real position.
    df = df.iloc[1:]
    return df


def summarize(df: pd.DataFrame, threshold: int = 10) -> dict:
    mean_depth = df["depth"].mean()
    n_total = len(df)
    n_covered = (df["depth"] >= threshold).sum()
    return {
        "mean_depth": float(mean_depth),
        "fraction_covered_at_threshold": n_covered / n_total,
        "n_positions": n_total,
        "threshold": threshold,
    }


def main(argv: list[str]) -> None:
    if len(argv) < 2:
        sys.exit(f"usage: {argv[0]} <coverage.tsv>")
    path = Path(argv[1])
    df = load_coverage(path)
    summary = summarize(df)
    for k, v in summary.items():
        print(f"{k}\t{v}")


if __name__ == "__main__":
    main(sys.argv)
