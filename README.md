# Private Couple App — Phase 1: Foundation & Secure Login

## এই ফেজে যা আছে
- Vite + React + Tailwind CSS দিয়ে project foundation
- Firebase Authentication — শুধু ২টা fixed account, কোনো sign-up নেই
- Firestore security rules — শুধু তোমাদের ২ জনের UID ডেটা ছুঁতে পারবে
- Dark / Light theme — system অনুযায়ী default, toggle করা যায়, মনে রাখে
- Home screen shell — দুজনের নাম দেখায়, "encrypted connection" badge, logout
- Login lockout — ৫ বার ভুল হলে ৩০ সেকেন্ড wait করাবে

## এখনো নেই
Chat, media, calls, app lock, couple features — এগুলো Phase 2 থেকে ধাপে ধাপে আসবে। এই ফেজের একমাত্র কাজ: একটা secure foundation যেখানে শুধু তোমরা দুজন ঢুকতে পারো।

---

## ধাপ ১ — Firebase Console সেটআপ

1. https://console.firebase.google.com এ যাও → ইতিমধ্যে একটা project থাকলে সেটা খোলো, নাহলে **Add project** → নাম দাও (যেমন `private-couple-app`) → Create।
2. বাম পাশে **Build > Authentication** → **Get started** → **Sign-in method** ট্যাব → **Email/Password** enable করো → Save।
3. **Authentication > Users** ট্যাব → **Add user** → তোমার account-এর email + একটা strong password দাও → আবার **Add user** করে তোমার সঙ্গীর account বানাও। প্রতিটা user-এর পাশে যে UID (লম্বা অক্ষর-সংখ্যার স্ট্রিং) দেখাবে, সেটা কপি করে রাখো — দুইটাই লাগবে।
4. **Build > Firestore Database** → **Create database** → **Start in production mode** → কাছের একটা region বেছে নাও (South/Southeast Asia হলে `asia-south1` বা `asia-southeast1` ভালো) → Enable।
5. **Firestore Database > Rules** ট্যাব খোলো → এই project-এর `firestore.rules` ফাইলের পুরো লেখাটা কপি করো, কিন্তু পেস্ট করার আগে `REPLACE_WITH_UID_1` আর `REPLACE_WITH_UID_2` জায়গায় ধাপ ৩-এর আসল UID দুটো বসাও → **Publish**।
6. Project settings (⚙️ আইকন) → **General** ট্যাব → নিচে **Your apps** → `</>` (Web) আইকনে ক্লিক → একটা nickname দাও → **Register app** → যে config value গুলো (apiKey, authDomain...) দেখাবে সেগুলো এখন লাগবে না, পরের ধাপে লাগবে।

## ধাপ ২ — নিজের কম্পিউটারে রান করা

1. Node.js ইন্সটল না থাকলে https://nodejs.org থেকে **LTS** version নামাও।
2. আমার দেওয়া zip ফাইলটা unzip করো।
3. সেই folder-এর ভেতর একটা terminal খোলো (Windows: folder-এ right-click → "Open in Terminal"; Mac: folder-এ right-click → Services/New Terminal at Folder, অথবা VS Code দিয়ে খুলে ওখানকার terminal ব্যবহার করো)।
4. রান করো:
   ```
   npm install
   ```
5. `.env.example` ফাইলটার একটা কপি বানাও, নাম দাও `.env` — তারপর তার ভেতরের ৮টা value পূরণ করো: প্রথম ৬টা ধাপ ১.৬ থেকে, শেষ ২টা (UID) ধাপ ১.৩ থেকে।
6. রান করো:
   ```
   npm run dev
   ```
   Terminal-এ একটা `localhost` লিংক দেখাবে — সেটা browser-এ খোলো।

---

## Folder Structure

```
src/
├── core/               → Firebase init, allowed-UID list, theme state
├── features/
│   ├── auth/           → login screen, auth state, route guard
│   └── home/           → post-login home screen
└── shared/              → reusable pieces (theme toggle, brand mark)
```
প্রতিটা ফিচার নিজের ফোল্ডারে আলাদা — নতুন ফিচার (chat, calls...) নিজের `features/` ফোল্ডার হিসেবে যোগ হবে, বাকিদের ছোঁবে না।

## Security নোট
- Firebase-এর config value (apiKey ইত্যাদি) আসলে গোপনীয় কিছু না — এগুলো browser-এ visible থাকাই স্বাভাবিক, real security আসে **Firestore rules** থেকে, যেটা `firestore.rules`-এ লেখা।
- App-এর ভেতরেও একটা check আছে (`allowedUsers.js`) যেটা login হওয়া UID-টা whitelist-এ আছে কিনা দেখে — কিন্তু আসল, ভাঙা-অসম্ভব সুরক্ষা Firestore rules-ই, তাই ধাপ ১.৫ বাদ দেওয়া যাবে না।
- `.env` ফাইলটা কখনো কাউকে পাঠিও না, GitHub-এ push করলেও না (`.gitignore` এমনিতেই ওটা বাদ রাখবে)।

## সমস্যা হলে
- Login page ফাঁকা/সাদা দেখালে → browser-এর DevTools Console খুলে দেখো `[Private Couple App] Missing Firebase config...` মেসেজ আছে কিনা — থাকলে বোঝা যাবে `.env`-এ কোন value বাদ পড়েছে।
- Login করলে কিছুই হচ্ছে না মনে হলে → `.env`-এর `VITE_ALLOWED_UID_1` / `VITE_ALLOWED_UID_2` ঠিকভাবে বসানো আছে কিনা চেক করো — এই দুটো খালি থাকলে ডিজাইন অনুযায়ী **কেউই** ঢুকতে পারবে না (fail-safe)।
- অন্য যেকোনো error message আমাকে কপি-পেস্ট করে পাঠালেই যথেষ্ট, ঠিক করে দেব।

## Design
Duotone brand mark (rose + amber, দুজনকে represent করে) · Fraunces (heading) + Manrope (body) টাইপোগ্রাফি · glassmorphism · dark/light — generic template look এড়িয়ে ইচ্ছাকৃতভাবে বানানো।

## পরের ফেজ
Phase 2 — Core Chat Engine: realtime টেক্সট মেসেজ, client-side encryption, seen/delivered, typing, online status।
