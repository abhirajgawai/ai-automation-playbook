import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("all primary routes render without runtime errors or external data requests", async ({
  page,
  baseURL,
}) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (!r.url().startsWith(baseURL!) && !r.url().startsWith("data:"))
      external.push(r.url());
  });
  for (const route of [
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
  ]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
  }
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test("required search terms lead to useful guides and deep links survive refresh", async ({
  page,
}) => {
  for (const query of [
    "agent stuck",
    "memory versus RAG",
    "framework selection",
    "duplicate action",
  ]) {
    await page.goto(`/explore?q=${encodeURIComponent(query)}`);
    await expect(page.locator(".guide-index a").first()).toBeVisible();
    await page.locator(".guide-index a").first().click();
    await page.reload();
    await expect(page.locator("h1")).toBeVisible();
  }
  await page.goto("/explore?q=zqxjnonexistent");
  await expect(page.getByText("No guidance found")).toBeVisible();
  await page.goto("/missing-route");
  await expect(page.locator("h1")).toBeVisible();
});

test("guide exposes examples, evidence and local notes/bookmarks", async ({
  page,
}) => {
  await page.goto("/guides/durable-execution");
  await expect(
    page.getByRole("heading", { name: "Hypothetical worked examples" }),
  ).toBeVisible();
  await page
    .getByLabel(/^My note/)
    .fill("Reconcile notification op-42 before retry.");
  await page
    .getByRole("button", { name: "Bookmark guide", exact: true })
    .click();
  await page.reload();
  await expect(page.getByLabel(/^My note/)).toHaveValue(
    "Reconcile notification op-42 before retry.",
  );
  await page.goto("/bookmarks");
  await expect(
    page.getByRole("link", { name: /Recover without duplicating/ }),
  ).toBeVisible();
});

test("discovery explains rules and action controls then saves independent projects", async ({
  page,
}) => {
  await page.goto("/start");
  await page.getByLabel(/^Project name/).fill("Rules project");
  await page.getByLabel("Can fixed rules solve it?").selectOption("yes");
  await expect(
    page.getByText("Prefer conventional automation first"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Save as project" }).click();
  await page.goto("/start");
  await page.getByLabel(/^Project name/).fill("Actions project");
  await page
    .getByLabel("What may the system do?")
    .selectOption("approved-action");
  await page
    .getByLabel("How quickly must it finish?")
    .selectOption("long-running");
  await expect(page.getByText("Persist execution state")).toBeVisible();
  await page.getByRole("button", { name: "Save as project" }).click();
  const state = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("ai-playbook-state")!),
  );
  expect(state.projects).toHaveLength(2);
  expect(
    state.projects.find((p: any) => p.name === "Rules project").answers.rules,
  ).toBe("yes");
  expect(
    state.projects.find((p: any) => p.name === "Actions project").answers
      .autonomy,
  ).toBe("approved-action");
});

test("corrupt browser data survives reload without silent replacement", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem("ai-playbook-state", "{broken-json"),
  );
  await page.reload();
  await expect(page.getByText(/Saved data could not be read/)).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("ai-playbook-state")),
  ).toBe("{broken-json");
  await page.reload();
  expect(
    await page.evaluate(() => localStorage.getItem("ai-playbook-state")),
  ).toBe("{broken-json");
});

test("review records evidence per project and requires a not-applicable rationale", async ({
  page,
}) => {
  await page.goto("/review");
  await page.getByRole("button", { name: "New project" }).click();
  const item = page.locator(".review-item").first();
  await item.locator("summary").click();
  const status = item.getByLabel("Status");
  expect(
    await status
      .locator('option[value="not-applicable"]')
      .evaluate((option: HTMLOptionElement) => option.disabled),
  ).toBe(true);
  await item
    .getByLabel("Why not applicable")
    .fill("This design has no retrieval path.");
  await status.selectOption("not-applicable");
  await item.getByLabel("Evidence or URL").fill("Architecture decision ADR-12");
  await page.reload();
  await expect(
    page.locator(".review-item").first().getByLabel("Status"),
  ).toHaveValue("not-applicable");
  await expect(
    page.locator(".review-item").first().getByLabel("Evidence or URL"),
  ).toHaveValue("Architecture decision ADR-12");
});

test("troubleshooting narrows causes and persists project evidence", async ({
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
  await page
    .getByLabel(/^Saved to/)
    .fill("Trace ID tr-42 rules out a provider timeout.");
  await expect(page.getByText("Remaining plausible:")).not.toContainText(
    await cause.locator("summary").innerText(),
  );
  await page.reload();
  await expect(page.getByLabel(/^Saved to/)).toHaveValue(
    "Trace ID tr-42 rules out a provider timeout.",
  );
});

test("settings rejects invalid imports without changing current data", async ({
  page,
}) => {
  await page.goto("/start");
  await page.getByLabel(/^Project name/).fill("Keep me");
  await page.getByRole("button", { name: "Save as project" }).click();
  await page.goto("/settings");
  await page
    .getByPlaceholder("Paste exported JSON")
    .fill('{"schemaVersion":2}');
  await page.getByRole("button", { name: "Preview import" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Existing data was not changed",
  );
  const names = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("ai-playbook-state")!).projects.map(
      (project: { name: string }) => project.name,
    ),
  );
  expect(names).toContain("Keep me");
});

test("decision graph has a keyboard-operable text equivalent", async ({
  page,
}) => {
  await page.goto("/");
  const step = page.getByRole("button", { name: "Map error consequence" });
  await step.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".graph-detail strong")).toHaveText(
    "Map error consequence",
  );
  await expect(page.locator(".linear")).toContainText(
    "Check whether stable rules are sufficient",
  );
});

test("mobile navigation, guide and graph fit the viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of [
    "/",
    "/explore",
    "/guides/durable-execution",
    "/compare",
  ]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
    ).toBe(true);
    expect(
      await page
        .locator("body")
        .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
    ).toBeGreaterThanOrEqual(16);
  }
  await page.screenshot({
    path: "test-results/mobile-guide.png",
    fullPage: true,
  });
});

test("core screens have no serious or critical automated accessibility violations", async ({
  page,
}) => {
  for (const path of [
    "/",
    "/start",
    "/guides/durable-execution",
    "/settings",
  ]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    const result = await new AxeBuilder({ page }).analyze();
    expect(
      result.violations
        .filter((v) => ["serious", "critical"].includes(v.impact || ""))
        .map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
  }
});
