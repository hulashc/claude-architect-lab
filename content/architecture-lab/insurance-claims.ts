import type { ArchitectureDecisionScenario } from "@/lib/content/schema";

/**
 * The flagship "Architecture Decision Lab" scenario — the site's
 * differentiator feature. Give a requirements list, ask which architecture
 * fits, then show a real diagram + trade-off writeup for whichever option
 * the learner picks (not just a correct/incorrect flag).
 */
export const insuranceClaimsScenario: ArchitectureDecisionScenario = {
  slug: "insurance-claims-assistant",
  title: "Build an insurance claims assistant",
  domainId: "agentic-architecture-orchestration",
  requirements: [
    "Read the customer's policy",
    "Analyze an uploaded claim",
    "Query internal systems",
    "Request missing information from the customer",
    "Escalate high-value claims to a human",
    "Produce structured JSON output",
    "Maintain an audit trail",
  ],
  prompt: "Which architecture would you use?",
  options: [
    {
      id: "single-call",
      label: "A single Claude API call",
      verdict: "tempting-but-wrong",
      diagram: `┌──────────┐      ┌───────────────────────────┐      ┌──────────┐
│  Claim +  │─────▶│  One Claude API call        │─────▶│  JSON      │
│  policy    │      │  (everything in the prompt)  │      │  output    │
│  in prompt │      └───────────────────────────┘      └──────────┘

  No tools. No systems queried. No follow-up turn if
  information is missing. Nothing logged along the way.`,
      explanation: `This looks appealing because it's the cheapest and simplest option to build, and Claude genuinely can analyze an uploaded claim and produce structured JSON in one call — those two requirements alone don't need an agent.

It breaks on the rest of the list. "Query internal systems" needs a tool call to something live, not text pasted into a prompt. "Request missing information" needs a turn where the assistant can pause, ask, and continue — a single call can't do that by definition. And "maintain an audit trail" needs something to actually log across steps that don't exist yet in this design.

This is the option to reach for only if you strip the requirements down to "analyze this claim and format the output" — the moment you add live systems and back-and-forth, it stops being enough.`,
    },
    {
      id: "deterministic-workflow",
      label: "A deterministic workflow",
      verdict: "tempting-but-wrong",
      diagram: `┌────────┐   ┌────────────┐   ┌───────────────┐   ┌──────────────┐
│ Fetch    │──▶│ Rule engine: │──▶│ Query internal  │──▶│ Fixed decision │
│ policy    │   │ eligibility   │   │ systems          │   │ + JSON output   │
└────────┘   │ rules         │   └───────────────┘   └──────────────┘
             └────────────┘
   Every step is hard-coded. No model call decides
   what happens next — the developer already did.`,
      explanation: `Genuinely strong on some requirements: reading the policy, querying internal systems, producing structured JSON, and logging an audit trail are all things a fixed pipeline does well and predictably — no model nondeterminism, easy to test.

Where it breaks: "analyze an uploaded claim" and "escalate high-value claims" both involve judgment that a rule table struggles to fully enumerate — a claim document isn't a fixed schema, and "unusual enough to escalate" isn't just a dollar threshold (that part is deterministic, but genuinely ambiguous cases will exist). "Request missing information" is the harder problem for this design: a fixed workflow can ask for a fixed list of fields, but recognizing *which* information is actually missing for *this* claim, and phrasing a sensible follow-up, is exactly the kind of case-by-case judgment call a rule table wasn't built for.

This is the architecture that looks safest and cheapest right up until a claim doesn't fit the cases you anticipated — and insurance claims, by nature, generate a long tail of those.`,
    },
    {
      id: "single-agent",
      label: "A single tool-using agent",
      verdict: "best",
      diagram: `                     ┌───────────────────┐
                     │  Uploaded claim +    │
                     │  policy                │
                     └─────────┬─────────┘
                               ▼
                     ┌───────────────────┐
                ┌───▶│  Claude Agent        │
                │    │  (reason + act)      │
                │    └─────────┬─────────┘
                │               ▼
                │      ┌───────────────────┐
                │      │  Tool router          │
                │      └─┬────┬────┬────┬───┘
                │         ▼    ▼    ▼    ▼
                │  ┌────────┐┌────────┐┌────────────┐┌───────────┐
                │  │ Policy   ││ Internal ││ Request more││ Escalate    │
                │  │ reader   ││ systems  ││ info from    ││ to human    │
                │  │           ││ query    ││ customer      ││ (high value)│
                │  └───┬────┘└───┬────┘└─────┬──────┘└─────┬─────┘
                │       └──────────┴────────────┴─────────────┘
                │                          ▼
                │               ┌───────────────────┐
                └───────────────│  Tool results         │
                                └─────────┬─────────┘
                                          ▼
                                ┌───────────────────┐
                                │  Stop condition met?  │
                                └──┬─────────────┬──┘
                               no   │             │  yes
                                └───┘             ▼
                                      ┌─────────────────────────┐
                                      │  Structured JSON output    │
                                      │  (decision, or escalation,  │
                                      │   or a request for info)     │
                                      └─────────────────────────┘

  Every tool call is logged — that log is the audit trail.`,
      explanation: `This fits every requirement without over-building any of them. One coherent task — assess a single claim — handled by one agent identity, with tools scoped to exactly what's needed: read the policy, analyze the claim (the model's native strength), query internal systems, ask the customer a follow-up, escalate. The loop's stopping condition is exactly the three outcomes the requirements describe: a decision, an escalation, or a request for more information.

The two requirements that look like they need separate infrastructure don't: "produce structured JSON" is a constraint on the final output (validated against a schema, covered in Domain 4), not a reason for a different architecture. "Maintain an audit trail" falls out of logging every tool call and every turn this one agent already makes — it's a cross-cutting concern, not evidence you need a dedicated "audit agent."

The judgment call worth noticing: this looks almost too simple for a task with seven requirements. That's the point — the requirements decompose into tool calls for one agent, not into separate systems.`,
    },
    {
      id: "multi-agent",
      label: "A multi-agent architecture",
      verdict: "over-engineered",
      diagram: `           ┌───────────────────────┐
           │   Supervisor agent        │
           └────────────┬───────────┘
      ┌───────────┬───────┼───────┬───────────┐
      ▼           ▼        ▼        ▼           ▼
┌──────────┐┌──────────┐┌──────────┐┌──────────┐┌──────────┐
│ Policy    ││ Claim      ││ Systems    ││ Escalation ││ JSON        │
│ agent      ││ analysis    ││ query       ││ agent        ││ formatting   │
│            ││ agent        ││ agent        ││              ││ agent         │
└────┬────┘└────┬────┘└────┬────┘└────┬────┘└────┬────┘
      └─────────────┴────────────┴────────────┴────────────┘
                                  ▼
                       ┌───────────────────┐
                       │  Supervisor merges     │
                       │  five handoffs           │
                       └───────────────────┘`,
      explanation: `The appeal is obvious: one agent per requirement feels thorough, and it's easy to map five agents onto five bullet points. But assessing a single claim is a sequential, dependent process — you need the policy read before you can judge eligibility, the claim analyzed before you know what to query, the query results before you know whether to escalate. None of these are the independent, parallelizable subtasks that justify splitting into separate agents (compare to the research-fan-out case in the Domain 1 lesson, where five investigations genuinely don't depend on each other).

What this design actually adds: five more handoffs where context can be lost or mangled, five more places to debug when a claim gets stuck, and more latency per claim — all for a task a single bounded agent already covers completely. This is the answer the exam wants you to recognize as "looks more sophisticated, isn't."`,
    },
    {
      id: "mcp-based",
      label: "An MCP-based architecture",
      verdict: "workable",
      diagram: `                     ┌───────────────────┐
                     │  Claude Agent        │
                     │  (single agent, as     │
                     │   in the option above)  │
                     └─────────┬─────────┘
                               ▼
                     ┌───────────────────┐
                     │  MCP client            │
                     └─┬────────┬────────┬─┘
                        ▼         ▼         ▼
               ┌──────────┐┌──────────┐┌──────────────┐
               │ Policy MCP ││ Claims DB  ││ Escalation    │
               │ server      ││ MCP server  ││ MCP server     │
               └──────────┘└──────────┘└──────────────┘

  Same agent shape as "single tool-using agent" — the
  difference is *how* the tools are implemented and shared.`,
      explanation: `This is a legitimate exam trap, but for a different reason than the others: MCP isn't a competing answer to "how many agents, what orchestration" — it's an integration-layer decision about *how* an agent's tools are implemented and shared, orthogonal to the single- vs. multi-agent choice. Treating "single agent" and "MCP-based" as mutually exclusive options is a category error; in practice you'd likely end up with the single-agent architecture from above, with some or all of its tools implemented as MCP servers instead of bespoke SDK tool definitions.

It's marked "workable" rather than wrong because it's a defensible answer if the internal systems in question are already exposed as MCP servers, or need to be shared across multiple applications beyond this one assistant — that's a real reason to reach for MCP. But if the question is specifically "single agent or multiple, and what orchestration," this option doesn't actually answer it. Domain 2 (Tool Design & MCP Integration) covers when MCP earns its integration cost versus a direct tool definition.`,
    },
  ],
};
