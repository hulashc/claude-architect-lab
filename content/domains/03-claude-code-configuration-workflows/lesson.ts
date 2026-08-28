import type { Lesson } from "@/lib/content/schema";
import { domain3Questions } from "@content/quizzes/domain-3";

/**
 * Domain 3 — Claude Code Configuration & Workflows (20% of the exam).
 * Author-drafted by Claude at the project owner's direction and pending a
 * human review pass before being treated as final — see content/README.md
 * and CLAUDE.md's content authorship rule. Follows the block template
 * established in Domain 1: concept → terms → diagram → concept → diagram
 * → code → concept(×2, paired by mode) → scenario → concept → diagram →
 * concept → exam trap → mini lab.
 */
export const domain3Lesson: Lesson = {
  domainId: "claude-code-configuration-workflows",
  title: "Claude Code Configuration & Workflows",
  summary:
    "What actually belongs in CLAUDE.md versus a one-off prompt, how permissions and hooks differ (a request the model reads vs. a check the harness enforces), how slash commands, skills, and MCP servers each get their instructions or tools loaded, and how a team composes all of this into a real shared workflow.",
  practiceQuestionIds: domain3Questions.map((q) => q.id),
  blocks: [
    {
      type: "concept",
      title: "What CLAUDE.md is (and isn't)",
      mode: "both",
      body: `CLAUDE.md is a markdown file at a project's root that Claude Code reads automatically at the start of every session in that repository — no one has to paste it in, link it, or remind Claude it exists. That's exactly why what goes in it matters: content here loads into **every** session's context whether or not that particular session needs it, so it should be durable and broadly relevant — conventions, house rules, architectural decisions, the things a new contributor (human or Claude) genuinely needs to know before touching the codebase.

A one-off instruction — "refactor this one function," "check whether this PR fixes issue #42" — doesn't belong in CLAUDE.md. It belongs in the prompt for that specific task. Putting task-specific instructions in CLAUDE.md means every future session pays the context cost of loading them, and worse, they'll eventually go stale and contradict the actual current state of the work.

CLAUDE.md is scoped to the project. Claude Code also reads personal/global configuration that lives outside any repository — settings and instructions that apply across all of a user's projects, not just this one. A project's CLAUDE.md and a user's global config both load, but they answer different questions: "what does this project need every session to know" versus "what do I, this user, always want, regardless of which project I'm in."`,
    },
    {
      type: "terms",
      title: "Key terms for this domain",
      mode: "both",
      terms: [
        {
          term: "CLAUDE.md",
          definition:
            "A project-root markdown file loaded automatically into every Claude Code session in that repository, holding durable context — conventions, house rules, and things every session should already know without being told.",
        },
        {
          term: "Hook",
          definition:
            "A shell command Claude Code's harness runs automatically at a defined lifecycle point, such as before or after a tool call, or when a session starts or stops; it executes whether or not the model chose to, and can block or modify the action.",
        },
        {
          term: "Permission mode",
          definition:
            "A session-wide setting for how much a tool call needs explicit approval before it runs, ranging from asking before nearly everything to letting pre-approved categories of actions proceed automatically.",
        },
        {
          term: "Slash command",
          definition:
            "A reusable prompt or workflow saved as a file and invoked explicitly by typing its name; it only runs when a user calls it, unlike always-loaded CLAUDE.md content.",
        },
        {
          term: "Skill",
          definition:
            "A packaged set of instructions with a short description that Claude reads and decides to invoke on its own when a task matches, rather than being loaded into every session or typed by name like a slash command.",
        },
        {
          term: "MCP server",
          definition:
            "An external process exposing tools, resources, or prompts over the Model Context Protocol; Claude Code connects to one or more configured servers as a client to gain capabilities beyond its built-in tools.",
        },
        {
          term: "Context compaction",
          definition:
            "The harness's automatic process of summarizing or trimming earlier parts of a long session's transcript so the conversation can keep going within the model's context window without silently losing essential state.",
        },
      ],
    },
    {
      type: "diagram",
      title: "The Claude Code session lifecycle",
      mode: "both",
      caption:
        "CLAUDE.md loads once, up front. Hooks fire at fixed points regardless of what the model decided. Permission checks sit between a requested tool call and its execution. Compaction is the harness managing a long session's context automatically.",
      ascii: `  Session start
       │
       ▼
┌───────────────────────────────┐
│ CLAUDE.md (+ personal/global    │  ← loaded once, automatically,
│ config) loaded into context      │     into every session in this repo
└────────────────┬──────────────┘
                   ▼
┌───────────────────────────────┐
│ SessionStart hook (if any)        │  ← deterministic; fires whether
└────────────────┬──────────────┘     or not the model "wanted" it to
                   ▼
           ┌────────────────┐
      ┌───▶│  User turn        │
      │    └────────┬───────┘
      │              ▼
      │    ┌────────────────────────┐
      │    │ Model decides: answer,     │
      │    │  or request a tool call     │
      │    └────────┬───────────────┘
      │     tool call │      final answer
      │       ▼        │           ▼
      │ ┌─────────────────────┐  (turn ends)
      │ │ Permission check        │
      │ │  (allow / ask / deny)     │  ← evaluated before the
      │ │  + PreToolUse hook(s)      │     tool actually executes
      │ └──────────┬──────────┘
      │             ▼
      │    ┌────────────────┐
      │    │  Tool executes    │
      │    └────────┬───────┘
      │               ▼
      │    ┌────────────────────┐
      │    │  PostToolUse hook(s)  │  ← e.g. auto-format or lint
      │    └────────┬───────────┘     right after a file changes
      │               ▼
      └──── result appended to the conversation

  Long session, approaching the context window limit
                    ▼
         ┌───────────────────────────┐
         │  Automatic compaction         │  ← harness summarizes/trims
         │  (harness-managed)               │     older turns; session continues
         └───────────────────────────┘
                    ▼
         Session ends → Stop hook (if any)`,
    },
    {
      type: "concept",
      title: "Permissions: allow, ask, deny",
      mode: "both",
      body: `Every tool call Claude Code wants to make — reading a file, editing one, running a shell command, calling an MCP tool — passes through a permission check before it executes. A permission rule can allow a specific tool (or a specific pattern, like a particular Bash command prefix) to run without asking, deny it outright, or fall through to asking the user for a decision.

Layered on top of individual rules is the session's permission mode — the default posture when no specific rule matches. A cautious mode asks before anything that isn't explicitly pre-approved; a more permissive mode (useful for a tight edit-test loop you're actively watching) auto-accepts file edits while still asking before shell commands; a read-only planning mode blocks any mutating action entirely so Claude can only investigate and propose. None of these modes override an explicit deny rule or a blocking hook — those still win regardless of mode.

Scoping matters most for exactly the two tool categories that can do real damage unattended: shell commands (arbitrary code execution — could delete a branch, hit a production API, exfiltrate data) and file edits (could silently rewrite something outside the intended scope). A permission setup that's broad "for convenience" is broad for whatever goes wrong, too — the point of allow/ask/deny rules is to make the blast radius of an unattended mistake match what was actually intended to be authorized.`,
    },
    {
      type: "diagram",
      title: "Permission check at a tool call",
      mode: "both",
      caption:
        "The permission mode is only the fallback — a specific rule, if one matches, decides the outcome first.",
      ascii: `        Model requests a tool call
                    │
                    ▼
    ┌───────────────────────────────┐
    │ Does a specific rule match this   │
    │ tool + these arguments?              │
    └───────────────┬───────────────┘
        matches                  no match
    ┌──────────┴──────────┐          │
    ▼                       ▼          ▼
┌─────────┐         ┌─────────┐  ┌─────────────────────┐
│  allow     │         │  deny     │  │ fall back to the        │
│ runs it,     │         │ blocked,   │  │ session's permission      │
│ no prompt     │         │ Claude is  │  │ mode default                │
└─────────┘         │ told why   │  └──────────┬───────────┘
                       └─────────┘               ▼
                                         ┌────────────────────────┐
                                         │ mode decides: ask the     │
                                         │  user, or auto-allow          │
                                         │  (e.g. an edit-accepting     │
                                         │  or planning mode)              │
                                         └────────────────────────┘`,
    },
    {
      type: "code",
      title: "A hook configuration for enforcement, not politeness",
      language: "json",
      mode: "both",
      caption:
        "settings.json — a PreToolUse hook blocks a commit until tests have passed; a PostToolUse hook auto-formats after every edit. Both run regardless of what the model decided this turn.",
      code: `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "scripts/block-commit-if-tests-failing.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npm run lint -- --fix"
          }
        ]
      }
    ]
  }
}`,
    },
    {
      type: "concept",
      title: "What the exam is actually testing here",
      mode: "certification",
      body: `The exam won't ask you to recite what CLAUDE.md is. It gives you a team's requirements and several plausible configuration choices, and tests whether you can:

- Tell apart something loaded once and read passively (CLAUDE.md), something invoked on demand by name (a slash command), something the model discovers and decides to use (a skill), and something that runs regardless of what the model decided (a hook).
- Recognize when a requirement needs deterministic enforcement — and reach for a hook or a permission deny rule, not a politely-worded instruction.
- Notice when a permission setup is scoped more broadly than the task actually needs.
- Treat MCP servers as just another source of tools subject to the same permission model, not a separate trust boundary.

The scenario below is built in exactly that shape — work through it before checking the answer.`,
    },
    {
      type: "concept",
      title: "Building this for real",
      mode: "architect",
      body: `In a real team repo, these pieces compose into one system, not four unrelated settings. A shared CLAUDE.md at the project root captures conventions everyone needs — testing conventions, the commit message format, which directories are off-limits, where the architecture docs live — checked into version control like any other project file, reviewed and updated the same way code is.

Enforcement that actually has to hold — tests passing before a commit, no direct pushes to main, secrets never landing in a tracked file — lives in hooks, because a hook runs whether or not the model remembers, is under time pressure, or just didn't think of it this turn. CLAUDE.md can *say* "run the tests before committing"; a PreToolUse hook is what actually stops the commit if they haven't been run.

Team-specific repeatable workflows — "open a PR with our standard template," "run our release checklist" — are natural slash commands: nobody wants to retype that prompt from scratch, and unlike CLAUDE.md they don't cost context on sessions that never use them. A skill fits the workflows that are common enough to be worth packaging but too situational to invoke by name every time — a skill for "reviewing a database migration for backward compatibility" that Claude reaches for automatically when a session touches a migration file, without every unrelated session paying to load it.

Put together: CLAUDE.md is what everyone should already know, hooks are what must never be skipped, slash commands are what someone explicitly wants to run right now, and skills are what should be found and used only when relevant.`,
    },
    {
      type: "scenario",
      title: "Scenario: configuring Claude Code for a shared repo",
      mode: "both",
      intro:
        "A team wants a policy that no commit lands in the shared repo unless the test suite has passed since the last edit — and they don't want this to depend on Claude remembering to check. Where should this policy actually live?",
      question: {
        id: "d3-lesson-scenario-test-gate",
        domainId: "claude-code-configuration-workflows",
        examConcept: "Deterministic enforcement (hooks) vs. a request the model reads (CLAUDE.md) vs. on-demand or discovered mechanisms (permissions, skills)",
        scenario:
          "Requirement: no commit should ever land in the shared repo unless the test suite has passed since the last edit, and this must not depend on Claude remembering to check.",
        prompt: "Which configuration choice actually guarantees the policy is enforced?",
        options: [
          {
            id: "a",
            label: "Add a line to CLAUDE.md instructing Claude to always run the test suite before committing.",
            correct: false,
            rationale: "CLAUDE.md is loaded context the model reads and is expected to follow, but it's a request, not an enforcement mechanism — a long session, a compacted context, or the model simply prioritizing something else can all cause it to be skipped, and nothing actually blocks the commit if it is.",
          },
          {
            id: "b",
            label: "Write a PreToolUse hook that matches on Bash commit invocations and runs the test suite first, blocking the commit if tests fail.",
            correct: true,
            rationale: "A hook is a shell command the harness runs deterministically at that lifecycle point, regardless of what the model decided — it can actually block the tool call, which is what \"guarantees\" requires here.",
          },
          {
            id: "c",
            label: "Create a skill named \"commit-safely\" describing the test-before-commit process, for Claude to invoke when it judges a commit is about to happen.",
            correct: false,
            rationale: "A skill is discovered and invoked by the model when it judges the task matches — still a model decision it can get wrong or skip, not a deterministic gate.",
          },
          {
            id: "d",
            label: "Set the permission mode so every Bash command requires manual approval, and trust the human approver to check that tests passed.",
            correct: false,
            rationale: "Tempting since a human is now in the loop, but it puts the actual enforcement burden on a human remembering to check test status manually, every single commit — it doesn't build the check into the system itself.",
          },
        ],
        difficulty: "exam-style",
      },
    },
    {
      type: "concept",
      title: "Commands and skills: invoked vs. discovered",
      mode: "both",
      body: `Three of this domain's pieces solve the same underlying problem — giving Claude an instruction or workflow it wouldn't otherwise have — through three different loading strategies, and mixing them up is the easiest way to misconfigure a repo.

CLAUDE.md is always-loaded: every session in the project reads it, whether or not this particular task touches what it describes. That's appropriate for things every session needs, and wasteful (and eventually noisy) for something only one workflow ever uses.

A slash command is explicitly invoked: a prompt or short workflow saved as a file and triggered by typing its name, like a team's own release-checklist command. Nothing about it loads automatically — if nobody types it, it costs nothing and does nothing. That fits a workflow a person consciously decides to kick off.

A skill is discovered when relevant: a packaged set of instructions with a description Claude reads and matches against the current task, pulling in the fuller instructions only when they're likely to apply — a skill for reviewing database migrations only engages on a session that's actually touching one. That's a middle ground between paying the context cost every session and only being usable if someone remembers the exact command name.`,
    },
    {
      type: "diagram",
      title: "Claude Code as an MCP client",
      mode: "both",
      caption:
        "Once a server is configured, its tools appear in the model's tool list like any built-in tool — and the same permission rules apply to them.",
      ascii: `┌─────────────────────────────────────────────┐
│                  Claude Code                     │
│                (MCP client)                       │
│                                                       │
│  built-in tools: Read, Edit, Bash, Grep, ...           │
└────────────────┬───────────────┬───────────────┘
                   │                  │
      configured in project/user MCP settings
                   │                  │
                   ▼                  ▼
        ┌─────────────────┐  ┌─────────────────┐
        │  MCP server: Jira   │  │  MCP server: DB      │
        │  tools: create-       │  │  tools: query,          │
        │  ticket, search          │  │  list-tables               │
        └─────────────────┘  └─────────────────┘

  Each server's tools join the model's tool list like a built-in
  tool; permission rules (allow/ask/deny) apply to them the same way.`,
    },
    {
      type: "concept",
      title: "Context management: compaction and what you can influence",
      mode: "both",
      body: `A Claude Code session's context window is finite, and a long session — many tool calls, large file reads, extended back-and-forth — eventually approaches that limit. When it does, the harness automatically compacts the conversation: summarizing or trimming earlier turns so the session can keep going without silently losing track of what happened.

This is largely automatic, but a few things sit within a user's or project's control. A user can trigger compaction proactively rather than waiting for it, or start a fresh session once a task is genuinely done rather than letting one conversation grow indefinitely. A project can influence how much of the compaction "budget" its own configuration consumes — an unnecessarily long CLAUDE.md, or a habit of dumping huge raw tool outputs into the conversation instead of summarizing them, means compaction has to happen sooner and discards more of the actual task history to make room.

The practical implication: context management isn't purely something to clean up after the fact. Keeping CLAUDE.md focused, having tools return distilled results instead of raw dumps, and using subagents to keep a large sub-investigation's exploration out of the main session's context (Domain 1's delegation boundary, reused here) all reduce how often, and how aggressively, compaction has to run.`,
    },
    {
      type: "examTrap",
      title: "Exam trap: \"the model decided to run the hook\"",
      mode: "both",
      body: `The easiest wrong assumption in this domain is describing a hook as something Claude "decided" to run — as in, "the pre-commit hook ran because Claude figured it should check first." A hook isn't a suggestion the model weighs and chooses to follow; it's a shell command the harness executes automatically at a fixed lifecycle point (before or after a tool call, at session start or stop), completely independent of whether the model would have chosen to do that check itself. That's the entire point: a hook still fires even when the model forgets, gets confused, or would have skipped it.

The mirror-image trap is treating CLAUDE.md content as if it has hook-like enforcement power. An instruction in CLAUDE.md that says "always run tests before committing" is read by the model and, in most cases, followed — but it's still a request competing for the model's attention against everything else in context, not a gate anything blocks on. If a requirement says "must never happen" or "must always be enforced," the exam wants a hook (or a deny permission rule) in the answer, not a CLAUDE.md instruction, no matter how firmly it's worded.`,
    },
    {
      type: "miniLab",
      title: "Mini lab: design a CLAUDE.md + hook setup",
      mode: "both",
      body: `A five-engineer team is adopting Claude Code on a shared TypeScript repo. They want: every session to know their test command and commit-message convention; no commit to ever land with failing tests or an unformatted file; a fast way for anyone to kick off their existing release checklist; and new engineers to not need to memorize any of this by heart. Design the configuration.`,
      steps: [
        "Draft the CLAUDE.md content: list exactly what belongs there for this team, and one thing you'd deliberately leave out because it's too task-specific.",
        "Write the hook(s) that enforce the test-before-commit and formatting rules — name the lifecycle point each fires at (e.g. PreToolUse on a Bash commit invocation) and what makes it block rather than just warn.",
        "Decide whether the release checklist belongs in a slash command or a skill, and justify the choice against the difference between \"invoked\" and \"discovered.\"",
        "Identify one thing in your design that's actually a permission-mode decision rather than a CLAUDE.md, hook, or skill decision, and say what mode or rule you'd set.",
      ],
    },
  ],
};
