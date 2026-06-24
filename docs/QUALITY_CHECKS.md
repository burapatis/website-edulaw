# Quality Checks

ระบบตรวจสอบคุณภาพเนื้อหาแบบเบา (lightweight) สำหรับ **website-edulaw** — ช่วยจับปัญหาที่พบบ่อยก่อน deploy โดย **ไม่แก้ไขหรือเดาข้อมูลกฎหมายให้อัตโนมัติ**

## สิ่งที่ตรวจ

### 1. ไฟล์ Markdown ใน `content/laws/`

สำหรับฉบับที่สร้างด้วยมือ (ไม่รวม `_index.md` และไฟล์ที่ขึ้นต้นด้วย `_`)

ตรวจ front matter ตามมาตรฐาน Step 1:

- `title`, `short_title`, `law_type`, `year`, `category`, `agency`, `status`
- `source_url`, `official_source`, `last_checked`
- `audiences`, `tags`, `draft`

### 2. คลังกฎหมาย `data/laws.json`

หน้ากฎหมายส่วนใหญ่ถูกสร้างจากไฟล์นี้ผ่าน `content/laws/_content.gotmpl` สคริปต์จึงตรวจ **metadata ที่มีผลจริงหลัง derive** ด้วย logic เดียวกับเทมเพลต เช่น

- `source_url` จากฟิลด์ตรง หรือลิงก์ “ราชกิจจานุเบกษา”
- `official_source` จากฟิลด์ตรง ลิงก์ หรือ `citation`
- `last_checked` จากข้อมูลต้นทาง หรือวันที่ `$structuralReviewDate` ใน `_content.gotmpl`
- `audiences` default 3 กลุ่ม หากไม่ระบุ

### 3. Placeholder ที่ชัดเจน

เช่น `TODO`, `FIXME`, `TBD`, `lorem ipsum`, ข้อความ archetype ที่ยังไม่กรอก

---

## ระดับความรุนแรง

### Critical (ทำให้ `npm run check:content` ล้มเหลว)

| ปัญหา | หมายเหตุ |
|--------|----------|
| ขาด `title` | |
| ขาด `source_url` (ว่างหลัง derive) | ต้องใส่ URL แหล่งทางการจริง |
| ขาด `official_source` (ว่างจริง ไม่ใช่ placeholder) | |
| ขาด `last_checked` | ใน `.md` ต้องมี; ใน JSON ใช้ค่า default จาก gotmpl |
| `draft: true` | ไม่ควรอยู่ในเนื้อหา production |
| front matter พัง | parse ไม่ได้ |

### Warning (แสดงรายงาน แต่ไม่ทำให้ล้มเหลว)

| ปัญหา | หมายเหตุ |
|--------|----------|
| `official_source` = “ต้องตรวจสอบจากแหล่งทางการ” | ยังไม่ยืนยันแหล่งทางการ |
| ขาด `audiences` / `tags` | |
| `status` คลุมเครือ | เช่น ว่าง, “ไม่ทราบ”, “ประกาศใช้” |
| `short_title` ว่าง | |
| ฟิลด์แนะนำว่าง | `law_type`, `year`, `category`, `agency` |
| ไม่มี `last_checked` ใน JSON | ใช้ค่า default จาก gotmpl |
| ข้อความ placeholder ในเนื้อหา | |
| `description` ว่างใน JSON | เฉพาะโหมด `--full` — gotmpl สร้างอัตโนมัติบนหน้าเว็บ |
| `last_checked` เก่ากว่า 180 วัน | เฉพาะเมื่อมี `last_checked` ใน JSON หรือใช้ `--full` |
| `categories` / `agencies` ไม่สอดคล้อง | เฉพาะโหมด `--full` |

### โหมด `--full`

```bash
npm run check:content:full
```

เพิ่ม warnings สำหรับ:

- `last_checked` เก่ากว่า 180 วัน (รวมค่า default จาก gotmpl)
- `category` มีแต่ `categories[]` ว่าง
- `agency` มีแต่ `agencies[]` ว่าง

**ไม่ทำให้ล้มเหลว** — ใช้ก่อนรอบทบทวนเนื้อหา

---

## รันในเครื่อง

```bash
npm install
npm run check:content
npm run check:content:full   # รายงานเพิ่มเติม
```

Build ทั้ง Hugo + Pagefind:

```bash
npm run build:search
```

หรือ Hugo อย่างเดียว:

```bash
npm run build
# หรือ
hugo --minify
```

---

## GitHub Actions

| Workflow | ไฟล์ | เมื่อไหร่รัน |
|----------|------|-------------|
| **Quality Check** | `.github/workflows/quality-check.yml` | `pull_request`, `workflow_dispatch` |
| **Link Check** | `.github/workflows/link-check.yml` | `pull_request`, `workflow_dispatch`, ทุกสัปดาห์ (จันทร์) |
| **Deploy** | `.github/workflows/hugo.yml` | `push` ไป `main` (ไม่เปลี่ยน) |

### Quality Check ทำอะไร

1. `npm ci`
2. `npm run check:content`
3. `npm run build:search` (Hugo + Pagefind)
4. สรุปผลใน GitHub Actions summary

### Link Check ทำอะไร

ใช้ [lychee-action](https://github.com/lycheeorg/lychee-action) ตรวจลิงก์ใน:

- `README.md`
- `docs/**/*.md`
- `content/**/*.md`

การตั้งค่า: retry 3 ครั้ง, timeout 25s, ยอมรับ HTTP 100–399

---

## วิธีแก้ปัญหาที่พบบ่อย

### ขาด `source_url`

เพิ่มใน `data/laws.json` สำหรับฉบับนั้น:

```json
"source_url": "https://..."
```

หรือเพิ่มลิงก์ที่มี `"label": "ราชกิจจานุเบกษา"` ใน `links` (สคริปต์ derive ให้)

**อย่าเดา URL** ถ้ายังไม่ยืนยันจากแหล่งทางการ

### `official_source` ยังเป็น placeholder

ตรวจสอบจาก ราชกิจจานุเบกษา / กฤษฎีกา / หน่วยงานเจ้าของเรื่อง แล้วใส่ชื่อแหล่งที่ถูกต้องใน `official_source`

### ขาด `tags` / `audiences`

เพิ่มใน JSON หรือ front matter — ช่วย taxonomy และการค้นหา ไม่เปลี่ยนความหมายกฎหมาย

### ลิงก์เสียใน Markdown

แก้ URL ในไฟล์ที่รายงาน หรือลบลิงก์ที่ไม่ใช้แล้ว

---

## ทำไมไม่ auto-fix metadata

กฎหมายต้องอ้างอิงแหล่งทางการที่ตรวจสอบได้ สคริปต์นี้ **รายงานอย่างเดียว** ไม่สร้าง URL ปลอม ไม่เดาสถานะกฎหมาย และไม่แก้ข้อความสรุปโดยอัตโนมัติ

งานที่ยังต้องทำด้วยมือ: ดู [LEGAL_REVIEW_CHECKLIST.md](../LEGAL_REVIEW_CHECKLIST.md)

---

## ไฟล์ที่เกี่ยวข้อง

- `scripts/check-content-quality.js` — สคริปต์หลัก
- `package.json` → `"check:content"`
- `.github/workflows/quality-check.yml`
- `.github/workflows/link-check.yml`
