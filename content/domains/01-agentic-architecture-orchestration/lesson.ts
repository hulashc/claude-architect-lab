import type { Lesson } from "@/lib/content/schema";
import { domain1Questions } from "@content/quizzes/domain-1";

/**
 * Domain 1 — Agentic Architecture & Orchestration (27% of the exam).
 * This lesson establishes the block template reused for Domains 2–5:
 * concept → terms → diagram → concept → diagram → code → concept(×2,
 * paired by mode) → scenario → concept → diagram → concept → exam trap →
 * mini lab.
 */
export const domain1Lesson: Lesson = {
  domainId: "agentic-architecture-orchestration",
  title: "Agentic Architecture & Orchestration",
  summary:
    "What actually makes something an agent, when a deterministic workflow beats one, when multiple agents genuinely help, and how to bound a loop before it ships.",
  practiceQuestionIds: domain1Questions.map((q) => q.id),
  blocks: [
    {
      type: "concept",
      title: "What is an agent, architecturally?",
      mode: "both",
      body: `An "agent" is not defined by using Claude, calling a tool, or even calling multiple tools — a single API call can do all three. What makes something agentic is **who controls the next step**.

In a deterministic workflow, the developer decides the sequence of steps ahead of time: step 2 always follows step 1, regardless of what step 1 returned. In an agent, **the model's own output decides what happens next** — whether to call another tool, ask a clarifying question, or stop and answer. The control flow is dynamic, discovered turn by turn, not fixed in advance.

That single distinction is what the rest of this domain builds on: when dynamic control flow is worth its cost, when it isn't, and how to keep it from running away from you.`,
    },
    {
      // Extracted mechanically from this lesson's own prose (see the
      // `terms` block type, architecture/adr/0002-content-model.md) —
      // reusing existing wording, not new explanations. "Agent loop" and
      // "Multi-agent architecture" assemble fragments from more than one
      // sentence rather than lifting a single one; flagged for review in
      // docs/roadmap.md's Known follow-ups.
      type: "terms",
      title: "Key terms for this domain",
      mode: "both",
      terms: [
        {
          term: "Agent",
          definition:
            "A system where the model's own output decides what happens next — the control flow is dynamic, discovered turn by turn, not fixed in advance.",
        },
        {
          term: "Deterministic workflow",
          definition:
            "The developer decides the sequence of steps ahead of time: step 2 always follows step 1, regardless of what step 1 returned.",
        },
        {
          term: "Agent loop",
          definition:
            "Claude reasons over the conversation and tool results, decides whether a tool call is needed, executes it, and appends the result — repeating until a final answer is produced, a turn/cost/time budget is exhausted, or an unrecoverable error occurs.",
        },
        {
          term: "Multi-agent architecture",
          definition:
            "Splitting work across multiple agents — justified when a task genuinely decomposes into subtasks that are independent of each other's output, or that benefit from a distinct tool scope or context per subtask.",
        },
        {
          term: "Subagent",
          definition:
            "A separate agent loop with its own bounded tools and context, invoked to handle one defined subtask and returning a distilled result — not its full internal transcript — to the parent.",
        },
        {
          term: "Human-in-the-loop (HITL)",
          definition:
            "Gating an irreversible, high-stakes, or low-confidence action behind a human decision before it takes effect — not reviewing everything, and not logging the outcome for a human to see afterward.",
        },
        {
          term: "Stopping conditions",
          definition:
            "What end an agent loop. A well-formed one is checkable and combines a real success signal (a final answer, a refund issued, an explicit \"I have enough to answer\") with a safety bound (a turn cap, a cost ceiling, a timeout) that catches everything the success signal doesn't.",
        },
      ],
    },
    {
      type: "diagram",
      title: "The agent loop",
      mode: "both",
      caption:
        "Every agent, regardless of framework, is some version of this loop. The interesting engineering is entirely in how step 2's decision is bounded — covered in the blocks below.",
      ascii: `        ┌────────────────────────────────────┐
   ┌───▶│  1. Claude reasons over the          │
   │    │     conversation + tool results       │
   │    └──────────────────┬───────────────────┘
   │                       ▼
   │            ┌────────────────────┐
   │            │ 2. Tool call needed? │
   │            └─────────┬──────────┘
   │                yes   │    no
   │            ┌─────────┴─────────┐
   │            ▼                   ▼
   │   ┌──────────────────┐  ┌───────────────────┐
   │   │ 3. Execute tool    │  │  Final answer      │
   │   │    call             │  │  — loop ends here   │
   │   └────────┬─────────┘  └───────────────────┘
   │            ▼
   │   ┌──────────────────────┐
   └───│ 4. Append tool result  │
       │    to the conversation │
       └──────────────────────┘

  Loop ends at step 2 when: a final answer is produced,
  OR a turn/cost/time budget is exhausted,
  OR an unrecoverable error occurs.`,
    },
    {
      type: "concept",
      title: "Agent vs. deterministic workflow",
      mode: "both",
      body: `If you can draw the flowchart of every step *before* you've seen any real input — "always do A, then B, then C" — you have a deterministic workflow, and you should probably build it as one. A workflow is cheaper, faster (no model call at each decision point), and trivially testable: same input, same steps, every time. You can still call Claude *inside* a workflow step, for something genuinely unstructured like extracting fields from a messy document — that doesn't make the whole system an agent.

An agent earns its cost when the steps genuinely can't be enumerated in advance — when what happens next depends on judgment about *this* input that a fixed rule table can't fully anticipate. The trade-off is real in both directions: you gain the ability to handle cases you didn't foresee, and you give up the predictability and easy testing a fixed workflow gets for free.

The exam trap here is treating "uses Claude" as the deciding factor. The deciding factor is whether the *control flow* is fixed or dynamic — a workflow that calls Claude once is still a workflow.`,
    },
    {
      type: "diagram",
      title: "A single agent with bounded tool access",
      mode: "both",
      caption:
        "One coherent task, one agent identity, tools scoped to exactly what the task needs — nothing more. This is the shape the scenario below is built around.",
      ascii: `        ┌─────────────────────┐
        │  Customer requests    │
        │  a refund              │
        └──────────┬───────────┘
                    ▼
        ┌─────────────────────┐
   ┌───▶│   Claude Agent         │
   │    │   (reason + act)       │
   │    └──────────┬───────────┘
   │                ▼
   │       ┌─────────────────┐
   │       │   Tool router      │
   │       └──┬─────────┬────┬─┘
   │           ▼         ▼    ▼
   │     ┌────────┐┌────────┐┌───────────┐
   │     │ Order   ││ Policy  ││ Refund     │
   │     │ lookup  ││ lookup  ││ submit API │
   │     └───┬────┘└───┬────┘└─────┬─────┘
   │          └──────────┴────────────┘
   │                     ▼
   │           ┌─────────────────┐
   └───────────│   Tool results    │
               └────────┬────────┘
                          ▼
                ┌─────────────────┐
                │ Stopping         │
                │ condition met?    │
                └───┬─────────┬───┘
               no    │         │  yes
                └─────┘         ▼
                       ┌──────────────────────────┐
                       │ Refund issued              │
                       │  OR marked ineligible       │
                       │  OR escalated to a human     │
                       └──────────────────────────┘`,
    },
    {
      type: "code",
      title: "The loop, in code",
      language: "typescript",
      mode: "both",
      caption:
        "Simplified for teaching — a production loop adds retries, per-tool timeouts, and logging (Domain 5 territory). The shape — call model, check stop_reason, execute tools, append results, repeat — is what matters here.",
      code: `import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();
const MAX_TURNS = 8;

async function runAgentLoop(userMessage: string) {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ];

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      tools, // lookup_order, lookup_policy, submit_refund, escalate_to_human
      messages,
    });

    messages.push({ role: "assistant", content: response.content });

    // Step 2: did the model ask for a final answer, or a tool?
    if (response.stop_reason !== "tool_use") {
      return response; // final answer — loop ends
    }

    // Step 3 + 4: execute every requested tool call, feed results back.
    const toolUses = response.content.filter((b) => b.type === "tool_use");
    const toolResults = await Promise.all(
      toolUses.map(async (block) => ({
        type: "tool_result" as const,
        tool_use_id: block.id,
        content: await executeTool(block.name, block.input),
      })),
    );

    messages.push({ role: "user", content: toolResults });
  }

  // Safety bound — see "Stopping conditions" below. Hitting this means the
  // real success/failure signal is missing, not that the cap is wrong.
  throw new Error("Agent loop exceeded MAX_TURNS without a final answer");
}`,
    },
    {
      type: "concept",
      title: "What the exam is actually testing here",
      mode: "certification",
      body: `The exam won't ask you to recite "an agent is an LLM that loops with tools." It gives you a requirements paragraph and four plausible architectures, and tests whether you can:

- Recognize whether the control flow is genuinely dynamic or fully specifiable in advance (agent vs. workflow).
- Notice when a tool list is too broad, or a task has been split into agents that don't need to be separate.
- Name a concrete, checkable stopping condition — not "it stops when it's done."
- Reject the multi-agent answer when a single bounded agent already covers the requirements, even though it *looks* more sophisticated.

The scenario below is built exactly in that shape — work through it before checking the answer.`,
    },
    {
      type: "concept",
      title: "Building this for real",
      mode: "architect",
      body: `In production, these decisions show up as concrete config, not diagrams: what tools does the agent's tool list actually contain, what's \`MAX_TURNS\` set to, is there a per-run log you can replay when a loop misbehaves, and what happens if the refund API times out mid-loop — retry with backoff and a cap, or escalate?

That last question is what Domain 5 (Context Management & Reliability) formalizes properly. For now, the practical takeaway is narrower: **bound every loop before you ship it, not after it misbehaves on a real customer.** A tool list with four scoped tools and an explicit stop condition is boring to build and is exactly why it's the right answer below.`,
    },
    {
      type: "scenario",
      title: "Scenario: refund eligibility",
      mode: "both",
      intro:
        "A company needs Claude to retrieve an order, determine refund eligibility under company policy, request a refund through an internal API, and escalate unusual cases to a human. Which architecture fits?",
      question: {
        id: "d1-lesson-scenario-refund",
        domainId: "agentic-architecture-orchestration",
        examConcept: "Agentic orchestration + bounded tool access",
        scenario:
          "Requirements: retrieve the order, determine eligibility under policy, request a refund via an internal API, and escalate unusual cases to a human.",
        prompt: "Which architecture should you choose?",
        options: [
          {
            id: "a",
            label:
              "A single Claude API call, no tools, given the policy document in the prompt and asked to output a refund decision as text.",
            correct: false,
            rationale:
              "No way to retrieve the actual order or call the refund API — this can only hallucinate a decision, since nothing here touches live systems.",
          },
          {
            id: "b",
            label:
              "A deterministic workflow with no model call: fixed steps that fetch the order, run it through a policy rule engine, and call the refund API.",
            correct: false,
            rationale:
              "Tempting — it's cheaper and fully predictable, and it does handle clear-cut cases well. But \"determine eligibility\" and \"escalate unusual cases\" are exactly the ambiguous judgment calls a fixed rule table can't fully enumerate in advance. Every new edge case means another code change, not a policy the system can reason about.",
          },
          {
            id: "c",
            label:
              "A single tool-using Claude agent with tools scoped to order lookup, policy lookup, refund submission, and human escalation, looping until it reaches a final decision or escalates.",
            correct: true,
            rationale:
              "This is one coherent task with one agent identity, tools bounded to exactly what's needed, and three clean stopping points: refund issued, deemed ineligible, or escalated. Nothing here needs a second agent or a rule table that can't handle the unusual cases the requirements explicitly call out.",
          },
          {
            id: "d",
            label:
              "A multi-agent architecture: separate agents for order retrieval, policy analysis, refund submission, and escalation, coordinated by a supervisor agent.",
            correct: false,
            rationale:
              "Over-engineered — this task is a single sequential decision made by one identity, not four independent subtasks. Splitting it into four agents adds coordination overhead, more handoff failure points, and latency, without a genuine decomposition to justify it.",
          },
        ],
        difficulty: "exam-style",
      },
    },
    {
      type: "concept",
      title: "Multi-agent architecture, briefly",
      mode: "both",
      body: `Multiple agents help when a task genuinely decomposes into subtasks that are **independent** of each other's output, or that benefit from a **distinct tool scope or context** per subtask — not because a task is important, hard, or "deserves" more sophistication.

The refund scenario above is a bad fit for multi-agent precisely because every step depends on the previous one's output — there's nothing to parallelize and no reason to isolate context between steps. A research assistant fanning out to investigate five unrelated companies is a good fit: the five investigations don't depend on each other, each benefits from its own clean context, and they can run concurrently before a synthesis step combines the results.

Delegation follows the same logic at a smaller grain: a subagent is a separate agent loop with its own bounded tools and context, invoked to handle one defined subtask and returning a **distilled result** — not its full internal transcript — to the parent.`,
    },
    {
      type: "diagram",
      title: "Multi-agent delegation with parallel subagents",
      mode: "both",
      caption:
        "Justified here because the three investigations are independent — none needs another's result to proceed.",
      ascii: `                 ┌───────────────────────┐
                 │   Supervisor agent       │
                 │   (splits + synthesizes) │
                 └────────────┬───────────┘
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
      ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
      │  Subagent A    │ │  Subagent B    │ │  Subagent C    │
      │  Company 1      │ │  Company 2      │ │  Company 3      │
      │  own tools,      │ │  own tools,      │ │  own tools,      │
      │  own context      │ │  own context      │ │  own context      │
      └───────┬──────┘ └───────┬──────┘ └───────┬──────┘
               └─────────────────┼─────────────────┘
                                  ▼
                       ┌───────────────────────┐
                       │   Supervisor synthesizes  │
                       │   results into one answer  │
                       └───────────────────────┘`,
    },
    {
      type: "concept",
      title: "Human-in-the-loop and stopping conditions",
      mode: "both",
      body: `In the refund scenario, "escalate unusual cases" is a HITL gate: the agent pauses and hands off before any money moves, not after.

A cap alone isn't a stopping condition for the *task* — it's a backstop for when something else already went wrong.`,
    },
    {
      type: "examTrap",
      title: "Exam trap: \"more agents = more capable\"",
      mode: "both",
      body: `The most common wrong answer on this domain isn't the single-shot API call — it's the multi-agent option that *looks* like the more sophisticated, more thorough choice. Multi-agent architectures add real coordination cost: more handoffs, more places for context to get lost or mangled, more latency, more to debug when something goes wrong. That cost only pays for itself when there's a genuine decomposition — independent subtasks, or a real need to isolate context or tool scope.

A second version of the same trap: assuming a task "needs" an agent because it's important or hard. The actual test is whether the control flow can be fully specified in advance. A hard task with fully enumerable steps is still a workflow — it's just a long one.`,
    },
    {
      type: "miniLab",
      title: "Mini lab: trace the loop",
      mode: "both",
      body: `Using the refund scenario above, work through the loop by hand before moving to Domain 2.`,
      steps: [
        "Write out the exact sequence of tool calls Claude would need to make, in order, for a claim that turns out to be eligible with no complications.",
        "Do the same for a claim that turns out to be ineligible, and for a claim that gets escalated. Note where each path actually diverges from the others.",
        "For each of the three endings, write the specific condition that ends the loop — not \"it stops when it's done.\"",
        "Pick one tool call (e.g. the refund submission) and write one realistic failure mode for it, plus how you'd bound it — retry with a cap, then escalate? Fail closed?",
      ],
    },
  ],
};
