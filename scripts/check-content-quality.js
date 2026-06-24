#!/usr/bin/env node
/**
 * Content quality checks for website-edulaw.
 * Reports problems only — does not modify legal metadata.
 *
 * Checks:
 *  - Hand-authored Markdown in content/laws/
 *  - Law catalog in data/laws.json (effective metadata mirrors _content.gotmpl)
 *  - Obvious placeholders in law text
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LAWS_MD_DIR = path.join(ROOT, 'content', 'laws');
const LAWS_JSON = path.join(ROOT, 'data', 'laws.json');
const GOTMPL_PATH = path.join(LAWS_MD_DIR, '_content.gotmpl');

const OFFICIAL_PLACEHOLDER = 'ต้องตรวจสอบจากแหล่งทางการ';
const DEFAULT_AUDIENCES = [
  'ครูและบุคลากรทางการศึกษา',
  'นักศึกษา',
  'ผู้สนใจทั่วไป',
];
const STRUCTURAL_REVIEW_DATE = extractGotmplReviewDate() || '2026-06-24';

const VAGUE_STATUS = new Set([
  '',
  '?',
  'tbd',
  'todo',
  'ไม่ทราบ',
  'ยังไม่ชัดเจน',
  'ยังไม่ระบุ',
  'ประกาศใช้',
  'มีผลบังคับใช้',
]);

const PLACEHOLDER_PATTERNS = [
  /\bTODO\b/i,
  /\bFIXME\b/i,
  /\bTBD\b/i,
  /\bPLACEHOLDER\b/i,
  /lorem ipsum/i,
  /\(เพิ่มข้อสรุปจากแหล่งที่มีอยู่\)/,
];

/** @type {{ critical: Array<{source:string, id:string, message:string}>, warning: Array<{source:string, id:string, message:string}> }} */
const report = { critical: [], warning: [] };

function extractGotmplReviewDate() {
  try {
    const src = fs.readFileSync(GOTMPL_PATH, 'utf8');
    const m = src.match(/\$structuralReviewDate\s*:=\s*"([^"]+)"/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

function addIssue(severity, source, id, message) {
  report[severity].push({ source, id, message });
}

function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function parseFrontMatter(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  if (!raw.startsWith('---')) {
    return { error: 'malformed front matter (missing opening ---)', data: null, body: raw };
  }

  const end = raw.indexOf('\n---', 3);
  if (end === -1) {
    return { error: 'malformed front matter (missing closing ---)', data: null, body: raw };
  }

  const fmBlock = raw.slice(4, end);
  const body = raw.slice(end + 4).replace(/^\s*/, '');

  try {
    const data = parseSimpleYaml(fmBlock);
    return { error: null, data, body };
  } catch (err) {
    return { error: `malformed front matter (${err.message})`, data: null, body };
  }
}

/**
 * Minimal YAML parser for Hugo front matter (no nested objects beyond one level).
 */
function parseSimpleYaml(text) {
  const data = {};
  let currentKey = null;
  let list = null;

  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const listMatch = line.match(/^\s*-\s+(.+)$/);
    if (listMatch && currentKey && list) {
      list.push(unquote(listMatch[1].trim()));
      continue;
    }

    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) {
      throw new Error(`unsupported YAML line: ${line}`);
    }

    const key = kv[1];
    const value = kv[2].trim();
    currentKey = key;
    list = null;

    if (value === '') {
      data[key] = [];
      list = data[key];
      continue;
    }

    if (value === '[]') {
      data[key] = [];
      continue;
    }

    if (value === 'true') {
      data[key] = true;
      continue;
    }
    if (value === 'false') {
      data[key] = false;
      continue;
    }

    data[key] = coerceScalar(unquote(value));
  }

  return data;
}

function unquote(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function coerceScalar(value) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return value;
}

function deriveShortTitle(law) {
  let shortTitle = law.short_title || '';
  if (shortTitle) return shortTitle;

  shortTitle = law.title || '';
  if (shortTitle.includes(' (')) {
    shortTitle = shortTitle.split(' (')[0];
  }
  if (shortTitle.includes(' และที่แก้ไข')) {
    shortTitle = shortTitle.split(' และที่แก้ไข')[0];
  }
  return shortTitle.trim();
}

