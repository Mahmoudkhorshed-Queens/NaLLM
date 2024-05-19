interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_ANOTHER_ENV_VAR: string;
    // Add other environment variables here as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }