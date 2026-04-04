import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { parseGithubName } from "@/lib/data";

const repoPartArb = fc
  .string({ minLength: 1, maxLength: 12 })
  .filter(
    (value) =>
      /^[A-Za-z0-9._-]+$/.test(value) &&
      value !== "." &&
      value !== ".."
  );

describe("parseGithubName property-based test", () => {
  it("should never throw and should always return a string", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 200 }), (input) => {
        const result = parseGithubName(input);
        expect(typeof result).toBe("string");
      }),
      { numRuns: 300 }
    );
  });

  it("should extract owner and repo for valid GitHub repository urls", () => {
    fc.assert(
      fc.property(repoPartArb, repoPartArb, (owner, repo) => {
        const url = `https://github.com/${owner}/${repo}`;
        expect(parseGithubName(url)).toBe(`${owner}/${repo}`);
      }),
      { numRuns: 100 }
    );
  });
});
