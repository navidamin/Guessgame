import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
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

async function exportQuestions() {
  console.log('Fetching questions from Firestore...');
  const snapshot = await getDocs(collection(db, 'questions'));

  const questions = [];
  snapshot.forEach(doc => {
    questions.push({ id: doc.id, ...doc.data() });
  });

  console.log(`Found ${questions.length} questions`);

  // Summary by topic and difficulty
  const summary = {};
  questions.forEach(q => {
    const key = `${q.topic} | ${q.difficulty}`;
    summary[key] = (summary[key] || 0) + 1;
  });

  console.log('\nBreakdown by topic + difficulty:');
  Object.entries(summary).sort().forEach(([key, count]) => {
    console.log(`  ${key}: ${count}`);
  });

  writeFileSync('scripts/questions-export.json', JSON.stringify(questions, null, 2), 'utf-8');
  console.log('\nExported to scripts/questions-export.json');

  process.exit(0);
}

exportQuestions().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
