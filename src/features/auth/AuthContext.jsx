import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../../core/firebase'
import { ALLOWED_UIDS } from '../../core/allowedUsers'

const LOCKOUT_KEY = 'pca_login_lockout_until'
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 30_000

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && ALLOWED_UIDS.includes(firebaseUser.uid)) {
        // Keep a lightweight profile doc so the app can show both partners' names.
        await setDoc(
          doc(db, 'users', firebaseUser.uid),
          {
            email: firebaseUser.email,
            displayName: firebaseUser.email?.split('@')[0] ?? 'User',
            lastLoginAt: serverTimestamp(),
          },
          { merge: true }
        )
        setUser(firebaseUser)
      } else if (firebaseUser) {
        // Authenticated with Firebase but not on the allowed list — reject immediately.
        await signOut(auth)
        setUser(null)
        setAuthError('This account is not authorized to use this app.')
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const login = useCallback(
    async (email, password) => {
      const lockoutUntil = Number(localStorage.getItem(LOCKOUT_KEY) || 0)
      if (Date.now() < lockoutUntil) {
        setAuthError(`Too many attempts. Try again in ${Math.ceil((lockoutUntil - Date.now()) / 1000)}s.`)
        return
      }

      setAuthError('')
      try {
        await signInWithEmailAndPassword(auth, email, password)
        setAttempts(0)
        localStorage.removeItem(LOCKOUT_KEY)
      } catch (err) {
        const nextAttempts = attempts + 1
        setAttempts(nextAttempts)
        if (nextAttempts >= MAX_ATTEMPTS) {
          localStorage.setItem(LOCKOUT_KEY, String(Date.now() + LOCKOUT_MS))
          setAuthError(`Too many attempts. Try again in ${LOCKOUT_MS / 1000}s.`)
        } else if (
          err.code === 'auth/invalid-credential' ||
          err.code === 'auth/wrong-password' ||
          err.code === 'auth/user-not-found'
        ) {
          setAuthError('Incorrect email or password.')
        } else {
          setAuthError('Could not sign in. Check your connection and try again.')
        }
      }
    },
    [attempts]
  )

  const logout = useCallback(() => signOut(auth), [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, authError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
