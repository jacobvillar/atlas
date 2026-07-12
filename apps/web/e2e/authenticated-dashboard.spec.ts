import { expect, test } from "@playwright/test";

const email = process.env.E2E_TEST_EMAIL;
const password = process.env.E2E_TEST_PASSWORD;

test.skip(
  !email || !password,
  "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD for the dedicated Atlas test account.",
);

test("a test user can sign in and reach their dashboard", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Email").fill(email!);
  await page.getByLabel("Password").fill(password!);
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("heading", { name: "Your career dashboard" }),
  ).toBeVisible();
});
