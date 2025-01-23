// app/tests/users_test.ts

import { assert } from "https://deno.land/std/assert/mod.ts";

Deno.test("GET /api/users endpoint", async (t) => {
  await t.step("should return 200 status code", async () => {
    const response = await fetch("http://deno-api:8888/api/users");
    assert(response.status === 200, `Expected status code 200 but got ${response.status}`);
    // Consume the response body
    await response.body?.cancel();
  });

  await t.step("should return an array of users", async () => {
    const response = await fetch("http://deno-api:8888/api/users");
    const data = await response.json();
    
    assert(Array.isArray(data), "Expected response to be an array");
    
    // If there are any users, check their structure
    if (data.length > 0) {
      const firstUser = data[0];
      assert(firstUser.id !== undefined, "User should have an id");
    }
  });
});