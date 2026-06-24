# Release Checklist — Education Law Hub

รายการตรวจก่อนเผยแพร่หรือประกาศเวอร์ชันใหม่ (เช่น Public Beta v1.0.0-beta)

ใช้คู่กับ [docs/QA_CHECKLIST.md](docs/QA_CHECKLIST.md) และ [LEGAL_REVIEW_CHECKLIST.md](LEGAL_REVIEW_CHECKLIST.md)

## คำสั่งอัตโนมัติ

```bash
npm run release:check    # check:content + build:search
npm run report:stats     # รายงานสถิติ (ไม่ทำให้ล้มเหลว)
```

- [ ] `npm run release:check` ผ่าน
- [ ] `npm run check:content` — 0 critical
- [ ] `npm run build:search` — Hugo + Pagefind สำเร็จ
- [ ] GitHub Actions (quality-check, hugo, link-check) ผ่านบน branch ที่จะ deploy

## หน้าเว็บหลัก

- [ ] หน้าแรก `/` โหลดได้ ลิงก์ CTA ทำงาน
- [ ] คลังกฎหมาย `/laws/` แสดงการ์ดและตัวกรอง
- [ ] หน้ารายละเอียดกฎหมาย `/laws/<id>/` — metadata card, disclaimer, ลิงก์แหล่งทางการ
- [ ] ค้นหา `/search/` — Pagefind คืนผลลัพธ์
- [ ] ตัวกรอง taxonomy (หมวดหมู่ หน่วยงาน กลุ่มผู้ใช้) ทำงาน
- [ ] แบบทดสอบ `/quiz/` — เลือกหมวด ตอบคำถาม แสดงเฉลย
- [ ] เส้นทางการเรียนรู้ `/learning-paths/` และหน้าย่อย
- [ ] คู่มือ `/guides/` และบทความย่อย
- [ ] ภาพรวมเว็บไซต์ `/dashboard/`
- [ ] แจ้งข้อผิดพลาด `/feedback/`
- [ ] หน้าสถานะ Public Beta `/about/public-beta/`

## นโยบายและความน่าเชื่อถือ

- [ ] นโยบายแหล่งข้อมูล `/about/source-policy/` มองเห็นและลิงก์ได้
- [ ] นโยบายการตรวจสอบ `/about/update-policy/`
- [ ] ความน่าเชื่อถือและข้อจำกัด `/about/reliability/`
- [ ] Disclaimer ปรากฏบนหน้ากฎหมายและส่วนที่เกี่ยวข้อง
- [ ] Footer มีลิงก์นโยบายและสถานะเวอร์ชัน (ถ้ามี)

## SEO และไฟล์ระบบ

- [ ] `sitemap.xml` ถูกสร้างใน `public/`
- [ ] `robots.txt` ถูกสร้าง
- [ ] canonical / Open Graph บนหน้าตัวอย่าง (ดู [docs/SEO.md](docs/SEO.md))

## มือถือและการเข้าถึง

- [ ] ทดสอบเมนูมือถือ (hamburger) เปิด/ปิดได้
- [ ] ตาราง/การ์ดไม่ล้นจอบนจอแคบ
- [ ] หัวข้อและลิงก์อ่านได้ชัดเบื้องต้น

## ความปลอดภัยและข้อความสาธารณะ

- [ ] ไม่มีข้อมูลส่วนบุคคลหรือข้อมูลภายในที่ไม่ควรเผยแพร่
- [ ] ไม่อ้างว่า “ข้อมูลกฎหมายครบถ้วนสมบูรณ์” หรือ “เป็นฉบับทางการทั้งหมด”
- [ ] ข้อความ Public Beta ชัดเจน — เป็นแหล่งเรียนรู้ ไม่ใช่คำปรึกษากฎหมาย
- [ ] Link check ผ่านหรือมีแผนแก้ลิงก์เสียที่ทราบ

## เอกสาร release

- [ ] [CHANGELOG.md](CHANGELOG.md) อัปเดตเวอร์ชันและข้อจำกัด
- [ ] [docs/PUBLIC_RELEASE.md](docs/PUBLIC_RELEASE.md) สอดคล้องกับสถานะปัจจุบัน
- [ ] `hugo.toml` → `params.version` และ `params.release_status` ถูกต้อง
- [ ] [SOURCE_REVIEW_LOG.md](SOURCE_REVIEW_LOG.md) บันทึกการตรวจสำคัญ (ถ้ามีการเปลี่ยนแหล่ง)

## หมายเหตุ

การตรวจรายการนี้ **ไม่แทน** การตรวจกฎหมายโดยผู้เชี่ยวชาญ — ใช้ร่วมกับ `LEGAL_REVIEW_CHECKLIST.md`
