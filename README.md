# Akapulu Labs prebuilt UI — styled example

The prebuilt conversation UI with a custom dark theme, a custom tool toast, and a
post-call review screen (recording + transcript).

Two folders:

- **`backend/`** — Express server that holds your API key and calls Akapulu
- **`frontend/`** — React app (Vite) with the styled prebuilt UI + post-call review

## Prerequisites

- **Node.js 20+** and npm
- An **Akapulu API key** — <https://akapulu.com/api-keys>
- A **scenario** — <https://akapulu.com/scenarios> ([guide](https://docs.akapulu.com/guides/scenarios/overview))

---

## Setup

### 1) Clone and enter the repo

```bash
git clone https://github.com/Akapulu/prebuilt-ui-styled.git && cd prebuilt-ui-styled
```

### 2) Backend

```bash
# From prebuilt-ui-styled/
cd backend && npm install
```

#### Set your api key

```bash
# From prebuilt-ui-styled/backend/
cp .env.example .env.local
```

Open `backend/.env.local` and add your API key:

```env
AKAPULU_API_KEY=your_real_api_key_here
```

#### Set your scenario id

Open `backend/server.ts` and replace `<your-scenario-id>`:

```ts
const connectPayload = {
  scenario_id: "<your-scenario-id>", // <--- replace with your scenario id
  avatar_id: "1285bfe4-3512-4b34-93ad-196098597a1c",
  runtime_vars: {},
  record_conversation: true,
};
```

`record_conversation: true` is required for the post-call review to have a recording to show.

You can leave `avatar_id` as-is (public catalog avatar) or pick another from the [avatar catalog](https://docs.akapulu.com/guides/avatars/avatar-catalog).

Start the backend (`localhost:3001`). Leave this terminal open.

```bash
# From prebuilt-ui-styled/backend/
npm run dev
```

### 3) Frontend

Open a **second** terminal.

```bash
# From prebuilt-ui-styled/
cd frontend && npm install
```

```bash
# From prebuilt-ui-styled/frontend/
npm run dev
```

Open <http://localhost:5173> and click **Start Call**. When the call ends, you land on the review screen.

---

## How it works

The frontend (`localhost:5173`) calls your backend (`localhost:3001`).
Your backend calls Akapulu with your API key.

### Backend (`backend/server.ts`)

```ts
// POST /api/connect              →  starts a conversation (record_conversation: true)
// GET  /api/updates              →  polled while the avatar boots
// GET  /api/conversation-details →  transcript + metadata for the review screen
// GET  /api/recording            →  streams the recorded video
```

### Frontend

- **`src/App.tsx`** — the styled `AkapuluConversation` (dark `styles`, custom tool toast,
  custom transcript rows) plus an event logger. When the call ends it switches to the
  review screen. There's no router — a single `reviewId` state decides which screen shows.
- **`src/customization.tsx`** — the `darkStyles` object and the custom tool toast renderer.
- **`src/ConversationReview.tsx`** — post-call screen; fetches details and polls until the
  recording is ready.

---

## File tree

```text
prebuilt-ui-styled/
├── README.md, LICENSE, .gitignore
|
├── backend/
│   ├── package.json      # @akapulu/server
│   ├── tsconfig.json
│   ├── .env.example
│   └── server.ts         # connect + updates + conversation-details + recording
|
└── frontend/
    ├── package.json      # @akapulu/react, @akapulu/react-ui
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx                     # styled conversation + ended → review switch
        ├── customization.tsx           # darkStyles + custom tool toast
        ├── ConversationReview.tsx      # post-call recording + transcript
        └── ConversationReview.module.css
```
