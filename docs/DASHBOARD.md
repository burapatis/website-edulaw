# ภาพรวมเว็บไซต์ (Dashboard)

เอกสารนี้อธิบายหน้า **ภาพรวมเว็บไซต์** สำหรับผู้ใช้และผู้ดูแล **Education Law Hub**

## หน้า Dashboard อยู่ที่ไหน

- URL: `/dashboard/`
- เนื้อหา: `content/dashboard/_index.md`
- Layout: `layouts/dashboard/list.html`
- การคำนวณ: `layouts/partials/dashboard-stats-compute.html`

## แสดงอะไรบ้าง

| ส่วน | คำอธิบาย |
|------|----------|
| จำนวนเนื้อหา | หน้ากฎหมาย หัวข้อสรุป แบบทดสอบ เส้นทางเรียนรู้ taxonomy |
| ตารางแยกตามประเภท | นับจาก `data/laws.json` |
| ตารางแยกตามหน่วยงาน | นับจากฟิลด์ `agency` |
| ตารางแยกตามกลุ่มผู้ใช้ | นับจาก `audiences` (อาจนับซ้ำต่อฉบับ) |
| ตารางแยกตามหมวดหมู่ | นับจาก `category` / `categories` |
| สถานะการตรวจสอบ | จาก metadata และกฎ derive แหล่งข้อมูล |
| รายการตรวจล่าสุด | เฉพาะรายการที่มี `last_checked` ใน JSON โดยตรง |

## วิธีคำนวณตัวเลข

### หน้ากฎหมาย

`len(site.Data.laws.laws)` — หน้าถูกสร้างโดย `content/laws/_content.gotmpl` ไม่ใช่ไฟล์ `.md` แยกแต่ละฉบับ

### แบบทดสอบ

`len(site.Data.quizzes.questions)` จาก `data/quizzes.yaml`

### เส้นทางการเรียนรู้

นับ `RegularPages` ใน section `learning-paths` ที่ไม่ใช่ `_index.md` (ปัจจุบัน 6 เส้นทาง)

### หัวข้อสรุป

ค่าคงที่ **6** — ตรงกับจำนวนการ์ดใน `layouts/summaries/list.html` (ไม่ใช่หน้า markdown แยก)

### Taxonomy counts

`len site.Taxonomies.categories` (และ agencies, audiences, lawtypes) — จากหน้ากฎหมายที่ Hugo สร้างตอน build

### สถานะการตรวจสอบแหล่งข้อมูล

ใช้ logic เดียวกับ `scripts/check-content-quality.js` โดยย่อ:

1. **derive `source_url`** — จากฟิลด์ `source_url` หรือลิงก์ “ราชกิจจานุเบกษา”
2. **derive `official_source`** — จากฟิลด์ ลิงก์ หรือ citation; ถ้าไม่มีใช้ `ต้องตรวจสอบจากแหล่งทางการ`
3. **มีข้อมูลแหล่งทางการแล้ว** — มี `source_url` และ `official_source` ไม่ใช่ placeholder
4. **ควรตรวจสอบเพิ่มเติม** — ขาดลิงก์หรือยังเป็น placeholder
5. **อยู่ระหว่างตรวจสอบ** — `last_checked` เก่ากว่า 180 วัน หรือรายการ backlog `in_review`

**สำคัญ:** หน้าเว็บที่ build แล้วอาจแสดง `last_checked` จาก `_content.gotmpl` (วันที่โครงสร้าง) แม้ JSON จะไม่มีฟิลด์นี้ — dashboard รายงานความจริงจาก **JSON ต้นทาง** เพื่อช่วยผู้ดูแล

## ข้อจำกัด — สิ่งที่ไม่ควรอ้างต่อสาธารณะ

- ไม่อ้างว่าคลังกฎหมาย **ครบถ้วน**
- ไม่อ้างว่าทุกหน้า **เป็นฉบับล่าสุด**
- ไม่ใช้สถานะ dashboard เป็น **การรับรองความถูกต้องทางกฎหมาย**
- ไม่แสดงข้อมูลส่วนบุคคลหรือข้อมูลภายในที่ละเอียดเกินไป

## การทดสอบหลังเพิ่มกฎหมายใหม่

```bash
npm run check:content
npm run report:stats
hugo --minify
npm run build:search
```

ตรวจ:

- `/dashboard/` — ตัวเลขหน้ากฎหมายและตารางหมวดหมู่
- หน้ากฎหมายใหม่ `/laws/<id>/`
- หน้าแรก — การ์ดภาพรวมใต้ hero stats

## สคริปต์สำหรับผู้ดูแล

```bash
npm run report:stats
```

รัน `scripts/report-site-stats.js` — **รายงานเท่านั้น** ไม่แก้ไฟล์ ไม่ทำให้ CI ล้มเหลว

## ไฟล์ที่เกี่ยวข้อง

- `layouts/partials/dashboard-stat-card.html` — การ์ดตัวเลข
- `layouts/partials/content-status-summary.html` — การ์ดย่อบนหน้าแรก
- `docs/FEEDBACK_WORKFLOW.md` — เมื่อผู้ใช้แจ้งข้อมูลล้าสมัย
- `SOURCE_REVIEW_LOG.md` — บันทึกการตรวจแหล่งด้วยมือ
