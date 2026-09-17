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

test("comparison shortlist allows at most three options with no fabricated default ranking", async ({
  page,
}) => {
  await page.goto("/compare");
  const picker = page.getByRole("group", { name: "Options to compare" });
  await expect(picker).toBeVisible();
  const cards = page.getByRole("article");
  const initialCount = await cards.count();
  expect(initialCount).toBeGreaterThanOrEqual(2);
  expect(initialCount).toBeLessThanOrEqual(3);

  // No default score/weight input has been fabricated into a winner: every
  // shortlisted card starts with "No verified inputs" until a person scores
  // something.
  await expect(page.getByText("No verified inputs")).toHaveCount(initialCount);

  const checkboxes = picker.getByRole("checkbox");
  const total = await checkboxes.count();
  let checkedCount = await picker.getByRole("checkbox", { checked: true }).count();
  for (let i = 0; i < total && checkedCount < 3; i++) {
    const box = checkboxes.nth(i);
    if (!(await box.isChecked())) {
      await box.check();
      checkedCount++;
    }
  }
  await expect(cards).toHaveCount(3);
  const unchecked = picker.getByRole("checkbox", { checked: false });
  const uncheckedCount = await unchecked.count();
  for (let i = 0; i < uncheckedCount; i++) {
    await expect(unchecked.nth(i)).toBeDisabled();
  }
});

test("a failed mandatory criterion and an unknown mandatory criterion are flagged distinctly, never as unsupported", async ({
  page,
}) => {
  await page.goto("/compare");
  const cards = page.getByRole("article");
  const firstCard = cards.first();
  const secondCard = cards.nth(1);

  // Before any scoring, missing mandatory evidence is flagged as unknown,
  // not as a failure.
  await expect(firstCard.getByText("Mandatory evidence missing")).toBeVisible();
  await expect(firstCard.getByText("Fails a mandatory requirement")).toHaveCount(0);

  const firstOptionName = await firstCard.locator("h3").innerText();
  await firstCard
    .getByLabel(`Operational fit for ${firstOptionName}`)
    .selectOption("0");
  await expect(firstCard.getByText("Fails a mandatory requirement")).toBeVisible();
  await expect(firstCard.getByText("Mandatory evidence missing")).toHaveCount(0);

  // The second, untouched card still reads as unknown, not failing, and the
  // two states are visually distinguished (different colors), not merged.
  await expect(secondCard.getByText("Mandatory evidence missing")).toBeVisible();
  const [failColor, unknownColor] = await Promise.all([
    firstCard
      .getByText("Fails a mandatory requirement")
      .evaluate((el) => getComputedStyle(el).color),
    secondCard
      .getByText("Mandatory evidence missing")
      .evaluate((el) => getComputedStyle(el).color),
  ]);
  expect(failColor).not.toBe(unknownColor);

  const unknownFlagText = (
    await secondCard.locator(".gate-flag-unknown").innerText()
  ).toLowerCase();
  expect(unknownFlagText).not.toMatch(/unsupported|fail/);
});

