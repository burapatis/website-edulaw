# แบบทดสอบความรู้ (Learning Quiz)

แบบทดสอบเป็นเครื่องมือเรียนรู้แบบ static — ไม่มี login ไม่มีฐานข้อมูล ไม่เก็บข้อมูลส่วนบุคคล

## ที่เก็บข้อมูลคำถาม

| ไฟล์ | หน้าที่ |
|------|---------|
| `data/quizzes.yaml` | **แหล่งข้อมูลหลัก** — หมวดและคำถามทั้งหมด |
| `layouts/quiz/list.html` | เทมเพลตหน้า `/quiz/` ฝัง JSON จาก Hugo data |
| `static/js/quiz.js` | ตัวกรอง ทำข้อสอบ คะแนน เฉลย ลิงก์อ่านต่อ |
| `static/js/quiz-data.js` | สำรองอ้างอิง (เวอร์ชัน JS เดิม) — หน้าเว็บไม่โหลดแล้ว |

## โครงสร้างข้อมูล

```yaml
categories:
  - key: national
    title: "การจัดการศึกษาแห่งชาติ"
    description: "..."
    default_difficulty: "พื้นฐาน"
    default_audience: "ครูและบุคลากรทางการศึกษา"
    related_law_id: nea-2542
    related_law_title: "พระราชบัญญัติการศึกษาแห่งชาติ พ.ศ. 2542"

questions:
  - id: q001
    category: national          # ตรงกับ categories[].key
    audience: "ครูและบุคลากรทางการศึกษา"
    difficulty: "พื้นฐาน"
    question: "ข้อความคำถาม"
    choices:
      - "ตัวเลือก ก"
      - "ตัวเลือก ข"
      - "ตัวเลือก ค"
      - "ตัวเลือก ง"
    answer: 0                     # ดัชนี 0–3 (ก=0, ข=1, ค=2, ง=3)
    explanation: "คำอธิบายเดิมจากชุดข้อสอบ"
    related_law_id: nea-2542      # id ใน data/laws.json
    related_law_title: "ชื่อกฎหมายสำหรับลิงก์อ่านต่อ"
    related_topics: []
```

## วิธีเพิ่มคำถามใหม่

1. เปิด `data/quizzes.yaml`
2. เพิ่มรายการใน `questions:` ด้วย `id` ที่ไม่ซ้ำ (เช่น `q041`)
3. ตั้ง `category` ให้ตรงกับ `categories[].key` ที่มีอยู่ หรือเพิ่มหมวดใหม่ใน `categories`
4. ตั้ง `answer` เป็นเลขดัชนีของตัวเลือกที่ถูก (เริ่มที่ 0)
5. ใส่ `related_law_id` ตาม `id` ใน `data/laws.json` เพื่อลิงก์ไปหน้ารายละเอียดกฎหมาย
6. รัน `hugo server -D` แล้วทดสอบที่ `/quiz/`

## ดัชนีคำตอบ (`answer`)

- `0` = ตัวเลือกแรก (ก)
- `1` = ตัวเลือกที่สอง (ข)
- `2` = ตัวเลือกที่สาม (ค)
- `3` = ตัวเลือกที่สี่ (ง)

## ลิงก์กฎหมายที่เกี่ยวข้อง

- `related_law_id` ใช้สร้าง URL: `/laws/{id}/` (ผ่าน `data-laws-base` ในเทมเพลต)
- ถ้าไม่ระบุ ระบบจะลิงก์ไปคลังกฎหมายทั่วไป
- อย่าใส่ URL เต็มใน YAML — ใช้ `related_law_id` ให้สอดคล้องกับ Hugo baseURL

## แปลงจากไฟล์ JS เดิม

หากแก้ `static/js/quiz-data.js` ชั่วคราว สามารถรัน:

```bash
node scripts/convert-quiz-to-yaml.mjs
```

เพื่อสร้าง `data/quizzes.yaml` ใหม่ (ระวังทับการแก้ไขใน YAML)

## ทดสอบในเครื่อง

```bash
hugo server -D
# หรือ
npm run dev
```

เปิด http://localhost:1313/website-edulaw/quiz/

ตรวจสอบ:

- เลือกหมวด / กลุ่มผู้ใช้ / ระดับความยาก
- กด **เริ่มทำแบบทดสอบ**
- ตอบแล้วเห็น **ถูกต้อง** / **ยังไม่ถูกต้อง** + คำอธิบาย + **อ่านต่อ**
- ดูคะแนนรวมและทำใหม่อีกครั้ง

Build production:

```bash
npm run build:search
```

## ข้อจำกัด

- คำอธิบายมาจากชุดข้อสอบเดิม — ควรให้ผู้เชี่ยวชาญทบทวนก่อนใช้อ้างอิงอย่างเป็นทางการ
- Pagefind ไม่ index คำถามใน JS/YAML โดยตรง (มีเฉพาะข้อความแนะนำบนหน้า `/quiz/`)
- ไม่บันทึกประวัติการทำข้อสอบของผู้ใช้
