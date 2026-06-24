# คู่มือ UX/UI — Thai Education Law Hub

เอกสารนี้อธิบายหลักการออกแบบและแนวทางปรับ UI โดยไม่เปลี่ยนอัตลักษณ์หลักของเว็บไซต์

## หลักการออกแบบ

1. **เรียนรู้ก่อนตัดสินใจ** — เน้นการสรุปเพื่อการศึกษา ไม่สร้างความรู้สึกว่าเป็นแหล่งกฎหมายทางการ
2. **อ่านง่ายบนมือถือ** — ข้อความและปุ่มต้องแตะได้สะดวก (เป้าหมาย ~44–48px)
3. **ลำดับชั้นชัด** — ค้นหาและคลังกฎหมายมาก่อน เนื้อหารองอยู่ใน footer
4. **ความน่าเชื่อถือ** — แสดงนโยบายแหล่งข้อมูลและข้อจำกัดอย่างสม่ำเสมอ
5. **ไม่ทำลายของเดิม** — ปรับ CSS/เลย์เอาต์เล็กน้อย ไม่เปลี่ยนความหมายเนื้อหากฎหมาย

## สี ระยะห่าง และตัวอักษร

ใช้ตัวแปรใน `static/css/style.css`:

| ตัวแปร | ใช้สำหรับ |
|--------|-----------|
| `--paper`, `--paper-alt` | พื้นหลัง |
| `--ink`, `--ink-soft` | ข้อความหลัก/รอง |
| `--navy`, `--navy-2` | หัวข้อ ลิงก์สำคัญ |
| `--gold` | CTA หลัก, โฟกัส |
| `--maroon` | เน้นรอง, ลิงก์อ่านต่อ |
| `--f-display` | หัวข้อ (Noto Serif Thai) |
| `--f-body` | เนื้อหา (Sarabun) |
| `--radius-m` | มุมโค้งการ์ด/ปุ่ม |

ระยะห่างมาตรฐาน: 12px (ช่องเล็ก), 16–24px (บล็อก), 40–46px (section padding)

## การ์ดกฎหมาย

- ใช้ `layouts/partials/law-card.html` สำหรับหน้าแรก
- ใช้ `static/js/laws-browser.js` สร้างการ์ดแบบ rich ในหน้า `/laws/`
- คลาส: `law-card law-card--{category}` + `law-card--rich` สำหรับคลัง
- แสดง: ประเภท, ปี, ชื่อ, สรุป, หมวด, หน่วยงาน, สถานะ, แท็ก

เพิ่มกฎหมายใหม่ผ่าน `data/laws.json` — ไม่ต้องแก้ CSS ถ้าหมวดมีอยู่แล้ว

## การ์ดเส้นทางการเรียนรู้

- ใช้ `layouts/partials/learning-path-card.html`
- front matter: `icon`, `card_theme`, `card_summary`, `weight`
- คลาส `cat-card cat-card--{card_theme}` ใช้สีหมวดเดียวกับระบบ

## นำทางหลัก

เมนู header (6 รายการ):

1. หน้าแรก
2. คลังกฎหมาย
3. ค้นหา
4. เส้นทางการเรียนรู้
5. แบบทดสอบ
6. เกี่ยวกับ

ลิงก์รอง (สรุป, FAQ, นโยบาย) อยู่ใน **footer**

## กฎ mobile-first

- ฟอร์มค้นหา `font-size: 16px+` ป้องกัน zoom บน iOS
- ตัวกรอง `/laws/` เป็น 1 คอลัมน์บนจอแคบ
- เมนูมือถือ: ปุ่ม hamburger, ปิดเมื่อเลือกลิงก์หรือกด Escape
- ปุ่มแบบทดสอบเต็มความกว้างบนมือถือเมื่อเหมาะสม

## Accessibility checklist

- [ ] ทุกปุ่ม/ลิงก์มี `:focus-visible` (ทอง)
- [ ] รูปโลโก้มี `alt` ที่มีความหมาย
- [ ] ฟอร์มค้นหามี `<label>` หรือ `aria-label`
- [ ] feedback แบบทดสอบมีข้อความ ✓/✗ ไม่พึ่งสีอย่างเดียว
- [ ] `prefers-reduced-motion` ปิดแอนิเมชันที่ไม่จำเป็น
- [ ] สีตัวอักษร/พื้นหลังอ่านได้บนพื้นกระดาษ

## สิ่งที่ไม่ควรทำในอนาคต

- เปลี่ยน palette ทั้งเว็บโดยไม่จำเป็น
- เพิ่ม framework CSS/JS หนัก (Bootstrap, Tailwind CDN ฯลฯ)
- ใช้ถ้อยคำว่า "ฉบับสมบูรณ์" หรือ "แหล่งกฎหมายทางการของรัฐ"
- ซ่อนข้อจำกัดทางกฎหมายเพื่อความสวยงาม
- ทำ hover-only สำหรับข้อมูลสำคัญ
- แก้ `data-pagefind-body` โดยไม่ทดสอบ Pagefind

## การทดสอบ

```bash
hugo server -D
npm run check:build
npm run check:content
npm run build:search
```

ตรวจในเบราว์เซอร์ (desktop + mobile viewport):

- `/` — CTA และค้นหา
- `/laws/` — ตัวกรอง, empty state
- `/laws/nea-2542/` — meta card, สำรวจเพิ่มเติม
- `/search/` — Pagefind UI
- `/quiz/` — ตัวกรอง, ปุ่มตอบ, เริ่มใหม่
- `/learning-paths/teachers/` — ขั้นตอนและ CTA
- `/about/reliability/`

## ไฟล์ที่เกี่ยวข้องกับ UX

| ไฟล์ | บทบาท |
|------|--------|
| `static/css/style.css` | Design system + polish |
| `static/js/main.js` | เมนูมือถือ |
| `static/js/laws-browser.js` | กรองคลังกฎหมาย |
| `static/js/quiz.js` | แบบทดสอบ |
| `layouts/partials/header.html` | Header + ค้นหาย่อ |
| `layouts/partials/footer.html` | Footer + disclaimer |
| `layouts/partials/law-explore-more.html` | CTA ท้ายหน้ากฎหมาย |
| `hugo.toml` `[menu]` | เมนูหลัก |
