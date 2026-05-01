"""broken_script.py — a deliberately messy script for the linting exercise.

Save the file in VS Code with ruff configured. Watch the diagnostics appear.
Some are auto-fixable; some are real bugs you must read and decide on.

This file MUST stay broken. Do not "fix" it before the workshop.
"""

import os
import sys
import json   # unused — ruff F401
from pathlib import Path
import pandas as pd


def parse_samplesheet(path):
    df = pd.read_csv(path)
    return df


def summarize(df):
    # Bug: `n` shadows the loop variable below. ruff will flag it (PLW2901-ish
    # via `--select PL`) and a careful reader catches it because `n` ends up
    # being whatever the last row's read_count was, not the total.
    n = 0
    for n in df["read_count"]:
        n + n   # noqa — wrong intent: the writer meant `total += n`
    return n


def main(argv):
    samplesheet = argv[1]
    df = parse_samplesheet(samplesheet)
    total = summarize(df)
    print(f"total reads across {len(df)} samples: {total}")


if __name__ == "__main__":
    main(sys.argv)
