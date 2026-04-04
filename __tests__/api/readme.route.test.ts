import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

function makeRequest(url?: string) {
  const base = "http://localhost:3000/api/readme";
  return new NextRequest(
    url ? `${base}?url=${encodeURIComponent(url)}` : base
  );
}

async function loadRouteModule() {
  vi.resetModules();
  return import("@/app/api/readme/route");
}

describe("src/app/api/readme/route.ts GET", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    delete process.env.GITHUB_TOKEN;
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("should return 400 when url is missing", async () => {
    const { GET } = await loadRouteModule();
    const response = await GET(makeRequest());

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Missing 'url' query parameter",
    });
  });

  it("should return 400 when the hostname is not github.com", async () => {
    const { GET } = await loadRouteModule();
    const response = await GET(makeRequest("https://example.com/test"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Only GitHub URLs are supported",
    });
  });

  it("should return 400 when the repository path is invalid", async () => {
    const { GET } = await loadRouteModule();
    const response = await GET(makeRequest("https://github.com/vercel"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid GitHub repository URL",
    });
  });

  it("should return 400 when the url format is invalid", async () => {
    const { GET } = await loadRouteModule();
    const response = await GET(makeRequest("not-a-url"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid URL format",
    });
  });

  it("should return 404 when GitHub API says the README is missing", async () => {
    const { GET } = await loadRouteModule();
    fetchMock.mockResolvedValue(
      new Response("not found", {
        status: 404,
      })
    );

    const response = await GET(
      makeRequest("https://github.com/vercel/next.js")
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "README not found",
    });
  });

  it("should return 429 when the GitHub rate limit is exceeded", async () => {
    const { GET } = await loadRouteModule();
    fetchMock.mockResolvedValue(
      new Response("forbidden", {
        status: 403,
      })
    );

    const response = await GET(
      makeRequest("https://github.com/vercel/next.js")
    );

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({
      error: "GitHub API rate limit exceeded. Try again later.",
    });
  });

  it("should return the upstream status for other GitHub API errors", async () => {
    const { GET } = await loadRouteModule();
    fetchMock.mockResolvedValue(
      new Response("server error", {
        status: 500,
      })
    );

    const response = await GET(
      makeRequest("https://github.com/vercel/next.js")
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "GitHub API error: 500",
    });
  });

  it("should return README content when fetch succeeds", async () => {
    const { GET } = await loadRouteModule();
    fetchMock.mockResolvedValue(
      new Response("# README", {
        status: 200,
      })
    );

    const response = await GET(
      makeRequest("https://github.com/vercel/next.js")
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      content: "# README",
      cached: false,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.github.com/repos/vercel/next.js/readme",
      {
        headers: {
          Accept: "application/vnd.github.v3.raw",
          "User-Agent": "Portfolio-App",
        },
      }
    );
  });

  it("should include the GitHub token header when GITHUB_TOKEN is set", async () => {
    process.env.GITHUB_TOKEN = "test-token";
    const { GET } = await loadRouteModule();
    fetchMock.mockResolvedValue(
      new Response("# README", {
        status: 200,
      })
    );

    const response = await GET(
      makeRequest("https://github.com/example/project-a")
    );

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.github.com/repos/example/project-a/readme",
      {
        headers: {
          Accept: "application/vnd.github.v3.raw",
          "User-Agent": "Portfolio-App",
          Authorization: "token test-token",
        },
      }
    );
  });

  it("should return cached content on the second identical request", async () => {
    const { GET } = await loadRouteModule();
    fetchMock.mockResolvedValue(
      new Response("# README", {
        status: 200,
      })
    );

    const request = makeRequest("https://github.com/example/cached-repo");

    const firstResponse = await GET(request);
    expect(firstResponse.status).toBe(200);
    await expect(firstResponse.json()).resolves.toEqual({
      content: "# README",
      cached: false,
    });

    const secondResponse = await GET(request);
    expect(secondResponse.status).toBe(200);
    await expect(secondResponse.json()).resolves.toEqual({
      content: "# README",
      cached: true,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("should return 500 when fetch throws unexpectedly", async () => {
    const { GET } = await loadRouteModule();
    fetchMock.mockRejectedValue(new Error("network error"));

    const response = await GET(
      makeRequest("https://github.com/vercel/next.js")
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to fetch README from GitHub",
    });
  });
});
