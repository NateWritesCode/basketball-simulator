declare module "@cubejs-backend/prestodb-driver";
declare function cube(name: string, definition: any): void;

declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: "development" | "production";
  }
}
