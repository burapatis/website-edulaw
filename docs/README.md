# เอกสารประกอบโปรเจกต์ (Documentation Index)

ดัชนีเอกสารสำหรับผู้ดูแลและผู้ร่วมพัฒนา **Education Law Hub**

## การขยายเนื้อหาและ metadata

| เอกสาร | คำอธิบาย |
|--------|----------|
| [CONTENT_EXPANSION_WORKFLOW.md](CONTENT_EXPANSION_WORKFLOW.md) | ขั้นตอนเพิ่มกฎหมายอย่างปลอดภัย |
| [LAW_METADATA_GUIDE.md](LAW_METADATA_GUIDE.md) | อธิบายฟิลด์ metadata ทุกตัว |
| [LAW_PAGE_TEMPLATE.md](LAW_PAGE_TEMPLATE.md) | แม่แบบ copy-paste สำหรับหน้ากฎหมาย |
| [../data/law_backlog.yaml](../data/law_backlog.yaml) | คิวงานหัวข้อที่อาจเพิ่ม (ยังไม่สร้างหน้า) |
| [../CONTRIBUTING.md](../CONTRIBUTING.md) | แนวทางร่วมพัฒนา |
| [../SOURCE_REVIEW_LOG.md](../SOURCE_REVIEW_LOG.md) | บันทึกตรวจแหล่งด้วยมือ |
| [../LEGAL_REVIEW_CHECKLIST.md](../LEGAL_REVIEW_CHECKLIST.md) | checklist ตรวจกฎหมายก่อน deploy |

## คุณภาพและ CI

| เอกสาร | คำอธิบาย |
|--------|----------|
| [QUALITY_CHECKS.md](QUALITY_CHECKS.md) | สคริปต์ตรวจเนื้อหาและ GitHub Actions |

## ฟีเจอร์เว็บไซต์

| เอกสาร | คำอธิบาย |
|--------|----------|
| [SEARCH.md](SEARCH.md) | Pagefind และหน้าค้นหา |
| [TAXONOMY.md](TAXONOMY.md) | หมวดหมู่และตัวกรอง |
| [QUIZ.md](QUIZ.md) | ระบบแบบทดสอบ |
| [LEARNING_PATHS.md](LEARNING_PATHS.md) | เส้นทางการเรียนรู้ |
| [SEO.md](SEO.md) | SEO และ structured metadata |
| [UX_UI_GUIDE.md](UX_UI_GUIDE.md) | หลักการ UX/UI |
| [FEEDBACK_WORKFLOW.md](FEEDBACK_WORKFLOW.md) | รับและจัดการข้อเสนอแนะจากผู้ใช้ |
| [DASHBOARD.md](DASHBOARD.md) | ภาพรวมเว็บไซต์และสถานะเนื้อหา |
| [GUIDES.md](GUIDES.md) | คู่มือและบทความอธิบายกฎหมาย |

## คำสั่งที่ใช้บ่อย

```bash
npm run dev
npm run check:content
npm run check:content:full
npm run build:search
```
