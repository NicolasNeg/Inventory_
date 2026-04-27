import { useState } from "react";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [user, setUser] = useState("demo");
  const [password, setPassword] = useState("demo");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (user.trim().toLowerCase() !== "demo" || password.trim().toLowerCase() !== "demo") {
      setError("Credenciales demo inválidas. Usa demo / demo.");
      return;
    }
    setError(null);
    onLogin();
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">MEX Insumos</h1>
        <p className="auth-subtitle">Acceso temporal de desarrollo (mock).</p>
        <label className="auth-label">
          Usuario
          <input className="auth-input" value={user} onChange={(e) => setUser(e.target.value)} />
        </label>
        <label className="auth-label">
          Password
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="auth-btn" type="submit">
          Entrar
        </button>
        <button
          className="auth-btn auth-btn--secondary"
          type="button"
          onClick={() => {
            setUser("demo");
            setPassword("demo");
            setError(null);
            onLogin();
          }}
        >
          Entrar como demo
        </button>
        {error ? <p className="auth-error">{error}</p> : null}
      </form>
    </div>
  );
}
