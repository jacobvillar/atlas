import { expect, test } from "@playwright/test";

const email = process.env.E2E_TEST_EMAIL;
const password = process.env.E2E_TEST_PASSWORD;
const runAiFlow = process.env.E2E_RUN_AI_FLOW === "true";

test.skip(
  !email || !password || !runAiFlow,
  "Set E2E_TEST_EMAIL, E2E_TEST_PASSWORD, and E2E_RUN_AI_FLOW=true to run this paid live journey.",
);

test("a signed-in user can generate and open a readiness report", async ({ page }) => {
  test.setTimeout(90_000);

  await page.goto("/login?redirectTo=/analysis/new");
  await page.getByLabel("Email").fill(email!);
  await page.getByLabel("Password").fill(password!);
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/\/analysis\/new$/);

  await page.getByLabel("Resume").fill(
    "Jordan Lee\nProduct Analyst\n\nBuilt weekly customer-retention dashboards in SQL and Excel for a student consulting project. Presented findings to five stakeholders and recommended three onboarding improvements.\n\nSkills: SQL, Excel, data analysis, stakeholder communication.",
  );
  await page.getByLabel("Job description").fill(
    "We are hiring a Junior Product Analyst to analyze customer behavior, build dashboards, communicate insights to product partners, and support experiments. Required skills include SQL, spreadsheets, clear written communication, and curiosity about product metrics.",
  );
  await page.getByLabel(/Target role/).fill("Junior Product Analyst");
  await page.getByRole("button", { name: "Generate readiness report" }).click();

  await expect(page).toHaveURL(/\/reports\/[\w-]+$/);
  await expect(
    page.getByRole("heading", { name: "Junior Product Analyst" }),
  ).toBeVisible();
  await expect(page.getByText("Readiness report")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Summary" })).toBeVisible();
});
