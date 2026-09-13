import { expect, test } from "@playwright/test";

test.describe("claim destination", () => {
  test("asks for a wallet before a claim can be submitted", async ({ page }) => {
    await page.goto("/poaps/1/claim?method=signature");

    await expect(page.getByText("Claim rule")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Connect wallet to continue" })
    ).toBeVisible();
    await expect(page.getByText("signature", { exact: true })).toBeVisible();
  });

  test("explains an unsupported claim method", async ({ page }) => {
    await page.goto("/poaps/1/claim?method=unknown");

    await expect(
      page.getByText(/does not specify a supported method/i)
    ).toBeVisible();
  });

  test("a non-numeric claim link resolves as not found", async ({ page }) => {
    const response = await page.goto("/poaps/not-a-number/claim");
    expect(response?.status()).toBe(404);
  });
});
