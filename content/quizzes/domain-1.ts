import type { QuizQuestion } from "@/lib/content/schema";

/**
 * Domain 1 — Agentic Architecture & Orchestration. 20 original practice
 * questions, author-drafted by Claude at the project owner's direction and
 * pending a human review pass before being treated as final — see
 * content/README.md and CLAUDE.md's content authorship rule. None of these
 * are copied or derived from the real exam.
 */
export const domain1Questions: QuizQuestion[] = [
  {
    id: "d1-q01",
    domainId: "agentic-architecture-orchestration",
    examConcept: "Agent loop vs. single tool call",
    scenario:
      "A team builds a support bot: it reads a customer's message, decides whether it needs to look something up, calls a tool if so, reads the result, and decides whether to answer or look up something else — repeating until it has enough information to reply.",
    prompt: "Which single design element makes this an *agent* rather than a single-shot completion?",
    options: [
      { id: "a", label: "It uses a system prompt.", correct: false, rationale: "Single-shot completions use system prompts too — this doesn't distinguish an agent from one API call." },
      { id: "b", label: "It runs a loop where the model's own output decides whether another tool call happens next, not a fixed step count the developer wrote.", correct: true, rationale: "This is the actual definition in play: control flow is dynamic and model-driven, not hard-coded by the developer ahead of time." },
      { id: "c", label: "It calls an external API.", correct: false, rationale: "Tempting, but a deterministic workflow can call an API in a fixed step too — calling a tool once isn't what makes something agentic." },
      { id: "d", label: "It uses Claude's largest available model for higher-quality answers.", correct: false, rationale: "Model size is a quality/cost choice, not an architecture choice — it doesn't determine whether something is agentic." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d1-q02",
    domainId: "agentic-architecture-orchestration",
    examConcept: "Agent loop termination happens too early",
    scenario:
      "An engineer implements an \"agent\": it calls Claude once with a list of tools, executes at most one resulting tool call if present, and returns whatever it has to the user — regardless of whether the model's response indicated it wanted to keep going.",
    prompt: "What is actually missing from this implementation?",
    options: [
      { id: "a", label: "A retry mechanism for failed tool calls.", correct: false, rationale: "A reasonable reliability addition, but not what's structurally missing here — the loop itself never runs more than once." },
      { id: "b", label: "The loop: feeding the tool result back to the model and letting it decide to continue or stop, instead of terminating after one tool call.", correct: true, rationale: "Without feeding results back and re-invoking the model, this is a single tool call wearing agent clothing — there's no actual loop." },
      { id: "c", label: "A vector database for retrieval.", correct: false, rationale: "Not related to the problem described — nothing here suggests a retrieval gap." },
      { id: "d", label: "A second agent to double-check the first agent's single tool call.", correct: false, rationale: "Over-engineered — the fix is completing the loop that's missing, not adding a whole second agent around a broken one." },
    ],
    difficulty: "applied",
  },
  {
    id: "d1-q03",
    domainId: "agentic-architecture-orchestration",
    examConcept: "Stopping conditions should combine a real success signal with a safety bound",
    scenario:
      "A coding agent edits a file, runs the test suite, reads any failures, edits again, and repeats.",
    prompt: "Which condition should end this loop?",
    options: [
      { id: "a", label: "A fixed number of turns, always exactly 3, regardless of test results.", correct: false, rationale: "An arbitrary fixed count ignores whether the task is actually done — a turn cap is a reasonable *safety bound*, but using it as the primary success signal is the trap." },
      { id: "b", label: "Tests pass, OR the model explicitly reports it cannot proceed, OR a maximum turn/cost budget is hit — whichever comes first.", correct: true, rationale: "This combines a genuine success signal (tests pass), an explicit failure signal (model reports it's stuck), and a safety backstop (budget cap) — all three matter." },
      { id: "c", label: "The model is only allowed to run the test suite once, ever.", correct: false, rationale: "Defeats the point of an edit-test-edit loop — one test run can't validate a fix that hasn't been attempted yet." },
      { id: "d", label: "A human reviews and approves every single file edit before the loop continues.", correct: false, rationale: "Over-engineered for this task — it turns an autonomous debugging loop into a fully manual process, which removes the reason to use a loop at all." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d1-q04",
    domainId: "agentic-architecture-orchestration",
    examConcept: "Deterministic workflow vs. agent for fully specifiable tasks",
    scenario:
      "A company needs to convert a fixed-format CSV export into a fixed-format JSON file. The mapping never varies and involves no judgment calls.",
    prompt: "What architecture fits this task?",
    options: [
      { id: "a", label: "A single-agent loop with a \"transform\" tool the model calls repeatedly.", correct: false, rationale: "Over-engineered — there's no decision-making involved, so there's nothing for an agent loop to actually decide." },
      { id: "b", label: "A deterministic workflow (plain code), optionally calling Claude for one well-defined sub-step like unstructured text extraction — no agent loop required.", correct: true, rationale: "The steps are fully specifiable in advance with no ambiguity, which is exactly the case a deterministic workflow fits — an agent's dynamic control flow buys nothing here." },
      { id: "c", label: "A multi-agent system with one agent per column of the CSV.", correct: false, rationale: "Dramatically over-engineered — this adds coordination overhead to a task with no independent, judgment-requiring subtasks at all." },
      { id: "d", label: "A single unstructured prompt asking Claude to \"handle the conversion\" with no defined schema.", correct: false, rationale: "No guarantees on output shape for a task that has an exact, fixed target format — fragile for the wrong reason." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d1-q05",
    domainId: "agentic-architecture-orchestration",
    examConcept: "Split fully-specifiable rules out of the model-driven part",
    scenario:
      "A hiring pipeline auto-rejects any candidate below a fixed GPA cutoff with no exceptions. Candidates above the cutoff go through a nuanced fit review where judgment genuinely varies case by case.",
    prompt: "How should this be architected?",
    options: [
      { id: "a", label: "One agent handling every decision, including the mechanical GPA cutoff check.", correct: false, rationale: "Tempting because it's one system to build, but it wastes a model call — and adds nondeterminism — on a rule that has zero judgment involved." },
      { id: "b", label: "The GPA cutoff as a plain deterministic rule; the nuanced fit review, where judgment genuinely varies, handled by Claude scoped to that sub-task.", correct: true, rationale: "This puts each part where it belongs: no model call for a rule with no ambiguity, model reasoning only where judgment is actually required." },
      { id: "c", label: "Two independent agents that each redo the entire pipeline and vote on the outcome.", correct: false, rationale: "Over-engineered — duplicating the whole pipeline doesn't address the actual split between rule-based and judgment-based steps." },
      { id: "d", label: "A human reviewing every application from scratch, bypassing Claude and the pipeline entirely.", correct: false, rationale: "Not an answer to how to architect the system with Claude — it discards the premise instead of addressing it." },
    ],
    difficulty: "applied",
  },
  {
    id: "d1-q06",
    domainId: "agentic-architecture-orchestration",
    examConcept: "Recognizing when judgment-heavy steps require model reasoning, not just rules",
    scenario:
      "An expense-approval system must: read a submitted receipt, check it against fixed policy limits, flag anomalies for finance review, and auto-approve clear cases.",
    prompt: "Which architecture fits these requirements?",
    options: [
      { id: "a", label: "A single Claude API call, no tools, given the policy text and asked to output an approval decision.", correct: false, rationale: "Can't retrieve the actual receipt data or check it against live policy records — this only works if everything needed is already in the prompt, which it isn't here." },
      { id: "b", label: "A fully deterministic rule engine: policy-limit checks and anomaly detection both encoded as fixed rules, no model call.", correct: false, rationale: "Tempting — policy-limit checks are genuinely rule-based — but \"flag anomalies\" is exactly the kind of open-ended judgment call a fixed rule table can't fully enumerate in advance." },
      { id: "c", label: "A single tool-using agent bounded to receipt-read, policy-lookup, and flag-for-review tools, looping until it reaches a decision.", correct: true, rationale: "One coherent task, tools scoped to exactly what's needed, and model reasoning applied where judgment (anomaly flagging) actually requires it." },
      { id: "d", label: "A separate agent for reading the receipt, a separate agent for policy lookup, and a separate agent for the anomaly decision.", correct: false, rationale: "Over-engineered — these steps are sequential and depend on each other's output, not independent subtasks that benefit from separate agent identities." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d1-q07",
    domainId: "agentic-architecture-orchestration",
    examConcept: "Multi-agent is justified by genuine decomposition, not by task importance",
    scenario:
      "A research assistant needs to answer one narrow factual question by searching, reading a couple of sources, and synthesizing a short answer.",
    prompt: "Should this be a single agent or a multi-agent system?",
    options: [
      { id: "a", label: "Single agent — the sub-steps (search, read, synthesize) are sequential and depend on each other's output, not independent tasks that benefit from separate identities or parallel execution.", correct: true, rationale: "There's nothing here to genuinely decompose — each step needs the previous step's result, so one agent looping through them is the natural fit." },
      { id: "b", label: "Multi-agent, with one agent per search result running in parallel, because more agents means more thorough research.", correct: false, rationale: "A common misconception — parallel agents help when subtasks are genuinely independent, not as a general \"more thorough\" multiplier for a single narrow question." },
      { id: "c", label: "Multi-agent with a manager agent, a critic agent, and a writer agent, for a one-paragraph factual answer.", correct: false, rationale: "Over-engineered — this adds coordination overhead with no corresponding benefit for a task this narrow." },
      { id: "d", label: "No agent at all — hardcode the search query in advance.", correct: false, rationale: "The question requires open-ended reasoning about what to search for and how to synthesize the results, which a hardcoded query can't adapt to." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d1-q08",
    domainId: "agentic-architecture-orchestration",
    examConcept: "Parallelizable, independent subtasks are the actual justification for multi-agent fan-out",
    scenario:
      "A research assistant needs to independently investigate five unrelated competitor companies and produce one paragraph per company. None of the five investigations depends on any other.",
    prompt: "What's the best architecture?",
    options: [
      { id: "a", label: "A single agent processing the five companies one after another in one long loop.", correct: false, rationale: "Workable, but tempting-but-wrong as the *best* answer — it's slower than it needs to be, and confusing data from one company can bleed into the reasoning context for the next since everything shares one loop." },
      { id: "b", label: "Multiple subagents, one per company, run in parallel with a shared narrow tool set, with their results collected and combined in a final synthesis step.", correct: true, rationale: "The five investigations are genuinely independent and parallelizable, each subagent gets an isolated context, and a synthesis step still produces one coherent deliverable." },
      { id: "c", label: "A single agent that swaps between five completely different tool sets and personas mid-conversation.", correct: false, rationale: "Doesn't achieve parallelism and fabricates complexity — swapping personas in one conversation isn't meaningfully different from just doing the five investigations sequentially." },
      { id: "d", label: "Five parallel subagents plus a supervisor that personally redoes each company's research afterward as a check.", correct: false, rationale: "Over-engineered — redoing all five investigations again defeats the point of delegating them, and duplicates the work for no stated reliability requirement." },
    ],
    difficulty: "applied",
  },
  {
    id: "d1-q09",
    domainId: "agentic-architecture-orchestration",
    examConcept: "Tool-set scope and delegation as a reliability lever",
    scenario:
      "A single Claude agent is given 40 tools spanning HR, finance, IT, and legal systems, and is expected to handle any employee question end to end, alone.",
    prompt: "What's the issue, and the best fix?",
    options: [
      { id: "a", label: "Nothing is wrong — a single agent should get the largest tool list possible for maximum coverage.", correct: false, rationale: "A common misconception — tool-selection accuracy tends to degrade as the tool list grows and overlaps, and most questions only need one of the four domains' tools." },
      { id: "b", label: "Split into domain-scoped agents or subagents (HR, finance, IT, legal) with a router that delegates to the right one, narrowing each agent's tool boundary.", correct: true, rationale: "This is a genuine decomposition by domain, each with a bounded, unambiguous tool set — reducing the tool-selection errors the 40-tool single agent is prone to." },
      { id: "c", label: "Keep one agent, but require the end user to specify which of the 40 tools to use before calling Claude.", correct: false, rationale: "Pushes the system's actual job — figuring out what's needed — onto the user instead of solving it architecturally." },
      { id: "d", label: "Add a fifth agent whose only job is to double-check the other four agents' tool calls line by line.", correct: false, rationale: "Over-engineered for the stated problem, which is about tool-set scope, not about needing an additional verification layer." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d1-q10",
    domainId: "agentic-architecture-orchestration",
    examConcept: "What actually distinguishes a subagent from just another tool call",
    scenario: "A team debates what \"subagent\" means in an orchestration design.",
    prompt: "Which definition is accurate?",
    options: [
      { id: "a", label: "Any function that returns a string.", correct: false, rationale: "Too broad — this describes almost any tool, not specifically a subagent." },
      { id: "b", label: "A separate agent loop with its own bounded tool set and context, invoked by a parent/orchestrator to handle a defined subtask, returning a result rather than talking to the end user directly.", correct: true, rationale: "This captures what's actually distinct: its own loop and context, a defined subtask boundary, and a result handed back — not a conversation with the end user." },
      { id: "c", label: "A separate LLM from a different vendor used for part of the pipeline.", correct: false, rationale: "Confuses \"different model provider\" with \"different agent\" — a subagent can use the exact same model as its parent." },
      { id: "d", label: "Any architecture that uses more than one tool.", correct: false, rationale: "A single agent can use many tools without ever being multi-agent — tool count isn't the same axis as agent count." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d1-q11",
    domainId: "agentic-architecture-orchestration",
    examConcept: "Delegation boundary: subagents return distilled results, not raw transcripts",
    scenario:
      "An orchestrator agent delegates \"summarize this 200-page contract\" to a subagent, then continues the conversation with the end user.",
    prompt: "What should the orchestrator receive back from the subagent?",
    options: [
      { id: "a", label: "The subagent's full, unfiltered internal reasoning and tool-call transcript.", correct: false, rationale: "Tempting as \"more information is safer,\" but dumping the whole transcript back into the orchestrator's context defeats the point of delegating — it bloats and pollutes the very context delegation was meant to protect." },
      { id: "b", label: "A distilled result matching what the orchestrator actually needs — e.g. the summary plus key flags — not the subagent's full working transcript.", correct: true, rationale: "This is the actual point of a delegation boundary: the parent gets what it needs to act on, not everything the subagent did to get there." },
      { id: "c", label: "Nothing — the subagent should message the end user directly.", correct: false, rationale: "Breaks the orchestration boundary and the user-facing contract the orchestrator is responsible for." },
      { id: "d", label: "A request that the orchestrator redo the summarization itself as a check.", correct: false, rationale: "Over-engineered — redoing the delegated work defeats the reason to delegate it in the first place." },
    ],
    difficulty: "applied",
  },
  {
    id: "d1-q12",
    domainId: "agentic-architecture-orchestration",
    examConcept: "Parallelization requires independence, not just multiple tools",
    scenario: "A team is deciding when it's worth running tool calls or subagents in parallel.",
    prompt: "When does parallelization actually help?",
    options: [
      { id: "a", label: "Whenever more than one tool is available to the agent.", correct: false, rationale: "Tool availability alone says nothing about whether calls can run at the same time." },
      { id: "b", label: "When the sub-tasks are independent of each other's outputs — neither needs to know the other's result to proceed.", correct: true, rationale: "This is the actual requirement: independence, not just plurality of tools or agents." },
      { id: "c", label: "Always — parallel execution is strictly faster than sequential for any agent.", correct: false, rationale: "Ignores dependency chains (a later step needing an earlier step's result) and shared-resource limits like rate limits, both of which parallelism doesn't fix." },
      { id: "d", label: "Only when using a multi-agent architecture with a dedicated \"parallelization agent.\"", correct: false, rationale: "A single agent can dispatch multiple tool calls concurrently — parallelism and single- vs. multi-agent are different axes of the design." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d1-q13",
    domainId: "agentic-architecture-orchestration",
    examConcept: "Independent tool calls should be dispatched concurrently, not chained unnecessarily",
    scenario:
      "An agent needs order status from System A and a shipping ETA from System B to answer a customer's question. Neither lookup depends on the other's result.",
    prompt: "What's the best approach?",
    options: [
      { id: "a", label: "Call System A, wait for the result, then call System B, because that's simpler to implement.", correct: false, rationale: "Works, but tempting-but-wrong as the best answer — it wastes latency waiting on two lookups that don't depend on each other at all." },
      { id: "b", label: "Dispatch both tool calls concurrently since neither depends on the other's result, then combine both results before responding.", correct: true, rationale: "This is exactly the independence condition that justifies parallel dispatch — no reason to serialize two lookups that don't need each other." },
      { id: "c", label: "Spin up two separate subagents, one per system, coordinated by a third supervisor agent.", correct: false, rationale: "Over-engineered for two quick, independent lookups within a single task — this is a case for parallel tool calls, not a multi-agent architecture." },
      { id: "d", label: "Skip System B and estimate the shipping ETA instead of looking it up.", correct: false, rationale: "Fabricates data instead of retrieving it — not an architecture answer to the stated requirement." },
    ],
    difficulty: "applied",
  },
  {
    id: "d1-q14",
    domainId: "agentic-architecture-orchestration",
    examConcept: "HITL gates high-stakes/low-confidence actions, not every action",
    scenario: "A team is deciding where to add a human-in-the-loop step to an agent.",
    prompt: "What's the primary reason to add a human-in-the-loop gate?",
    options: [
      { id: "a", label: "To make the system look more trustworthy in marketing material.", correct: false, rationale: "A HITL gate should be a real reliability/safety control, not a cosmetic addition." },
      { id: "b", label: "To gate irreversible, high-stakes, or low-confidence actions before they take effect.", correct: true, rationale: "This is what a HITL gate is actually for — inserting human judgment exactly where an action is hard to undo or the agent's confidence is low." },
      { id: "c", label: "To have a human perform every step the agent is capable of doing itself.", correct: false, rationale: "That's not a gate on an agent — it's replacing the agent, which removes the reason to build one." },
      { id: "d", label: "To slow the system down so it feels more careful.", correct: false, rationale: "Speed isn't the goal — an appropriately-scoped gate is, and it should only add friction where the stakes justify it." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d1-q15",
    domainId: "agentic-architecture-orchestration",
    examConcept: "A HITL gate must occur before the irreversible action, not after",
    scenario:
      "A refund agent is required to \"escalate unusual cases to a human\" rather than deciding on its own.",
    prompt: "Which implementation actually satisfies that requirement?",
    options: [
      { id: "a", label: "The agent pauses and hands off to a human review queue whenever policy rules don't clearly cover the case or the amount exceeds a defined threshold, resuming only after a human decision is recorded.", correct: true, rationale: "This is a real gate: the human decision happens before the outcome takes effect, exactly for the cases the requirement calls \"unusual.\"" },
      { id: "b", label: "The agent always issues the refund itself and separately emails a summary to a human for their records.", correct: false, rationale: "Tempting because a human is still \"in the loop\" informationally, but the refund already took effect before any human saw it — this is a log, not a gate." },
      { id: "c", label: "A human manually reviews and re-approves every refund, including the completely clear-cut ones.", correct: false, rationale: "Over-engineered — reviewing every case, not just the unusual ones, erodes the entire reason to automate the common path." },
      { id: "d", label: "The agent asks the customer, not an employee, whether to approve their own refund.", correct: false, rationale: "Misidentifies who the human-in-the-loop should be — the requirement calls for internal escalation, not customer self-approval." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d1-q16",
    domainId: "agentic-architecture-orchestration",
    examConcept: "A real stopping condition is checkable and combines a success signal with safety bounds",
    scenario: "A team is defining stopping conditions for a new agent loop.",
    prompt: "Which of these is a well-formed stopping condition?",
    options: [
      { id: "a", label: "\"Stop when the conversation feels complete.\"", correct: false, rationale: "Not a condition anything in the system can actually check — there's no signal being evaluated." },
      { id: "b", label: "\"Stop when the model returns a final answer with no further tool calls, OR a maximum of N turns is reached, OR an unrecoverable tool error occurs.\"", correct: true, rationale: "Each clause is checkable, and together they cover the success case, a safety bound, and a failure case." },
      { id: "c", label: "\"Stop after exactly one tool call, always.\"", correct: false, rationale: "Arbitrarily under-scoped — it ignores whether the task actually needed more than one tool call." },
      { id: "d", label: "\"Never stop — keep looping until the user closes the app.\"", correct: false, rationale: "No bound at all — unsafe, and provides no way to detect a loop that's gone wrong." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d1-q17",
    domainId: "agentic-architecture-orchestration",
    examConcept: "Unbounded 'more information might help' loops need an explicit termination signal",
    scenario:
      "An agent researching a topic keeps calling a search tool, because each new search \"might turn up something more.\"",
    prompt: "What's missing from this design?",
    options: [
      { id: "a", label: "A bigger context window so it can hold more search results.", correct: false, rationale: "Doesn't address the actual problem — an unbounded loop, regardless of context size." },
      { id: "b", label: "An explicit termination signal — e.g. a required \"I have enough to answer\" step, or a cap on search calls — so diminishing returns don't loop forever.", correct: true, rationale: "This directly fixes the described failure mode: nothing currently tells the loop that more searching has stopped being worth it." },
      { id: "c", label: "A second agent whose only job is to tell the first agent when to stop.", correct: false, rationale: "Over-engineered — an explicit stop signal or a turn cap solves this without adding a whole second agent." },
      { id: "d", label: "Switching to a smaller, faster model so each loop iteration is cheaper.", correct: false, rationale: "Reduces the cost of each iteration but doesn't fix the missing stop condition — it would just loop indefinitely for less money per loop." },
    ],
    difficulty: "applied",
  },
  {
    id: "d1-q18",
    domainId: "agentic-architecture-orchestration",
    examConcept: "A numeric cap alone is a safety bound, not a success condition",
    scenario: "An agent's only stopping condition is a hard cap of 50 turns.",
    prompt: "What's the risk, and what's the fix?",
    options: [
      { id: "a", label: "No risk — a numeric cap is always sufficient on its own.", correct: false, rationale: "A cap alone can't distinguish \"finished successfully early\" from \"still stuck at turn 50\" — both look the same to the system." },
      { id: "b", label: "It will either keep looping through all 50 turns even after reaching a good answer, or hit the cap mid-task with no real answer and no signal of success vs. failure; add a genuine completion signal alongside the cap, which stays only as a safety backstop.", correct: true, rationale: "This names both failure modes of a cap-only design and the correct fix: a real success signal plus the cap as a backstop, not the cap as the primary condition." },
      { id: "c", label: "The cap should be removed entirely in favor of unlimited turns, for reliability.", correct: false, rationale: "Removes the only safety bound the system has — the opposite of a reliability improvement." },
      { id: "d", label: "The cap should be lowered to 1 turn to guarantee fast responses.", correct: false, rationale: "Ignores that many real tasks legitimately need more than one loop iteration to complete." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d1-q19",
    domainId: "agentic-architecture-orchestration",
    examConcept: "Flexibility vs. predictability is the core agent/workflow trade-off",
    scenario: "A team is weighing an agent-based design against a deterministic workflow for a new feature.",
    prompt: "What's the main reliability trade-off of choosing an agent over a deterministic workflow?",
    options: [
      { id: "a", label: "Agents are always less reliable and should be avoided.", correct: false, rationale: "Overgeneralizes — agents are the right choice precisely for tasks whose steps genuinely can't be fully specified in advance." },
      { id: "b", label: "An agent trades predictability and easy testability for flexibility on tasks that can't be fully specified in advance — which also means it needs its own bounds (stopping conditions, tool scope) that a fixed workflow gets for free from its fixed structure.", correct: true, rationale: "This states the actual trade-off in both directions: what's gained (flexibility) and what has to be deliberately added back (bounds a workflow doesn't need)." },
      { id: "c", label: "Workflows are always slower than agents.", correct: false, rationale: "Typically the reverse — a workflow skips a model call at each decision point, so it's usually faster, not slower." },
      { id: "d", label: "The trade-off only matters for multi-agent systems, not single-agent ones.", correct: false, rationale: "The trade-off applies to any agent-vs-workflow choice, regardless of how many agents are involved." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d1-q20",
    domainId: "agentic-architecture-orchestration",
    examConcept: "'More agents = more reliable' is a misconception; reliability comes from bounding one agent well",
    scenario:
      "A team is choosing between a single-agent and multi-agent design for a task that is strictly sequential — each step depends on the last. They pick multi-agent, reasoning that \"more agents double-check each other\" for extra reliability.",
    prompt: "Evaluate this reasoning.",
    options: [
      { id: "a", label: "Correct — more agents always means more reliability.", correct: false, rationale: "This is the misconception the question is testing — agent count isn't a reliability dial." },
      { id: "b", label: "Flawed: for a strictly sequential task, splitting into multiple agents adds coordination failure points (handoffs and parsing between agents) without addressing the actual reliability need — reliability here comes from bounded tools, clear stopping conditions, and error handling within one agent, not from adding agents.", correct: true, rationale: "This correctly locates where reliability actually comes from, and why adding agents to a sequential task adds risk rather than removing it." },
      { id: "c", label: "Correct, but only if the agents use different underlying models from each other.", correct: false, rationale: "Doesn't fix the underlying reasoning — using different model providers doesn't address the coordination overhead problem at all." },
      { id: "d", label: "Flawed only because it's more expensive, not because it's architecturally unsound.", correct: false, rationale: "Cost is a real downside, but it's not the primary flaw here — the architectural mismatch (splitting a sequential task) is." },
    ],
    difficulty: "exam-style",
  },
];
