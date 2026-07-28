/* Plausible analytics snippet is injected by index.html (plausible.init). */
interface Window {
  plausible?: (event: string, options?: Record<string, unknown>) => void;
}
