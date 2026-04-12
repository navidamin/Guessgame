// Session lifecycle utilities.
//
// Split into two layers on purpose:
//
//   Pure layer  (generateSessionCode, buildSessionDoc)
//     — no side effects, trivial to unit test
//
//   Side-effect layer  (createSession, joinSession)
//     — reads/writes Firestore through src/lib/firebase.js
//
// Components should only touch the side-effect layer.
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase.js'
import { generateBoard } from './boardGen.js'

// Safe alphabet: omit 0/O/1/I/L so a code read off a screen is
// unambiguous even in bad lighting. 31 chars × 6 positions ≈ 887M codes.
export const SESSION_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
export const SESSION_CODE_LENGTH = 6

export function generateSessionCode(random = Math.random) {
  let code = ''
  for (let i = 0; i < SESSION_CODE_LENGTH; i++) {
    code += SESSION_CODE_ALPHABET.charAt(
      Math.floor(random() * SESSION_CODE_ALPHABET.length)
    )
  }
  return code
}

// Normalizes user input for code lookup.
export function normalizeSessionCode(input) {
  return (input || '').trim().toUpperCase()
}

// Pure function: returns the exact document body that createSession()
// will write. Keeps the Firestore shape unit-testable without mocks.
// `createdAt` is injectable so tests can assert the structure without
// dealing with serverTimestamp sentinels.
export function buildSessionDoc({
  code,
  teamAName,
  teamBName,
  createdAt,
}) {
  return {
    id: code,
    createdAt: createdAt ?? serverTimestamp(),
    status: 'active',
    currentTurn: 'A',
    teams: {
      A: { name: teamAName?.trim() || 'تیم آبی', score: 0 },
      B: { name: teamBName?.trim() || 'تیم قرمز', score: 0 },
    },
    board: generateBoard(code),
  }
}

export class FirebaseNotConfiguredError extends Error {
  constructor() {
    super('Firebase پیکربندی نشده است')
    this.code = 'not-configured'
  }
}

export class SessionNotFoundError extends Error {
  constructor(code) {
    super(`جلسه «${code}» پیدا نشد`)
    this.code = 'not-found'
  }
}

// Creates a new session in Firestore and returns the code.
export async function createSession({ teamAName, teamBName } = {}) {
  if (!db) throw new FirebaseNotConfiguredError()
  const code = generateSessionCode()
  const session = buildSessionDoc({ code, teamAName, teamBName })
  await setDoc(doc(db, 'sessions', code), session)
  return code
}

// Verifies a session exists before the caller navigates into it.
// Returns the normalized code on success, throws on failure.
export async function joinSession(rawCode) {
  if (!db) throw new FirebaseNotConfiguredError()
  const code = normalizeSessionCode(rawCode)
  if (!code) throw new SessionNotFoundError(rawCode)
  const snap = await getDoc(doc(db, 'sessions', code))
  if (!snap.exists()) throw new SessionNotFoundError(code)
  return code
}

// Partial update of a session document. Used by the game loop to
// write board changes, score updates, and turn switches.
export async function updateSession(sessionId, updates) {
  if (!db) throw new FirebaseNotConfiguredError()
  await updateDoc(doc(db, 'sessions', sessionId), updates)
}
