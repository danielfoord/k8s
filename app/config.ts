import { Config } from "./types.ts";

export function loadConfig(): Config {
  const postgresUser = Deno.env.get("POSTGRES_USER");
  const postgresPassword = Deno.env.get("POSTGRES_PASSWORD");
  const postgresDb = Deno.env.get("POSTGRES_DB");
  const postgresHost = Deno.env.get("POSTGRES_HOST");
  const port = parseInt(Deno.env.get("PORT") || "8888");

  if (!postgresUser || !postgresPassword || !postgresDb || !postgresHost) {
    throw new Error("Missing required environment variables");
  }

  return {
    postgresUser,
    postgresPassword,
    postgresDb,
    postgresHost,
    port,
  };
}