import { test,expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('all primary routes render without runtime errors or external data requests',async({page,baseURL})=>{
  const errors:string[]=[];const external:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(!r.url().startsWith(baseURL!)&&!r.url().startsWith('data:'))external.push(r.url());});
  for(const route of ['/','/start','/explore','/review','/troubleshoot','/compare','/projects','/bookmarks','/glossary','/sources','/settings']){
    await page.goto(route);await expect(page.locator('h1')).toBeVisible();
  }
  expect(errors).toEqual([]);expect(external).toEqual([]);
});

test('required search terms lead to useful guides and deep links survive refresh',async({page})=>{
  for(const query of ['agent stuck','memory versus RAG','framework selection','duplicate action']){
    await page.goto(`/explore?q=${encodeURIComponent(query)}`);
    await expect(page.locator('.guide-index a').first()).toBeVisible();
    await page.locator('.guide-index a').first().click();
    await page.reload();await expect(page.locator('h1')).toBeVisible();
  }
  await page.goto('/explore?q=zqxjnonexistent');await expect(page.getByText('No guidance found')).toBeVisible();
  await page.goto('/missing-route');await expect(page.locator('h1')).toBeVisible();
});

test('guide exposes examples, evidence and local notes/bookmarks',async({page})=>{
  await page.goto('/guides/durable-execution');
  await expect(page.getByText('Hypothetical worked example')).toBeVisible();
  await page.getByLabel(/^My note/).fill('Reconcile notification op-42 before retry.');
  await page.getByRole('button',{name:'Bookmark guide',exact:true}).click();
  await page.reload();await expect(page.getByLabel(/^My note/)).toHaveValue('Reconcile notification op-42 before retry.');
  await page.goto('/bookmarks');await expect(page.getByRole('link',{name:/Recover without duplicating/})).toBeVisible();
});

test('discovery explains rules and action controls then saves independent projects',async({page})=>{
  await page.goto('/start');await page.getByLabel(/^Project name/).fill('Rules project');
  await page.getByLabel('Can fixed rules solve it?').selectOption('yes');
  await expect(page.getByText('Prefer conventional automation first')).toBeVisible();
  await page.getByRole('button',{name:'Save as project'}).click();
  await page.goto('/start');await page.getByLabel(/^Project name/).fill('Actions project');
  await page.getByLabel('What may the system do?').selectOption('approved-action');
  await page.getByLabel('How quickly must it finish?').selectOption('long-running');
  await expect(page.getByText('Persist execution state')).toBeVisible();
  await page.getByRole('button',{name:'Save as project'}).click();
  const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('ai-playbook-state')!));
  expect(state.projects).toHaveLength(2);
  expect(state.projects.find((p:any)=>p.name==='Rules project').answers.rules).toBe('yes');
  expect(state.projects.find((p:any)=>p.name==='Actions project').answers.autonomy).toBe('approved-action');
});

test('corrupt browser data survives reload without silent replacement',async({page})=>{
  await page.goto('/');await page.evaluate(()=>localStorage.setItem('ai-playbook-state','{broken-json'));
  await page.reload();await expect(page.getByText(/Saved data could not be read/)).toBeVisible();
  expect(await page.evaluate(()=>localStorage.getItem('ai-playbook-state'))).toBe('{broken-json');
  await page.reload();expect(await page.evaluate(()=>localStorage.getItem('ai-playbook-state'))).toBe('{broken-json');
});

test('mobile navigation, guide and graph fit the viewport',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  for(const path of ['/','/explore','/guides/durable-execution','/compare']){
    await page.goto(path);await expect(page.locator('h1')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
  }
  await page.screenshot({path:'test-results/mobile-guide.png',fullPage:true});
});

test('core screens have no serious or critical automated accessibility violations',async({page})=>{
  for(const path of ['/','/start','/guides/durable-execution','/settings']){
    await page.goto(path);await expect(page.locator('h1')).toBeVisible();
    const result=await new AxeBuilder({page}).analyze();
    expect(result.violations.filter(v=>['serious','critical'].includes(v.impact||'')).map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  }
});
