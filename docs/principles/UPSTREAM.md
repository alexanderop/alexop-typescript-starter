# Upstream provenance

These documents adapt selected pstack principles from
[cursor/plugins at commit 23e4138daa01c42d4969f7a5465f82704e64f798](https://github.com/cursor/plugins/tree/23e4138daa01c42d4969f7a5465f82704e64f798/pstack).
The upstream author and copyright holder is Lauren Tan. The upstream
[MIT license](https://github.com/cursor/plugins/blob/23e4138daa01c42d4969f7a5465f82704e64f798/pstack/LICENSE) is reproduced without changes in [LICENSE](LICENSE).
Retain the copyright and permission notice when copying these adaptations.

Each principle page links its exact upstream file at that commit. The local
[index](index.md) lists all seven adaptations. These pages are project documents,
not installed pstack skills, and do not imply upstream endorsement.

## Adaptation choices

The pages use generic TypeScript examples for Node programs, frontend code, CLIs,
and libraries. They omit plugin routing, agent APIs, delegation, and permission
policies. Project instructions remain the source for workflow and commands.

The adaptations preserve runtime invariants after parsing, use brands when they
prevent plausible mistakes, and allow narrowly justified type assertions. They
recognize absence as a valid observable result and keep useful adapters even when
only one implementation exists. Test guidance selects the real failure boundary.
Repeated rules become checks when the condition is precise enough to enforce.

The prose follows the upstream
[technical-writing guide](https://github.com/cursor/plugins/blob/23e4138daa01c42d4969f7a5465f82704e64f798/pstack/skills/technical-writing/SKILL.md)
and [unslop guide](https://github.com/cursor/plugins/blob/23e4138daa01c42d4969f7a5465f82704e64f798/pstack/skills/unslop/SKILL.md).
