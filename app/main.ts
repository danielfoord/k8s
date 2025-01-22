import { loadConfig } from "./config.ts";
import { UserService } from "./userService.ts";
import { createApp } from "./app.ts";
import { PostgresClient } from "./db.ts";

if (import.meta.main) {
  const config = loadConfig();
  const dbClient = new PostgresClient(config);
  const userService = new UserService(dbClient);

  try {
    await userService.initialize();
    console.log("Successfully connected to database");

    const app = createApp(userService);
    console.log(`Server running on http://localhost:${config.port}`);
    await app.listen({ port: config.port });
  } catch (error) {
    console.error("Failed to start server:", error);
    Deno.exit(1);
  }
}