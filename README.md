# Education Law Hub (Hugo)

ศูนย์รวมกฎหมายการศึกษาไทย — สร้างด้วย [Hugo](https://gohugo.io/) และเผยแพร่ผ่าน GitHub Pages

## รันในเครื่อง

```bash
npm install
npm run dev
```

เปิด http://localhost:1313/website-edulaw/

สำหรับทดสอบ **การค้นหา Pagefind** ดู [docs/SEARCH.md](docs/SEARCH.md)

## โครงสร้างหลัก

| โฟลเดอร์ | หน้าที่ |
|----------|---------|
| `content/` | เนื้อหา Markdown (laws, summaries, faq, quiz, about) |
| `data/laws.json` | ข้อมูลกฎหมายสำหรับคลังกฎหมาย |
| `layouts/` | เทมเพลต HTML |
| `static/` | CSS, JS, โลโก้, favicon |
| `legacy-site/` | เว็บ HTML เดิม (สำรอง) |

## Build

```bash
npm run build:search
```

ผลลัพธ์อยู่ใน `public/` พร้อมดัชนีค้นหาใน `public/pagefind/`

Build Hugo อย่างเดียว (ไม่มีดัชนีค้นหา):

```bash
npm run build
```

## เว็บเดิม

เว็บไซต์ static HTML/CSS/JS เดิมเก็บไว้ที่ `legacy-site/` ดูรายละเอียดใน `legacy-site/README.md`
