// Admin Authentication management with strong credentials

const CREDENTIALS_KEY = "fika_admin_credentials_v1";
const AUTH_SESSION_KEY = "fika_admin_auth_session";

// Default strong credentials
const DEFAULT_USERNAME = "admin_fika_2026";
const DEFAULT_PASSWORD = "Fika#Master2026!SecureKey";

export interface AdminCredentials {
  username: string;
  passwordHash: string; // Plaintext or encoded in client storage
}

export function getAdminCredentials(): { username: string; password: string } {
  if (typeof window === "undefined") {
    return { username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD };
  }
  try {
    const raw = localStorage.getItem(CREDENTIALS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading credentials:", e);
  }
  return { username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD };
}

export function setAdminCredentials(username: string, password: string): boolean {
  if (!username.trim() || password.length < 8) return false;
  try {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify({ username: username.trim(), password }));
    return true;
  } catch (e) {
    console.error("Error saving credentials:", e);
    return false;
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const token = sessionStorage.getItem(AUTH_SESSION_KEY);
  return token === "authenticated_fika_admin_session";
}

export function loginAdmin(username: string, password: string): { success: boolean; error?: string } {
  const creds = getAdminCredentials();

  if (username.trim() === creds.username && password === creds.password) {
    sessionStorage.setItem(AUTH_SESSION_KEY, "authenticated_fika_admin_session");
    return { success: true };
  }

  return { success: false, error: "Invalid username or password. Please try again." };
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(AUTH_SESSION_KEY);
}
