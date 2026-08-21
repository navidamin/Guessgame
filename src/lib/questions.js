// Question-collection operations.
//
// Pure helpers (`pickRandom`, `filterByTopicAndDifficulty`) are
// exported so tests can exercise the selection logic without touching
// Firestore. The side-effect layer wraps them with Firestore reads/writes.

import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db } from './firebase.js'
import { SEED_QUESTIONS } from './seedQuestions.js'

export const QUESTIONS_COLLECTION = 'questions'

// Picks a uniformly random element from the list. Returns null for empty.
// The random source is injectable so tests can be deterministic.
export function pickRandom(list, random = Math.random) {
  if (!Array.isArray(list) || list.length === 0) return null
  return list[Math.floor(random() * list.length)]
}

// Pure filter used by fetchRandomQuestion — extracted so we can unit
// test the filtering logic without mocking Firestore.
export function filterByTopicAndDifficulty(questions, topic, difficulty) {
  return questions.filter(
    (q) => q.topic === topic && q.difficulty === difficulty
  )
}

// Picks a random question preferring ones not yet asked in this
// session. Only when every candidate has already been used does it
// fall back to the full list — a repeat beats dead-ending the game
// when the bank for a (topic, difficulty) pair runs dry.
export function pickFreshQuestion(questions, usedIds = [], random = Math.random) {
  const used = new Set(usedIds)
  const fresh = questions.filter((q) => !used.has(q.id))
  return pickRandom(fresh.length > 0 ? fresh : questions, random)
}

// Writes every seed question in a single Firestore batch. setDoc with
// the stable id makes this idempotent — re-running overwrites instead
// of duplicating. Returns the number of docs written.
export async function seedQuestions() {
  if (!db) throw new Error('Firebase not configured')
  const batch = writeBatch(db)
  for (const q of SEED_QUESTIONS) {
    batch.set(doc(db, QUESTIONS_COLLECTION, q.id), q)
  }
  await batch.commit()
  return SEED_QUESTIONS.length
}

// Returns the total number of questions currently in the collection.
// Used by the admin panel to show a live count.
export async function countQuestions() {
  if (!db) throw new Error('Firebase not configured')
  const snap = await getDocs(collection(db, QUESTIONS_COLLECTION))
  return snap.size
}

// Fetches a random question for the given (topic, difficulty) pair,
// skipping ids in `usedIds` (questions already asked this session).
// Returns null if no match exists so the caller can offer a different
// topic rather than crashing.
export async function fetchRandomQuestion(topic, difficulty, usedIds = []) {
  if (!db) throw new Error('Firebase not configured')
  const q = query(
    collection(db, QUESTIONS_COLLECTION),
    where('topic', '==', topic),
    where('difficulty', '==', difficulty)
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return pickFreshQuestion(rows, usedIds)
}
