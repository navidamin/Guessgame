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

// ─── 1. Questions to DELETE (too easy for their difficulty tier) ─────────────

const toDelete = [
  // Hard questions that are too easy — universally/widely known answers
  "seed-art-hard-01",            // Van Gogh — "painter who cut his ear" = everyone knows
  "seed-geography-hard-01",      // Alborz — basic Iranian geography
  "seed-geography-hard-02",      // Lut Desert — hints too revealing
  "seed-history-world-hard-02",  // Battle of Waterloo — well-known
  "seed-literature-hard-01",     // Tolstoy — War and Peace is famous
  "seed-music-hard-01",          // Beethoven — one of most famous composers
  "seed-music-hard-02",          // Tombak — well-known in Iran
  "seed-nature-hard-02",         // Simurgh — every Iranian knows this
  "seed-people-hard-01",         // Rumi/Mowlavi — most famous Persian poet
  "seed-science-hard-01",        // Einstein — most famous scientist
  "seed-cinema-world-hard-02",   // Peter Jackson/LOTR — hugely popular
  "seed-sports-hard-01",         // Usain Bolt — very famous athlete

  // Medium questions that are too easy — universally known
  "seed-art-medium-02",          // Mona Lisa — universally known
  "seed-music-medium-01",        // Beatles — universally known
  "seed-sports-medium-01",       // Basketball/Michael Jordan — universally known
];

// ─── 2. Replacement questions ───────────────────────────────────────────────
// Topics: less-known people, places, events, crafts, traditions, dates

const replacements = [

  // ── هنر و معماری ──────────────────────────────────────────────────────────
  // Replaces Van Gogh (hard)
  {
    id: "sort-art-hard-01",
    topic: "هنر و معماری",
    difficulty: "hard",
    hint1: "بزرگ‌ترین نگارگر (مینیاتوریست) ایرانی در دوره تیموری و صفوی.",
    hint2: "در غرب به «رافائل شرق» معروف است و در هرات و تبریز فعالیت می‌کرد.",
    answer: "کمال‌الدین بهزاد"
  },
  // Replaces Mona Lisa (medium)
  {
    id: "sort-art-medium-01",
    topic: "هنر و معماری",
    difficulty: "medium",
    hint1: "هنر سنتی ایرانی که روی فلز با قلم و چکش نقش‌های ظریف ایجاد می‌کند.",
    hint2: "اصفهان مهم‌ترین مرکز این هنر در ایران است و در فهرست میراث ناملموس یونسکو ثبت شده.",
    answer: "قلمزنی"
  },

  // ── جغرافیا ───────────────────────────────────────────────────────────────
  // Replaces Alborz (hard)
  {
    id: "sort-geography-hard-01",
    topic: "جغرافیا",
    difficulty: "hard",
    hint1: "تنگه‌ای که دریای سرخ را به خلیج عدن متصل می‌کند.",
    hint2: "نام آن در عربی به معنای «دروازه اشک‌ها» است و آسیا و آفریقا را جدا می‌کند.",
    answer: "تنگه باب‌المندب"
  },
  // Replaces Lut Desert (hard)
  {
    id: "sort-geography-hard-02",
    topic: "جغرافیا",
    difficulty: "hard",
    hint1: "شهر باستانی ایرانی که گنبد آجری آن بزرگ‌ترین گنبد آجری جهان است.",
    hint2: "در استان زنجان قرار دارد و در فهرست میراث جهانی یونسکو ثبت شده.",
    answer: "سلطانیه"
  },

  // ── تاریخ جهان ────────────────────────────────────────────────────────────
  // Replaces Waterloo (hard)
  {
    id: "sort-history-world-hard-01",
    topic: "تاریخ جهان",
    difficulty: "hard",
    hint1: "پیمان صلحی که پس از جنگ جهانی اول در سال ۱۹۱۹ امضا شد.",
    hint2: "در تالار آینه‌های کاخی نزدیک پاریس امضا شد و غرامت سنگینی بر آلمان تحمیل کرد.",
    answer: "پیمان ورسای"
  },

  // ── ادبیات ────────────────────────────────────────────────────────────────
  // Replaces Tolstoy (hard)
  {
    id: "sort-literature-hard-01",
    topic: "ادبیات",
    difficulty: "hard",
    hint1: "شاعر ایرانی قرن پنجم هجری که مثنوی «ویس و رامین» را سرود.",
    hint2: "این اثر عاشقانه الهام‌بخش «تریستان و ایزولد» در ادبیات اروپا شده است.",
    answer: "فخرالدین اسعد گرگانی"
  },

  // ── موسیقی ────────────────────────────────────────────────────────────────
  // Replaces Beethoven (hard)
  {
    id: "sort-music-hard-01",
    topic: "موسیقی",
    difficulty: "hard",
    hint1: "آهنگساز روسی که باله‌های «دریاچه قو» و «فندق‌شکن» را ساخت.",
    hint2: "از بزرگ‌ترین آهنگسازان دوره رمانتیک و نام خانوادگی‌اش با «چای» شروع می‌شود.",
    answer: "پیوتر ایلیچ چایکوفسکی"
  },
  // Replaces Tombak (hard)
  {
    id: "sort-music-hard-02",
    topic: "موسیقی",
    difficulty: "hard",
    hint1: "اپرای معروفی از جوزپه وردی که داستان آن در مصر باستان می‌گذرد.",
    hint2: "برای جشن گشایش کانال سوئز سفارش داده شد و در سال ۱۸۷۱ در قاهره اجرا شد.",
    answer: "آیدا"
  },
  // Replaces Beatles (medium)
  {
    id: "sort-music-medium-01",
    topic: "موسیقی",
    difficulty: "medium",
    hint1: "ساز بادی ایرانی از جنس نی که در موسیقی سنتی و عرفانی نواخته می‌شود.",
    hint2: "مولانا اشعار زیادی درباره آن سروده و نماد جدایی روح از اصل خود است.",
    answer: "نی"
  },

  // ── طبیعت و حیوانات ───────────────────────────────────────────────────────
  // Replaces Simurgh (hard)
  {
    id: "sort-nature-hard-01",
    topic: "طبیعت و حیوانات",
    difficulty: "hard",
    hint1: "بزرگ‌ترین گل تکی جهان که در جنگل‌های بارانی جنوب شرق آسیا می‌روید.",
    hint2: "انگل گیاهان دیگر است، ساقه و برگ ندارد و بوی بسیار نامطبوعی می‌دهد.",
    answer: "رافلسیا"
  },

  // ── شخصیت‌های مشهور ───────────────────────────────────────────────────────
  // Replaces Rumi (hard)
  {
    id: "sort-people-hard-01",
    topic: "شخصیت‌های مشهور",
    difficulty: "hard",
    hint1: "دانشمند مسلمان قرن دهم و یازدهم میلادی که «پدر نورشناسی مدرن» لقب گرفته.",
    hint2: "کتاب «المناظر» او درباره نور و بینایی قرن‌ها در اروپا مرجع علمی بود.",
    answer: "ابن هیثم"
  },

  // ── علم و فناوری ──────────────────────────────────────────────────────────
  // Replaces Einstein (hard)
  {
    id: "sort-science-hard-01",
    topic: "علم و فناوری",
    difficulty: "hard",
    hint1: "دانشمندی که ساختار دوبل‌مارپیچ DNA را در سال ۱۹۵۳ کشف کرد.",
    hint2: "جیمز واتسون و این دانشمند بریتانیایی جایزه نوبل ۱۹۶۲ را برای این کشف بردند.",
    answer: "فرانسیس کریک"
  },

  // ── سینمای جهان ───────────────────────────────────────────────────────────
  // Replaces Peter Jackson (hard)
  {
    id: "sort-cinema-world-hard-01",
    topic: "سینمای جهان",
    difficulty: "hard",
    hint1: "کارگردان سوئدی که فیلم‌های «مُهر هفتم» و «توت‌فرنگی‌های وحشی» را ساخت.",
    hint2: "از تأثیرگذارترین فیلم‌سازان تاریخ سینما و بیش از ۶۰ فیلم کارگردانی کرد.",
    answer: "اینگمار برگمان"
  },

  // ── ورزش ──────────────────────────────────────────────────────────────────
  // Replaces Usain Bolt (hard)
  {
    id: "sort-sports-hard-01",
    topic: "ورزش",
    difficulty: "hard",
    hint1: "ژیمناست رومانیایی که اولین نمره ۱۰ کامل تاریخ المپیک را کسب کرد.",
    hint2: "در المپیک ۱۹۷۶ مونترال فقط ۱۴ سال داشت و هفت مدال المپیک گرفت.",
    answer: "نادیا کومانچی"
  },
  // Replaces Basketball/MJ (medium)
  {
    id: "sort-sports-medium-01",
    topic: "ورزش",
    difficulty: "medium",
    hint1: "رشته ورزشی که ایران در المپیک بیشترین مدال‌ها را در آن کسب کرده.",
    hint2: "شامل سبک‌های آزاد و فرنگی است و ریشه در ورزش باستانی ایران دارد.",
    answer: "کشتی"
  },
];

