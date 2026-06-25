#!/usr/bin/env node
/**
 * เครื่องมือช่วยตรวจแหล่งข้อมูลกฎหมาย (Step 16) — สำหรับผู้ดูแลเนื้อหา
 *
 * อ่านอย่างเดียวจาก data/laws.json แล้ว "สร้าง" เอกสารช่วยตรวจสอบ:
 *   - docs/SOURCE_VERIFICATION_AUDIT.md         (ตารางตรวจแหล่งข้อมูลทุกหน้า)
 *   - docs/PRIORITY_LAW_SOURCE_CHECKLIST.md     (เช็กลิสต์เรียงตามลำดับความสำคัญ)
 *
 * สคริปต์นี้ไม่แก้ไข data/laws.json และไม่สร้าง/ลบหน้าเว็บใด ๆ
 * ไม่เดา source_url / official_source — รายงานตามที่มีอยู่จริงในข้อมูลเท่านั้น
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { getPriority } = require('./law-priority');

const ROOT = path.resolve(__dirname, '..');
const LAWS_JSON = path.join(ROOT, 'data', 'laws.json');
const GOTMPL_PATH = path.join(ROOT, 'content', 'laws', '_content.gotmpl');
const AUDIT_OUT = path.join(ROOT, 'docs', 'SOURCE_VERIFICATION_AUDIT.md');
const CHECKLIST_OUT = path.join(ROOT, 'docs', 'PRIORITY_LAW_SOURCE_CHECKLIST.md');

const OFFICIAL_PLACEHOLDER = 'ต้องตรวจสอบจากแหล่งทางการ';

const VAGUE_STATUS = new Set([
  '', '?', 'tbd', 'todo', 'ไม่ทราบ', 'ยังไม่ชัดเจน', 'ยังไม่ระบุ',
  'ประกาศใช้', 'มีผลบังคับใช้',
]);

const STATUS_LABEL = {
  verified_official_source: 'ตรวจสอบแหล่งข้อมูลทางการแล้ว (ฟิลด์ครบเชิงโครงสร้าง)',
  needs_source_url: 'อยู่ระหว่างตรวจสอบแหล่งข้อมูล (ต้องการลิงก์ทางการเฉพาะฉบับ)',
  needs_official_source_review: 'อยู่ระหว่างตรวจสอบแหล่งข้อมูล (ต้องทบทวน official_source)',
  needs_status_review: 'อยู่ระหว่างตรวจสอบแหล่งข้อมูล (ต้องทบทวนสถานะ)',
  needs_last_checked: 'อยู่ระหว่างตรวจสอบแหล่งข้อมูล (ต้องระบุวันที่ตรวจล่าสุด)',
  pending_manual_review: 'รอการตรวจสอบด้วยมือ',
};

function extractGotmplReviewDate() {
  try {
    const src = fs.readFileSync(GOTMPL_PATH, 'utf8');
    const m = src.match(/\$structuralReviewDate\s*:=\s*"([^"]+)"/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

const STRUCTURAL_REVIEW_DATE = extractGotmplReviewDate() || '2026-06-24';

function isGenericGazetteUrl(url) {
  return /^https?:\/\/ratchakitcha\.soc\.go\.th\/?$/.test((url || '').trim());
}

/** หา link "ราชกิจจานุเบกษา" และบอกว่าเป็นหน้าหลัก (generic) หรือ deep link */
function gazetteLink(law) {
  for (const link of law.links || []) {
    if (link.label === 'ราชกิจจานุเบกษา' && link.url) {
      return { url: link.url.trim(), generic: isGenericGazetteUrl(link.url) };
    }
  }
  return null;
}

function deriveOfficialSource(law) {
  const official = (law.official_source || '').trim();
  if (official) return { value: official, explicit: true };
  for (const link of law.links || []) {
    if (link.label === 'ราชกิจจานุเบกษา' || link.label === 'สำนักงานคณะกรรมการกฤษฎีกา') {
      return { value: link.label, explicit: false };
    }
  }
  if ((law.citation || '').includes('ราชกิจจานุเบกษา')) {
    return { value: 'ราชกิจจานุเบกษา', explicit: false };
  }
  return { value: OFFICIAL_PLACEHOLDER, explicit: false };
}

function isVagueStatus(status) {
  return VAGUE_STATUS.has((status || '').trim().toLowerCase());
}

