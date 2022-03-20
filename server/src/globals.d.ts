declare module "@cubejs-backend/prestodb-driver";

declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: "development" | "production";
  }
}