test("cost model exposes explicit units and distinguishes attempts-times-calls-per-attempt from raw call counts", async ({
  page,
}) => {
  await page.goto("/compare");
  const costModel = page.locator(".cost-model");
  await expect(
    costModel.getByRole("heading", { name: "Explicit-input cost model" }),
  ).toBeVisible();

  // Explicit units/hints are present, not just bare numeric fields.
  await expect(
    costModel.getByText(/business tasks attempted per month/i),
  ).toBeVisible();
  await expect(
    costModel.getByText(/model calls per attempt, including expected retries/i),
  ).toBeVisible();
  await expect(
    costModel.getByText(/currency per 1,000,000 input tokens/i),
  ).toBeVisible();

  // Default mode: attempts x calls-per-attempt.
  await costModel.getByLabel(/^Attempts per month/).fill("100");
  await costModel.getByLabel(/^Calls per attempt/).fill("3");
  await expect(costModel.getByText("300 model calls per month.")).toBeVisible();

  // Switching to raw call counts uses the entered value directly, not
  // multiplied by attempts.
  await costModel.getByLabel("Raw model call count").check();
  await costModel.getByLabel(/^Model calls per month/).fill("500");
  await expect(costModel.getByText("500 model calls per month.")).toBeVisible();
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

test("discovery groups questions into five named, distinguishable steps", async ({
  page,
}) => {
  await page.goto("/start");
  const nav = page.getByRole("navigation", { name: "Discovery steps" });
  for (const label of [
    "Outcome",
    "Process",
    "Consequence",
    "Authority",
    "Operations",
  ]) {
    await expect(nav.getByText(label)).toBeVisible();
    await expect(
      page.locator(".discovery-panel").getByRole("heading", { name: label, exact: true }),
    ).toBeVisible();
  }
  // Every question stays reachable on the same page regardless of which
  // named step it belongs to -- grouping is a presentation aid, not a
  // gate, so existing direct interactions keep working unchanged.
  await expect(page.getByLabel("Can fixed rules solve it?")).toBeVisible();
  await expect(page.getByLabel("What may the system do?")).toBeVisible();
});

test("discovery keeps an always-visible answer summary while answering questions", async ({
  page,
}) => {
  await page.goto("/start");
  await page.getByLabel("Can fixed rules solve it?").selectOption("yes");
  const summary = page.locator(".discovery-summary");
  await expect(summary).toContainText("Can fixed rules solve it?");
  await expect(summary).toContainText("yes");
  // Answering a later-step question keeps the earlier answer visible too.
  await page.getByLabel("What may the system do?").selectOption("autonomous");
  await expect(summary).toContainText("Can fixed rules solve it?");
  await expect(summary).toContainText("yes");
  await expect(summary).toContainText("autonomous");
});

test("discovery explains which answer triggered a recommendation and lists remaining evidence gaps", async ({
  page,
}) => {
  await page.goto("/start");
  await page.getByLabel("Can fixed rules solve it?").selectOption("yes");
  const recommendation = page
    .locator("article.result", { hasText: "Prefer conventional automation first" })
    .first();
  await expect(recommendation.getByText(/Because:/)).toContainText(
    "Can fixed rules solve it?",
  );
  await expect(
    page.getByRole("heading", { name: "Evidence still needed" }),
  ).toBeVisible();
  const gapList = page.locator(".discovery-gap-list");
  await expect(gapList).toContainText(/What is the consequence of a wrong action\?/);
});

test("discovery renders a synchronized read-only decision graph that follows live answers", async ({
  page,
}) => {
  await page.goto("/start");
  await expect(
    page.getByRole("group", { name: /decision path/i }),
  ).toBeVisible();
  await page.getByLabel("Can fixed rules solve it?").selectOption("yes");
  await expect(page.getByText("Status: Verified").first()).toBeVisible();
});

test("discovery does not crash with no answers yet and surfaces every unresolved question as an evidence gap", async ({
  page,
}) => {
  await page.goto("/start");
  await expect(page.locator("h1")).toContainText("Start a problem");
  const gapList = page.locator(".discovery-gap-list");
  await expect(gapList).toContainText("Can fixed rules solve it?");
  await expect(gapList).toContainText("What may the system do?");
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

test("troubleshooting flows are grouped and browsable by symptom", async ({
  page,
}) => {
  await page.goto("/troubleshoot");
  const nav = page.getByRole("navigation", {
    name: "Troubleshooting flows by symptom",
  });
  await expect(nav).toBeVisible();
  await expect(
    nav.getByText("The agent repeats work or keeps delegating without useful progress."),
  ).toBeVisible();
  await expect(
    nav.getByText("A restart appears to repeat an external business effect."),
  ).toBeVisible();
  await expect(nav.locator(".flow-list button")).toHaveCount(9);
});

test("a diagnostic tree visualizes cause status and stays synchronized with evidence selection", async ({
  page,
}) => {
  await page.goto("/troubleshoot");
  await page.getByRole("button", { name: "New project" }).click();
  await page.locator(".flow-list button").first().click();
  const diagram = page.getByRole("group", { name: /diagnostic tree/i });
  await expect(diagram).toBeVisible();
  const cause = page.locator(".diagnostic details").first();
  await cause.locator("summary").click();

  // Freshly opened, with no evidence recorded, the cause reads as unknown
  // both in the accessible select and in the diagram's node status text.
  await expect(cause.getByLabel("What does your evidence indicate?")).toHaveValue(
    "unknown",
  );
  await expect(page.locator(".graph-detail")).toContainText(/unknown/i);

  await cause
    .getByLabel("What does your evidence indicate?")
    .selectOption("supports");
  await expect(page.locator(".graph-detail")).toContainText(/supported/i);

  await cause
    .getByLabel("What does your evidence indicate?")
    .selectOption("rules-out");
  await expect(page.locator(".graph-detail")).toContainText(/ruled out/i);
});

test("the readable diagnostic panel shows one cause's evidence, safe mitigation and durable fix, warning while evidence is uncertain", async ({
  page,
}) => {
  await page.goto("/troubleshoot");
  await page.getByRole("button", { name: "New project" }).click();
  await page.locator(".flow-list button").first().click();
  const panel = page.locator(".diagnostic-inspector");
  await expect(panel).toBeVisible();
  await expect(panel.locator("dt", { hasText: "Evidence" })).toBeVisible();
  await expect(
    panel.locator("dt", { hasText: "Safe mitigation" }),
  ).toBeVisible();
  await expect(
    panel.locator("dt", { hasText: "Durable fix" }),
  ).toBeVisible();
  // The panel presents a single cause at a readable width, not a dense
  // multi-column comparison layout.
  const width = await panel.evaluate((el) => el.getBoundingClientRect().width);
  expect(width).toBeLessThanOrEqual(760);

  // Uncertain (unknown) evidence must keep a prominent, unconditional
  // warning against retrying or applying a fix.
  await expect(panel.getByRole("alert")).toContainText(
    /do not (retry|apply)/i,
  );

  const cause = page.locator(".diagnostic details").first();
  await cause.locator("summary").click();
  await cause
    .getByLabel("What does your evidence indicate?")
    .selectOption("supports");
  await expect(panel.getByRole("alert")).toHaveCount(0);
});

test("troubleshooting evidence persists across reload as diagnostic node status", async ({
  page,
}) => {
  await page.goto("/troubleshoot");
  await page.getByRole("button", { name: "New project" }).click();
  await page.locator(".flow-list button").first().click();
  const cause = page.locator(".diagnostic details").first();
  await cause.locator("summary").click();
  await cause
    .getByLabel("What does your evidence indicate?")
    .selectOption("rules-out");
  await expect(page.locator(".graph-detail")).toContainText(/ruled out/i);
  await page.reload();
  await page.locator(".flow-list button").first().click();
  await expect(page.locator(".graph-detail")).toContainText(/ruled out/i);
  const reopened = page.locator(".diagnostic details").first();
  await reopened.locator("summary").click();
  await expect(
    reopened.getByLabel("What does your evidence indicate?"),
  ).toHaveValue("rules-out");
});

test("troubleshooting diagnostic tree has a linear text fallback for no-JS/mobile equivalence", async ({
  page,
}) => {
  await page.goto("/troubleshoot");
  await page.locator(".flow-list button").first().click();
  const region = page.getByRole("region", {
    name: /linear|text equivalent/i,
  });
  await expect(region).toBeVisible();
  await expect(region).toContainText("Agent stuck, looping or overdelegating");
});

test("a review item requires and preserves not-applicable rationale as project-specific evidence", async ({
  page,
}) => {
  await page.goto("/review");
  await page.getByRole("button", { name: "New project" }).click();
  const first = page.locator(".review-item").first();
  await first.locator("summary").click();
  const status = first.getByLabel("Status");
  expect(
    await status
      .locator('option[value="not-applicable"]')
      .evaluate((option: HTMLOptionElement) => option.disabled),
  ).toBe(true);
  await first
    .getByLabel("Why not applicable")
    .fill("No retrieval path in this design.");
  expect(
    await status
      .locator('option[value="not-applicable"]')
      .evaluate((option: HTMLOptionElement) => option.disabled),
  ).toBe(false);
  await status.selectOption("not-applicable");
  await expect(first.locator("summary")).toContainText("not applicable");
});

test("a review item flags for reassessment when guidance content has changed since it was recorded", async ({
  page,
}) => {
  await page.goto("/review");
  await page.getByRole("button", { name: "New project" }).click();
  const projectId = await page.evaluate(
    () => JSON.parse(localStorage.getItem("ai-playbook-state")!).projects[0].id,
  );
  const first = page.locator(".review-item").first();
  await first.locator("summary").click();
  await first.getByLabel("Evidence or URL").fill("Verified against ADR-3");
  await first.getByLabel("Status").selectOption("satisfied");
  await page.evaluate((id) => {
    const state = JSON.parse(localStorage.getItem("ai-playbook-state")!);
    const project = state.projects.find((p: { id: string }) => p.id === id);
    const key = Object.keys(project.reviews)[0];
    project.reviews[key].reviewedContentVersion = "2000.01.01.0";
    localStorage.setItem("ai-playbook-state", JSON.stringify(state));
  }, projectId);
  await page.reload();
  const stale = page.locator(".review-item").first();
  await stale.locator("summary").click();
  await expect(
    stale.getByText(/guidance changed since this item was reviewed/i),
  ).toBeVisible();
  await stale.getByRole("button", { name: /mark reassessed/i }).click();
  await expect(
    stale.getByText(/guidance changed since this item was reviewed/i),
  ).toHaveCount(0);
  await expect(stale.getByLabel("Status")).toHaveValue("satisfied");
  const updatedVersion = await page.evaluate((id) => {
    const state = JSON.parse(localStorage.getItem("ai-playbook-state")!);
    const project = state.projects.find((p: { id: string }) => p.id === id);
    const key = Object.keys(project.reviews)[0];
    return project.reviews[key].reviewedContentVersion;
  }, projectId);
  expect(updatedVersion).not.toBe("2000.01.01.0");
});

test("review stage navigation shows a live unresolved count per stage without persisting a derived score", async ({
  page,
}) => {
  await page.goto("/review");
  await page.getByRole("button", { name: "New project" }).click();
  const first = page.locator(".review-item").first();
  await first.locator("summary").click();
  await first.getByLabel("Status").selectOption("unresolved");
  const stageNav = page.getByRole("navigation", { name: /review stages/i });
  await expect(stageNav.getByText(/1 unresolved/i)).toBeVisible();
  await first.getByLabel("Status").selectOption("satisfied");
  await expect(stageNav.getByText(/1 unresolved/i)).toHaveCount(0);
  const projectKeys = await page.evaluate(
    () =>
      Object.keys(
        JSON.parse(localStorage.getItem("ai-playbook-state")!).projects[0],
      ),
  );
  expect(projectKeys.sort()).toEqual(
    ["id", "name", "createdAt", "updatedAt", "answers", "reviews", "notes"].sort(),
  );
});

test("projects list and detail surface decisions, evidence gaps and next actions without a fabricated readiness score", async ({
  page,
}) => {
  await page.goto("/start");
  await page.getByLabel(/^Project name/).fill("Workspace project");
  await page.getByRole("button", { name: "Save as project" }).click();
  await expect(page).toHaveURL(/\/projects\//);
  await page.goto("/projects");
  await expect(page.getByText("Workspace project")).toBeVisible();
  await expect(page.getByText(/readiness/i)).toHaveCount(0);
  await page.getByRole("link", { name: /Workspace project/ }).first().click();
  await expect(
    page.getByRole("heading", { name: "Workspace project", level: 1 }),
  ).toBeVisible();
  await expect(page.getByText(/readiness/i)).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: /design review/i }),
  ).toBeVisible();
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

test("settings shows a conflict count for a matching project ID, and merge/replace resolve it as documented", async ({
  page,
}) => {
  await page.goto("/start");
  await page.getByLabel(/^Project name/).fill("Local project");
  await page.getByRole("button", { name: "Save as project" }).click();
  const local = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("ai-playbook-state")!),
  );
  const localProjectId = local.projects[0].id;

  // Same project ID, different name/answers: a genuine conflict, not a
  // fresh addition.
  const conflicting = {
    ...local,
    projects: [
      {
        ...local.projects[0],
        name: "Imported name",
        answers: { imported: "value" },
      },
    ],
  };

  await page.goto("/settings");
  await page
    .getByPlaceholder("Paste exported JSON")
    .fill(JSON.stringify(conflicting));
  await page.getByRole("button", { name: "Preview import" }).click();
  await expect(page.getByText(/1 project ID conflict/i)).toBeVisible();
  await expect(page.getByText(/Merge keeps local values/i)).toBeVisible();
  await expect(
    page.getByText(/Replace discards all current local data/i),
  ).toBeVisible();

  await page.getByRole("button", { name: "Merge with current data" }).click();
  const merged = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("ai-playbook-state")!),
  );
  const mergedProject = merged.projects.find(
    (p: any) => p.id === localProjectId,
  );
  // Merge keeps the local name but absorbs the non-conflicting imported field.
  expect(mergedProject.name).toBe("Local project");
  expect(mergedProject.answers.imported).toBe("value");

  await page.goto("/settings");
  await page
    .getByPlaceholder("Paste exported JSON")
    .fill(JSON.stringify(conflicting));
  await page.getByRole("button", { name: "Preview import" }).click();
  await page.getByRole("button", { name: "Replace current data" }).click();
  const replaced = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("ai-playbook-state")!),
  );
  // Replace discards the local record entirely in favor of the imported one.
  expect(
    replaced.projects.find((p: any) => p.id === localProjectId).name,
  ).toBe("Imported name");
});

