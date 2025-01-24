import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

// Test GET /api/dinosaurs endpoint
Deno.test("GET /api/dinosaurs endpoint", async (t) => {
  await t.step("should return 200 status code", async () => {
    const response = await fetch("http://deno-api:8888/api/dinosaurs");
    assert(response.status === 200, `Expected status code 200 but got ${response.status}`);
    await response.body?.cancel();
  });

  await t.step("should return an array of dinosaurs", async () => {
    const response = await fetch("http://deno-api:8888/api/dinosaurs");
    const data = await response.json();

    assert(Array.isArray(data), "Expected response to be an array");

    if (data.length > 0) {
      const firstDinosaur = data[0];
      assert(firstDinosaur.id !== undefined, "Dinosaur should have an id");
      assert(typeof firstDinosaur.name === "string", "Dinosaur should have a name of type string");
      assert(typeof firstDinosaur.description === "string", "Dinosaur should have a description of type string");
    }
  });
});

// Test POST /api/dinosaurs endpoint
Deno.test("POST /api/dinosaurs endpoint", async (t) => {
  await t.step("should create a new dinosaur with valid data", async () => {
    const newDinosaur = {
      name: "T-Rex",
      description: "A fearsome predator"
    };

    const response = await fetch("http://deno-api:8888/api/dinosaurs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDinosaur),
    });

    assert(response.status === 201, `Expected status code 201 but got ${response.status}`);

    const data = await response.json();
    assert(data.id !== undefined, "Created dinosaur should have an id");
    assertEquals(data.name, newDinosaur.name, "Created dinosaur should have the correct name");
    assertEquals(data.description, newDinosaur.description, "Created dinosaur should have the correct description");
  });

  await t.step("should return 400 for invalid data", async () => {
    const invalidDinosaur = {
      // Missing required fields
    };

    const response = await fetch("http://deno-api:8888/api/dinosaurs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invalidDinosaur),
    });

    assert(response.status === 400, `Expected status code 400 but got ${response.status}`);

    const data = await response.json();
    assert(data.error !== undefined, "Error response should contain an error message");
    assert(data.details !== undefined, "Error response should contain error details");
  });
});

// Test OPTIONS /api/dinosaurs endpoint
Deno.test("OPTIONS /api/dinosaurs endpoint", async (t) => {
  await t.step("should return 204 status code", async () => {
    const response = await fetch("http://deno-api:8888/api/dinosaurs", {
      method: "OPTIONS",
    });

    assert(response.status === 204, `Expected status code 204 but got ${response.status}`);

    // Check CORS headers
    const corsHeader = response.headers.get("Access-Control-Allow-Origin");
    assert(corsHeader === "*", "Should have correct CORS header");

    const allowMethods = response.headers.get("Access-Control-Allow-Methods");
    assert(allowMethods?.includes("GET"), "Should allow GET method");
    assert(allowMethods?.includes("POST"), "Should allow POST method");
  });
});

// Test GET /health endpoint
Deno.test("GET /health endpoint", async (t) => {
  await t.step("should return 200 status code and healthy status", async () => {
    const response = await fetch("http://deno-api:8888/health");
    assert(response.status === 200, `Expected status code 200 but got ${response.status}`);

    const data = await response.json();
    assertEquals(data, { status: "healthy" }, "Should return correct health status");
  });
});