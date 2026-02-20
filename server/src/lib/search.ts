import * as cheerio from "cheerio";

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

export async function searchPerson(
  name: string,
  company: string,
): Promise<SearchResult[]> {
  const query = encodeURIComponent(`${name} ${company}`);
  const res = await fetch(`https://html.duckduckgo.com/html/?q=${query}`, {
    method: "POST",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw new Error(`Search failed: ${res.status} ${res.statusText}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const results: SearchResult[] = [];

  $(".result").each((i, el) => {
    if (i >= 5) return false; // top 5 only

    const $el = $(el);
    const title = $el.find(".result__title .result__a").text().trim();
    const snippet = $el.find(".result__snippet").text().trim();
    const rawUrl = $el.find(".result__title .result__a").attr("href") ?? "";

    // DuckDuckGo wraps URLs in a redirect — extract the real URL
    let url = rawUrl;
    try {
      const parsed = new URL(rawUrl, "https://duckduckgo.com");
      url = parsed.searchParams.get("uddg") ?? rawUrl;
    } catch {
      // keep rawUrl if parsing fails
    }

    if (title) {
      results.push({ title, snippet, url });
    }
  });

  return results;
}