test("settings offers a recovery download for unreadable local data and resolving it stops blocking writes", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem("ai-playbook-state", "{corrupt-json"),
  );
  await page.reload();
  await expect(page.getByText(/Saved data could not be read/)).toBeVisible();

  await page.goto("/settings");
  const recovery = page.getByRole("button", {
    name: "Download unreadable saved data",
  });
  await expect(recovery).toBeVisible();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    recovery.click(),
  ]);
  expect(download.suggestedFilename()).toBe("corrupt-playbook-recovery.txt");

  await page.getByLabel(/Type .*reset.*confirm/i).fill("reset");
  await page.getByRole("button", { name: /Reset local data/i }).click();
  // Resolving unblocks writes: the banner clears and the corrupt raw value
  // in storage is overwritten by a valid, empty state.
  await expect(page.getByText(/Saved data could not be read/)).toHaveCount(0);
  const raw = await page.evaluate(() =>
    localStorage.getItem("ai-playbook-state"),
  );
  expect(raw).not.toBe("{corrupt-json");
  expect(JSON.parse(raw!).projects).toEqual([]);
});

test("the shell surfaces a message and export still works when browser storage writes fail", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === "ai-playbook-state") {
        throw new DOMException(
          "The quota has been exceeded.",
          "QuotaExceededError",
        );
      }
      return original.call(this, key, value);
    };
  });
  await page.goto("/settings");
  await expect(page.getByText(/Changes could not be saved/i)).toBeVisible();
  await expect(
    page.getByText(/Export or copy your work before continuing/i),
  ).toBeVisible();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Download export" }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(
    /^ai-playbook-\d{4}-\d{2}-\d{2}\.json$/,
  );
});

