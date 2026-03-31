// Centralized API Base URL for VittaDrishti
// Next.js prefix NEXT_PUBLIC_ makes it available in the browser.
export const API_BASE_URL = (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL) 
  ? process.env.NEXT_PUBLIC_API_URL 
  : "http://localhost:8000";
