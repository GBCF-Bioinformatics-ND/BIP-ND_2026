#!/usr/bin/env bash
#
# setup-check.sh
# Run this *after* you have created the workshop conda environments. It prints
# the versions of every tool the workshop uses and exits non-zero if any tool
# is missing. Bring the output to the drop-in setup session if it fails.
#
# Usage:
#   bash scripts/setup-check.sh

set -uo pipefail

# Colors only when stdout is a terminal
if [[ -t 1 ]]; then
  RED=$'\033[0;31m'; GREEN=$'\033[0;32m'; YELLOW=$'\033[0;33m'; RESET=$'\033[0m'
else
  RED=""; GREEN=""; YELLOW=""; RESET=""
fi

missing=0
ok=0
warn=0

check() {
  local label="$1" cmd="$2" version_flag="${3:---version}"
  if command -v "$cmd" >/dev/null 2>&1; then
    local v
    v="$("$cmd" "$version_flag" 2>&1 | head -1)"
    printf "  %s%-22s%s %s\n" "$GREEN" "[ok]  $label" "$RESET" "$v"
    ok=$((ok+1))
  else
    printf "  %s%-22s%s not found in PATH\n" "$RED" "[miss] $label" "$RESET"
    missing=$((missing+1))
  fi
}

soft_check() {
  local label="$1" cmd="$2" version_flag="${3:---version}"
  if command -v "$cmd" >/dev/null 2>&1; then
    local v
    v="$("$cmd" "$version_flag" 2>&1 | head -1)"
    printf "  %s%-22s%s %s\n" "$GREEN" "[ok]  $label" "$RESET" "$v"
    ok=$((ok+1))
  else
    printf "  %s%-22s%s not found (optional)\n" "$YELLOW" "[warn] $label" "$RESET"
    warn=$((warn+1))
  fi
}

echo
echo "========================================================"
echo " Workshop setup check"
echo " $(date)"
echo " host: $(hostname)"
echo " user: $(whoami)"
echo "========================================================"
echo

echo "Shell and core utilities:"
check "bash"            bash    --version
check "git"             git     --version
check "ssh"             ssh     -V
echo

echo "Conda / mamba:"
soft_check "mamba"      mamba   --version
soft_check "conda"      conda   --version
echo

echo "Day 1 — file peeking:"
check "samtools"        samtools --version
check "bcftools"        bcftools --version
echo

echo "Day 2 — database CLIs:"
check "datasets (NCBI)" datasets --version
check "esearch (EDirect)" esearch -version
echo

echo "Day 2 — Python:"
check "python"          python  --version
if command -v python >/dev/null 2>&1; then
  for pkg in Bio pyensembl requests pandas; do
    if python -c "import ${pkg}" 2>/dev/null; then
      printf "  %s%-22s%s importable\n" "$GREEN" "[ok]  py:${pkg}" "$RESET"
      ok=$((ok+1))
    else
      printf "  %s%-22s%s missing (pip/conda install)\n" "$RED" "[miss] py:${pkg}" "$RESET"
      missing=$((missing+1))
    fi
  done
fi
echo

echo "Day 2 — R:"
check "R"               R       --version
if command -v R >/dev/null 2>&1; then
  for pkg in biomaRt AnnotationHub GenomicRanges; do
    if R --quiet --no-save -e "suppressMessages(library(${pkg}))" >/dev/null 2>&1; then
      printf "  %s%-22s%s loadable\n" "$GREEN" "[ok]  r:${pkg}" "$RESET"
      ok=$((ok+1))
    else
      printf "  %s%-22s%s not loadable\n" "$RED" "[miss] r:${pkg}" "$RESET"
      missing=$((missing+1))
    fi
  done
fi
echo

echo "Day 2 — IDE-side linters:"
soft_check "ruff"       ruff    --version
echo

echo "========================================================"
printf " summary: %s%d ok%s, %s%d warn%s, %s%d missing%s\n" \
  "$GREEN" "$ok"      "$RESET" \
  "$YELLOW" "$warn"   "$RESET" \
  "$RED" "$missing"   "$RESET"
echo "========================================================"

if (( missing > 0 )); then
  echo
  echo "${RED}Some required tools are missing.${RESET} Most are fixed by:"
  echo "  mamba env create -f envs/workshop.yaml"
  echo "  mamba activate workshop"
  echo
  exit 1
fi

exit 0
