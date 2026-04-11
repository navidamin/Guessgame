import { describe, it, expect } from 'vitest'
import { firebaseConfigured, db } from './firebase.js'

describe('firebase guard', () => {
  it('is not configured when env vars are placeholders', () => {
    // Test env has REPLACE_ME placeholders, so the guard should
    // evaluate false and db should be null. This confirms the app
    // can still load without real credentials.
    expect(firebaseConfigured).toBe(false)
    expect(db).toBeNull()
  })
})
