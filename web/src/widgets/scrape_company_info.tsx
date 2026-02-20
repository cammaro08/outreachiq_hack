import { useToolInfo } from "../helpers.js";

export default function ScrapeCompanyInfoWidget() {
  const tool = useToolInfo<"scrape_company_info">();

  if (tool.isIdle || tool.isPending) {
    const label =
      tool.isPending
        ? <>Scraping <strong>{tool.input.url}</strong>...</>
        : "Loading...";
    return (
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          padding: 16,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            border: "3px solid rgba(255,255,255,0.15)",
            borderTopColor: "#3b82f6",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span style={{ color: "#ccc", fontSize: 14 }}>{label}</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  const page = tool.output as {
    url: string;
    title: string;
    metaDescription: string;
    bodyText: string;
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: 16,
        maxWidth: 600,
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: 12,
          marginBottom: 12,
        }}
      >
        <a
          href={page.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#e2e8f0",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          {page.title || page.url}
        </a>
        <p style={{ fontSize: 12, color: "#a0aec0", margin: "4px 0 0" }}>
          {page.url}
        </p>
      </div>

      {/* Meta description */}
      {page.metaDescription && (
        <div style={{ marginBottom: 12 }}>
          <h4
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              color: "#a0aec0",
              letterSpacing: "0.05em",
              margin: "0 0 4px",
            }}
          >
            About
          </h4>
          <p style={{ fontSize: 14, color: "#ccc", margin: 0, lineHeight: 1.5 }}>
            {page.metaDescription}
          </p>
        </div>
      )}

      {/* Body text */}
      {page.bodyText && (
        <div
          style={{
            maxHeight: 200,
            overflowY: "auto",
            fontSize: 13,
            color: "#a0aec0",
            lineHeight: 1.6,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 6,
            padding: 12,
          }}
        >
          {page.bodyText}
        </div>
      )}
    </div>
  );
}
