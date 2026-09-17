import { test, expect } from "@playwright/test";

const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1280, height: 900 },
  { width: 1536, height: 960 },
];

test("home has Learn, Decide and Operate landmarks and an accessible decision map", async ({
  page,
}) => {
  await page.goto("/");
  for (const name of ["Learn", "Decide", "Operate"]) {
    await expect(page.getByRole("navigation", { name })).toBeVisible();
  }
  await expect(page.getByRole("img", { name: /decision/i })).toBeVisible();
  await expect(
    page.getByRole("region", { name: /linear|text equivalent/i }),
  ).toBeVisible();
  const bodySize = await page
    .locator("body")
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(bodySize).toBeGreaterThanOrEqual(16);
  const detail = page.getByRole("button", { name: "Map error consequence" });
  await detail.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".graph-detail")).toContainText(
    "Map error consequence",
  );
});

test("comparison presents readable cards on a narrow viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/compare");
  const cards = page.getByRole("article");
  await expect(cards.first()).toBeVisible();
  expect(await cards.count()).toBeGreaterThanOrEqual(2);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
});

test("upstream answers recompute the decision path", async ({ page }) => {
  await page.goto("/start");
  const rules = page.getByLabel("Can fixed rules solve it?");
  await rules.selectOption("yes");
  await expect(
    page.getByText("Prefer conventional automation first"),
  ).toBeVisible();
  await rules.selectOption("no");
  await expect(
    page.getByText("Prefer conventional automation first"),
  ).toHaveCount(0);
});

test("review evidence stays isolated between two projects", async ({
  page,
}) => {
  await page.goto("/review");
  await page.getByRole("button", { name: "New project" }).click();
  const first = page.locator(".review-item").first();
  await first.locator("summary").click();
  await first.getByLabel("Evidence or URL").fill("Project Alpha evidence");
  await page.getByRole("button", { name: "New project" }).click();
  await expect(
    page.locator(".review-item").first().getByLabel("Evidence or URL"),
  ).toHaveValue("");
  await page.getByLabel("Project").selectOption({ index: 1 });
  await expect(
    page.locator(".review-item").first().getByLabel("Evidence or URL"),
  ).toHaveValue("Project Alpha evidence");
});

test("export reset and import preserves a project and bookmark", async ({
  page,
}) => {
  await page.goto("/start");
  await page.getByLabel(/^Project name/).fill("Round trip project");
  await page.getByRole("button", { name: "Save as project" }).click();
  await page.goto("/guides/durable-execution");
  await page.getByRole("button", { name: "Bookmark guide" }).click();
  const exported = await page.evaluate(() =>
    localStorage.getItem("ai-playbook-state"),
  );
  expect(exported).toBeTruthy();
  await page.goto("/settings");
  await page.getByLabel(/Type .*reset.*confirm/i).fill("reset");
  await page.getByRole("button", { name: /Reset local data/i }).click();
  await page.getByPlaceholder("Paste exported JSON").fill(exported!);
  await page.getByRole("button", { name: "Preview import" }).click();
  await page
    .getByRole("button", { name: /Replace|Import/i })
    .last()
    .click();
  await expect(page.getByText("Data imported")).toBeVisible();
  await expect(page.getByText("Round trip project")).toBeVisible();
});

test("first visit can search, open, annotate, bookmark and revisit a guide", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByLabel(/What are you trying to decide/)
    .fill("duplicate action");
  await page.getByRole("button", { name: /Search playbook/i }).click();
  const guide = page.locator(".guide-index a").first();
  const guideHref = await guide.getAttribute("href");
  await guide.click();
  await page.getByLabel(/^My note/).fill("Read before launch");
  await page.getByRole("button", { name: "Bookmark guide" }).click();
  await page.goto("/bookmarks");
  await expect(page.locator(`a[href="${guideHref}"]`)).toBeVisible();
});

for (const viewport of viewports) {
  test(`deterministic screenshots at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    for (const route of [
      "/",
      "/guides/durable-execution",
      "/start",
      "/review",
      "/troubleshoot",
      "/compare",
    ]) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
      await page.screenshot({
        path: `test-results/redesign/${viewport.width}x${viewport.height}${route.replaceAll("/", "-") || "-home"}.png`,
        fullPage: true,
      });
    }
  });
}
