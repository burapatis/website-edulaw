# เส้นทางการเรียนรู้ (Learning Paths)

เอกสารนี้อธิบายโครงสร้าง วิธีเพิ่มเส้นทางใหม่ และแนวทางถ้อยคำที่ปลอดภัยสำหรับ Thai Education Law Hub

## ที่เก็บเนื้อหา

| ตำแหน่ง | คำอธิบาย |
|---------|----------|
| `content/learning-paths/_index.md` | หน้าแรกของส่วนเส้นทางการเรียนรู้ |
| `content/learning-paths/*.md` | หน้าเส้นทางแต่ละกลุ่มผู้ใช้ |
| `layouts/learning-paths/list.html` | เทมเพลตหน้ารวมเส้นทาง |
| `layouts/learning-paths/single.html` | เทมเพลตหน้าเส้นทางเดี่ยว |
| `layouts/partials/learning-path-card.html` | การ์ดลิงก์ไปแต่ละเส้นทาง |
| `static/css/style.css` | สไตล์ `.lp-*` |

เส้นทางปัจจุบัน (6 กลุ่ม):

| ไฟล์ | URL |
|------|-----|
| `teachers.md` | `/learning-paths/teachers/` |
| `school-directors.md` | `/learning-paths/school-directors/` |
| `student-teachers.md` | `/learning-paths/student-teachers/` |
| `parents-public.md` | `/learning-paths/parents-public/` |
| `researchers.md` | `/learning-paths/researchers/` |
| `education-officers.md` | `/learning-paths/education-officers/` |

## วิธีเพิ่มเส้นทางใหม่

1. สร้างไฟล์ Markdown ใหม่ใน `content/learning-paths/` เช่น `my-audience.md`
2. ตั้ง front matter ตามโครงสร้างด้านล่าง
3. เขียนเนื้อหา Markdown เป็นภาษาไทย ใช้ถ้อยคำที่ปลอดภัย
4. ตั้ง `weight` เพื่อจัดลำดับการ์ดบนหน้าแรก (ตัวเลขน้อย = แสดงก่อน)
5. ทดสอบด้วย `hugo server -D` แล้วเปิด `/learning-paths/my-audience/`

ไม่ต้องแก้ `data/` หรือ JavaScript — Hugo จะสร้างหน้าอัตโนมัติจากไฟล์ Markdown

## โครงสร้าง front matter ที่แนะนำ

```yaml
---
title: "ชื่อกลุ่มผู้ใช้"
description: "คำอธิบายสั้น ๆ สำหรับ SEO และการ์ด"
weight: 7
icon: users          # users | building | cap | heart | scale | stamp | book
card_theme: national # ใช้คลาส cat-card--* ที่มีอยู่แล้ว
card_summary: "ข้อความสั้นบนการ์ด"
related_laws:       # id จาก data/laws.json
  - nea-2542
taxonomy_links:
  - label: "กลุ่มผู้ใช้: ..."
    url: "audiences/ชื่อ-slug/"
search_terms:
  - "คำค้น"
quiz_note: "คำแนะนำแบบทดสอบที่เกี่ยวข้อง"
steps:
  - title: "ขั้นที่ 1"
    detail: "รายละเอียดสั้น ๆ"
---
```

## โครงสร้างเนื้อหา Markdown ในแต่ละหน้า

แนะนำให้มีหัวข้อเหล่านี้ (เทมเพลต `single.html` จะแสดง `steps` และ `related_laws` เพิ่มจาก front matter):

- **เหมาะสำหรับใคร**
- **ควรเริ่มจากเรื่องใด**
- **หัวข้อที่ควรรู้เบื้องต้น**
- **แบบทดสอบที่เกี่ยวข้อง**
- **ค้นหากฎหมายเพิ่มเติม**
- **หมายเหตุเรื่องการใช้งานข้อมูล**

## แนวทางถ้อยคำทางกฎหมาย (ปลอดภัย)

**ควรใช้**

- ควรเริ่มศึกษา
- หัวข้อที่ควรรู้เบื้องต้น
- ควรตรวจสอบแหล่งทางการก่อนใช้อ้างอิง
- ไม่ถือเป็นคำแนะนำทางกฎหมายเฉพาะกรณี
- การสรุปเพื่อการเรียนรู้

**หลีกเลี่ยง**

- ครบถ้วนที่สุด
- ใช้แทนคำปรึกษากฎหมายได้
- เป็นฉบับล่าสุดแน่นอน
- ใช้ตัดสินข้อพิพาทได้ทันที

## การลิงก์ไปยังส่วนอื่นของเว็บไซต์

ใช้ path แบบ relative ใน Markdown (Hugo จะแปลง baseURL ให้):

| ปลายทาง | ตัวอย่าง |
|---------|----------|
| คลังกฎหมาย | `[คลังกฎหมาย](/laws/)` |
| กรองหมวด | `/laws/?cat=personnel` |
| ค้นหา | `/search/?q=คำค้น` |
| แบบทดสอบ | `/quiz/` |
| กลุ่มผู้ใช้ | `/audiences/ครูและบุคลากรทางการศึกษา/` |
| นโยบายแหล่งข้อมูล | `/about/source-policy/` |

ใน `taxonomy_links` ของ front matter ใส่ path **ไม่มี** leading slash เช่น `audiences/นักศึกษา/` — เทมเพลตจะผ่าน partial `iu.html` สำหรับ baseURL

`related_laws` ต้องใช้ `id` ที่มีใน `data/laws.json` เท่านั้น มิฉะนั้นลิงก์จะไม่แสดง

## Pagefind (การค้นหา)

- เนื้อหาหลักมี `data-pagefind-body` บน hero และ article
- sidebar มี `data-pagefind-ignore` (ไม่จำเป็นต้องค้นหาเมนูซ้ำ)
- หลัง build ให้รัน `npm run build:search` เพื่ออัปเดตดัชนี

## การทดสอบในเครื่อง

```bash
hugo server -D
# เปิด http://localhost:1313/website-edulaw/learning-paths/ (ตาม baseURL ใน hugo.toml)

hugo --minify
npm run check:content    # ถ้ามี
npm run build:search     # อัปเดต Pagefind
```

URL ที่ควรตรวจ:

- `/learning-paths/`
- `/learning-paths/teachers/` (และเส้นทางอื่น ๆ)
- `/laws/`, `/quiz/`, `/search/`

## ลิงก์ในเว็บไซต์

- **หน้าแรก** — ส่วน "เรียนรู้ได้หลายรูปแบบ" การ์ด "เส้นทางการเรียนรู้"
- **footer** — คอลัมน์ "สำรวจ"
- **header** — ไม่เพิ่ม (เมนูหลักมีรายการครบแล้ว)

## หมายเหตุสำหรับการตรวจสอบด้วยตนเอง

- slug กลุ่มผู้ใช้ใน `/audiences/` อาจไม่ตรงกับชื่อกลุ่มทุกเส้นทาง (เช่น ไม่มี `/audiences/ผู้บริหารสถานศึกษา/` ในขณะนี้)
- ตรวจสอบ `related_laws` หลังเพิ่มกฎหมายใหม่ใน `data/laws.json`
- เอกสารบางฉบับในคลังเป็นการสรุป — ควรอ่าน `LEGAL_REVIEW_CHECKLIST.md` ก่อนเผยแพร่
