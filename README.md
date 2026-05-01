# Bioinformatics Introductory Program (BIP) for Graduate Students

A Carpentries-style two-day Bioinformatics Introductory Program (BIP) for Graduate Students that builds the foundations a wet-lab researcher needs to do defensible bioinformatics: shell and HPC literacy, reproducible environments, public-database fluency, and a working IDE.

This repository contains everything an instructor needs to deliver BIP and everything a learner needs to follow along: lesson notes, exercises and solutions, runnable code, environment YAMLs, slide decks, and instructor documentation.

## Audience

Mixed-skill graduate students, postdocs, research staff, and faculty whose primary expertise is wet-lab and who need a working foundation in genomics analysis. No prior programming experience required, but learners must complete the pre-workshop setup.

## What learners can do at the end

1. Navigate an HPC and manipulate genomic files from the shell.
2. Build and use a conda environment for a project.
3. Lay out a Git-versioned bioinformatics project that a collaborator could pick up.
4. Identify the major public genomic databases and retrieve sequences, annotations, and metadata through both web and programmatic interfaces.
5. Use a modern IDE (VS Code) with Remote-SSH, a debugger, linting, formatting, and Git integration to write code that is easier to reproduce and maintain.

## Repository layout

```
.
├── README.md               # this file
├── SETUP.md                # pre-workshop setup instructions for learners
├── CODE_OF_CONDUCT.md
├── LICENSE
├── .gitignore              # the .gitignore we teach in the project session
├── envs/                   # conda environment YAMLs (Day 1, Day 2)
├── docs/
│   ├── instructor-notes.md
│   ├── pre-workshop-checklist.md
│   ├── glossary.md
│   └── reproducibility-ladder.md
├── slides/                 # one .pptx per session (built by scripts/build_slides.js)
├── scripts/
│   ├── setup-check.sh      # learners run this before Day 1
│   └── build_slides.js     # generates every slide deck under slides/
├── data/
│   └── README.md           # how to obtain the workshop dataset
└── lessons/
    ├── day1/
    │   ├── 01-welcome/
    │   ├── 02-shell-basics/
    │   ├── 03-shell-pipes-hpc/
    │   ├── 04-environments/
    │   └── 05-project-git/
    └── day2/
        ├── 01-databases-landscape/
        ├── 02-web-portals/
        ├── 03-programmatic-access/
        ├── 04-vscode-ide/
        ├── 05-ai-assistants/
        └── 06-putting-together/
```

Each lesson directory has:

- `README.md` — instructor notes, key teaching points, common misconceptions, and the live-coding script.
- `exercises.md` — exercises with prompts only (what learners see).
- `solutions.md` — expected solutions and discussion (what instructors and helpers see).
- Runnable code in the appropriate language subdirectory (`cli/`, `R/`, `python/`) where applicable.

## How to use this repository

**As an instructor.** Read `docs/instructor-notes.md` first. Walk every lesson `README.md` end-to-end, on your own machine, before delivery. Run `scripts/build_slides.js` to (re)generate the decks. Tune the workshop dataset in `data/README.md` to your own HPC.

**As a learner.** Read `SETUP.md`. Run `scripts/setup-check.sh`. Open the `lessons/day1/01-welcome/README.md` and follow along.

**As another instructor adapting it.** The workshop is licensed CC-BY 4.0. Fork it. Keep attribution.

## Building the slides

```bash
cd scripts
npm install -g pptxgenjs   # one-time
node build_slides.js       # writes ten decks into ../slides/
```

If your institution has a brand palette, edit the `PALETTE` constant at the top of `build_slides.js` and rebuild.

## Schedule at a glance

| Day | Block | Session |
|-----|-------|---------|
| 1 | 09:00–09:30 | Into to workshop and GBCF |
| 1 | 09:30–10:30 | Intro to HPC and CRC |
| 1 | 10:30–12:00 | BASH script |
| 1 | 12:00–13:00 | Lunch |
| 1 | 13:00–14:00 | Conda environment set up |
| 1 | 14:00–15:00 | Container set up |
| 1 | 15:00–15:15 | Coffee break |
| 1 | 15:15–16:15 | Git and version control |
| 1 | 16:15–16:30 | Day 1 wrap-up |
| 2 | 09:00–09:30 | Recap; landscape of genomic databases |
| 2 | 09:30–11:00 | Model system database: NBCI, Ensembl, UCSC |
| 2 | 11:00–12:00 | Non-model system database |
| 2 | 12:00–13:00 | Lunch |
| 2 | 13:00–14:00 | VS Code as a bioinformatics IDE |
| 2 | 14:00–15:00 | TBD |
| 2 | 15:00–15:15 | Coffee break |
| 2 | 15:15–16:15 | How to build AI agent |
| 2 | 16:15–16:30 | Where to go next; close |

## License

Lesson content, slides, and documentation: **CC-BY 4.0**. Code: **MIT**. See `LICENSE`.
