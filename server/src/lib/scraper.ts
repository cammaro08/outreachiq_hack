import * as cheerio from "cheerio";

export interface CompanyPageInfo {
  url: string;
  title: string;
  metaDescription: string;
  bodyText: string;
}

export async function scrapeCompanyInfo(
  url: string,
): Promise<CompanyPageInfo> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; OutreachIQ/1.0; +https://outreachiq.dev)",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  // Strip non-content elements
  $("script, style, nav, footer, header, iframe, noscript").remove();

  const title = $("title").text().trim();
  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() ?? "";
  const bodyText = $("body").text().replace(/\s+/g, " ").trim().slice(0, 3000);

  return { url, title, metaDescription, bodyText };
}
