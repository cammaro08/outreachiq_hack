OutreachIQ — a minimal MCP server exposing three tools for networking follow-up:

- `search_person`: Search the web for a person by name + company (DuckDuckGo)
- `scrape_company_info`: Scrape a company's web page for research
- `find_company_news`: Find recent news about a company (Google News RSS)

Each tool has a companion Skybridge widget (`web/src/widgets/`) that renders loading states and rich UI in compatible clients.

Apollo.io `find_person` tool is commented out in `server/src/server.ts` (API key issues). Uncomment it and `server/src/env.ts` to re-enable.

Built on Skybridge/Express with StreamableHTTP MCP transport. No auth, no database, no UI. No API keys needed.

## Dev

- `pnpm dev` to start locally on http://localhost:3000
- Skybridge devtools available at root in dev mode
