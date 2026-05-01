// build_slides.js
//
// Generates ten PowerPoint decks under ../slides/, one per workshop session.
//
// Run:
//   node build_slides.js
//
// Design system: Forest & Moss palette, Cambria headers, Calibri body, white
// content slides with dark title/divider slides for "sandwich" structure.
// Visual motif: a subtle small accent square in the top-left of content slides,
// referenced consistently. No accent lines under titles (a known AI tell).

const path = require("path");
const PptxGenJS = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const FA = require("react-icons/fa");

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const PALETTE = {
    forest: "2C5F2D",       // primary
    forestDark: "1A3A1B",   // deep accent for title slides
    moss: "97BC62",          // secondary
    cream: "F5F5F0",         // soft neutral
    white: "FFFFFF",
    text: "1F2937",          // body text
    textMuted: "5C6B6E",
    rule: "D9DCD3",          // hairlines
    accent: "B85042",        // sparing warm accent for emphasis
};

const FONT = {
    head: "Cambria",
    body: "Calibri",
    mono: "Consolas",
};

const SLIDE_W = 13.333;  // LAYOUT_WIDE
const SLIDE_H = 7.5;

// ---------------------------------------------------------------------------
// Icon helper (rasterize react-icon SVG to PNG base64)
// ---------------------------------------------------------------------------
async function icon(IconComponent, color = PALETTE.forest, size = 256) {
    // react-icons treats `color` as a CSS color string, so a naked hex like
    // "2C5F2D" is invalid and silently falls back to currentColor (≈ black).
    // Prepend "#" if the caller passed a raw hex.
    const cssColor = color.startsWith("#") ? color : "#" + color;
    const svg = ReactDOMServer.renderToStaticMarkup(
        React.createElement(IconComponent, { color: cssColor, size: String(size) })
    );
    const buf = await sharp(Buffer.from(svg)).png().toBuffer();
    return "image/png;base64," + buf.toString("base64");
}

// ---------------------------------------------------------------------------
// Slide layouts
// ---------------------------------------------------------------------------

function newDeck() {
    const p = new PptxGenJS();
    p.layout = "LAYOUT_WIDE";
    p.author = "Workshop instructors";
    return p;
}

// Title slide: dark forest, large title, smaller subtitle, deck index
function titleSlide(pres, { eyebrow, title, subtitle, deckLabel }) {
    const s = pres.addSlide();
    s.background = { color: PALETTE.forestDark };

    // Top-left accent square
    s.addShape(pres.shapes.RECTANGLE, {
        x: 0.7, y: 0.7, w: 0.35, h: 0.35,
        fill: { color: PALETTE.moss }, line: { color: PALETTE.moss }
    });

    if (eyebrow) {
        s.addText(eyebrow, {
            x: 1.2, y: 0.65, w: 8, h: 0.45, margin: 0,
            fontFace: FONT.body, fontSize: 14, color: PALETTE.moss,
            charSpacing: 8, bold: true,
        });
    }

    s.addText(title, {
        x: 0.7, y: 2.0, w: 11.5, h: 2.0, margin: 0,
        fontFace: FONT.head, fontSize: 48, color: PALETTE.white, bold: true,
    });

    if (subtitle) {
        s.addText(subtitle, {
            x: 0.7, y: 4.1, w: 11.5, h: 1.4, margin: 0,
            fontFace: FONT.body, fontSize: 22, color: PALETTE.cream, italic: true,
        });
    }

    if (deckLabel) {
        s.addText(deckLabel, {
            x: 0.7, y: 6.7, w: 11.5, h: 0.4, margin: 0,
            fontFace: FONT.body, fontSize: 12, color: PALETTE.moss,
            charSpacing: 4,
        });
    }
    return s;
}

// Section divider: forest background, single large statement
function dividerSlide(pres, { kicker, title }) {
    const s = pres.addSlide();
    s.background = { color: PALETTE.forest };

    if (kicker) {
        s.addText(kicker, {
            x: 0.7, y: 2.6, w: 11.5, h: 0.5, margin: 0,
            fontFace: FONT.body, fontSize: 14, color: PALETTE.moss,
            charSpacing: 8, bold: true,
        });
    }
    s.addText(title, {
        x: 0.7, y: 3.1, w: 11.5, h: 2.5, margin: 0,
        fontFace: FONT.head, fontSize: 40, color: PALETTE.white, bold: true,
    });
    return s;
}

// Content slide chrome: title + small accent square, returns slide for further drawing
function contentSlide(pres, { title, eyebrow }) {
    const s = pres.addSlide();
    s.background = { color: PALETTE.white };

    // Top-left small accent square (the deck's visual motif)
    s.addShape(pres.shapes.RECTANGLE, {
        x: 0.5, y: 0.55, w: 0.18, h: 0.18,
        fill: { color: PALETTE.forest }, line: { color: PALETTE.forest }
    });

    if (eyebrow) {
        s.addText(eyebrow, {
            x: 0.8, y: 0.5, w: 11.5, h: 0.3, margin: 0,
            fontFace: FONT.body, fontSize: 11, color: PALETTE.moss,
            charSpacing: 6, bold: true,
        });
    }
    s.addText(title, {
        x: 0.5, y: 0.85, w: 12.3, h: 0.7, margin: 0,
        fontFace: FONT.head, fontSize: 30, color: PALETTE.text, bold: true,
    });
    return s;
}

// Footer with deck name + page number
function addFooter(s, label, page, total) {
    s.addText(label, {
        x: 0.5, y: 7.05, w: 8, h: 0.3, margin: 0,
        fontFace: FONT.body, fontSize: 10, color: PALETTE.textMuted,
    });
    s.addText(`${page} / ${total}`, {
        x: 12.0, y: 7.05, w: 1.0, h: 0.3, margin: 0, align: "right",
        fontFace: FONT.body, fontSize: 10, color: PALETTE.textMuted,
    });
}

// Bullet list helper
function bullets(s, items, opts = {}) {
    const { x = 0.7, y = 1.7, w = 12.0, h = 5.0, fontSize = 18 } = opts;
    const runs = items.map((t, i) => ({
        text: t,
        options: { bullet: { code: "25A0" }, breakLine: i < items.length - 1 }
    }));
    s.addText(runs, {
        x, y, w, h, margin: 0,
        fontFace: FONT.body, fontSize, color: PALETTE.text,
        paraSpaceAfter: 8, valign: "top",
    });
}

// Two-column with a left bar of text and a right card of code/example
function twoColumnCode(s, leftItems, codeText, opts = {}) {
    const { codeTitle = "Example" } = opts;
    bullets(s, leftItems, { x: 0.6, y: 1.7, w: 5.8, h: 5.0, fontSize: 17 });

    s.addShape(pres_global.shapes.RECTANGLE, {
        x: 6.8, y: 1.7, w: 6.0, h: 5.0,
        fill: { color: PALETTE.cream }, line: { color: PALETTE.rule, width: 0.75 },
    });
    s.addText(codeTitle, {
        x: 7.0, y: 1.85, w: 5.6, h: 0.35, margin: 0,
        fontFace: FONT.body, fontSize: 11, color: PALETTE.moss,
        bold: true, charSpacing: 6,
    });
    s.addText(codeText, {
        x: 7.0, y: 2.25, w: 5.6, h: 4.4, margin: 0,
        fontFace: FONT.mono, fontSize: 13, color: PALETTE.text,
        valign: "top",
    });
}

// Icon-row layout (2x2 or 2x3 grid of icon + label)
async function iconRowGrid(pres, s, rows, opts = {}) {
    const {
        x = 0.6, y = 1.8, w = 12.1, h = 4.8,
        cols = 2, gap = 0.3,
        iconColor = PALETTE.forest,
    } = opts;

    const totalRows = Math.ceil(rows.length / cols);
    const cellW = (w - gap * (cols - 1)) / cols;
    const cellH = (h - gap * (totalRows - 1)) / totalRows;

    for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const ci = i % cols;
        const ri = Math.floor(i / cols);
        const cx = x + ci * (cellW + gap);
        const cy = y + ri * (cellH + gap);

        // card
        s.addShape(pres.shapes.RECTANGLE, {
            x: cx, y: cy, w: cellW, h: cellH,
            fill: { color: PALETTE.cream }, line: { color: PALETTE.rule, width: 0.75 },
        });

        // icon circle
        s.addShape(pres.shapes.OVAL, {
            x: cx + 0.3, y: cy + 0.3, w: 0.7, h: 0.7,
            fill: { color: PALETTE.white }, line: { color: PALETTE.forest, width: 1.5 },
        });
        if (r.icon) {
            const data = await icon(r.icon, iconColor);
            s.addImage({ data, x: cx + 0.45, y: cy + 0.45, w: 0.4, h: 0.4 });
        }

        s.addText(r.title, {
            x: cx + 1.15, y: cy + 0.32, w: cellW - 1.3, h: 0.4, margin: 0,
            fontFace: FONT.head, fontSize: 16, color: PALETTE.text, bold: true,
        });
        if (r.body) {
            s.addText(r.body, {
                x: cx + 0.3, y: cy + 1.05, w: cellW - 0.5, h: cellH - 1.2, margin: 0,
                fontFace: FONT.body, fontSize: 13, color: PALETTE.textMuted,
                valign: "top", paraSpaceAfter: 4,
            });
        }
    }
}

// Stat callout
function statCallout(s, { stat, label, x = 1, y = 2.5, w = 5, h = 2 }) {
    s.addText(stat, {
        x, y, w, h: h * 0.6, margin: 0,
        fontFace: FONT.head, fontSize: 72, color: PALETTE.forest, bold: true,
    });
    s.addText(label, {
        x, y: y + h * 0.6, w, h: h * 0.4, margin: 0,
        fontFace: FONT.body, fontSize: 16, color: PALETTE.textMuted,
    });
}

// Two-column: title + code only (full code-focused slide)
function fullCodeSlide(s, codeText, narrator) {
    s.addShape(pres_global.shapes.RECTANGLE, {
        x: 0.6, y: 1.7, w: 12.1, h: 5.0,
        fill: { color: PALETTE.cream }, line: { color: PALETTE.rule, width: 0.75 },
    });
    s.addText(codeText, {
        x: 0.85, y: 1.9, w: 11.6, h: 4.6, margin: 0,
        fontFace: FONT.mono, fontSize: 14, color: PALETTE.text, valign: "top",
    });
    if (narrator) {
        s.addText(narrator, {
            x: 0.6, y: 6.65, w: 12.1, h: 0.35, margin: 0,
            fontFace: FONT.body, fontSize: 12, color: PALETTE.textMuted, italic: true,
        });
    }
}

