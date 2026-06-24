const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LAWS_PATH = path.join(ROOT, 'data', 'laws.json');
const FORUM_PATH = path.join(ROOT, 'data', 'forum.json');

function readJson(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.error('readJson error:', filePath, e.message);
    return fallback;
  }
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function seedForum() {
  const now = Date.now();
  return {
    version: 1,
    updatedAt: new Date().toISOString().slice(0, 10),
    threads: [
      {
        id: 't1',
        topic: 'qa',
        title: 'ครูบรรจุใหม่ ต้องมีใบอนุญาตประกอบวิชาชีพก่อนวันบรรจุหรือไม่?',
        author: 'ครูปฐมวัย_กชกร',
        createdAt: now - 1000 * 60 * 60 * 26,
        body:
          'รบกวนสอบถามครับ ผมสอบบรรจุครูผู้ช่วยได้แล้ว แต่ใบอนุญาตประกอบวิชาชีพครูยังอยู่ระหว่างดำเนินการ จะสามารถรายงานตัวบรรจุได้หรือไม่ หรือต้องรอใบอนุญาตให้ออกก่อน',
        replies: [
          {
            author: 'ศน.ดวงใจ',
            createdAt: now - 1000 * 60 * 60 * 20,
            body:
              'ตามหลักของคุรุสภา ผู้ที่จะได้รับการบรรจุเป็นข้าราชการครูต้องมีใบอนุญาตประกอบวิชาชีพ หรืออย่างน้อยต้องมีหนังสือรับรองสิทธิจากคุรุสภาก่อนวันรายงานตัวค่ะ',
          },
        ],
      },
      {
        id: 't2',
        topic: 'news',
        title: 'อัปเดตความคืบหน้าร่าง พ.ร.บ.การศึกษาแห่งชาติฉบับใหม่',
        author: 'Boorapatis_Ploysuwan',
        createdAt: now - 1000 * 60 * 60 * 72,
        body:
          'ฝากติดตามความคืบหน้าร่างกฎหมายฉบับนี้ร่วมกันครับ ปัจจุบันมีการเสนอร่างหลายฉบับเข้าสู่กระบวนการรับฟังความเห็นตามมาตรา 77 ของรัฐธรรมนูญ',
        replies: [],
      },
      {
        id: 't3',
        topic: 'practice',
        title: 'แนวทางการยื่นขอวิทยฐานะเชี่ยวชาญ (วPA) ทำอย่างไรให้ผ่านรอบแรก',
        author: 'ผอ.รร.บ้านดอนสัก',
        createdAt: now - 1000 * 60 * 60 * 5,
        body: 'อยากแลกเปลี่ยนประสบการณ์การจัดทำข้อตกลงในการพัฒนางาน (PA) และแฟ้มสะสมผลงานสำหรับขอวิทยฐานะเชี่ยวชาญครับ',
        replies: [
          {
            author: 'ครูเชี่ยวชาญ_สมาน',
            createdAt: now - 1000 * 60 * 60 * 2,
            body:
              'เคล็ดลับของผมคือเขียนให้เห็นผลลัพธ์ที่เป็นรูปธรรมและเชื่อมโยงกับมาตรฐานวิทยฐานะตามหลักเกณฑ์ ก.ค.ศ. ชัดเจน',
          },
        ],
      },
      {
        id: 't4',
        topic: 'general',
        title: 'แนะนำตัวและทำความรู้จักกันครับ/ค่ะ',
        author: 'แอดมินเว็บไซต์',
        createdAt: now - 1000 * 60 * 60 * 96,
        body:
          'สวัสดีทุกท่านที่เข้ามาเยี่ยมเยือนคลังความรู้กฎหมายการศึกษาครับ พื้นที่นี้เปิดไว้สำหรับครู บุคลากรทางการศึกษา นักศึกษา และผู้สนใจทุกท่าน',
        replies: [],
      },
    ],
  };
}

function getLawsData() {
  return readJson(LAWS_PATH, { version: 1, categories: [], laws: [] });
}

function saveLawsData(data) {
  const payload = {
    ...data,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
  writeJson(LAWS_PATH, payload);
  return payload;
}

function getForumData() {
  const data = readJson(FORUM_PATH, null);
  if (data && Array.isArray(data.threads)) return data;
  const seeded = seedForum();
  writeJson(FORUM_PATH, seeded);
  return seeded;
}

function saveForumData(data) {
  const payload = {
    ...data,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
  writeJson(FORUM_PATH, payload);
  return payload;
}

module.exports = {
  LAWS_PATH,
  FORUM_PATH,
  getLawsData,
  saveLawsData,
  getForumData,
  saveForumData,
};
