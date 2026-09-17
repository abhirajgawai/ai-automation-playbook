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

test("home states the promise and offers primary actions into every core flow", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /build systems you can explain/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(/navigate uncertain ai and automation decisions/i),
  ).toBeVisible();
  for (const name of [
    "Map a new problem",
    "Explore guidance",
    "Compare approaches",
    "Troubleshoot a symptom",
  ]) {
    await expect(page.getByRole("link", { name })).toBeVisible();
  }
});

test("home lays out a varied Discover, Design, Verify, Operate stage path", async ({
  page,
}) => {
  await page.goto("/");
  const stageHeadings = page.locator(".home-stage-path h3");
  await expect(stageHeadings).toHaveText(["Discover", "Design", "Verify", "Operate"]);
  await expect(
    page.getByRole("link", { name: "Browse guidance by concern" }),
  ).toHaveAttribute("href", "/explore");
  await expect(
    page.getByRole("link", { name: "Start a design decision" }),
  ).toHaveAttribute("href", "/start");
  await expect(
    page.getByRole("link", { name: "Open a design review" }),
  ).toHaveAttribute("href", "/review");
  await expect(
    page.getByRole("link", { name: "Diagnose a symptom" }),
  ).toHaveAttribute("href", "/troubleshoot");
  // The four stages should not read as identical dashboard cards: their
  // layouts differ (a two-column feature, an inline pair, a narrow column
  // and a wrapping row).
  const gridColumns = await page.evaluate(() =>
    [...document.querySelectorAll(".home-stage-path > li")].map(
      (el) => getComputedStyle(el).gridTemplateColumns,
    ),
  );
  expect(new Set(gridColumns).size).toBeGreaterThan(1);
});

test("home explains that personal data stays local", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".home-local-callout")).toContainText(
    /stays in this browser/i,
  );
  await expect(page.locator(".home-local-callout")).toContainText(
    /stored only in this browser/i,
  );
});

test("home hides recent work and evidence sections when there is no local data", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Continue where you left off" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Evidence still needed" })).toHaveCount(0);
});

test("home surfaces a recent project, a saved guide and unresolved evidence once local data exists", async ({
  page,
}) => {
  await page.goto("/start");
  await page.getByLabel(/^Project name/).fill("Homepage continuation project");
  await page.getByRole("button", { name: "Save as project" }).click();
  await page.goto("/guides/durable-execution");
  await page.getByRole("button", { name: "Bookmark guide" }).click();
  const projectId = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("ai-playbook-state")!).projects.at(0)
        .id,
  );
  await page.goto(`/review?project=${projectId}`);
  const first = page.locator(".review-item").first();
  await first.locator("summary").click();
  await first.getByLabel("Status").selectOption("unresolved");

  await page.goto("/");
  const continueSection = page.locator(".home-continue");
  await expect(continueSection.getByRole("heading")).toHaveText(
    "Continue where you left off",
  );
  await expect(
    continueSection.getByRole("link", {
      name: /Homepage continuation project/,
    }),
  ).toBeVisible();
  await expect(
    continueSection.locator('a[href="/guides/durable-execution"]'),
  ).toBeVisible();
  const evidenceSection = page.locator(".home-evidence");
  await expect(evidenceSection.getByRole("heading")).toHaveText(
    "Evidence still needed",
  );
  await expect(
    evidenceSection.getByRole("link", {
      name: /Homepage continuation project/,
    }),
  ).toHaveAttribute("href", `/review?project=${projectId}`);
});

test("desktop navigation groups routes into Learn, Decide and Operate with active-route indication", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/explore");
  const learn = page.getByRole("navigation", { name: "Learn" });
  const decide = page.getByRole("navigation", { name: "Decide" });
  const operate = page.getByRole("navigation", { name: "Operate" });
  await expect(learn).toBeVisible();
  await expect(decide).toBeVisible();
  await expect(operate).toBeVisible();
  await expect(learn.getByRole("link", { name: "Explore" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(
    decide.getByRole("link", { name: "Start a problem" }),
  ).toBeVisible();
  await expect(
    operate.getByRole("link", { name: "Troubleshoot" }),
  ).toBeVisible();
});

test("mobile navigation opens as a disclosure, closes on Escape and returns focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Menu" });
  await expect(page.getByRole("navigation", { name: "Learn" })).toBeHidden();
  await toggle.click();
  await expect(page.getByRole("navigation", { name: "Learn" })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Operate" }).getByRole("link", {
      name: "Troubleshoot",
    }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation", { name: "Learn" })).toBeHidden();
  await expect(toggle).toBeFocused();
});