// ---------------------------------------------------------------------------
// Slide 1 — Welcome (Day 1, Session 1)
// ---------------------------------------------------------------------------
let pres_global = null;

async function buildWelcome() {
    const pres = newDeck(); pres_global = pres;
    pres.title = "Welcome and Mental Model";

    // Slide 1: title
    titleSlide(pres, {
        eyebrow: "DAY 1 · SESSION 1",
        title: "Welcome",
        subtitle: "Bioinformatics Introductory Program (BIP) for Graduate Students",
        deckLabel: "Bioinformatics Introductory Program (BIP) · Carpentries-style"
    });

    // Slide 2: who's here, what's the goal
    {
        const s = contentSlide(pres, { title: "What you'll be able to do in two days", eyebrow: "GOALS" });
        bullets(s, [
            "Navigate an HPC and read genomic files from the shell",
            "Build and use a reproducible conda environment",
            "Lay out a Git-versioned project a collaborator could pick up",
            "Pull data from public databases — through web and code",
            "Use VS Code with Remote-SSH, debugger, linting, and Git",
        ]);
    }

    // Slide 3: five themes (icon grid)
    {
        const s = contentSlide(pres, { title: "Five themes — the spine of the workshop", eyebrow: "STRUCTURE" });
        await iconRowGrid(pres, s, [
            { icon: FA.FaToolbox,    title: "Preparations",          body: "Mental model + shell + HPC literacy. The operational basics." },
            { icon: FA.FaCubes,      title: "Environments",          body: "Reproducible software with conda/mamba and containers." },
            { icon: FA.FaSitemap,    title: "Workflow",              body: "Project structure, version control, and a coding setup that catches mistakes." },
            { icon: FA.FaDatabase,   title: "Data acquisition",      body: "Public databases, web and programmatic access, recorded provenance." },
            { icon: FA.FaCheckDouble,title: "Reproducible research", body: "Practices that let someone else rerun your work — including future you." },
        ], { cols: 2 });
    }

    // Slide 4: the chain
    {
        const s = contentSlide(pres, { title: "The genomics analysis chain", eyebrow: "THE MAP" });
        // Diagram drawn with shapes
        const colY = 1.9;
        const boxes = [
            { x: 0.7,  label: "reads",            sub: "FASTQ"  },
            { x: 3.0,  label: "QC",               sub: "FastQC, fastp" },
            { x: 5.3,  label: "align / quantify", sub: "BWA, salmon" },
            { x: 7.6,  label: "downstream",       sub: "DE · variants · peaks" },
            { x: 9.9,  label: "interpretation",   sub: "biology · stats · figures" },
        ];
        for (const b of boxes) {
            s.addShape(pres.shapes.RECTANGLE, {
                x: b.x, y: colY, w: 2.1, h: 1.1,
                fill: { color: PALETTE.cream }, line: { color: PALETTE.forest, width: 1 }
            });
            s.addText(b.label, {
                x: b.x, y: colY + 0.15, w: 2.1, h: 0.45, margin: 0,
                fontFace: FONT.head, fontSize: 16, color: PALETTE.text, bold: true, align: "center"
            });
            s.addText(b.sub, {
                x: b.x, y: colY + 0.6, w: 2.1, h: 0.4, margin: 0,
                fontFace: FONT.body, fontSize: 11, color: PALETTE.textMuted, align: "center"
            });
        }
        // Connecting arrows (lines + small triangles unavailable; use rectangles as ticks)
        for (let i = 0; i < boxes.length - 1; i++) {
            s.addShape(pres.shapes.LINE, {
                x: boxes[i].x + 2.1, y: colY + 0.55, w: 0.2, h: 0,
                line: { color: PALETTE.forest, width: 2 }
            });
        }

        // Three takeaways below the diagram
        s.addText([
            { text: "Most workflows share this backbone. ", options: { bold: true, breakLine: true } },
            { text: "RNA-seq, variant calling, ATAC, ChIP — different boxes, same shape.", options: { breakLine: true } },
            { text: "Each box is a decision. ", options: { bold: true, breakLine: true } },
            { text: "Aligner, threshold, normalization, test. Most of bioinformatics is making and defending those decisions.", options: { breakLine: true } },
            { text: "The five themes make those decisions defensible.", options: { bold: true } },
        ], {
            x: 0.7, y: 4.1, w: 11.9, h: 2.6, margin: 0,
            fontFace: FONT.body, fontSize: 14, color: PALETTE.text,
            paraSpaceAfter: 4,
        });
    }

    // Slide 5: GUI vs shell
    {
        const s = contentSlide(pres, { title: "Why command-line and reproducibility", eyebrow: "MOTIVATION" });
        twoColumnCode(s, [
            "A scriptable command is a record",
            "It runs the same on every machine",
            "It composes with the next command",
            "Clicking is a one-time event no one can rerun",
        ], "$ zcat sample.fastq.gz | wc -l\n2000000\n\n# divide by four for the read count\n$ zcat sample.fastq.gz | awk 'END {print NR/4}'\n500000\n", { codeTitle: "ONE LINE, FOREVER REPRODUCIBLE" });
    }

    // Slide 6: schedule preview
    {
        const s = contentSlide(pres, { title: "Two days at a glance", eyebrow: "SCHEDULE" });
        // Two-column: Day 1 / Day 2
        const colW = 5.85, colY = 1.7, colH = 5.0;
        s.addShape(pres.shapes.RECTANGLE, {
            x: 0.6, y: colY, w: colW, h: colH,
            fill: { color: PALETTE.cream }, line: { color: PALETTE.rule, width: 0.75 }
        });
        s.addShape(pres.shapes.RECTANGLE, {
            x: 6.85, y: colY, w: colW, h: colH,
            fill: { color: PALETTE.cream }, line: { color: PALETTE.rule, width: 0.75 }
        });
        s.addText("DAY 1 — Foundations", {
            x: 0.85, y: 1.85, w: 5.4, h: 0.4, margin: 0,
            fontFace: FONT.head, fontSize: 18, color: PALETTE.forest, bold: true,
        });
        s.addText([
            { text: "Welcome and the mental model", options: { bullet: { code: "25A0" }, breakLine: true }},
            { text: "Shell I — navigation and files", options: { bullet: { code: "25A0" }, breakLine: true }},
            { text: "Shell II — pipes, scripting, HPC", options: { bullet: { code: "25A0" }, breakLine: true }},
            { text: "Environments (conda, containers)", options: { bullet: { code: "25A0" }, breakLine: true }},
            { text: "Project structure and Git", options: { bullet: { code: "25A0" }}},
        ], { x: 0.85, y: 2.4, w: 5.4, h: 4.2, margin: 0, fontFace: FONT.body, fontSize: 14, color: PALETTE.text, paraSpaceAfter: 6 });

        s.addText("DAY 2 — Databases and the IDE", {
            x: 7.10, y: 1.85, w: 5.4, h: 0.4, margin: 0,
            fontFace: FONT.head, fontSize: 18, color: PALETTE.forest, bold: true,
        });
        s.addText([
            { text: "Database landscape and web portals", options: { bullet: { code: "25A0" }, breakLine: true }},
            { text: "Programmatic access (CLI · R · Python)", options: { bullet: { code: "25A0" }, breakLine: true }},
            { text: "VS Code as a bioinformatics IDE", options: { bullet: { code: "25A0" }, breakLine: true }},
            { text: "AI assistants — help and harm", options: { bullet: { code: "25A0" }, breakLine: true }},
            { text: "Putting it all together", options: { bullet: { code: "25A0" }}},
        ], { x: 7.10, y: 2.4, w: 5.4, h: 4.2, margin: 0, fontFace: FONT.body, fontSize: 14, color: PALETTE.text, paraSpaceAfter: 6 });
    }

    // Slide 7: ground rules
    {
        const s = contentSlide(pres, { title: "Ground rules", eyebrow: "HOW WE WORK" });
        bullets(s, [
            "Sticky notes — green = with us, red = stuck. Keep one out the whole time.",
            "Pair work in exercises. Strangers, not friends.",
            "Type, don't paste. Mistakes are part of the demo.",
            "Helpers circulate during exercises — flag them, don't wait.",
            "Code of Conduct applies to room, etherpad, Slack, lunch. Read it.",
        ], { fontSize: 18 });
    }

    // page numbers
    pres.slides.forEach((s, i) => addFooter(s, "Welcome · Day 1 Session 1", i + 1, pres.slides.length));
    await pres.writeFile({ fileName: path.join(__dirname, "..", "slides", "day1-01-welcome.pptx") });
    console.log("✓ day1-01-welcome.pptx");
}