function deriveSourceUrl(law) {
  let sourceURL = law.source_url || '';
  if (sourceURL) return sourceURL.trim();

  for (const link of law.links || []) {
    if (link.label === 'ราชกิจจานุเบกษา' && link.url) {
      return link.url.trim();
    }
  }
  return '';
}

function deriveOfficialSource(law) {
  let officialSource = (law.official_source || '').trim();
  if (officialSource) return officialSource;

  for (const link of law.links || []) {
    if (
      link.label === 'ราชกิจจานุเบกษา' ||
      link.label === 'สำนักงานคณะกรรมการกฤษฎีกา'
    ) {
      return link.label;
    }
  }

  const citation = law.citation || '';
  if (citation.includes('ราชกิจจานุเบกษา')) {
    return 'ราชกิจจานุเบกษา';
  }

  return OFFICIAL_PLACEHOLDER;
}

function effectiveLawRecord(law) {
  return {
    title: (law.title || '').trim(),
    short_title: deriveShortTitle(law),
    law_type: (law.law_type || law.type || '').trim(),
    year: (law.year || '').trim(),
    category: (law.category || '').trim(),
    agency: (law.agency || '').trim(),
    status: (law.status || '').trim(),
    source_url: deriveSourceUrl(law),
    official_source: deriveOfficialSource(law),
    last_checked: (law.last_checked || STRUCTURAL_REVIEW_DATE).trim(),
    audiences: law.audiences && law.audiences.length ? law.audiences : [...DEFAULT_AUDIENCES],
    tags: law.tags || [],
    draft: law.draft === true,
  };
}

function isVagueStatus(status) {
  const normalized = (status || '').trim().toLowerCase();
  return VAGUE_STATUS.has(normalized);
}

function scanPlaceholders(source, id, texts) {
  for (const text of texts) {
    if (!text) continue;
    for (const pattern of PLACEHOLDER_PATTERNS) {
      if (pattern.test(text)) {
        addIssue(
          'warning',
          source,
          id,
          `พบข้อความที่อาจเป็น placeholder: ${pattern}`
        );
        return;
      }
    }
  }
}

function validateRecord(source, id, record, opts = {}) {
  const { rawBody = '', checkShortTitleWarning = true } = opts;

  if (!record.title) {
    addIssue('critical', source, id, 'ขาด title');
  }

  if (!record.source_url) {
    addIssue('critical', source, id, 'ขาด source_url (ว่างหลัง derive จาก links)');
  }

  if (!record.official_source) {
    addIssue('critical', source, id, 'ขาด official_source');
  } else if (record.official_source === OFFICIAL_PLACEHOLDER) {
    addIssue('warning', source, id, `official_source ยังเป็น placeholder (“${OFFICIAL_PLACEHOLDER}”)`);
  }

  if (!record.last_checked) {
    addIssue('critical', source, id, 'ขาด last_checked');
  }

  if (record.draft === true) {
    addIssue('critical', source, id, 'draft: true — ไม่ควรเผยแพร่ใน production');
  }

  if (checkShortTitleWarning && !record.short_title) {
    addIssue('warning', source, id, 'short_title ว่าง');
  }

  if (isEmpty(record.audiences)) {
    addIssue('warning', source, id, 'audiences ว่างหรือไม่มี');
  }

  if (isEmpty(record.tags)) {
    addIssue('warning', source, id, 'tags ว่างหรือไม่มี');
  }

  if (!record.status || isVagueStatus(record.status)) {
    addIssue('warning', source, id, `status ไม่ชัดเจน (“${record.status || ''}”)`);
  }

  const missingRecommended = ['law_type', 'year', 'category', 'agency'].filter((f) =>
    isEmpty(record[f])
  );
  if (missingRecommended.length) {
    addIssue(
      'warning',
      source,
      id,
      `ฟิลด์แนะนำว่าง: ${missingRecommended.join(', ')}`
    );
  }

  scanPlaceholders(source, id, [
    rawBody,
    record.title,
    record.short_title,
    record.status,
    record.official_source,
  ]);
}

