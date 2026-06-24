#!/usr/bin/env node
/**
 * Release readiness check for website-edulaw.
 * Runs content quality + Hugo/Pagefind build.
 * Does not modify content.
 */

'use strict';

const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const STEPS = [
  { cmd: 'npm run check:content', label: 'Content quality (check:content)' },
  { cmd: 'npm run build:search', label: 'Hugo minify + Pagefind (build:search)' },
];

console.log('Education Law Hub — Release Check');
console.log('Root:', ROOT);
console.log('');

let failed = false;

for (const step of STEPS) {
  console.log(`▶ ${step.label}`);
  console.log(`  $ ${step.cmd}`);
  try {
    execSync(step.cmd, { cwd: ROOT, stdio: 'inherit' });
    console.log(`✅ ${step.label} — passed\n`);
  } catch {
    console.error(`❌ ${step.label} — failed\n`);
    failed = true;
    break;
  }
}

if (failed) {
  console.error('Release check FAILED. See RELEASE_CHECKLIST.md and docs/QA_CHECKLIST.md');
  process.exit(1);
}

console.log('Release check PASSED.');
console.log('Next: manual QA — docs/QA_CHECKLIST.md');
console.log('Docs: RELEASE_CHECKLIST.md, docs/PUBLIC_RELEASE.md');
process.exit(0);