// ---------------------------------------------------------------------------
// Slide 2 — Shell Basics (Day 1 Session 2)
// ---------------------------------------------------------------------------
async function buildShellBasics() {
    const pres = newDeck(); pres_global = pres;
    pres.title = "Shell I — Navigation and Files";

    titleSlide(pres, { eyebrow: "DAY 1 · SESSION 2", title: "Shell I", subtitle: "Navigation and files", deckLabel: "60 minutes · live coding" });

    {
        const s = contentSlide(pres, { title: "By the end of this session", eyebrow: "GOAL" });
        bullets(s, [
            "Move around a filesystem with pwd, ls, cd, and tab completion",
            "Distinguish absolute and relative paths — predict what they resolve to",
            "Inspect files with cat, less, head, tail, wc",
            "Copy, move, remove with cp, mv, rm — and know that rm has no trash",
            "Use globs (*, ?, [abc]) to operate on many files at once",
        ]);
    }

    {
        const s = contentSlide(pres, { title: "Where am I and what's here", eyebrow: "NAVIGATE" });
        twoColumnCode(s, [
            "pwd — your working directory",
            "ls — list contents",
            "ls -lah — long, all, human-readable",
            "cd — change directory",
            "Tab completion is your spell-checker",
        ], "$ pwd\n/home/learner\n\n$ ls -lah\n.    ..   envs/   notes.md\n\n$ cd envs\n$ pwd\n/home/learner/envs\n\n$ cd -    # back to where I was\n", { codeTitle: "LIVE" });
    }

    {
        const s = contentSlide(pres, { title: "Absolute vs. relative paths", eyebrow: "THE BIGGEST TRIPWIRE" });
        // Two stacked code blocks
        s.addShape(pres.shapes.RECTANGLE, {
            x: 0.6, y: 1.7, w: 6.0, h: 2.3, fill: { color: PALETTE.cream }, line: { color: PALETTE.rule }
        });
        s.addText("ABSOLUTE — works from anywhere", { x: 0.8, y: 1.85, w: 5.6, h: 0.3, margin: 0, fontFace: FONT.body, fontSize: 11, color: PALETTE.moss, bold: true, charSpacing: 6 });
        s.addText("/home/learner/data/raw/sample.fq.gz\n/data/genome/GRCh38.fa", { x: 0.8, y: 2.2, w: 5.6, h: 1.6, margin: 0, fontFace: FONT.mono, fontSize: 14, color: PALETTE.text });

        s.addShape(pres.shapes.RECTANGLE, {
            x: 6.8, y: 1.7, w: 6.0, h: 2.3, fill: { color: PALETTE.cream }, line: { color: PALETTE.rule }
        });
        s.addText("RELATIVE — depends on where you are", { x: 7.0, y: 1.85, w: 5.6, h: 0.3, margin: 0, fontFace: FONT.body, fontSize: 11, color: PALETTE.accent, bold: true, charSpacing: 6 });
        s.addText("data/raw/sample.fq.gz\n../envs/workshop.yaml\n./run_all.sh", { x: 7.0, y: 2.2, w: 5.6, h: 1.6, margin: 0, fontFace: FONT.mono, fontSize: 14, color: PALETTE.text });

        s.addText([
            { text: "The working directory is not where the script lives.", options: { bold: true, breakLine: true } },
            { text: "A script that says read('data/x.csv') resolves that against the directory you ran it from — not the script's own directory. This catches every learner eventually.", options: {} },
        ], {
            x: 0.6, y: 4.3, w: 12.1, h: 1.8, margin: 0,
            fontFace: FONT.body, fontSize: 16, color: PALETTE.text, paraSpaceAfter: 6,
        });
    }

    {
        const s = contentSlide(pres, { title: "Inspect files without opening them", eyebrow: "PEEK" });
        twoColumnCode(s, [
            "cat — print whole file (small only)",
            "less — page through (q to quit)",
            "head -n 20 — first lines",
            "tail -n 5 — last lines",
            "wc -l — count lines",
        ], "$ head -4 sample.fq\n@SRR12345.1 length=150\nACGTACGTACGT...\n+\nIIIIIIIIIIII...\n\n$ wc -l sample.fq\n2000000 sample.fq", { codeTitle: "A FASTQ HAS 4 LINES PER READ" });
    }

    {
        const s = contentSlide(pres, { title: "Move, copy, remove — and globbing", eyebrow: "OPERATE" });
        twoColumnCode(s, [
            "cp src dst, mv src dst",
            "rm has NO trash — it's gone",
            "rm -rf dir is a power tool — read twice",
            "* matches anything; ? matches one char",
            "Globbing is done by the shell, not the command",
        ], "$ cp envs/d1.yaml /tmp/\n$ mv /tmp/d1.yaml /tmp/day1.yaml\n$ rm /tmp/day1.yaml   # gone\n\n$ ls envs/*.yaml\n$ ls samples/*_R1.fq.gz\n$ ls samples/sample_0?_R1.fq.gz", { codeTitle: "EXAMPLES" });
    }

    {
        const s = contentSlide(pres, { title: "Common tripwires", eyebrow: "WATCH FOR" });
        bullets(s, [
            "Tilde (~) is a shell expansion — Python config files don't expand it for you",
            "Spaces in filenames break naive scripts; quote your variables",
            "rm has no Trash; rm -rf has no Trash either, but more enthusiastically",
            "Tab completion is a correctness tool, not a convenience — it catches missing files before you run",
        ]);
    }

    {
        const s = contentSlide(pres, { title: "Exercise — find, count, size", eyebrow: "8 MIN · PAIRS" });
        s.addText([
            { text: "Given the workshop data directory, use the shell to:", options: { breakLine: true } },
            { text: "1. List every .fastq.gz file under it.", options: { bullet: false, breakLine: true } },
            { text: "2. Count how many there are.", options: { breakLine: true } },
            { text: "3. Report the total size in human-readable form.", options: { breakLine: true } },
        ], { x: 0.7, y: 1.85, w: 12, h: 2.5, fontFace: FONT.body, fontSize: 18, color: PALETTE.text, paraSpaceAfter: 6 });

        s.addShape(pres.shapes.RECTANGLE, {
            x: 0.7, y: 4.5, w: 12.0, h: 1.6, fill: { color: PALETTE.cream }, line: { color: PALETTE.rule }
        });
        s.addText("HINT", { x: 0.9, y: 4.62, w: 2, h: 0.3, margin: 0, fontFace: FONT.body, fontSize: 11, color: PALETTE.moss, bold: true, charSpacing: 6 });
        s.addText("find — recurse and filter\nwc -l — count lines\ndu -sh — total size, human-readable", { x: 0.9, y: 4.95, w: 11.6, h: 1.1, margin: 0, fontFace: FONT.mono, fontSize: 14, color: PALETTE.text });
    }

    pres.slides.forEach((s, i) => addFooter(s, "Shell I · Day 1 Session 2", i + 1, pres.slides.length));
    await pres.writeFile({ fileName: path.join(__dirname, "..", "slides", "day1-02-shell-basics.pptx") });
    console.log("✓ day1-02-shell-basics.pptx");
}

// ---------------------------------------------------------------------------
// Slide 3 — Shell II + HPC (Day 1 Session 3)
// ---------------------------------------------------------------------------
async function buildShellHPC() {
    const pres = newDeck(); pres_global = pres;
    pres.title = "Shell II + HPC";

    titleSlide(pres, { eyebrow: "DAY 1 · SESSION 3", title: "Shell II", subtitle: "Pipes, scripting, and the HPC", deckLabel: "90 minutes · live coding · first job submission" });

    {
        const s = contentSlide(pres, { title: "Three pieces, one workflow", eyebrow: "GOAL" });
        bullets(s, [
            "Combine grep, cut, sort, uniq, wc with pipes to answer questions",
            "Write a defensible shell script — shebang, set -euo pipefail, variables, loops",
            "Recognize sbatch / srun / squeue and the login-vs-compute split",
            "Submit a job, find its stdout/stderr, and know why it died when it does",
        ]);
    }

    {
        const s = contentSlide(pres, { title: "Pipes and redirection", eyebrow: "STREAMS" });
        twoColumnCode(s, [
            "| sends stdout into the next command",
            "> overwrites; >> appends",
            "2> redirects stderr",
            "2>&1 merges them",
            "Pipes don't write a file unless you tell them to",
        ], "$ ls envs/ | wc -l\n4\n\n$ ls > listing.txt\n$ ls /none 2> err.txt\n\n$ ls /none > out.txt 2>&1\n$ cat out.txt", { codeTitle: "REDIRECTION" });
    }

    {
        const s = contentSlide(pres, { title: "The Unix toolbox", eyebrow: "GREP · CUT · SORT · UNIQ" });
        twoColumnCode(s, [
            "Each tool does one thing. Compose them.",
            "Read a CSV with cut -d, -f<n>",
            "tail -n +2 skips the header",
            "uniq -c counts after sort",
            "Pipe everything; commit the recipe",
        ], "# how many samples per condition?\n$ cut -d, -f2 samplesheet.csv \\\n  | tail -n +2 \\\n  | sort | uniq -c\n  3 control\n  3 treated\n\n# which samples are 'treated'?\n$ grep ',treated,' samplesheet.csv \\\n  | cut -d, -f1", { codeTitle: "REAL EXAMPLE" });
    }

    {
        const s = contentSlide(pres, { title: "A defensible shell script", eyebrow: "WRITE IT ONCE" });
        fullCodeSlide(s,
`#!/usr/bin/env bash
# count_reads.sh — print read count of every FASTQ in a directory.
set -euo pipefail

DATA_DIR="\${1:-.}"

for f in "$DATA_DIR"/*.fastq.gz; do
    n=$(zcat "$f" | awk 'END {print NR/4}')
    printf "%s\\t%d\\n" "$(basename "$f")" "$n"
done`,
            "set -euo pipefail makes failures loud. Quotes around variables protect against spaces."
        );
    }

    {
        const s = contentSlide(pres, { title: "Login node ≠ compute node", eyebrow: "HPC SHAPE" });

        // Diagram: laptop → ssh → login → SLURM → compute
        const yMid = 3.0;
        const nodes = [
            { x: 0.7,  label: "laptop"        },
            { x: 3.0,  label: "login\nnode"   },
            { x: 6.4,  label: "SLURM"         },
            { x: 9.5,  label: "compute\nnode" },
        ];
        for (let i = 0; i < nodes.length; i++) {
            const b = nodes[i];
            s.addShape(pres.shapes.OVAL, {
                x: b.x, y: yMid, w: 1.7, h: 1.7,
                fill: { color: PALETTE.cream }, line: { color: PALETTE.forest, width: 2 }
            });
            s.addText(b.label, {
                x: b.x, y: yMid + 0.4, w: 1.7, h: 0.95, margin: 0,
                fontFace: FONT.head, fontSize: 16, color: PALETTE.text,
                align: "center", bold: true, valign: "middle",
            });
            if (i < nodes.length - 1) {
                s.addShape(pres.shapes.LINE, {
                    x: b.x + 1.7, y: yMid + 0.85, w: nodes[i+1].x - (b.x + 1.7), h: 0,
                    line: { color: PALETTE.moss, width: 2 }
                });
            }
        }
        // arrow labels
        s.addText("ssh", { x: 1.4, y: yMid + 0.45, w: 1.4, h: 0.3, margin: 0, fontFace: FONT.mono, fontSize: 12, color: PALETTE.textMuted, align: "center" });
        s.addText("sbatch", { x: 4.1, y: yMid + 0.45, w: 2.1, h: 0.3, margin: 0, fontFace: FONT.mono, fontSize: 12, color: PALETTE.textMuted, align: "center" });
        s.addText("schedules", { x: 7.5, y: yMid + 0.45, w: 1.9, h: 0.3, margin: 0, fontFace: FONT.mono, fontSize: 12, color: PALETTE.textMuted, align: "center" });

        s.addText([
            { text: "Login is shared. ", options: { bold: true } },
            { text: "Don't run analyses there.", options: { breakLine: true } },
            { text: "Compute is where the work happens — reach it through sbatch.", options: { breakLine: true } },
            { text: "Always set --time and --mem; check stdout/stderr in the --output and --error files.", options: {} },
        ], { x: 0.7, y: 5.4, w: 12, h: 1.5, fontFace: FONT.body, fontSize: 14, color: PALETTE.text, paraSpaceAfter: 4 });
    }

    {
        const s = contentSlide(pres, { title: "A minimal sbatch", eyebrow: "SUBMIT" });
        fullCodeSlide(s,
`#!/usr/bin/env bash
#SBATCH --job-name=count_reads
#SBATCH --time=00:05:00
#SBATCH --mem=1G
#SBATCH --cpus-per-task=1
#SBATCH --output=logs/count_%j.out
#SBATCH --error=logs/count_%j.err

set -euo pipefail
source ~/miniforge3/etc/profile.d/conda.sh
conda activate workshop
bash count_reads.sh "$WORKSHOP_DATA/samples"

# submit:    sbatch submit.sbatch
# check:     squeue -u $USER
# inspect:   cat logs/count_<jobid>.out`,
            "%j is the job ID. Always activate the env explicitly — compute nodes do not inherit your login shell."
        );
    }

    {
        const s = contentSlide(pres, { title: "Common tripwires", eyebrow: "WATCH FOR" });
        bullets(s, [
            "> overwrites silently — no prompt, no recovery",
            "for is not parallelism; iterations run one at a time",
            "$VAR vs. \"$VAR\" is not stylistic — quote your variables",
            "A failed job is a successful sbatch — the error is in the .err file, not the return value",
            "Don't run on the login node. Don't run on the login node. Don't run on the login node.",
        ]);
    }

    {
        const s = contentSlide(pres, { title: "Exercise — your first job", eyebrow: "12 MIN · PAIRS" });
        bullets(s, [
            "Write count_reads.sh (12 lines, set -euo pipefail, for-loop)",
            "Adapt submit.sbatch from the lesson README",
            "Submit it: sbatch submit.sbatch \"$WORKSHOP_DATA/samples\"",
            "Verify with squeue -u $USER, then read logs/count_*.out",
            "Stretch: read filenames from samplesheet.csv instead of globbing",
        ]);
    }

    pres.slides.forEach((s, i) => addFooter(s, "Shell II + HPC · Day 1 Session 3", i + 1, pres.slides.length));
    await pres.writeFile({ fileName: path.join(__dirname, "..", "slides", "day1-03-shell-pipes-hpc.pptx") });
    console.log("✓ day1-03-shell-pipes-hpc.pptx");
}

