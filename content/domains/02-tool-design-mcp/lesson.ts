import type { Lesson } from "@/lib/content/schema";
import { domain2Questions } from "@content/quizzes/domain-2";

/**
 * Domain 2 — Tool Design & MCP Integration (18% of the exam). Author-drafted
 * by Claude at the project owner's direction and pending a human review pass
 * before being treated as final — see content/README.md and CLAUDE.md's
 * content authorship rule. Follows the block template established by
 * Domain 1: concept → terms → diagram → concept → code → concept(×2, paired
 * by mode) → scenario → concept → diagram → concept → exam trap → mini lab.
 */
export const domain2Lesson: Lesson = {
  domainId: "tool-design-mcp",
  title: "Tool Design & MCP Integration",
  summary:
    "What MCP actually standardizes, how tools differ from resources and prompts, what makes a tool schema good instead of merely functional, and how least-privilege scoping, authentication, and structured error handling combine into a design a reviewer would approve.",
  practiceQuestionIds: domain2Questions.map((q) => q.id),
  blocks: [
    {
      type: "concept",
      title: "What MCP is, architecturally",
      mode: "both",
      body: `The Model Context Protocol (MCP) is an open protocol that standardizes how an AI application connects to external tools, data, and systems. Before a shared protocol, every AI application that wanted to reach a given system — a ticketing tool, a database, an internal API — had to write its own bespoke integration for it. Multiply that by every app and every system, and you get an integration built once per pair, rebuilt from scratch each time.

MCP replaces that with one standard interface. A system's capabilities get exposed once, as an **MCP server**. Any MCP-compatible **host application** — an IDE, a chat client, a custom agent — can connect to that server through an embedded **MCP client** and immediately use whatever it exposes, without writing integration code specific to that system. The protocol is the reusable part; the server is where the actual integration work with a given external system lives.

That's the frame for everything else in this domain: MCP isn't a new capability Claude gains, it's a standard way of wiring existing capabilities — tools, data, and prompt templates — into whatever application is using Claude.`,
    },
    {
      // Definitions written for this lesson, not extracted from elsewhere —
      // new content per the Domain 2 authoring brief. Pending the owner's
      // review pass like the rest of this file.
      type: "terms",
      title: "Key terms for this domain",
      mode: "both",
      terms: [
        {
          term: "MCP",
          definition:
            "An open protocol that standardizes how an AI application connects to external tools, data, and systems, so each integration is built once against the protocol instead of once per application.",
        },
        {
          term: "MCP host",
          definition:
            "The AI application itself, such as an IDE, a chat client, or a custom agent, that embeds one or more MCP clients and decides which servers, tools, and resources are available in a given session.",
        },
        {
          term: "MCP client",
          definition:
            "The component inside a host that manages a single connection to one MCP server, handling the protocol messages that list and invoke that server's tools, resources, and prompts.",
        },
        {
          term: "MCP server",
          definition:
            "A program that exposes a set of tools, resources, or prompts over the protocol, typically wrapping access to one external system such as a database, ticketing system, or file store.",
        },
        {
          term: "Tool (MCP primitive)",
          definition:
            "An action the model can choose to invoke during a conversation, with a defined input schema and output shape, used when the task requires the model to decide when and how to act.",
        },
        {
          term: "Resource (MCP primitive)",
          definition:
            "A piece of read-only context data, such as a file or a database record, that a client can attach to a conversation for the model to read, distinct from an action the model invokes on its own.",
        },
        {
          term: "Prompt (MCP primitive)",
          definition:
            "A reusable, server-defined template for a particular task, exposed so a user or host can select it to start a workflow with the right framing already filled in.",
        },
        {
          term: "Least privilege",
          definition:
            "Scoping each tool to only the specific action or data a task genuinely requires, rather than granting broad access that happens to cover it.",
        },
      ],
    },
    {
      type: "diagram",
      title: "MCP client/server architecture",
      mode: "both",
      caption:
        "One MCP server per external system, reusable by any number of hosts. The host never talks to the external system directly — the server owns that connection, including its credentials.",
      ascii: `        ┌───────────────────────────┐
        │      Host application       │
        │  (IDE, chat app, agent, ...)  │
        └──────────────┬────────────┘
                        │  embeds
                        ▼
        ┌───────────────────────────┐
        │   MCP client(s)               │
        │   one per connected server     │
        └───────┬───────────┬───────┘
                 │             │
                 ▼             ▼
       ┌──────────────┐ ┌──────────────┐
       │  MCP server A   │ │  MCP server B   │
       │  tools /          │ │  tools /          │
       │  resources /       │ │  resources /       │
       │  prompts            │ │  prompts            │
       └───────┬──────┘ └───────┬──────┘
                ▼                  ▼
       ┌──────────────┐ ┌──────────────┐
       │ External system  │ │ External system  │
       │ e.g. ticketing API│ │ e.g. internal DB    │
       └──────────────┘ └──────────────┘`,
    },
    {
      type: "concept",
      title: "Tools vs. resources vs. prompts",
      mode: "both",
      body: `These are the three things an MCP server can expose, and the exam consistently tests whether you can tell them apart — not by what they contain, but by **who controls when they're used**.

A **tool** is model-controlled: the model itself decides, mid-conversation, whether to call it and with what input, the same way it decides to call any tool today. A **resource** is application-controlled: it's read-only context — a file, a database row, a document — that the host or client decides to attach to the conversation, not something the model reaches out and invokes on its own. A **prompt** is user-controlled: a reusable template the server defines, that a user (or the host, on the user's behalf) explicitly selects to kick off a specific workflow, typically surfaced as something like a menu item or slash command.

The common exam trap is treating all three as interchangeable "things the model can use." A resource sitting in a server's capability list isn't something the model calls the way it calls a tool — it has to actually be attached to the conversation first, by the application, before the model ever sees it. And a prompt template isn't the system prompt; it's a reusable, selectable starting point defined by the server, invoked deliberately by a person, not autonomously by the model.`,
    },
    {
      type: "code",
      title: "A well-scoped MCP tool definition",
      language: "typescript",
      mode: "both",
      caption:
        "Illustrative lesson content, not a runnable server — no actual mcp/ infrastructure lives in this repo. The shape to notice: a narrow input schema, a description precise enough for the model to use the tool correctly, and a structured error instead of a thrown exception.",
      code: `// A single, narrowly scoped MCP tool — one action, one clear purpose.
const getOrderStatusTool = {
  name: "get_order_status",
  description:
    "Look up the current status of a single customer order by its order ID. " +
    "Returns the order's status, last-updated timestamp, and carrier tracking " +
    "number if shipped. Read-only — does not modify the order.",
  inputSchema: {
    type: "object",
    properties: {
      orderId: {
        type: "string",
        description: "The order ID exactly as shown to the customer, e.g. \\"ORD-48213\\".",
      },
    },
    required: ["orderId"],
    additionalProperties: false,
  },
};

async function handleGetOrderStatus(input: { orderId: string }) {
  const order = await ordersApi.find(input.orderId);

  if (!order) {
    // A structured, typed error — not a thrown exception — so the model can
    // reason about what happened and decide what to do next (ask the
    // customer to double-check the ID, rather than the whole turn failing
    // with an opaque message).
    return {
      isError: true,
      error: {
        code: "not_found",
        message: \`No order found with ID \${input.orderId}.\`,
      },
    };
  }

  return {
    isError: false,
    status: order.status,
    lastUpdated: order.lastUpdatedAt,
    trackingNumber: order.trackingNumber ?? null,
  };
}`,
    },
    {
      type: "concept",
      title: "What the exam is actually testing here",
      mode: "certification",
      body: `The exam won't ask you to define MCP in the abstract. It gives you a scenario — a company's internal system, a proposed tool list, a proposed schema — and tests whether you can:

- Tell a tool from a resource from a prompt by who controls its invocation, not by what data it happens to carry.
- Spot an input schema that's too vague or too broad for the model to fill in reliably, versus one that's narrow and well-typed.
- Recognize least-privilege scoping — several narrow tools beating one tool that "can do anything" — even when the broad option looks simpler to build.
- Distinguish a structured, recoverable error from an opaque thrown failure, and explain why the difference matters to an agent loop.

The scenario below is built exactly in that shape — work through it before checking the answer.`,
    },
    {
      type: "concept",
      title: "Building this for real",
      mode: "architect",
      body: `In production, "authentication" for an MCP server usually comes down to one of two shapes. A **static API key** or service credential suits a server that acts under one fixed identity — the server itself is trusted to reach the external system, regardless of which end user is asking. An **OAuth-based flow** suits a server that needs to act *as* a particular user, with that user's own scoped, revocable permissions — the server exchanges a token for that user's authorization rather than holding one blanket credential for everyone.

Either way, the credential belongs to the server's connection to the external system — never to the model. The model only ever sees a tool's name, description, and schema; it invokes the tool by supplying input, and the server is what actually holds and uses the credential to make the authenticated call. If you find yourself explaining a design where the model needs to "know" an API key, that's a sign the boundary has moved to the wrong side of the protocol.

The other practical habit worth building now: treat a tool's error shape as part of its interface, not an afterthought bolted on once something breaks in production.`,
    },
    {
      type: "scenario",
      title: "Scenario: shipment tracking and reroute integration",
      mode: "both",
      intro:
        "A logistics company wants Claude, used from both an internal support console and an internal Slack bot, to answer questions using their shipment-tracking system and carrier-rates database, and to submit a shipment reroute request when a delivery is delayed.",
      question: {
        id: "d2-lesson-scenario-shipment-mcp",
        domainId: "tool-design-mcp",
        examConcept: "Tool schema design + least-privilege scoping + reuse across hosts",
        scenario:
          "Requirements: read shipment status, read carrier rates, and submit a reroute request — all from two separately built internal applications.",
        prompt: "Which architecture should you choose?",
        options: [
          {
            id: "a",
            label:
              "A single MCP server exposing one tool that accepts an arbitrary SQL string against both databases, shared by both host apps.",
            correct: false,
            rationale:
              "This repeats the broad, unscoped-tool anti-pattern — one tool with unrestricted query access to two databases has far more capability than any of the stated tasks actually require, and validates nothing about the input.",
          },
          {
            id: "b",
            label:
              "One MCP server exposing narrowly scoped tools — get_shipment_status, get_carrier_rate, and request_reroute, each with a validated input schema and a service credential scoped only to what these three actions need — consumed as MCP clients by both the support console and the Slack bot.",
            correct: true,
            rationale:
              "This is the design that actually fits: each tool is scoped to one genuine action, inputs are validated, the credential is least-privilege, and building it once as an MCP server lets both separately-built host apps reuse it instead of duplicating integration work.",
          },
          {
            id: "c",
            label:
              "Two entirely separate, hand-written integrations — one hardcoded into the support console, one hardcoded into the Slack bot — each calling the internal APIs directly without MCP.",
            correct: false,
            rationale:
              "Workable in isolation, but tempting-but-wrong given two apps need the same capability — this duplicates and separately maintains the same integration logic twice, which is precisely the redundancy MCP is meant to avoid.",
          },
          {
            id: "d",
            label:
              "A single MCP server with one tool per host app (a support_console_actions tool and a slack_bot_actions tool), each branching internally on a generic 'action' string covering all three capabilities.",
            correct: false,
            rationale:
              "Even though this keeps the tool count low, bundling multiple distinct actions behind a generic action string per host abandons narrow, well-typed schemas and mixes read and side-effecting capabilities into one ambiguous tool each.",
          },
        ],
        difficulty: "exam-style",
      },
    },
    {
      type: "concept",
      title: "Permissions and tool boundaries",
      mode: "both",
      body: `Least privilege applied to tools means: a tool should be able to do exactly what its task needs, and nothing else. One tool called something like "run_admin_action" that accepts a freeform action string and can create, modify, or delete any record in a system is worse than three separate tools scoped to "look up a customer," "look up recent orders," and "update a shipping address" — even though the broad tool looks simpler to build and more "future-proof."

The reason is blast radius. If the model misfires — misreads an ambiguous instruction, gets manipulated by something like injected text inside a retrieved document — a narrow tool bounds the damage to exactly what that one tool can do. A broad tool bounds the damage to almost anything. This is also why "give the model as many tools as possible" is a misconception rather than a strength: a large, overlapping tool list doesn't just carry more security exposure, it also makes tool *selection* harder for the model, which shows up as more wrong or ambiguous calls, not more capability.`,
    },
    {
      type: "diagram",
      title: "Tool boundary: one broad tool vs. several narrow ones",
      mode: "both",
      caption:
        "Same underlying capability, two very different blast radii if a call goes wrong.",
      ascii: `  Broad, over-privileged design         Narrow, least-privilege design
  ┌─────────────────────────────┐   ┌────────────────────────────┐
  │  run_admin_action(action: str) │   │  get_customer_by_id(id)      │
  │                                   │   └────────────────────────────┘
  │  → create, modify, or delete       │   ┌────────────────────────────┐
  │     ANY record in ANY system        │   │  get_recent_orders(id)        │
  └─────────────────────────────┘   └────────────────────────────┘
                                        ┌────────────────────────────┐
   one tool call, misused, can            │  update_shipping_address(       │
   touch almost anything                  │    id, newAddress)               │
                                        └────────────────────────────┘

                                     one misused call can only do the
                                     one bounded thing that tool allows`,
    },
    {
      type: "concept",
      title: "Error handling: structured, not opaque",
      mode: "both",
      body: `A tool that throws a generic, unstructured failure gives the model nothing to act on — it knows *that* something went wrong, not *what*, and can't tell an invalid input from a permissions problem from a transient outage. A well-designed tool returns a **structured error** instead: a typed code (\`invalid_input\`, \`not_found\`, \`rate_limited\`, \`unavailable\`) plus a clear message, so the model can reason about the right next step — correct the input and retry, tell the user something specific, wait and retry a transient failure, or escalate.

This is the same principle as a narrow input schema, applied to the output side: predictability. A tool the model can't parse reliably on success is a design flaw; a tool the model can't reason about on failure is the same flaw showing up on the other path through the code.`,
    },
    {
      type: "examTrap",
      title: "Exam trap: tools, resources, and prompts blur together",
      mode: "both",
      body: `The most common wrong answer in this domain treats "tool," "resource," and "prompt" as roughly the same thing — three names for "content an MCP server can expose." They aren't interchangeable, and the exam tests the distinction directly: a **tool** is invoked by the model's own decision mid-conversation; a **resource** is read-only context that the application/client decides to attach; a **prompt** is a reusable template a user explicitly selects to start a workflow. Mixing these up shows up as answers where "the model calls the resource" or "the tool gets attached to context" — both wrong for the same underlying reason.

A second version of the same trap, specific to tool design: assuming more tools, or a single broader tool, means more capability. A large or poorly scoped tool list tends to produce *more* wrong tool calls, not fewer, and a single "do anything" tool trades a small implementation convenience for a large increase in what a single mistake can do.`,
    },
    {
      type: "miniLab",
      title: "Mini lab: design a tool schema",
      mode: "both",
      body: `Using the shipment scenario above, design one of its three tools by hand before moving to Domain 3.`,
      steps: [
        "Pick request_reroute and write its full input schema: field names, types, which fields are required, and one sentence per field explaining what the model should put there.",
        "Write the tool's description exactly as the model would see it — precise enough that a model reading only the name, description, and schema could call it correctly without additional examples.",
        "List at least two ways this tool could be scoped too broadly (e.g. accepting any order ID regardless of customer, or allowing an unbounded free-text reason field), and narrow the schema to close each one.",
        "Write the structured error shape this tool should return for two distinct failure cases — an invalid or unknown order ID, and the carrier API being temporarily unavailable — and explain what the model should do differently in each case.",
      ],
    },
  ],
};
