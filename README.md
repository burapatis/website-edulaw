# Education Law Hub (Hugo)

ศูนย์รวมกฎหมายการศึกษาไทย — สร้างด้วย [Hugo](https://gohugo.io/) และเผยแพร่ผ่าน GitHub Pages

## รันในเครื่อง

```bash
hugo server
```

เปิด http://localhost:1313/website-edulaw/

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
hugo --minify
```

ผลลัพธ์อยู่ใน `public/`

## เว็บเดิม

เว็บไซต์ static HTML/CSS/JS เดิมเก็บไว้ที่ `legacy-site/` ดูรายละเอียดใน `legacy-site/README.md`
