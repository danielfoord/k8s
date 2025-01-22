// app.ts
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { UserService } from "./userService.ts";

export function createApp(userService: UserService): Application {
  const app = new Application();
  const router = new Router();

  // Enable CORS
  app.use(oakCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }));

  // Logger middleware
  app.use(async (ctx, next) => {
    console.log(`${ctx.request.method} ${ctx.request.url}`);
    await next();
  });

  router.get("/api/users", async (ctx) => {
    try {
      const users = await userService.getAllUsers();
      ctx.response.body = users;
    } catch (error) {
      console.error("Error fetching users:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  });

  router.post("/api/users", async (ctx) => {
    try {
      const body = await ctx.request.body().value;

      if (!body || !body.emailAddress || !body.hashedPassword) {
        ctx.response.status = 400;
        ctx.response.body = {
          error: "Invalid request body",
          message: "EmailAddress and HashedPassword are required",
        };
        return;
      }

      const newUser = await userService.createUser({
        emailAddress: body.emailAddress,
        hashedPassword: body.hashedPassword,
      });

      ctx.response.status = 201;
      ctx.response.body = newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      ctx.response.status = 500;
      ctx.response.body = {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  });

  router.options("/api/users", (ctx) => {
    ctx.response.status = 204;
  });

  router.get("/health", (ctx) => {
    ctx.response.body = { status: "healthy" };
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.addEventListener("error", (evt) => {
    console.error("Unhandled error:", evt.error);
  });

  return app;
}
