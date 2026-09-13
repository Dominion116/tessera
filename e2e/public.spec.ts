import { expect, test } from "@playwright/test";

test.describe("public surfaces", () => {
  test("the landing page renders without a wallet", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: /TESSERA/i })
    ).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Docs" }).first()
    ).toBeVisible();
  });

  test("the documentation index renders the article set", async ({ page }) => {
    await page.goto("/docs");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Onchain POAPs with Tessera",
      })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Getting started" }).first()
    ).toBeVisible();
  });
});
