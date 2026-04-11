# بازی کاشی — Project Plan

## Overview
A real-time multiplayer tile-based quiz game for 2 teams (2v2), played on a shared screen (laptop/TV) with a 7x7 grid. Built with React + Vite, Firebase Firestore, deployed on Cloudflare Pages.

---

## Tech Stack
- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **Realtime DB:** Firebase Firestore
- **Hosting:** Cloudflare Pages
- **Repo:** GitHub

---

## Firebase Data Schema

### `/questions/{questionId}`
```json
{
  "id": "string",
  "topic": "string",
  "difficulty": "easy" | "medium" | "hard",
  "hint1": "string (Farsi)",
  "hint2": "string (Farsi)",
  "answer": "string (Farsi)",
  "usedInSessions": []
}
```

### `/sessions/{sessionId}`
```json
{
  "id": "string",
  "createdAt": "timestamp",
  "status": "waiting" | "active" | "finished",
  "currentTurn": "A" | "B",
  "teams": {
    "A": { "name": "string", "score": 0 },
    "B": { "name": "string", "score": 0 }
  },
  "board": [
    {
      "id": 0,
      "row": 0,
      "col": 0,
      "type": "water" | "grassland" | "house" | "burnt",
      "difficulty": "easy" | "medium" | "hard",
      "score": 100 | 200 | 300,
      "ownedBy": null | "A" | "B",
      "questionId": "string | null"
    }
  ]
}
```

### `/sessions/{sessionId}/events/{eventId}`
```json
{
  "turn": 1,
  "team": "A" | "B",
  "tileId": 0,
  "action": "correct" | "wrong" | "hint2_used",
  "scoreChange": 100,
  "timestamp": "timestamp"
}
```

---

## Board Rules

### Tile Types
| Type | Description |
|------|-------------|
| `water` | Impassable, decorative, strategic blocker |
| `grassland` | Selectable, has a quiz question assigned |
| `house` | Owned by a team, shows team color |
| `burnt` | Result of wrong answer, blocks area |

### Tile Score by Difficulty
| Difficulty | Score |
|------------|-------|
| easy | 100 |
| medium | 200 |
| hard | 300 |

### Selection Rules
- A team may select **any grassland tile** on their turn (not restricted to adjacent)
- Water tiles are **never selectable**
- Burnt tiles are **never selectable**
- House tiles are **never selectable**

### Burnt Tile Mechanic
- Wrong answer → tile becomes **burnt**
- Burnt tile ruins **one random adjacent house** → that house becomes **vacant grassland** with a new random question
- Burnt tile itself becomes **grassland again** only when a **new house is built adjacent to it**

### Question Flow per Turn
1. Team selects a tile
2. Game shows **3 random topics** (from 12 total)
3. Team picks a topic
4. A random question is pulled from Firestore (matching topic + tile difficulty)
5. **Hint 1** is shown → team discusses → submits answer
6. Team may request **Hint 2** → -30 points deducted from potential score
7. **Correct** → tile becomes house, score added to team
8. **Wrong** → tile becomes burnt, burnt mechanic triggers

---

## 12 Topics (Farsi)
1. جغرافیا
2. تاریخ ایران
3. تاریخ جهان
4. سینمای ایران
5. سینمای جهان
6. موسیقی
7. ورزش
8. علم و فناوری
9. ادبیات
10. هنر و معماری
11. طبیعت و حیوانات
12. شخصیت‌های مشهور

---

## Roadmap

### Phase 1 — Project Scaffold
- [ ] Vite + React + Tailwind setup
- [ ] Firebase project creation + Firestore config
- [ ] `.env` setup with Firebase credentials
- [ ] Deploy empty app to Cloudflare Pages
- [ ] GitHub repo connected to Cloudflare

### Phase 2 — Board Rendering
- [ ] 7x7 grid component
- [ ] Random water tile generation (seeded, ~8-10 water tiles)
- [ ] Tile type rendering (water / grassland / house / burnt)
- [ ] Team color on house tiles
- [ ] Score indicator on each house tile
- [ ] Difficulty indicator on grassland tiles

### Phase 3 — Session Management
- [ ] Home screen: Create session / Join session by code
- [ ] Team name entry
- [ ] Session state synced via Firestore real-time listeners
- [ ] Turn indicator UI
- [ ] Score totals displayed top of screen

### Phase 4 — Game Logic
- [ ] Tile selection (valid tiles only)
- [ ] Topic picker modal (3 random from 12)
- [ ] Question fetch from Firestore
- [ ] Hint 1 display
- [ ] Hint 2 button with -30 deduction
- [ ] Correct / Wrong answer handling
- [ ] Burnt tile mechanic (ruins adjacent house, revive on new adjacent house)
- [ ] Turn switching

### Phase 5 — Admin Panel
- [ ] `/admin` route with simple password protection
- [ ] Add single question form
- [ ] Batch JSON upload
- [ ] View all questions (filterable by topic/difficulty)
- [ ] Delete question

### Phase 6 — Polish
- [ ] Farsi font (Vazirmatn) + RTL layout
- [ ] Tile animations (flip, burn, house build)
- [ ] Sound effects (optional)
- [ ] Mobile-friendly board view
- [ ] End game screen with winner

---

## Question Generation (Parallel Session)
Once Phase 4 schema is locked, open a separate Claude session with:
- The exact question JSON schema
- List of 12 topics
- Instructions to generate 50 questions per topic in Farsi
- Batch export as JSON for Firebase import

---

## Deployment
- Push to GitHub
- Connect repo to Cloudflare Pages
- Set environment variables in Cloudflare dashboard
- Auto-deploy on every push to `main`
