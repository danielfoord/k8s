import { loadConfig } from "./app/config.ts";
import { createApp } from "./app/app.ts";

if (import.meta.main) {
  const config = loadConfig();

  try {
    const app = createApp();
    console.log(`Server running on http://localhost:${config.port}`);
    await app.listen({ port: config.port });
  } catch (error) {
    console.error("Failed to start server:", error);
    Deno.exit(1);
  }
}