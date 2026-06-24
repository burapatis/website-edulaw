# แนวทางร่วมพัฒนา (Contributing)

ขอบคุณที่สนใจช่วยพัฒนา **Education Law Hub** — คลังความรู้กฎหมายการศึกษาไทยเพื่อการศึกษาและค้นคว้าเบื้องต้น

## วัตถุประสงค์โปรเจกต์

รวบรวม จัดระบบ และสรุปกฎหมายการศึกษาไทยที่น่าสนใจให้เข้าถึงง่าย พร้อมเครื่องมือค้นหา แบบทดสอบ และเส้นทางการเรียนรู้ — **ไม่ใช่** บริการให้คำปรึกษากฎหมาย

## สิ่งที่ช่วยได้

- เพิ่ม/ปรับสรุปกฎหมายใน `data/laws.json` (พร้อมแหล่งทางการ)
- แก้ metadata, tags, audiences
- ปรับปรุงเอกสารใน `docs/`
- แก้ bug UI, การค้นหา, แบบทดสอบ
- รายงานลิงก์เสียหรือข้อมูลล้าสมัยผ่าน Issues

## กฎความน่าเชื่อถือทางกฎหมาย

1. **ห้ามสร้างข้อเท็จจริงทางกฎหมาย** หรือเดา `source_url`
2. **ห้ามอ้าง** ว่าเนื้อหาครบถ้วน เป็นฉบับล่าสุดแน่นอน หรือใช้แทนคำปรึกษากฎหมาย
3. ใช้แหล่งทางการก่อน: ราชกิจจานุเบกษา, กฤษฎีกา, หน่วยงานรัฐ
4. แยกชัด **สรุปเพื่อการเรียนรู้** กับ **ตัวบทฉบับทางการ**
5. บันทึกการตรวจแหล่งใน [SOURCE_REVIEW_LOG.md](SOURCE_REVIEW_LOG.md)

## วิธีเพิ่มหรือแก้กฎหมาย

**วิธีหลัก:** แก้ `data/laws.json` แล้วทดสอบ — หน้าถูกสร้างโดย `content/laws/_content.gotmpl`

**วิธีรอง:** `hugo new laws/<id>.md` (ใช้ `archetypes/laws.md`)

อ่านขั้นตอนเต็ม: [docs/CONTENT_EXPANSION_WORKFLOW.md](docs/CONTENT_EXPANSION_WORKFLOW.md)

## รันในเครื่อง

```bash
npm install
npm run dev
```

เปิด http://localhost:1313/website-edulaw/

```bash
npm run check:content        # ตรวจ metadata (ล้มเหลวถ้า critical)
npm run check:content:full   # รายงานเพิ่มเติม (ไม่ทำให้ล้มเหลวมากขึ้น)
npm run build:search         # Hugo + Pagefind
```

## การตรวจก่อนส่ง PR

1. `npm run check:content` — ต้องผ่าน (0 critical)
2. `npm run build:search` — build สำเร็จ
3. ตรวจหน้า `/laws/<id>/` และ metadata card
4. อ่าน [LEGAL_REVIEW_CHECKLIST.md](LEGAL_REVIEW_CHECKLIST.md)
5. อัปเดต `SOURCE_REVIEW_LOG.md` ถ้าเปลี่ยนแหล่งข้อมูล

## การเสนอแก้ไข

1. Fork / branch จาก `main`
2. Commit ข้อความชัดเจนเป็นภาษาไทยหรืออังกฤษ
3. เปิด Pull Request อธิบายว่าเปลี่ยนอะไร และแหล่งที่ใช้ตรวจ
4. ระบุว่าต้องมีผู้ทราบกฎหมายตรวจเนื้อหาหรือไม่

## รายงานปัญหา

เปิด GitHub Issue ระบุ:

- URL หน้าที่เกี่ยวข้อง
- สิ่งที่คาดหวัง vs ที่พบ
- แหล่งทางการที่อ้างอิง (ถ้ามี)

## เอกสารอ้างอิง

- [docs/README.md](docs/README.md) — ดัชนีเอกสาร
- [docs/LAW_METADATA_GUIDE.md](docs/LAW_METADATA_GUIDE.md)
- [docs/QUALITY_CHECKS.md](docs/QUALITY_CHECKS.md)
