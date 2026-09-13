import { expect, test } from "@playwright/test";

/**
 * The public POAP page reads Base Sepolia during the server render, so a
 * passing run also proves the read layer answered from the live contract.
 */
test.describe("public POAP page", () => {
  test("renders a registered event and its mint panel", async ({ page }) => {
    const response = await page.goto("/poaps/1");
    expect(response?.status()).toBe(200);

    await expect(page.getByText("POAP #1")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Mint this POAP")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Open claim page/i })
    ).toBeVisible();
  });

  test("an out-of-range event resolves as not found", async ({ page }) => {
    const response = await page.goto("/poaps/999999");
    expect(response?.status()).toBe(404);
  });
});
