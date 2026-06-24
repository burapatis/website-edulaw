# Education Law Hub — กฎหมายการศึกษา

**ศูนย์รวมกฎหมายการศึกษาไทย** สำหรับการเรียนรู้และค้นคว้าเบื้องต้น — สรุปอ่านง่าย ค้นหาได้ มีแบบทดสอบ เส้นทางการเรียนรู้ และลิงก์แหล่งข้อมูลทางการ

**เว็บไซต์:** https://burapatis.github.io/website-edulaw/  
**สถานะ:** Public Beta · v1.0.0-beta

> เนื้อหาเป็นการสรุปเพื่อการศึกษา **ไม่ใช่** คำปรึกษาทางกฎหมาย และ **ไม่รับประกัน** ว่าครบทุกกฎหมายหรือเป็นฉบับล่าสุด — ตรวจสอบแหล่งทางการก่อนใช้อ้างอิงอย่างเป็นทางการ

## Tech stack

- [Hugo](https://gohugo.io/) — static site generator
- [GitHub Pages](https://pages.github.com/) — hosting
- [Pagefind](https://pagefind.app/) — client-side search

## Local development

```bash
npm install
npm run dev
```

เปิด http://localhost:1313/website-edulaw/

## Quality checks

```bash
npm run check:content      # ตรวจ metadata กฎหมาย (ล้มเหลวถ้ามี critical)
npm run check:content:full # รายงานเพิ่มเติม
npm run build:search       # Hugo + Pagefind index
npm run release:check      # ตรวจก่อนปล่อยเวอร์ชัน
npm run report:stats       # สถิติเว็บไซต์ (รายงานอย่างเดียว)
```

## Contributing

- [CONTRIBUTING.md](CONTRIBUTING.md) — วิธีร่วมพัฒนา แจ้งข้อผิดพลาด และเสนอ PR
- ห้ามสร้างข้อเท็จจริงทางกฎหมาย · ต้องมีแหล่งทางการ · บันทึกใน [SOURCE_REVIEW_LOG.md](SOURCE_REVIEW_LOG.md)

## Documentation

- [docs/README.md](docs/README.md) — ดัชนีเอกสารทั้งหมด
- [docs/PUBLIC_RELEASE.md](docs/PUBLIC_RELEASE.md) — การเปิดใช้งาน Public Beta
- [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) — checklist ก่อน release
- [CHANGELOG.md](CHANGELOG.md) — ประวัติเวอร์ชัน

## โครงสร้างหลัก

| โฟลเดอร์ | หน้าที่ |
|----------|---------|
| `content/` | เนื้อหา Markdown (laws, guides, learning-paths, about, …) |
| `data/laws.json` | คลังกฎหมาย (สร้างหน้าผ่าน `_content.gotmpl`) |
| `data/quizzes.yaml` | แบบทดสอบ |
| `layouts/` | เทมเพลต Hugo |
| `static/` | CSS, JS, assets |
| `scripts/` | ตรวจคุณภาพและ release check |
| `legacy-site/` | เว็บ HTML เดิม (สำรอง) |

## Build

```bash
npm run build:search
```

ผลลัพธ์ใน `public/` พร้อมดัชนีค้นหา `public/pagefind/`

Hugo อย่างเดียว: `npm run build`
