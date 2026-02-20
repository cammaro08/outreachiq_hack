import * as cheerio from "cheerio";

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

export interface SearchResponse {
  results: SearchResult[];
  isMock: boolean;
}

/**
 * Try searching via DuckDuckGo lite endpoint (less likely to captcha).
 * Returns null if captcha/blocked.
 */
async function searchDDGLite(query: string): Promise<SearchResult[] | null> {
  const res = await fetch("https://lite.duckduckgo.com/lite/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    },
    body: new URLSearchParams({ q: query }).toString(),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) return null;

  const html = await res.text();
  const $ = cheerio.load(html);

  const results: SearchResult[] = [];
  $("a.result-link").each((_i, el) => {
    if (results.length >= 5) return false;
    const $link = $(el);
    const url = $link.attr("href") ?? "";
    if (url.includes("duckduckgo.com")) return;
    const title = $link.text().trim();
    const snippet =
      $link.closest("tr").next("tr").find(".result-snippet").text().trim();
    if (title && url) results.push({ title, snippet, url });
  });

  if (results.length === 0 && (html.includes("bots use") || html.includes("Please complete"))) {
    return null;
  }

  return results;
}

/**
 * Fallback: DuckDuckGo HTML endpoint with POST form body.
 * Returns null if captcha/blocked.
 */
async function searchDDGHTML(query: string): Promise<SearchResult[] | null> {
  const res = await fetch("https://html.duckduckgo.com/html/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    },
    body: new URLSearchParams({ q: query }).toString(),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) return null;

  const html = await res.text();
  const $ = cheerio.load(html);

  if (html.includes("bots use") || html.includes("Please complete")) {
    return null;
  }

  const results: SearchResult[] = [];
  $(".result").each((_i, el) => {
    if (results.length >= 5) return false;
    const $el = $(el);
    const title = $el.find(".result__title .result__a").text().trim();
    const snippet = $el.find(".result__snippet").text().trim();
    const rawUrl = $el.find(".result__title .result__a").attr("href") ?? "";

    let url = rawUrl;
    try {
      const parsed = new URL(rawUrl, "https://duckduckgo.com");
      url = parsed.searchParams.get("uddg") ?? rawUrl;
    } catch {
      // keep rawUrl
    }

    if (title) results.push({ title, snippet, url });
  });

  return results;
}

export async function searchPerson(
  name: string,
  company: string,
): Promise<SearchResponse> {
  const query = `${name} ${company}`;

  // Try lite endpoint first
  const liteResults = await searchDDGLite(query).catch(() => null);
  if (liteResults && liteResults.length > 0) {
    return { results: liteResults, isMock: false };
  }

  // Fallback to HTML endpoint
  const htmlResults = await searchDDGHTML(query).catch(() => null);
  if (htmlResults && htmlResults.length > 0) {
    return { results: htmlResults, isMock: false };
  }

  // Both blocked — return mock data
  return {
    isMock: true,
    results: [
      {
        title: `${name} - ${company} | LinkedIn`,
        snippet: `View ${name}'s profile on LinkedIn, the world's largest professional community. ${name} is currently at ${company}.`,
        url: `https://www.linkedin.com/in/${name.toLowerCase().replace(/\s+/g, "-")}`,
      },
      {
        title: `${name} - ${company} | About`,
        snippet: `${name} works at ${company}. Learn more about their background, experience, and role.`,
        url: `https://www.${company.toLowerCase().replace(/\s+/g, "")}.com/about`,
      },
      {
        title: `${name} (@${name.toLowerCase().replace(/\s+/g, "")}) | X`,
        snippet: `The latest posts from ${name}. ${company}.`,
        url: `https://x.com/${name.toLowerCase().replace(/\s+/g, "")}`,
      },
    ],
  };
}