// ---------------------------------------------------------------------------
// Slide 4 — Environments
// ---------------------------------------------------------------------------
async function buildEnvironments() {
    const pres = newDeck(); pres_global = pres;
    pres.title = "Environments";

    titleSlide(pres, { eyebrow: "DAY 1 · SESSION 4", title: "Environments", subtitle: "Conda, mamba, and an honest look at containers", deckLabel: "90 minutes · YAMLs are the artifact" });

    {
        const s = contentSlide(pres, { title: "Why environments exist", eyebrow: "THE PROBLEM" });
        statCallout(s, { stat: "1.17", label: "the version of samtools you used", x: 0.8, y: 1.7, w: 5.5, h: 2.4 });
        statCallout(s, { stat: "1.9",  label: "the version your collaborator has",  x: 7.0, y: 1.7, w: 5.5, h: 2.4 });
        s.addText([
            { text: "Different defaults. Different output. Different conclusions.", options: { bold: true, breakLine: true } },
            { text: "An environment captures every package and version. Activate it, your PATH points at exactly those binaries. Ship the YAML alongside your paper, your collaborator recreates it bit-for-bit.", options: {} },
        ], {
            x: 0.7, y: 4.6, w: 12, h: 2.3, margin: 0,
            fontFace: FONT.body, fontSize: 16, color: PALETTE.text, paraSpaceAfter: 6
        });
    }

    {
        const s = contentSlide(pres, { title: "Create, activate, verify", eyebrow: "MUSCLE MEMORY" });
        fullCodeSlide(s,
`# Create from a YAML
$ mamba env create -f envs/workshop.yaml

# Activate
$ mamba activate workshop

# Verify what's actually on PATH
$ which samtools
~/miniforge3/envs/workshop/bin/samtools

$ samtools --version | head -1
samtools 1.21

# Update from an edited YAML (does not remove what you removed)
$ mamba env update -f envs/workshop.yaml`,
            "If something runs the wrong version, `which` tells you where it came from. Nine times out of ten the env is not active."
        );
    }

    {
        const s = contentSlide(pres, { title: "A YAML, dissected", eyebrow: "ANATOMY" });
        s.addShape(pres.shapes.RECTANGLE, {
            x: 0.6, y: 1.7, w: 6.5, h: 5.0, fill: { color: PALETTE.cream }, line: { color: PALETTE.rule }
        });
        s.addText(
`name: my-project
channels:
  - conda-forge
  - bioconda
  - nodefaults
dependencies:
  - python=3.11
  - samtools=1.21
  - bcftools=1.21
  - pip
  - pip:
      - some-pure-python-package==1.2.3`,
            { x: 0.85, y: 1.85, w: 6.1, h: 4.7, margin: 0, fontFace: FONT.mono, fontSize: 14, color: PALETTE.text, valign: "top" }
        );

        s.addText([
            { text: "Channel order matters. ", options: { bold: true } },
            { text: "conda-forge → bioconda → nodefaults. Mixing produces solver pain.", options: { breakLine: true, breakLine: true }},
            { text: "Pin what matters. ", options: { bold: true } },
            { text: "Tools whose behavior is your method. Not python patch versions.", options: { breakLine: true, breakLine: true }},
            { text: "Pip is for pure-Python packages not on conda. ", options: { bold: true } },
            { text: "Always last in the dependencies block.", options: {} },
        ], {
            x: 7.3, y: 1.85, w: 5.6, h: 4.9, margin: 0,
            fontFace: FONT.body, fontSize: 14, color: PALETTE.text, paraSpaceAfter: 8,
        });
    }

    {
        const s = contentSlide(pres, { title: "Containers — when conda is not enough", eyebrow: "THE NEXT STEP UP" });
        await iconRowGrid(pres, s, [
            { icon: FA.FaCube,    title: "Docker",                 body: "Local development; ubiquitous in CI." },
            { icon: FA.FaShip,    title: "Singularity / Apptainer", body: "HPC-friendly cousin of Docker; runs without root." },
            { icon: FA.FaBookOpen,title: "When to reach for one",  body: "System libraries; bit-exact reproducibility; tools that fight each other in conda." },
            { icon: FA.FaRunning, title: "When NOT to",             body: "Most workshop-style work — conda alone is enough. Don't pay the build/registry cost without the benefit." },
        ], { cols: 2 });
    }

    {
        const s = contentSlide(pres, { title: "Modules vs. conda on HPC", eyebrow: "DON'T MIX BLINDLY" });
        bullets(s, [
            "Module systems (module avail / module load) are HPC-local. Modules don't follow you to your laptop.",
            "Conda envs are portable — same YAML works on the cluster, your laptop, AWS.",
            "If both exist for a tool, prefer conda. Modules for things conda can't provide (proprietary compilers, niche MPI builds).",
            "Don't activate a module and a conda env in the same shell unless you know your PATH cold.",
        ]);
    }

    {
        const s = contentSlide(pres, { title: "Common tripwires", eyebrow: "WATCH FOR" });
        bullets(s, [
            "pip install inside an active conda env can quietly break it — they don't communicate",
            "base is for conda itself, not your project — every project gets its own env",
            "which <tool> is your friend when the wrong version runs",
            "A YAML and a lock file are different. YAML = intent. Lock = exact result. Both have their place.",
        ]);
    }

    {
        const s = contentSlide(pres, { title: "Exercise — pin a version", eyebrow: "10 MIN" });
        bullets(s, [
            "Edit starter-env.yaml to pin samtools to a specific version",
            "Recreate the env: mamba env create -f starter-env.yaml -n my-project-pinned",
            "Activate it. Run samtools --version. Confirm the version matches.",
            "Write one sentence in the etherpad: why pin samtools but not python's patch version?",
        ]);
    }

    pres.slides.forEach((s, i) => addFooter(s, "Environments · Day 1 Session 4", i + 1, pres.slides.length));
    await pres.writeFile({ fileName: path.join(__dirname, "..", "slides", "day1-04-environments.pptx") });
    console.log("✓ day1-04-environments.pptx");
}

