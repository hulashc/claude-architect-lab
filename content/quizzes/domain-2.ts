import type { QuizQuestion } from "@/lib/content/schema";

/**
 * Domain 2 — Tool Design & MCP Integration. 20 original practice questions,
 * author-drafted by Claude at the project owner's direction and pending a
 * human review pass before being treated as final — see content/README.md
 * and CLAUDE.md's content authorship rule. None of these are copied or
 * derived from the real exam.
 */
export const domain2Questions: QuizQuestion[] = [
  {
    id: "d2-q01",
    domainId: "tool-design-mcp",
    examConcept: "What MCP actually solves — the M×N integration problem",
    scenario:
      "A company has built three different AI-powered apps, each needing access to the same five internal systems (CRM, ticketing, inventory, calendar, and billing). Historically, each app team wrote its own bespoke integration code for each system it needed.",
    prompt: "What problem does adopting the Model Context Protocol (MCP) primarily solve here?",
    options: [
      { id: "a", label: "It replaces the need for authentication to any of the five internal systems.", correct: false, rationale: "MCP standardizes how a host connects to a server's tools, resources, and prompts — it doesn't remove the need for the server to authenticate to the systems it wraps." },
      { id: "b", label: "It lets each app connect once, as an MCP client, to a standard MCP server for each system, instead of writing bespoke integration code per app-per-system pairing.", correct: true, rationale: "This is the actual value: one integration per system exposed as an MCP server, reusable by any MCP-compatible host, instead of three apps times five systems worth of custom code." },
      { id: "c", label: "It guarantees the model will never call the wrong tool.", correct: false, rationale: "MCP standardizes the connection protocol; tool-selection accuracy still depends on how well each tool is named, described, and scoped." },
      { id: "d", label: "It removes the need for the model to decide when to call a tool at all.", correct: false, rationale: "The model still decides when to invoke a tool — MCP standardizes how that tool is exposed and invoked, not whether the model reasons about calling it." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d2-q02",
    domainId: "tool-design-mcp",
    examConcept: "Host, client, and server roles",
    scenario:
      "A developer is building a custom internal chat assistant. They want it to connect to an existing MCP server that exposes their company's ticketing system.",
    prompt: "Which statement correctly describes the roles involved?",
    options: [
      { id: "a", label: "The chat assistant is the MCP server, and the ticketing system runs an MCP client to talk to it.", correct: false, rationale: "This reverses the roles — the application that embeds the connection logic is the client side (inside the host), and the ticketing integration is exposed by the server." },
      { id: "b", label: "The chat assistant is the host application; it embeds an MCP client that connects to the ticketing system's MCP server.", correct: true, rationale: "This is the correct mapping: the host is the AI application itself, the client is the connection component it embeds, and the server is the program exposing the ticketing system's capabilities." },
      { id: "c", label: "The MCP client and MCP server are the same component, just named differently depending on which side initiates the connection.", correct: false, rationale: "They are distinct roles with distinct responsibilities — the client lives inside the host and manages a connection, the server exposes the actual tools, resources, and prompts." },
      { id: "d", label: "The host application must be the ticketing system itself for MCP to work.", correct: false, rationale: "The host is whatever AI application is consuming the integration — the ticketing system is what the server wraps, not the host." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d2-q03",
    domainId: "tool-design-mcp",
    examConcept: "Resources are application-controlled, not model-invoked like tools",
    scenario:
      "An MCP server exposes a resource representing the contents of a company's onboarding handbook document, alongside a tool called send_welcome_email.",
    prompt: "What's the key architectural difference in how these two primitives get used during a conversation?",
    options: [
      { id: "a", label: "There is no real difference — both are invoked by the model the same way, just named differently.", correct: false, rationale: "This collapses a real distinction: resources are read-only context surfaced by the application/host, while tools are actions the model itself decides to invoke." },
      { id: "b", label: "The handbook resource is something the host/client can choose to attach as context for the model to read; the send_welcome_email tool is an action the model itself decides to invoke during reasoning.", correct: true, rationale: "This is the accurate control split — resources are application-controlled context, tools are model-controlled actions — and it's exactly the distinction the exam tests." },
      { id: "c", label: "Resources always cost more tokens than tools, which is the only meaningful difference.", correct: false, rationale: "Token cost isn't the defining distinction between the two primitive types — who decides to use them is." },
      { id: "d", label: "The send_welcome_email tool is read-only, and the handbook resource has side effects.", correct: false, rationale: "This is backwards — sending a welcome email is the side-effecting action, while a handbook document is the read-only content." },
    ],
    difficulty: "applied",
  },
  {
    id: "d2-q04",
    domainId: "tool-design-mcp",
    examConcept: "Prompts as user-selected templates, not the system prompt",
    scenario:
      "A team's MCP server exposes a prompt called \"draft-incident-report\" that pre-fills a structured template with placeholders for severity, affected systems, and timeline.",
    prompt: "How is this prompt primitive actually meant to be used?",
    options: [
      { id: "a", label: "It silently rewrites the model's system prompt every time the server connects.", correct: false, rationale: "An MCP prompt is not the system prompt — it's a separate, reusable template exposed by the server, not something injected automatically without selection." },
      { id: "b", label: "The model calls it automatically whenever it decides an incident report is needed, the same way it would call a tool.", correct: false, rationale: "This conflates prompts with tools — a prompt is user-controlled, typically surfaced as something like a selectable command, not invoked autonomously by the model's own reasoning." },
      { id: "c", label: "It's a reusable, server-defined template that a user (or the host on the user's behalf) selects to start a specific workflow, such as through a slash-command-style menu.", correct: true, rationale: "This matches the actual role of the prompt primitive: user-controlled, selected explicitly to kick off a defined task with the right framing already filled in." },
      { id: "d", label: "It functions identically to a resource, just with a different name in the protocol.", correct: false, rationale: "Prompts, resources, and tools are three distinct primitives with different control models — naming them differently reflects a real functional difference, not a synonym." },
    ],
    difficulty: "applied",
  },
  {
    id: "d2-q05",
    domainId: "tool-design-mcp",
    examConcept: "Distinguishing all three primitives by who controls invocation",
    scenario:
      "A reviewer is quizzing a candidate: \"An MCP server exposes a tool, a resource, and a prompt. For each, who decides when it gets used?\"",
    prompt: "Which answer is correct?",
    options: [
      { id: "a", label: "The model decides for the tool; the application/client decides for the resource; the user (or host, on their behalf) decides for the prompt.", correct: true, rationale: "This is the accurate three-way split: tools are model-controlled, resources are application-controlled, prompts are user-controlled — the exact distinction this domain repeatedly tests." },
      { id: "b", label: "The user decides for all three, since the user ultimately approves everything the assistant does.", correct: false, rationale: "This flattens a meaningful distinction — the model itself decides when to invoke a tool mid-reasoning, without a separate user selection step each time." },
      { id: "c", label: "The server decides for all three, since it defines all of them.", correct: false, rationale: "Defining a capability and controlling when it's invoked are different things — the server exposes all three, but invocation control differs by primitive type." },
      { id: "d", label: "It's the same for all three: whichever component connects first in the session.", correct: false, rationale: "Connection order has nothing to do with which party controls invocation of a given primitive." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d2-q06",
    domainId: "tool-design-mcp",
    examConcept: "Narrow, well-typed input schemas vs. vague/broad ones",
    scenario:
      "A developer defines a tool called update_record with an input schema of a single freeform string field called 'instructions,' intended to cover any kind of record update.",
    prompt: "What's the main problem with this design?",
    options: [
      { id: "a", label: "Nothing — a flexible freeform field is more future-proof than a rigid schema.", correct: false, rationale: "This is the trap: a vague, catch-all input gives the model no real structure to fill in reliably, which tends to produce more malformed or ambiguous calls, not fewer." },
      { id: "b", label: "The input schema is too vague and broad for the model to fill in reliably or for the server to validate; a narrow, well-typed schema (e.g. explicit fields for record ID, field name, new value) would produce more predictable calls.", correct: true, rationale: "This names the actual design problem and the fix — narrow, well-typed fields the model can populate consistently and the server can validate, instead of an unstructured string standing in for structure." },
      { id: "c", label: "The tool needs a longer name to be clearer.", correct: false, rationale: "Renaming the tool doesn't address the structural problem with an unvalidated freeform input field." },
      { id: "d", label: "The tool should be removed entirely and replaced with a resource.", correct: false, rationale: "Updating a record is a side-effecting action, which is exactly what a tool is for — the fix is a better schema, not swapping primitive types." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d2-q07",
    domainId: "tool-design-mcp",
    examConcept: "Tool descriptions matter as much as the schema",
    scenario:
      "Two tools exist on the same server: search_docs, described only as \"searches\", and search_knowledge_base, described as \"Searches the internal knowledge base for articles matching a query string; returns up to 5 titles and short excerpts, ranked by relevance.\"",
    prompt: "Which statement is accurate?",
    options: [
      { id: "a", label: "The description length or content makes no difference — the model only reads the tool name.", correct: false, rationale: "The model uses the tool's description, not just its name, to decide whether and how to call it — a vague description increases the odds of wrong or malformed calls." },
      { id: "b", label: "The vague description on search_docs makes it more likely the model calls it incorrectly or in situations it doesn't actually fit, compared to the clearly scoped description on search_knowledge_base.", correct: true, rationale: "A clear description of what the tool does, what it returns, and its shape directly reduces model errors — this is the practical reason tool descriptions are treated as a design element, not documentation trivia." },
      { id: "c", label: "Both tools will perform identically regardless of description quality, since they presumably do similar things internally.", correct: false, rationale: "Internal implementation aside, the model's decision of when and how to call a tool is driven by what it can read about the tool — the description is part of the interface, not cosmetic." },
      { id: "d", label: "search_docs should be removed because short names are always a design flaw.", correct: false, rationale: "Name brevity isn't the issue here — the vague description is." },
    ],
    difficulty: "applied",
  },
  {
    id: "d2-q08",
    domainId: "tool-design-mcp",
    examConcept: "Structured, predictable tool output matters as much as structured input",
    scenario:
      "A tool called get_weather sometimes returns a plain sentence like \"It's sunny and 72 degrees in Austin today,\" and other times returns a JSON object with temperature and condition fields, depending on which underlying API responded.",
    prompt: "What's the issue with this tool's design?",
    options: [
      { id: "a", label: "There is no issue, since the model can read both formats equally well.", correct: false, rationale: "Inconsistent output shape makes the tool's results unpredictable for the model to parse and reason over reliably across calls — that's the actual design flaw here." },
      { id: "b", label: "The tool's output shape is inconsistent between calls, which undermines the predictability a tool result should have; it should return one consistent structured shape regardless of which backend served the request.", correct: true, rationale: "This is the real problem and the fix: the caller (model) shouldn't have to handle two different output shapes for the same tool — that inconsistency is a design defect in the tool, not something the model should be expected to work around." },
      { id: "c", label: "The tool needs a longer, more detailed name.", correct: false, rationale: "Renaming doesn't address inconsistent output structure between calls." },
      { id: "d", label: "The tool should stop returning the temperature entirely to simplify its output.", correct: false, rationale: "Removing useful data isn't the fix — returning it in one consistent, structured shape every time is." },
    ],
    difficulty: "applied",
  },
  {
    id: "d2-q09",
    domainId: "tool-design-mcp",
    examConcept: "Least privilege: several narrow tools over one broad tool",
    scenario:
      "A team is deciding between giving Claude one tool called manage_database that accepts arbitrary SQL statements, versus three narrow tools: get_customer_by_id, get_recent_orders, and update_shipping_address.",
    prompt: "Which design better reflects least-privilege tool scoping?",
    options: [
      { id: "a", label: "The single manage_database tool, since it's more flexible and can handle any future need without adding new tools.", correct: false, rationale: "Flexibility here comes at the cost of scope — a tool that accepts arbitrary SQL can do far more than any single task requires, which is exactly what least privilege warns against." },
      { id: "b", label: "The three narrow tools, each scoped to exactly one well-defined action the task needs, none of which can reach beyond its intended purpose.", correct: true, rationale: "This is least privilege in practice: each tool can do exactly one bounded thing, so a model error or a malicious input can only cause a narrowly bounded amount of damage, and each tool's purpose is unambiguous." },
      { id: "c", label: "Neither — the model should be given direct database credentials and write its own queries.", correct: false, rationale: "This removes tool scoping entirely and gives the model raw access to the database, which is the opposite of a bounded, auditable design." },
      { id: "d", label: "The single manage_database tool, but only if it logs every query it runs.", correct: false, rationale: "Logging is good practice generally, but it doesn't shrink the actual capability the tool grants — the tool can still do far more than any given task needs, which is the core problem." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d2-q10",
    domainId: "tool-design-mcp",
    examConcept: "Blast radius of an overly broad tool under a prompt injection or model error",
    scenario:
      "A support agent has one tool, run_admin_action, that accepts a string 'action' parameter and can create, modify, or delete any record in the company's systems. During a session, a piece of retrieved document content contains hidden text instructing the model to delete a customer's account.",
    prompt: "What does this scenario illustrate about tool scoping?",
    options: [
      { id: "a", label: "The problem is specific to this one piece of malicious content, and would not recur with better content filtering alone.", correct: false, rationale: "Content filtering can help, but it doesn't address the underlying design issue: a single overly broad tool gives any successful manipulation or model error a huge amount of capability to act on." },
      { id: "b", label: "A broad, multi-capability tool gives a single point of failure — whether from a model mistake or injected instructions — a much larger blast radius than several narrowly scoped tools would, each of which could only perform one bounded action.", correct: true, rationale: "This is the actual lesson: narrow tool scoping limits how much damage any single failure mode (bad reasoning, bad input, injected instructions) can cause, precisely because each tool can only do one bounded thing." },
      { id: "c", label: "This shows that tools should never be given to a model at all.", correct: false, rationale: "The lesson is about scoping tools narrowly, not eliminating tool use — narrowly scoped tools with validated input are the actual mitigation, not removing tools." },
      { id: "d", label: "This shows that resources are inherently more dangerous than tools.", correct: false, rationale: "The scenario is about an overly broad, side-effecting tool, not about resources — resources are read-only context, not the risk described here." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d2-q11",
    domainId: "tool-design-mcp",
    examConcept: "'More tools = more capable' is a misconception",
    scenario:
      "A team gives their Claude-based assistant access to 60 tools spanning nearly every internal system, reasoning that more tools available means the assistant can handle more requests well.",
    prompt: "Evaluate this reasoning.",
    options: [
      { id: "a", label: "Correct — tool count and assistant capability scale together with no downside.", correct: false, rationale: "This is the misconception being tested — a large, overlapping, or poorly scoped tool list tends to increase tool-selection errors rather than simply adding capability." },
      { id: "b", label: "Flawed: a large, broad tool list makes it harder for the model to select the right tool for a given request, increases the chance of an overly broad or wrong tool being called, and expands the system's overall blast radius; scoping tools to what a given task or role actually needs is the more reliable design.", correct: true, rationale: "This correctly identifies both the practical failure mode (tool-selection accuracy) and the security angle (blast radius), and points to scoping as the fix rather than raw tool count." },
      { id: "c", label: "Correct, but only because 60 is an unusually large number — 20 tools would have no such issue.", correct: false, rationale: "The problem is about scope and overlap relative to what a task needs, not a specific numeric threshold." },
      { id: "d", label: "Flawed only because it's expensive to maintain 60 tools, not because of any model-reasoning or security concern.", correct: false, rationale: "Maintenance cost is real, but it's not the central issue here — tool-selection accuracy and blast radius are the more direct architectural concerns." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d2-q12",
    domainId: "tool-design-mcp",
    examConcept: "Authentication approaches for MCP servers, conceptually",
    scenario:
      "A team is standing up an MCP server that connects to an internal ticketing API. They're deciding between a static API key baked into the server's configuration and an OAuth-based flow where each user authorizes access to their own ticketing account.",
    prompt: "What's an accurate way to think about this choice?",
    options: [
      { id: "a", label: "API keys and OAuth are functionally identical, so the choice is arbitrary.", correct: false, rationale: "They serve different situations — a static API key suits a server acting with one fixed set of permissions, while OAuth suits a server that needs to act on behalf of individual users with their own scoped, revocable authorization." },
      { id: "b", label: "A static API key tends to fit a server acting under one fixed service-level identity, while an OAuth-based flow tends to fit a server that needs to act on behalf of individual users with their own permissions, since it supports per-user, revocable, scoped authorization.", correct: true, rationale: "This captures the real conceptual difference without overspecifying protocol mechanics: the right choice depends on whether the server needs one fixed identity or many user-scoped identities." },
      { id: "c", label: "OAuth should always be used, because it's newer than API keys.", correct: false, rationale: "Recency isn't the deciding factor — the right mechanism depends on whether access needs to be scoped per individual user or under one fixed service identity." },
      { id: "d", label: "Neither is necessary if the ticketing API is only reachable from inside the company's network.", correct: false, rationale: "Network-level restriction is a separate control from authenticating the specific caller — an MCP server should still authenticate to the API it wraps regardless of network placement." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d2-q13",
    domainId: "tool-design-mcp",
    examConcept: "Credentials belong to the server's connection, not to the model",
    scenario:
      "A developer is worried that giving Claude a tool that calls an authenticated internal API means the model itself will need to know or handle the API credentials.",
    prompt: "Is this concern accurate?",
    options: [
      { id: "a", label: "Yes — the model must be given the raw API key directly in its context so it can authenticate each call itself.", correct: false, rationale: "This is exactly backwards, and a real security risk — putting a raw credential in the model's context exposes it unnecessarily and isn't how the architecture is meant to work." },
      { id: "b", label: "No — the model only invokes the tool by name with its defined input; the MCP server holds and uses the actual credential to make the authenticated call to the external system, out of the model's view.", correct: true, rationale: "This is the correct separation of concerns: the model reasons about when and how to call a tool using its schema, while the server is responsible for the authenticated connection to whatever it wraps." },
      { id: "c", label: "No, but only because Claude is incapable of reading any text that looks like a credential.", correct: false, rationale: "The real reason is architectural separation of responsibilities, not a claim about what the model can or can't read." },
      { id: "d", label: "Yes, but only for OAuth-based servers, not API-key-based ones.", correct: false, rationale: "The separation between model and credential holds regardless of which authentication mechanism the server uses underneath." },
    ],
    difficulty: "applied",
  },
  {
    id: "d2-q14",
    domainId: "tool-design-mcp",
    examConcept: "Structured errors vs. opaque thrown failures",
    scenario:
      "A tool's implementation currently just throws a generic exception with the message \"Error\" whenever the underlying API call fails, for any reason — invalid input, not found, rate limiting, or an outage.",
    prompt: "What should change about this tool's error handling?",
    options: [
      { id: "a", label: "Nothing — the model doesn't need to know why a tool call failed, only that it did.", correct: false, rationale: "Knowing only that a call failed, with no reason, leaves the model unable to decide whether to retry, correct its input, or tell the user something meaningful — that's the actual gap here." },
      { id: "b", label: "It should return a structured error result identifying what actually happened (e.g. invalid_input, not_found, rate_limited, unavailable) so the model can reason about the right next step instead of just seeing an opaque failure.", correct: true, rationale: "This is the actual fix: a typed, structured error the model can distinguish and act on, rather than one generic message that collapses every distinct failure mode into the same signal." },
      { id: "c", label: "It should retry the failed call internally up to 10 times before ever reporting anything to the model.", correct: false, rationale: "Retries can be reasonable for transient failures, but blindly retrying 10 times regardless of the error type (including permanent ones like invalid input) doesn't address the actual missing signal, and can waste time on failures that will never succeed." },
      { id: "d", label: "It should stop returning any result at all when a call fails, so the agent loop halts.", correct: false, rationale: "Halting the whole loop on any failure removes the chance for the model to recover gracefully — the point of a structured error is to keep the loop able to reason and continue where appropriate." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d2-q15",
    domainId: "tool-design-mcp",
    examConcept: "Error codes that support recovery, not just failure reporting",
    scenario:
      "A submit_expense tool returns a structured error of {isError: true, code: \"invalid_input\", message: \"amount must be a positive number\"} when called with a negative amount.",
    prompt: "Why is this a well-designed error response?",
    options: [
      { id: "a", label: "Because it uses the word 'error' in the field name.", correct: false, rationale: "The field naming itself isn't what makes this a good design — the substance of the error content is." },
      { id: "b", label: "Because it gives the model a specific, actionable reason (the amount field failed validation, and why) that lets it correct the input and retry, rather than a vague failure with no path forward.", correct: true, rationale: "This is exactly what a recoverable structured error looks like: specific enough to let the model take a sensible next action, in this case fixing the invalid field and retrying." },
      { id: "c", label: "Because it prevents the tool from ever being called again in the same session.", correct: false, rationale: "Nothing about this response should block future calls — the whole point is to let the model correct its input and try again." },
      { id: "d", label: "Because it hides the underlying reason from the model, keeping the message generic for security.", correct: false, rationale: "This response does the opposite — it's specific about what went wrong, which is what makes it useful, not something the design should hide." },
    ],
    difficulty: "applied",
  },
  {
    id: "d2-q16",
    domainId: "tool-design-mcp",
    examConcept: "Combining scoped tools, validated input, clear errors, and least-privilege auth into one safe design",
    scenario:
      "A reviewer is evaluating a proposed MCP integration for a company's internal HR system, meant to let an assistant answer employee questions about PTO balances and submit PTO requests.",
    prompt: "Which design would a reviewer most likely approve as a safe MCP integration?",
    options: [
      { id: "a", label: "One tool, hr_action, taking a free-text 'request' string, forwarded directly to an internal admin API using a company-wide admin credential, with failures surfaced as a generic \"failed\" string.", correct: false, rationale: "This combines nearly every anti-pattern at once: an unscoped freeform input, an overly broad admin-level credential, and an unstructured, non-actionable error — the opposite of a reviewer-approved design." },
      { id: "b", label: "Two narrowly scoped tools — get_pto_balance(employeeId) and submit_pto_request(employeeId, startDate, endDate, reason) — each with a validated, typed input schema, running under a service credential scoped only to PTO data, and returning structured errors for cases like invalid dates or an unknown employee ID.", correct: true, rationale: "This is the shape a reviewer would approve: each tool does one well-defined thing, inputs are validated and typed, the credential is scoped to only what these two actions need, and errors are structured enough for the model to recover from or escalate appropriately." },
      { id: "c", label: "A single tool that requires a human to manually approve every PTO balance lookup before the answer is returned.", correct: false, rationale: "Over-engineered for a read-only balance check — gating routine, non-sensitive lookups behind manual approval erodes the reason to automate the common case." },
      { id: "d", label: "Two tools identical to option B's shape, but using one shared admin-level credential with access to the entire HR system, for simplicity.", correct: false, rationale: "Tempting because the tool schemas themselves are fine, but pairing well-scoped tools with an overly broad credential still violates least privilege — the credential should be scoped no wider than what these two actions require." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d2-q17",
    domainId: "tool-design-mcp",
    examConcept: "MCP's purpose: standard protocol vs. bespoke per-app integration",
    scenario:
      "A developer says: \"We don't need MCP — we can just write direct API integration code inside each of our AI apps for each tool we want.\"",
    prompt: "What's the most accurate response to this claim?",
    options: [
      { id: "a", label: "They're right — MCP adds no capability that direct API calls inside an app can't already achieve for a single app.", correct: false, rationale: "For a single app talking to a single system, that's arguably true in isolation — but it ignores the actual value MCP provides once multiple apps or multiple systems are involved, which is the situation most real organizations are in." },
      { id: "b", label: "Direct integration code can work for a single app and a single system, but it means rebuilding and re-maintaining that same integration logic separately for every other app that wants the same capability — MCP's value is a standard interface that any compatible host can reuse rather than rebuild.", correct: true, rationale: "This gives the accurate, balanced answer: direct integration isn't wrong for one app in isolation, but MCP's actual benefit shows up as reuse across multiple apps and systems, which is the common real-world case." },
      { id: "c", label: "MCP is only useful for connecting to databases, not other kinds of systems.", correct: false, rationale: "MCP is general-purpose — it can expose tools, resources, and prompts for any external system a server chooses to wrap, not just databases." },
      { id: "d", label: "MCP eliminates the need to write any server-side code at all.", correct: false, rationale: "Someone still has to build the MCP server that wraps a given system — MCP standardizes the interface a host talks to, not the work of implementing that server." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d2-q18",
    domainId: "tool-design-mcp",
    examConcept: "Recognizing an overly broad tool from its schema in a concrete scenario",
    scenario:
      "A proposed tool named file_operation has this input schema: { operation: string, path: string, content?: string }, where 'operation' can be any of \"read\", \"write\", \"delete\", or \"list\", applied to any path on the server's filesystem.",
    prompt: "What's the concern with this tool as designed?",
    options: [
      { id: "a", label: "It has too few parameters to be useful.", correct: false, rationale: "Parameter count isn't the issue — the problem is the scope of what a single generic tool is allowed to do across an unrestricted set of paths and operations." },
      { id: "b", label: "It bundles read, write, delete, and list — including a destructive operation — into one generically-scoped tool with no path restriction, meaning a single tool call (from a model error or manipulated input) could delete or overwrite anything on the filesystem; splitting into narrower, path-restricted tools (or removing delete entirely if unneeded) would bound that risk.", correct: true, rationale: "This correctly diagnoses the actual risk — bundling a destructive capability with unrestricted scope into one tool — and points to the standard fix of narrowing scope per capability and per allowed path." },
      { id: "c", label: "The tool should be renamed to something more descriptive, which fully resolves the issue.", correct: false, rationale: "A clearer name doesn't reduce what the tool is actually capable of doing — the scope problem remains regardless of naming." },
      { id: "d", label: "There's no real concern as long as the tool's description mentions all four operations clearly.", correct: false, rationale: "A clear description helps the model use the tool correctly, but it doesn't shrink the blast radius of a single overly broad, unrestricted, destructive-capable tool." },
    ],
    difficulty: "applied",
  },
  {
    id: "d2-q19",
    domainId: "tool-design-mcp",
    examConcept: "Resources as application-controlled context vs. tools as model-invoked actions, in a concrete case",
    scenario:
      "A host application lets a user attach a specific project's design document to the conversation via a UI button, backed by an MCP resource exposed by that project's MCP server. Separately, the same server exposes a create_task tool.",
    prompt: "Which statement correctly distinguishes how these two get used?",
    options: [
      { id: "a", label: "The design document being attached is initiated by the user/host through the resource mechanism; creating a task is something the model itself decides to do mid-conversation by invoking the tool.", correct: true, rationale: "This matches the actual control split: resources are surfaced through an application-level mechanism such as explicit attachment, while a tool call is a decision the model makes during its own reasoning." },
      { id: "b", label: "Both are triggered identically by the model deciding it needs them.", correct: false, rationale: "This collapses the actual distinction — the design document's attachment is an application/user-level action, not something the model decides to invoke the way it invokes a tool." },
      { id: "c", label: "The create_task tool is read-only, since it only creates a record rather than modifying an existing one.", correct: false, rationale: "Creating a record is still a side-effecting action — 'read-only' would describe something like looking up an existing task, not creating a new one." },
      { id: "d", label: "Resources and tools are interchangeable in this scenario, so the button could just as easily invoke the tool.", correct: false, rationale: "They serve genuinely different purposes — attaching read-only context and invoking a side-effecting action are not interchangeable, even if both happen to be exposed by the same server." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d2-q20",
    domainId: "tool-design-mcp",
    examConcept: "Comprehensive: choosing the best overall safe MCP integration design",
    scenario:
      "A logistics company wants Claude, used from both an internal support console and an internal Slack bot, to answer questions using their shipment-tracking system and carrier-rates database, and to submit a shipment reroute request when a delivery is delayed.",
    prompt: "Which architecture best satisfies these requirements?",
    options: [
      { id: "a", label: "A single MCP server exposing one tool that accepts an arbitrary SQL string against both databases, shared by both host apps.", correct: false, rationale: "This repeats the broad, unscoped-tool anti-pattern — one tool with unrestricted query access to two databases has far more capability than any of the stated tasks actually require." },
      { id: "b", label: "One MCP server exposing narrowly scoped tools — get_shipment_status, get_carrier_rate, and request_reroute, each with a validated input schema and a service credential scoped only to what these three actions need — consumed as MCP clients by both the support console and the Slack bot.", correct: true, rationale: "This is the design that actually fits: each tool is scoped to one genuine action, inputs are validated, the credential is least-privilege, and building it once as an MCP server lets both separately-built host apps reuse it instead of duplicating integration work." },
      { id: "c", label: "Two entirely separate, hand-written integrations — one hardcoded into the support console, one hardcoded into the Slack bot — each calling the internal APIs directly without MCP.", correct: false, rationale: "Workable in isolation, but tempting-but-wrong given two apps need the same capability — this duplicates and separately maintains the same integration logic twice, which is precisely the redundancy MCP is meant to avoid." },
      { id: "d", label: "A single MCP server with one tool per host app (a support_console_actions tool and a slack_bot_actions tool), each branching internally on a generic 'action' string covering all three capabilities.", correct: false, rationale: "Even though this keeps the tool count low, bundling multiple distinct actions behind a generic action string per host abandons narrow, well-typed schemas and mixes read and side-effecting capabilities into one ambiguous tool each." },
    ],
    difficulty: "exam-style",
  },
];
