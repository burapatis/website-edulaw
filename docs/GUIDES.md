# คู่มือและบทความอธิบาย (Guides & Explainers)

เอกสารนี้อธิบายส่วน **คู่มือและบทความอธิบายกฎหมายการศึกษา** ใน Education Law Hub

## วัตถุประสงค์

- ช่วยผู้ใช้ **เข้าใจประเด็นสำคัญ** ด้วยภาษาเข้าใจง่าย
- ชี้ทางไปยัง **คลังกฎหมาย แหล่งทางการ แบบทดสอบ และเส้นทางการเรียนรู้**
- **ไม่แทน** ตัวบทกฎหมายฉบับทางการหรือคำปรึกษาทางกฎหมายเฉพาะกรณี

## ที่เก็บเนื้อหา

| รายการ | ตำแหน่ง |
|--------|---------|
| หน้าแรกของส่วน | `content/guides/_index.md` |
| บทความคู่มือ | `content/guides/*.md` |
| Layout รายการ | `layouts/guides/list.html` |
| Layout บทความ | `layouts/guides/single.html` |
| การ์ด | `layouts/partials/guide-card.html` |
| ลิงก์ที่เกี่ยวข้อง | `layouts/partials/related-resources.html` |
| Archetype | `archetypes/guides.md` |

URL: `/guides/` และ `/guides/<slug>/`

## วิธีสร้างคู่มือใหม่

```bash
hugo new guides/my-topic.md
```

หรือคัดลอกจากบทความที่มีอยู่แล้ว

### Front matter ที่แนะนำ

```yaml
title: "ชื่อบทความ"
description: "คำอธิบายสั้นสำหรับ SEO"
date: 2026-06-24
weight: 10          # ลำดับบนหน้ารายการ (น้อย = บน)
icon: book          # ไอคอนการ์ด
card_theme: national
card_summary: "ข้อความสั้นบนการ์ด"
categories:           # ใช้ key หมวดเดิม เช่น national, personnel
  - national
audiences:
  - ผู้สนใจทั่วไป
tags:
  - คู่มือ
related_laws:       # id จาก data/laws.json
  - nea-2542
related_learning_paths:  # slug ไฟล์ใน learning-paths/
  - teachers
related_quiz: personnel   # key หมวดใน data/quizzes.yaml
draft: false
```

### หัวข้อในเนื้อหา (แนะนำ)

1. เรื่องนี้เหมาะสำหรับใคร
2. ควรเริ่มเข้าใจอย่างไร
3. ประเด็นสำคัญ
4. ควรอ่านกฎหมายหรือแหล่งข้อมูลใดต่อ
5. ข้อควรระวัง

## กฎการเขียนที่ปลอดภัยทางกฎหมาย

1. **ห้ามสร้างข้อเท็จจริงทางกฎหมาย** หรือเดาผลของกฎหมาย
2. ใช้ภาระมัดระวัง: “โดยทั่วไป” “อาจ” “ควรตรวจจากแหล่งทางการ”
3. **ลิงก์ไปคลังกฎหมาย** แทนการคัดลอกตัวบทยาว
4. **ไม่อ้างว่าครบถ้วน** ทุกประเด็น
5. **ไม่ตอบคำถามเฉพาะกรณี** — แนะนำตรวจแหล่งทางการหรือปรึกษาผู้เชี่ยวชาญ
6. มี disclaimer (layout ใส่ `legal-disclaimer` อัตโนมัติ)

## การเชื่อมโยงกับส่วนอื่น

| ฟิลด์ | ใช้เชื่อม |
|-------|----------|
| `related_laws` | หน้า `/laws/<id>/` |
| `related_learning_paths` | `/learning-paths/<slug>/` |
| `related_quiz` | หมวดใน `/quiz/` |
| ลิงก์ในเนื้อหา | `/search/`, `/about/source-policy/` ฯลฯ |

Partial `related-resources.html` แสดงบล็อกลิงก์ท้ายบทความอัตโนมัติ

## Taxonomy

คู่มือใช้ taxonomy เดิมของเว็บไซต์:

- `categories` — key หมวดกฎหมาย (constitution, national, personnel ฯลฯ)
- `audiences` — ข้อความภาษาไทยตรงกับกลุ่มผู้ใช้ที่มีอยู่
- `tags` — เพิ่ม `คู่มือ` และคำสำคัญเฉพาะเรื่อง

อย่าสร้างหมวดใหม่โดยไม่จำเป็น

## SEO และ Pagefind

- `title` และ `description` ใน front matter → ใช้โดย partial SEO ที่มีอยู่
- เนื้อหาหลักมี `data-pagefind-body` — ถูก index โดย Pagefind
- ไม่ใช้คำอ้างอิงเกินจริงใน title/description

## Checklist ก่อนเผยแพร่คู่มือ

