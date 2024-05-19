// src/vite-env.d.ts

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_ANOTHER_ENV_VAR: string;
    // Add other environment variables here as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }


/// <reference types="vite/client" />


interface ImportMetaEnv {
  readonly VITE_KG_CHAT_BACKEND_ENDPOINT: string;
  readonly VITE_HAS_API_KEY_ENDPOINT: string;
  readonly VITE_KG_CHAT_SAMPLE_QUESTIONS_ENDPOINT: string;
  // Add other environment variables here...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}