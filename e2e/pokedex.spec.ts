import { test, expect } from "@playwright/test";

test.describe("Pokédex", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("homepage loads", async ({ page }) => {
    await expect(page).toHaveTitle(/Pokédex/);
    await expect(page.getByText("Pokédex")).toBeVisible();
  });

  test("displays pokemon cards", async ({ page }) => {
    await expect(page.getByText("bulbasaur")).toBeVisible();
    await expect(page.getByText("#001")).toBeVisible();
  });

  test("search works", async ({ page }) => {
    await page.goto("/?q=char");
    await expect(page.locator('text=charmander').first()).toBeVisible();
  });

  test("type filter works", async ({ page }) => {
    await page.getByRole("button", { name: "fire" }).click();
    
    await expect(page.getByText("charmander")).toBeVisible();
  });

  test("pagination works", async ({ page }) => {
    await page.getByRole("link", { name: "Next" }).click();
    
    await expect(page.getByText("Showing 21-40 of")).toBeVisible();
  });

  test("pokemon detail page", async ({ page }) => {
    await page.getByRole("link", { name: /View bulbasaur details/ }).click();
    
    await expect(page).toHaveURL(/\/pokemon\/bulbasaur/);
    await expect(page.getByRole("heading", { name: "bulbasaur" })).toBeVisible();
    await expect(page.getByText("HP")).toBeVisible();
  });
});
