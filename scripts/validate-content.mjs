import fs from 'node:fs';
import assert from 'node:assert/strict';
const read = name => JSON.parse(fs.readFileSync(new URL(`../src/content/${name}.json`, import.meta.url)));
const categories = read('categories'), guides = read('guides'), sources = read('sources');
const checklists = read('checklists'), flows = read('troubleshooting'), comparisons = read('comparisons');
const glossary = read('glossary'), coverage = read('coverage');
const stages = new Set(['discovery','architecture','implementation','pre-release','operations']);
const ids = list => new Set(list.map(x => x.id));
for (const list of [categories,guides,sources,checklists,flows,comparisons,glossary,coverage]) {
  assert.equal(ids(list).size, list.length, 'Duplicate IDs');
  for (const item of list) assert.match(item.id, /^[a-zA-Z0-9][a-zA-Z0-9.-]*$/);
}
const categoryIds = ids(categories), guideIds = ids(guides), sourceIds = ids(sources);
assert.equal(categories.length,13);
for(let n=1;n<=13;n++)assert(categoryIds.has(`C${String(n).padStart(2,'0')}`));
const refs = (values, targets, context) => { assert(Array.isArray(values),context); for(const value of values)assert(targets.has(value),`${context}: missing ${value}`); };
const strings = (values, context) => { assert(Array.isArray(values)&&values.length,context); values.forEach(v=>assert(typeof v==='string'&&v.trim(),context)); };
for (const g of guides) {
  assert(categoryIds.has(g.categoryId));
  for(const key of ['title','summary','owner','reviewedAt','contentVersion'])assert(typeof g[key]==='string'&&g[key].trim(),`${g.id}.${key}`);
  refs(g.stages,stages,g.id); refs(g.relatedGuideIds,guideIds,g.id); refs(g.sourceIds,sourceIds,g.id);
  for(const key of ['required','optional','unnecessary'])assert(g.applicability[key]?.trim());
  for(const key of ['tags','prerequisites','tradeoffs','decisionCriteria','verification','reconsiderWhen'])strings(g[key],`${g.id}.${key}`);
  assert(g.sections.length); for(const s of g.sections){assert(s.title.trim());strings(s.body,`${g.id}.sections`);}
  assert(g.examples.length&&g.alternatives.length&&g.failureModes.length);
  for(const a of g.alternatives)for(const key of ['name','benefits','costs','limitations'])assert(a[key]?.trim());
  for(const e of g.examples)assert(e.title?.trim()&&e.body?.trim());
  for(const f of g.failureModes)for(const key of ['symptom','cause','diagnostic','mitigation'])assert(f[key]?.trim());
}
for(const c of categories)assert(guides.some(g=>g.categoryId===c.id));
for(const s of sources){assert(['reviewed','unverified'].includes(s.status));assert.equal(new URL(s.url).protocol,'https:');if(s.status==='reviewed')assert.match(s.reviewedAt,/^\d{4}-\d{2}-\d{2}$/);}
for(const c of checklists){assert(stages.has(c.stage));assert(c.title&&c.evidence);refs(c.guideIds,guideIds,c.id);}
for(const f of flows){refs(f.guideIds,guideIds,f.id);strings(f.questions,f.id);assert(f.causes.length>=2);for(const c of f.causes)for(const k of ['title','evidence','mitigation','durableFix'])assert(c[k]?.trim());}
for(const c of comparisons){refs(c.sourceIds,sourceIds,c.id);for(const k of ['name','layer','summary','languages','deployment','license','maturity'])assert(c[k]?.trim());assert(['reviewed','unverified'].includes(c.evidenceStatus));}
for(const t of glossary){refs(t.guideIds,guideIds,t.id);assert(t.term&&t.definition);}
const plan = fs.readFileSync(new URL('../plan.md',import.meta.url),'utf8');
let requirementCount=0;
for(const match of plan.matchAll(/### (C\d+) — [^\n]+\n([\s\S]*?)(?=\n### C|\n## 7\.)/g)){
  const topics=match[2].split('\n').filter(l=>l.startsWith('- ')).map(l=>l.slice(2));
  topics.forEach((text,i)=>{const id=`${match[1]}.${String(i+1).padStart(2,'0')}`;const entry=coverage.find(c=>c.id===id);assert(entry,`Missing coverage ${id}`);assert.equal(entry.requirement,text);refs(entry.guideIds,guideIds,id);assert(entry.guideIds.some(gid=>guides.find(g=>g.id===gid).sections.some(s=>s.title===text.replace(/\.$/,''))),`Missing authored section ${id}`);requirementCount++;});
}
assert.equal(coverage.filter(c=>c.categoryId).length,requirementCount);
console.log(`Content valid: ${categories.length} categories, ${guides.length} guides, ${requirementCount} mapped topics, ${checklists.length} checks, ${flows.length} troubleshooting paths, ${comparisons.length} technology options, ${sources.length} sources.`);
