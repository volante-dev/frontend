import { createBdd } from "playwright-bdd";
import { expect, type Page } from "@playwright/test";

const { Given, When, Then } = createBdd();
const SCROLL_ALIGNMENT_TOLERANCE = 8;

const getPostHeroTop = async (page: Page): Promise<number> =>
  page.evaluate(() => {
    const section = document.querySelector('[data-scroll-anchor="post-hero"]');
    return section?.getBoundingClientRect().top ?? Number.NaN;
  });

const getPostHeroAbsoluteTop = async (page: Page): Promise<number> =>
  page.evaluate(() => {
    const section = document.querySelector('[data-scroll-anchor="post-hero"]');
    if (!section) return Number.NaN;
    return section.getBoundingClientRect().top + window.scrollY;
  });

Given("je suis sur la page d'accueil", async ({ page }: { page: Page }) => {
  await page.goto("/");
});

Given("j'ouvre la page {string}", async ({ page }: { page: Page }, path: string) => {
  await page.goto(path);
});

When("je fais défiler jusqu'à la section services", async ({ page }: { page: Page }) => {
  await page.locator('[data-testid="services-section"]').scrollIntoViewIfNeeded();
});

When("je scrolle vers le bas depuis la vidéo d'accueil", async ({ page }: { page: Page }) => {
  await page.locator('[data-scroll-anchor="hero-video"]').waitFor();
  await page.mouse.wheel(0, 700);
});

When("je scrolle librement plus bas dans la page", async ({ page }: { page: Page }) => {
  await page.mouse.wheel(0, 700);
});

When(
  "je remonte jusqu'à la limite de la section principale de l'accueil",
  async ({ page }: { page: Page }) => {
    const postHeroTop = await getPostHeroAbsoluteTop(page);
    await page.evaluate((top) => window.scrollTo({ top, behavior: "auto" }), postHeroTop);
  }
);

When("je scrolle vers le haut depuis cette limite", async ({ page }: { page: Page }) => {
  await page.mouse.wheel(0, -700);
});

When("je clique sur {string}", async ({ page }: { page: Page }, text: string) => {
  await page.getByRole("link", { name: text }).click();
});

When("je marque le header courant", async ({ page }: { page: Page }) => {
  await expect(page.locator("html")).toHaveClass(
    /volante-transitions-ready/,
    { timeout: 7000 },
  );
  await page.evaluate(() => {
    const transitionWindow = window as typeof window & {
      __viewTransitionCount?: number;
    };
    transitionWindow.__viewTransitionCount = 0;

    if (!document.startViewTransition) return;
    const startViewTransition = document.startViewTransition.bind(document);
    document.startViewTransition = ((callback) => {
      transitionWindow.__viewTransitionCount =
        (transitionWindow.__viewTransitionCount ?? 0) + 1;
      return startViewTransition(callback);
    }) as typeof document.startViewTransition;
  });
  await page.locator('[data-testid="site-header"]').evaluate((header) => {
    header.setAttribute("data-persistence-marker", "before-navigation");
  });
});

Then("une View Transition a été déclenchée", async ({ page }: { page: Page }) => {
  const count = await page.evaluate(
    () =>
      (window as typeof window & { __viewTransitionCount?: number })
        .__viewTransitionCount ?? 0,
  );
  expect(count).toBeGreaterThan(0);
});

Then("le header est exclu du fade de page", async ({ page }: { page: Page }) => {
  const transitionNames = await page.evaluate(() => ({
    root: getComputedStyle(document.documentElement).viewTransitionName,
    header: getComputedStyle(
      document.querySelector('[data-testid="site-header"]')!,
    ).viewTransitionName,
  }));
  expect(transitionNames).toEqual({ root: "none", header: "none" });
});

Then(
  "l'animation d'introduction ne se joue pas",
  async ({ page }: { page: Page }) => {
    await expect(page.locator("html")).not.toHaveClass(
      /volante-intro-enabled/,
    );
    await page.waitForTimeout(600);
    await expect(page.locator("html")).not.toHaveClass(
      /volante-intro-enabled/,
    );
  },
);

Then(
  "l'animation d'introduction se joue",
  async ({ page }: { page: Page }) => {
    const introStarted = await page.evaluate(
      () => sessionStorage.getItem("volante-intro-played") === "1",
    );
    expect(introStarted).toBeTruthy();
  },
);

When("je passe le site en anglais", async ({ page }: { page: Page }) => {
  await page.getByRole("button", { name: "FR", exact: true }).click();
  await page.getByRole("link", { name: "EN", exact: true }).click();
});

Then("je suis sur la page {string}", async ({ page }: { page: Page }, path: string) => {
  await expect(page).toHaveURL(new RegExp(`${path}$`));
});

Then("le même header est resté monté", async ({ page }: { page: Page }) => {
  await expect(page.locator('[data-testid="site-header"]')).toHaveAttribute(
    "data-persistence-marker",
    "before-navigation",
  );
});

Then(
  "le sélecteur de langue affiche {string}",
  async ({ page }: { page: Page }, locale: string) => {
    await expect(
      page.getByRole("button", { name: locale, exact: true }),
    ).toBeVisible();
  },
);

Then("je vois le titre principal du studio", async ({ page }: { page: Page }) => {
  await expect(page.locator('[data-testid="hero"]')).toBeVisible();
});

Then("je vois au moins {int} service affiché", async ({ page }: { page: Page }, count: number) => {
  const services = page.locator('[data-testid="services-section"]');
  await expect(services).toBeVisible();
  const items = services.locator("h3");
  expect(await items.count()).toBeGreaterThanOrEqual(count);
});

Then("la section principale de l'accueil est alignée en haut de l'écran", async ({ page }: { page: Page }) => {
  await expect
    .poll(() => getPostHeroTop(page))
    .toBeLessThanOrEqual(SCROLL_ALIGNMENT_TOLERANCE);
  expect(Math.abs(await getPostHeroTop(page))).toBeLessThanOrEqual(SCROLL_ALIGNMENT_TOLERANCE);
});

Then("la page descend sous la section principale de l'accueil", async ({ page }: { page: Page }) => {
  const postHeroTop = await getPostHeroAbsoluteTop(page);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(postHeroTop + 100);
});

Then("je reviens sur la vidéo d'accueil", async ({ page }: { page: Page }) => {
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeLessThanOrEqual(SCROLL_ALIGNMENT_TOLERANCE);
});

Then("je vois un titre contenant {string}", async ({ page }: { page: Page }, text: string) => {
  await expect(page.locator("h1")).toContainText(text, { ignoreCase: true });
});

Then("la page répond avec un statut OK", async ({ page }: { page: Page }) => {
  const response = await page.request.get(page.url());
  expect(response.ok()).toBeTruthy();
});
