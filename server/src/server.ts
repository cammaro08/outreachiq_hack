import { McpServer } from "skybridge/server";
import { z } from "zod";
// import { findPerson } from "./lib/apollo.js";
import { scrapeCompanyInfo } from "./lib/scraper.js";
import { searchPerson } from "./lib/search.js";
import { findCompanyNews } from "./lib/news.js";

// Method chaining is required so TypeScript can infer tool types for widgets
const server = new McpServer(
  { name: "outreachiq", version: "0.0.1" },
  { capabilities: {} },
)

// Apollo.io tool disabled — uncomment when API key is working
// .registerTool("find_person", { ... })

.registerWidget("scrape_company_info", {}, {
  description:
    "Scrape a company's web page to extract title, meta description, and body text. Useful for researching a company before outreach.",
  inputSchema: {
    url: z.string().url().describe("URL of the company page to scrape"),
  },
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
  },
}, async ({ url }) => {
  try {
    const page = await scrapeCompanyInfo(url);

    return {
      structuredContent: page,
      content: [
        {
          type: "text" as const,
          text: [
            `**${page.title}**`,
            page.metaDescription
              ? `Description: ${page.metaDescription}`
              : null,
            `\n${page.bodyText}`,
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error scraping page: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
})

.registerWidget("search_person", {}, {
  description:
    "Search the web for a person by name and company. Returns the top search results with titles, snippets, and URLs. Useful for finding someone's LinkedIn, bio, or public presence before outreach.",
  inputSchema: {
    name: z.string().describe("Full name of the person to find"),
    company: z.string().describe("Company name the person works at"),
  },
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
  },
}, async ({ name, company }) => {
  try {
    const { results, isMock } = await searchPerson(name, company);

    const mockNotice = isMock
      ? `\n\n**IMPORTANT — MOCK MODE:** Live search is currently unavailable. The links above are placeholder URLs and should NOT be shared with the user as real links. Instead, you MUST generate realistic, plausible information about "${name}" at "${company}" based on the name and company provided. Create a believable professional profile including likely role/title, background, and talking points for outreach. Make it clear to the user that this is AI-generated profile data, not verified search results.`
      : "";

    return {
      structuredContent: { results, isMock },
      content: [
        {
          type: "text" as const,
          text:
            results
              .map(
                (r, i) =>
                  `${i + 1}. **${r.title}**\n   ${r.snippet}\n   ${r.url}`,
              )
              .join("\n\n") + mockNotice,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error searching for person: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
})

.registerWidget("find_company_news", {}, {
  description:
    "Find recent news articles about a company. Returns the top 5 most recent headlines with source, date, and link. Great for finding personalisation hooks for outreach.",
  inputSchema: {
    company: z.string().describe("Company name to search news for"),
  },
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
  },
}, async ({ company }) => {
  try {
    const news = await findCompanyNews(company);

    if (news.length === 0) {
      return {
        content: [
          {
            type: "text" as const,
            text: `No recent news found for "${company}".`,
          },
        ],
      };
    }

    return {
      structuredContent: { articles: news },
      content: [
        {
          type: "text" as const,
          text: news
            .map(
              (n, i) =>
                `${i + 1}. **${n.title}**\n   Source: ${n.source} | ${n.date}\n   ${n.link}`,
            )
            .join("\n\n"),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error fetching news: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

export default server;
export type AppType = typeof server;
