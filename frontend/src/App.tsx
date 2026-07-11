// Styled prebuilt UI demo:
//   - dark theme via `styles`, custom tool toast, custom transcript rows
//   - logs every session event with `useAkapuluEvents`
//   - when the call ends, swaps to a post-call review screen (recording + transcript)
//
// There's no router: `reviewId` state decides which screen to show.

import { useEffect, useRef, useState } from "react";

import { AkapuluProvider, useAkapuluEvents, useAkapuluSession } from "@akapulu/react";
import { AkapuluConversation } from "@akapulu/react-ui";

import { darkStyles, renderDarkToolEvent } from "./customization";
import { ConversationReview } from "./ConversationReview";

const API_BASE = "http://localhost:3001"; // replace with your own backend URL

// Logs every `AkapuluEvent` — handy to see the full event contract while using prebuilt UI.
function ConversationEventLogger() {
  useAkapuluEvents((event) => {
    if (event.type === "status_changed") {
      console.log("[styled-demo][status_changed]", { status: event.status });
      return;
    }

    if (event.type === "bot_speaking_state_changed") {
      console.log("[styled-demo][bot_speaking_state_changed]", { speakingState: event.speakingState });
      return;
    }

    if (event.type === "node_changed") {
      console.log("[styled-demo][node_changed]", { node: event.node });
      return;
    }

    if (event.type === "tool_event") {
      console.log("[styled-demo][tool_event]", {
        messageType: event.tool.messageType,
        functionName: event.tool.functionName,
        summary: event.tool.summary,
        query: event.tool.query,
        argsJson: event.tool.argsJson,
        body: event.tool.body,
        rawMessage: event.tool.rawMessage,
      });
      return;
    }

    if (event.type === "transcript_updated") {
      console.log("[styled-demo][transcript_updated]", {
        id: event.transcript.id,
        speaker: event.transcript.speaker,
        text: event.transcript.text,
        isFinal: event.transcript.isFinal,
        timestamp: event.transcript.timestamp,
      });
      return;
    }

    if (event.type === "call_ready") {
      console.log("[styled-demo][call_ready]");
      return;
    }

    if (event.type === "timeout") {
      console.log("[styled-demo][timeout]", { reason: event.reason });
    }
  });

  return null;
}

// Watches session status and reports the conversation id up once the call ends.
function ConversationEndedWatcher({ onEnded }: { onEnded: (conversationId: string) => void }) {
  const { status, conversationSessionId } = useAkapuluSession();
  const lastConversationIdRef = useRef<string | null>(null);
  const firedConversationIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!conversationSessionId) return;
    lastConversationIdRef.current = conversationSessionId;
  }, [conversationSessionId]);

  useEffect(() => {
    if (status !== "ended") return;
    if (!lastConversationIdRef.current) return;
    if (firedConversationIdRef.current === lastConversationIdRef.current) return;

    firedConversationIdRef.current = lastConversationIdRef.current;
    onEnded(lastConversationIdRef.current);
  }, [status, onEnded]);

  return null;
}

export function App() {
  const [reviewId, setReviewId] = useState<string | null>(null);

  if (reviewId) {
    return <ConversationReview conversationId={reviewId} apiBase={API_BASE} onBack={() => setReviewId(null)} />;
  }

  return (
    <AkapuluProvider
      config={{
        endpoints: {
          connectPath: `${API_BASE}/api/connect`, // create and connect to conversation
          updatesPath: `${API_BASE}/api/updates`, // for loading progress bar
        },
      }}
    >
      <ConversationEndedWatcher onEnded={setReviewId} />
      <ConversationEventLogger />

      <AkapuluConversation
        title="Akapulu prebuilt UI — styled demo"
        styles={darkStyles}
        toolEventTimeoutMs={4000}
        renderToolEvent={(tool) => renderDarkToolEvent(tool, true)}
        renderTranscriptEntry={(entry) => (
          <div>
            <strong>{entry.speaker === "user" ? "User" : "Assistant"}:</strong> {entry.text}
          </div>
        )}
      />
    </AkapuluProvider>
  );
}
