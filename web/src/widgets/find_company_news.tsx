import { useToolInfo } from "../helpers.js";

const skeletonItems = Array.from({ length: 4 });

export default function FindCompanyNewsWidget() {
  const tool = useToolInfo<"find_company_news">();

  if (tool.isIdle || tool.isPending) {
    const label =
      tool.isPending
        ? <>Finding news for <strong>{tool.input.company}</strong>...</>
        : "Loading...";
    return (
      <div style={{ fontFamily: "system-ui, sans-serif", padding: 16 }}>
        <p style={{ color: "#ccc", marginBottom: 14, fontSize: 14 }}>{label}</p>
        <div style={{ position: "relative", paddingLeft: 20 }}>
          {skeletonItems.map((_, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                paddingBottom: 18,
                paddingLeft: 16,
                borderLeft: "2px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: -6,
                  top: 4,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
              <div
                style={{
                  height: 12,
                  width: `${60 + i * 5}%`,
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 4,
                  marginBottom: 6,
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
              <div
                style={{
                  height: 10,
                  width: "30%",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 4,
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            </div>
          ))}
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }`}</style>
      </div>
    );
  }

  const articles = tool.output.articles as {
    title: string;
    source: string;
    date: string;
    link: string;
  }[];

  if (articles.length === 0) {
    return (
      <div style={{ fontFamily: "system-ui, sans-serif", padding: 16, color: "#aaa" }}>
        No recent news found for "{tool.input.company}".
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16 }}>
      <h3 style={{ margin: "0 0 14px", fontSize: 15, color: "#e2e8f0" }}>
        News &mdash; {tool.input.company}
      </h3>
      <div style={{ position: "relative", paddingLeft: 20 }}>
        {articles.map((article, i) => {
          const formatted = formatDate(article.date);
          return (
            <div
              key={i}
              style={{
                position: "relative",
                paddingBottom: i === articles.length - 1 ? 0 : 20,
                paddingLeft: 16,
                borderLeft:
                  i === articles.length - 1
                    ? "2px solid transparent"
                    : "2px solid rgba(255,255,255,0.1)",
              }}
            >
              {/* Timeline dot */}
              <div
                style={{
                  position: "absolute",
                  left: -6,
                  top: 4,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#3b82f6",
                }}
              />
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#e2e8f0",
                  textDecoration: "none",
                  lineHeight: 1.4,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#3b82f6")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#e2e8f0")
                }
              >
                {article.title}
              </a>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#3b82f6",
                    background: "rgba(59,130,246,0.15)",
                    padding: "2px 8px",
                    borderRadius: 10,
                  }}
                >
                  {article.source}
                </span>
                {formatted && (
                  <span style={{ fontSize: 12, color: "#a0aec0" }}>
                    {formatted}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDate(raw: string): string {
  try {
    const d = new Date(raw);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return raw;
  }
}
