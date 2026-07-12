import { expect, test } from "@playwright/test";

test("an unauthenticated visitor is sent to login before starting an analysis", async ({ page }) => {
  await page.goto("/analysis/new");

  await expect(page).toHaveURL(/\/login\?redirectTo=%2Fanalysis%2Fnew$/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await expect(
    page.getByText("Continue your career roadmap."),
  ).toBeVisible();
});
