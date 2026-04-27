import type { ReactNode } from "react";
import { useState } from "react";
import { getSession, loginAsDemo, logoutSession } from "./authState";
import { LoginPage } from "../pages/LoginPage";

export interface AuthGateState {
  user: string;
  mode: "mock";
  logout: () => void;
}

interface AuthGateProps {
  children: (state: AuthGateState) => ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const [session, setSession] = useState(() => getSession());

  if (!session) {
    return (
      <LoginPage
        onLogin={() => {
          const next = loginAsDemo();
          setSession(next);
        }}
      />
    );
  }

  return children({
    user: session.user,
    mode: session.mode,
    logout: () => {
      logoutSession();
      setSession(null);
    }
  });
}
