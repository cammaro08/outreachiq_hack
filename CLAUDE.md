OutreachIQ — a minimal MCP server exposing two tools for networking follow-up:

- `find_person`: Look up a person by name and company via Apollo.io
- `scrape_company_info`: Scrape a company's web page for research

Built on Skybridge/Express with StreamableHTTP MCP transport. No auth, no database, no UI.

## Dev

- `pnpm dev` to start locally on http://localhost:3000
- Skybridge devtools available at root in dev mode
- Set `APOLLO_API_KEY` in `.env`
