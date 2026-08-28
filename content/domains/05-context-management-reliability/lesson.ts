import type { Lesson } from "@/lib/content/schema";
import { domain5Questions } from "@content/quizzes/domain-5";

/**
 * Domain 5 — Context Management & Reliability (15% of the exam). Author-drafted
 * by Claude at the project owner's direction and pending a human review pass
 * before being treated as final — see content/README.md and CLAUDE.md's
 * content authorship rule. Follows the block template established by Domain 1
 * (content/domains/01-agentic-architecture-orchestration/lesson.ts): concept →
 * terms → diagram → concept → diagram → code → concept(×2, paired by mode) →
 * scenario → concept → diagram → concept → exam trap → mini lab.
 */
export const domain5Lesson: Lesson = {
  domainId: "context-management-reliability",
  title: "Context Management & Reliability",
  summary:
    "Why a finite context window degrades quality long before it hard-fails, the levers that keep a long-running agent inside its budget — curation, compaction, retrieval, caching — and the error handling, observability, and evaluation practices that let a production system degrade gracefully instead of failing silently.",
  practiceQuestionIds: domain5Questions.map((q) => q.id),
  blocks: [
    {
      type: "concept",
      title: "What is a context window, architecturally?",
      mode: "both",
      body: `Every call to Claude carries a finite input budget — the **context window** — measured in tokens. The system prompt, the tool/function definitions, the full conversation history sent so far, and anything you've retrieved or injected (documents, prior tool results) all draw from that *same shared budget*, not separate pools.

"Just put everything in context" is a reasonable default for a short conversation, but it breaks down as conversations run longer and tool results pile up: each new turn either eventually exceeds the window outright, or — well before that — leaves so little room for anything else that the model's attention is spread thin across a mountain of mostly-irrelevant history. A context window failure mode is rarely a hard crash at the token limit; it's usually **degraded answer quality** well before you get anywhere near it.

The rest of this domain is about the practices that keep a long-running agent inside its budget without losing what it actually needs: deciding what belongs in context in the first place, compacting what's grown stale, retrieving only what's relevant on demand, and reusing what hasn't changed.`,
    },
    {
      type: "terms",
      title: "Key terms for this domain",
      mode: "both",
      terms: [
        {
          term: "Context window",
          definition:
            "The finite number of tokens a model can process as input on a single call; the system prompt, tool definitions, conversation history, and any retrieved content all draw from this same shared budget.",
        },
        {
          term: "Context engineering",
          definition:
            "Deliberately deciding what enters the model's context at each turn — including only the history, tool results, and documents that are still relevant — instead of accumulating everything by default.",
        },
        {
          term: "Compaction",
          definition:
            "Condensing older conversation turns or verbose tool output into a shorter summary that preserves what is still needed, freeing context budget without discarding information the agent still relies on.",
        },
        {
          term: "Retrieval",
          definition:
            "Pulling in only the relevant slice of a larger corpus at the moment it is needed, for example via search or embeddings, instead of holding the entire corpus in context up front.",
        },
        {
          term: "Prompt caching",
          definition:
            "Reusing a previously processed prefix of context, such as a stable system prompt or tool definitions, so repeated or incrementally extended requests skip reprocessing that unchanged portion.",
        },
        {
          term: "Observability",
          definition:
            "Logging and tracing what an agent actually did on a given run, including tool calls, results, and why it stopped, so a failure can be diagnosed after the fact rather than merely noticed.",
        },
        {
          term: "Evaluations",
          definition:
            "A repeatable set of test cases with defined pass or fail criteria, run against an agent or prompt before shipping a change, to catch regressions that informal spot checks would miss.",
        },
      ],
    },
    {
      type: "diagram",
      title: "The context budget",
      mode: "both",
      caption:
        "Nothing here is free: a longer system prompt, a chattier tool, an unsummarized history, or an over-broad retrieval step all shrink the room left for everything else.",
      ascii: `        ┌───────────────────────────────────────────┐
        │        Finite context window (tokens)          │
        │                                                 │
        │  ┌───────────────┐ ┌─────────────────────┐    │
        │  │ System           │ │ Tool / function          │    │
        │  │ prompt              │ │ definitions                │    │
        │  └───────────────┘ └─────────────────────┘    │
        │  ┌───────────────────────────────────────┐    │
        │  │ Conversation history (all turns so far)    │    │
        │  └───────────────────────────────────────┘    │
        │  ┌───────────────────────────────────────┐    │
        │  │ Retrieved / injected context (docs,        │    │
        │  │ tool results, search hits)                  │    │
        │  └───────────────────────────────────────┘    │
        │                                                 │
        │      ← all four compete for the same budget →     │
        └───────────────────────────────────────────┘`,
    },
    {
      type: "concept",
      title: "Context engineering: curation, not accumulation",
      mode: "both",
      body: `**Context engineering** is the deliberate discipline of deciding, at each turn, what actually belongs in the model's context — which history, which tool results, which documents — instead of defaulting to "include everything, just in case." The default of accumulating everything feels safer, but it's exactly what fills the budget shown above with content that isn't earning its place.

In practice this means concrete choices: does the agent need the customer's full 50-order history, or just the current order? Does it need the raw 4,000-line build log, or the three failing test names? Does it need every prior turn verbatim, or a compacted summary of the ones no longer being actively worked on? None of these are one-time decisions made at design time — they're ongoing, made as the agent runs.

The instinct to reach for a bigger context window instead of doing this curation is the most common mistake in this domain — covered directly in the exam trap below.`,
    },
    {
      type: "diagram",
      title: "A compaction pipeline",
      mode: "both",
      caption:
        "Compaction reclaims budget from what's grown stale while keeping recent turns — and anything still binding — intact.",
      ascii: `  Turns 1–24 (verbose)                Turns 25–30 (recent)
 ┌─────────────────────┐            ┌───────────────────┐
 │ full tool calls,        │            │  kept verbatim —       │
 │ full tool results,       │            │  still relevant,          │
 │ full assistant replies    │            │  no compaction yet          │
 └──────────┬───────────┘            └─────────┬─────────┘
            ▼                                       │
   ┌───────────────────────┐                       │
   │  Summarizer step:            │                       │
   │  condense to what's still      │                       │
   │  needed — decisions,            │                       │
   │  constraints, open items         │                       │
   └───────────┬───────────┘                       │
               ▼                                       ▼
      ┌───────────────────────────────────────────┐
      │  Compacted context sent to the model:            │
      │  [short summary of turns 1–24] + [turns 25–30]     │
      └───────────────────────────────────────────┘`,
    },
    {
      type: "code",
      title: "Retry with backoff around a Claude API call",
      language: "typescript",
      mode: "both",
      caption:
        "Simplified for teaching. The shape that matters: distinguish retryable (transient) failures from ones that won't resolve on their own, back off between attempts, and always cap the number of attempts — an uncapped retry is Domain 5's version of an unbounded agent loop.",
      code: `import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();
const MAX_ATTEMPTS = 5;
const BASE_DELAY_MS = 500;

// Retryable: transient conditions where waiting and trying again is likely to
// help. Not retryable: e.g. a 400 (bad request) — the request itself is
// malformed, and retrying it unchanged will just fail the same way again.
const RETRYABLE_STATUS_CODES = new Set([408, 409, 429, 500, 502, 503, 529]);

async function callClaudeWithRetry(
  params: Anthropic.MessageCreateParams,
): Promise<Anthropic.Message> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      return await anthropic.messages.create(params);
    } catch (error) {
      lastError = error;

      const status = error instanceof Anthropic.APIError ? error.status : undefined;
      const isRetryable = status !== undefined && RETRYABLE_STATUS_CODES.has(status);

      if (!isRetryable || attempt === MAX_ATTEMPTS - 1) {
        throw error; // non-transient, or out of attempts — surface it, don't swallow it
      }

      // Exponential backoff with jitter: ~500ms, ~1s, ~2s, ~4s, capped attempts.
      const delay = BASE_DELAY_MS * 2 ** attempt + Math.random() * 250;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError; // unreachable given the loop above, but keeps TypeScript happy
}`,
    },
    {
      type: "concept",
      title: "What the exam is actually testing here",
      mode: "certification",
      body: `The exam won't ask you to recite a definition of "context window." It gives you a system that's degrading — slow, expensive, giving worse answers, or occasionally failing outright — and tests whether you can diagnose which lever actually fixes it:

- Is the problem that irrelevant content is being included by default (a context engineering problem), or that necessary content has grown too verbose over time (a compaction problem)?
- Is the system holding an entire corpus in context when it should be retrieving a relevant slice on demand?
- Is a transient failure (rate limit, timeout, malformed output) being handled with a capped, backed-off retry — or with silence, or an infinite loop?
- Is there enough logging to actually diagnose a failure after the fact, and an eval suite to catch a regression before it reaches production?

Each of these has a specific, correct lever. "Use a bigger model" or "add a bigger context window" is almost never that lever.`,
    },
    {
      type: "concept",
      title: "Building this for real",
      mode: "architect",
      body: `In production, these decisions become concrete config and code: a compaction job that runs when the conversation crosses some turn or token threshold, a retrieval step wired to a search index that gets re-queried every turn rather than loaded once, a retry wrapper around every external call with a real cap, and a logging pipeline that records tool calls, tool results, and stop reasons per run — not just the final answer.

None of this is exotic. It's the same instinct as Domain 1's stopping conditions, applied to the system's resource budget instead of its turn count: bound it, watch it, and have a defined fallback for when a bound is hit — a message to the user, a retry, an escalation — instead of a silent failure or an unbounded wait.`,
    },
    {
      type: "scenario",
      title: "Scenario: the research agent that outgrew its context",
      mode: "both",
      intro:
        "A long-running research agent investigates a single evolving topic across many sessions, picking up from where the last session left off. After a few weeks of continuous use, responses have gotten slower, more expensive, and noticeably less focused — the agent sometimes forgets constraints the user set early on, and occasionally reintroduces conclusions that were already discarded. The team needs one architectural fix. Which is best?",
      question: {
        id: "d5-lesson-scenario-context-budget",
        domainId: "context-management-reliability",
        examConcept: "Context budget management for a long-running agent",
        scenario:
          "A long-running research agent accumulates full conversation history, full tool results, and every retrieved document across weeks of continuous sessions, with no summarization or retrieval scoping in place. Responses have grown slower, costlier, and less focused, and the agent has started forgetting constraints set early in the engagement.",
        prompt: "What's the best architectural fix?",
        options: [
          {
            id: "a",
            label:
              "Switch to the largest available context window so all accumulated history and documents fit without truncation.",
            correct: false,
            rationale:
              "Tempting — it buys some room — but it doesn't address why the agent is forgetting constraints or losing focus: an even larger window still fills up eventually, and a bigger budget doesn't curate what's inside it. This delays the problem without fixing it.",
          },
          {
            id: "b",
            label:
              "Add periodic compaction that summarizes older turns while explicitly preserving standing constraints and decisions, combined with retrieval so documents are pulled in only when relevant to the current sub-task rather than accumulated permanently.",
            correct: true,
            rationale:
              "This directly targets both symptoms: compaction reclaims budget from stale history while deliberately keeping what's still binding (the forgotten constraints), and retrieval stops documents from accumulating indefinitely by pulling in only what the current question actually needs.",
          },
          {
            id: "c",
            label:
              "Truncate the conversation to only the most recent 5 turns before every call, discarding everything older.",
            correct: false,
            rationale:
              "Reclaims budget, but indiscriminately — it's exactly how a standing constraint set early in the engagement gets lost, since nothing distinguishes a still-relevant early constraint from genuinely stale content.",
          },
          {
            id: "d",
            label:
              "Split the single agent into a dedicated agent per document ingested, coordinated by a supervisor agent that merges their outputs.",
            correct: false,
            rationale:
              "Over-engineered — this multiplies the number of contexts and coordination points without solving the underlying issue, since each per-document agent still accumulates its own history without compaction or retrieval scoping.",
          },
        ],
        difficulty: "exam-style",
      },
    },
    {
      type: "concept",
      title: "Retrieval and caching: two different levers",
      mode: "both",
      body: `Retrieval and caching both sound like "make context cheaper," but they solve different problems. **Retrieval** decides *what* goes into context: instead of holding an entire corpus (a policy manual, a codebase, a knowledge base) in every call, a search or embedding step pulls in only the slice relevant to the current query, at the moment it's needed. This is what makes a corpus far larger than any context window usable at all.

**Caching**, by contrast, doesn't change what's in context — it changes the cost of reprocessing content that's already there and hasn't changed. Prompt caching lets you reuse a previously-processed prefix of context (a stable system prompt, a fixed set of tool definitions, an unchanging block of retrieved reference material) across calls, so a long-running or incrementally-extended conversation isn't paying full latency and cost to reprocess the same prefix every single turn.

It's an optimization on top of good context engineering, not a substitute for it — caching a bloated, poorly curated context still ships a bloated, poorly curated context, just faster.`,
    },
    {
      type: "diagram",
      title: "Retrieval at query time",
      mode: "both",
      caption:
        "The corpus never has to fit in context — only the slice a given query actually needs does, looked up fresh each time so it stays current.",
      ascii: `  ┌─────────────────────────┐
  │  Full corpus (too large      │
  │  to fit in any context        │
  │  window)                        │
  └────────────┬─────────────┘
               ▼
      ┌───────────────────┐
      │ Search / embedding      │
      │ index                    │
      └─────────┬─────────┘
                ▼   query-time lookup
      ┌───────────────────────┐
      │ Top-k relevant slice        │
      │ (only what this query        │
      │ actually needs)                │
      └───────────┬───────────┘
                  ▼
        ┌───────────────────────┐
        │ Inserted into context        │
        │ alongside history + system     │
        │ prompt, within budget            │
        └───────────────────────┘`,
    },
    {
      type: "concept",
      title: "Observability, evaluations, and graceful degradation",
      mode: "both",
      body: `Everything above reduces the odds of a context or reliability failure — it doesn't eliminate them. **Observability** is what makes a failure diagnosable after it happens: logging which tools were called, what they returned, why the loop stopped, and what was actually in context at the time, so a bad answer in production can be traced to a cause instead of shrugged off.

**Evaluations** are the complementary, proactive half: a fixed, repeatable set of test cases run against the agent or prompt before a change ships, catching a regression that a couple of informal spot checks would miss. Neither substitutes for the other — logging tells you what already happened; evals test what would happen before it does.

Together, these are what let a system degrade gracefully instead of failing silently: a retrieval outage produces an explicit "couldn't retrieve that" instead of a confidently ungrounded answer, a tool failure past its retry cap surfaces as a clear error instead of a hallucinated result, and a context budget crisis triggers compaction instead of a hard failure mid-conversation.`,
    },
    {
      type: "examTrap",
      title: "Exam trap: \"a bigger context window fixes it\"",
      mode: "both",
      body: `The most common wrong answer in this domain is reaching for a bigger context window — or a bigger model — as the fix for a system that's actually suffering from poor context engineering, missing compaction, or no retrieval strategy. A larger window raises the ceiling; it doesn't curate what's inside it, and a system that accumulates everything by default will eventually refill any window you give it, just more slowly.

The mirror-image trap shows up in error handling: treating "add retries" as always safe, without a cap. A retry loop with no maximum attempt count or timeout doesn't fix a persistent, non-transient failure — it just hangs indefinitely, burning cost and latency on a request that was never going to succeed. Retrying belongs with backoff *and* a bound, exactly like a turn cap belongs on an agent loop — the correct answer names both the retry and the limit, never one without the other.`,
    },
    {
      type: "miniLab",
      title: "Mini lab: design a context budget",
      mode: "both",
      body: `A customer-support agent handles conversations that can run 60+ turns: it looks up orders, checks policies, escalates edge cases, and occasionally needs to search a large internal knowledge base. It's expected to run continuously in production for months.`,
      steps: [
        "List everything that could occupy this agent's context at turn 50: system prompt, tool definitions, conversation history, retrieved knowledge-base content, tool results. For each, decide whether it should be included in full, summarized, retrieved on demand, or dropped.",
        "Design a compaction trigger: what specific signal (turn count? token count?) causes older turns to be summarized, and what must that summary explicitly preserve so the agent doesn't lose a standing constraint the customer stated early on?",
        "Design the retrieval step for the knowledge base: what triggers a lookup, and how do you keep it from re-including the same irrelevant slice on every turn?",
        "Pick one external call this agent makes (the policy API, the knowledge-base search) and write its retry policy: which failures are retryable, what's the backoff, and what's the cap — and what happens to the conversation when the cap is hit?",
        "Name one thing you'd log on every turn so that if this agent gives a wrong answer three weeks from now, you can reconstruct what happened.",
      ],
    },
  ],
};