function checkMarkdownLawFiles() {
  if (!fs.existsSync(LAWS_MD_DIR)) return;

  const files = fs
    .readdirSync(LAWS_MD_DIR)
    .filter((name) => name.endsWith('.md') && !name.startsWith('_'))
    .sort();

  if (!files.length) {
    console.log('ℹ️  ไม่พบไฟล์ content/laws/*.md (หน้ากฎหมายสร้างจาก data/laws.json + _content.gotmpl)');
    return;
  }

  for (const file of files) {
    const filePath = path.join(LAWS_MD_DIR, file);
    const rel = path.relative(ROOT, filePath);
    const parsed = parseFrontMatter(filePath);

    if (parsed.error) {
      addIssue('critical', rel, file, parsed.error);
      continue;
    }

    const record = {
      title: parsed.data.title,
      short_title: parsed.data.short_title,
      law_type: parsed.data.law_type || parsed.data.type,
      year: parsed.data.year,
      category: parsed.data.category,
      agency: parsed.data.agency,
      status: parsed.data.status,
      source_url: parsed.data.source_url,
      official_source: parsed.data.official_source,
      last_checked: parsed.data.last_checked,
      audiences: parsed.data.audiences,
      tags: parsed.data.tags,
      draft: parsed.data.draft === true,
    };

    validateRecord(rel, file, record, { rawBody: parsed.body });
  }
}

function checkLawsJson() {
  if (!fs.existsSync(LAWS_JSON)) {
    addIssue('critical', 'data/laws.json', 'catalog', 'ไม่พบไฟล์ data/laws.json');
    return;
  }

  let catalog;
  try {
    catalog = JSON.parse(fs.readFileSync(LAWS_JSON, 'utf8'));
  } catch (err) {
    addIssue('critical', 'data/laws.json', 'catalog', `JSON ไม่ถูกต้อง: ${err.message}`);
    return;
  }

  if (!Array.isArray(catalog.laws) || !catalog.laws.length) {
    addIssue('critical', 'data/laws.json', 'catalog', 'ไม่มีรายการ laws');
    return;
  }

  for (const law of catalog.laws) {
    const id = law.id || '(ไม่มี id)';
    const record = effectiveLawRecord(law);
    const texts = [law.summary, ...(law.points || [])];
    validateRecord('data/laws.json', id, record, {
      rawBody: texts.join('\n'),
      checkShortTitleWarning: Boolean(law.short_title === '' || law.short_title === undefined),
    });

    if (!law.last_checked) {
      addIssue(
        'warning',
        'data/laws.json',
        id,
        `ไม่มี last_checked ในแหล่งข้อมูล — ใช้ค่า default จาก _content.gotmpl (${STRUCTURAL_REVIEW_DATE})`
      );
    }
  }
}

function printSection(title, issues) {
  console.log(`\n${title} (${issues.length})`);
  console.log('-'.repeat(title.length + 4));
  if (!issues.length) {
    console.log('  (ไม่มี)');
    return;
  }
  for (const item of issues) {
    console.log(`  • [${item.source}] ${item.id}: ${item.message}`);
  }
}

function main() {
  console.log('Education Law Hub — Content Quality Check');
  console.log(`Root: ${ROOT}`);
  console.log(`Structural review date (from _content.gotmpl): ${STRUCTURAL_REVIEW_DATE}`);

  checkMarkdownLawFiles();
  checkLawsJson();

  printSection('CRITICAL', report.critical);
  printSection('WARNING', report.warning);

  const summary = `\nสรุป: ${report.critical.length} critical, ${report.warning.length} warning`;
  console.log(summary);

  if (report.critical.length) {
    console.log('\n❌ ล้มเหลว — แก้ critical issues ก่อน deploy');
    process.exit(1);
  }

  console.log('\n✅ ผ่าน — ไม่มี critical issues (ยังอาจมี warnings ที่ต้องตรวจด้วยตนเอง)');
  process.exit(0);
}

main();
