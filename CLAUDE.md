# CLAUDE.md — بازی کاشی

## What This Project Is
A real-time 2v2 multiplayer tile quiz game. Two teams take turns selecting tiles on a 7x7 grid. Each tile holds a quiz question. Correct answers build houses, wrong answers burn tiles. Built for a shared screen (TV/laptop) with Firebase real-time sync.

---

## Stack
- React + Vite
- Tailwind CSS
- Firebase Firestore (real-time)
- Deployed on Cloudflare Pages via GitHub

---

## Project Structure
```
/src
  /components
    Board.jsx          # 7x7 grid
    Tile.jsx           # individual tile
    ScoreBar.jsx       # top score display
    TopicPicker.jsx    # modal: pick 1 of 3 topics
    QuestionCard.jsx   # hint1, hint2, answer input
    AdminPanel.jsx     # /admin route
  /hooks
    useSession.js      # firestore session listener
    useBoard.js        # board state + tile logic
    useQuestion.js     # fetch + manage question flow
  /lib
    firebase.js        # firebase init
    boardGen.js        # board generation (water placement)
    gameLogic.js       # burnt mechanic, score rules
  /pages
    Home.jsx           # create/join session
    Game.jsx           # main game screen
    Admin.jsx          # question management
  App.jsx
  main.jsx
/public
.env                   # Firebase credentials (never commit)
PLAN.md
CLAUDE.md
```

---

## Core Game Rules (Read Carefully)

### Board
- 7x7 grid = 49 tiles
- ~8-10 tiles are **water** (randomly placed at session creation, seeded)
- Remaining tiles are **grassland**, each pre-assigned a difficulty (easy/medium/hard) and a score (100/200/300)

### Tile States
| State | Selectable | Description |
|-------|-----------|-------------|
| `water` | No | Decorative blocker |
| `grassland` | Yes | Has question, shows difficulty |
| `house` | No | Owned by team A or B |
| `burnt` | No | Result of wrong answer |

### Turn Flow
1. Current team selects any valid `grassland` tile
2. Modal shows 3 random topics (from 12)
3. Team picks topic
4. Question pulled from Firestore: `WHERE topic == selected AND difficulty == tile.difficulty` → random from results
5. Show **hint1**
6. Team can request **hint2** → deduct 30 from tile score (minimum 0)
7. Team submits answer
8. **Correct** → tile becomes `house`, owned by current team, score added
9. **Wrong** → tile becomes `burnt`, trigger burnt mechanic

### Burnt Mechanic
```
When tile T becomes burnt:
  1. Find all adjacent tiles (up/down/left/right) that are houses
  2. Pick ONE at random
  3. That house → becomes vacant grassland (assign new random questionId)
  4. T stays burnt

When a new house H is built:
  1. Find all adjacent tiles of H that are burnt
  2. Those burnt tiles → become grassland (assign new random questionId)
```

### Score
- easy tile: 100 pts
- medium tile: 200 pts  
- hard tile: 300 pts
- hint2 used: -30 from tile score
- Score displayed per team in ScoreBar at top

---

## Firebase Collections

### `questions`
```js
{
  id: string,
  topic: string,           // one of 12 topics
  difficulty: "easy" | "medium" | "hard",
  hint1: string,           // Farsi
  hint2: string,           // Farsi
  answer: string,          // Farsi
}
```

### `sessions`
```js
{
  id: string,
  createdAt: timestamp,
  status: "waiting" | "active" | "finished",
  currentTurn: "A" | "B",
  teams: {
    A: { name: string, score: number },
    B: { name: string, score: number }
  },
  board: [
    {
      id: number,          // 0-48
      row: number,
      col: number,
      type: "water" | "grassland" | "house" | "burnt",
      difficulty: "easy" | "medium" | "hard" | null,
      score: 100 | 200 | 300 | null,
      ownedBy: null | "A" | "B",
      questionId: string | null
    }
  ]
}
```

### `sessions/{id}/events`
```js
{
  turn: number,
  team: "A" | "B",
  tileId: number,
  action: "correct" | "wrong" | "hint2_used",
  scoreChange: number,
  timestamp: timestamp
}
```

---

## 12 Topics
```js
const TOPICS = [
  "جغرافیا",
  "تاریخ ایران",
  "تاریخ جهان",
  "سینمای ایران",
  "سینمای جهان",
  "موسیقی",
  "ورزش",
  "علم و فناوری",
  "ادبیات",
  "هنر و معماری",
  "طبیعت و حیوانات",
  "شخصیت‌های مشهور"
]
```

---

## Environment Variables
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## Admin Panel
- Route: `/admin`
- Simple password protection (hardcoded env var is fine for now)
- Features:
  - Add single question (form)
  - Upload batch JSON
  - List questions (filter by topic / difficulty)
  - Delete question
- Admin does NOT manage game sessions

---

## UI Notes
- Font: **Vazirmatn** (Google Fonts) — RTL
- Direction: `dir="rtl"` on root
- Team A color: Blue
- Team B color: Red
- Tile colors:
  - water: blue-400
  - grassland: green-400 (shade by difficulty: easy=light, hard=dark)
  - house A: blue-600
  - house B: red-600
  - burnt: gray-800 / orange-900

---

## Current Phase
**Start at Phase 1:**
1. Init Vite + React + Tailwind
2. Set up Firebase (Firestore)
3. Create `.env` with placeholder vars
4. Basic routing (Home, Game, Admin)
5. Deploy to Cloudflare Pages

Do NOT start building game logic until board renders correctly and Firebase connection is confirmed working.

---

## Notes for Claude Code
- Always keep game state in Firestore — never local state for anything that needs to sync
- Board is generated once at session creation and stored in Firestore — not regenerated
- When fetching a question, pick randomly client-side from the returned Firestore results (don't rely on Firestore ordering)
- All user-facing text is in Farsi
- Keep components small and single-responsibility
