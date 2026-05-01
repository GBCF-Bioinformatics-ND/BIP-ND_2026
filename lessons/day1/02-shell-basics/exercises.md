# Exercises — Shell I

## Exercise 1.1 — Navigation

Without using `cd ..` more than once in a row, navigate from your home directory to `/tmp` and back. Use absolute paths.

## Exercise 1.2 — Inspecting a FASTQ

Using `head` and `wc -l`, answer the following for `sample_01_R1.fastq.gz` (path provided by the instructor):

1. What does the first sequence look like?
2. How many reads are in the file? (Hint: each read is four lines.)
3. What is the read length? (Look at the second line of any record.)

## Exercise 1.3 — The find-and-count exercise

Pair up. Given the workshop data directory at `$WORKSHOP_DATA`, use the shell to:

1. List every `.fastq.gz` file under it.
2. Count how many there are.
3. Report the total size in human-readable form.

Hint: `find`, `wc -l`, and `du -sh` are useful. You will use only commands from this session and one new one (`find`) which the instructor will introduce briefly.

## Exercise 1.4 — Globbing practice

Without using a loop, list:

1. Every `.yaml` file in `envs/`.
2. Every file in `envs/` whose name starts with `workshop`.
3. Every `_R1` FASTQ in the workshop data samples directory.

Time: 8 minutes for all four exercises, in pairs.
