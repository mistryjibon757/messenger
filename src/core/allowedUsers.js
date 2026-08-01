// The only two people who will ever be allowed into this app.
// Filled in from Firebase Console > Authentication > Users after Phase 1 setup.
export const ALLOWED_UIDS = [
  import.meta.env.VITE_ALLOWED_UID_1,
  import.meta.env.VITE_ALLOWED_UID_2,
].filter(Boolean)