// ─── Run ────────────────────────────────────────────────────────────────────

async function run() {
  // Step 1: Delete too-easy questions
  console.log("=== STEP 1: Deleting too-easy questions ===\n");

  let deleted = 0;
  for (const id of toDelete) {
    try {
      await deleteDoc(doc(db, "questions", id));
      console.log(`  ✗ Deleted ${id}`);
      deleted++;
    } catch (err) {
      console.error(`  ! Error deleting ${id}: ${err.message}`);
    }
  }
  console.log(`\n  Deleted ${deleted}/${toDelete.length} questions.\n`);

  // Step 2: Add replacement questions
  console.log("=== STEP 2: Adding replacement questions ===\n");

  let added = 0;
  for (const q of replacements) {
    try {
      await setDoc(doc(db, "questions", q.id), q);
      console.log(`  ✓ Added ${q.id} — ${q.answer} (${q.topic}, ${q.difficulty})`);
      added++;
    } catch (err) {
      console.error(`  ! Error adding ${q.id}: ${err.message}`);
    }
  }
  console.log(`\n  Added ${added}/${replacements.length} questions.\n`);

  // Step 3: Verify final distribution
  console.log("=== STEP 3: Final distribution ===\n");

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
    totals.easy += c.easy;
    totals.medium += c.medium;
    totals.hard += c.hard;
    totals.total += c.total;
  });
  console.log("  ---------------------------|------|------|------|------");
  console.log(`  ${"TOTAL".padEnd(26)} | ${String(totals.easy).padStart(4)} | ${String(totals.medium).padStart(4)} | ${String(totals.hard).padStart(4)} | ${String(totals.total).padStart(4)}`);

  // Export for reference
  writeFileSync('scripts/questions-final.json', JSON.stringify(questions, null, 2), 'utf-8');
  console.log("\n  Exported to scripts/questions-final.json");

  console.log("\n=== Done! ===");
  process.exit(0);
}

run().catch(err => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