test("glossary filters terms live and links back to the guides that use them", async ({
  page,
}) => {
  await page.goto("/glossary");
  await expect(
    page.getByRole("heading", { level: 1, name: "Glossary" }),
  ).toBeVisible();
  const filter = page.getByLabel("Filter glossary");
  await filter.fill("zqxjnonexistentterm");
  await expect(page.getByText("No terms match")).toBeVisible();
  await filter.fill("idempot");
  await expect(page.getByText("Idempotency")).toBeVisible();
  const entry = page.locator(".glossary-entry", { hasText: "Idempotency" });
  const relatedLink = entry.getByRole("link").first();
  await expect(relatedLink).toBeVisible();
  await relatedLink.click();
  await expect(page).toHaveURL(/\/guides\/durable-execution/);
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

const ALL_GUIDE_IDS = [
  "business-discovery",
  "architecture",
  "workflow-patterns",
  "framework-selection",
  "context-engineering",
  "retrieval",
  "memory",
  "tool-design",
  "durable-execution",
  "security",
  "evaluations",
  "cost-capacity",
  "release-operations",
  "leadership",
  "harness-engineering",
];

const GUIDE_ONLY_DIAGRAMS: Record<string, string> = {
  "context-engineering": "Context assembly and compaction model",
  retrieval: "Retrieval pipeline and evidence trace",
  "harness-engineering": "Agent harness execution loop",
  "durable-execution": "Durable execution state model",
};

test("Learn/Explore landing page offers topic and stage filters with substantive previews", async ({
  page,
}) => {
  await page.goto("/explore");
  await expect(
    page.getByRole("search", { name: "Filter guides" }),
  ).toBeVisible();
  await expect(page.getByLabel("Filter by category")).toBeVisible();
  await expect(page.getByLabel("Filter by stage")).toBeVisible();

  // A preview must show more than the bare title: the guide's own summary
  // and decision rule ("Use it when: ...") both come from real content.
  const firstCard = page.locator(".guide-index-item").first();
  await expect(firstCard.locator(".guide-index-summary")).not.toBeEmpty();
  await expect(firstCard.getByText(/Use it when:/)).toBeVisible();

  await page.getByLabel("Filter by stage").selectOption("operations");
  await expect(page.locator(".guide-index-item")).not.toHaveCount(0);
  const stageBadges = await page
    .locator(".guide-index-item")
    .first()
    .locator(".badge")
    .allInnerTexts();
  expect(stageBadges.join(" ")).toContain("operations");
});

const KNOWN_TOP_LEVEL_ROUTES = [
  "/",
  "/start",
  "/explore",
  "/review",
  "/troubleshoot",
  "/compare",
  "/projects",
  "/bookmarks",
  "/glossary",
  "/sources",
  "/settings",
];

test("every guide route renders through the guide shell with core fields present, with no console errors or broken internal links", async ({
  page,
}) => {
  // Each iteration below is a full hard navigation (page.goto), and
  // GuidePage's module is now lazy-loaded (Task 13) rather than bundled
  // into the eagerly-loaded main entry, so every one of these 15 reloads
  // now pays its own chunk-fetch round trip under the (unbundled) Vite dev
  // server. That pushed this test's already-substantial 15-guide loop
  // close to, and occasionally over, the default 30s test timeout even
  // though each guide renders correctly — a real, expected cost of route
  // splitting on this particular full-reload-heavy test, not a
  // functional regression.
  test.setTimeout(60000);
  expect(ALL_GUIDE_IDS.length).toBe(15);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  for (const id of ALL_GUIDE_IDS) {
    await page.goto(`/guides/${id}`);
    await expect(page.locator("h1")).not.toBeEmpty();
    await expect(page.locator("#orientation")).toContainText(/min read/i);
    await expect(page.locator("#decision-rule")).toBeVisible();
    await expect(page.locator("#applicability")).toBeVisible();
    await expect(page.locator("#implementation")).toBeVisible();
    await expect(page.locator("#verification")).toBeVisible();
    await expect(page.locator("#safe-actions")).toBeVisible();
    await expect(page.locator("#sources")).toContainText("Sources");

    // Every internal link this guide renders must resolve to a real route:
    // either another known guide, a top-level route, or a same-page anchor.
    const hrefs = await page
      .locator("a[href^='/'], a[href^='#']")
      .evaluateAll((els) => els.map((el) => el.getAttribute("href") || ""));
    for (const href of hrefs) {
      if (href.startsWith("#")) continue;
      const [path] = href.split("#");
      const isGuideLink =
        path.startsWith("/guides/") &&
        ALL_GUIDE_IDS.includes(path.replace("/guides/", ""));
      const isTopLevel = KNOWN_TOP_LEVEL_ROUTES.includes(path);
      expect(isGuideLink || isTopLevel, `broken internal link: ${href}`).toBe(
        true,
      );
    }
  }
  expect(errors).toEqual([]);
});

test("the three new system diagrams render only on their relevant guides, not on every guide", async ({
  page,
}) => {
  for (const [id, title] of Object.entries(GUIDE_ONLY_DIAGRAMS)) {
    await page.goto(`/guides/${id}`);
    await expect(page.locator("#mechanism")).toBeVisible();
    await expect(
      page.getByRole("group", { name: new RegExp(title, "i") }),
    ).toBeVisible();
  }
  const otherGuideIds = ALL_GUIDE_IDS.filter(
    (id) => !(id in GUIDE_ONLY_DIAGRAMS),
  );
  for (const id of otherGuideIds) {
    await page.goto(`/guides/${id}`);
    await expect(page.locator("#mechanism")).toHaveCount(0);
  }
});

test("guide continue-reading section presents sources, related guides, glossary and bookmark status together", async ({
  page,
}) => {
  await page.goto("/guides/durable-execution");
  const section = page.locator("#sources");
  await expect(
    section.getByRole("heading", { name: "Continue reading" }),
  ).toBeVisible();
  await expect(
    section.getByRole("heading", { name: "Related guides" }),
  ).toBeVisible();
  await expect(
    section.getByRole("link", { name: /Design tools/i }),
  ).toBeVisible();
  await expect(
    section.getByRole("heading", { name: "Glossary", exact: true }),
  ).toBeVisible();
  await expect(section.getByText(/Idempotency/)).toBeVisible();
  await expect(section.getByText(/bookmarked/i)).toBeVisible();
  await expect(section.getByRole("link", { name: "Bookmarks" })).toBeVisible();
});

test("navigating to a lazy-loaded route through the nav does not lose or trap keyboard focus", async ({
  page,
}) => {
  await page.goto("/");
  const settingsLink = page
    .getByRole("navigation", { name: "Operate" })
    .getByRole("link", { name: "Settings" });
  await settingsLink.focus();
  await settingsLink.click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // Focus must not be left referencing a node the Suspense swap removed.
  const activeAfterLoad = await page.evaluate(() => ({
    tag: document.activeElement?.tagName ?? null,
    inDocument: document.activeElement
      ? document.body.contains(document.activeElement)
      : false,
  }));
  expect(activeAfterLoad.tag).not.toBeNull();
  expect(activeAfterLoad.inDocument).toBe(true);

  // Tabbing onward must reach a real, attached element too, not a dead end.
  await page.keyboard.press("Tab");
  const activeAfterTab = await page.evaluate(() => ({
    tag: document.activeElement?.tagName ?? null,
    inDocument: document.activeElement
      ? document.body.contains(document.activeElement)
      : false,
  }));
  expect(activeAfterTab.tag).not.toBeNull();
  expect(activeAfterTab.inDocument).toBe(true);
});

test("the route-loading spinner is disabled under prefers-reduced-motion", async ({
  page,
}) => {
  // React Router wraps in-app link navigations in React's startTransition,
  // which keeps the previously-committed page on screen instead of showing
  // the Suspense fallback while the next route's chunk loads (verified by
  // manual instrumentation: the fallback never mounted on a same-tab nav
  // even with a multi-second artificial delay). The fallback is only
  // reachable on the route's *first* commit, i.e. a direct/hard navigation
  // such as a fresh page load or refresh — so exercise it that way here.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/*Settings*", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    await route.continue();
  });
  await page.goto("/settings");
  const spinner = page.locator(".route-fallback__spinner");
  await expect(spinner).toBeVisible();
  // Chromium normalizes the near-zero duration set by the global
  // prefers-reduced-motion rule to a value like "0s" rather than echoing
  // "0.01ms" back literally, so compare the parsed magnitude (in ms)
  // instead of the raw string. The un-reduced spin is 800ms; anything
  // under 1ms confirms the reduced-motion override won.
  const durationMs = await spinner.evaluate((el) => {
    const raw = getComputedStyle(el).animationDuration;
    const value = parseFloat(raw);
    return raw.trim().endsWith("ms") ? value : value * 1000;
  });
  expect(durationMs).toBeLessThan(1);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("a lazy route chunk that fails to load shows a recoverable reload prompt instead of a blank page", async ({
  page,
}) => {
  await page.goto("/");
  const pageErrors: string[] = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));
  await page.route("**/*Settings*", (route) => route.abort());
  const settingsLink = page
    .getByRole("navigation", { name: "Operate" })
    .getByRole("link", { name: "Settings" });
  await settingsLink.click();

  const alert = page.getByRole("alert");
  await expect(alert).toBeVisible();
  await expect(alert.getByRole("button", { name: /reload/i })).toBeVisible();

  const bodyText = (await page.locator("body").innerText()).trim();
  expect(bodyText.length).toBeGreaterThan(0);
  // The header shell (nav, search, skip link) survives the failure; only
  // the routed content area shows the recoverable error.
  await expect(
    page.getByRole("navigation", { name: "Operate" }),
  ).toBeVisible();
  expect(pageErrors).toEqual([]);
});

for (const viewport of viewports) {
  test(`deterministic screenshots at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    // 13 full-page screenshots per viewport (including a seeded project
    // detail page) exceed the default 30s test timeout under the dev
    // server's per-route chunk-fetch cost; see the equivalent note on the
    // "every guide route renders..." test above.
    test.setTimeout(60000);
    await page.goto("/start");
    await page
      .getByLabel(/^Project name/)
      .fill("Screenshot audit project");
    await page.getByRole("button", { name: "Save as project" }).click();
    const projectId = await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("ai-playbook-state")!).projects.at(-1)
          .id,
    );
    await page.setViewportSize(viewport);
    for (const route of [
      "/",
      "/explore",
      "/guides/durable-execution",
      "/start",
      "/review",
      "/troubleshoot",
      "/compare",
      "/projects",
      `/projects/${projectId}`,
      "/bookmarks",
      "/glossary",
      "/sources",
      "/settings",
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
