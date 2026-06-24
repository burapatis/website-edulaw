# การค้นหาในเว็บไซต์ (Pagefind)

เว็บไซต์นี้ใช้ [Pagefind](https://pagefind.app/) สร้างดัชนีค้นหาแบบสถิตจากไฟล์ HTML ที่ Hugo สร้างขึ้น ผลลัพธ์ทำงานบนเบราว์เซอร์โดยไม่ต้องมีเซิร์ฟเวอร์ค้นหาแยก

## พัฒนาเนื้อหา (Hugo เท่านั้น)

สำหรับแก้ Markdown, เทมเพลต หรือสไตล์ — ไม่จำเป็นต้องรัน Pagefind ทุกครั้ง:

```bash
npm run dev
# หรือ: hugo server -D
```

เปิด http://localhost:1313/website-edulaw/

> หน้า `/search/` จะยังไม่มีผลลัพธ์ครบจนกว่าจะ build พร้อม Pagefind (ดูด้านล่าง)

## Build พร้อมดัชนีค้นหา

```bash
npm install
npm run build:search
```

คำสั่งนี้รัน:

1. `hugo --gc --minify` — สร้างไฟล์ใน `public/`
2. `pagefind --site public` — สร้างดัชนีใน `public/pagefind/`

## ทดสอบการค้นหาในเครื่อง

หลัง build ให้ใช้ `baseURL` ที่ตรงกับเซิร์ฟเวอร์ท้องถิ่น (เพราะไซต์เผยแพร่ใต้ `/website-edulaw/` บน GitHub Pages):

```bash
hugo --gc --minify --baseURL http://localhost:1414/ && pagefind --site public
npm run serve:search
```

Pagefind จะเปิดเซิร์ฟเวอร์ท้องถิ่น (มักที่ http://localhost:1414) จากนั้นเปิด:

- http://localhost:1414/search/
- ลองค้นหา เช่น `วิทยฐานะ` `การศึกษาแห่งชาติ` `ก.ค.ศ.`

ทดสอบลิงก์จาก header/footer ด้วย

> `npm run build:search` ใช้ `baseURL` จาก `hugo.toml` สำหรับ production (`/website-edulaw/pagefind/`) — เหมาะกับ GitHub Pages หลัง deploy

## สคริปต์ npm

| สคริปต์ | ความหมาย |
|---------|----------|
| `npm run dev` | Hugo dev server (`hugo server -D`) |
| `npm run build` | Hugo build อย่างเดียว |
| `npm run index` | สร้างดัชนี Pagefind จาก `public/` ที่มีอยู่ |
| `npm run build:search` | Hugo build + Pagefind index |
| `npm run serve:search` | เสิร์ฟ `public/` พร้อมค้นหา |

## เนื้อหาที่ถูกจัดทำดัชนี

Pagefind อ่าน HTML หลัง build โดยเน้นพื้นที่ `data-pagefind-body` และข้าม `data-pagefind-ignore`

| ส่วน | การจัดทำดัชนี |
|------|----------------|
| หน้ากฎหมายแต่ละฉบับ (`/laws/.../`) | ชื่อ สรุป สาระสำคัญ ข้อมูลเมตา |
| FAQ, About, นโยบาย | เนื้อหา Markdown |
| สรุปกฎหมาย | ข้อความและหัวข้อสรุป |
| หน้าแรก | เฉพาะส่วน hero |
| คลังกฎหมาย (`/laws/`) | บล็อก `<noscript>` (สำรองเมื่อไม่มี JS) |
| แบบทดสอบ | เฉพาะคำอธิบายหน้า — **ไม่** รวมคำถามใน `quiz-data.js` |
| Header / Footer | ข้าม |

## การ deploy (GitHub Actions)

Workflow `.github/workflows/hugo.yml` รัน `npm ci` แล้ว `npm run build:search` ก่อนอัปโหลด `public/` ไป GitHub Pages ดังนั้นดัชนีค้นหาจะอยู่ใน production อัตโนมัติ

## ข้อจำกัดที่ควรทราบ

- **ภาษาไทย:** Pagefind รองรับ Unicode แต่การแบ่งคำภาษาไทยอาจไม่แม่นยำเท่าเครื่องมือค้นหาเฉพาะทาง — ลองใช้คำสำคัญสั้น ๆ หรือส่วนของชื่อกฎหมาย
- **เนื้อหา JavaScript:** การ์ดในคลังกฎหมายที่เรนเดอร์ด้วย JS ไม่ถูกจัดทำดัชนี (หน้ารายละเอียดแต่ละฉบับเป็นหลัก)
- **แบบทดสอบ:** คำถามและตัวเลือกอยู่ในไฟล์ JS จึงไม่ปรากฏในผลค้นหา
- **ต้อง build ใหม่:** แก้เนื้อหาแล้วต้องรัน `build:search` (หรือ deploy) ก่อนดัชนีจะอัปเดต

## แก้ป้ายภาษา UI

ข้อความช่องค้นหาและผลลัพธ์ตั้งค่าใน `layouts/search/list.html` (ออบเจ็กต์ `translations` ของ PagefindUI)