/** วิเคราะห์แหล่งข้อมูลของกฎหมายหนึ่งฉบับ — ไม่เดา ใช้ข้อมูลที่มีจริงเท่านั้น */
function analyze(law) {
  const explicitSourceUrl = (law.source_url || '').trim();
  const gazette = gazetteLink(law);
  const official = deriveOfficialSource(law);
  const explicitLastChecked = (law.last_checked || '').trim();
  const status = (law.status || '').trim();

  // ประเภทของ source_url ที่ตรวจพบ
  let sourceType; // 'explicit' | 'generic-gazette' | 'deep-gazette' | 'none'
  let sourceUrl = '';
  if (explicitSourceUrl) {
    sourceType = 'explicit';
    sourceUrl = explicitSourceUrl;
  } else if (gazette) {
    sourceType = gazette.generic ? 'generic-gazette' : 'deep-gazette';
    sourceUrl = gazette.url;
  } else {
    sourceType = 'none';
  }

  const officialIsPlaceholder = official.value === OFFICIAL_PLACEHOLDER;
  const statusClear = status && !isVagueStatus(status);
  const hasVerifiedSourceUrl = sourceType === 'explicit' || sourceType === 'deep-gazette';

  // จัดสถานะการตรวจสอบ (เรียงตามช่องว่างที่สำคัญที่สุดก่อน)
  let verification;
  if (
    sourceType === 'explicit' &&
    !officialIsPlaceholder &&
    explicitLastChecked &&
    statusClear
  ) {
    verification = 'verified_official_source';
  } else if (!hasVerifiedSourceUrl) {
    // ไม่มี source_url เฉพาะฉบับ (ไม่มีเลย หรือมีเฉพาะลิงก์หน้าหลักราชกิจจานุเบกษา)
    verification = 'needs_source_url';
  } else if (officialIsPlaceholder) {
    verification = 'needs_official_source_review';
  } else if (!statusClear) {
    verification = 'needs_status_review';
  } else if (!explicitLastChecked) {
    verification = 'needs_last_checked';
  } else {
    verification = 'pending_manual_review';
  }

  return {
    id: law.id,
    title: (law.title || '').trim(),
    lawType: (law.law_type || law.type || '—').trim(),
    year: (law.year || '—').trim(),
    agency: (law.agency || '—').trim(),
    sourceType,
    sourceUrl,
    official: official.value,
    officialExplicit: official.explicit,
    officialIsPlaceholder,
    explicitLastChecked,
    status: status || '—',
    statusClear,
    verification,
    priority: getPriority(law.id),
  };
}

function esc(text) {
  return String(text).replace(/\|/g, '\\|');
}

function sourceCell(a) {
  if (a.sourceType === 'explicit') return `\`${a.sourceUrl}\``;
  if (a.sourceType === 'deep-gazette') return `\`${a.sourceUrl}\` (รก.)`;
  if (a.sourceType === 'generic-gazette') return 'ลิงก์หน้าหลัก ราชกิจจานุเบกษา (ยังไม่ใช่ลิงก์เฉพาะฉบับ)';
  return '— (ไม่มี)';
}

function lastCheckedCell(a) {
  if (a.explicitLastChecked) return a.explicitLastChecked;
  return `— (ใช้ค่าโครงสร้าง ${STRUCTURAL_REVIEW_DATE})`;
}

