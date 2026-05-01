# Solutions — Shell I

## 1.1 — Navigation

```bash
pwd                  # /home/learner
cd /tmp
pwd                  # /tmp
cd /home/learner     # absolute path back
# or:
cd ~
```

The teaching point: absolute paths work from anywhere. Relative paths depend on where you are. Most scripting bugs come from confusing the two.

## 1.2 — Inspecting a FASTQ

```bash
zcat $WORKSHOP_DATA/samples/sample_01_R1.fastq.gz | head -4
```

A FASTQ record is four lines:

```
@SRR123456.1 ...           <- read header
ACGTACGTACGT...            <- sequence
+                          <- separator
IIIIIIIIIIII...            <- quality (Phred+33)
```

Count records:

```bash
zcat sample_01_R1.fastq.gz | wc -l    # total lines
# divide by 4 for read count
zcat sample_01_R1.fastq.gz | awk 'END {print NR/4}'
```

Read length:

```bash
zcat sample_01_R1.fastq.gz | head -2 | tail -1 | wc -c   # add -1 for the newline
```

## 1.3 — Find-and-count

```bash
# 1. List
find $WORKSHOP_DATA -name "*.fastq.gz"

# 2. Count
find $WORKSHOP_DATA -name "*.fastq.gz" | wc -l

# 3. Total size
du -sh $WORKSHOP_DATA
# or, just the FASTQs:
find $WORKSHOP_DATA -name "*.fastq.gz" -exec du -ch {} + | tail -1
```

Mention briefly: `find` is the right tool when you want recursion plus filtering. `ls` does not recurse without `-R`, and `-R` does not filter.

## 1.4 — Globbing

```bash
ls envs/*.yaml
ls envs/workshop*
ls $WORKSHOP_DATA/samples/*_R1*.fastq.gz
```

Discuss briefly: globbing is done by the shell *before* the command runs. The command never sees `*`; it sees the expanded list. This is why `ls *.fastq` fails with "no such file" when there are no FASTQs — the shell could not expand the glob.