// ---------------------------------------------------------------------------
// Slide 5 — Project + Git
// ---------------------------------------------------------------------------
async function buildProjectGit() {
    const pres = newDeck(); pres_global = pres;
    pres.title = "Project Structure and Version Control";

    titleSlide(pres, { eyebrow: "DAY 1 · SESSION 5", title: "Project + Git", subtitle: "A layout you can defend; a history a stranger can read", deckLabel: "75 minutes · push to GitHub by 16:15" });

    {
        const s = contentSlide(pres, { title: "By the end of this session", eyebrow: "GOAL" });
        bullets(s, [
            "Lay out a bioinformatics project that makes the data flow obvious",
            "Initialize a Git repository with a meaningful .gitignore",
            "Commit incrementally — messages explain why, not what",
            "Push to GitHub; confirm a stranger could clone it",
            "Internalize: never commit raw data, ever",
        ]);
    }

    {
        const s = contentSlide(pres, { title: "The layout", eyebrow: "ANATOMY" });
        s.addShape(pres.shapes.RECTANGLE, {
            x: 0.6, y: 1.7, w: 6.0, h: 5.0, fill: { color: PALETTE.cream }, line: { color: PALETTE.rule }
        });
        s.addText(
`project/
  data/
    raw/         immutable, not in git
    processed/   regenerable, not in git
  envs/          conda YAMLs
  scripts/       shell, R, Python
  results/       figures, tables
  notebooks/
  README.md
  .gitignore`,
            { x: 0.85, y: 1.85, w: 5.6, h: 4.7, margin: 0, fontFace: FONT.mono, fontSize: 14, color: PALETTE.text, valign: "top" }
        );

        s.addText([
            { text: "The principle.", options: { bold: true, breakLine: true }},
            { text: "Anything in data/processed/ and results/ is regeneratable from data/raw/ plus the code in scripts/ and notebooks/.", options: { breakLine: true, breakLine: true }},
            { text: "Editing a processed file by hand is a reproducibility hole. ", options: { bold: true }},
            { text: "Either move the file to raw/ (and accept it as input) or change the script that produces it.", options: {}},
        ], {
            x: 6.9, y: 1.85, w: 6.0, h: 5.0, margin: 0,
            fontFace: FONT.body, fontSize: 16, color: PALETTE.text, paraSpaceAfter: 8,
        });
    }

    {
        const s = contentSlide(pres, { title: "Eight commands cover today", eyebrow: "GIT, NARROWLY" });
        fullCodeSlide(s,
`$ git init
$ git status
$ git add <files>
$ git commit -m "Why this change matters"
$ git log --oneline
$ git diff
$ git remote add origin git@github.com:<you>/<repo>.git
$ git push -u origin main

# Branches, merges, rebase exist. Not today.`,
            "Today is the spine. Branches and rebase are their own workshop."
        );
    }

    {
        const s = contentSlide(pres, { title: "The .gitignore that saves you", eyebrow: "EXCLUDE BY DEFAULT" });
        fullCodeSlide(s,
`# Never commit data
data/raw/
data/processed/
*.fastq  *.fastq.gz
*.bam    *.bam.bai
*.vcf    *.vcf.gz
*.h5ad   *.rds

# Pipeline artifacts
work/    .nextflow*    .snakemake/

# Environments and caches
.conda/  .venv/  __pycache__/  .ipynb_checkpoints/

# IDE — commit settings, not workspace state
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json`,
            "The ! lines unignore specific files. We commit the IDE config that everyone should share, not the per-user workspace state."
        );
    }

    {
        const s = contentSlide(pres, { title: "What good commit messages look like", eyebrow: "WRITE FOR FUTURE-YOU" });

        s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.7, w: 6.0, h: 4.9, fill: { color: PALETTE.cream }, line: { color: PALETTE.rule }});
        s.addText("YES", { x: 0.85, y: 1.82, w: 1, h: 0.3, margin: 0, fontFace: FONT.body, fontSize: 11, color: PALETTE.forest, bold: true, charSpacing: 6 });
        s.addText(
`Lower MAPQ threshold to 20 to recover
known variants in repeat regions

Pin samtools=1.21; 1.18 changed the
default for -m in markdup

Document raw data path on HPC and
add SRA accession list to README`,
            { x: 0.85, y: 2.2, w: 5.6, h: 4.3, margin: 0, fontFace: FONT.mono, fontSize: 13, color: PALETTE.text, valign: "top" });

        s.addShape(pres.shapes.RECTANGLE, { x: 6.85, y: 1.7, w: 6.0, h: 4.9, fill: { color: PALETTE.cream }, line: { color: PALETTE.rule }});
        s.addText("NO", { x: 7.10, y: 1.82, w: 1, h: 0.3, margin: 0, fontFace: FONT.body, fontSize: 11, color: PALETTE.accent, bold: true, charSpacing: 6 });
        s.addText(
`update

fix

wip

asdf

stuff

final FINAL v2_REAL`,
            { x: 7.10, y: 2.2, w: 5.6, h: 4.3, margin: 0, fontFace: FONT.mono, fontSize: 13, color: PALETTE.text, valign: "top" });
    }

    {
        const s = contentSlide(pres, { title: "Common tripwires", eyebrow: "WATCH FOR" });
        bullets(s, [
            "\"Just this once\" committing data is forever — the file stays in history, even after rm and a new commit",
            "git add . is convenient and dangerous in a directory full of BAMs — git status first, always",
            "A README is not optional — it is the contract with anyone who clones",
            "Git LFS for large genomic files is rarely the right answer; use a data archive (Zenodo, institutional store) and link from README",
        ]);
    }

    {
        const s = contentSlide(pres, { title: "Exercise — push your project", eyebrow: "20 MIN · PAIRS" });
        bullets(s, [
            "Copy project-template/ to ~/my-workshop-project",
            "git init; commit the skeleton; push to a fresh GitHub repo",
            "Add a one-paragraph project description; commit; push",
            "Swap repos with another pair — clone theirs, follow their README; note any gap in the etherpad",
            "Apply your own pair's feedback and re-push",
        ]);
    }

    pres.slides.forEach((s, i) => addFooter(s, "Project + Git · Day 1 Session 5", i + 1, pres.slides.length));
    await pres.writeFile({ fileName: path.join(__dirname, "..", "slides", "day1-05-project-git.pptx") });
    console.log("✓ day1-05-project-git.pptx");
}

// ---------------------------------------------------------------------------
// Slide 6 — Database Landscape
// ---------------------------------------------------------------------------
async function buildDatabaseLandscape() {
    const pres = newDeck(); pres_global = pres;
    pres.title = "The Database Landscape";

    titleSlide(pres, { eyebrow: "DAY 2 · SESSION 1", title: "The landscape", subtitle: "Where data lives, organized by what it holds", deckLabel: "30 minutes · the map, not the catalog" });

    {
        const s = dividerSlide(pres, { kicker: "ONE THING TO TAKE FROM THIS SESSION", title: "For every external resource you use today,\nyou will commit a query script\nand record its release / date." });
    }

    {
        const s = contentSlide(pres, { title: "The map — by what they hold", eyebrow: "LANDSCAPE" });
        await iconRowGrid(pres, s, [
            { icon: FA.FaDna,         title: "Sequence + assemblies", body: "NCBI · Ensembl · UCSC · DDBJ / ENA" },
            { icon: FA.FaFileArchive, title: "Raw reads",             body: "SRA · ENA · DDBJ DRA" },
            { icon: FA.FaProjectDiagram, title: "Functional / pathway", body: "Gene Ontology · Reactome · KEGG · MSigDB" },
            { icon: FA.FaExclamationCircle, title: "Variants",        body: "dbSNP · ClinVar · gnomAD · COSMIC" },
            { icon: FA.FaChartBar,    title: "Expression",            body: "GEO · ArrayExpress · GTEx · HPA · CellxGene" },
            { icon: FA.FaCubes,       title: "Proteins + structures", body: "UniProt · InterPro · AlphaFold DB · PDB" },
        ], { cols: 3 });
    }

    {
        const s = contentSlide(pres, { title: "Two principles to repeat", eyebrow: "DECISION DISCIPLINE" });
        s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.8, w: 12.1, h: 2.2, fill: { color: PALETTE.cream }, line: { color: PALETTE.rule }});
        s.addText("1.", { x: 0.9, y: 1.95, w: 0.6, h: 0.6, margin: 0, fontFace: FONT.head, fontSize: 36, color: PALETTE.forest, bold: true });
        s.addText([
            { text: "The right resource is the one whose curation choices match your question.", options: { bold: true, breakLine: true }},
            { text: "RefSeq and Ensembl annotate the same human genome and disagree on hundreds of genes. Pick one. Document it. Don't mix.", options: {}}
        ], { x: 1.6, y: 1.95, w: 11.0, h: 1.9, margin: 0, fontFace: FONT.body, fontSize: 16, color: PALETTE.text, paraSpaceAfter: 6 });

        s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 4.2, w: 12.1, h: 2.2, fill: { color: PALETTE.cream }, line: { color: PALETTE.rule }});
        s.addText("2.", { x: 0.9, y: 4.35, w: 0.6, h: 0.6, margin: 0, fontFace: FONT.head, fontSize: 36, color: PALETTE.forest, bold: true });
        s.addText([
            { text: "A resource without a release/date is not a reproducible source.", options: { bold: true, breakLine: true }},
            { text: "Ensembl ships numbered releases on a schedule. dbSNP has builds. ClinVar has dated dumps. Record the version of every resource you query.", options: {}}
        ], { x: 1.6, y: 4.35, w: 11.0, h: 1.9, margin: 0, fontFace: FONT.body, fontSize: 16, color: PALETTE.text, paraSpaceAfter: 6 });
    }

    {
        const s = contentSlide(pres, { title: "Common silent mistakes", eyebrow: "WATCH FOR" });
        bullets(s, [
            "Mapping by gene symbol — symbols are aliased and renamed; use stable IDs and convert at the boundary",
            "Coordinate systems — GRCh37 ≠ GRCh38; lift-over is lossy at the edges",
            "Mixing RefSeq and Ensembl annotations in one analysis — the transcripts disagree",
            "\"I downloaded it once, so it's reproducible\" — not without the release pinned",
        ]);
    }

    {
        const s = contentSlide(pres, { title: "What we'll do this morning", eyebrow: "ROADMAP" });
        await iconRowGrid(pres, s, [
            { icon: FA.FaMousePointer, title: "Web walk-through", body: "NCBI, Ensembl, UCSC. The same task three ways." },
            { icon: FA.FaTerminal,     title: "CLI lane",         body: "datasets, esearch / efetch — committable scripts." },
            { icon: FA.FaRProject,     title: "R lane",           body: "biomaRt, AnnotationHub — Bioconductor objects." },
            { icon: FA.FaPython,       title: "Python lane",      body: "biopython, pyensembl, REST. Wrapper or raw API." },
        ], { cols: 2 });
    }

    pres.slides.forEach((s, i) => addFooter(s, "Database Landscape · Day 2 Session 1", i + 1, pres.slides.length));
    await pres.writeFile({ fileName: path.join(__dirname, "..", "slides", "day2-01-databases-landscape.pptx") });
    console.log("✓ day2-01-databases-landscape.pptx");
}