function buildAudit(rows, counts) {
  const today = new Date().toISOString().slice(0, 10);
  const lines = [];
  lines.push('# รายงานตรวจสอบแหล่งข้อมูลกฎหมาย (Source Verification Audit)');
  lines.push('');
  lines.push('> เอกสารนี้ **สร้างอัตโนมัติ** ด้วย `npm run audit:sources` — อย่าแก้ด้วยมือ');
  lines.push('> ใช้เป็นฐานข้อมูลสำหรับการตรวจแหล่งทางการด้วยมือ ไม่ใช่การยืนยันความถูกต้องทางกฎหมาย');
  lines.push('');
  lines.push(`- วันที่สร้างรายงาน: ${today}`);
  lines.push(`- แหล่งข้อมูล: \`data/laws.json\` (หน้ากฎหมายสร้างจากคลังนี้ + \`content/laws/_content.gotmpl\`)`);
  lines.push(`- จำนวนหน้ากฎหมายทั้งหมด: **${rows.length}**`);
  lines.push(`- ค่าวันที่ตรวจเชิงโครงสร้าง (default จาก gotmpl): ${STRUCTURAL_REVIEW_DATE}`);
  lines.push('');
  lines.push('## สรุปสถานะการตรวจสอบ');
  lines.push('');
  lines.push('| verification_status | ความหมาย | จำนวน |');
  lines.push('|---------------------|----------|------:|');
  for (const key of Object.keys(STATUS_LABEL)) {
    lines.push(`| \`${key}\` | ${STATUS_LABEL[key]} | ${counts.status[key] || 0} |`);
  }
  lines.push('');
  lines.push('### สรุปแหล่งข้อมูล');
  lines.push('');
  lines.push(`- มี \`source_url\` ระบุชัดเจนใน data: **${counts.explicitSource}**`);
  lines.push(`- มีเฉพาะลิงก์ราชกิจจานุเบกษาแบบหน้าหลัก (ยังไม่ใช่ลิงก์เฉพาะฉบับ): **${counts.genericGazette}**`);
  lines.push(`- ไม่มีลิงก์แหล่งข้อมูลเลย: **${counts.noSource}**`);
  lines.push(`- \`official_source\` เป็น placeholder: **${counts.placeholderOfficial}**`);
  lines.push(`- ไม่มี \`last_checked\` ระบุชัดใน data: **${counts.missingLastChecked}**`);
  lines.push(`- หน้า P1/P2 ที่ยังต้องตรวจด้วยมือ: **${counts.p12NeedsReview}**`);
  lines.push('');
  lines.push('> หมายเหตุสำคัญ: การมีลิงก์ "ราชกิจจานุเบกษา" แบบหน้าหลัก (`https://ratchakitcha.soc.go.th`)');
  lines.push('> ยัง **ไม่นับ** เป็นแหล่งข้อมูลที่ยืนยันได้ เพราะไม่ได้ชี้ไปยังตัวบทฉบับนั้นโดยตรง');
  lines.push('> ต้องให้ผู้ตรวจหา deep link ของฉบับจริงและบันทึกใน `SOURCE_REVIEW_LOG.md`');
  lines.push('');
  lines.push('## ตารางตรวจสอบรายฉบับ');
  lines.push('');
  lines.push('| ไฟล์/หน้า | ชื่อกฎหมาย | law_type | ปี | หน่วยงาน | source_url | official_source | last_checked | status | verification_status | priority |');
  lines.push('|-----------|-----------|----------|----|----------|-----------|-----------------|--------------|--------|---------------------|:--------:|');
  for (const a of rows) {
    lines.push(
      `| \`data/laws.json#${esc(a.id)}\` | ${esc(a.title)} | ${esc(a.lawType)} | ${esc(a.year)} | ${esc(a.agency)} | ${esc(sourceCell(a))} | ${esc(a.official)} | ${esc(lastCheckedCell(a))} | ${esc(a.status)} | \`${a.verification}\` | ${a.priority} |`
    );
  }
  lines.push('');
  lines.push('## แหล่งข้อมูลที่ระบุชัดเจนใน data (source_url แบบเจาะจง)');
  lines.push('');
  const explicit = rows.filter((a) => a.sourceType === 'explicit');
  if (!explicit.length) {
    lines.push('_ยังไม่มีหน้าที่ระบุ source_url เฉพาะฉบับใน data_');
  } else {
    for (const a of explicit) {
      lines.push(`- \`${a.id}\` — ${a.title}`);
      lines.push(`  - source_url: ${a.sourceUrl}`);
      lines.push(`  - official_source: ${a.official}`);
      lines.push(`  - last_checked: ${a.explicitLastChecked || '—'}`);
    }
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('ดูวิธีตรวจสอบและกรอกข้อมูลที่ `docs/SOURCE_VERIFICATION_WORKSHEET.md`');
  lines.push('และเช็กลิสต์ตามลำดับความสำคัญที่ `docs/PRIORITY_LAW_SOURCE_CHECKLIST.md`');
  lines.push('');
  return lines.join('\n');
}

function actionNeeded(a) {
  switch (a.verification) {
    case 'verified_official_source':
      return 'ยืนยันลิงก์ด้วยมืออีกครั้งและบันทึกใน SOURCE_REVIEW_LOG.md';
    case 'needs_source_url':
      return a.sourceType === 'generic-gazette'
        ? 'หาลิงก์ราชกิจจานุเบกษา/กฤษฎีกาเฉพาะฉบับ แล้วเพิ่ม source_url + last_checked'
        : 'หาแหล่งทางการและเพิ่ม source_url + official_source + last_checked';
    case 'needs_official_source_review':
      return 'ทบทวน official_source ให้เป็นชื่อแหล่งทางการจริง';
    case 'needs_status_review':
      return 'ทบทวนถ้อยคำ status ให้ชัดเจนและไม่กล่าวเกินจริง';
    case 'needs_last_checked':
      return 'ระบุ last_checked เป็นวันที่ตรวจจริง';
    default:
      return 'ตรวจสอบด้วยมือ';
  }
}

function currentSourceStatus(a) {
  if (a.sourceType === 'explicit') return 'มี source_url เฉพาะฉบับ';
  if (a.sourceType === 'deep-gazette') return 'มีลิงก์ราชกิจจานุเบกษาเฉพาะฉบับ';
  if (a.sourceType === 'generic-gazette') return 'มีเฉพาะลิงก์หน้าหลักราชกิจจานุเบกษา';
  return 'ไม่มีลิงก์แหล่งข้อมูล';
}

function buildChecklist(rows) {
  const today = new Date().toISOString().slice(0, 10);
  const lines = [];
  lines.push('# เช็กลิสต์ตรวจแหล่งข้อมูลตามลำดับความสำคัญ (Priority Source Checklist)');
  lines.push('');
  lines.push('> เอกสารนี้ **สร้างอัตโนมัติ** ด้วย `npm run audit:sources`');
  lines.push('> ผู้ตรวจสามารถติ๊ก checkbox และเพิ่มบันทึกได้ แต่หากรันสคริปต์ใหม่ไฟล์จะถูกสร้างทับ');
  lines.push('> แนะนำให้บันทึกผลการตรวจถาวรไว้ใน `SOURCE_REVIEW_LOG.md`');
  lines.push('');
  lines.push(`- วันที่สร้าง: ${today}`);
  lines.push(`- รวมหน้ากฎหมาย: ${rows.length} (P1, P2, P3 ตาม \`scripts/law-priority.js\`)`);
  lines.push('');
  lines.push('รูปแบบ: `[ ]` ไฟล์/หน้า — ชื่อกฎหมาย · สถานะแหล่งข้อมูลปัจจุบัน · สิ่งที่ต้องทำ · หมายเหตุผู้ตรวจ');
  lines.push('');

  for (const level of ['P1', 'P2', 'P3']) {
    const group = rows.filter((a) => a.priority === level);
    const heading = {
      P1: 'P1 — กฎหมายแม่บทและหน้าที่ใช้บ่อยที่สุด',
      P2: 'P2 — กฎหมายสำคัญสำหรับกลุ่มผู้ใช้หลัก',
      P3: 'P3 — กฎหมายเฉพาะทาง/ใช้งานเฉพาะกลุ่ม',
    }[level];
    lines.push(`## ${heading} (${group.length})`);
    lines.push('');
    for (const a of group) {
      const done = a.verification === 'verified_official_source' ? 'x' : ' ';
      lines.push(`- [${done}] \`data/laws.json#${a.id}\` — ${a.title}`);
      lines.push(`  - สถานะปัจจุบัน: ${currentSourceStatus(a)} · \`${a.verification}\``);
      lines.push(`  - สิ่งที่ต้องทำ: ${actionNeeded(a)}`);
      lines.push('  - หมายเหตุผู้ตรวจ: ');
    }
    lines.push('');
  }
  lines.push('---');
  lines.push('');
  lines.push('ดูรายละเอียดทั้งหมดที่ `docs/SOURCE_VERIFICATION_AUDIT.md`');
  lines.push('');
  return lines.join('\n');
}

function main() {
  const catalog = JSON.parse(fs.readFileSync(LAWS_JSON, 'utf8'));
  const laws = catalog.laws || [];
  const rows = laws.map(analyze);

  const counts = {
    status: {},
    explicitSource: 0,
    genericGazette: 0,
    deepGazette: 0,
    noSource: 0,
    placeholderOfficial: 0,
    missingLastChecked: 0,
    p12NeedsReview: 0,
  };

  for (const a of rows) {
    counts.status[a.verification] = (counts.status[a.verification] || 0) + 1;
    if (a.sourceType === 'explicit') counts.explicitSource += 1;
    else if (a.sourceType === 'generic-gazette') counts.genericGazette += 1;
    else if (a.sourceType === 'deep-gazette') counts.deepGazette += 1;
    else counts.noSource += 1;
    if (a.officialIsPlaceholder) counts.placeholderOfficial += 1;
    if (!a.explicitLastChecked) counts.missingLastChecked += 1;
    if ((a.priority === 'P1' || a.priority === 'P2') && a.verification !== 'verified_official_source') {
      counts.p12NeedsReview += 1;
    }
  }

  fs.writeFileSync(AUDIT_OUT, buildAudit(rows, counts), 'utf8');
  fs.writeFileSync(CHECKLIST_OUT, buildChecklist(rows), 'utf8');

  console.log('Source Verification Audit — generated');
  console.log(`  ${path.relative(ROOT, AUDIT_OUT)}`);
  console.log(`  ${path.relative(ROOT, CHECKLIST_OUT)}`);
  console.log('');
  console.log(`หน้ากฎหมายทั้งหมด: ${rows.length}`);
  for (const key of Object.keys(STATUS_LABEL)) {
    console.log(`  ${key}: ${counts.status[key] || 0}`);
  }
  console.log(`  มี source_url เฉพาะฉบับ: ${counts.explicitSource}`);
  console.log(`  เฉพาะลิงก์หน้าหลักราชกิจจานุเบกษา: ${counts.genericGazette}`);
  console.log(`  ไม่มีลิงก์แหล่งข้อมูล: ${counts.noSource}`);
  console.log(`  P1/P2 ที่ยังต้องตรวจด้วยมือ: ${counts.p12NeedsReview}`);
}

main();
