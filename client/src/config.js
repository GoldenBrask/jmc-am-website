const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
// Extract base URL (remove /api from the end if present)
const BACKEND_URL = API_URL.replace(/\/api$/, '');

export { API_URL, BACKEND_URL };
