# mcp/

MCP servers the site itself connects to (e.g. a Documentation MCP, a Quiz/Content MCP, a GitHub MCP for the "About This Project" page) — the production use of MCP, distinct from *teaching* MCP, which lives under `content/domains/02-tool-design-mcp/`.

Deliberately empty. Per `architecture/adr/0001-tech-stack.md` and the build philosophy in `CLAUDE.md`, no MCP server gets built here until Domain 2 (Tool Design & MCP Integration) is actually studied — building it earlier would mean shipping infrastructure for a concept the site hasn't taught yet, including to its own author. Tracked as V0.2 in `docs/roadmap.md`.
