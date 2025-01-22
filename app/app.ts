import { Application, Router, Context, RouterContext } from "https://deno.land/x/oak@v13.0.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { UserService } from "./userService.ts";
import { ErrorResponse, CreateUserRequest } from "./types.ts";

const ROUTES = {
  USERS: "/api/users",
  HEALTH: "/health",
} as const;

async function handleGetUsers(
  ctx: RouterContext<typeof ROUTES.USERS>,
  userService: UserService,
): Promise<void> {
  try {
    const users = await userService.getAllUsers();
    ctx.response.body = users;
  } catch (error) {
    console.error("Error fetching users:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      error: "Internal server error"
    } as ErrorResponse;
  }
}

async function handleCreateUser(
  ctx: RouterContext<typeof ROUTES.USERS>,
  userService: UserService,
): Promise<void> {
  try {
    const body = ctx.request.body as Partial<CreateUserRequest>;

    if (!isValidCreateUserRequest(body)) {
      ctx.response.status = 400;
      ctx.response.body = {
        error: "Invalid request body",
        details: "EmailAddress and HashedPassword are required",
      } as ErrorResponse;
      return;
    }

    const newUser = await userService.createUser(body);
    ctx.response.status = 201;
    ctx.response.body = newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      error: "Internal server error",
      details: error instanceof Error ? error.message : "An unknown error occurred",
    } as ErrorResponse;
  }
}

function isValidCreateUserRequest(body: Partial<CreateUserRequest>): body is CreateUserRequest {
  return Boolean(
    body &&
    typeof body.emailAddress === "string" &&
    typeof body.hashedPassword === "string"
  );
}

function setupMiddleware(app: Application): void {
  // Enable CORS
  app.use(oakCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }));

  // Logger middleware
  app.use(async (ctx: Context, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.request.method} ${ctx.request.url} - ${ms}ms`);
  });
}

function setupErrorHandler(app: Application): void {
  app.addEventListener("error", (evt) => {
    console.error("Unhandled error:", evt.error);
  });
}

function setupRoutes(router: Router, userService: UserService): void {
  router
    .get(ROUTES.USERS, (ctx) => handleGetUsers(ctx, userService))
    .post(ROUTES.USERS, (ctx) => handleCreateUser(ctx, userService))
    .options(ROUTES.USERS, (ctx) => {
      ctx.response.status = 204;
    })
    .get(ROUTES.HEALTH, (ctx) => {
      ctx.response.body = { status: "healthy" };
    });
}

export function createApp(userService: UserService): Application {
  const app = new Application();
  const router = new Router();

  setupMiddleware(app);
  setupRoutes(router, userService);

  app.use(router.routes());
  app.use(router.allowedMethods());

  setupErrorHandler(app);

  return app;
}