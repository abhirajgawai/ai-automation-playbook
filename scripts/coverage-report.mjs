import fs from 'node:fs';
const base = new URL('../',import.meta.url);
const entries = JSON.parse(fs.readFileSync(new URL('src/content/coverage.json',base)));
const plan = fs.readFileSync(new URL('plan.md',base),'utf8');
const lines=['# Coverage registry','','This report maps every taxonomy bullet to its authored guide. `implemented` means content exists; structural validation checks references, while semantic and browser evidence are recorded separately in verification.md. No readiness score or production certification is inferred.','','## Content requirements','','| ID | Requirement | Guide | Verification | Status |','|---|---|---|---|---|'];
for(const e of entries)lines.push(`| ${e.id} | ${e.requirement.replaceAll('|','/')} | ${e.guideIds.map(g=>`/guides/${g}`).join(', ')} | ${e.verification} | ${e.status} |`);
lines.push('','## Product, engineering and deployment requirements','','Each bullet outside the taxonomy is retained below for a requirement-by-requirement final audit. Section context is kept; implementation evidence is in the named files and final checks are in verification.md. Procedural instructions are evaluated against the work record rather than a browser screen.','','| ID | Section | Requirement | Evidence location |','|---|---|---|---|');
let section='',n=0;
const paths={4:'tests/browser/acceptance.spec.ts; src/features/pages.tsx',5:'src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx',7:'src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md',8:'src/styles.css; src/features/DecisionGraph.tsx; tests/browser/acceptance.spec.ts',9:'src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json',10:'docs/coverage.md; docs/verification.md; README.md; docs/operations.md',11:'tests; scripts/validate-content.mjs; docs/verification.md',12:'Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md',13:'docs/progress.md; docs/verification.md',14:'docs/verification.md; docs/handover.md'};
for(const line of plan.split('\n')){
 if(/^#{2,3} /.test(line))section=line.replace(/^#+ /,'');
 const major=Number(section.match(/^\d+/)?.[0]);
 if(major===6)continue;
 if(line.startsWith('- ')&&paths[major]){n++;lines.push(`| P${String(n).padStart(3,'0')} | ${section.replaceAll('|','/')} | ${line.slice(2).replaceAll('|','/')} | ${paths[major]} |`);}
}
fs.writeFileSync(new URL('docs/coverage.md',base),lines.join('\n')+'\n');
console.log(`Generated ${entries.length} taxonomy mappings and ${n} product/engineering requirement rows.`);
