import { Database, Eye, Globe } from "lucide-react";

import type { NormalizedToolEvent } from "@akapulu/react";

/**
 * Visual overrides for the styled prebuilt `react-ui` demo.
 *
 * `darkStyles` — keys match `AkapuluConversation` `styles` slot props (see package README slot map).
 * `renderDarkToolEvent` — replaces the default tool toast when passed as `renderToolEvent`.
 */

// Icons for RAG / vision / HTTP tool types in the custom toast header
const TOOL_ICON = {
  vision: <Eye size={14} />,
  RAG: <Database size={14} />,
  http: <Globe size={14} />,
};

const monoFont =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

// -----------------------------------------------------------------------------
// Slot inline styles: page shell, loading, errors
// -----------------------------------------------------------------------------
export const darkStyles = {
  container: { maxWidth: 1320, padding: "2rem", gap: "1.5rem", color: "#f3f4f6" },
  title: { color: "#f3f4f6", letterSpacing: "-0.01em" },
  connectedLayout: { gap: "1rem" },
  startButton: { background: "#0070f3", color: "#ffffff" },

  loadingLabel: { color: "#d1d5db" },
  loadingProgressTrack: { background: "#2a2a2a" },
  loadingStatusText: { color: "#9ca3af" },

  errorModalBackdrop: { background: "rgba(0, 0, 0, 0.55)" },
  errorModalCard: {
    background: "#151515",
    color: "#f3f4f6",
    border: "1px solid rgba(239, 68, 68, 0.45)",
  },

  toolToast: {
    background: "linear-gradient(180deg, rgba(15, 23, 42, 0.96) 0%, rgba(2, 6, 23, 0.96) 100%)",
    border: "1px solid rgba(56, 189, 248, 0.35)",
    boxShadow: "0 18px 36px rgba(0, 0, 0, 0.45)",
  },

  // -----------------------------------------------------------------------------
  // Video column + in-call controls
  // -----------------------------------------------------------------------------
  videoPane: { background: "#121212" },
  videoSurface: { border: "none" },
  botStateBadge: {
    color: "#cbd5e1",
    background: "rgba(15, 23, 42, 0.62)",
    borderColor: "rgba(148, 163, 184, 0.26)",
  },
  pip: { borderColor: "rgba(255, 255, 255, 0.25)" },
  waitingVideo: { background: "#232323", color: "#9ca3af" },

  controlMic: {
    border: "1px solid rgba(255, 255, 255, 0.25)",
    background: "rgba(17,24,39,0.88)",
    color: "#ffffff",
  },
  controlCam: {
    border: "1px solid rgba(255, 255, 255, 0.25)",
    background: "rgba(17,24,39,0.88)",
    color: "#ffffff",
  },
  controlEnd: {
    border: "1px solid rgba(255, 255, 255, 0.25)",
    background: "rgba(17,24,39,0.88)",
    color: "#ffffff",
  },

  voiceOnlyControls: { gap: "0.75rem" },
  voiceOnlyControlMic: {
    border: "1px solid rgba(255, 255, 255, 0.25)",
    background: "rgba(17,24,39,0.88)",
    color: "#ffffff",
  },
  voiceOnlyControlEnd: {
    border: "1px solid rgba(255, 255, 255, 0.25)",
    background: "rgba(185, 28, 28, 0.9)",
    color: "#ffffff",
  },

  // -----------------------------------------------------------------------------
  // Transcript column
  // -----------------------------------------------------------------------------
  transcriptPane: { minHeight: 0 },
  transcriptContainer: {
    border: "none",
    background: "#1a1a1a",
  },
  transcriptHeader: {
    background: "#1a1a1a",
  },
  nodeChip: {
    background: "rgba(17, 24, 39, 0.74)",
  },
  transcriptRowUser: {
    background: "#2a4a7a",
    color: "#f8fafc",
  },
  transcriptRowBot: {
    background: "#333333",
    color: "#f8fafc",
  },
};

// -----------------------------------------------------------------------------
// Fixed-position tool toast (driven by visibility flag from `App` timeout)
// -----------------------------------------------------------------------------
export function renderDarkToolEvent(tool: NormalizedToolEvent, isVisible: boolean) {
  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        width: "min(460px, calc(100vw - 32px))",
        borderRadius: 12,
        border: "1px solid rgba(56, 189, 248, 0.35)",
        background: "linear-gradient(180deg, rgba(15,23,42,0.96) 0%, rgba(2,6,23,0.96) 100%)",
        boxShadow: "0 18px 36px rgba(0,0,0,0.45)",
        color: "#e2e8f0",
        overflow: "hidden",
        zIndex: 1200,
      }}
    >
      <div
        style={{
          padding: "10px 12px",
          borderBottom: tool.messageType === "vision" ? "none" : "1px solid rgba(51,65,85,0.9)",
          background: "rgba(15,23,42,0.85)",
          fontSize: 13,
          color:
            tool.messageType === "vision" ? "#67e8f9" : tool.messageType === "RAG" ? "#c4b5fd" : "#6ee7b7",
          fontWeight: 800,
          letterSpacing: "0.02em",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          {TOOL_ICON[tool.messageType as keyof typeof TOOL_ICON] || null}
          {tool.summary}
        </div>

        {tool.messageType !== "vision" ? (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              border: "1px solid rgba(100,116,139,0.35)",
              borderRadius: 999,
              padding: "4px 8px",
              background: "rgba(2,6,23,0.5)",
              maxWidth: "100%",
              fontSize: 12,
              fontWeight: 700,
              color: "#e2e8f0",
              overflowWrap: "anywhere",
              fontFamily: monoFont,
            }}
          >
            {tool.functionName}
          </div>
        ) : null}
      </div>

      {tool.messageType !== "vision" ? (
        <div style={{ padding: 12, display: "grid", gap: 8 }}>
          {tool.messageType === "RAG" && tool.query ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "96px minmax(0, 1fr)",
                gap: 8,
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  color: "#64748b",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  lineHeight: 1.45,
                }}
              >
                QUERY
              </span>
              <span
                style={{
                  color: "#e2e8f0",
                  fontSize: 12,
                  lineHeight: 1.45,
                  overflowWrap: "anywhere",
                }}
              >
                {tool.query}
              </span>
            </div>
          ) : null}

          {tool.messageType === "http" && tool.argsJson ? (
            <>
              <div style={{ color: "#64748b", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>
                ARGUMENTS
              </div>
              <pre
                style={{
                  margin: 0,
                  border: "1px solid rgba(100,116,139,0.22)",
                  borderRadius: 8,
                  padding: "10px 12px",
                  background: "rgba(2,6,23,0.45)",
                  color: "#cbd5e1",
                  fontSize: 12,
                  lineHeight: 1.45,
                  overflowX: "auto",
                  maxHeight: 220,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                  fontFamily: monoFont,
                }}
              >
                {tool.argsJson}
              </pre>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
