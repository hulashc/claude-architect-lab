import type { QuizQuestion } from "@/lib/content/schema";

/**
 * Domain 4 — Prompt Engineering & Structured Output. 20 original practice
 * questions, author-drafted by Claude at the project owner's direction and
 * pending a human review pass before being treated as final — see
 * content/README.md and CLAUDE.md's content authorship rule. None of these
 * are copied or derived from the real exam.
 */
export const domain4Questions: QuizQuestion[] = [
  {
    id: "d4-q01",
    domainId: "prompt-engineering-structured-output",
    examConcept: "System prompt carries durable role; user prompt carries per-request data",
    scenario:
      "A team builds a Claude-powered contract-review assistant. The system prompt says: \"You are a meticulous contract reviewer for Acme Corp; flag any clause that deviates from Acme's standard terms.\" The user prompt for each request contains the specific contract text and the specific policy version to check against.",
    prompt: "Which statement correctly describes this split?",
    options: [
      { id: "a", label: "The system prompt sets the durable role and general instruction that holds across every contract; the user prompt carries the per-request data (this contract, this policy version) that changes each time.", correct: true, rationale: "This is exactly the intended division: durable role/constraints in the system prompt, per-turn task and data in the user prompt." },
      { id: "b", label: "The system prompt should contain the specific contract text, since that's the most important information.", correct: false, rationale: "Putting per-request data in the system prompt defeats its reusability across contracts — that's precisely what the user prompt is for." },
      { id: "c", label: "There's no meaningful difference between a system prompt and a user prompt, so this split is arbitrary.", correct: false, rationale: "There is a real behavioral difference — the system prompt sets durable framing while the user prompt carries what varies turn to turn." },
      { id: "d", label: "The user prompt should restate the reviewer's role on every request, since the model otherwise forgets its role.", correct: false, rationale: "A well-set system prompt persists for the whole request without needing to be restated in the user prompt." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d4-q02",
    domainId: "prompt-engineering-structured-output",
    examConcept: "Per-request specifics belong in the user prompt, not baked into the system prompt",
    scenario:
      "An engineer sets the system prompt to: \"You are a summarizer. Summarize the following email into 3 bullet points, in a formal tone, no more than 50 words, addressed to a VP audience.\" Each API call then carries only the raw email text as the user prompt. The team now wants to reuse the same assistant for a different request that needs 5 bullets in a casual tone.",
    prompt: "What's the issue with this design?",
    options: [
      { id: "a", label: "The bullet count, tone, and audience are per-request specifics baked into the system prompt, so varying them means rewriting a prompt that should stay durable; they belong in the user prompt so they can change per call.", correct: true, rationale: "This names the actual trap: task-specific formatting requirements were placed in the system prompt instead of the user prompt, coupling them to something meant to be stable." },
      { id: "b", label: "Nothing is wrong — system prompts should carry all instructions for maximal reliability.", correct: false, rationale: "This is the misconception the question is testing; cramming per-request specifics into the system prompt is what causes the reuse problem." },
      { id: "c", label: "The email text should have been in the system prompt for consistency.", correct: false, rationale: "That's even more backwards — the email text is the clearest example of per-request data that belongs in the user prompt." },
      { id: "d", label: "The fix is to add a second Claude call whose only job is to adjust tone afterward.", correct: false, rationale: "Over-engineered — moving the tone/length/audience instructions into the user prompt solves this directly without a second call." },
    ],
    difficulty: "applied",
  },
  {
    id: "d4-q03",
    domainId: "prompt-engineering-structured-output",
    examConcept: "Durable constraints belong in the system prompt so they don't need restating",
    scenario:
      "A customer support bot's system prompt says: \"You are a support agent for Acme Cloud. Always be polite, never promise refunds without a policy lookup, and respond in the customer's language.\" Each user turn carries only the customer's current message and conversation history.",
    prompt: "Why is the refund-policy and tone requirement placed in the system prompt rather than repeated in every user message?",
    options: [
      { id: "a", label: "Because it's a durable constraint that must hold across every turn of the conversation, so putting it in the system prompt means it doesn't need to be restated or risk being dropped on any given turn.", correct: true, rationale: "This is the actual reason for the split: constraints that apply to every turn belong where they're set once and hold for the whole session." },
      { id: "b", label: "Because system prompts are inherently cheaper to process than user prompts.", correct: false, rationale: "Token cost isn't the reason for this particular placement decision — it's about which content is durable versus per-turn." },
      { id: "c", label: "Because the model ignores instructions placed in user prompts.", correct: false, rationale: "False — the model follows instructions in the user prompt too; the issue is only that per-turn repetition is unnecessary and fragile, not that user-prompt instructions are ignored." },
      { id: "d", label: "Because only the system prompt supports formatted text.", correct: false, rationale: "Both system and user prompts are plain text passed to the model; there's no such restriction." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d4-q04",
    domainId: "prompt-engineering-structured-output",
    examConcept: "Few-shot examples pin down edge-case handling better than prose alone",
    scenario:
      "A team wants Claude to classify support tickets into one of five categories, and to handle an easy-to-miss edge case (tickets that are actually spam) consistently. Describing the edge case in prose alone has produced inconsistent results.",
    prompt: "What's the most reliable fix, per few-shot prompting practice?",
    options: [
      { id: "a", label: "Add 2–3 concrete input/output examples that include the edge case classified correctly, so the model can pattern-match the desired behavior directly rather than infer it from a prose description.", correct: true, rationale: "This is exactly what few-shot examples are for: showing the exact edge-case handling wanted, which tends to be more reliable than describing it in prose." },
      { id: "b", label: "Increase the sampling temperature so the model considers more possibilities.", correct: false, rationale: "Higher temperature increases randomness in output, which works against consistent classification rather than improving it." },
      { id: "c", label: "Add another paragraph to the system prompt describing the edge case in even more detail.", correct: false, rationale: "Tempting — more prose seems like it should help — but the team already tried a prose description; concrete examples are the more reliable fix, not more prose." },
      { id: "d", label: "Remove the edge case from scope and always route spam tickets to a human.", correct: false, rationale: "Sidesteps the actual prompting question instead of answering it, and discards automation for a case that few-shot examples can likely handle." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d4-q05",
    domainId: "prompt-engineering-structured-output",
    examConcept: "Few-shot examples have diminishing returns past a small number",
    scenario:
      "A developer, trying to nail a tricky output format, adds 15 few-shot examples to every prompt call.",
    prompt: "What's the likely issue with this approach?",
    options: [
      { id: "a", label: "Beyond roughly 2–5 well-chosen examples that cover the format and key edge cases, additional examples mostly add token cost and latency without materially improving reliability.", correct: true, rationale: "Few, well-chosen examples covering the format and the edge cases that actually matter tend to outperform many redundant ones — more isn't automatically better." },
      { id: "b", label: "More examples always linearly improve reliability, so 15 is strictly better than 3.", correct: false, rationale: "This is the misconception being tested — returns diminish well before 15 examples for most tasks." },
      { id: "c", label: "Few-shot examples must be removed entirely before structured output is possible.", correct: false, rationale: "False — few-shot examples and structured output work together; they're not mutually exclusive." },
      { id: "d", label: "Few-shot examples only work when placed in the system prompt, never the user prompt.", correct: false, rationale: "False — examples are commonly placed in the user prompt or context alongside the task; there's no such restriction." },
    ],
    difficulty: "applied",
  },
  {
    id: "d4-q06",
    domainId: "prompt-engineering-structured-output",
    examConcept: "A concrete example demonstrates edge-case handling more reliably than repeated prose",
    scenario:
      "A data-extraction schema has a phone field. The team wants missing phone numbers represented as null, not an empty string or \"N/A\", and prose instructions describing this have been followed inconsistently.",
    prompt: "Which addition would most reliably fix this?",
    options: [
      { id: "a", label: "A few-shot example whose input has no phone number and whose output shows the phone field returned as null, demonstrating the exact edge-case handling wanted rather than describing it.", correct: true, rationale: "Showing the model exactly what the missing-value case should look like is more reliable than another prose restatement of the rule." },
      { id: "b", label: "A stricter system prompt sentence — \"Always use null, never empty string\" — repeated three times.", correct: false, rationale: "Tempting, since it sounds firmer, but repeating the same prose instruction doesn't have the same reliability edge as a concrete worked example." },
      { id: "c", label: "Increasing max_tokens so the model has more room to write a complete answer.", correct: false, rationale: "Unrelated to the actual problem — inconsistent null vs. empty-string handling isn't a token-budget issue." },
      { id: "d", label: "Changing the phone field's type from string to an unconstrained free-form text field.", correct: false, rationale: "Removes the structure that would help catch the problem, making the inconsistency harder to detect, not easier." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d4-q07",
    domainId: "prompt-engineering-structured-output",
    examConcept: "XML-style tags let the model distinguish distinct prompt sections",
    scenario: "A team is deciding whether to wrap a prompt's instructions, examples, and input document in tags.",
    prompt: "What is the main benefit of wrapping a prompt's instructions, examples, and input document in tags like <instructions>, <examples>, and <document>?",
    options: [
      { id: "a", label: "It lets the model reliably distinguish which text is an instruction, which is an example, and which is the actual data to act on — especially valuable when the prompt is long or mixes several kinds of content.", correct: true, rationale: "This is exactly what XML-style structuring buys: clear section boundaries the model can rely on instead of inferring from prose flow alone." },
      { id: "b", label: "It reduces the number of tokens the prompt consumes.", correct: false, rationale: "The opposite — tags add tokens; the benefit is clarity of structure, not compression." },
      { id: "c", label: "It's required syntax the API rejects requests without.", correct: false, rationale: "False — the API accepts plain-text prompts with no tags at all; tagging is a prompting technique, not an API requirement." },
      { id: "d", label: "It automatically converts the prompt into a tool call.", correct: false, rationale: "Unrelated — tool use is configured separately via the tools parameter, not triggered by XML-style tags in prompt text." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d4-q08",
    domainId: "prompt-engineering-structured-output",
    examConcept: "Long, mixed-content prompts need explicit section boundaries",
    scenario:
      "A prompt for a legal document analyzer includes general reviewing instructions, three example analyses, a 40-page contract, and specific questions about that contract — all concatenated as one plain paragraph with no separators.",
    prompt: "What is the most likely failure mode, and the best fix?",
    options: [
      { id: "a", label: "The model may confuse where instructions end, examples end, and the actual target contract begins — especially since the contract itself may contain clause language that reads like an instruction; wrap each section in explicit tags such as <instructions>, <examples>, <document>, and <question>.", correct: true, rationale: "This names the real risk of unstructured mixed content and the standard fix: explicit tags so each section is unambiguous regardless of what the contract text itself says." },
      { id: "b", label: "The failure mode is a token limit being exceeded, fixed by removing all the examples.", correct: false, rationale: "Tempting, but nothing here indicates a token-limit failure, and removing examples risks hurting reliability rather than fixing the structural confusion described." },
      { id: "c", label: "The failure mode is the model refusing to answer for policy reasons, fixed by adding more explicit permission language.", correct: false, rationale: "Unrelated — there's no indication of a refusal in this scenario." },
      { id: "d", label: "The failure mode is API rate limiting, fixed by shortening the contract.", correct: false, rationale: "Unrelated to the structural ambiguity problem described; rate limiting is a separate operational concern." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d4-q09",
    domainId: "prompt-engineering-structured-output",
    examConcept: "Free-form prose output is fragile to parse compared to schema-driven output",
    scenario:
      "A team currently asks Claude to answer with a paragraph of prose describing extracted fields, then writes a regex-based parser to pull the fields back out of that prose.",
    prompt: "What's the main risk of this design?",
    options: [
      { id: "a", label: "Free-form prose output has no guaranteed structure, so the downstream regex parser is fragile to any phrasing variation in the model's response; schema-driven or tool-based structured output removes that parsing risk at the source.", correct: true, rationale: "This is the core risk with parsing prose after the fact — the model isn't constrained to a fixed shape, so the parser breaks on any wording drift." },
      { id: "b", label: "Prose output is always slower to generate than JSON.", correct: false, rationale: "Not a reliable general claim, and not the actual risk being tested — the risk is structural fragility, not generation speed." },
      { id: "c", label: "Prose output cannot contain numeric values.", correct: false, rationale: "False — prose can contain numbers; the issue is the surrounding structure isn't guaranteed, not that numbers are impossible to include." },
      { id: "d", label: "There is no risk — parsing prose with regex is the most reliable approach for structured-data use cases.", correct: false, rationale: "Contradicts standard practice; regex-parsed prose is exactly the fragile pattern schema-driven output is meant to replace." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d4-q10",
    domainId: "prompt-engineering-structured-output",
    examConcept: "Forcing a tool call constrains the output mechanism itself, unlike prose requests",
    scenario:
      "Two engineers debate how to get reliable JSON out of Claude for a downstream system integration. Engineer A says: \"Just tell it in the prompt — respond only with valid JSON matching this schema.\" Engineer B says: \"Force a tool call whose input schema is the desired output shape.\"",
    prompt: "Which approach is more reliable, and why?",
    options: [
      { id: "a", label: "Engineer B's approach — forcing a tool call constrains the response mechanism itself to the schema, whereas asking for JSON in prose alone still allows stray text or schema deviations that have to be caught after the fact.", correct: true, rationale: "This is the actual reliability distinction the exam probes: tool-use forcing constrains the output structurally, prose requests only ask nicely." },
      { id: "b", label: "Engineer A's approach, because forced tool calls always add unacceptable latency.", correct: false, rationale: "Latency isn't the deciding factor here, and the premise (that forced tool calls are unacceptably slower) isn't established — the reliability difference is what matters." },
      { id: "c", label: "Both approaches are equally reliable since both eventually produce a JSON string.", correct: false, rationale: "Downplays a real and well-documented reliability gap between structurally-constrained and prose-requested output." },
      { id: "d", label: "Neither works — the only reliable way to get structured output is to fine-tune a custom model.", correct: false, rationale: "Over-engineered and inaccurate — tool-use forcing is a standard, effective mechanism for structured output without any fine-tuning." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d4-q11",
    domainId: "prompt-engineering-structured-output",
    examConcept: "Schema field descriptions, not just types, drive correct model output",
    scenario:
      "A schema field is defined simply as a string type with no further description, and the model has been returning dates in several inconsistent formats.",
    prompt: "What's the best fix?",
    options: [
      { id: "a", label: "Add a description to the schema field specifying the exact expected format, e.g. \"ISO 8601, e.g. 2026-03-14\" — the schema's field descriptions are what the model uses to fill in a value correctly, not just the declared type.", correct: true, rationale: "A bare type gives the model no signal about the expected format; a precise description closes that gap directly at the source of the ambiguity." },
      { id: "b", label: "Change the field's type from string to number, since numbers are more precise.", correct: false, rationale: "Doesn't fix the underlying format ambiguity, and dates aren't naturally represented as a single number without a defined encoding." },
      { id: "c", label: "Remove the field, since dates are inherently unstructured and can't be schema-constrained.", correct: false, rationale: "False — dates can absolutely be constrained via a clear format description; removing the field discards a solvable problem." },
      { id: "d", label: "Add an entirely separate Claude call whose only job is to reformat the date afterward.", correct: false, rationale: "Over-engineered relative to simply describing the expected format at the schema layer where the model already reads field descriptions." },
    ],
    difficulty: "applied",
  },
  {
    id: "d4-q12",
    domainId: "prompt-engineering-structured-output",
    examConcept: "Tool descriptions and parameter names directly affect tool-call accuracy",
    scenario: "A tool named lookup with no description and parameters named a and b is provided to Claude.",
    prompt: "What's the likely consequence?",
    options: [
      { id: "a", label: "With no description and unclear parameter names, Claude has little basis for knowing when to call the tool or what values to put in a and b, increasing the odds of wrong tool selection or malformed arguments.", correct: true, rationale: "Tool-use prompting relies on the tool's name, description, and parameter descriptions to guide correct calls; stripping all of that away removes the model's main signal." },
      { id: "b", label: "None — Claude infers a tool's purpose entirely from its name string, with perfect accuracy, regardless of naming quality.", correct: false, rationale: "False — vague or generic names like \"lookup\" give the model very little to work with, especially alongside meaningless parameter names." },
      { id: "c", label: "The tool will simply never be called.", correct: false, rationale: "Not necessarily true — the model may still call it, just incorrectly or with poorly-formed arguments, rather than never calling it at all." },
      { id: "d", label: "The API will reject the tool definition as invalid.", correct: false, rationale: "A missing description doesn't make a tool schema invalid — it makes it unreliable, which is a different problem." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d4-q13",
    domainId: "prompt-engineering-structured-output",
    examConcept: "Constraining tool parameters with enums reduces hallucinated argument values",
    scenario:
      "A create_ticket tool has a priority parameter typed as a plain string with no enum or description. In production, Claude has supplied values like \"urgent!!\", \"P1\", and \"high priority\" inconsistently.",
    prompt: "What's the best fix?",
    options: [
      { id: "a", label: "Constrain priority to an explicit enum of allowed values (e.g. low, medium, high, urgent) with a short description of what each means, so the model can only select from well-formed options instead of inventing free-text variants.", correct: true, rationale: "This directly addresses the root cause — an unconstrained string parameter — by narrowing the model's choices to a fixed, well-formed set." },
      { id: "b", label: "Remove the parameter entirely and always default priority server-side.", correct: false, rationale: "Workable, but it discards the model's ability to set priority based on genuine judgment about the ticket's content, which an enum constraint preserves without the inconsistency." },
      { id: "c", label: "Add a second Claude call whose only job is to normalize the priority string afterward.", correct: false, rationale: "Over-engineered relative to fixing the schema itself, which prevents the inconsistent values from being produced in the first place." },
      { id: "d", label: "Increase max_tokens so the model has room to write a longer, clearer priority value.", correct: false, rationale: "Unrelated — token budget doesn't drive value consistency; the problem is the lack of a constrained value set, not insufficient output length." },
    ],
    difficulty: "applied",
  },
  {
    id: "d4-q14",
    domainId: "prompt-engineering-structured-output",
    examConcept: "Distinct, specific tool descriptions prevent confusable tool selection",
    scenario:
      "An agent has both search_orders (looks up an existing order by ID) and search_order_history (looks up a customer's past orders by customer ID) — both described only as \"Search orders.\" The agent frequently calls the wrong one.",
    prompt: "What's the most likely cause, and best fix?",
    options: [
      { id: "a", label: "The two tools have near-identical, uninformative descriptions, so the model can't reliably tell them apart; write distinct, specific descriptions clarifying what each tool looks up and by what identifier.", correct: true, rationale: "Identical vague descriptions on two tools with different purposes is exactly the setup that causes confusable tool selection — specific descriptions are the direct fix." },
      { id: "b", label: "The cause is that the model was given too many tools overall, and the fix is to remove one of them regardless of whether both are needed.", correct: false, rationale: "Assumes a fix without checking whether both tools are actually needed — the stated problem is description quality, not tool count." },
      { id: "c", label: "The cause is a bug in the API's tool-routing logic that can't be fixed from the prompt side.", correct: false, rationale: "False — description quality is exactly a prompt-engineering lever available to fix this, not an API bug." },
      { id: "d", label: "The cause is that the tools' parameter names are too short, and the fix is to lengthen only the parameter names.", correct: false, rationale: "Misidentifies the problem — the scenario describes identical tool descriptions, not parameter naming, as the point of confusion." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d4-q15",
    domainId: "prompt-engineering-structured-output",
    examConcept: "A retry should feed the validation error back, not repeat an identical request",
    scenario:
      "A team validates Claude's structured output against a Zod schema after each call. On the first failure they observe, they simply retry the exact same request unchanged, expecting a different outcome.",
    prompt: "What's missing from this retry strategy?",
    options: [
      { id: "a", label: "The retry should feed the specific validation error back to the model, so it has a concrete signal about what was wrong, rather than repeating an identical request and hoping for a different result.", correct: true, rationale: "This is the core of a real validation/retry loop — the model needs the actual failure reason to correct course, not just another identical attempt." },
      { id: "b", label: "Nothing — an identical retry with no new information is the standard, most effective approach.", correct: false, rationale: "Contradicts the premise — an unchanged retry has no new signal for the model to act on and is unlikely to reliably fix the failure." },
      { id: "c", label: "The fix is to increase the model's sampling temperature on retry so it produces more varied output.", correct: false, rationale: "Higher temperature increases randomness generally, but doesn't target the specific validation failure the way feeding back the actual error does." },
      { id: "d", label: "The fix is to abandon schema validation entirely rather than retry.", correct: false, rationale: "Discards the reliability benefit validation exists for, instead of fixing the retry loop that's actually broken." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d4-q16",
    domainId: "prompt-engineering-structured-output",
    examConcept: "Retry loops need a bound and a fallback, not indefinite retries",
    scenario: "An extraction pipeline retries a failed schema validation indefinitely until it eventually passes.",
    prompt: "What's the risk, and the fix?",
    options: [
      { id: "a", label: "An unbounded retry loop can run forever on a document the model genuinely cannot extract correctly, burning cost and latency with no escape; add a maximum retry count and a defined fallback, such as escalating to a human, once it's exceeded.", correct: true, rationale: "This names both the real risk (no bound) and the correct fix (a cap plus a fallback path) — mirroring the same stopping-condition discipline agent loops need." },
      { id: "b", label: "There's no risk, since validation retries always eventually succeed.", correct: false, rationale: "False — some inputs are genuinely unrecoverable (illegible, missing data), so there's no guarantee of eventual success." },
      { id: "c", label: "The fix is to remove validation and accept whatever the model returns rather than retrying.", correct: false, rationale: "Removes the safety benefit validation exists for instead of fixing the missing bound on the retry loop." },
      { id: "d", label: "The fix is to switch to a larger model only, without adding any retry cap.", correct: false, rationale: "Doesn't address the actual missing bound, and a larger model still offers no guarantee of always passing validation." },
    ],
    difficulty: "applied",
  },
  {
    id: "d4-q17",
    domainId: "prompt-engineering-structured-output",
    examConcept: "Schema-constrained output plus bounded validation and retry is the reliable combination",
    scenario:
      "A team needs Claude to extract structured shipping details (recipient, address, weight) from freeform customer emails and feed them directly into a shipping API with no human review. Some emails are ambiguous or missing fields entirely.",
    prompt: "Which strategy best fits these requirements?",
    options: [
      { id: "a", label: "Force a schema-constrained tool call for the shipping fields, validate the result including checking for missing required fields, and on either a schema failure or a genuinely ambiguous/missing case, retry with the error fed back or escalate to a human rather than passing incomplete data to the shipping API.", correct: true, rationale: "This combines every piece the domain covers correctly: forced structured output, validation beyond just shape, a bounded retry, and a human fallback for genuinely unrecoverable cases." },
      { id: "b", label: "Ask Claude to describe the shipping details in prose, then have a person copy them into the shipping API by hand every time.", correct: false, rationale: "Workable in the loosest sense, but it defeats the point of automating extraction and doesn't scale — it also ignores the structured-output requirement entirely." },
      { id: "c", label: "Force the schema-constrained tool call, but skip validation and pass whatever comes back straight to the shipping API, since the schema already constrains the shape.", correct: false, rationale: "Tempting-but-wrong — schema-constrained output guarantees shape (e.g. that a field is a string) but not semantic correctness (an empty string still satisfies \"string\"), so validation is still required." },
      { id: "d", label: "Build a fully deterministic regex-based parser for the emails, since it's the fastest and cheapest option.", correct: false, rationale: "The emails are described as freeform and ambiguous — exactly the kind of judgment call a fixed rule table can't fully anticipate, mirroring the deterministic-workflow trap from Domain 1." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d4-q18",
    domainId: "prompt-engineering-structured-output",
    examConcept: "Fixed, checkable rules belong in deterministic code, not another model call",
    scenario:
      "A structured-output pipeline extracts a total dollar amount and a list of line items from an invoice via Claude.",
    prompt: "Where should the check \"do the line item amounts sum to the total\" be implemented?",
    options: [
      { id: "a", label: "As a deterministic code check after extraction — it's a fixed, checkable arithmetic rule with no judgment involved, so it belongs in code, not something re-asked of the model.", correct: true, rationale: "Arithmetic verification is exactly the kind of fixed, checkable rule that should be handled in code, reserving the model for genuine judgment calls." },
      { id: "b", label: "As a second Claude call asking it to double-check its own math.", correct: false, rationale: "Tempting, but unnecessary and less reliable than a deterministic check — arithmetic doesn't require model judgment, and self-verification isn't as trustworthy as a fixed rule." },
      { id: "c", label: "It shouldn't be checked at all, since schema-constrained output guarantees correct arithmetic.", correct: false, rationale: "False — a schema constrains the shape and type of the output, not whether the numbers are internally consistent." },
      { id: "d", label: "As a few-shot example demonstrating correct addition.", correct: false, rationale: "Few-shot examples teach format and style, not a substitute for an actual deterministic arithmetic check." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d4-q19",
    domainId: "prompt-engineering-structured-output",
    examConcept: "Genuine judgment calls belong with the model, not a fixed rule",
    scenario:
      "An extraction pipeline for scanned invoices needs to identify which of several company names printed on a document is the vendor, as opposed to the bill-to company — a distinction that different documents represent inconsistently across letterhead, header labels, and positioning.",
    prompt: "Where should this determination be made?",
    options: [
      { id: "a", label: "By the model — distinguishing vendor from bill-to across inconsistent, ambiguous document layouts is exactly the kind of judgment call that can't be reduced to a fixed rule table; the model's reasoning should be captured through the schema-constrained extraction itself.", correct: true, rationale: "This mirrors the agent-vs-workflow distinction at the output level: genuine ambiguity that varies unpredictably across inputs is reserved for the model, not hardcoded." },
      { id: "b", label: "By a fixed rule: always treat the first company name mentioned in the document as the vendor.", correct: false, rationale: "Tempting-but-wrong — since the scenario states layouts vary inconsistently, a fixed positional rule will misfire regularly precisely because the premise says representation isn't consistent." },
      { id: "c", label: "By requiring a human to review every single document before any extraction happens.", correct: false, rationale: "Over-engineered — this defeats the purpose of an automated extraction pipeline for a distinction a well-prompted model with examples can usually resolve." },
      { id: "d", label: "By adding a second Claude call that randomly picks between the two candidates.", correct: false, rationale: "Discards the available document signal entirely instead of using it, which is not a reasoned approach to the ambiguity." },
    ],
    difficulty: "applied",
  },
  {
    id: "d4-q20",
    domainId: "prompt-engineering-structured-output",
    examConcept: "Combining prompt structure, schema-constrained output, and bounded validation/retry",
    scenario:
      "A team is designing an extraction pipeline for messy vendor invoices (scans, emails, PDFs) that must feed a downstream accounting system with zero tolerance for malformed records. They propose: a system prompt describing the assistant's durable role as an invoice-extraction specialist; a user prompt per document wrapping the document text in <document> tags alongside 3 few-shot examples of correctly extracted invoices, including one edge case; a forced tool call with a defined schema for the extracted fields; Zod validation of the tool call's input; and, on validation failure, feeding the specific error back to the model and retrying up to 3 times before escalating to a human queue.",
    prompt: "Evaluate this design against the concepts in this domain.",
    options: [
      { id: "a", label: "This design correctly separates durable role from per-request data, uses few-shot examples including an edge case to reinforce format and edge-case handling, forces schema-constrained output via tool-use rather than trusting prose, and closes the loop with validation, a bounded retry, and a human escalation path.", correct: true, rationale: "This design applies every concept in this domain correctly and in the right place — it's the complete, well-bounded version of the pattern this lesson builds toward." },
      { id: "b", label: "This design is over-engineered — a single prose instruction to \"output valid JSON\" would have been just as reliable and required far less implementation work.", correct: false, rationale: "This is the exam trap: prose-only structured-output requests are materially less reliable than schema-constrained tool-use output, so the extra structure here is the correct level of rigor for a zero-tolerance downstream system, not excess." },
      { id: "c", label: "The design is flawed because it validates the model's output at all — schema-constrained output via tool-use already guarantees valid records, making the Zod validation step redundant.", correct: false, rationale: "False — schema-constrained output constrains shape and type, not full semantic validity (an empty string still satisfies a \"string\" field), so validation remains necessary." },
      { id: "d", label: "The design is flawed because it uses a retry loop capped at 3 attempts instead of retrying indefinitely until validation passes.", correct: false, rationale: "False — an uncapped retry risks looping forever on a genuinely unrecoverable document; a bounded retry with human escalation is the correct pattern, not a flaw." },
    ],
    difficulty: "exam-style",
  },
];