test("search command opens with a keyboard shortcut and navigates to a result", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("/");
  const dialog = page.getByRole("dialog", { name: /search/i });
  await expect(dialog).toBeVisible();
  await page.getByLabel(/search the playbook/i).fill("duplicate action");
  await page
    .getByRole("link", {
      name: /recover without duplicating business actions/i,
    })
    .first()
    .click();
  await expect(page).toHaveURL(/\/guides\/durable-execution/);
  await expect(dialog).toBeHidden();
});

test("decision diagram canvas nodes are keyboard selectable and update the inspector", async ({
  page,
}) => {
  await page.goto("/");
  const canvasNode = page.locator(".react-flow__node", {
    hasText: "Bound action + gather evidence",
  });
  await canvasNode.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".graph-detail strong")).toHaveText(
    "Bound action + gather evidence",
  );
});

test("decision diagram exposes a legend, fit control and a complete linear text equivalent", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Fit diagram" }),
  ).toBeVisible();
  await expect(
    page.getByRole("list", { name: "Diagram legend" }),
  ).toBeVisible();
  const region = page.getByRole("region", {
    name: /linear text equivalent/i,
  });
  await expect(region).toBeVisible();
  await region.locator("summary").click();
  const text = (await region.innerText()).toLowerCase();
  expect(text).toContain("map the consequence");
  expect(text).toContain("gather evidence");
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

test("guide shows orientation metadata, a decision rule and a state-model diagram with a linear alternative", async ({
  page,
}) => {
  await page.goto("/guides/durable-execution");
  await expect(
    page.getByRole("heading", { name: "Orientation", level: 2 }),
  ).toBeVisible();
  const orientation = page.locator("#orientation");
  await expect(orientation).toContainText(/min read/i);
  await expect(orientation).toContainText("Reviewed");
  await expect(orientation).toContainText(/source/i);

  const decisionRule = page.locator("#decision-rule");
  await expect(decisionRule.getByText("When to use this")).toBeVisible();

  const mechanism = page.locator("#mechanism");
  await expect(
    mechanism.getByRole("group", { name: /diagram/i }),
  ).toBeVisible();
  await expect(
    mechanism.getByRole("region", { name: /linear|text equivalent/i }),
  ).toBeVisible();
});

test("guide prose renders at a readable measure", async ({ page }) => {
  await page.goto("/guides/durable-execution");
  const paragraph = page.locator(".guide-body p").first();
  const { width, fontSize } = await paragraph.evaluate((el) => ({
    width: el.getBoundingClientRect().width,
    fontSize: parseFloat(getComputedStyle(el).fontSize),
  }));
  // 60-72 characters per line at roughly 0.55em average character width.
  const approxChars = width / (fontSize * 0.55);
  expect(approxChars).toBeLessThanOrEqual(80);
});

test("guide shows safe and dangerous actions without a collapsed detail hiding them", async ({
  page,
}) => {
  await page.goto("/guides/durable-execution");
  const section = page.locator("#safe-actions");
  await expect(section.getByText(/Dangerous:/)).toBeVisible();
  await expect(
    section.getByRole("heading", { name: "Safe response" }),
  ).toBeVisible();
  // Neither the dangerous nor the safe callout may be inside a closed
  // <details> element.
  const hiddenCount = await section.evaluate(
    (el) => el.querySelectorAll("details:not([open])").length,
  );
  expect(hiddenCount).toBe(0);
});

test("guide offers in-page section navigation and a deep anchor scrolls to and focuses that section", async ({
  page,
}) => {
  await page.goto("/guides/durable-execution");
  await expect(
    page.getByRole("navigation", { name: "Guide sections" }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("navigation", { name: "Guide sections" })
      .getByRole("link", { name: /Safe vs\. dangerous actions/i }),
  ).toHaveAttribute("href", "#safe-actions");

  await page.goto("/guides/durable-execution#safe-actions");
  await expect(page.locator("#safe-actions")).toBeFocused();
});

test("guide route survives a hard refresh and browser back/forward", async ({
  page,
}) => {
  await page.goto("/explore");
  await page.goto("/guides/durable-execution");
  await expect(page.locator("h1")).toHaveText(
    "Recover without duplicating business actions",
  );
  await page.reload();
  await expect(page.locator("h1")).toHaveText(
    "Recover without duplicating business actions",
  );
  await page.goBack();
  await expect(page).toHaveURL(/\/explore/);
  await page.goForward();
  await expect(page).toHaveURL(/\/guides\/durable-execution/);
});

test("guide sources are scoped to that guide", async ({ page }) => {
  await page.goto("/guides/durable-execution");
  const sourcesSection = page.locator("#sources");
  await expect(
    sourcesSection.getByRole("heading", { name: "Sources", exact: true }),
  ).toBeVisible();
  await expect(sourcesSection.getByRole("link")).not.toHaveCount(0);
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
