const AUTH_STORAGE_KEY = "inventory_react_mock_session";

export interface AuthSession {
  user: string;
  mode: "mock";
  loginAt: number;
}

export function getSession(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function loginAsDemo(): AuthSession {
  const session: AuthSession = {
    user: "demo",
    mode: "mock",
    loginAt: Date.now()
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function logoutSession(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
