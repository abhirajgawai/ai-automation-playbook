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
  const linear = page.locator("details.linear");
  await linear.locator("summary").click();
  const linearText = (await linear.innerText()).toLowerCase();
  const orderedSteps = [
    "define the business outcome",
    "check whether stable rules are sufficient",
    "map the consequence",
    "gather evidence",
  ];
  for (let i = 1; i < orderedSteps.length; i++) {
    expect(linearText.indexOf(orderedSteps[i - 1])).toBeGreaterThanOrEqual(0);
    expect(linearText.indexOf(orderedSteps[i])).toBeGreaterThan(
      linearText.indexOf(orderedSteps[i - 1]),
    );
  }
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
  const geometry = await cards.evaluateAll((els) =>
    els.map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        top: rect.top,
        width: rect.width,
        fontSize: parseFloat(getComputedStyle(el).fontSize),
      };
    }),
  );
  expect(geometry.every((card) => card.width <= 390)).toBe(true);
  const descendantFontSizes = await cards.evaluateAll((els) =>
    els.flatMap((card) =>
      [card, ...Array.from(card.querySelectorAll("*"))].map((el) =>
        parseFloat(getComputedStyle(el).fontSize),
      ),
    ),
  );
  expect(descendantFontSizes.every((size) => size >= 16)).toBe(true);
  for (let i = 1; i < geometry.length; i++) {
    expect(geometry[i].top).toBeGreaterThan(geometry[i - 1].top);
    expect(geometry[i].top).toBeGreaterThanOrEqual(geometry[i - 1].top + 1);
  }
  expect(
    geometry.every(
      (card, i) => i === 0 || Math.abs(card.width - geometry[0].width) <= 1,
    ),
  ).toBe(true);
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
  await first.getByLabel("Status").selectOption("satisfied");
  await first.getByLabel("Owner").fill("Alpha owner");
  await first.getByLabel("Assumptions").fill("Alpha assumption");
  await first.getByLabel("Why not applicable").fill("Alpha rationale");
  await first.getByLabel("Revisit when").fill("Alpha revisit");
  const alphaId = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("ai-playbook-state")!).projects.at(-1).id,
  );
  await page.getByRole("button", { name: "New project" }).click();
  const second = page.locator(".review-item").first();
  for (const label of [
    "Evidence or URL",
    "Owner",
    "Assumptions",
    "Why not applicable",
    "Revisit when",
  ]) {
    await expect(second.getByLabel(label)).toHaveValue("");
  }
  await expect(second.getByLabel("Status")).toHaveValue("not-reviewed");
  await page.getByLabel("Project").selectOption(alphaId);
  const restored = page.locator(".review-item").first();
  await expect(restored.getByLabel("Evidence or URL")).toHaveValue(
    "Project Alpha evidence",
  );
  await expect(restored.getByLabel("Status")).toHaveValue("satisfied");
  await expect(restored.getByLabel("Owner")).toHaveValue("Alpha owner");
  await expect(restored.getByLabel("Assumptions")).toHaveValue(
    "Alpha assumption",
  );
  await expect(restored.getByLabel("Why not applicable")).toHaveValue(
    "Alpha rationale",
  );
  await expect(restored.getByLabel("Revisit when")).toHaveValue(
    "Alpha revisit",
  );
  const betaId = await page.evaluate(
    (alpha) =>
      JSON.parse(localStorage.getItem("ai-playbook-state")!).projects.find(
        (project: { id: string }) => project.id !== alpha,
      ).id,
    alphaId,
  );
  await page.goto(`/troubleshoot?project=${alphaId}`);
  await page.locator(".flow-list button").first().click();
  const cause = page.locator(".diagnostic details").first();
  await cause.locator("summary").click();
  await page.getByLabel(/^Saved to/).fill("Alpha project note");
  await page.getByLabel("Project", { exact: true }).selectOption(betaId);
  await expect(page.getByLabel(/^Saved to/)).toHaveValue("");
  await page.getByLabel("Project", { exact: true }).selectOption(alphaId);
  await expect(page.getByLabel(/^Saved to/)).toHaveValue("Alpha project note");
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
  const expectedState = JSON.parse(exported!);
  delete expectedState.exportedAt;
  await page.goto("/settings");
  await page.getByLabel(/Type .*reset.*confirm/i).fill("reset");
  await page.getByRole("button", { name: /Reset local data/i }).click();
  await page.getByPlaceholder("Paste exported JSON").fill(exported!);
  await page.getByRole("button", { name: "Preview import" }).click();
  await page
    .getByRole("button", { name: /Replace|Import/i })
    .last()
    .click();
  const restoredState = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem("ai-playbook-state")!);
    delete state.exportedAt;
    return state;
  });
  expect(restoredState).toEqual(expectedState);
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
  const savedGuide = page.locator(`a[href="${guideHref}"]`);
  await expect(savedGuide).toBeVisible();
  await savedGuide.click();
  await expect(page.getByLabel(/^My note/)).toHaveValue("Read before launch");
  await expect(
    page.getByRole("button", { name: "Remove bookmark" }),
  ).toBeVisible();
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
