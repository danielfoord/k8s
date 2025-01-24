import { Application, Router, Context, RouterContext } from "https://deno.land/x/oak@v13.0.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { PrismaClient } from "./generated/client/index.js";

const prisma = new PrismaClient();;

const ROUTES = {
  DINOSAURS: "/api/dinosaurs",
  HEALTH: "/health",
} as const;

interface ErrorResponse {
  error: string;
  details?: string;
}

async function handleGetDinosaurs(
  ctx: RouterContext<typeof ROUTES.DINOSAURS>,
): Promise<void> {
  try {
    const dinosaurs = await prisma.dinosaur.findMany();
    ctx.response.body = dinosaurs;
  } catch (error) {
    console.error("Error fetching dinosaurs:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      error: "Internal server error"
    } as ErrorResponse;
  }
}

interface CreateDinosaurRequest {
  name: string;
  description: string;
}

async function handleCreateDinosaur(
  ctx: RouterContext<typeof ROUTES.DINOSAURS>,
): Promise<void> {
  try {
    const body = await ctx.request.body.json() as Partial<CreateDinosaurRequest>;

    if (!isValidCreateDinosaurRequest(body)) {
      ctx.response.status = 400;
      ctx.response.body = {
        error: "Invalid request body",
        details: "Name and Description are required",
      } as ErrorResponse;
      return;
    }

    const newDinosaur = await prisma.dinosaur.create({
      data: {
        name: body.name,
        description: body.description,
      },
    });

    ctx.response.status = 201;
    ctx.response.body = newDinosaur;
  } catch (error) {
    console.error("Error creating dinosaur:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      error: "Internal server error",
      details: error instanceof Error ? error.message : "An unknown error occurred",
    } as ErrorResponse;
  }
}

function isValidCreateDinosaurRequest(body: Partial<CreateDinosaurRequest>): body is CreateDinosaurRequest {
  return Boolean(
    body &&
    typeof body.name === "string" &&
    typeof body.description === "string"
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

function setupRoutes(router: Router): void {
  router
    .get(ROUTES.DINOSAURS, handleGetDinosaurs)
    .post(ROUTES.DINOSAURS, handleCreateDinosaur)
    .options(ROUTES.DINOSAURS, (ctx) => {
      ctx.response.status = 204;
    })
    .get(ROUTES.HEALTH, (ctx) => {
      ctx.response.body = { status: "healthy" };
    });
}

export function createApp(): Application {
  const app = new Application();
  const router = new Router();

  setupMiddleware(app);
  setupRoutes(router);

  app.use(router.routes());
  app.use(router.allowedMethods());

  setupErrorHandler(app);

  return app;
}