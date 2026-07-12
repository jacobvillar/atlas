import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "./login-form";

describe("safeRedirectPath", () => {
  it("keeps same-origin internal paths (with query/hash)", () => {
    expect(safeRedirectPath("/reports/123")).toBe("/reports/123");
    expect(safeRedirectPath("/analysis/new?mode=jd")).toBe("/analysis/new?mode=jd");
    expect(safeRedirectPath("/dashboard#top")).toBe("/dashboard#top");
  });

  it("rejects off-origin and scheme tricks, falling back to /dashboard", () => {
    for (const bad of [
      undefined,
      "",
      "//evil.com",
      "/\\evil.com",
      "https://evil.com",
      "javascript:alert(1)",
      "evil.com",
      "  /dashboard",
    ]) {
      expect(safeRedirectPath(bad)).toBe("/dashboard");
    }
  });
});