// ---------------------------------------------------------------------------
// Slide 7 — Web Portals
// ---------------------------------------------------------------------------
async function buildWebPortals() {
    const pres = newDeck(); pres_global = pres;
    pres.title = "Web-First: NCBI, Ensembl, UCSC";

    titleSlide(pres, { eyebrow: "DAY 2 · SESSION 2", title: "Web portals", subtitle: "NCBI, Ensembl, UCSC — the same task three ways", deckLabel: "60 minutes · live demos" });

    {
        const s = contentSlide(pres, { title: "By the end of this session", eyebrow: "GOAL" });
        bullets(s, [
            "Find a gene record, its assembly, and its annotation files on NCBI",
            "Use Ensembl BioMart to extract a metadata table without writing code",
            "Use UCSC's Genome Browser and Table Browser to load tracks and pull intervals",
            "Identify the assembly version and resource release of any record you retrieve",
        ]);
    }

    {
        const s = contentSlide(pres, { title: "NCBI — gene → assembly → files", eyebrow: "PATH ONE" });
        s.addText([
            { text: "1. ", options: { bold: true }},
            { text: "Search a gene at ncbi.nlm.nih.gov/gene/", options: { breakLine: true }},
            { text: "2. ", options: { bold: true }},
            { text: "Note chromosome, canonical RefSeq transcript, gene type", options: { breakLine: true }},
            { text: "3. ", options: { bold: true }},
            { text: "Follow to the Assembly — record the accession (e.g. GCF_000001405.40)", options: { breakLine: true }},
            { text: "4. ", options: { bold: true }},
            { text: "Download options: genomic FASTA, GTF, GFF, protein FASTA", options: { breakLine: true }},
            { text: "5. ", options: { bold: true }},
            { text: "SRA Run Selector: trace from gene/study to raw reads", options: {}},
        ], {
            x: 0.7, y: 1.8, w: 12, h: 3.6, margin: 0,
            fontFace: FONT.body, fontSize: 17, color: PALETTE.text, paraSpaceAfter: 8,
        });

        s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 5.5, w: 12, h: 1.4, fill: { color: PALETTE.cream }, line: { color: PALETTE.rule }});
        s.addText("THE ACCESSION IS THE STABLE HANDLE", { x: 0.9, y: 5.6, w: 11.6, h: 0.3, margin: 0, fontFace: FONT.body, fontSize: 11, color: PALETTE.moss, bold: true, charSpacing: 6 });
        s.addText("One click in the web UI ≡ one shell command tomorrow:\n   datasets download genome accession GCF_000001405.40 --include gff3,gtf,protein", { x: 0.9, y: 5.95, w: 11.6, h: 0.95, margin: 0, fontFace: FONT.mono, fontSize: 13, color: PALETTE.text });
    }

    {
        const s = contentSlide(pres, { title: "Ensembl — gene page and BioMart", eyebrow: "PATH TWO" });
        s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.7, w: 6.0, h: 5.0, fill: { color: PALETTE.cream }, line: { color: PALETTE.rule }});
        s.addText("GENE PAGE", { x: 0.85, y: 1.85, w: 5, h: 0.3, margin: 0, fontFace: FONT.body, fontSize: 11, color: PALETTE.moss, bold: true, charSpacing: 6 });
        s.addText([
            { text: "ensembl.org → search for the gene", options: { bullet: { code: "25A0" }, breakLine: true }},
            { text: "Stable Ensembl gene ID (ENSG…)", options: { bullet: { code: "25A0" }, breakLine: true }},
            { text: "Release number is in the page header — record it", options: { bullet: { code: "25A0" }, breakLine: true }},
            { text: "Comparative Genomics → Orthologues", options: { bullet: { code: "25A0" }, breakLine: true }},
            { text: "Genomic alignments where relevant", options: { bullet: { code: "25A0" }}},
        ], { x: 0.85, y: 2.25, w: 5.6, h: 4.4, margin: 0, fontFace: FONT.body, fontSize: 14, color: PALETTE.text, paraSpaceAfter: 8 });

        s.addShape(pres.shapes.RECTANGLE, { x: 6.85, y: 1.7, w: 6.0, h: 5.0, fill: { color: PALETTE.cream }, line: { color: PALETTE.rule }});
        s.addText("BIOMART", { x: 7.10, y: 1.85, w: 5, h: 0.3, margin: 0, fontFace: FONT.body, fontSize: 11, color: PALETTE.moss, bold: true, charSpacing: 6 });
        s.addText([
            { text: "Top nav → BioMart → Ensembl Genes", options: { bullet: { code: "25A0" }, breakLine: true }},
            { text: "Filters: e.g., chromosome 17", options: { bullet: { code: "25A0" }, breakLine: true }},
            { text: "Attributes: ID, name, biotype, description", options: { bullet: { code: "25A0" }, breakLine: true }},
            { text: "Results as TSV — no code needed", options: { bullet: { code: "25A0" }, breakLine: true }},
            { text: "Save the XML query — the same R/biomaRt speaks", options: { bullet: { code: "25A0" }}},
        ], { x: 7.10, y: 2.25, w: 5.6, h: 4.4, margin: 0, fontFace: FONT.body, fontSize: 14, color: PALETTE.text, paraSpaceAfter: 8 });
    }

    {
        const s = contentSlide(pres, { title: "UCSC — browser and Table Browser", eyebrow: "PATH THREE" });
        bullets(s, [
            "Genome Browser: pick the assembly that matches your data — read it twice",
            "Default tracks: Genes, RefSeq, ENCODE",
            "Custom tracks: load a BED or BedGraph from your project — verify in context",
            "Table Browser → choose track, region, output BED → \"get output\"",
            "liftOver: chain files for coordinate translation between assemblies (lossy at the edges)",
        ]);
    }

    {
        const s = contentSlide(pres, { title: "Tripwires you'll see again", eyebrow: "WATCH FOR" });
        bullets(s, [
            "Assembly mismatch — GRCh37 vs GRCh38 silently looks wrong, doesn't error",
            "Symbol-based lookups return different records on NCBI vs Ensembl — use stable IDs once you have them",
            "BioMart serves the latest release by default — pin via the archive site (archive.ensembl.org) for reproducibility",
        ]);
    }

    {
        const s = dividerSlide(pres, { kicker: "BRIDGE TO THE NEXT SESSION", title: "Every action you just did by clicking\ncan be done by typing.\nWhat typing buys you: a committed script." });
    }

    pres.slides.forEach((s, i) => addFooter(s, "Web Portals · Day 2 Session 2", i + 1, pres.slides.length));
    await pres.writeFile({ fileName: path.join(__dirname, "..", "slides", "day2-02-web-portals.pptx") });
    console.log("✓ day2-02-web-portals.pptx");
}

// ---------------------------------------------------------------------------
// Slide 8 — Programmatic Access
// ---------------------------------------------------------------------------
async function buildProgrammaticAccess() {
    const pres = newDeck(); pres_global = pres;
    pres.title = "Programmatic Access";

    titleSlide(pres, { eyebrow: "DAY 2 · SESSION 3", title: "Programmatic access", subtitle: "CLI · R · Python — pick the right interface for the job", deckLabel: "90 minutes · provenance is the deliverable" });

    {
        const s = contentSlide(pres, { title: "Three lanes", eyebrow: "PICK ONE PER TASK" });
        await iconRowGrid(pres, s, [
            { icon: FA.FaTerminal, title: "CLI", body: "datasets · esearch / efetch / xtract. Composes with Unix. Best for bulk and scripted retrieval." },
            { icon: FA.FaRProject, title: "R / Bioconductor", body: "biomaRt · AnnotationHub. Returns Bioconductor objects your downstream code already speaks." },
            { icon: FA.FaPython,   title: "Python", body: "biopython · pyensembl · requests. When the wrapper breaks, fall back to the underlying API." },
        ], { cols: 3 });
    }

    {
        const s = contentSlide(pres, { title: "CLI — fetch an assembly", eyebrow: "datasets" });
        fullCodeSlide(s,
`#!/usr/bin/env bash
set -euo pipefail
ACCESSION="\${1:?accession required}"
OUTDIR="\${2:?outdir required}"
mkdir -p "$OUTDIR"

# Inspect first
datasets summary genome accession "$ACCESSION" \\
  | jq '.reports[0] | {accession, organism, assembly_level}'

# Then download
datasets download genome accession "$ACCESSION" \\
  --include genome,gff3,gtf,protein \\
  --filename "$OUTDIR/$ACCESSION.zip"

# Record what we did
{ echo "ncbi_assembly: $ACCESSION";
  echo "ncbi_query_date: $(date -u +%Y-%m-%dT%H:%M:%SZ)";
  echo "datasets_version: $(datasets --version)";
} >> "$OUTDIR/versions.txt"`,
            "Inspect → fetch → record. Every fetch produces a versions.txt entry."
        );
    }

    {
        const s = contentSlide(pres, { title: "R — pin the release", eyebrow: "biomaRt" });
        fullCodeSlide(s,
`library(biomaRt)

# PIN the release. Without this, BioMart serves whatever
# is current — and your query becomes irreproducible the
# moment Ensembl ships its next release.
mart <- useEnsembl(
  biomart = "genes",
  dataset = "hsapiens_gene_ensembl",
  version = 111
)

res <- getBM(
  attributes = c("ensembl_gene_id", "external_gene_name",
                 "gene_biotype", "chromosome_name",
                 "start_position", "end_position"),
  filters    = c("chromosome_name", "biotype"),
  values     = list("17", "protein_coding"),
  mart       = mart
)`,
            "Pin via 'version'. For maximum reproducibility, point at archive.ensembl.org for that release."
        );
    }

    {
        const s = contentSlide(pres, { title: "Python — wrapper or raw REST", eyebrow: "pyensembl + requests" });
        twoColumnCode(s, [
            "pyensembl: cached, fast, offline after first use",
            "Construct with a release number — that is the pin",
            "biopython.Entrez: NCBI's docs as Python objects",
            "requests against an archive host: maximum control",
            "Always set User-Agent and a contact email",
        ],
`from pyensembl import EnsemblRelease

data = EnsemblRelease(111)   # the pin
data.download(); data.index()

gene = data.genes_by_name("TP53")[0]
print(gene.gene_id, gene.contig,
      gene.start, gene.end)

for t in gene.transcripts:
    print(t.transcript_id,
          t.biotype, len(t))`,
            { codeTitle: "PYENSEMBL EXAMPLE" });
    }

    {
        const s = contentSlide(pres, { title: "The provenance discipline", eyebrow: "EVERY SCRIPT WRITES THIS" });
        s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.8, w: 12.1, h: 3.0, fill: { color: PALETTE.cream }, line: { color: PALETTE.rule }});
        s.addText("versions.txt", { x: 0.85, y: 1.95, w: 5, h: 0.3, margin: 0, fontFace: FONT.mono, fontSize: 13, color: PALETTE.moss, bold: true });
        s.addText(
`ensembl_release: 111
ensembl_query_date: 2024-04-15T14:32:00Z
ncbi_assembly: GCF_000005845.2
ncbi_query_date: 2024-04-15T14:32:18Z
biomart_url: https://www.ensembl.org/biomart
biomaRt_version: 2.58.2
R_version: 4.3.2`,
            { x: 0.85, y: 2.35, w: 11.6, h: 2.4, margin: 0, fontFace: FONT.mono, fontSize: 14, color: PALETTE.text });

        s.addText([
            { text: "Commit it. ", options: { bold: true }},
            { text: "Without it, \"I queried Ensembl\" is not a reproducible statement.", options: {}},
        ], { x: 0.7, y: 5.1, w: 12, h: 1.5, fontFace: FONT.body, fontSize: 16, color: PALETTE.text });
    }

    {
        const s = contentSlide(pres, { title: "Common tripwires", eyebrow: "WATCH FOR" });
        bullets(s, [
            "\"I downloaded it once, so it's reproducible\" — not if you cannot say which release",
            "\"The API gave me a different answer last week\" — yes, because Ensembl ships on a schedule",
            "\"The wrapper is the API\" — it isn't; when it breaks, fall back to the underlying API",
            "Caching is automatic in pyensembl and AnnotationHub — not in biopython.Entrez or raw requests",
        ]);
    }

    {
        const s = contentSlide(pres, { title: "Exercise — commit a query", eyebrow: "20 MIN · PAIRS" });
        bullets(s, [
            "Add to your Day 1 project: scripts/01_fetch_reference.sh (or .R, .py)",
            "Pull the workshop assembly by accession; record release/date in versions.txt",
            "Build a small metadata table from BioMart or pyensembl",
            "Commit. Push. Swap repos with another pair and rerun their script.",
            "If the outputs aren't identical — find and fix the gap.",
        ]);
    }

    pres.slides.forEach((s, i) => addFooter(s, "Programmatic Access · Day 2 Session 3", i + 1, pres.slides.length));
    await pres.writeFile({ fileName: path.join(__dirname, "..", "slides", "day2-03-programmatic-access.pptx") });
    console.log("✓ day2-03-programmatic-access.pptx");
}

