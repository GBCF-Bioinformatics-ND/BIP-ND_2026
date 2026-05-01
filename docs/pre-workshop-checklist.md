# Pre-Workshop Checklist (for instructors)

A two-page checklist to run through in the two weeks before delivery.

## Two weeks out

- [ ] Confirm room, HPC access for all learners, etherpad/HackMD, and Zoom (if hybrid).
- [ ] Confirm helper roster. Send helpers the lesson READMEs and the solutions files.
- [ ] Open the workshop GitHub organization and grant `member` access to every registered learner.
- [ ] Send the pre-workshop email containing `SETUP.md`, the schedule, and the code of conduct.
- [ ] Identify a workshop dataset for the HPC. The intended dataset is a small bacterial genome (a few Mb) plus 4–6 short-read samples (~500k reads each). Stage it.

## One week out

- [ ] Run every lesson README end-to-end on the HPC, in the conda environments shipped in `envs/`. Note any drift in tool versions or behavior.
- [ ] Test `Remote-SSH` from a clean VS Code install on a laptop that mirrors a learner's setup.
- [ ] Test the database APIs in `lessons/day2/03-programmatic-access/` from both a login node and a compute node. Document which works.
- [ ] Send a reminder email with the drop-in session time and the path to the workshop dataset on the HPC.
- [ ] Build the slide decks: `cd scripts && node build_slides.js`. Inspect them. Tweak the palette in `build_slides.js` if you have institutional branding.

## Day before

- [ ] **Run the drop-in setup session.** Two helpers minimum. Verify `setup-check.sh` passes for every learner who attends.
- [ ] Print or pin the etherpad/HackMD link, the Code of Conduct, and the schedule.
- [ ] Confirm projector resolution. Set your terminal font size to at least 16pt and your IDE font to at least 14pt.
- [ ] Sleep.

## Morning of Day 1

- [ ] Arrive 30 minutes early. Test the projector with your actual setup (terminal, IDE, slides).
- [ ] Open the etherpad on a side screen if available.
- [ ] Distribute sticky notes (or remind learners of the digital equivalent).
- [ ] Greet learners as they arrive.

## Morning of Day 2

- [ ] Read Day 1 retrospective stickies. Adjust Day 2 morning if a systematic issue surfaced.
- [ ] Verify the database APIs are reachable from your demo machine *this morning*. Endpoints occasionally go down.
- [ ] Have the workshop dataset and a "model project repo" pre-staged on GitHub for learners who fall behind to clone.

## After the workshop

- [ ] Anonymous feedback form sent within 24 hours.
- [ ] Push any lesson improvements you discovered during delivery back to the repo as a PR.
- [ ] Email helpers a thank-you. Ask them what they would change.
