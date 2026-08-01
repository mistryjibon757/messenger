import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/messenger/', // ⬅️ আপনার রিপো নাম বসান। স্ল্যাশ (/) দুই পাশে দিতে ভুলবেন না।
  server: {
    port: 5173,
  },
})
