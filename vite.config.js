import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Inject a strict Content-Security-Policy ONLY into the production build's index.html
// (the file:// page in the packaged app). Dev (vite serve) is left untouched.
const cspMetaPlugin = {
  name: "irflow-csp-meta",
  apply: "build",
  transformIndexHtml() {
    return [{
      tag: "meta",
      injectTo: "head-prepend",
      attrs: {
        "http-equiv": "Content-Security-Policy",
        content: [
          "default-src 'self'",
          "script-src 'self'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob:",
          "font-src 'self' data:",
          "media-src 'self' data: blob:",
          "connect-src 'self'",
          "frame-src 'self'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join("; "),
      },
    }];
  },
};

export default defineConfig(({ command }) => {
  const isDev = command === "serve";
  return {
    // In dev mode skip @vitejs/plugin-react — a v4.7.x bug double-injects the React
    // Refresh preamble into class-component files, causing esbuild to abort with
    // "symbol already declared". Vite's built-in esbuild handles JSX directly instead.
    // Hot-module replacement for React components is unavailable in dev; use full reload.
    plugins: isDev ? [cspMetaPlugin] : [react(), cspMetaPlugin],
    base: isDev ? "/" : "./",
    esbuild: isDev ? { jsx: "automatic", jsxImportSource: "react" } : {},
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
    server: {
      port: 5200,
    },
  };
});
