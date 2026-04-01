import { createBdd } from "playwright-bdd";
import { expect, type Page } from "@playwright/test";

const { When, Then } = createBdd();

Then("je vois le formulaire de contact", async ({ page }: { page: Page }) => {
  await expect(page.locator('[data-testid="contact-form"]')).toBeVisible();
});

When(
  "je remplis le champ {string} avec {string}",
  async ({ page }: { page: Page }, label: string, value: string) => {
    await page.getByLabel(label).fill(value);
  },
);

Then(
  "le formulaire reste visible \\(champs requis non remplis\\)",
  async ({ page }: { page: Page }) => {
    await expect(page.locator('[data-testid="contact-form"]')).toBeVisible();
  },
);

Then("je vois le message de confirmation", async ({ page }: { page: Page }) => {
  await expect(page.locator('[data-testid="contact-success"]')).toBeVisible({ timeout: 5000 });
});
