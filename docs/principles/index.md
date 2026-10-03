# Engineering principles

Read the relevant page when its trigger matches the work. These are local project
documents. They do not require a plugin, an installed skill, or an agent runtime.
Use the project's commands and architecture when applying them.

| When working on                            | Read                                                          |
| ------------------------------------------ | ------------------------------------------------------------- |
| State, transitions, or repeated branching  | [Model the domain](model-the-domain.md)                       |
| External input, adapters, or validation    | [Boundary discipline](boundary-discipline.md)                 |
| Signatures, variants, or unsafe assertions | [Type system discipline](type-system-discipline.md)           |
| Indirection or hidden mutable state        | [Minimize reader load](minimize-reader-load.md)               |
| Coverage or a brittle test                 | [Test behavior](test-behavior.md)                             |
| Completion claims or verification          | [Prove it works](prove-it-works.md)                           |
| A recurring defect or correction           | [Encode lessons in structure](encode-lessons-in-structure.md) |

Each page separates enforceable checks from engineering judgment. Apply the rule
to the actual failure risk. Do not add abstractions or dependencies solely to
satisfy an example.

The pages adapt pstack principles by Lauren Tan. [Provenance](UPSTREAM.md) records
the pinned source and changes. The upstream [MIT license](LICENSE) is retained.
