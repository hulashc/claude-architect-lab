import type { QuizQuestion } from "@/lib/content/schema";

/**
 * Domain 5 — Context Management & Reliability. 20 original practice
 * questions, author-drafted by Claude at the project owner's direction and
 * pending a human review pass before being treated as final — see
 * content/README.md and CLAUDE.md's content authorship rule. None of these
 * are copied or derived from the real exam.
 */
export const domain5Questions: QuizQuestion[] = [
  {
    id: "d5-q01",
    domainId: "context-management-reliability",
    examConcept: "A finite context window degrades quality before it hard-fails",
    scenario:
      "A long-running coding assistant appends every tool result verbatim to the conversation — full file listings, full build logs — across a session that has now run 40 turns.",
    prompt: "What's the primary architectural concern here?",
    options: [
      { id: "a", label: "None — modern context windows are large enough that this is fine indefinitely.", correct: false, rationale: "A common misconception — even large windows are finite, and quality tends to degrade as irrelevant content crowds out what's still relevant, well before any hard limit is hit." },
      { id: "b", label: "The context window is a finite budget shared by the system prompt, tool definitions, and history; accumulating verbose content crowds out room for what's still relevant and degrades attention on it, regardless of window size.", correct: true, rationale: "This names the actual mechanism — a shared, finite budget that gets consumed by content that isn't earning its place, not just an eventual hard overflow." },
      { id: "c", label: "The only concern is token cost — the architecture itself is otherwise unaffected.", correct: false, rationale: "Cost is real, but it's not the deeper issue — unfiltered accumulation also degrades answer quality and focus, which is an architectural problem, not just a billing one." },
      { id: "d", label: "Switching to a model with an even larger context window fully resolves this on its own.", correct: false, rationale: "A larger window raises the ceiling but doesn't curate what's inside it — a system that accumulates everything by default will eventually refill any window, just more slowly." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d5-q02",
    domainId: "context-management-reliability",
    examConcept: "What actually shares the context budget",
    scenario:
      "An architect is asked to explain what actually competes for space inside a single API call's context window.",
    prompt: "Which of these share the same finite context budget?",
    options: [
      { id: "a", label: "The system prompt, tool/function definitions, the full conversation history sent so far, and any retrieved documents inserted into the prompt.", correct: true, rationale: "All of these are part of the same input sent to the model on a given call — none of them lives in a separate, unlimited pool." },
      { id: "b", label: "Only the user's most recent message — everything else is stored separately at no token cost.", correct: false, rationale: "Incorrect — every prior turn resent as history, plus the system prompt and tool schemas, all consume the same budget as the latest message." },
      { id: "c", label: "Only tool results — system prompts and conversation history don't count toward the limit.", correct: false, rationale: "Incorrect — system prompts and history are also part of the input token count on every call." },
      { id: "d", label: "Only whatever is explicitly labeled \"context\" in the request payload, not tool schemas.", correct: false, rationale: "Tool schemas are serialized into the request and consume input tokens just like any other content." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d5-q03",
    domainId: "context-management-reliability",
    examConcept: "Context engineering means curating, not always including",
    scenario:
      "A customer-support agent's context balloons because it appends a customer's entire 50-order history to every message, even though only the current order is relevant to the question being asked.",
    prompt: "What's the best fix?",
    options: [
      { id: "a", label: "Include only the current order (and perhaps one or two clearly relevant past orders) on demand, instead of always including the full 50-order history.", correct: true, rationale: "This is context engineering in practice: deliberately curating what's included based on relevance to the current turn, rather than defaulting to everything." },
      { id: "b", label: "Truncate the conversation history instead, since that's usually the larger contributor to context size.", correct: false, rationale: "Misdiagnoses the actual bloat here — the described problem is the order history being included wholesale, not the conversation history." },
      { id: "c", label: "Switch to a model with a large enough context window that all 50 orders fit comfortably every time.", correct: false, rationale: "Papers over the real issue instead of fixing it — irrelevant order data still competes for attention even if it technically fits." },
      { id: "d", label: "Compress every one of the 50 orders into a one-word summary regardless of relevance to the current question.", correct: false, rationale: "Over-engineered and still includes irrelevant orders — the right fix is scoping to what's relevant, not uniformly compressing everything." },
    ],
    difficulty: "applied",
  },
  {
    id: "d5-q04",
    domainId: "context-management-reliability",
    examConcept: "Context engineering as an ongoing discipline, not a wording exercise",
    scenario: "A team debates whether \"context engineering\" is just a rebrand of writing better prompts.",
    prompt: "Which best describes context engineering as an architectural discipline?",
    options: [
      { id: "a", label: "Deliberately deciding what goes into the model's context at each turn — which history, tool results, and documents are actually relevant — rather than accumulating everything by default.", correct: true, rationale: "This is the actual scope of context engineering: an ongoing curation decision about what belongs in context, not just how it's phrased." },
      { id: "b", label: "It refers only to prompt wording and tone, not to what data is included.", correct: false, rationale: "Too narrow — context engineering is specifically about what's included, not how it reads." },
      { id: "c", label: "It's synonymous with choosing the largest available context window.", correct: false, rationale: "Confuses budget size with curation — a bigger window doesn't decide what belongs in it." },
      { id: "d", label: "It's a one-time setup step performed before launch, not something maintained while the agent runs.", correct: false, rationale: "Context engineering is ongoing — what's relevant changes turn by turn as a conversation or task evolves." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d5-q05",
    domainId: "context-management-reliability",
    examConcept: "Compaction should summarize, not just delete",
    scenario:
      "A long research agent's conversation has grown to 30 turns of intermediate tool calls and results. The team wants to reclaim context budget without losing information the agent still needs.",
    prompt: "What's the appropriate compaction strategy?",
    options: [
      { id: "a", label: "Periodically summarize older turns into a condensed representation that preserves decisions and facts still needed, replacing the verbose originals while keeping recent turns intact.", correct: true, rationale: "This is compaction done correctly — it reclaims space while deliberately preserving what's still relevant, rather than discarding indiscriminately." },
      { id: "b", label: "Delete the oldest turns outright with no summary, since they're old.", correct: false, rationale: "Reclaims space but risks silently dropping a still-relevant decision or constraint that happened to occur early on." },
      { id: "c", label: "Keep every turn stored, but simply stop sending new tool results to the model going forward.", correct: false, rationale: "Doesn't reclaim any existing budget and starves the agent of the new information it needs to keep working." },
      { id: "d", label: "Have a second agent redo the entire research task from scratch whenever context gets long.", correct: false, rationale: "Over-engineered — this discards all prior progress instead of condensing it, which is far more wasteful than summarizing." },
    ],
    difficulty: "applied",
  },
  {
    id: "d5-q06",
    domainId: "context-management-reliability",
    examConcept: "Compaction must explicitly preserve standing constraints",
    scenario:
      "A team's compaction step summarizes an agent's older turns but drops a constraint the user stated 20 turns earlier (\"never contact Vendor X\"). Five turns after compaction runs, the agent contacts Vendor X.",
    prompt: "What does this failure reveal about the compaction design?",
    options: [
      { id: "a", label: "The summarization step must be designed to explicitly preserve standing constraints and decisions, not just produce a generic gist — losing a still-binding constraint is a compaction bug, not an unavoidable trade-off.", correct: true, rationale: "This correctly locates the fix: compaction needs to be designed to retain binding constraints specifically, not just summarize generally and hope nothing important is lost." },
      { id: "b", label: "The context window was simply too small for this to have been avoided, regardless of compaction design.", correct: false, rationale: "Deflects to window size, but the actual cause is a summarization step that didn't preserve a specific, still-relevant constraint." },
      { id: "c", label: "Compaction should never be used, since it can drop information.", correct: false, rationale: "Overcorrects — compaction is necessary for long-running agents; the fix is designing it to preserve constraints, not abandoning it." },
      { id: "d", label: "The agent should re-ask the user to restate every constraint at every single turn instead of ever using compaction.", correct: false, rationale: "Impractical and defeats the purpose of an agent retaining context — the fix belongs in the compaction step, not in constant re-confirmation." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d5-q07",
    domainId: "context-management-reliability",
    examConcept: "Compaction and retrieval solve different problems",
    scenario: "A team treats summarization/compaction and retrieval as interchangeable fixes for a full context window.",
    prompt: "What's the actual distinction between the two?",
    options: [
      { id: "a", label: "Compaction condenses content that's already in context to reclaim space; retrieval pulls in a relevant slice of content from a larger corpus that wasn't in context yet — they solve different problems and are often used together.", correct: true, rationale: "This correctly separates the two: one shrinks what's already present, the other selectively adds what's still outside." },
      { id: "b", label: "They're identical operations, just described with different names.", correct: false, rationale: "Incorrect — compaction operates on existing context; retrieval brings in content that wasn't in context at all." },
      { id: "c", label: "Retrieval always replaces the need for compaction, and vice versa — a system only ever needs one.", correct: false, rationale: "Many systems need both: retrieval to selectively include corpus content, and compaction to keep the resulting conversation from growing unbounded over time." },
      { id: "d", label: "Compaction adds new information to context; retrieval removes information from context.", correct: false, rationale: "This reverses what each actually does — compaction condenses/removes, retrieval selectively adds." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d5-q08",
    domainId: "context-management-reliability",
    examConcept: "Retrieval makes an oversized corpus usable",
    scenario:
      "A support assistant needs to answer questions against a 5,000-page policy manual, far larger than any single context window.",
    prompt: "What's the right approach?",
    options: [
      { id: "a", label: "Retrieve only the passages relevant to the current question, for example via search or embeddings, and include just that slice in context rather than holding the whole manual in every call.", correct: true, rationale: "This is exactly what retrieval is for — making a corpus far larger than any context window usable by including only what's relevant to the query at hand." },
      { id: "b", label: "Paste the entire manual into the system prompt once, since system prompts are cached and effectively free after the first call.", correct: false, rationale: "Misunderstands caching — caching reduces reprocessing cost for a stable prefix, it doesn't shrink token count, and a 5,000-page manual likely exceeds the window outright." },
      { id: "c", label: "Have the model memorize the manual through a training step and answer purely from memory, with no runtime retrieval at all.", correct: false, rationale: "Outside the scope of a context-management architecture decision, and doesn't address how to keep answers grounded in the manual's actual, current text." },
      { id: "d", label: "Split the manual across five separate agents, one per 1,000 pages, running in parallel for every incoming question.", correct: false, rationale: "Over-engineered — this adds coordination overhead to every single question instead of simply retrieving the relevant slice on demand." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d5-q09",
    domainId: "context-management-reliability",
    examConcept: "Retrieval still needs to be scoped to relevance",
    scenario:
      "A retrieval-augmented agent returns the top 20 search results for every query and inserts all of them into context, regardless of how narrow the question is.",
    prompt: "What's the issue with this design?",
    options: [
      { id: "a", label: "Retrieval should return only what's actually relevant to the specific query — indiscriminately including many results reintroduces the same context-bloat problem retrieval was meant to solve.", correct: true, rationale: "Retrieval isn't a free pass to include more — the same curation discipline applies to what a retrieval step returns as to any other context source." },
      { id: "b", label: "There's no issue — more retrieved context always improves answer quality.", correct: false, rationale: "Incorrect — irrelevant retrieved content crowds out attention on what actually matters, the same way any other unfiltered accumulation does." },
      { id: "c", label: "The only issue is that search is slow, not that too much content is being included.", correct: false, rationale: "Misidentifies the problem described — the scenario is about volume and relevance of results included, not search latency." },
      { id: "d", label: "The fix is to stop using retrieval entirely and go back to including the full corpus.", correct: false, rationale: "Overcorrects — the fix is scoping retrieval results to relevance, not abandoning retrieval altogether." },
    ],
    difficulty: "applied",
  },
  {
    id: "d5-q10",
    domainId: "context-management-reliability",
    examConcept: "Retrieval architecture for a corpus that changes over time",
    scenario:
      "An architect is designing a Q&A agent over product documentation that changes weekly and is far too large for any single context window.",
    prompt: "Which design best fits these requirements?",
    options: [
      { id: "a", label: "A retrieval step (search or embeddings) that fetches the currently relevant subset of the docs at query time, with the index re-built or refreshed as the docs change.", correct: true, rationale: "This handles both constraints at once: the corpus is too large to hold entirely, and it changes weekly, so lookups need to happen at query time against a kept-current index." },
      { id: "b", label: "Load the entire corpus into context once at agent startup and keep reusing that same context for the life of the session, regardless of the question asked.", correct: false, rationale: "Likely exceeds the context window outright, and would serve stale documentation once the weekly changes land." },
      { id: "c", label: "A single long training run so the model has \"read\" the docs, with no runtime retrieval step at all.", correct: false, rationale: "Doesn't fit a corpus that changes weekly — a static training snapshot goes stale immediately and isn't the kind of lever this domain is testing." },
      { id: "d", label: "A multi-agent system with one dedicated agent memorizing each doc page, coordinated by a supervisor agent.", correct: false, rationale: "Over-engineered — this adds heavy coordination overhead in place of a straightforward, on-demand retrieval step." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d5-q11",
    domainId: "context-management-reliability",
    examConcept: "Prompt caching reuses an unchanged prefix",
    scenario:
      "An agent sends the same lengthy system prompt and tool definitions on every call in a long-running session, paying full processing cost for that same prefix each time.",
    prompt: "What's the relevant optimization here?",
    options: [
      { id: "a", label: "Prompt caching — reusing a previously-processed prefix of context so repeated or incrementally-extended prompts don't pay full latency and cost to reprocess the unchanged part.", correct: true, rationale: "This is precisely what prompt caching targets: a stable prefix (system prompt, tool definitions) that doesn't need to be reprocessed from scratch on every call." },
      { id: "b", label: "Summarizing the system prompt down to a shorter version on every call.", correct: false, rationale: "Solves a different problem (size), and re-summarizing every call adds its own cost and risks changing the prompt's meaning run to run." },
      { id: "c", label: "Retrieval, so that only part of the system prompt is included on each call.", correct: false, rationale: "Retrieval addresses what content is included, not the cost of reprocessing content that's already being included and hasn't changed." },
      { id: "d", label: "Switching providers so the system prompt never needs to be sent at all.", correct: false, rationale: "Not a realistic or relevant fix — the system prompt still needs to reach the model somehow; the actual lever is caching its reprocessing cost." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d5-q12",
    domainId: "context-management-reliability",
    examConcept: "Cache invalidation depends on prefix stability",
    scenario:
      "A team enables prompt caching for an agent's system prompt and tool definitions, but inserts a current timestamp at the very beginning of the system prompt on every call.",
    prompt: "What's wrong with this setup?",
    options: [
      { id: "a", label: "Changing content at the start of the cached prefix invalidates the cache for everything after it — per-call-varying content like a timestamp should be placed after the stable, reusable portion, not before it.", correct: true, rationale: "This identifies the actual mechanism — caching works on a matching prefix, so anything that varies needs to sit after the stable part, not disrupt it from the start." },
      { id: "b", label: "Nothing is wrong — prompt caching works regardless of where content changes within the cached prefix.", correct: false, rationale: "Incorrect — a change anywhere in the prefix, especially near the start, breaks the match and invalidates the cache for the content that follows it." },
      { id: "c", label: "Prompt caching only applies to tool definitions, not system prompts, so this setup is irrelevant either way.", correct: false, rationale: "Inaccurate — system prompts are commonly part of what gets cached; the actual issue is where the dynamic content is placed." },
      { id: "d", label: "The fix is to remove the timestamp entirely, since caching can never coexist with any dynamic content.", correct: false, rationale: "Overcorrects — the real fix is reordering so dynamic content comes after the stable, cacheable prefix, not eliminating dynamic content altogether." },
    ],
    difficulty: "applied",
  },
  {
    id: "d5-q13",
    domainId: "context-management-reliability",
    examConcept: "Transient failures call for retry with backoff, not immediate failure or silence",
    scenario: "An agent's tool call to a downstream API occasionally fails with a rate-limit (429) response.",
    prompt: "What's the appropriate response to this specific failure?",
    options: [
      { id: "a", label: "Retry with exponential backoff, since a rate limit is a transient condition likely to succeed shortly after a delay — not a sign the request itself is invalid.", correct: true, rationale: "This matches the failure to the right response: a 429 is exactly the kind of transient condition that backoff-and-retry is designed to handle." },
      { id: "b", label: "Immediately fail the whole agent run with no retry, since any tool error should stop the loop.", correct: false, rationale: "Overreacts to a transient, likely-recoverable condition by treating it the same as a hard, non-recoverable failure." },
      { id: "c", label: "Retry immediately in a tight loop with no delay, as many times as it takes.", correct: false, rationale: "Skips backoff entirely — hammering a rate-limited endpoint with no delay is likely to keep getting rate-limited and burns resources fast." },
      { id: "d", label: "Silently return an empty result to the model as if the tool call had succeeded.", correct: false, rationale: "Masks the failure instead of handling it — the model then reasons from data that looks valid but isn't, which is worse than surfacing the error." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d5-q14",
    domainId: "context-management-reliability",
    examConcept: "Retries need a cap, not just backoff",
    scenario:
      "An engineer adds retry-with-backoff to a flaky tool call but sets no maximum retry count, reasoning \"it'll eventually succeed.\"",
    prompt: "What's the risk, and what's the fix?",
    options: [
      { id: "a", label: "An uncapped retry loop can hang indefinitely against a persistent, non-transient failure, burning cost and time with no bound; add a maximum retry count or timeout, after which the failure surfaces instead of retrying forever.", correct: true, rationale: "This names both the risk — an unbounded loop against a failure that was never going to resolve — and the correct fix: a cap that turns an infinite wait into a surfaced, actionable failure." },
      { id: "b", label: "There's no real risk — exponential backoff naturally prevents infinite retries on its own.", correct: false, rationale: "Backoff spaces retries out over time; it doesn't stop them from continuing indefinitely unless a maximum attempt count or timeout is also enforced." },
      { id: "c", label: "The fix is to remove backoff and retry as fast as possible instead.", correct: false, rationale: "Addresses the wrong part of the problem — the missing piece is a retry cap, not the presence of backoff, which is itself good practice." },
      { id: "d", label: "The fix is to never retry at all, and fail immediately on the very first error.", correct: false, rationale: "Overcorrects — this discards the real benefit of retrying genuinely transient failures, which do often succeed on a subsequent attempt." },
    ],
    difficulty: "applied",
  },
  {
    id: "d5-q15",
    domainId: "context-management-reliability",
    examConcept: "Malformed tool output should be treated as a recoverable, surfaced error",
    scenario:
      "A tool call returns a response that fails schema validation (malformed JSON) roughly 2% of the time due to an upstream bug.",
    prompt: "What's the best way to handle this in the agent loop?",
    options: [
      { id: "a", label: "Treat the malformed response as a recoverable error: retry the call with backoff and a cap, and if it keeps failing, surface a clear error rather than passing malformed data through as if it were valid.", correct: true, rationale: "This handles the transient case (retry) while also protecting against the case where retries are exhausted (surface a clear error instead of silently degrading)." },
      { id: "b", label: "Pass the malformed output directly to the model as the tool result, since the model can usually infer what was meant.", correct: false, rationale: "Risks compounding the failure — the model reasoning from malformed data can produce a confident but wrong downstream result." },
      { id: "c", label: "Permanently disable the tool for the rest of the session after a single malformed response.", correct: false, rationale: "Overreacts to a 2% transient failure rate by removing a tool the agent likely still needs for the remaining 98% of calls." },
      { id: "d", label: "Ignore the error and have the agent proceed with no tool result at all.", correct: false, rationale: "Masks the failure rather than handling it — the agent proceeds without the information it needed, with no signal that anything went wrong." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d5-q16",
    domainId: "context-management-reliability",
    examConcept: "Observability makes a failure diagnosable, not just noticed",
    scenario:
      "An agent occasionally produces a wrong final answer in production, but the team has no record of which tool calls it made, what results it got, or why it stopped when it did.",
    prompt: "What's missing here?",
    options: [
      { id: "a", label: "Observability — logging or tracing each turn's relevant events (tool calls, results, stop reason) so a failure can actually be diagnosed after the fact, not just noticed.", correct: true, rationale: "This is exactly what observability provides: a record detailed enough to reconstruct what happened on a specific run, rather than only knowing the final answer was wrong." },
      { id: "b", label: "A bigger context window, so the agent \"remembers\" more of its own reasoning after the fact.", correct: false, rationale: "Unrelated to the problem — context window size doesn't create a record of what happened on past, already-completed runs." },
      { id: "c", label: "A second agent to supervise the first agent's decisions in real time.", correct: false, rationale: "Over-engineered for the stated gap, which is a missing logging/tracing record, not a missing real-time supervisor." },
      { id: "d", label: "Nothing — this is an inherent, undiagnosable limitation of agentic systems.", correct: false, rationale: "Incorrect — logging tool calls, results, and stop reasons is a standard, practical fix, not an unsolvable limitation." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d5-q17",
    domainId: "context-management-reliability",
    examConcept: "Evals catch regressions that informal spot checks miss",
    scenario:
      "A team ships a prompt change to their production agent, relying only on a couple of people's informal spot checks before deploying, with no automated evaluation step.",
    prompt: "What's the risk, and the mitigation?",
    options: [
      { id: "a", label: "Informal spot checks won't reliably catch a regression across the full range of cases the agent handles; a repeatable eval suite of representative test cases run before deploy would catch what ad hoc checking misses.", correct: true, rationale: "This correctly identifies both the gap (limited coverage of manual spot checks) and the fix (a repeatable, broader eval suite run pre-deploy)." },
      { id: "b", label: "There's no real risk — as long as the change looks reasonable on a couple of examples, it's safe to ship.", correct: false, rationale: "A couple of manual examples can't represent the full range of inputs the agent handles in production, so this understates the risk." },
      { id: "c", label: "The only mitigation is to never change prompts once shipped.", correct: false, rationale: "Too extreme, and not the point being tested — the fix is evaluating changes systematically, not freezing them forever." },
      { id: "d", label: "The mitigation is to add more tools, which will make the prompt regression less likely.", correct: false, rationale: "Unrelated to the actual problem — adding tools doesn't address the lack of a systematic way to catch a prompt regression." },
    ],
    difficulty: "applied",
  },
  {
    id: "d5-q18",
    domainId: "context-management-reliability",
    examConcept: "Observability and evaluations are complementary, not substitutes",
    scenario:
      "A team says \"we already have observability, so we don't need evals\" after adding detailed per-run logging to their production agent.",
    prompt: "Is this reasoning sound?",
    options: [
      { id: "a", label: "No — observability tells you what happened on runs that already occurred; evals proactively test the agent against known cases before or during a change, to catch regressions before they reach production.", correct: true, rationale: "This correctly separates the two: observability is retrospective and diagnostic, while evals are proactive and preventive — neither one covers what the other does." },
      { id: "b", label: "Yes — logging every run is functionally identical to running evaluations.", correct: false, rationale: "Incorrect — logging records what happened on real traffic; it doesn't test a change against known cases before it ships." },
      { id: "c", label: "No, but only because logging is more expensive to maintain than evals, not because they serve different purposes.", correct: false, rationale: "Misidentifies the reason — the issue is that the two serve different purposes (diagnosis vs. prevention), not relative cost." },
      { id: "d", label: "Yes, as long as the logs are reviewed by a human once a week.", correct: false, rationale: "Weekly manual log review still can't catch a regression before it reaches real users the way a pre-deploy eval suite can." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d5-q19",
    domainId: "context-management-reliability",
    examConcept: "Production reliability is a composition of levers, not one single fix",
    scenario:
      "An architect is designing a long-running, customer-facing agent expected to run for months in production, handling a high volume of conversations and tool calls.",
    prompt: "Which combination best describes a production-reliable design?",
    options: [
      { id: "a", label: "Curated context rather than unbounded accumulation, compaction for long conversations, retrieval for anything too large to hold in context, capped retry-with-backoff for transient tool failures, and logging plus evals to catch and diagnose regressions.", correct: true, rationale: "This composes the levers correctly — each addresses a distinct failure mode, and production reliability comes from all of them together, not any single one alone." },
      { id: "b", label: "The largest available context window plus no retry logic, since a big enough window removes the need for the rest.", correct: false, rationale: "The classic single-lever misconception — a bigger window doesn't curate context, compact history, retrieve on demand, or handle transient tool failures." },
      { id: "c", label: "Aggressive, uncapped retries on every tool call to guarantee eventual success.", correct: false, rationale: "An uncapped retry policy risks hanging indefinitely on a non-transient failure, which is itself a reliability problem, not a solution to one." },
      { id: "d", label: "Detailed logging alone, with no context curation or retry strategy, since logs let you fix problems after the fact.", correct: false, rationale: "Reactive only — logging helps diagnose a problem after it happens, but does nothing to prevent context bloat or handle a failed tool call in the moment." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d5-q20",
    domainId: "context-management-reliability",
    examConcept: "Graceful degradation means surfacing a failure, not masking it",
    scenario:
      "A production agent's retrieval step fails to return any documents for a query due to an index outage. The current implementation silently proceeds with an empty context, and the model confidently answers anyway with no real grounding.",
    prompt: "What does \"degrading gracefully\" mean here, and what should happen instead?",
    options: [
      { id: "a", label: "The agent should detect the retrieval failure explicitly and respond accordingly — for example, telling the user it couldn't retrieve the needed information, or retrying/escalating — rather than silently continuing and letting the model produce an ungrounded answer that looks normal.", correct: true, rationale: "This is what graceful degradation actually means: the failure is detected and handled visibly, instead of being hidden behind a confident but ungrounded answer." },
      { id: "b", label: "Graceful degradation means the agent should always produce some answer no matter what, even without grounding, since any answer is better than none.", correct: false, rationale: "This describes the exact failure mode in the scenario — a confident, ungrounded answer is worse than an explicit acknowledgment that retrieval failed." },
      { id: "c", label: "Graceful degradation means the system should crash loudly and stop responding to the user entirely.", correct: false, rationale: "Overcorrects — a hard crash isn't graceful; the goal is a controlled, informative response, not a total halt." },
      { id: "d", label: "Graceful degradation only applies to context window overflows, not to retrieval failures.", correct: false, rationale: "Too narrow — graceful degradation is a general principle that applies to any failure mode, including a retrieval outage like this one." },
    ],
    difficulty: "exam-style",
  },
];
