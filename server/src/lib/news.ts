import * as cheerio from "cheerio";

export interface NewsItem {
  title: string;
  source: string;
  date: string;
  link: string;
}

export async function findCompanyNews(
  companyName: string,
): Promise<NewsItem[]> {
  const query = encodeURIComponent(companyName);
  const res = await fetch(
    `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`,
    {
      signal: AbortSignal.timeout(10_000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; OutreachIQ/1.0; +https://outreachiq.dev)",
      },
    },
  );

  if (!res.ok) {
    throw new Error(`News fetch failed: ${res.status} ${res.statusText}`);
  }

  const xml = await res.text();
  const $ = cheerio.load(xml, { xmlMode: true });

  const items: NewsItem[] = [];

  $("item").each((i, el) => {
    if (i >= 5) return false; // top 5 only

    const $el = $(el);
    const title = $el.find("title").text().trim();
    const link = $el.find("link").text().trim();
    const pubDate = $el.find("pubDate").text().trim();
    const source = $el.find("source").text().trim();

    if (title) {
      items.push({
        title,
        source: source || "Unknown",
        date: pubDate,
        link,
      });
    }
  });

  return items;
}