// ---------------------------------------------------------------------------
// Slide 9 — VS Code IDE
// ---------------------------------------------------------------------------
async function buildVscodeIde() {
    const pres = newDeck(); pres_global = pres;
    pres.title = "VS Code as a Bioinformatics IDE";

    titleSlide(pres, { eyebrow: "DAY 2 · SESSION 4", title: "The IDE", subtitle: "VS Code with Remote-SSH, debugger, linting, and Git", deckLabel: "90 minutes · the segment that changes how you work" });

    {
        const s = contentSlide(pres, { title: "Why bother with an IDE", eyebrow: "MOTIVATION" });
        bullets(s, [
            "The interpreter, terminal, debugger, notebook, and Git all point at the same env",
            "Linters catch bugs at save-time, not at runtime, not at review-time",
            "Diffs are visual — staging hunks (not whole files) becomes routine",
            "Notebooks finally have readable diffs",
            "Remote-SSH: edit on your laptop, run on the HPC, no scp dance",
        ]);
    }

    {
        const s = contentSlide(pres, { title: "Remote-SSH — the pivotal demo", eyebrow: "EDIT HERE, RUN THERE" });

        // Diagram
        const yMid = 2.8;
        s.addShape(pres.shapes.OVAL, { x: 1.5, y: yMid, w: 2.0, h: 2.0, fill: { color: PALETTE.white }, line: { color: PALETTE.forest, width: 2 }});
        s.addText("VS Code\n(your laptop)", { x: 1.4, y: yMid + 0.6, w: 2.2, h: 0.9, margin: 0, fontFace: FONT.body, fontSize: 14, color: PALETTE.text, align: "center", bold: true });

        s.addShape(pres.shapes.OVAL, { x: 9.7, y: yMid, w: 2.0, h: 2.0, fill: { color: PALETTE.cream }, line: { color: PALETTE.forest, width: 2 }});
        s.addText("Files + terminal\n(the HPC)", { x: 9.6, y: yMid + 0.6, w: 2.2, h: 0.9, margin: 0, fontFace: FONT.body, fontSize: 14, color: PALETTE.text, align: "center", bold: true });

        s.addShape(pres.shapes.LINE, { x: 3.5, y: yMid + 1.0, w: 6.2, h: 0, line: { color: PALETTE.moss, width: 3 }});
        s.addText("ssh tunnel", { x: 4.5, y: yMid + 0.5, w: 4, h: 0.4, margin: 0, fontFace: FONT.mono, fontSize: 14, color: PALETTE.textMuted, align: "center" });

        s.addText([
            { text: "Cmd+Shift+P → \"Remote-SSH: Connect to Host…\"", options: { breakLine: true }},
            { text: "Open the project folder. Open the terminal. The terminal lives on the HPC.", options: { breakLine: true, breakLine: true }},
            { text: "Editor on laptop. Files on cluster. One window. ", options: { bold: true }},
            { text: "This is the demo that changes how learners work.", options: {}},
        ], { x: 0.7, y: 5.25, w: 12, h: 1.7, margin: 0, fontFace: FONT.body, fontSize: 14, color: PALETTE.text, paraSpaceAfter: 4 });
    }

    {
        const s = contentSlide(pres, { title: "Interpreter selection", eyebrow: "ONE SETTING, MANY PROBLEMS GONE" });
        bullets(s, [
            "Cmd+Shift+P → \"Python: Select Interpreter\" → workshop",
            "Now: every terminal auto-activates that env; the debugger uses its python; Jupyter binds to its kernel",
            "The single most common silent failure in bioinformatics — running a script against the wrong python — disappears",
            "For R: install the R extension, set r.rterm.linux to the env's R binary",
        ]);
    }

    {
        const s = contentSlide(pres, { title: "Workspace settings, committed", eyebrow: ".vscode/settings.json" });
        fullCodeSlide(s,
`{
  "editor.formatOnSave": true,
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.codeActionsOnSave": {
      "source.fixAll.ruff": "explicit",
      "source.organizeImports.ruff": "explicit"
    }
  },
  "ruff.lineLength": 88,
  "r.rterm.linux": "\${env:CONDA_PREFIX}/bin/R",
  "shellcheck.run": "onSave",
  "git.autofetch": true
}`,
            "Commit settings.json and extensions.json. The IDE behavior in this project is part of the project."
        );
    }

    {
        const s = contentSlide(pres, { title: "Linting catches real bugs", eyebrow: "NOT JUST STYLE" });

        s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.7, w: 6.0, h: 5.0, fill: { color: PALETTE.cream }, line: { color: PALETTE.rule }});
        s.addText("BEFORE", { x: 0.85, y: 1.85, w: 2, h: 0.3, margin: 0, fontFace: FONT.body, fontSize: 11, color: PALETTE.accent, bold: true, charSpacing: 6 });
        s.addText(
`def summarize(df):
    n = 0
    for n in df["read_count"]:
        n + n
    return n

# ruff:
# F401 'json' imported but unused
# PLW2901 outer 'n' overwritten by loop
# B007 loop variable 'n' not used`,
            { x: 0.85, y: 2.2, w: 5.6, h: 4.3, margin: 0, fontFace: FONT.mono, fontSize: 13, color: PALETTE.text });

        s.addShape(pres.shapes.RECTANGLE, { x: 6.85, y: 1.7, w: 6.0, h: 5.0, fill: { color: PALETTE.cream }, line: { color: PALETTE.rule }});
        s.addText("AFTER", { x: 7.10, y: 1.85, w: 2, h: 0.3, margin: 0, fontFace: FONT.body, fontSize: 11, color: PALETTE.forest, bold: true, charSpacing: 6 });
        s.addText(
`def summarize(df):
    return int(df["read_count"].sum())

# Read the lint, then decide:
#   - F401 (unused import) → auto-fix
#   - PLW2901 (shadowed name) → real bug
#
# Linting is bug detection.
# It happens to also catch style.`,
            { x: 7.10, y: 2.2, w: 5.6, h: 4.3, margin: 0, fontFace: FONT.mono, fontSize: 13, color: PALETTE.text });
    }

    {
        const s = contentSlide(pres, { title: "The debugger replaces print", eyebrow: "BREAK · STEP · INSPECT" });
        await iconRowGrid(pres, s, [
            { icon: FA.FaCircle,         title: "Set a breakpoint",    body: "Click in the gutter at the suspect line. Red dot." },
            { icon: FA.FaPlay,           title: "Run under debugger",  body: "F5. Execution pauses at the breakpoint." },
            { icon: FA.FaSearch,         title: "Inspect variables",   body: "Variables pane shows everything in scope. Watch arbitrary expressions." },
            { icon: FA.FaStepForward,    title: "Step through",        body: "F10 over, F11 into, F5 continue. Find the bug without instrumenting it." },
        ], { cols: 2 });
    }

    {
        const s = contentSlide(pres, { title: "Integrated Git", eyebrow: "STAGE · DIFF · COMMIT · PUSH" });
        bullets(s, [
            "File-level diff in the gutter — green/red bars next to changed lines",
            "Stage hunks, not whole files, with the + icon next to a hunk in the diff",
            "Commit with a message in the panel; push with the sync button",
            "GitLens: hover any line to see who changed it, when, and the commit message",
            "Notebooks (.ipynb) get cell-by-cell diffs; Quarto (.qmd) gets ordinary text diffs",
        ]);
    }

    {
        const s = contentSlide(pres, { title: "Common tripwires", eyebrow: "WATCH FOR" });
        bullets(s, [
            "Sourcing the env in a terminal isn't enough — the editor doesn't know; set the interpreter",
            "Some lints are style; many are bug detection — read the message before suppressing",
            "Print debugging is fine for one-liners; for anything calling 3+ functions, the debugger is faster",
            "Pushing from the IDE is git push either way — it just shows you the diff first, which is safer",
        ]);
    }

    {
        const s = contentSlide(pres, { title: "Exercise — debug a real bug", eyebrow: "30 MIN · PAIRS" });
        bullets(s, [
            "Open the Day 1 project in VS Code via Remote-SSH",
            "Set the interpreter to workshop",
            "Open exercises/broken_script.py — fix the lints (some auto, some by hand)",
            "Run exercises/buggy_pipeline.py — observe wrong output",
            "Set a breakpoint; step through; find the off-by-one. No print statements.",
            "Commit the fix from inside the IDE.",
        ]);
    }

    pres.slides.forEach((s, i) => addFooter(s, "VS Code IDE · Day 2 Session 4", i + 1, pres.slides.length));
    await pres.writeFile({ fileName: path.join(__dirname, "..", "slides", "day2-04-vscode-ide.pptx") });
    console.log("✓ day2-04-vscode-ide.pptx");
}

