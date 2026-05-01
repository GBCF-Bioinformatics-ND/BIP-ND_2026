#!/usr/bin/env bash
#SBATCH --job-name=count_reads
#SBATCH --time=00:05:00
#SBATCH --mem=1G
#SBATCH --cpus-per-task=1
#SBATCH --output=logs/count_reads_%j.out
#SBATCH --error=logs/count_reads_%j.err
#
# submit.sbatch — submit count_reads.sh as a SLURM job.
#
# Usage:
#   mkdir -p logs
#   sbatch submit.sbatch /path/to/data
#
# After submission:
#   squeue -u $USER         # is it queued/running?
#   cat logs/count_reads_<jobid>.out
#   cat logs/count_reads_<jobid>.err

set -euo pipefail

DATA_DIR="${1:?Usage: sbatch submit.sbatch /path/to/data}"

# If you use modules instead of conda, replace the next two lines:
source "$HOME/miniforge3/etc/profile.d/conda.sh"
conda activate workshop

bash "$(dirname "$0")/count_reads.sh" "$DATA_DIR"
