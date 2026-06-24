# Roadmap — Education Law Hub

แผนพัฒนาเชิงทิศทาง — **ไม่ใช่สัญญากำหนดเวลา** ลำดับและขอบเขตอาจปรับตามทรัพยากรและการตรวจแหล่งทางการ

## v1.0 — Public Beta (ปัจจุบัน)

**สถานะ:** เปิดใช้งาน Public Beta · `1.0.0-beta`

- คลังกฎหมาย ~38 ฉบับ พร้อม metadata และ disclaimer
- ค้นหา Pagefind, taxonomy, แบบทดสอบ, เส้นทางเรียนรู้, คู่มือ
- นโยบายแหล่งข้อมูล / การอัปเดต / ความน่าเชื่อถือ
- Feedback, dashboard, quality checks, SEO, mobile polish
- เอกสาร release และ QA checklist

**ข้อจำกัดที่ยอมรับ:** ไม่ครบทุกกฎหมาย · บาง metadata ยังต้องทบทวน · ไม่ใช่คำปรึกษากฎหมาย

---

## v1.1 — Verified source expansion

- เพิ่มกฎหมายจาก `law_backlog.yaml` หลังตรวจแหล่งทางการ
- เติม `last_checked` ใน `data/laws.json` ให้ครบขึ้น
- แก้ลิงก์แหล่งทางการที่เสียจาก link-check
- บันทึกใน `SOURCE_REVIEW_LOG.md`

---

## v1.2 — More quiz questions

- เพิ่มคำถามใน `data/quizzes.yaml` ตามหมวดที่ยังน้อย
- เชื่อมคำถามกับ `related_law_id` ที่ตรวจแล้ว
- ทบทวนถ้อยคำเฉลยให้ปลอดภัย (ไม่วินิจฉัยเฉพาะกรณี)

---

## v1.3 — More guides

- ขยาย `content/guides/` ตามความต้องการผู้ใช้
- เชื่อมคู่มือกับเส้นทางเรียนรู้และคลังกฎหมาย
- ใช้ [GUIDES.md](GUIDES.md) และ checklist การเขียน

---

## v1.4 — Improved dashboard and reporting

- ปรับภาพรวมเว็บไซต์ให้สะท้อนสถานะตรวจแหล่งละเอียดขึ้น
- ขยาย `npm run report:stats` (ถ้าจำเป็น)
- อาจแสดงแนวโน้มการขยายคลัง (ไม่ overclaim)

---

## v1.5 — Community feedback review process

- กระบวนการ triage feedback ที่ชัดเจนขึ้น
- เชื่อม Google Form (เมื่อเปิดใช้) กับ workflow ผู้ดูแล
- ปรับ Issue templates ตามประสบการณ์จริง

---

## v2.0 — Possible future directions

ทิศทางที่ **อาจพิจารณา** ในอนาคต (ยังไม่ยืนยัน):

- โดเมนเฉพาะ (custom domain)
- การค้นหาขั้นสูง (filters ใน Pagefind หรือเครื่องมือเสริม)
- เอกสารอ้างอิงดาวน์โหลด (cheat sheet) — ต้องตรวจลิขสิทธิ์และแหล่งทางการ
- เนื้อหาภาษาอังกฤษบางส่วน (ถ้ามีความต้องการและทรัพยากร)

---

## หลักการตลอด roadmap

1. ไม่สร้างข้อเท็จจริงทางกฎหมาย
2. แหล่งทางการมาก่อนเสมอ
3. Disclaimer และข้อจำกัดคงอยู่
4. คุณภาพสำคัญกว่าปริมาณ

ดูรายละเอียดการปล่อย: [PUBLIC_RELEASE.md](PUBLIC_RELEASE.md)
