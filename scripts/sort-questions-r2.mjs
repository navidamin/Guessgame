import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, deleteDoc, setDoc, getDocs } from 'firebase/firestore';
import { writeFileSync } from 'fs';

const firebaseConfig = {
  apiKey: "AIzaSyDXQxTWte4GenEBDTLxduq5dAHU_Rkt6TU",
  authDomain: "tile-guess-game.firebaseapp.com",
  projectId: "tile-guess-game",
  storageBucket: "tile-guess-game.firebasestorage.app",
  messagingSenderId: "403631515384",
  appId: "1:403631515384:web:660036bde1acb145a33d0d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ─── Round 2: more too-easy questions to delete ─────────────────────────────

const toDelete = [
  "seed-science-hard-02",        // Omar Khayyam — too famous among Iranians for hard
  "seed-history-iran-medium-02", // Isfahan — "half the world" proverb, everyone knows
  "seed-cinema-iran-medium-02",  // A Separation — most famous Iranian film, too obvious
  "seed-cinema-world-medium-01", // Inception — "Nolan + dreams" = everyone knows
  "seed-cinema-world-medium-02", // Rocky — "Stallone + boxing" = universally known
  "seed-sports-medium-02",       // Rafael Nadal — "King of Clay" = very famous
];

// ─── Replacements: less-known topics, crafts, traditions, events ────────────

const replacements = [
  // Replaces Khayyam (hard, علم و فناوری)
  {
    id: "sort-science-hard-02",
    topic: "علم و فناوری",
    difficulty: "hard",
    hint1: "ذره‌ای زیراتمی که در سال ۲۰۱۲ در آزمایشگاه سرن کشف شد و به آن «ذره خدا» می‌گویند.",
    hint2: "پیتر هیگز فیزیکدان بریتانیایی وجود آن را در سال ۱۹۶۴ پیش‌بینی کرده بود.",
    answer: "بوزون هیگز"
  },

  // Replaces Isfahan (medium, تاریخ ایران)
  {
    id: "sort-history-iran-medium-01",
    topic: "تاریخ ایران",
    difficulty: "medium",
    hint1: "جنبش مردمی دوره قاجار که به تحریم یک کالای وارداتی منجر شد.",
    hint2: "با فتوای میرزای شیرازی در سال ۱۲۷۰ شمسی مردم مصرف تنباکو را ترک کردند.",
    answer: "نهضت تنباکو"
  },

  // Replaces A Separation (medium, سینمای ایران)
  {
    id: "sort-cinema-iran-medium-01",
    topic: "سینمای ایران",
    difficulty: "medium",
    hint1: "فیلم ایرانی محسن مخملباف که در افغانستان فیلم‌برداری شد.",
    hint2: "داستان زنی ایرانی است که برای یافتن خواهرش به شهری در افغانستان سفر می‌کند.",
    answer: "قندهار"
  },

  // Replaces Inception (medium, سینمای جهان)
  {
    id: "sort-cinema-world-medium-01",
    topic: "سینمای جهان",
    difficulty: "medium",
    hint1: "فیلمی از استنلی کوبریک درباره هوش مصنوعی و سفر فضایی.",
    hint2: "کامپیوتر HAL 9000 شخصیت معروف آن است و در سال ۱۹۶۸ اکران شد.",
    answer: "اودیسه فضایی ۲۰۰۱"
  },

  // Replaces Rocky (medium, سینمای جهان)
  {
    id: "sort-cinema-world-medium-02",
    topic: "سینمای جهان",
    difficulty: "medium",
    hint1: "فیلمی از ریدلی اسکات با بازی راسل کرو درباره یک جنگاور رومی.",
    hint2: "در سال ۲۰۰۰ اکران شد و برنده اسکار بهترین فیلم شد.",
    answer: "گلادیاتور"
  },

  // Replaces Nadal (medium, ورزش)
  {
    id: "sort-sports-medium-02",
    topic: "ورزش",
    difficulty: "medium",
    hint1: "مسابقه دوچرخه‌سواری معروفی که هر ساله در فرانسه برگزار می‌شود.",
    hint2: "حدود سه هفته طول می‌کشد و برنده آن پیراهن زرد می‌پوشد.",
    answer: "تور دو فرانس"
  },
];

// ─── Run ────────────────────────────────────────────────────────────────────

async function run() {
  console.log("=== Round 2: Deleting more too-easy questions ===\n");

  for (const id of toDelete) {
    try {
      await deleteDoc(doc(db, "questions", id));
      console.log(`  ✗ Deleted ${id}`);
    } catch (err) {
      console.error(`  ! Error deleting ${id}: ${err.message}`);
    }
  }
  console.log(`\n  Deleted ${toDelete.length} questions.\n`);

  console.log("=== Adding harder replacements ===\n");

  for (const q of replacements) {
    try {
      await setDoc(doc(db, "questions", q.id), q);
      console.log(`  ✓ ${q.id} — ${q.answer} (${q.topic}, ${q.difficulty})`);
    } catch (err) {
      console.error(`  ! Error adding ${q.id}: ${err.message}`);
    }
  }
  console.log(`\n  Added ${replacements.length} replacements.\n`);

  // Verify
  console.log("=== Final distribution ===\n");

  const snapshot = await getDocs(collection(db, "questions"));
  const questions = [];
  snapshot.forEach(d => questions.push({ id: d.id, ...d.data() }));

  const byTopic = {};
  questions.forEach(q => {
    if (!byTopic[q.topic]) byTopic[q.topic] = { easy: 0, medium: 0, hard: 0, total: 0 };
    byTopic[q.topic][q.difficulty]++;
    byTopic[q.topic].total++;
  });

  console.log("  Topic                      | Easy | Med  | Hard | Total");
  console.log("  ---------------------------|------|------|------|------");
  for (const [topic, counts] of Object.entries(byTopic).sort()) {
    const t = topic.padEnd(26);
    console.log(`  ${t} | ${String(counts.easy).padStart(4)} | ${String(counts.medium).padStart(4)} | ${String(counts.hard).padStart(4)} | ${String(counts.total).padStart(4)}`);
  }

  const totals = { easy: 0, medium: 0, hard: 0, total: 0 };
  Object.values(byTopic).forEach(c => {
    totals.easy += c.easy; totals.medium += c.medium;
    totals.hard += c.hard; totals.total += c.total;
  });
  console.log("  ---------------------------|------|------|------|------");
  console.log(`  ${"TOTAL".padEnd(26)} | ${String(totals.easy).padStart(4)} | ${String(totals.medium).padStart(4)} | ${String(totals.hard).padStart(4)} | ${String(totals.total).padStart(4)}`);

  writeFileSync('scripts/questions-final.json', JSON.stringify(questions, null, 2), 'utf-8');
  console.log("\n  Exported to scripts/questions-final.json");
  console.log("\n=== Done! ===");
  process.exit(0);
}

run().catch(err => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
