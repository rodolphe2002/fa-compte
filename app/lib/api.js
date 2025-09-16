// Determine API base URL
function resolveApiBase() {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) return process.env.NEXT_PUBLIC_API_BASE_URL;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1';
    return isLocal ? 'http://localhost:4000' : 'https://fa-compte-backend.onrender.com';
  }
  // Default for server-side builds
  return 'http://localhost:4000';
}

export const API_BASE = resolveApiBase();

export async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const defaultHeaders = { 'Content-Type': 'application/json' };
  const headers = options.headers ? { ...defaultHeaders, ...options.headers } : defaultHeaders;
  const res = await fetch(url, { ...options, headers });
  return res;
}
