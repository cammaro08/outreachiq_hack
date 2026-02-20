# OutreachIQ

An MCP server for networking follow-up — find people and scrape company info. Built with [Skybridge](https://docs.skybridge.tech).

**Try it now in Claude:** add your deployed URL with `/mcp` appended as a remote MCP server in your Claude settings. Requires a Pro, Team, Max, or Enterprise account.

## Prerequisites

### Node.js (v24.13+)

- macOS: `brew install node`
- Linux / other: [nodejs.org/en/download](https://nodejs.org/en/download)

### pnpm

[pnpm.io/installation](https://pnpm.io/installation)

```bash
npm install -g pnpm
```

### Supabase CLI

- macOS: `brew install supabase/tap/supabase`
- Linux / other: [supabase.com/docs/guides/cli/getting-started](https://supabase.com/docs/guides/cli/getting-started)

### Supabase Project

Create a project at [supabase.com/dashboard](https://supabase.com/dashboard). You will need:

- **Project URL**
- **Service Role Key** — found in Settings > API

### Clerk Project

Create a project at [clerk.com/dashboard](https://clerk.com/dashboard). You will need:

- **Secret Key**
- **Publishable Key**

Enable Dynamic Client Registration (DCR) in the Clerk Dashboard:

1. Go to **Configure** > **Developers** > **OAuth applications** > **Settings**
2. Toggle on **Dynamic client registration**

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

**2. Configure environment variables**

Copy the example env file and fill in your keys (see CLAUDE.md for required keys including APOLLO_API_KEY).

**3. Link your Supabase project and push migrations**

```bash
supabase link
supabase db push
```

**4. Start the dev server**

```bash
pnpm dev
```

The server runs at `http://localhost:3000`. For testing, we recommend using the Skybridge devtools available at [http://localhost:3000](http://localhost:3000) (no `/mcp` suffix).

## Connecting to Claude

When you are ready to test with Claude, tunnel your local server with [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) to expose the MCP endpoint at `/mcp`:

```bash
cloudflared tunnel --url http://localhost:3000
```

Then add your tunnel URL with `/mcp` appended (e.g. `https://xxx.trycloudflare.com/mcp`) as a remote MCP server in Claude settings.

## Alternative: Using Goose (no Claude Pro required)

If you do not have a Claude Pro account, you can use [Goose](https://github.com/block/goose) as a compatible MCP client. **Only version 1.21.2 works** — later versions are broken.

**macOS (Apple Silicon):**

```bash
curl -L https://github.com/block/goose/releases/download/v1.21.2/goose-aarch64-apple-darwin.tar.bz2 | tar xj
sudo mv goose /usr/local/bin/
```

**macOS (Intel):**

```bash
curl -L https://github.com/block/goose/releases/download/v1.21.2/goose-x86_64-apple-darwin.tar.bz2 | tar xj
sudo mv goose /usr/local/bin/
```

**Linux (x86_64):**

```bash
curl -L https://github.com/block/goose/releases/download/v1.21.2/goose-x86_64-unknown-linux-gnu.tar.bz2 | tar xj
sudo mv goose /usr/local/bin/
```

All binaries are available on the [v1.21.2 release page](https://github.com/block/goose/releases/tag/v1.21.2).

## Supabase Commands

```bash
# Link your local project to a remote Supabase project (required once)
supabase link

# Push local migrations to the remote database
supabase db push

# Reset the remote database (drops all data, re-applies migrations)
supabase db reset --linked

# Create a new migration file
supabase migration new <migration_name>

# Check migration status
supabase migration list
```

Migrations live in `supabase/migrations/`. After editing or adding a migration file, run `supabase db push` to apply it to your remote database.

## Deploy to Production

Use [Alpic](https://alpic.ai/) to deploy your app to production:

[![Deploy on Alpic](https://assets.alpic.ai/button.svg)](https://app.alpic.ai/new/clone?repositoryUrl=https%3A%2F%2Fgithub.com%2Falpic-ai%2Foutreachiq_hack)

Then add your deployed URL with `/mcp` appended (e.g. `https://your-app-name.alpic.live/mcp`) as a remote MCP server in Claude settings.

## Resources

- [Skybridge Documentation](https://docs.skybridge.tech/)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Alpic Documentation](https://docs.alpic.ai/)
