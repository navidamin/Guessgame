# تنگ ماهی (Fishbowl) — Online Party Game

An online, real-time version of the classic **Fishbowl** party game, built in the
same style as the Guessgame project: a single self-contained HTML file
(`fishbowl.html`), Farsi/RTL UI with the Vazirmatn font, Firebase Firestore for
real-time sync, and deployable as a static page (e.g. Cloudflare Pages).

## How the game works

1. **Create / Join** — one player creates a session and gets a 4-character game
   code; everyone else joins with that code on their own phone.
2. **Lobby** — players are auto-balanced into 🔵 Team A (blue) and 🔴 Team B
   (red) and can switch teams. The host picks words-per-player (2–5) and turn
   length (30–90s).
3. **Writing** — every player secretly submits their words/phrases into the
   fishbowl. Progress for all players is shown live.
4. **Playing** — three rounds, all using the same words:
   - **دور ۱ — توضیح آزاد** 💬: describe the word freely, without saying it.
   - **دور ۲ — یک کلمه** 1️⃣: give exactly one word as a clue.
   - **دور ۳ — پانتومیم** 🎭: act it out, no talking.

   Teams alternate turns; the clue-giver rotates within each team. On their
   turn the clue-giver starts a synced countdown, sees words one at a time on
   their own device, and taps **✓ درست بود** (1 point, next word) or
   **↻ رد کن** (word goes back into the bowl). When the timer ends, the
   current word returns to the bowl and the turn passes to the other team.
   A round ends when the bowl is empty.
5. **Winner** — after round 3, the team with the most total points wins.
   The host can restart with the same players.

## Technical notes

- **Firestore collection**: `fishbowl/{CODE}` — one document per session holding
  players, teams, words, bowl, round, and turn state. All clients subscribe with
  `onSnapshot`; all mutations that can race (starting a turn, scoring, skipping,
  ending a turn, advancing rounds) go through `runTransaction`.
- **Timer sync**: the turn stores an `endsAt` timestamp; every client renders the
  remaining time locally. The clue-giver's client finalizes the turn at 0, and
  every other client acts as a safety net 3 seconds later (the transaction makes
  this idempotent), so a disconnected clue-giver can't freeze the game.
- **Identity**: a per-browser player id in `localStorage`; the game code is kept
  in the URL hash so refreshing the page rejoins the session automatically.
- Uses the same Firebase project as the quiz game (`tile-guess-game`) with a
  separate `fishbowl` collection, loaded from the Firebase CDN — no build step.
