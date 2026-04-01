import { createBdd } from "playwright-bdd";
import { expect, type Page } from "@playwright/test";

const { Given, When, Then } = createBdd();

Given("je suis sur la page d'accueil", async ({ page }: { page: Page }) => {
  await page.goto("/");
});

Given("je suis sur la page {string}", async ({ page }: { page: Page }, path: string) => {
  await page.goto(path);
});

When("je fais défiler jusqu'à la section services", async ({ page }: { page: Page }) => {
  await page.locator('[data-testid="services-section"]').scrollIntoViewIfNeeded();
});

When("je clique sur {string}", async ({ page }: { page: Page }, text: string) => {
  await page.getByRole("link", { name: text }).click();
});

Then("je suis sur la page {string}", async ({ page }: { page: Page }, path: string) => {
  await expect(page).toHaveURL(new RegExp(`${path}$`));
});

Then("je vois le titre principal du studio", async ({ page }: { page: Page }) => {
  await expect(page.locator('[data-testid="hero"]')).toBeVisible();
});

Then("je vois au moins {int} service affiché", async ({ page }: { page: Page }, count: number) => {
  const services = page.locator('[data-testid="services-section"]');
  await expect(services).toBeVisible();
  const items = services.locator("h3");
  expect(await items.count()).toBeGreaterThanOrEqual(count);
});

Then("je vois un titre contenant {string}", async ({ page }: { page: Page }, text: string) => {
  await expect(page.locator("h1")).toContainText(text, { ignoreCase: true });
});

Then("la page répond avec un statut OK", async ({ page }: { page: Page }) => {
  const response = await page.request.get(page.url());
  expect(response.ok()).toBeTruthy();
});