- [ ] หัวข้อเป็น **เชิงการศึกษา** ไม่ใช่คำปรึกษาเฉพาะกรณี
- [ ] **ไม่มี** ข้อสรุปทางกฎหมายที่ไม่มีแหล่งรองรับ
- [ ] มีลิงก์ไป **คลังกฎหมาย** หรือ **นโยบายแหล่งข้อมูล**
- [ ] มี **description** ใน front matter
- [ ] มี **audiences** และ **tags** (อย่างน้อย `คู่มือ`)
- [ ] ใช้ **ถ้อยคำปลอดภัย** ไม่อ้างความครบถ้วน
- [ ] `draft: false` เมื่อพร้อมเผยแพร่
- [ ] รัน `hugo --minify` และ `npm run build:search` ผ่าน
- [ ] ตรวจหน้า `/guides/<slug>/` บนเครื่อง

## การทดสอบในเครื่อง

```bash
npm run dev
# เปิด http://localhost:1313/website-edulaw/guides/

npm run check:content
npm run build:search
npm run report:stats
```

## ชุดบทความ SEO ที่เพิ่มเข้ามา (มิ.ย. 2026)

เพิ่มบทความคู่มือเชิง SEO อีก **8 ฉบับ** ต่อจากชุดเริ่มต้น 6 ฉบับ (รวมเป็น 14 ฉบับ):

- `education-laws-teachers-should-know` — กฎหมายการศึกษาที่ครูควรรู้
- `education-laws-school-administrators-should-know` — กฎหมายการศึกษาที่ผู้บริหารสถานศึกษาควรรู้
- `what-is-teaching-profession-law` — กฎหมายวิชาชีพครูคืออะไร
- `teaching-license-which-laws` — ใบอนุญาตประกอบวิชาชีพครูเกี่ยวข้องกับกฎหมายใด
- `what-is-compulsory-education` — การศึกษาภาคบังคับคืออะไร
- `childrens-education-rights` — สิทธิทางการศึกษาของเด็กและผู้เรียน
- `how-to-search-official-education-law-sources` — วิธีค้นกฎหมายการศึกษาจากแหล่งทางการ
- `education-law-hub-for-teachers-and-student-teachers` — แหล่งรวมกฎหมายการศึกษาไทยสำหรับครูและนักศึกษาครู

แนวทางสำหรับบทความคู่มือในอนาคต:

- ใช้ front matter และส่วน **ข้อควรระวัง/ข้อจำกัด** ในรูปแบบเดียวกับชุดนี้ (มี `legal-disclaimer` อัตโนมัติจาก layout ด้วย)
- ลิงก์ภายในควรชี้ไป **คลังกฎหมาย** (`/laws/...`), **ค้นหา** (`/search/`), **แบบทดสอบ** (`/quiz/`), **เส้นทางการเรียนรู้** (`/learning-paths/...`), **นโยบายแหล่งข้อมูล** (`/about/source-policy/`) และ **แหล่งทางการ** ที่เกี่ยวข้อง
- ใช้ลิงก์ภายในแบบ site-relative (`/laws/...`) ไม่ใช่ลิงก์เต็มโดเมน — Hugo (`canonifyURLs`) จะเติม baseURL ของ GitHub Pages ให้เอง
- **ห้ามลิงก์ไปหน้ากฎหมายที่ยังไม่มีในคลัง** หากต้องอ้างถึงให้ใช้เป็นข้อความตัวหนาแทนลิงก์ จนกว่าจะเพิ่มกฎหมายฉบับนั้นเข้าคลังพร้อมแหล่งทางการ

## เนื้อหาที่ควรตรวจด้วยมือ

บทความทั้งหมดเป็นภาพรวมเชิงการศึกษา — **ควรมีผู้ทราบกฎหมายทบทวน** ก่อนอ้างว่าครอบคลุมประเด็นสำคัญทั้งหมด โดยเฉพาะ:

- การศึกษาภาคบังคับ (รายละเอียดอายุ/ข้อยกเว้น)
- กฎหมายวิชาชีพครู (เกณฑ์ใบอนุญาตเฉพาะกรณี โดยเฉพาะตัวเลขอายุใบอนุญาต/บทลงโทษใน `teaching-license-which-laws` ที่รวบรวมจากข้อมูลเผยแพร่ทั่วไป)
- สิทธิทางการศึกษา (การตีความเชิงรัฐธรรมนูญ)
- กฎหมายที่บทความอ้างถึงแต่ยังไม่มีหน้าในคลัง (ปัจจุบันถูกแสดงเป็นข้อความตัวหนาแทนลิงก์): กฎกระทรวงใบอนุญาตประกอบวิชาชีพ 2550, ระเบียบ ก.ค.ศ. วิทยฐานะ 2553, พ.ร.บ.ส่งเสริมสวัสดิการครูฯ 2547, ระเบียบป้องกันการกลั่นแกล้ง 2566, พ.ร.บ.ประกันคุณภาพการศึกษา 2546

## เอกสารที่เกี่ยวข้อง

- [CONTENT_EXPANSION_WORKFLOW.md](CONTENT_EXPANSION_WORKFLOW.md)
- [FEEDBACK_WORKFLOW.md](FEEDBACK_WORKFLOW.md)
- [LEGAL_REVIEW_CHECKLIST.md](../LEGAL_REVIEW_CHECKLIST.md)
