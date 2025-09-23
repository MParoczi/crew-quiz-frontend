import { defineConfig } from "@hey-api/openapi-ts";
import { config } from "dotenv";

config({ path: ".env.development" });

const apiGeneratorInputUrl = process.env.VITE_API_GENERATOR_INPUT_URL;

export default defineConfig({
  input: `${apiGeneratorInputUrl}/swagger/v1/swagger.json`,
  output: {
    format: "prettier",
    lint: "eslint",
    path: "./src/api",
  },
  plugins: [
    "@hey-api/client-fetch",
    {
      dates: true,
      name: "@hey-api/transformers",
    },
    {
      name: "@hey-api/typescript",
      enums: "javascript",
      readOnlyWriteOnlyBehavior: "off",
    },
    {
      name: "@hey-api/sdk",
      transformer: true,
    },
    {
      name: "@tanstack/react-query",
      mutationOptions: true,
      queryOptions: true,
      infiniteQueryOptions: false,
    },
  ],
});
