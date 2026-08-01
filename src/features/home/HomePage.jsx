import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { LogOut, ShieldCheck } from 'lucide-react'
import { db } from '../../core/firebase'
import { ALLOWED_UIDS } from '../../core/allowedUsers'
import { useAuth } from '../auth/AuthContext'
import ThemeToggle from '../../shared/ThemeToggle'
import BrandMark from '../../shared/BrandMark'

function useProfile(uid) {
  const [profile, setProfile] = useState(null)
  useEffect(() => {
    if (!uid) return
    const unsubscribe = onSnapshot(doc(db, 'users', uid), (snap) => {
      setProfile(snap.exists() ? snap.data() : null)
    })
    return unsubscribe
  }, [uid])
  return profile
}

export default function HomePage() {
  const { user, logout } = useAuth()
  const partnerUid = ALLOWED_UIDS.find((uid) => uid !== user?.uid)
  const myProfile = useProfile(user?.uid)
  const partnerProfile = useProfile(partnerUid)

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <header className="flex items-center justify-between border-b border-stone-200 px-5 py-3.5 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <BrandMark size={28} />
          <div>
            <p className="text-sm font-semibold text-stone-900 dark:text-white">Private Couple App</p>
            <p className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-3 w-3" />
              Encrypted connection
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={logout}
            className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-white/10"
            aria-label="Log out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-sm px-5 py-14 text-center">
        <h2 className="font-display text-xl font-semibold text-stone-900 dark:text-white">
          Welcome back, {myProfile?.displayName ?? '…'} 👋
        </h2>
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
          {partnerProfile
            ? `You and ${partnerProfile.displayName} are both connected.`
            : "Your partner hasn't signed in yet — once they do, you'll both be connected."}
        </p>

        <div className="mt-10 rounded-2xl border border-dashed border-stone-300 p-6 text-sm text-stone-500 dark:border-white/10 dark:text-stone-400">
          This confirms your secure login works. Chat, calls, and everything else unlock as we build the next
          phases.
        </div>
      </main>
    </div>
  )
}
