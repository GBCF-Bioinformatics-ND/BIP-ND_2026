# &lt;PROJECT NAME&gt;

A short description of the project — one or two sentences. What is the question, what is the experimental design.

## Reproducing this analysis

```bash
git clone <repository-url>
cd <project-name>
mamba env create -f envs/project.yaml
mamba activate <env-name>
bash scripts/run_all.sh
```

## Data

Raw data is **not** in this repository. It lives at:

- &lt;HPC path or archive URL&gt;
- &lt;SRA/ENA accessions, if applicable&gt;

After obtaining the raw data, place it in `data/raw/` matching the layout described in `data/raw/README.md`.

## Layout

```
data/
  raw/         immutable, not in git
  processed/   generated, not in git
envs/          conda YAMLs
scripts/       shell, R, Python
results/       figures and tables, not in git
notebooks/     literate analysis
```

Anything in `data/processed/` and `results/` is regeneratable from `data/raw/` plus the code in `scripts/` and `notebooks/`. If you find yourself editing a processed file by hand, you have introduced a reproducibility hole.

## Methods (short)

A one-paragraph methods section describing the canonical chain of analysis. The full methods, with parameters, live in `scripts/` and the corresponding sections of any manuscript.

## Citation

If you use this analysis or its results, please cite &lt;DOI / preprint / paper&gt;.

## License

Lesson content: CC-BY 4.0. Code: MIT.
