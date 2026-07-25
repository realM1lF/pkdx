/// <reference types="vite/client" />

interface Window {
  plausible?: ((event: string, options?: Record<string, unknown>) => void) & {
    q?: unknown[];
    init?: (options?: Record<string, unknown>) => void;
    o?: Record<string, unknown>;
  };
}
