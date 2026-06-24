# Changelog

รูปแบบอิง [Keep a Changelog](https://keepachangelog.com/) — โปรเจกต์นี้ใช้ [Semantic Versioning](https://semver.org/) ในเชิงเทคนิค

## [Unreleased]

### Planned
- ขยายคลังกฎหมายจาก `data/law_backlog.yaml` หลังตรวจแหล่งทางการ
- เพิ่ม `last_checked` ใน `data/laws.json` ให้ครบถ้วนขึ้น
- ปรับปรุงแบบฟอร์มรับข้อเสนอแนะ (Google Form) เมื่อพร้อม

---

## [1.0.0-beta] — 2026-06-24

### Added — คลังกฎหมายและ metadata
- คลังกฎหมายจาก `data/laws.json` + `content/laws/_content.gotmpl` (~38 ฉบับ)
- Front matter และ metadata card มาตรฐาน (`source_url`, `official_source`, `last_checked`, taxonomy)
- Legal disclaimer บนหน้ากฎหมาย

### Added — นโยบายและความน่าเชื่อถือ
- นโยบายแหล่งข้อมูล (`/about/source-policy/`)
- นโยบายการตรวจสอบและปรับปรุงข้อมูล (`/about/update-policy/`)
- ความน่าเชื่อถือและข้อจำกัด (`/about/reliability/`)

### Added — การค้นหาและสำรวจ
- Pagefind search (`/search/`)
- Taxonomy browsing และตัวกรองกฎหมาย (หมวดหมู่ หน่วยงาน กลุ่มผู้ใช้ ประเภท)

### Added — การเรียนรู้
- ระบบแบบทดสอบ (`/quiz/`, 40 ข้อ)
- เส้นทางการเรียนรู้ (`/learning-paths/`, 6 เส้นทาง)
- คู่มือและบทความอธิบาย (`/guides/`, 6 บทความเริ่มต้น)

### Added — คุณภาพและ CI
- `npm run check:content` — ตรวจ metadata กฎหมาย
- GitHub Actions: Hugo build, quality check, link check
- เอกสาร workflow ขยายเนื้อหา (`docs/CONTENT_EXPANSION_WORKFLOW.md`)

### Added — SEO และ UX
- SEO partials (title, description, Open Graph, schema)
- ปรับ UX/UI และ mobile navigation
- `robots.txt`, sitemap

### Added — ชุมชนและความโปร่งใส
- ระบบแจ้งข้อผิดพลาดและเสนอแนะ (`/feedback/`)
- GitHub Issue templates (content-correction, source-suggestion)
- ภาพรวมเว็บไซต์ (`/dashboard/`)

### Added — การปล่อยเวอร์ชัน (Step 15)
- หน้าสถานะ Public Beta (`/about/public-beta/`)
- CHANGELOG, RELEASE_CHECKLIST, ROADMAP, QA checklist
- `npm run release:check`

### Known limitations
- **ไม่ใช่** เว็บไซต์ราชการหรือแหล่งข้อมูลทางการ
- **ไม่ใช่** บริการให้คำปรึกษาทางกฎหมาย
- **ไม่รับประกัน** ว่าคลังกฎหมายครบถ้วนหรือทุกหน้าเป็นฉบับล่าสุด
- ลิงก์แหล่งทางการบางรายการอาจต้องตรวจสอบด้วยมือเป็นระยะ
- สถานะกฎหมายและตัวบทฉบับเต็ม **ต้องตรวจจากแหล่งทางการ** ก่อนใช้อ้างอิงอย่างเป็นทางการ
- บางรายการใน `data/laws.json` ยังไม่มี `last_checked` ในคลังข้อมูลโดยตรง

[Unreleased]: https://github.com/burapatis/website-edulaw/compare/v1.0.0-beta...HEAD
[1.0.0-beta]: https://github.com/burapatis/website-edulaw/releases/tag/v1.0.0-beta
