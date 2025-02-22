import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
const { combinedEnv } = loadEnvConfig(projectDir);

interface EnvConfig {
  serverAppUrl: string;
}

function validateEnv() {
  if (!process.env.SERVER_APP_URL) {
    console.warn(
      "SERVER_APP_URL is not set in .env file. Using default value."
    );
  }
}

validateEnv();

const envConfig: EnvConfig = {
  serverAppUrl: process.env.SERVER_APP_URL || "http://localhost:3000",
};

export default envConfig;
