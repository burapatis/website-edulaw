#!/usr/bin/env node
/**
 * สร้าง js/laws-bundle.js จาก data/laws.json
 * ใช้เป็น fallback เมื่อ fetch ไม่ได้ (เปิดไฟล์โดยตรง)
 * รัน: node scripts/build-laws-bundle.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const json = JSON.parse(fs.readFileSync(path.join(root, 'data/laws.json'), 'utf8'));

const out = `/* AUTO-GENERATED from data/laws.json — อย่าแก้ด้วยมือ */
/* รัน: node scripts/build-laws-bundle.js */
const LAWS_BUNDLE = ${JSON.stringify(json)};
`;

fs.writeFileSync(path.join(root, 'js/laws-bundle.js'), out);
console.log('Built js/laws-bundle.js —', json.laws.length, 'laws');
