import type { Lesson } from "@/lib/content/schema";
import { domain4Questions } from "@content/quizzes/domain-4";

/**
 * Domain 4 — Prompt Engineering & Structured Output (20% of the exam).
 * Author-drafted by Claude at the project owner's direction, pending a
 * human review pass before being treated as final — same convention as
 * Domain 1 (see content/README.md and CLAUDE.md's content authorship rule).
 * Follows the block template Domain 1 established: concept → terms →
 * diagram → concept → concept → code → concept×2 (mode-paired) → scenario →
 * concept → diagram → concept → exam trap → mini lab.
 */
export const domain4Lesson: Lesson = {
  domainId: "prompt-engineering-structured-output",
  title: "Prompt Engineering & Structured Output",
  summary:
    "How to split a prompt so the model reliably does what you mean, how to force its output into a shape your code can trust, and where to draw the line between what the model should decide and what a deterministic check should catch.",
  practiceQuestionIds: domain4Questions.map((q) => q.id),
  blocks: [
    {
      type: "concept",
      title: "System prompt vs. user prompt",
      mode: "both",
      body: `A system prompt sets the durable role, constraints, and context that hold for every turn of a conversation: who the model is acting as, what it must never do, what background it can always assume. A user prompt carries the specific task for *this* turn — the actual question, the actual document, the actual data that changes from one call to the next.

The trap runs in both directions. Bake per-request specifics ("summarize this into exactly 3 bullets for a VP audience") into the system prompt, and every variation on that request — 5 bullets, a different audience — means rewriting something that was supposed to stay stable. Push durable constraints ("never promise a refund without a policy lookup") into the user prompt instead, and you have to remember to restate them on every single call, with every omission a real risk of the constraint silently not applying.

The test isn't "is this instruction important" — a refund policy and a bullet count are both important. The test is whether the instruction holds across every request (system prompt) or is specific to this one (user prompt).`,
    },
    {
      type: "terms",
      title: "Key terms for this domain",
      mode: "both",
      terms: [
        {
          term: "System prompt",
          definition:
            "Sets the durable role, constraints, and context that hold for every turn — not a place for one-off, per-request instructions that change from call to call.",
        },
        {
          term: "User prompt",
          definition:
            "Carries the specific task for this turn, including any per-request data, instructions, or context that varies between calls, unlike the system prompt.",
        },
        {
          term: "Few-shot example",
          definition:
            "A concrete input/output pair embedded in the prompt to demonstrate the desired format, tone, or edge-case handling, instead of relying on a prose description alone.",
        },
        {
          term: "Structured output",
          definition:
            "A response constrained to a specific data shape, such as fields matching a schema, rather than free-form prose that has to be parsed back out afterward.",
        },
        {
          term: "Schema-constrained output",
          definition:
            "Structured output produced by forcing the model to fill in a fixed schema, most reliably via tool-use, so the response cannot deviate from the defined fields and types.",
        },
        {
          term: "Tool-use prompting",
          definition:
            "Writing tool names, descriptions, and parameter descriptions precisely enough that the model selects the right tool and supplies well-formed arguments without guessing.",
        },
        {
          term: "Validation and retry loop",
          definition:
            "Checking a model's structured output against a schema after the call, and on failure, feeding the specific validation error back and requesting another attempt rather than accepting or silently repairing bad output.",
        },
      ],
    },
    {
      type: "diagram",
      title: "Anatomy of a schema-constrained prompt",
      mode: "both",
      caption:
        "Each layer has one job. Mixing a layer's content into the wrong one — task specifics in the system prompt, the output shape only described in prose — is where most of this domain's mistakes happen.",
      ascii: `┌──────────────────────────────────────────────┐
│ SYSTEM PROMPT                                  │
│ Durable role, constraints, context — true for   │
│ every turn, not just this one.                   │
└──────────────────────┬───────────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ USER PROMPT                                     │
│  <instructions>  this turn's actual task          │
│  <examples>      2-3 input/output pairs           │
│  <document>      the messy input data              │
└──────────────────────┬───────────────────────────┘
                        ▼
┌──────────────────────────────────────────────┐
│ STRUCTURED OUTPUT REQUEST                        │
│ tool_choice forces a call to the "extract" tool;   │
│ its input_schema *is* the desired output shape —    │
│ not a side effect of an unrelated tool call.         │
└──────────────────────────────────────────────┘`,
    },
    {
      type: "concept",
      title: "Few-shot examples",
      mode: "both",
      body: `Showing the model 2-3 concrete input/output examples pins down format, tone, and edge-case handling more reliably than describing the same thing in prose. Prose is ambiguous by nature — "use null for missing values" can still be read several ways — while a worked example that shows a missing value rendered as \`null\` leaves little room to reinterpret.

Examples earn their keep fastest on the cases prose tends to under-specify: the empty-input case, the ambiguous case, the format detail (date format, casing, how to represent "unknown"). Past roughly 3-5 well-chosen examples, more mostly adds tokens and latency without a proportional reliability gain — the goal is coverage of the tricky cases, not volume.`,
    },
    {
      type: "concept",
      title: "XML-style structure",
      mode: "both",
      body: `Wrapping distinct prompt sections — instructions, background context, few-shot examples, the actual input data — in tags like \`<instructions>\` and \`<document>\` gives the model an explicit boundary between "what to do" and "what to act on." This matters most exactly when it's easy to underestimate: long prompts, or prompts that mix several kinds of content in one block.

A 40-page contract concatenated into the same paragraph as your reviewing instructions is a realistic failure case — the contract's own clause language can read like an instruction if there's no boundary marking where the document starts and stops. Tags don't need to follow any particular schema; the model reads them as structural signal, not as markup it validates. The gain is proportional to how mixed and how long the prompt is — a short, single-purpose prompt doesn't need it as much as a prompt combining instructions, examples, and a large document.`,
    },
    {
      type: "code",
      title: "Schema-constrained extraction with validation and retry",
      language: "typescript",
      mode: "both",
      caption:
        "Simplified for teaching. The tool exists purely to force a structured response — the model never actually looks anything up. tool_choice forces the call every attempt; is_error on the tool_result is what tells the model this attempt failed and needs correcting.",
      code: `import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const anthropic = new Anthropic();
const MAX_ATTEMPTS = 3;

// The schema IS the desired output shape. "record_invoice_fields" is not a
// real lookup — it's the mechanism used to force a structured response.
const InvoiceFields = z.object({
  vendorName: z.string(),
  invoiceDate: z.string(), // validated further below, not just "is a string"
  totalCents: z.number().int(),
  lineItems: z.array(
    z.object({ description: z.string(), amountCents: z.number().int() }),
  ),
});

const extractTool: Anthropic.Tool = {
  name: "record_invoice_fields",
  description:
    "Record the invoice fields extracted from the document. Call this exactly once with your best extraction.",
  input_schema: {
    type: "object",
    properties: {
      vendorName: {
        type: "string",
        description: "Legal or trade name on the invoice letterhead.",
      },
      invoiceDate: {
        type: "string",
        description: "ISO 8601 date, e.g. 2026-03-14.",
      },
      totalCents: {
        type: "integer",
        description: "Total due, in cents, as printed on the invoice.",
      },
      lineItems: {
        type: "array",
        items: {
          type: "object",
          properties: {
            description: { type: "string" },
            amountCents: { type: "integer" },
          },
          required: ["description", "amountCents"],
        },
      },
    },
    required: ["vendorName", "invoiceDate", "totalCents", "lineItems"],
  },
};

async function extractInvoiceFields(documentText: string) {
  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: \`<instructions>Extract the invoice fields using the record_invoice_fields tool.</instructions>\\n<document>\${documentText}</document>\`,
    },
  ];

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      tools: [extractTool],
      tool_choice: { type: "tool", name: "record_invoice_fields" },
      messages,
    });

    messages.push({ role: "assistant", content: response.content });

    const toolUse = response.content.find((b) => b.type === "tool_use");
    if (!toolUse) {
      throw new Error("Forced tool_choice but no tool_use block returned");
    }

    const parsed = InvoiceFields.safeParse(toolUse.input);
    if (parsed.success) {
      return parsed.data; // validated — safe to hand to the accounting system
    }

    // Feed the specific validation failure back, rather than silently
    // coercing bad data or giving up after one bad response.
    messages.push({
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: toolUse.id,
          is_error: true,
          content: \`Validation failed: \${parsed.error.message}. Call record_invoice_fields again with corrected values.\`,
        },
      ],
    });
  }

  // Safety bound — same shape as an agent loop's MAX_TURNS. Hitting this
  // means the document needs a human, not that the retry count is wrong.
  throw new Error("Exceeded MAX_ATTEMPTS without a schema-valid extraction");
}`,
    },
    {
      type: "concept",
      title: "What the exam is actually testing here",
      mode: "certification",
      body: `The exam won't ask you to define "few-shot example." It gives you a messy extraction or generation requirement and several plausible prompt/output designs, and tests whether you can:

- Spot per-request specifics stranded in a system prompt, or durable constraints stranded in a user prompt.
- Recognize when a prose "please respond in JSON" request is the weaker choice next to schema-constrained (tool-use) output — not because prose never works, but because it doesn't constrain the response the way a forced tool call does.
- Notice a validation step that's missing entirely, or a retry loop with no bound and no fallback.
- Reject over-engineering — a second Claude call to fix what a clearer schema description or a deterministic check would have handled directly.

The scenario below is built in exactly that shape — work through it before checking the answer.`,
    },
    {
      type: "concept",
      title: "Building this for real",
      mode: "architect",
      body: `In production, this domain shows up as concrete decisions: what fields actually go in \`input_schema\` versus what's left to a deterministic check afterward, whether \`tool_choice\` is forced or left to the model to decide whether a tool call happens at all, how many retry attempts you budget before escalating, and what the escalation path actually is — a human queue, a null/partial record, a hard failure.

The deterministic checks are easy to skip because schema-constrained output already feels safe — it isn't. A schema guarantees a field is a string or an integer; it says nothing about whether the string is well-formed or the integer is the right one. Totals that don't sum, dates that parse but are impossible, IDs that don't match any known record — none of that is caught by validating shape alone. Domain 5 (Context Management & Reliability) covers the broader reliability picture; the practical takeaway here is narrower: **schema validation catches shape errors, not correctness errors — write both.**`,
    },
    {
      type: "scenario",
      title: "Scenario: extracting fields from messy documents",
      mode: "both",
      intro:
        "A team needs Claude to extract structured fields (vendor, date, line items, total) from invoices that arrive as scans, forwarded emails, and PDFs with no consistent layout, feeding a downstream accounting system that cannot accept malformed records. Which approach fits?",
      question: {
        id: "d4-lesson-scenario-extraction",
        domainId: "prompt-engineering-structured-output",
        examConcept: "Schema-constrained output + validation/retry vs. prose, deterministic parsing, and multi-agent",
        scenario:
          "Requirements: extract vendor, date, line items, and total from inconsistently formatted invoices, feeding a downstream system with zero tolerance for malformed records.",
        prompt: "Which architecture should you choose?",
        options: [
          {
            id: "a",
            label:
              "Ask Claude in prose to \"output the extracted fields as JSON\" with no defined schema, and no validation of the response before it's forwarded downstream.",
            correct: false,
            rationale:
              "Asking nicely in prose doesn't constrain the response mechanism — stray text, missing fields, or malformed JSON can still slip through, and with no validation step there's nothing catching it before it reaches a system with zero tolerance for bad records.",
          },
          {
            id: "b",
            label:
              "A deterministic regex/string parser applied directly to the raw document text, with no model call at all.",
            correct: false,
            rationale:
              "Tempting — it's fully predictable and cheap when it works — but the documents are described as inconsistently formatted scans and forwarded emails, exactly the kind of layout variation a fixed pattern can't fully anticipate in advance, unlike a genuinely fixed-format CSV.",
          },
          {
            id: "c",
            label:
              "A forced tool call whose input schema defines the exact fields needed, its result validated against a matching schema, retrying with the validation error fed back on failure up to a bounded attempt count before escalating to a human.",
            correct: true,
            rationale:
              "This is the complete, correctly-bounded pattern: the output mechanism itself is constrained (tool-use), the result is checked rather than trusted, failures get a real corrective signal instead of a blind retry, and there's a defined exit for documents that genuinely can't be extracted.",
          },
          {
            id: "d",
            label:
              "Four separate agents, one per field (vendor, date, line items, total), each independently reading the whole document and returning its one field, coordinated by a supervisor agent that assembles the result.",
            correct: false,
            rationale:
              "Over-engineered — the fields aren't independent subtasks; they come from the same document and the same read, so splitting them across four agents adds coordination overhead and four redundant full-document reads without a genuine decomposition to justify it.",
          },
        ],
        difficulty: "exam-style",
      },
    },
    {
      type: "concept",
      title: "Tool-use prompting",
      mode: "both",
      body: `When a tool call is itself the output mechanism, the tool's name, description, and each parameter's description are what the model uses to decide whether to call it and how to fill in the arguments — not just the parameter's declared type. A parameter typed as a bare string with no description invites inconsistent, half-formed values; a description that states the exact expected format, or an enum that lists the only legal values, removes the guesswork.

The same logic applies across multiple tools: two tools with near-identical, generic descriptions ("search orders") give the model nothing to distinguish them by, and it will pick the wrong one on a normal basis. Specific, differentiated descriptions — what this tool looks up, by what identifier — are what make tool selection reliable at all.`,
    },
    {
      type: "diagram",
      title: "Validate, retry, and bound the loop",
      mode: "both",
      caption:
        "The loop from the code block above, drawn out. Schema validation only catches shape errors — a real pipeline layers a deterministic correctness check (does the arithmetic add up?) after this loop succeeds, not instead of it.",
      ascii: `        ┌──────────────────────────────┐
   ┌───▶│ 1. Call model; tool_choice      │
   │    │    forces the extract tool       │
   │    └──────────────┬───────────────┘
   │                     ▼
   │          ┌─────────────────────┐
   │          │ 2. Parse the tool_use  │
   │          │    block's input         │
   │          └──────────┬──────────┘
   │                       ▼
   │          ┌─────────────────────┐
   │          │ 3. Validate with Zod    │
   │          └───┬─────────────┬───┘
   │          pass │              │ fail
   │                ▼              ▼
   │       ┌───────────────┐  ┌─────────────────────────┐
   │       │ Done — use       │  │ 4. Feed the validation      │
   │       │ validated data    │  │    error back as a           │
   │       └───────────────┘  │    tool_result (is_error)     │
   │                              └──────────────┬──────────────┘
   │                                                ▼
   │                                     ┌─────────────────────┐
   └─────────────────────────────────────│ Retry budget left?     │
                                          └──────┬───────────┬───┘
                                             yes  │           │ no
                                                  └───────────┴──▶ escalate to human`,
    },
    {
      type: "concept",
      title: "Deterministic logic vs. model reasoning",
      mode: "both",
      body: `Anything with a fixed, checkable rule belongs in deterministic code, not another model call: do the line items sum to the total, does the date parse, does the ID match a known record. None of that requires judgment — a model call to "double-check the math" is slower, costs money, and isn't more trustworthy than the arithmetic check it's standing in for.

Reserve the model for what genuinely requires judgment: which of several printed company names on an inconsistently formatted invoice is the vendor rather than the bill-to party, when different documents represent that distinction differently. That's not reducible to a fixed rule table the way "does 4 + 6 equal 10" is — it's the same distinction Domain 1 draws between an agent and a workflow, applied one level down, to a single extraction step instead of a whole task.`,
    },
    {
      type: "examTrap",
      title: "Exam trap: asking nicely isn't a schema, and a full system prompt isn't a schema either",
      mode: "both",
      body: `The most common wrong answer in this domain is prose that *asks* for structure — "please respond only with valid JSON matching this shape" — treated as equivalent to actually forcing that shape via tool-use. It isn't. Prose requests can still be violated: stray commentary before the JSON, a field renamed, a value that doesn't match the stated type. Schema-constrained output via a forced tool call closes off that failure mode at the mechanism level, not just at the instruction level.

A second version of the same trap: stuffing the system prompt with everything that seems important — the output format, this request's specific edge cases, today's exceptions — on the theory that more upfront instruction means more reliability. It doesn't fix unreliable output, and it makes the system prompt harder to reuse across requests that don't share those specifics. If a piece of guidance changes from call to call, it belongs in the user prompt, no matter how important it is.`,
    },
    {
      type: "miniLab",
      title: "Mini lab: design the extraction pipeline",
      mode: "both",
      body: `Using the messy-document scenario above, design the full prompt + schema + retry strategy by hand before moving to Domain 5.`,
      steps: [
        "Write the system prompt and the user prompt separately, and list exactly which pieces of guidance go in each — flag anything you're tempted to put in the system prompt that's actually specific to one request.",
        "Write 2 few-shot examples for this extraction task, including at least one that demonstrates a missing or ambiguous field being handled the way you want.",
        "Sketch the tool's input_schema for the four fields (vendor, date, line items, total), and write a one-line description for each field precise enough that a teammate unfamiliar with the task could fill it in correctly by hand.",
        "List two deterministic checks you'd run after schema validation succeeds — checks that catch a correctness problem a valid-shaped response could still have.",
        "Decide your retry cap and your fallback when it's exceeded, and write the one sentence you'd want the retry message to say back to the model on a validation failure.",
      ],
    },
  ],
};
