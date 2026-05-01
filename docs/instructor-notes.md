# Instructor Notes

The workshop's spine is five themes — preparations, environments, workflow, data acquisition, reproducible research. Every session is labeled with the themes it serves. If you have to cut, cut content within a theme; do not cut a theme. The reproducibility wrap-up in particular tends to get cut "for time" and that is the wrong call: it is the highest-leverage content in the workshop.

## Before delivery

- Run **every** lesson `README.md` end-to-end, on the HPC the workshop will use, the week before delivery. Path issues, network egress restrictions, and module-vs-conda conflicts are local; they will not show up on your laptop.
- Hold a **30-minute drop-in setup session** the afternoon before Day 1. This single session saves the workshop. Skip it and you spend the first 90 minutes on Day 1 debugging WSL2 and SSH keys.
- Verify that `Remote-SSH` from VS Code works from a learner-style laptop to the HPC's login node. The failure modes here (SSH keys not loaded, two-factor prompt timing out, login-node MOTD breaking the handshake) are diverse and not learner-fixable in real time.
- Verify outbound network egress from compute nodes for the database APIs in Day 2 morning. If only login nodes have egress, structure the programmatic exercise to run on the login node, not in `srun`. If neither has egress, pre-stage the query results and have learners read rather than fetch.

## Pacing risks

- **Day 1 afternoon (Environments + Project/Git).** Conda lock contention on shared filesystems and an over-enthusiastic Git tangent are the two ways to overrun. Cap Git at the eight commands in the lesson README; the deeper material is its own workshop.
- **Day 2 morning (Databases).** Every database has interesting depth. Stick to the three-portal walk-through and the three programmatic interfaces; resist the urge to demo a fourth resource.
- **Day 2 afternoon (VS Code).** Remote-SSH connection setup is fragile to setup heterogeneity. Have helpers walk the room during this step, not later.

## What to drop if you are behind

| Behind by | Cut |
|-----------|-----|
| 15 min | The UCSC Table Browser walk-through (mention in one slide). |
| 30 min | The AI-assistants segment becomes a slide and a paragraph in the handout. |
| 45 min | The IGV mention in Day 2 wrap; reduce HPC etiquette to a 10-minute demo. |
| 60 min | One of the three programmatic-access lanes (drop the lane the audience is least likely to use). |

Do **not** drop:
- The mental-model diagram on Day 1 morning. It is what every later session refers back to.
- Remote-SSH and the debugger demo in the IDE session — those are the IDE session's payoff.
- The reproducibility ladder at the end of Day 2.

## Helper-to-learner ratio

Aim for **1:6** in a mixed-skill room. Below that, the slowest learner sets the pace. Above that, helpers get bored and stop circulating.

Helpers should circulate during exercises, not stand at the back. Brief them before the workshop on (a) the exercise solutions, (b) what *not* to type for learners (push them to read their own error messages first), and (c) which conceptual pitfalls each session will hit.

## The wet-lab faculty in the room

They will ask the most interesting questions and will also be the ones for whom the shell and IDE are most foreign. Pair them with a graduate-student helper, not with another faculty member. They learn faster when they can ask "stupid" questions to someone junior to them.

## Live-coding etiquette

- Use a large font (16pt+). Set this up before learners arrive, not in front of them.
- Use a terminal theme with high contrast. Solarized Light or the default macOS Terminal are fine; avoid neon-on-black if your projector's contrast is poor.
- **Type, do not paste.** Pasting a 12-line script onto the screen teaches nothing. Type it slowly, narrate the why-not-what.
- **Make mistakes deliberately.** Make a typo, hit `↑`, fix it. Show learners that errors are normal and recoverable.
- After every code block, ask a *check-for-understanding* question with a sticky-note (or Zoom reaction) vote. This is not optional; it is how you discover that half the room is lost.

## Sticky notes (or their digital equivalent)

Carpentries uses red/green sticky notes on laptops: green = I'm fine, red = I'm stuck. Use them. They beat hand-raising because they are persistent — you can scan the room and see at a glance who needs help. If on Zoom, reactions or a chat convention works. The instructor sets the convention at the start of Day 1 and reinforces it in the first exercise.

## Feedback

End each day with a sticky-note retrospective: one thing that clicked, one thing that didn't. Read them before bed. Adjust Day 2 morning if Day 1's retrospective surfaced a systematic issue.
