import { createGoogleScriptRunMock } from "./googleScriptRunMock";

declare global {
  interface Window {
    google?: {
      script: {
        run: ReturnType<typeof createGoogleScriptRunMock>;
        host: {
          close: () => void;
        };
      };
    };
  }
}

function shouldUseMock(): boolean {
  if (typeof window === "undefined" || typeof location === "undefined") return false;
  if (window.google?.script?.run) return false;

  const query = new URLSearchParams(location.search);
  const forced = query.get("mock") === "1";
  const isLocalHost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  const isFileProtocol = location.protocol === "file:";
  const isGithubPages = location.hostname.endsWith("github.io");

  return forced || isLocalHost || isFileProtocol || isGithubPages;
}

export function installGoogleScriptRunMock(): void {
  if (!shouldUseMock()) return;

  window.google = {
    script: {
      run: createGoogleScriptRunMock(),
      host: {
        close: () => {
          console.warn("[MOCK] google.script.host.close() sin efecto en entorno local.");
        }
      }
    }
  };
}
