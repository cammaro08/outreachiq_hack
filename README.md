# OutreachIQ

An MCP server for networking follow-up — search for people, scrape company info, and find recent company news. Built with [Skybridge](https://docs.skybridge.tech).

**Try it now in Claude:** add your deployed URL with `/mcp` appended as a remote MCP server in your Claude settings. Requires a Pro, Team, Max, or Enterprise account.

## Tools

| Tool | Description | API Key? |
|------|-------------|----------|
| `search_person` | Search the web for a person by name + company via DuckDuckGo. Returns top results with titles, snippets, and URLs. | No |
| `scrape_company_info` | Scrape a company's web page to extract title, meta description, and body text. | No |
| `find_company_news` | Find the 5 most recent news articles about a company via Google News RSS. | No |
| `find_person` | Look up a person via Apollo.io (currently **disabled** — commented out pending API key fix). | Yes (`APOLLO_API_KEY`) |

## Prerequisites

### Node.js (v24.13+)

- macOS: `brew install node`
- Linux / other: [nodejs.org/en/download](https://nodejs.org/en/download)

### pnpm

[pnpm.io/installation](https://pnpm.io/installation)

```bash
npm install -g pnpm
```

### Claude Code (optional, for AI-assisted development)

[docs.anthropic.com/en/docs/claude-code/overview](https://docs.anthropic.com/en/docs/claude-code/overview)

```bash
npm install -g @anthropic-ai/claude-code
```

## Setup

**1. Install dependencies**

```bash
pnpm i
```

**2. Start the dev server**

```bash
pnpm dev
```

No `.env` file or API keys are needed — all active tools use free public APIs.

> **Note:** To re-enable the Apollo.io `find_person` tool, uncomment the code in `server/src/server.ts` and `server/src/env.ts`, then set `APOLLO_API_KEY` in a `.env` file.

The server runs at `http://localhost:3000`. For testing, use the Skybridge devtools available at [http://localhost:3000](http://localhost:3000).

## Connecting to Claude

When you are ready to test with Claude, tunnel your local server with [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) to expose the MCP endpoint at `/mcp`:

```bash
cloudflared tunnel --url http://localhost:3000
```

Then add your tunnel URL with `/mcp` appended (e.g. `https://xxx.trycloudflare.com/mcp`) as a remote MCP server in Claude settings.

## Deploy to Production

Use [Alpic](https://alpic.ai/) to deploy your app to production:

[![Deploy on Alpic](https://assets.alpic.ai/button.svg)](https://app.alpic.ai/new/clone?repositoryUrl=https%3A%2F%2Fgithub.com%2Falpic-ai%2Foutreachiq_hack)

Then add your deployed URL with `/mcp` appended (e.g. `https://your-app-name.alpic.live/mcp`) as a remote MCP server in Claude settings.

## Resources

- [Skybridge Documentation](https://docs.skybridge.tech/)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Alpic Documentation](https://docs.alpic.ai/)
