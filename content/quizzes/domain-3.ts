import type { QuizQuestion } from "@/lib/content/schema";

/**
 * Domain 3 — Claude Code Configuration & Workflows. 20 original practice
 * questions, author-drafted by Claude at the project owner's direction and
 * pending a human review pass before being treated as final — see
 * content/README.md and CLAUDE.md's content authorship rule. None of these
 * are copied or derived from the real exam.
 */
export const domain3Questions: QuizQuestion[] = [
  {
    id: "d3-q01",
    domainId: "claude-code-configuration-workflows",
    examConcept: "CLAUDE.md holds durable context, not one-off task instructions",
    scenario:
      "A developer working in a repo with an existing CLAUDE.md wants Claude to rename one specific variable across three files for this afternoon's PR.",
    prompt: "Where should that instruction go?",
    options: [
      { id: "a", label: "Add it to CLAUDE.md so Claude remembers to do it.", correct: false, rationale: "CLAUDE.md loads into every future session in this repo, whether or not that session has anything to do with this one-off rename — it would sit there as stale, irrelevant instruction after this afternoon." },
      { id: "b", label: "Give it directly in the prompt for this task, and leave CLAUDE.md untouched.", correct: true, rationale: "This is a one-off, task-specific instruction — exactly what belongs in the prompt for that task rather than in durable, always-loaded project context." },
      { id: "c", label: "Create a new skill describing the rename.", correct: false, rationale: "A skill is for a recurring pattern of task, discovered and reused across sessions — packaging a single afternoon's one-off rename as a skill is unnecessary overhead." },
      { id: "d", label: "Add a hook that runs the rename automatically.", correct: false, rationale: "A hook is for deterministic enforcement or side effects at a lifecycle point, not for one-off semantic edits that require judgment about what to rename and why." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d3-q02",
    domainId: "claude-code-configuration-workflows",
    examConcept: "CLAUDE.md loads automatically at session start",
    scenario:
      "A new engineer joins a project that has a CLAUDE.md file at the repository root describing testing conventions and architectural decisions.",
    prompt: "What has to happen for that file's content to reach a new Claude Code session working in this repo?",
    options: [
      { id: "a", label: "Nothing — Claude Code reads CLAUDE.md into context automatically at the start of a session in that repository.", correct: true, rationale: "This is exactly what CLAUDE.md is designed to do: load automatically, with no manual step, into every session started in that project." },
      { id: "b", label: "The engineer must paste its contents into the first prompt each session.", correct: false, rationale: "Defeats the purpose of CLAUDE.md — automatic loading is exactly what removes this manual step." },
      { id: "c", label: "The engineer must run a slash command to import it.", correct: false, rationale: "Slash commands are explicitly invoked workflows; CLAUDE.md's loading is automatic and doesn't depend on any command being run." },
      { id: "d", label: "It only loads if a hook is configured to read it.", correct: false, rationale: "CLAUDE.md loading is a base behavior of the harness, not something that depends on hook configuration existing." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d3-q03",
    domainId: "claude-code-configuration-workflows",
    examConcept: "Project CLAUDE.md vs. personal/global configuration",
    scenario:
      "An engineer has personal preferences — such as always explaining reasoning before making an edit — that they want applied across every project they work on, not just one repo.",
    prompt: "Where do those preferences belong?",
    options: [
      { id: "a", label: "In the project's CLAUDE.md, so every teammate also gets the same explanations.", correct: false, rationale: "This is a personal preference, not a team convention — putting it in the project's CLAUDE.md would impose one engineer's style on every other contributor to the repo." },
      { id: "b", label: "In personal/global configuration that applies across the user's projects, separate from any single repository's CLAUDE.md.", correct: true, rationale: "Personal, cross-project preferences are exactly what global configuration is for — it applies to this user regardless of which repo they're in, without affecting teammates or other projects." },
      { id: "c", label: "Repeated manually in the prompt at the start of every session.", correct: false, rationale: "Works but is needless manual repetition for something that should just always apply — global config exists precisely to avoid this." },
      { id: "d", label: "In a skill invoked at the start of every session.", correct: false, rationale: "A skill is discovered and invoked when a task matches its description — it's not the mechanism for a standing personal preference that should just always be true." },
    ],
    difficulty: "applied",
  },
  {
    id: "d3-q04",
    domainId: "claude-code-configuration-workflows",
    examConcept: "Hooks enforce; CLAUDE.md instructions request",
    scenario:
      "A team's CLAUDE.md says \"never commit files containing API keys or credentials.\" Despite this, a credential was committed last month when a session under time pressure skipped the check.",
    prompt: "What's the most effective fix?",
    options: [
      { id: "a", label: "Reword the CLAUDE.md instruction to be more emphatic, e.g. add \"this is critical, never skip this.\"", correct: false, rationale: "A wording change still leaves this as an instruction the model reads and can, in principle, deprioritize under pressure — it doesn't add any actual enforcement." },
      { id: "b", label: "Add a PreToolUse hook that scans staged changes for credential-shaped strings and blocks the commit if any are found.", correct: true, rationale: "This is deterministic enforcement: the hook runs regardless of what the model decided this turn, and can actually block the commit — which is what a \"never\" requirement needs." },
      { id: "c", label: "Remove the instruction from CLAUDE.md since it clearly isn't working.", correct: false, rationale: "Removing the instruction doesn't add enforcement and makes the situation worse, not better — the goal is to add a real check, not delete the request." },
      { id: "d", label: "Ask engineers to manually double-check every diff themselves before letting Claude commit.", correct: false, rationale: "Workable in principle, but it just relocates the same \"remembering to check\" problem onto a human instead of building an automated check into the workflow." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d3-q05",
    domainId: "claude-code-configuration-workflows",
    examConcept: "What actually makes something a hook, vs. a tool",
    scenario: "A team debates what makes something a \"hook\" in Claude Code, as opposed to a tool the model calls.",
    prompt: "Which statement accurately describes a hook?",
    options: [
      { id: "a", label: "A hook is a tool that Claude can choose to call, like any other tool in its tool list.", correct: false, rationale: "This describes a tool, not a hook — a hook isn't something the model selects from a list, and doesn't appear as a callable option to the model." },
      { id: "b", label: "A hook is a shell command the harness runs automatically at a defined lifecycle point (e.g. before or after a tool call), independent of what the model decided.", correct: true, rationale: "This is the defining property of a hook: it's deterministic harness behavior tied to a lifecycle event, not a model decision." },
      { id: "c", label: "A hook is a special kind of slash command that runs itself without being typed.", correct: false, rationale: "Conflates two different mechanisms — a slash command is explicitly typed by a user; a hook fires automatically at a lifecycle point regardless of any command being typed." },
      { id: "d", label: "A hook is a note in CLAUDE.md marked with a special syntax.", correct: false, rationale: "CLAUDE.md content is passive context the model reads; a hook is an actual executed command, not a formatting convention inside a markdown file." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d3-q06",
    domainId: "claude-code-configuration-workflows",
    examConcept: "Choosing the right hook lifecycle point (PostToolUse vs. PreToolUse)",
    scenario:
      "A team wants every file edit Claude Code makes to be automatically run through their formatter immediately afterward, without relying on Claude remembering to run it.",
    prompt: "Which hook configuration fits?",
    options: [
      { id: "a", label: "A PreToolUse hook on the Edit tool that runs the formatter before the edit happens.", correct: false, rationale: "Running the formatter before the edit doesn't format the file the edit just produced — the formatter needs to run on the result, after the edit, not before it." },
      { id: "b", label: "A PostToolUse hook matching the Edit (and Write) tools that runs the formatter immediately after each edit completes.", correct: true, rationale: "This fires right after the file changes, on exactly the tool calls that change files, and runs deterministically regardless of whether the model thought to format it." },
      { id: "c", label: "A CLAUDE.md instruction telling Claude to run the formatter after every edit.", correct: false, rationale: "Relies on the model remembering to do it every time — which the scenario explicitly says the team doesn't want to depend on." },
      { id: "d", label: "A SessionStart hook that runs the formatter once when the session begins.", correct: false, rationale: "This only runs once at the start of a session, before any edits have even happened — it wouldn't catch edits made during the session at all." },
    ],
    difficulty: "applied",
  },
  {
    id: "d3-q07",
    domainId: "claude-code-configuration-workflows",
    examConcept: "A blocking hook must actually signal failure, not just detect",
    scenario:
      "A team configures a PreToolUse hook meant to block any Bash command containing \"rm -rf\". The hook script runs but always exits 0, and the dangerous command still executes.",
    prompt: "What's most likely wrong?",
    options: [
      { id: "a", label: "The hook should have been a PostToolUse hook instead.", correct: false, rationale: "A PostToolUse hook fires after the command already ran — it's too late to block execution, which needs to happen before the tool runs." },
      { id: "b", label: "The hook needs to signal failure (a non-zero/blocking exit) when it detects the dangerous pattern, not just detect it and exit successfully.", correct: true, rationale: "A PreToolUse hook blocks the tool call by signaling that the action should be denied — a script that always exits success regardless of what it detected can't stop anything; detection alone isn't the same as blocking." },
      { id: "c", label: "Hooks can only warn, never block a tool call.", correct: false, rationale: "Incorrect — a PreToolUse hook is exactly the mechanism used to actually block a tool call before it executes, not merely to warn about it." },
      { id: "d", label: "The permission mode needs to be changed to \"ask\" for all Bash commands instead.", correct: false, rationale: "A permission ask-prompt still lets a human approve the dangerous command anyway; the team's goal described here is a hard, automatic block, which is a hook's job, not a manual approval step." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d3-q08",
    domainId: "claude-code-configuration-workflows",
    examConcept: "What a permission mode actually governs",
    scenario: "A team is comparing Claude Code's permission modes.",
    prompt: "What does a permission mode primarily control?",
    options: [
      { id: "a", label: "Which model (e.g. Sonnet vs. Opus) is used for the session.", correct: false, rationale: "Model selection is a separate setting from permissions — permission modes govern tool-call approval, not which model answers." },
      { id: "b", label: "The default posture for whether a tool call is auto-approved, requires asking the user, or is blocked, when no more specific rule applies.", correct: true, rationale: "This is what a permission mode actually sets: the fallback behavior for tool-call approval before any specific allow/deny rule is checked." },
      { id: "c", label: "How much of the context window is reserved for tool results.", correct: false, rationale: "Context window allocation is unrelated to permissions — that's a context management concern, not a tool-approval concern." },
      { id: "d", label: "Whether CLAUDE.md is loaded at session start.", correct: false, rationale: "CLAUDE.md loading happens regardless of permission mode — permission modes don't control whether project instructions load." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d3-q09",
    domainId: "claude-code-configuration-workflows",
    examConcept: "Scoping permissions to what a workflow actually needs",
    scenario:
      "A team gives Claude Code blanket approval to run any Bash command without asking, \"to save time,\" in a repo that also holds production deployment scripts.",
    prompt: "What's the main risk, and the better approach?",
    options: [
      { id: "a", label: "No real risk — broader permissions always make the session faster and more useful.", correct: false, rationale: "This ignores that Bash can run anything, including an unintended production deployment or destructive command — broad approval doesn't just save time, it removes the safety margin along with it." },
      { id: "b", label: "Scope the allow rule to the specific commands the workflow actually needs (e.g. test runner, linter) and leave anything touching deployment or destructive operations to ask or deny.", correct: true, rationale: "This matches the actual principle at stake: the blast radius of an unattended mistake should match what was genuinely intended to be authorized, not the full range of what Bash can do." },
      { id: "c", label: "Remove Bash access entirely so nothing can go wrong.", correct: false, rationale: "Overcorrects — it also blocks the legitimate commands (running tests, linting) the workflow actually needs, trading all convenience for safety instead of scoping precisely." },
      { id: "d", label: "Keep blanket approval, but add a hook that logs every Bash command after it runs.", correct: false, rationale: "Logging after the fact doesn't prevent a destructive or unintended command from executing — it only provides a record once the damage, if any, is already done." },
    ],
    difficulty: "applied",
  },
  {
    id: "d3-q10",
    domainId: "claude-code-configuration-workflows",
    examConcept: "Claude Code as an MCP client",
    scenario:
      "A team wants Claude Code to be able to create and update tickets in their issue tracker, which exposes an MCP server with tools for exactly that.",
    prompt: "What is Claude Code's role once that MCP server is configured?",
    options: [
      { id: "a", label: "Claude Code acts as an MCP server itself, exposing its own tools to the issue tracker.", correct: false, rationale: "Reverses the relationship — in this setup Claude Code is the one connecting out to gain new tools, not the one being connected to." },
      { id: "b", label: "Claude Code acts as an MCP client, connecting to the configured issue-tracker server and gaining its tools (e.g. create-ticket) as if they were built-in.", correct: true, rationale: "This is the actual role: Claude Code is the MCP client, and once connected, the server's tools become available to the model just like any other tool, subject to the same permission checks." },
      { id: "c", label: "Claude Code must have the issue tracker's entire API re-implemented as a skill before it can use it.", correct: false, rationale: "Unnecessary — MCP already provides typed tools directly; re-implementing them as a skill duplicates functionality the MCP connection already provides." },
      { id: "d", label: "Claude Code can only read from the issue tracker, never write to it, because MCP is read-only by design.", correct: false, rationale: "MCP itself isn't restricted to read-only tools — whether creating/updating tickets is possible depends on what tools the server actually exposes, not a protocol-level limitation." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d3-q11",
    domainId: "claude-code-configuration-workflows",
    examConcept: "MCP-provided tools follow the same permission model as built-in tools",
    scenario: "A team connects a new MCP server that exposes a \"delete-all-records\" tool.",
    prompt: "How does that tool interact with Claude Code's permission model?",
    options: [
      { id: "a", label: "MCP tools bypass the permission system entirely since they come from an external server.", correct: false, rationale: "Incorrect — tools from an MCP server are subject to the same allow/ask/deny permission checks as any built-in tool; being external doesn't exempt them." },
      { id: "b", label: "MCP tools are subject to the same permission rules as any other tool call — a destructive one like this is exactly the kind of call worth an explicit deny or ask rule.", correct: true, rationale: "MCP-provided tools are just another source of tools in the model's tool list, so the same permission model applies, and a destructive tool is precisely the case for a tight rule." },
      { id: "c", label: "MCP tools can only be used inside a skill, never called directly.", correct: false, rationale: "Not accurate — MCP tools become available to the model directly, the same way built-in tools do, with no requirement to route them through a skill." },
      { id: "d", label: "MCP tools require a separate CLAUDE.md section to be usable at all.", correct: false, rationale: "MCP servers are configured separately from CLAUDE.md and don't require a CLAUDE.md entry to function." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d3-q12",
    domainId: "claude-code-configuration-workflows",
    examConcept: "Slash commands (invoked) vs. skills (discovered) fit different needs",
    scenario:
      "A team has two recurring needs: (1) a specific PR-template workflow someone runs by name whenever they open a PR, and (2) noticing and applying their internal API versioning convention whenever a session happens to touch a public API file, without anyone needing to remember to ask for it.",
    prompt: "How should these be split?",
    options: [
      { id: "a", label: "Both as slash commands, since both are recurring workflows.", correct: false, rationale: "The second need is specifically about Claude noticing on its own without a person invoking anything by name — a slash command only runs when someone explicitly types it, which doesn't fit." },
      { id: "b", label: "The PR-template workflow as a slash command (invoked explicitly by name); the API versioning convention as a skill (discovered and applied automatically when relevant).", correct: true, rationale: "This matches each need to its mechanism: an explicitly-invoked workflow fits a slash command, and a \"notice and apply when relevant, without being asked\" need fits a skill's discovery-based invocation." },
      { id: "c", label: "Both as entries in CLAUDE.md so they're always loaded.", correct: false, rationale: "Loading both into every session regardless of relevance wastes context on sessions that never touch a PR or a public API file — exactly what skills and commands exist to avoid." },
      { id: "d", label: "Both as skills, since skills are more powerful than slash commands.", correct: false, rationale: "The PR-template workflow is something a person consciously decides to run — that's what a slash command is for; skills aren't simply a \"more powerful\" version of the same idea, they solve a different loading problem, discovery instead of explicit invocation." },
    ],
    difficulty: "applied",
  },
  {
    id: "d3-q13",
    domainId: "claude-code-configuration-workflows",
    examConcept: "How skill discovery actually works",
    scenario: "A team is unsure how Claude decides to use a particular skill they've written.",
    prompt: "How does a skill actually get invoked?",
    options: [
      { id: "a", label: "It's manually loaded by the user typing its exact file path at the start of every session.", correct: false, rationale: "This describes manually pasting content in, not how a skill works — a skill doesn't require a person to load it by hand each time." },
      { id: "b", label: "It runs automatically at a fixed lifecycle point, like a hook.", correct: false, rationale: "That describes a hook's deterministic lifecycle trigger — a skill's invocation isn't tied to a lifecycle point, it's tied to task relevance." },
      { id: "c", label: "Claude reads the skill's short description, judges whether the current task matches it, and decides on its own to pull in its fuller instructions when relevant.", correct: true, rationale: "This is how skill discovery actually works — a lightweight description lets the model recognize relevance and invoke the fuller instructions only when the task calls for it." },
      { id: "d", label: "It's triggered the same way as a slash command, by typing its name.", correct: false, rationale: "Conflates a skill with a slash command — a slash command requires an explicit, typed invocation; a skill is discovered based on task relevance, not typed by name." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d3-q14",
    domainId: "claude-code-configuration-workflows",
    examConcept: "Automatic context compaction in long sessions",
    scenario:
      "A very long Claude Code session — many large file reads, long tool outputs — starts approaching its context window limit.",
    prompt: "What happens by default, and what's actually correct?",
    options: [
      { id: "a", label: "The session immediately crashes and all progress is lost.", correct: false, rationale: "Not the default behavior — the harness manages long sessions rather than simply failing outright as the context limit approaches." },
      { id: "b", label: "The harness automatically compacts the conversation — summarizing or trimming earlier turns — so the session can continue without the model or user needing to intervene.", correct: true, rationale: "This is the actual default behavior: automatic compaction keeps the session usable as it nears the context limit, without requiring manual action." },
      { id: "c", label: "Claude silently starts ignoring the system prompt and CLAUDE.md to make room.", correct: false, rationale: "Compaction targets the conversation history, not project instructions — it isn't a mechanism for silently dropping CLAUDE.md or the system prompt specifically." },
      { id: "d", label: "The user must manually copy the whole conversation into a new session to continue.", correct: false, rationale: "This describes a fully manual workaround, not what actually happens — automatic compaction is what handles a long session by default, so this manual step isn't a requirement." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d3-q15",
    domainId: "claude-code-configuration-workflows",
    examConcept: "An oversized CLAUDE.md increases how often compaction has to run",
    scenario:
      "A project's CLAUDE.md has grown to several thousand words, including detailed one-off notes from long-finished tasks, and sessions in that repo seem to compact unusually early.",
    prompt: "What's the most direct fix?",
    options: [
      { id: "a", label: "Increase the model's context window by choosing a different model.", correct: false, rationale: "Doesn't address the actual cause — an oversized CLAUDE.md consumes context in every session regardless of which model is used, and this treats a content problem as a model problem." },
      { id: "b", label: "Trim CLAUDE.md down to durable, broadly relevant project context, and move the finished one-off notes out — they no longer belong in always-loaded content.", correct: true, rationale: "This directly reduces the fixed context cost every session pays before any actual task work begins, which is exactly what's driving compaction to trigger earlier than it should." },
      { id: "c", label: "Add a hook that deletes CLAUDE.md automatically after each session.", correct: false, rationale: "Removes the file's actual purpose — durable project context needs to persist across sessions, not be deleted after each one." },
      { id: "d", label: "Convert CLAUDE.md into a skill so it only loads sometimes.", correct: false, rationale: "CLAUDE.md's entire value is that broadly-relevant context is reliably present every session — converting genuinely durable, broadly-needed content into something conditionally discovered risks it not loading when it's actually needed." },
    ],
    difficulty: "applied",
  },
  {
    id: "d3-q16",
    domainId: "claude-code-configuration-workflows",
    examConcept: "Matching each configuration mechanism to what it's actually good at",
    scenario:
      "A team sets up Claude Code for a shared repo: CLAUDE.md documents their conventions, a hook blocks commits when tests haven't passed, and a slash command runs their release checklist.",
    prompt: "What best describes why this combination works well together?",
    options: [
      { id: "a", label: "All three mechanisms do the same thing, so this is redundant.", correct: false, rationale: "Each mechanism solves a different problem — always-loaded context, deterministic enforcement, and explicit on-demand invocation aren't interchangeable, so this isn't redundancy." },
      { id: "b", label: "Each piece is matched to what it's actually good at: CLAUDE.md for context everyone should know, a hook for a rule that must never be skipped, and a slash command for a workflow someone explicitly triggers.", correct: true, rationale: "This is exactly the right division of labor — matching a durable-context need, an enforcement need, and an on-demand-invocation need to the mechanism built for each." },
      { id: "c", label: "The hook is unnecessary since CLAUDE.md already tells Claude to run tests before committing.", correct: false, rationale: "A CLAUDE.md instruction is a request the model reads, not an enforced gate — the hook is what actually guarantees the check happens, which is a materially different property." },
      { id: "d", label: "The slash command should be replaced with a second hook so the release process runs automatically without anyone asking for it.", correct: false, rationale: "A release is exactly the kind of consequential action a person should consciously decide to trigger — automatically firing it without anyone asking for it removes a decision point that should stay explicit, unlike a lint or test check." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d3-q17",
    domainId: "claude-code-configuration-workflows",
    examConcept: "Scoping permissions to match the actual scope of an engagement",
    scenario:
      "A contractor is given access to Claude Code on a client's repo for a two-week, narrowly-scoped bug fix engagement.",
    prompt: "Which permission setup best fits this engagement?",
    options: [
      { id: "a", label: "Full auto-approval for all tools, including Bash and file edits anywhere in the repo, to move quickly.", correct: false, rationale: "Broader than the engagement needs — a two-week, narrowly-scoped bug fix doesn't require unattended authority over the entire repo, and this maximizes the damage a mistake or a misjudged action could do." },
      { id: "b", label: "Approval scoped to the tools and, where possible, the directories relevant to the bug fix, asking for anything broader.", correct: true, rationale: "This matches authorized access to the actual scope of the engagement — narrow, task-relevant approval with a fallback to asking for anything outside that scope." },
      { id: "c", label: "No tool access at all — the contractor must copy-paste every suggested change manually.", correct: false, rationale: "Overcorrects into a workflow so restrictive it defeats the point of using Claude Code for the engagement at all." },
      { id: "d", label: "Full access, but only after the contractor signs an NDA.", correct: false, rationale: "An NDA addresses a legal/confidentiality concern, not the technical scope of what a tool call is allowed to touch — it doesn't substitute for actually scoping permissions." },
    ],
    difficulty: "exam-style",
  },
  {
    id: "d3-q18",
    domainId: "claude-code-configuration-workflows",
    examConcept: "Matching a need to the right session-lifecycle hook point",
    scenario:
      "A team wants Claude Code to automatically pull the latest branch state at the very start of every session in a repo, and wants to make sure any temp files a session creates get cleaned up when the session ends.",
    prompt: "Which hook lifecycle points fit these two needs?",
    options: [
      { id: "a", label: "Both needs should use PreToolUse hooks.", correct: false, rationale: "PreToolUse fires before an individual tool call, not at session boundaries — it isn't tied to when a session begins or ends as a whole." },
      { id: "b", label: "SessionStart for the branch pull, and Stop for the cleanup.", correct: true, rationale: "These are exactly the lifecycle points that correspond to \"when a session begins\" and \"when a session ends,\" matching each need to its natural trigger." },
      { id: "c", label: "Both needs should use PostToolUse hooks.", correct: false, rationale: "PostToolUse fires after individual tool calls complete, not once at session start or once at session end — it doesn't match either need described." },
      { id: "d", label: "Neither need can be automated with hooks; both require a manual slash command each time.", correct: false, rationale: "Both needs describe an automatic action tied to the session's lifecycle, which is precisely what hooks are for — a manually-typed command would defeat the point of \"automatically\" doing this." },
    ],
    difficulty: "applied",
  },
  {
    id: "d3-q19",
    domainId: "claude-code-configuration-workflows",
    examConcept: "Hooks are deterministic harness behavior, not a model decision",
    scenario:
      "A postmortem says: \"Claude decided to run our lint-check hook before the edit, which is why the bad formatting was caught.\"",
    prompt: "What's inaccurate about that description?",
    options: [
      { id: "a", label: "Nothing — hooks are just another tool the model can choose to invoke.", correct: false, rationale: "This treats a hook like a callable tool the model selects, which isn't what a hook is — the model doesn't choose whether the hook fires." },
      { id: "b", label: "The hook fired automatically at its configured lifecycle point regardless of whether the model \"decided\" anything — describing it as a model decision misattributes a deterministic harness behavior to the model's judgment.", correct: true, rationale: "This corrects the actual mechanism: a hook runs because it's configured at that lifecycle point, not because the model chose to run a check — the catch would have happened even if the model hadn't considered formatting at all." },
      { id: "c", label: "Lint-check hooks only run after an edit, never before one.", correct: false, rationale: "This is a possible configuration detail, not the actual inaccuracy in the postmortem's description — the real issue is attributing the hook's firing to a model decision." },
      { id: "d", label: "The postmortem is correct, and this is standard, precise terminology.", correct: false, rationale: "The description blurs a deterministic, harness-triggered mechanism with a model-driven decision, which is exactly the kind of imprecision that leads to false confidence about what's actually being enforced." },
    ],
    difficulty: "foundational",
  },
  {
    id: "d3-q20",
    domainId: "claude-code-configuration-workflows",
    examConcept: "Mapping a full team workflow to the right mix of mechanisms",
    scenario:
      "A five-engineer team is standardizing Claude Code use on their shared repo. They want: (1) every session to know their branch-naming and commit-message conventions, (2) no PR ever merged without CI passing, (3) engineers to be able to kick off a standard \"prepare release notes\" workflow by name, and (4) Claude to recognize and follow their internal accessibility-review checklist automatically whenever a session touches UI component code, without anyone having to ask for it.",
    prompt: "Which configuration correctly maps each need to a mechanism?",
    options: [
      { id: "a", label: "CLAUDE.md for (1); a hook gating the merge on CI status for (2); a slash command for (3); a skill for (4).", correct: true, rationale: "Each need lands on the mechanism built for it: durable always-loaded context for (1), deterministic enforcement for (2), an explicitly-invoked workflow for (3), and discovered-when-relevant instructions for (4)." },
      { id: "b", label: "CLAUDE.md for all four needs, since CLAUDE.md is the most comprehensive configuration surface.", correct: false, rationale: "Loses the properties that actually matter here — CLAUDE.md can't enforce a merge gate the way a hook can, and it can't be conditionally invoked by name the way a slash command can; treating it as a catch-all sacrifices exactly what makes each mechanism useful." },
      { id: "c", label: "A single skill covering all four needs, since a skill can contain any instructions.", correct: false, rationale: "A skill is discovered when a task seems relevant — it isn't a substitute for guaranteed enforcement (needed for CI gating) or for always-loaded baseline context (needed for conventions everyone should know regardless of task)." },
      { id: "d", label: "Hooks for all four needs, since hooks are the most powerful mechanism.", correct: false, rationale: "Hooks are for deterministic lifecycle-triggered actions — they're not a natural fit for passively-known conventions (1) or an on-demand named workflow (3), which need to be read as context or explicitly invoked, not fired at a fixed lifecycle point." },
    ],
    difficulty: "exam-style",
  },
];
