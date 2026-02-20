import { useToolInfo } from "../helpers.js";

const skeleton = Array.from({ length: 3 });

export default function SearchPersonWidget() {
  const tool = useToolInfo<"search_person">();

  if (tool.isIdle) return null;

  if (tool.isPending) {
    return (
      <div style={{ fontFamily: "system-ui, sans-serif", padding: 16 }}>
        <p style={{ color: "#666", marginBottom: 12 }}>
          Searching for <strong>{tool.input.name}</strong> at{" "}
          <strong>{tool.input.company}</strong>...
        </p>
        {skeleton.map((_, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: 14,
              marginBottom: 10,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          >
            <div
              style={{
                height: 14,
                width: "60%",
                background: "#e2e8f0",
                borderRadius: 4,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                height: 10,
                width: "90%",
                background: "#e2e8f0",
                borderRadius: 4,
                marginBottom: 6,
              }}
            />
            <div
              style={{
                height: 10,
                width: "40%",
                background: "#e2e8f0",
                borderRadius: 4,
              }}
            />
          </div>
        ))}
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }`}</style>
      </div>
    );
  }

  const results = tool.output.results as {
    title: string;
    snippet: string;
    url: string;
  }[];

  if (results.length === 0) {
    return (
      <div style={{ fontFamily: "system-ui, sans-serif", padding: 16, color: "#666" }}>
        No results found for "{tool.input.name}" at "{tool.input.company}".
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16 }}>
      <h3 style={{ margin: "0 0 12px", fontSize: 15, color: "#1a202c" }}>
        Results for {tool.input.name} at {tool.input.company}
      </h3>
      {results.map((r, i) => (
        <a
          key={i}
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: 14,
            marginBottom: 10,
            textDecoration: "none",
            color: "inherit",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = "#3b82f6")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "#e2e8f0")
          }
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span
              style={{
                color: "#3b82f6",
                fontWeight: 600,
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              {i + 1}.
            </span>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#1a202c" }}>
              {r.title}
            </span>
          </div>
          {r.snippet && (
            <p
              style={{
                margin: "6px 0 4px 22px",
                fontSize: 13,
                color: "#4a5568",
                lineHeight: 1.4,
              }}
            >
              {r.snippet}
            </p>
          )}
          <p
            style={{
              margin: "2px 0 0 22px",
              fontSize: 12,
              color: "#3b82f6",
              wordBreak: "break-all",
            }}
          >
            {r.url}
          </p>
        </a>
      ))}
    </div>
  );
}
