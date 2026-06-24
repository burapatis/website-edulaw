# SEO, Social Sharing และ Structured Metadata

เอกสารนี้อธิบายการตั้งค่า SEO สำหรับ Thai Education Law Hub (Hugo + GitHub Pages)

## ไฟล์ที่เกี่ยวข้อง

| ไฟล์ | หน้าที่ |
|------|---------|
| `hugo.toml` | `baseURL`, `locale`, `params.description`, `params.ogImage`, `[sitemap]`, `enableRobotsTXT` |
| `layouts/partials/head.html` | รวม partials ใน `<head>` |
| `layouts/partials/seo/resolve.html` | คำนวณ title, description, ogImage, ogType, robots |
| `layouts/partials/head/seo.html` | `<title>`, meta description, canonical, robots |
| `layouts/partials/head/opengraph.html` | Open Graph + Twitter Card |
| `layouts/partials/head/schema.html` | JSON-LD (WebSite, Organization, BreadcrumbList, TechArticle) |
| `layouts/robots.txt` | robots.txt template |
| `content/laws/_content.gotmpl` | สร้าง `description` อัตโนมัติสำหรับหน้ากฎหมาย |

## การสร้าง Page Title

ลำดับใน `seo/resolve.html`:

| ประเภทหน้า | รูปแบบ title |
|------------|--------------|
| หน้าแรก | `{site.Title} \| {params.tagline}` |
| หน้าอื่น | `{.Title} \| {site.Title}` |

ตัวอย่าง: `พ.ร.บ.การศึกษาแห่งชาติ พ.ศ. 2542 | กฎหมายการศึกษา`

## การสร้าง Meta Description

ลำดับความสำคัญ:

1. `.Description` (จาก front matter `description` หรือ Hugo page description)
2. `.Params.description`
3. **หน้ากฎหมาย** (`Section == laws`) — สร้างอัตโนมัติจาก title, agency, status
4. **หน้าเส้นทางการเรียนรู้** (ไม่ใช่ section index) — สร้างจากชื่อกลุ่มผู้ใช้
5. **หน้าแบบทดสอบ** — ข้อความมาตรฐานเกี่ยวกับการเรียนรู้เบื้องต้น
6. `.Summary` (ตัดเป็น 160 ตัวอักษร)
7. `site.Params.description` หรือค่า default ที่ปลอดภัย

ค่า default ของเว็บไซต์:

> เว็บไซต์รวบรวมกฎหมายการศึกษาไทย สรุปอ่านง่าย แบบทดสอบ เส้นทางการเรียนรู้ และลิงก์แหล่งข้อมูลทางการ เพื่อการศึกษาและค้นคว้าเบื้องต้น

## วิธีเพิ่ม description ให้หน้าใหม่

ใน front matter ของ Markdown:

```yaml
---
title: "ชื่อหน้า"
description: "คำอธิบายสั้น ๆ สำหรับ SEO และการแชร์"
---
```

สำหรับกฎหมายที่เพิ่มใน `data/laws.json` — `description` ถูกสร้างใน `_content.gotmpl` อัตโนมัติ หรือกำหนด `description` ใน JSON ได้ถ้าต้องการ override

## Open Graph Image

ลำดับความสำคัญ:

1. `.Params.og_image` (ต่อหน้า)
2. `site.Params.ogImage` ใน `hugo.toml` (ปัจจุบัน: `/assets/feature-graphic.png`)
3. fallback `/assets/feature-graphic.png`

ไฟล์ปัจจุบัน: `static/assets/feature-graphic.png`

หากต้องการภาพ OG เฉพาะ:

- วางไฟล์ใน `static/images/og-default.png` (หรือ path อื่น)
- อัปเดต `params.ogImage` ใน `hugo.toml`
- หรือตั้ง `og_image` ใน front matter ของหน้านั้น

**หมายเหตุ:** ยังไม่มีไฟล์ `static/images/og-default.png` แยกต่างหาก — ใช้ `feature-graphic.png` ที่มีอยู่แล้ว หากต้องการภาพ OG คุณภาพสูงขึ้นสำหรับการแชร์ ควรออกแบบและเพิ่มภายหลัง (แนะนำขนาด 1200×630 px)

## Sitemap และ robots.txt

- **sitemap.xml** — Hugo สร้างอัตโนมัติหลัง build (รวมเฉพาะหน้าที่ publish ไม่รวม draft)
- **robots.txt** — จาก `layouts/robots.txt` (`enableRobotsTXT = true`)
  - `Allow: /`
  - `Disallow: /pagefind/` (ไม่เน้น index ไฟล์ค้นหาภายใน)
  - `Sitemap: {baseURL}sitemap.xml`

การตั้งค่า `[sitemap]` ใน `hugo.toml` กำหนด `changefreq` และ `priority` เริ่มต้น

## Structured Data (JSON-LD)

| ประเภท | หน้าที่ใช้ |
|--------|-----------|
| `WebSite` + `SearchAction` | หน้าแรก |
| `Organization` + `Person` (founder) | หน้าแรก |
| `BreadcrumbList` | หน้าย่อยส่วนใหญ่ |
| `TechArticle` | หน้ารายละเอียดกฎหมายเท่านั้น |

**ไม่ใช้** schema ประเภท `Legislation` หรือข้อความที่บอกว่าเป็นแหล่งกฎหมายทางการของรัฐ

## ถ้อยคำที่ปลอดภัยสำหรับหน้ากฎหมาย

**ควรใช้**

- สรุปและข้อมูลเบื้องต้น
- เพื่อการศึกษาและค้นคว้า
- ลิงก์แหล่งข้อมูลทางการ

**หลีกเลี่ยง**

- ฉบับสมบูรณ์ / ครบถ้วนที่สุด
- ฉบับล่าสุดแน่นอน
- ใช้แทนคำปรึกษากฎหมาย
- แหล่งกฎหมายทางการของรัฐ (ในบริบท schema หรือ meta)

## การทดสอบในเครื่อง

```bash
hugo server -D
npm run check:build
npm run check:content
npm run build:search
```

ตรวจ `<head>` ของหน้าต่าง ๆ:

```bash
curl -s http://localhost:1313/website-edulaw/ | grep -E '<title>|description|og:|twitter:|canonical'
curl -s http://localhost:1313/website-edulaw/laws/nea-2542/ | grep -E '<title>|description|og:|application/ld'
curl -s http://localhost:1313/website-edulaw/quiz/ | grep description
curl -s http://localhost:1313/website-edulaw/learning-paths/teachers/ | grep description
```

หลัง build:

```bash
ls public/sitemap.xml public/robots.txt
```

เครื่องมือภายนอก (หลัง deploy):

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- Google Search Console — ส่ง sitemap

## baseURL และ path

- Production: `https://burapatis.github.io/website-edulaw/`
- ใช้ `absURL`, `.Permalink`, และ partial `iu.html` สำหรับ asset
- ไม่ hardcode path ที่อาจพังเมื่อเปลี่ยน baseURL

## robots / noindex

ตั้ง `noindex: true` ใน front matter ของหน้าใด ๆ หากต้องการไม่ให้ index (เช่น draft จะไม่ถูก build ใน production อยู่แล้ว)
