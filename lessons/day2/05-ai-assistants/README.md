# Day 2 · Session 5 — AI Coding Assistants: Where They Help, Where They Hurt

**Time.** 15:00–15:45 (45 min)
**Themes.** Workflow + Reproducible research.
**Slides.** `slides/day2-05-ai-assistants.pptx`

## Goal

By the end of this session, learners can:

1. Identify the three categories of bioinformatics work where AI assistants are reliable, unreliable, and dangerous.
2. Adopt a verification posture for assistant-generated code (read it, check the API, run it, diff it).
3. Articulate the data-governance question to ask before pasting anything sensitive.

## Outline

| Time | What you do |
|------|-------------|
| 15:00–15:10 | Where they help: a live demo of useful scaffolding (regex, plotting, docstrings). |
| 15:10–15:25 | Where they hurt: a live demo of a confident wrong answer about a Bioconductor API. |
| 15:25–15:35 | Data governance: what *not* to paste. Institutional/IRB framing. |
| 15:35–15:45 | The verification posture and a five-question checklist. |

## Where they help

The reliable wins, with a one-line example each:

- **Boilerplate.** "Read this CSV, drop rows with NA in column X, write back." Fast, accurate, the kind of code that is annoying to write and easy to verify.
- **Plot scaffolding.** "Make me a ggplot2 volcano plot from a DESeq2 results table." The structure is right; you tune the cosmetics.
- **Regex.** "Extract everything between the third underscore and the next period in these filenames." Almost always faster than reading the regex docs.
- **Docstrings and tests.** Given a function, generate a docstring or a test stub. Useful as a draft you edit, not as a final answer.
- **Translation.** "Rewrite this awk one-liner as Python." Faithful; the kind of task LLMs are trained to do.

## Where they hurt

The danger zone, again with a one-line example each:

- **Package APIs and parameter defaults.** Assistants confidently produce calls to functions that do not exist, parameters that were renamed two versions ago, or defaults that are simply wrong. *Live demo:* ask the assistant for a `DESeq2::lfcShrink` call. Compare to `?lfcShrink` in R. The signature drifts between versions; the assistant often picks one that is plausible but wrong.
- **Statistical and methodological choices.** "Should I use a t-test here?" The assistant will give you an answer. The right answer might be a mixed model. Method selection belongs to you.
- **Citations.** Assistants invent DOIs and author lists with confidence. Never trust an assistant's citation; verify in the actual literature.
- **Tool defaults that bias the result.** "Filter low-quality variants" — sure, but what threshold? The default the assistant picks may be wrong for your sample size, depth, or organism.
- **Out-of-date packages.** Bioconductor releases every six months; the assistant's training data is older. A function that "exists" in the assistant's head may have been deprecated for two years.

## Data governance

Three questions before pasting anything into a third-party assistant:

1. **Is this protected data?** Genotypes, patient identifiers, unpublished sequences, anything from a study under embargo or IRB protection. If yes, do not paste.
2. **What does my institution's policy say?** Many institutions have explicit guidance on cloud-hosted AI services and what categories of data they may receive. Find the policy. (If your institution does not have one, that is a different conversation.)
3. **Is the assistant on-prem, or hosted by a third party with a BAA / DPA / institutional contract?** This changes the answer to question 1.

The default posture: paste *only* code and synthetic data. Use placeholders for real data. If you need to discuss real data with the assistant, describe it instead of sharing it.

## The verification posture

Treat the assistant as a **fast, fluent collaborator who has not read the documentation**. Use it for scaffolding; verify everything that touches a real package or a real question.

A five-question checklist before you commit assistant code:

1. **Did I read every line?** Not skim — read.
2. **Does every function exist in the version of the package I have?** Open the docs. `?function` in R, `help(function)` in Python.
3. **Are the defaults sensible for my data?** Not the assistant's data — yours.
4. **Have I run it on a small case where I know the answer?** This catches off-by-ones, type errors, and silent wrong-defaults better than any review.
5. **Is the diff small enough to review?** If the assistant generated 200 lines, ask it to generate them in pieces. A reviewer (you) cannot verify 200 lines as well as 20.

Five questions; thirty seconds each. The cost is real and worth it.

## What this session is not

It is not a tutorial on prompting Copilot or Claude or Cursor. The tools change every quarter; the *posture* does not. We teach the posture.

It is also not a referendum on whether to use AI assistants. They are part of the working environment now. Pretending otherwise does not help learners. Being explicit about the failure modes does.

## Common questions

- *"Which assistant is best?"* Whichever your institution licenses or you have a contract with. Differences between current frontier models matter less than the posture.
- *"Will the assistant make me lazy?"* Possibly. The defense is that you still have to read every line you commit. If you commit code you do not understand, that is a problem regardless of where the code came from.
- *"What about agentic coding (Claude Code, Cursor agents)?"* The same posture applies, with a higher stakes multiplier — agents make more changes per prompt. Slow them down, review every diff, run on a branch.
