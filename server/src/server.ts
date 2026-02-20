import { McpServer } from "skybridge/server";
import { z } from "zod";
import { findPerson } from "./lib/apollo.js";
import { scrapeCompanyInfo } from "./lib/scraper.js";

const server = new McpServer(
  { name: "outreachiq", version: "0.0.1" },
  { capabilities: {} },
);

server.registerTool("find_person", {
  description:
    "Look up a person by name and company using Apollo.io. Returns their title, email, LinkedIn URL, and company details.",
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
    const person = await findPerson(name, company);

    if (!person) {
      return {
        content: [
          {
            type: "text" as const,
            text: `No results found for "${name}" at "${company}".`,
          },
        ],
      };
    }

    return {
      structuredContent: person,
      content: [
        {
          type: "text" as const,
          text: [
            `**${person.name}**`,
            person.title ? `Title: ${person.title}` : null,
            person.email ? `Email: ${person.email}` : null,
            person.linkedinUrl ? `LinkedIn: ${person.linkedinUrl}` : null,
            person.company.name ? `Company: ${person.company.name}` : null,
            person.company.industry
              ? `Industry: ${person.company.industry}`
              : null,
            person.company.domain
              ? `Domain: ${person.company.domain}`
              : null,
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
          text: `Error looking up person: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

server.registerTool("scrape_company_info", {
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
});

export default server;
export type AppType = typeof server;
