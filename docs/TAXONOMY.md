# Taxonomy และการสำรวจกฎหมาย

เว็บไซต์ใช้ Hugo taxonomies เพื่อให้ผู้ใช้เรียกดูกฎหมายตามมิติข้อมูลต่าง ๆ โดยไม่เปลี่ยนเนื้อหากฎหมายเดิม

## Taxonomies ที่ใช้

| Taxonomy (URL) | ป้ายภาษาไทย | ฟิลด์ front matter | ตัวอย่าง |
|----------------|-------------|-------------------|----------|
| `/tags/` | คำสำคัญ | `tags` (array) | `เรียนฟรี 12 ปี` |
| `/categories/` | หมวดหมู่กฎหมาย | `categories` (array) หรือ `category` (เดี่ยว) | `national` |
| `/agencies/` | หน่วยงานที่เกี่ยวข้อง | `agency` → taxonomy `agencies` | `กระทรวงศึกษาธิการ` |
| `/lawtypes/` | ประเภทกฎหมาย | `law_type` หรือ `type` → taxonomy `lawtypes` | `พระราชบัญญัติ` |
| `/audiences/` | กลุ่มผู้ใช้ | `audiences` (array) | `ครูและบุคลากรทางการศึกษา` |

การตั้งค่าอยู่ใน `hugo.toml` ภายใต้ `[taxonomies]`

## แหล่งข้อมูลกฎหมาย

หน้ากฎหมายส่วนใหญ่ถูกสร้างจาก `data/laws.json` ผ่าน `content/laws/_content.gotmpl` ไม่ใช่ไฟล์ `.md` แยกแต่ละฉบับ

เมื่อเพิ่มหรือแก้กฎหมายใน `data/laws.json` ให้ใส่ฟิลด์:

```json
{
  "id": "example-law",
  "category": "national",
  "categories": ["national", "constitution"],
  "type": "พระราชบัญญัติ",
  "agency": "สำนักงานเลขาธิการสภาการศึกษา (สกศ.)",
  "tags": ["สิทธิการศึกษา", "เรียนฟรี 12 ปี"],
  "audiences": ["ครูและบุคลากรทางการศึกษา", "ผู้บริหารสถานศึกษา"]
}
```

### ฟิลด์เดิมที่ยังคงอยู่ (ไม่ลบ)

ฟิลด์เดี่ยวใน `params` ยังใช้กับการ์ดข้อมูลกฎหมายและเทมเพลตเดิม:

- `title`, `short_title`, `law_type`, `year`, `category`, `agency`, `status`
- `source_url`, `official_source`, `last_checked`, `audiences`, `tags`
- `categories` (array), `links`, `relatedLaws`, `citation`

Taxonomy ถูกสร้าง **เพิ่ม** จากค่าเหล่านี้ใน `_content.gotmpl` โดยไม่แทนที่ฟิลด์เดิม

### ค่าเริ่มต้น

- `audiences` — ถ้าไม่ระบุใน JSON จะใช้: ครูและบุคลากรทางการศึกษา, นักศึกษา, ผู้สนใจทั่วไป
- `categories` — ถ้าไม่ระบุ จะใช้ `[category]` ฉบับเดียว

## การเพิ่มกฎหมายใหม่

1. เพิ่มรายการใน `data/laws.json`
2. ใส่ `category` (บังคับ) และ `categories` ถ้ามีหลายหมวด
3. ใส่ `type` (ประเภทกฎหมาย), `agency`, `tags` ตามที่มีจริง
4. ใส่ `audiences` ถ้าต้องการกลุ่มผู้ใช้เฉพาะ (มิฉะนั้นใช้ค่าเริ่มต้น)
5. รัน `hugo server -D` หรือ `npm run build:search` เพื่อสร้างหน้า taxonomy ใหม่

สำหรับไฟล์ `.md` แยก (กรณีพิเศษ) ดู `archetypes/laws.md`

## หน้าคลังกฎหมาย (`/laws/`)

- ลิงก์สำรวจไปหน้า taxonomy ทั้ง 5 มิติ
- ตัวกรอง client-side: ประเภท, หมวดหมู่, หน่วยงาน, กลุ่มผู้ใช้
- ปุ่ม **ล้างตัวกรอง**
- ไม่กระทบ Pagefind (`/search/`)

## ทดสอบในเครื่อง

```bash
hugo server -D
# หรือ
npm run dev
```

ตรวจ URL:

- http://localhost:1313/website-edulaw/laws/
- http://localhost:1313/website-edulaw/categories/
- http://localhost:1313/website-edulaw/tags/
- http://localhost:1313/website-edulaw/agencies/
- http://localhost:1313/website-edulaw/lawtypes/
- http://localhost:1313/website-edulaw/audiences/
- หน้ารายละเอียดกฎหมายหนึ่งฉบับ — ลิงก์ในการ์ดข้อมูล
- http://localhost:1313/website-edulaw/search/

Build production + Pagefind:

```bash
npm run build:search
```

## หมายเหตุ

- หมวดหมู่ taxonomy ใช้ **key** (เช่น `national`) ใน URL; หน้าเว็บแสดง **ชื่อไทย** จาก `data/laws.json` → `categories[].label`
- URL ของคำ/ชื่อภาษาไทย (tags, agencies) จะถูก slugify โดย Hugo
- การกรองบน `/laws/` อ่านจาก `data/laws.json` โดยตรง — ถ้าเพิ่ม `audiences` ใน JSON ควร sync กับ taxonomy
