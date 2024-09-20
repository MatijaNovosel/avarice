/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: string;
    readonly VITE_ROUTER_MODE: "hash" | "history" | "memory" | undefined;
    readonly VITE_SERVER_URL: string?;
    readonly VITE_API_VERSION: string?;
    readonly VITE_API_KEY: string?;
    readonly VITE_API_ID: string?;
  }
}
