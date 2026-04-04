import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  computeStats,
  fetchPortfolioData,
  getActivityById,
  getPositionsByYear,
  groupByCategory,
  groupByDate,
  parseGithubName,
} from "@/lib/data";
import {
  sampleActivities,
  samplePortfolioData,
  samplePositions,
} from "../fixtures/portfolioData";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

describe("src/lib/data.ts", () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("fetchPortfolioData should return parsed json data", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(samplePortfolioData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const result = await fetchPortfolioData();

    expect(fetchMock).toHaveBeenCalledWith("/data.json");
    expect(result).toEqual(samplePortfolioData);
  });

  it("fetchPortfolioData should throw when the response is not ok", async () => {
    fetchMock.mockResolvedValue(
      new Response("failed", {
        status: 500,
      })
    );

    await expect(fetchPortfolioData()).rejects.toThrow(
      "Failed to fetch data.json"
    );
  });

  it("getActivityById should return the matched activity", () => {
    const result = getActivityById(sampleActivities, "activity-3");

    expect(result?.title).toBe("Contest A");
  });

  it("getPositionsByYear should return the matched year positions", () => {
    const result = getPositionsByYear(samplePositions, 2024);

    expect(result?.items[0].role).toBe("팀장");
  });

  it("groupByDate should sort years descending and terms in defined order", () => {
    const result = groupByDate(sampleActivities);

    expect(result).toHaveLength(2);
    expect(result[0].year).toBe(2025);
    expect(result[1].year).toBe(2024);
    expect(result[0].terms.map((term) => term.term)).toEqual([
      "1학기",
      "2학기",
    ]);
    expect(result[1].terms.map((term) => term.term)).toEqual([
      "여름방학",
      "2학기",
    ]);
  });

  it("groupByCategory should group activities and sort by count", () => {
    const result = groupByCategory(sampleActivities);

    expect(result[0].category).toBe("프로젝트");
    expect(result[0].activities).toHaveLength(2);
    expect(result.map((item) => item.category)).toEqual(
      expect.arrayContaining(["프로젝트", "대회", "학회"])
    );
  });

  it("computeStats should aggregate totals, awards, roles, links, and proof files", () => {
    const stats = computeStats(sampleActivities);

    expect(stats.totalActivities).toBe(4);
    expect(stats.totalAwards).toBe(2);
    expect(stats.roleDistribution["Data Engineer"]).toBe(2);
    expect(stats.roleDistribution["AI Engineer"]).toBe(1);
    expect(stats.githubLinks).toHaveLength(2);
    expect(stats.proofFiles).toHaveLength(5);
  });

  it("empty collections should return empty grouping and zeroed stats", () => {
    expect(groupByDate([])).toEqual([]);
    expect(groupByCategory([])).toEqual([]);
    expect(computeStats([])).toEqual({
      totalActivities: 0,
      totalAwards: 0,
      roleDistribution: {},
      githubLinks: [],
      proofFiles: [],
    });
  });

  it("parseGithubName should extract owner and repo from a valid GitHub url", () => {
    expect(parseGithubName("https://github.com/vercel/next.js")).toBe(
      "vercel/next.js"
    );
  });

  it("parseGithubName should return the original input when the url is invalid", () => {
    expect(parseGithubName("not-a-valid-url")).toBe("not-a-valid-url");
  });
});
