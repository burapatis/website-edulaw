'use strict';

/**
 * ลำดับความสำคัญของหน้ากฎหมายสำหรับรอบตรวจแหล่งข้อมูล (Step 16)
 * ใช้ร่วมกันระหว่าง scripts/source-audit.js และ scripts/report-site-stats.js
 * เพื่อให้รายงานทุกที่ใช้เกณฑ์เดียวกัน
 *
 * P1 = กฎหมายแม่บท/หน้าที่ใช้บ่อยที่สุด
 * P2 = กฎหมายสำคัญสำหรับครู ผู้บริหารสถานศึกษา นักเรียน ผู้ปกครอง และเจ้าหน้าที่การศึกษา
 * P3 = กฎหมายเฉพาะทางหรือใช้งานเฉพาะกลุ่ม
 *
 * หมายเหตุ: การจัดลำดับนี้เป็นการประเมินความสำคัญเชิงการใช้งานเท่านั้น
 * ไม่ใช่การยืนยันความถูกต้องทางกฎหมายหรือสถานะฉบับล่าสุด
 */

const LAW_PRIORITY = {
  // ---- P1: กฎหมายแม่บทและหน้าที่ใช้บ่อยที่สุด ----
  'const-2560': 'P1',
  'nea-2542': 'P1',
  'compulsory-2545': 'P1',
  'moe-admin-2546': 'P1',
  'teacher-civil-2547': 'P1',
  'teacher-council-2546': 'P1',
  'higher-ed-2562': 'P1',
  'vocational-2551': 'P1',
  'private-school-2550': 'P1',
  'child-protect-2546': 'P1',

  // ---- P2: กฎหมายสำคัญสำหรับกลุ่มผู้ใช้หลัก ----
  'ecd-2562': 'P2',
  'learning-promote-2566': 'P2',
  'teacher-salary-2547': 'P2',
  'teacher-welfare-2547': 'P2',
  'disability-edu-2551': 'P2',
  'disabled-welfare-2550': 'P2',
  'eef-2561': 'P2',
  'sla-2560': 'P2',
  'pdpa-2562': 'P2',
  'osh-2554': 'P2',
  'punishment-rule-2548': 'P2',
  'youth-protection-2551': 'P2',
  'ohes-2562': 'P2',
  'univ-civil-2547': 'P2',
  'innovation-area-2562': 'P2',
  'nea-draft': 'P2',
  'icescr': 'P2',
  'crc': 'P2',
  'crpd': 'P2',
  'cedaw': 'P2',
  'icerd': 'P2',
  'private-univ-2546': 'P2',
  'vocational-institute-2555': 'P2',
  'hesi-policy-council-2562': 'P2',
  'rajabhat-2547': 'P2',
  'rmut-2548': 'P2',
  'community-college-2558': 'P2',
  'onesqa-2543': 'P2',
  'ipst-2541': 'P2',

  // ---- P3: กฎหมายเฉพาะทาง/ใช้งานเฉพาะกลุ่ม ----
  'school-lunch-fund-2535': 'P3',
  'ops-moe-structure-2567': 'P3',
  'age-counting-2545': 'P3',
  'autonomous-univ': 'P3',
  'excellence-fund-2550': 'P3',
  'budget-procedure-2561': 'P3',
  'procurement-2560': 'P3',
  'labor-protection-2541': 'P3',
  'local-edu-2542': 'P3',
  'student-uniform-2551': 'P3',
  'scout-2551': 'P3',
};

function getPriority(lawId) {
  return LAW_PRIORITY[lawId] || 'P3';
}

module.exports = { LAW_PRIORITY, getPriority };
