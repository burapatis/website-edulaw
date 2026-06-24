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

## รายงานปัญหาและข้อเสนอแนะ

### ผู้ใช้ทั่วไป

ไปที่หน้า **[แจ้งข้อผิดพลาดและเสนอแนะ](https://burapatis.github.io/website-edulaw/feedback/)** บนเว็บไซต์ — เลือกแบบฟอร์ม Google (เมื่อเปิดใช้) หรืออ่านคำแนะนำ

จากหน้ากฎหมายใดๆ กด **「แจ้งข้อผิดพลาดหรือเสนอแหล่งข้อมูล」** ด้านล่างเนื้อหา

### ผู้ใช้ GitHub

เปิด Issue ด้วยเทมเพลต:

- **แจ้งแก้ไขเนื้อหา** — ข้อมูลผิด ล้าสมัย ลิงก์เสีย
- **เสนอแหล่งข้อมูลหรือกฎหมายใหม่** — เอกสารทางการที่ควรเพิ่มในคลัง

[เลือกเทมเพลต Issue](https://github.com/burapatis/website-edulaw/issues/new/choose)

อ่านขั้นตอนผู้ดูแล: [docs/FEEDBACK_WORKFLOW.md](docs/FEEDBACK_WORKFLOW.md)

### สิ่งที่ควรระบุ

- URL หรือชื่อหน้าที่เกี่ยวข้อง
- รายละเอียดที่ควรแก้ไข (กระชับ)
- แหล่งทางการที่อ้างอิง (ถ้ามี)

### สิ่งที่ไม่ควรส่ง

- ข้อมูลส่วนบุคคลที่ไม่จำเป็น (เลขประชาชน ข้อมูลสุขภาพ ข้อมูลเด็ก รายละเอียดคดี)
- คำขอคำปรึกษาทางกฎหมายเฉพาะกรณี — เว็บไซต์จัดทำเพื่อการศึกษาเบื้องต้น

## การเสนอ Pull Request

1. Fork / branch จาก `main`
2. แก้ `data/laws.json` หรือไฟล์ที่เกี่ยวข้อง — **ต้องมีแหล่งทางการ**
3. รัน `npm run check:content` และ `npm run build:search`
4. อัปเดต `SOURCE_REVIEW_LOG.md` ถ้าเปลี่ยนแหล่งหรือเนื้อหาสำคัญ
5. เปิด PR อธิบายแหล่งที่ใช้ตรวจ — **ห้ามสร้างข้อเท็จจริงทางกฎหมาย**

## เอกสารอ้างอิง

- [docs/README.md](docs/README.md) — ดัชนีเอกสาร
- [docs/LAW_METADATA_GUIDE.md](docs/LAW_METADATA_GUIDE.md)
- [docs/QUALITY_CHECKS.md](docs/QUALITY_CHECKS.md)
