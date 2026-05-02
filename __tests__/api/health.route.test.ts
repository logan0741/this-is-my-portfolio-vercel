import { describe, expect, it } from "vitest";

describe("src/app/api/health/route.ts GET", () => {
  it("should return service health", async () => {
    const { GET } = await import("@/app/api/health/route");
    const response = GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      status: "ok",
      service: "portfolio",
    });
  });
});
