import type { PropsWithChildren } from "react";
import { useState } from "react";
import { AppSidebar } from "./AppSidebar";

export function AppShell({ children }: PropsWithChildren) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-shell">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div className="app-shell__main">
        <header className="app-shell__header">
          <div className="app-shell__status">
            <span className="app-shell__status-dot" /> Sistema en línea
          </div>
        </header>
        <main className="app-shell__content">{children}</main>
      </div>
    </div>
  );
}
