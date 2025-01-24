// app/tests/dinosaurs_test.ts

import { assert } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test("GET /api/dinosaurs endpoint", async (t) => {
  await t.step("should return 200 status code", async () => {
    const response = await fetch("http://deno-api:8888/api/dinosaurs");
    assert(response.status === 200, `Expected status code 200 but got ${response.status}`);
    // Consume the response body
    await response.body?.cancel();
  });

  await t.step("should return an array of dinosaurs", async () => {
    const response = await fetch("http://deno-api:8888/api/dinosaurs");
    const data = await response.json();
    
    assert(Array.isArray(data), "Expected response to be an array");
    
    // If there are any dinosaurs, check their structure
    if (data.length > 0) {
      const firstDinosaur = data[0];
      assert(firstDinosaur.id !== undefined, "Dinosaur should have an id");
      assert(typeof firstDinosaur.name === "string", "Dinosaur should have a name of type string");
      assert(typeof firstDinosaur.description === "string", "Dinosaur should have a description of type string");
    }
  });
});