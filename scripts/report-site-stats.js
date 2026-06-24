#!/usr/bin/env node
/**
 * Site stats report for website-edulaw maintainers.
 * Reports only — does not modify content. Does not fail CI by default.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LAWS_JSON = path.join(ROOT, 'data', 'laws.json');
const QUIZZES_YAML = path.join(ROOT, 'data', 'quizzes.yaml');
const BACKLOG_YAML = path.join(ROOT, 'data', 'law_backlog.yaml');
const LEARNING_PATHS_DIR = path.join(ROOT, 'content', 'learning-paths');
const SUMMARY_TOPICS = 6;
const OFFICIAL_PLACEHOLDER = 'ต้องตรวจสอบจากแหล่งทางการ';
const STALE_CHECK_DAYS = 180;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function parseSimpleYaml(text) {
  const data = { items: [] };
  let section = null;
  let currentItem = null;
  let listKey = null;

  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (trimmed === 'items:') {
      section = 'items';
      continue;
    }

    const topKey = trimmed.match(/^([a-z_]+):\s*(.*)$/i);
    if (topKey && !line.startsWith(' ')) {
      section = null;
      data[topKey[1]] = topKey[2].replace(/^"|"$/g, '');
      continue;
    }

    const itemStart = line.match(/^\s{2}-\s+id:\s*(.+)$/);
    if (itemStart) {
      currentItem = { id: itemStart[1].trim().replace(/^"|"$/g, '') };
      data.items.push(currentItem);
      listKey = null;
      continue;
    }

    const itemKv = line.match(/^\s{4}([a-z_]+):\s*(.*)$/i);
    if (itemKv && currentItem) {
      const val = itemKv[2].trim().replace(/^"|"$/g, '');
      if (val === '') {
        listKey = itemKv[1];
        currentItem[listKey] = [];
      } else {
        currentItem[itemKv[1]] = val;
        listKey = null;
      }
      continue;
    }

    const listItem = line.match(/^\s{6}-\s+(.+)$/);
    if (listItem && currentItem && listKey) {
      currentItem[listKey].push(listItem[1].trim().replace(/^"|"$/g, ''));
    }
  }

  return data;
}

function countQuizQuestions(yamlText) {
  const matches = yamlText.match(/^\s{2}-\s+id:\s+/gm);
  return matches ? matches.length : 0;
}

function deriveSourceUrl(law) {
  let sourceURL = (law.source_url || '').trim();
  if (sourceURL) return sourceURL;
  for (const link of law.links || []) {
    if (link.label === 'ราชกิจจานุเบกษา' && link.url) {
      return link.url.trim();
    }
  }
  return '';
}

function deriveOfficialSource(law) {
  let official = (law.official_source || '').trim();
  if (official) return official;
  for (const link of law.links || []) {
    if (link.label === 'ราชกิจจานุเบกษา' || link.label === 'สำนักงานคณะกรรมการกฤษฎีกา') {
      return link.label;
    }
  }
  if ((law.citation || '').includes('ราชกิจจานุเบกษา')) {
    return 'ราชกิจจานุเบกษา';
  }
  return OFFICIAL_PLACEHOLDER;
}

function daysBetween(isoDate, refDate = new Date()) {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return null;
  return Math.floor((refDate - d) / (1000 * 60 * 60 * 24));
}

function countLearningPaths() {
  if (!fs.existsSync(LEARNING_PATHS_DIR)) return 0;
  return fs
    .readdirSync(LEARNING_PATHS_DIR)
    .filter((f) => f.endsWith('.md') && f !== '_index.md').length;
}

function main() {
  const catalog = readJson(LAWS_JSON);
  const laws = catalog.laws || [];
  const quizYaml = fs.readFileSync(QUIZZES_YAML, 'utf8');
  const quizQuestions = countQuizQuestions(quizYaml);
  const learningPaths = countLearningPaths();

  let missingSource = 0;
  let placeholderOfficial = 0;
  let missingLastChecked = 0;
  let staleLastChecked = 0;
  let reviewGood = 0;
  let reviewNeeds = 0;

  const lawtypeCounts = {};
  const agencyCounts = {};

  for (const law of laws) {
    const lt = law.law_type || law.type || 'ไม่ระบุ';
    const ag = law.agency || 'ไม่ระบุ';
    lawtypeCounts[lt] = (lawtypeCounts[lt] || 0) + 1;
    agencyCounts[ag] = (agencyCounts[ag] || 0) + 1;

    const src = deriveSourceUrl(law);
    const official = deriveOfficialSource(law);
    const rawLastChecked = (law.last_checked || '').trim();

    if (!src) missingSource += 1;
    if (official === OFFICIAL_PLACEHOLDER) placeholderOfficial += 1;
    if (!rawLastChecked) missingLastChecked += 1;

    if (rawLastChecked) {
      const days = daysBetween(rawLastChecked);
      if (days !== null && days > STALE_CHECK_DAYS) staleLastChecked += 1;
    }

    if (src && official !== OFFICIAL_PLACEHOLDER) reviewGood += 1;
    else reviewNeeds += 1;
  }

  let backlogPending = 0;
  let backlogInReview = 0;
  if (fs.existsSync(BACKLOG_YAML)) {
    const backlog = parseSimpleYaml(fs.readFileSync(BACKLOG_YAML, 'utf8'));
    for (const item of backlog.items || []) {
      if (item.review_status === 'pending_review') backlogPending += 1;
      if (item.review_status === 'in_review') backlogInReview += 1;
    }
  }

  console.log('Education Law Hub — Site Stats Report');
  console.log('Root:', ROOT);
  console.log('');
  console.log('เนื้อหา');
  console.log('--------');
  console.log(`  หน้ากฎหมาย:              ${laws.length}`);
  console.log(`  หัวข้อสรุป:               ${SUMMARY_TOPICS}`);
  console.log(`  ข้อคำถามแบบทดสอบ:        ${quizQuestions}`);
  console.log(`  เส้นทางการเรียนรู้:       ${learningPaths}`);
  console.log(`  หมวดหมู่ในคลัง:           ${(catalog.categories || []).length}`);
  console.log(`  อัปเดตคลังข้อมูล:         ${catalog.updatedAt || '—'}`);
  console.log('');
  console.log('สถานะการตรวจสอบแหล่งข้อมูล (จาก data/laws.json)');
  console.log('------------------------------------------------');
  console.log(`  มีข้อมูลแหล่งทางการแล้ว:  ${reviewGood}`);
  console.log(`  ควรตรวจสอบเพิ่มเติม:      ${reviewNeeds}`);
  console.log(`  ไม่มี source_url:         ${missingSource}`);
  console.log(`  official_source placeholder: ${placeholderOfficial}`);
  console.log(`  ไม่มี last_checked:       ${missingLastChecked}`);
  console.log(`  last_checked เก่า >${STALE_CHECK_DAYS}d: ${staleLastChecked}`);
  console.log(`  คิว pending_review:       ${backlogPending}`);
  console.log(`  คิว in_review:            ${backlogInReview}`);
  console.log('');
  console.log('กฎหมายแยกตามประเภท (สูงสุด 8 รายการ)');
  Object.entries(lawtypeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .forEach(([k, v]) => console.log(`  ${k}: ${v}`));
  console.log('');
  console.log('หมายเหตุ: รายงานนี้ไม่แก้ไขเนื้อหา — ดู docs/DASHBOARD.md');
}

main();