// ---------------------------------------------------------------------------
// Slide 10 — AI Assistants
// ---------------------------------------------------------------------------
async function buildAIAssistants() {
    const pres = newDeck(); pres_global = pres;
    pres.title = "AI Coding Assistants";

    titleSlide(pres, { eyebrow: "DAY 2 · SESSION 5", title: "AI assistants", subtitle: "Where they help, where they hurt", deckLabel: "45 minutes · posture, not tool tutorial" });

    {
        const s = contentSlide(pres, { title: "Three categories", eyebrow: "MAP" });
        await iconRowGrid(pres, s, [
            { icon: FA.FaCheckCircle, title: "Reliable",   body: "Boilerplate. Plot scaffolding. Regex. Docstrings and tests. Code translation." },
            { icon: FA.FaQuestionCircle, title: "Unreliable", body: "Package APIs and parameter defaults. Tool-default thresholds. Out-of-date Bioconductor and scverse releases." },
            { icon: FA.FaExclamationTriangle, title: "Dangerous", body: "Method choice. Citations. Anything touching protected data." },
        ], { cols: 3, iconColor: PALETTE.forest });
    }

    {
        const s = contentSlide(pres, { title: "Where they help", eyebrow: "GREEN ZONE" });
        bullets(s, [
            "\"Read this CSV, drop NA in column X, write back.\" Boilerplate.",
            "\"Make a ggplot2 volcano plot from a DESeq2 results table.\" Scaffolding.",
            "\"Extract everything between the third underscore and the next period.\" Regex.",
            "\"Generate a docstring / unit test stub for this function.\" Drafts you edit.",
            "\"Rewrite this awk one-liner as Python.\" Translation — they're trained on this.",
        ]);
    }

    {
        const s = contentSlide(pres, { title: "Where they hurt", eyebrow: "RED ZONE" });
        bullets(s, [
            "Package APIs — confidently produces calls to functions that don't exist",
            "Parameter defaults — uses what was true two versions ago",
            "Statistical and methodological choices — will suggest a t-test where you need a mixed model",
            "Citations — invents DOIs, author lists, journal names with no flag of uncertainty",
            "Bioconductor / scverse — six-month release cycles outpace training data",
        ]);
    }

    {
        const s = contentSlide(pres, { title: "Data governance", eyebrow: "ASK BEFORE PASTING" });

        // Three-column card with the questions
        const cols = [
            { kicker: "1", title: "Is this protected data?",
              body: "Genotypes, patient identifiers, unpublished sequences, embargoed studies, IRB-protected. If yes — do not paste." },
            { kicker: "2", title: "What does my institution say?",
              body: "Most institutions have a policy on third-party AI services. Find it. If they don't — that's a separate conversation." },
            { kicker: "3", title: "Is the assistant on-prem or under contract?",
              body: "BAA, DPA, institutional agreement. Changes the answer to question 1." },
        ];
        for (let i = 0; i < cols.length; i++) {
            const c = cols[i];
            const cx = 0.6 + i * 4.20;
            s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.7, w: 4.0, h: 5.0, fill: { color: PALETTE.cream }, line: { color: PALETTE.rule }});
            s.addText(c.kicker, { x: cx + 0.3, y: 1.9, w: 0.7, h: 0.7, margin: 0, fontFace: FONT.head, fontSize: 36, color: PALETTE.forest, bold: true });
            s.addText(c.title, { x: cx + 0.3, y: 2.65, w: 3.5, h: 0.9, margin: 0, fontFace: FONT.head, fontSize: 16, color: PALETTE.text, bold: true });
            s.addText(c.body, { x: cx + 0.3, y: 3.65, w: 3.5, h: 2.9, margin: 0, fontFace: FONT.body, fontSize: 13, color: PALETTE.textMuted });
        }
    }

    {
        const s = contentSlide(pres, { title: "The verification posture", eyebrow: "FIVE QUESTIONS · 30 SECONDS EACH" });
        bullets(s, [
            "Did I read every line? Not skim — read.",
            "Does every function exist in the version of the package I have?",
            "Are the defaults sensible for my data — not the assistant's?",
            "Have I run it on a small case where I know the answer?",
            "Is the diff small enough to actually review?",
        ]);
    }

    {
        const s = dividerSlide(pres, { kicker: "THE WHOLE POSTURE IN ONE SENTENCE", title: "A fast, fluent collaborator\nwho has not read the documentation." });
    }

    pres.slides.forEach((s, i) => addFooter(s, "AI Assistants · Day 2 Session 5", i + 1, pres.slides.length));
    await pres.writeFile({ fileName: path.join(__dirname, "..", "slides", "day2-05-ai-assistants.pptx") });
    console.log("✓ day2-05-ai-assistants.pptx");
}

// ---------------------------------------------------------------------------
// Slide 11 — Wrap-up
// ---------------------------------------------------------------------------
async function buildWrapUp() {
    const pres = newDeck(); pres_global = pres;
    pres.title = "Putting It Together";

    titleSlide(pres, { eyebrow: "DAY 2 · SESSION 6", title: "Putting it together", subtitle: "The reproducibility ladder · next-step tracks · close", deckLabel: "45 minutes · the artifact is your repo on GitHub" });

    {
        const s = contentSlide(pres, { title: "The closing walk-through", eyebrow: "ONE MORE TIME" });
        fullCodeSlide(s,
`# In VS Code, on the HPC, in the workshop env:

# 1) pull a fresh annotation programmatically
bash scripts/01_fetch_reference.sh "$ACCESSION" data/raw/ref

# 2) summarize it with a small downstream script
python scripts/02_summarize_genes.py \\
    data/raw/ref/*/genomic.gff > results/gene_summary.tsv

# 3) inspect in the IDE
code results/gene_summary.tsv

# 4) commit (results are gitignored; scripts and versions.txt aren't)
git add scripts/02_summarize_genes.py versions.txt
git commit -m "Add gene summary; record annotation provenance"
git push`,
            "Reload GitHub. The README renders. The history shows the commits. The versions.txt is committed. THIS is the artifact."
        );
    }

    {
        const s = contentSlide(pres, { title: "The reproducibility ladder", eyebrow: "WHERE ARE YOU?" });
        const rungs = [
            { n: "1", title: "Environment captured",     body: "conda YAML; sessionInfo()" },
            { n: "2", title: "Code under version control", body: "Git history a stranger can read" },
            { n: "3", title: "Project structure self-documenting", body: "raw/ immutable; processed/ regenerable" },
            { n: "4", title: "Data provenance recorded", body: "every public query a committed script + versions.txt" },
            { n: "5", title: "Pipelines as code",        body: "Nextflow / Snakemake when the work repeats" },
            { n: "6", title: "Coding setup catches mistakes early", body: "interpreter, linters, debugger, diffable notebooks" },
        ];
        for (let i = 0; i < rungs.length; i++) {
            const r = rungs[i];
            const yy = 1.8 + i * 0.78;
            s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: yy, w: 12.1, h: 0.65, fill: { color: PALETTE.cream }, line: { color: PALETTE.rule }});
            s.addText(r.n, { x: 0.85, y: yy + 0.1, w: 0.55, h: 0.45, margin: 0, fontFace: FONT.head, fontSize: 22, color: PALETTE.forest, bold: true });
            s.addText(r.title, { x: 1.5, y: yy + 0.12, w: 5.5, h: 0.4, margin: 0, fontFace: FONT.head, fontSize: 14, color: PALETTE.text, bold: true });
            s.addText(r.body, { x: 7.1, y: yy + 0.15, w: 5.5, h: 0.4, margin: 0, fontFace: FONT.body, fontSize: 13, color: PALETTE.textMuted });
        }
    }

    {
        const s = contentSlide(pres, { title: "Next-step tracks", eyebrow: "WHERE TO GO" });
        await iconRowGrid(pres, s, [
            { icon: FA.FaChartLine,    title: "Bulk RNA-seq",    body: "salmon → tximeta → DESeq2. The most common follow-on workshop." },
            { icon: FA.FaCircleNotch,  title: "Single-cell",     body: "Scanpy or Seurat. Big, opinionated. OSCA + scanpy tutorials." },
            { icon: FA.FaExclamation,  title: "Variant calling", body: "nf-core/sarek (human) or nf-core/bacass / snippy (bacterial)." },
            { icon: FA.FaSitemap,      title: "Networks + integration", body: "Topic-specific. Talk to the core facility." },
            { icon: FA.FaCalculator,   title: "Statistics for genomics", body: "A real course. Modern Statistics for Modern Biology (free online)." },
            { icon: FA.FaPeopleArrows, title: "Core facility",    body: "Office hours, request form, email. Be specific about what you need." },
        ], { cols: 3 });
    }

    {
        const s = dividerSlide(pres, { kicker: "TWO DAYS AGO YOU DREW THE CHAIN", title: "Now point at every box where\nwhat you learned this week\nmade that step more defensible." });
    }

    {
        const s = contentSlide(pres, { title: "Thank you", eyebrow: "GO MAKE THINGS DEFENSIBLE" });
        s.addText([
            { text: "Anonymous feedback form is open now. Two minutes — fill it before you leave the room.", options: { breakLine: true, breakLine: true }},
            { text: "Helpers — thank you. Pair-mates — find each other on Slack.", options: { breakLine: true, breakLine: true }},
            { text: "Repository: ", options: { bold: true }},
            { text: "github.com/<workshop-org>/BIP-ND-2026", options: { fontFace: FONT.mono }},
        ], { x: 0.7, y: 2.0, w: 12, h: 4.5, margin: 0, fontFace: FONT.body, fontSize: 18, color: PALETTE.text, paraSpaceAfter: 8 });
    }

    pres.slides.forEach((s, i) => addFooter(s, "Wrap-up · Day 2 Session 6", i + 1, pres.slides.length));
    await pres.writeFile({ fileName: path.join(__dirname, "..", "slides", "day2-06-wrap-up.pptx") });
    console.log("✓ day2-06-wrap-up.pptx");
}

// ---------------------------------------------------------------------------
// Run all builds
// ---------------------------------------------------------------------------
(async () => {
    await buildWelcome();
    await buildShellBasics();
    await buildShellHPC();
    await buildEnvironments();
    await buildProjectGit();
    await buildDatabaseLandscape();
    await buildWebPortals();
    await buildProgrammaticAccess();
    await buildVscodeIde();
    await buildAIAssistants();
    await buildWrapUp();
    console.log("\nAll decks built.");
})().catch(err => { console.error(err); process.exit(1); });
