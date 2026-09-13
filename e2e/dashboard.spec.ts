import { expect, test } from "@playwright/test";
import { connectMockWallet, installMockWallet } from "./support/mock-wallet";

/**
 * The dashboard is wallet-gated. An injected provider stands in for an
 * extension so AppKit can connect, while every number on the page still comes
 * from the deployed contract over the Base Sepolia transport.
 */
test.describe("wallet and dashboard", () => {
  test("an injected wallet opens the live dashboard", async ({ page }) => {
    await installMockWallet(page);
    await page.goto("/app");

    await expect(page.getByText("Connect a wallet")).toBeVisible();
    await connectMockWallet(page);

    await expect(
      page.getByRole("heading", { level: 1, name: "Dashboard" })
    ).toBeVisible();
    await expect(page.getByText("POAPs created")).toBeVisible();
  });

  test("Explore opens in the shell against live reads", async ({ page }) => {
    await installMockWallet(page);
    await page.goto("/app");
    await connectMockWallet(page);

    await page.getByRole("button", { name: "Explore" }).click();

    await expect(page).toHaveURL(/\/app\/explore$/);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "POAPs made for being there",
      })
    ).toBeVisible();
    await expect(page.locator('a[href^="/poaps/"]').first()).toBeVisible();
  });
});
