#!/usr/bin/env node
/**
 * Quiz data validation for website-edulaw.
 *
 * Dependency-free line parser for data/quizzes.yaml (no external YAML lib so
 * `npm ci` / CI stay unchanged). Hugo already fails the build on invalid YAML,
 * so this script focuses on the quiz's logical rules.
 *
 * Checks:
 *   - total questions = EXPECTED_TOTAL (100)
 *   - EXPECTED_CATEGORIES (5) categories defined
 *   - each category has exactly EXPECTED_PER_CATEGORY (20) questions
 *   - id is unique
 *   - every question has exactly 4 choices
 *   - answer is an integer 0–3
 *   - bloom_level is present (and from the known Bloom set)
 *   - explanation is present
 *   - category matches a defined category key
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const QUIZZES_YAML = path.join(ROOT, 'data', 'quizzes.yaml');

const EXPECTED_TOTAL = 100;
const EXPECTED_CATEGORIES = 5;
const EXPECTED_PER_CATEGORY = 20;
const CHOICES_PER_QUESTION = 4;
const BLOOM_LEVELS = ['จำ', 'เข้าใจ', 'นำไปใช้', 'วิเคราะห์', 'ประเมิน', 'สร้างสรรค์'];

function stripInlineValue(raw) {
  let v = (raw || '').trim();
  if (
    (v.startsWith('"') && v.endsWith('"') && v.length >= 2) ||
    (v.startsWith("'") && v.endsWith("'") && v.length >= 2)
  ) {
    v = v.slice(1, -1);
  }
  return v;
}

function parseQuizYaml(text) {
  const lines = text.split(/\r?\n/);
  const categoryKeys = [];
  const questions = [];

  let section = null; // 'categories' | 'questions'
  let current = null;
  let inChoices = false;

  for (const line of lines) {
    if (/^categories:\s*$/.test(line)) {
      section = 'categories';
      continue;
    }
    if (/^questions:\s*$/.test(line)) {
      section = 'questions';
      continue;
    }
    if (section === 'categories') {
      const m = line.match(/^\s{2}-\s+key:\s*(.+)$/);
      if (m) categoryKeys.push(stripInlineValue(m[1]));
      continue;
    }
    if (section !== 'questions') continue;

    const idMatch = line.match(/^\s{2}-\s+id:\s*(.+)$/);
    if (idMatch) {
      if (current) questions.push(current);
      current = {
        id: stripInlineValue(idMatch[1]),
        category: null,
        answer: null,
        bloom_level: null,
        explanation: null,
        choices: [],
      };
      inChoices = false;
      continue;
    }
    if (!current) continue;

    if (/^\s{4}choices:\s*$/.test(line)) {
      inChoices = true;
      continue;
    }
    const choiceItem = line.match(/^\s{6}-\s+(.+)$/);
    if (inChoices && choiceItem) {
      current.choices.push(stripInlineValue(choiceItem[1]));
      continue;
    }

    const field = line.match(/^\s{4}([A-Za-z_]+):\s*(.*)$/);
    if (field) {
      inChoices = false;
      const key = field[1];
      const value = field[2];
      if (key === 'category') current.category = stripInlineValue(value);
      else if (key === 'answer') current.answer = value.trim();
      else if (key === 'bloom_level') current.bloom_level = stripInlineValue(value);
      else if (key === 'explanation') current.explanation = stripInlineValue(value);
    }
  }
  if (current) questions.push(current);

  return { categoryKeys, questions };
}

function main() {
  if (!fs.existsSync(QUIZZES_YAML)) {
    console.error(`❌ ไม่พบไฟล์ข้อมูลแบบทดสอบ: ${QUIZZES_YAML}`);
    process.exit(1);
  }

  const text = fs.readFileSync(QUIZZES_YAML, 'utf8');
  const { categoryKeys, questions } = parseQuizYaml(text);

  const errors = [];
  const warnings = [];

  // total
  if (questions.length !== EXPECTED_TOTAL) {
    errors.push(`จำนวนคำถามรวม = ${questions.length} (คาดหวัง ${EXPECTED_TOTAL})`);
  }

  // categories defined
  if (categoryKeys.length !== EXPECTED_CATEGORIES) {
    errors.push(`จำนวนหมวด = ${categoryKeys.length} (คาดหวัง ${EXPECTED_CATEGORIES})`);
  }

  // per-category counts
  const perCategory = {};
  categoryKeys.forEach((k) => {
    perCategory[k] = 0;
  });
  const seenIds = new Set();

  questions.forEach((q, i) => {
    const ref = q.id || `(ลำดับที่ ${i + 1})`;

    // unique id
    if (!q.id) {
      errors.push(`คำถามลำดับที่ ${i + 1} ไม่มี id`);
    } else if (seenIds.has(q.id)) {
      errors.push(`id ซ้ำ: ${q.id}`);
    } else {
      seenIds.add(q.id);
    }

    // category valid
    if (!q.category) {
      errors.push(`${ref}: ไม่มี category`);
    } else if (!categoryKeys.includes(q.category)) {
      errors.push(`${ref}: category "${q.category}" ไม่ตรงกับหมวดที่กำหนด`);
    } else {
      perCategory[q.category] += 1;
    }

    // choices
    if (q.choices.length !== CHOICES_PER_QUESTION) {
      errors.push(`${ref}: มีตัวเลือก ${q.choices.length} ข้อ (ต้องมี ${CHOICES_PER_QUESTION})`);
    }

    // answer index
    if (q.answer === null || q.answer === '') {
      errors.push(`${ref}: ไม่มี answer`);
    } else if (!/^\d+$/.test(q.answer)) {
      errors.push(`${ref}: answer "${q.answer}" ไม่ใช่ดัชนีจำนวนเต็ม`);
    } else {
      const idx = parseInt(q.answer, 10);
      if (idx < 0 || idx > CHOICES_PER_QUESTION - 1) {
        errors.push(`${ref}: answer = ${idx} อยู่นอกช่วง 0–${CHOICES_PER_QUESTION - 1}`);
      }
    }

    // bloom_level
    if (!q.bloom_level) {
      errors.push(`${ref}: ไม่มี bloom_level`);
    } else if (!BLOOM_LEVELS.includes(q.bloom_level)) {
      warnings.push(`${ref}: bloom_level "${q.bloom_level}" ไม่อยู่ในชุดมาตรฐาน (${BLOOM_LEVELS.join(', ')})`);
    }

    // explanation
    if (!q.explanation) {
      errors.push(`${ref}: ไม่มี explanation`);
    }
  });

  // per-category exact counts
  categoryKeys.forEach((k) => {
    if (perCategory[k] !== EXPECTED_PER_CATEGORY) {
      errors.push(`หมวด "${k}" มี ${perCategory[k]} ข้อ (คาดหวัง ${EXPECTED_PER_CATEGORY})`);
    }
  });

  console.log('Education Law Hub — Quiz Data Check');
  console.log(`ไฟล์: ${path.relative(ROOT, QUIZZES_YAML)}`);
  console.log('');
  console.log(`  คำถามทั้งหมด:   ${questions.length}`);
  console.log(`  จำนวนหมวด:      ${categoryKeys.length}`);
  categoryKeys.forEach((k) => {
    console.log(`    - ${k}: ${perCategory[k]} ข้อ`);
  });
  console.log('');

  if (warnings.length) {
    console.log('⚠️  คำเตือน:');
    warnings.forEach((w) => console.log(`   - ${w}`));
    console.log('');
  }

  if (errors.length) {
    console.error('❌ พบข้อผิดพลาด:');
    errors.forEach((e) => console.error(`   - ${e}`));
    console.error('');
    console.error(`Quiz data check FAILED (${errors.length} ข้อผิดพลาด)`);
    process.exit(1);
  }

  console.log('✅ Quiz data check PASSED');
  process.exit(0);
}

main();
