/**
 * Canonical exam blueprint data. Single source of truth — the home page,
 * certification overview, domain roadmap, and progress-weighting all import
 * this instead of hardcoding numbers, so the site can't drift out of sync
 * with itself the way a page copy-pasted from docs/certification-blueprint.md
 * eventually would. docs/certification-blueprint.md is the human-readable
 * mirror of this file, not the other way around.
 *
 * Deliberately no `abbreviation` field: Anthropic's own certification page
 * doesn't publish one, and third-party prep sites disagree with each other
 * (both "CCA-F" and "CCAR-F" are in circulation). Use EXAM_FORMAT.name in
 * full rather than inventing/picking a shorthand — see
 * docs/certification-blueprint.md for the sourcing note.
 */

export type DomainId =
  | "agentic-architecture-orchestration"
  | "tool-design-mcp"
  | "claude-code-configuration-workflows"
  | "prompt-engineering-structured-output"
  | "context-management-reliability";

export interface DomainBlueprint {
  id: DomainId;
  number: 1 | 2 | 3 | 4 | 5;
  title: string;
  shortTitle: string;
  weight: number; // percent, all five sum to 100
  summary: string;
  topics: string[];
  /** Whether a lesson module exists yet at /domains/[id]. Kept here so the
   * roadmap and nav can render "coming soon" without a second status list. */
  available: boolean;
}

export const EXAM_FORMAT = {
  name: "Claude Certified Architect – Foundations",
  questionCount: 60,
  minutes: 120,
  priceUsd: 125,
  passingScore: 720,
  maxScore: 1000,
} as const;

export const DOMAINS: DomainBlueprint[] = [
  {
    id: "agentic-architecture-orchestration",
    number: 1,
    title: "Agentic Architecture & Orchestration",
    shortTitle: "Agentic Architecture",
    weight: 27,
    summary:
      "Agent loops, agent vs. deterministic workflow, single- vs. multi-agent design, delegation and subagents, parallelization, human-in-the-loop, stopping conditions, and the reliability trade-offs each choice carries.",
    topics: [
      "Agent loop (reason → act → observe → repeat)",
      "Agent vs. deterministic workflow",
      "Single-agent vs. multi-agent architecture",
      "Delegation and subagents",
      "Parallelization",
      "Human-in-the-loop",
      "Stopping conditions",
      "Reliability trade-offs",
    ],
    available: true,
  },
  {
    id: "tool-design-mcp",
    number: 2,
    title: "Tool Design & MCP Integration",
    shortTitle: "Tool Design & MCP",
    weight: 18,
    summary:
      "MCP clients and servers, tools vs. resources vs. prompts, tool schema design, permissions and boundaries, authentication, error handling, and designing safe MCP integrations.",
    topics: [
      "MCP clients and servers",
      "Tools vs. resources vs. prompts",
      "Tool schema design",
      "Permissions and tool boundaries",
      "Authentication",
      "Error handling",
      "Safe MCP integration design",
    ],
    available: false,
  },
  {
    id: "claude-code-configuration-workflows",
    number: 3,
    title: "Claude Code Configuration & Workflows",
    shortTitle: "Claude Code",
    weight: 20,
    summary:
      "CLAUDE.md and project instructions, permissions, hooks, commands and skills, MCP inside Claude Code, context management, and development workflows.",
    topics: [
      "CLAUDE.md / project instructions",
      "Permissions",
      "Hooks",
      "Commands and skills",
      "MCP inside Claude Code",
      "Context management",
      "Development workflows",
    ],
    available: false,
  },
  {
    id: "prompt-engineering-structured-output",
    number: 4,
    title: "Prompt Engineering & Structured Output",
    shortTitle: "Prompt Engineering",
    weight: 20,
    summary:
      "System and user prompts, few-shot examples, structured (XML/JSON/schema) prompting, tool-use prompting, validation and retries, and separating deterministic application logic from model reasoning.",
    topics: [
      "System vs. user prompts",
      "Few-shot examples",
      "XML-style structure",
      "JSON / schema-driven output",
      "Tool-use prompting",
      "Validation and retries",
      "Deterministic logic vs. model reasoning",
    ],
    available: false,
  },
  {
    id: "context-management-reliability",
    number: 5,
    title: "Context Management & Reliability",
    shortTitle: "Context & Reliability",
    weight: 15,
    summary:
      "Context windows, context engineering, summarization and compaction, retrieval, caching, error handling and retries, observability, evaluations, and production reliability.",
    topics: [
      "Context windows",
      "Context engineering",
      "Summarization / compaction",
      "Retrieval",
      "Caching",
      "Error handling and retries",
      "Observability and evaluations",
      "Production reliability",
    ],
    available: false,
  },
];

export function getDomain(id: string): DomainBlueprint | undefined {
  return DOMAINS.find((d) => d.id === id);
}

export const TOTAL_WEIGHT = DOMAINS.reduce((sum, d) => sum + d.weight, 0);
