import { expect, test } from "@playwright/test";

test("a visitor can understand the campaign and explore a use case", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Atlas/);
  await expect(
    page.getByRole("heading", { name: "Know what to do next." }),
  ).toBeVisible();
  await expect(page.getByText("A plan, not a promise.")).toBeVisible();

  await page.getByRole("link", { name: "See how it works" }).click();

  await expect(page).toHaveURL(/\/use-cases$/);
  await expect(
    page.getByRole("heading", {
      name: "Every career move deserves a mission map.",
    }),
  ).toBeVisible();
});
