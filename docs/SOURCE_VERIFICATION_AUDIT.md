# รายงานตรวจสอบแหล่งข้อมูลกฎหมาย (Source Verification Audit)

> เอกสารนี้ **สร้างอัตโนมัติ** ด้วย `npm run audit:sources` — อย่าแก้ด้วยมือ
> ใช้เป็นฐานข้อมูลสำหรับการตรวจแหล่งทางการด้วยมือ ไม่ใช่การยืนยันความถูกต้องทางกฎหมาย

- วันที่สร้างรายงาน: 2026-06-26
- แหล่งข้อมูล: `data/laws.json` (หน้ากฎหมายสร้างจากคลังนี้ + `content/laws/_content.gotmpl`)
- จำนวนหน้ากฎหมายทั้งหมด: **43**
- ค่าวันที่ตรวจเชิงโครงสร้าง (default จาก gotmpl): 2026-06-24

## สรุปสถานะการตรวจสอบ

| verification_status | ความหมาย | จำนวน |
|---------------------|----------|------:|
| `verified_official_source` | ตรวจสอบแหล่งข้อมูลทางการแล้ว (ฟิลด์ครบเชิงโครงสร้าง) | 43 |
| `needs_source_url` | อยู่ระหว่างตรวจสอบแหล่งข้อมูล (ต้องการลิงก์ทางการเฉพาะฉบับ) | 0 |
| `needs_official_source_review` | อยู่ระหว่างตรวจสอบแหล่งข้อมูล (ต้องทบทวน official_source) | 0 |
| `needs_status_review` | อยู่ระหว่างตรวจสอบแหล่งข้อมูล (ต้องทบทวนสถานะ) | 0 |
| `needs_last_checked` | อยู่ระหว่างตรวจสอบแหล่งข้อมูล (ต้องระบุวันที่ตรวจล่าสุด) | 0 |
| `pending_manual_review` | รอการตรวจสอบด้วยมือ | 0 |

### สรุปแหล่งข้อมูล

- มี `source_url` ระบุชัดเจนใน data: **43**
- มีเฉพาะลิงก์ราชกิจจานุเบกษาแบบหน้าหลัก (ยังไม่ใช่ลิงก์เฉพาะฉบับ): **0**
- ไม่มีลิงก์แหล่งข้อมูลเลย: **0**
- `official_source` เป็น placeholder: **0**
- ไม่มี `last_checked` ระบุชัดใน data: **0**
- หน้า P1/P2 ที่ยังต้องตรวจด้วยมือ: **0**

> หมายเหตุสำคัญ: การมีลิงก์ "ราชกิจจานุเบกษา" แบบหน้าหลัก (`https://ratchakitcha.soc.go.th`)
> ยัง **ไม่นับ** เป็นแหล่งข้อมูลที่ยืนยันได้ เพราะไม่ได้ชี้ไปยังตัวบทฉบับนั้นโดยตรง
> ต้องให้ผู้ตรวจหา deep link ของฉบับจริงและบันทึกใน `SOURCE_REVIEW_LOG.md`

## ตารางตรวจสอบรายฉบับ

| ไฟล์/หน้า | ชื่อกฎหมาย | law_type | ปี | หน่วยงาน | source_url | official_source | last_checked | status | verification_status | priority |
|-----------|-----------|----------|----|----------|-----------|-----------------|--------------|--------|---------------------|:--------:|
| `data/laws.json#const-2560` | รัฐธรรมนูญแห่งราชอาณาจักรไทย พุทธศักราช 2560 (หมวดสิทธิด้านการศึกษา) | รัฐธรรมนูญ | พ.ศ. 2560 | รัฐสภา | `https://www.ratchakitcha.soc.go.th/DATA/PDF/2560/A/040/1.PDF` | ราชกิจจานุเบกษา | 2026-06-25 | บังคับใช้ | `verified_official_source` | P1 |
| `data/laws.json#nea-2542` | พระราชบัญญัติการศึกษาแห่งชาติ พ.ศ. 2542 และที่แก้ไขเพิ่มเติม | พระราชบัญญัติ | พ.ศ. 2542 · แก้ไขเพิ่มเติม พ.ศ. 2545, 2553, 2562 | สำนักงานเลขาธิการสภาการศึกษา (สกศ.) | `https://ratchakitcha.soc.go.th/documents/1708862.pdf` | ราชกิจจานุเบกษา | 2026-06-25 | บังคับใช้ | `verified_official_source` | P1 |
| `data/laws.json#compulsory-2545` | พระราชบัญญัติการศึกษาภาคบังคับ พ.ศ. 2545 | พระราชบัญญัติ | พ.ศ. 2545 | สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.) | `https://ops.moe.go.th/%E0%B8%9E%E0%B8%A3%E0%B8%9A-%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%A8%E0%B8%B6%E0%B8%81%E0%B8%A9%E0%B8%B2%E0%B8%A0%E0%B8%B2%E0%B8%84%E0%B8%9A%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%B1%E0%B8%9A/` | ราชกิจจานุเบกษา | 2026-06-24 | บังคับใช้ | `verified_official_source` | P1 |
| `data/laws.json#ecd-2562` | พระราชบัญญัติการพัฒนาเด็กปฐมวัย พ.ศ. 2562 | พระราชบัญญัติ | พ.ศ. 2562 | กรมกิจการเด็กและเยาวชน / กระทรวงศึกษาธิการ | `https://www.ratchakitcha.soc.go.th/DATA/PDF/2562/A/056/T_0005.PDF` | ราชกิจจานุเบกษา | 2026-06-25 | บังคับใช้ | `verified_official_source` | P2 |
| `data/laws.json#innovation-area-2562` | พระราชบัญญัติพื้นที่นวัตกรรมการศึกษา พ.ศ. 2562 | พระราชบัญญัติ | พ.ศ. 2562 | สำนักงานบริหารพื้นที่นวัตกรรมการศึกษา กระทรวงศึกษาธิการ | `https://ratchakitcha.soc.go.th/documents/17087271.pdf` | ราชกิจจานุเบกษา | 2026-06-25 | บังคับใช้ | `verified_official_source` | P2 |
| `data/laws.json#learning-promote-2566` | พระราชบัญญัติส่งเสริมการเรียนรู้ พ.ศ. 2566 | พระราชบัญญัติ | พ.ศ. 2566 | กรมส่งเสริมการเรียนรู้ (สกร.) | `https://ops.moe.go.th/wp-content/uploads/2023/04/%E0%B8%9E.%E0%B8%A3.%E0%B8%9A.%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B9%80%E0%B8%AA%E0%B8%A3%E0%B8%B4%E0%B8%A1%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%A3%E0%B8%B9%E0%B9%89-%E0%B8%9E.%E0%B8%A8.-2566.pdf` | สำนักงานปลัดกระทรวงศึกษาธิการ | 2026-06-25 | บังคับใช้ | `verified_official_source` | P2 |
| `data/laws.json#moe-admin-2546` | พระราชบัญญัติระเบียบบริหารราชการกระทรวงศึกษาธิการ พ.ศ. 2546 และที่แก้ไขเพิ่มเติม | พระราชบัญญัติ | พ.ศ. 2546 · แก้ไขเพิ่มเติม พ.ศ. 2553, 2562 | สำนักงานปลัดกระทรวงศึกษาธิการ | `https://www.moe.go.th/%E0%B8%9E%E0%B8%A3%E0%B8%9A-%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B8%A2%E0%B8%9A%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%81%E0%B8%B2%E0%B8%A3/` | กระทรวงศึกษาธิการ | 2026-06-25 | บังคับใช้ | `verified_official_source` | P1 |
| `data/laws.json#ohes-2562` | พระราชบัญญัติระเบียบบริหารราชการกระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม พ.ศ. 2562 | พระราชบัญญัติ | พ.ศ. 2562 | กระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม (อว.) | `https://www.ops.go.th/th/legal-info/82-act/5807-2562-2` | สำนักงานปลัดกระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม | 2026-06-25 | บังคับใช้ | `verified_official_source` | P2 |
| `data/laws.json#vocational-2551` | พระราชบัญญัติการอาชีวศึกษา พ.ศ. 2551 | พระราชบัญญัติ | พ.ศ. 2551 | สำนักงานคณะกรรมการการอาชีวศึกษา (สอศ.) | `https://www.moe.go.th/backend/wp-content/uploads/2020/10/1.-%E0%B8%9E%E0%B8%A3%E0%B8%9A.-%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AD%E0%B8%B2%E0%B8%8A%E0%B8%B5%E0%B8%A7%E0%B8%A8%E0%B8%B6%E0%B8%81%E0%B8%A9%E0%B8%B2-2551.pdf` | กระทรวงศึกษาธิการ | 2026-06-25 | บังคับใช้ | `verified_official_source` | P1 |
| `data/laws.json#teacher-civil-2547` | พระราชบัญญัติระเบียบข้าราชการครูและบุคลากรทางการศึกษา พ.ศ. 2547 และที่แก้ไขเพิ่มเติม | พระราชบัญญัติ | พ.ศ. 2547 · แก้ไขเพิ่มเติมหลายฉบับ ล่าสุด พ.ศ. 2562 | สำนักงานคณะกรรมการข้าราชการครูและบุคลากรทางการศึกษา (สำนักงาน ก.ค.ศ.) | `https://www.otepc.go.th/images/00_YEAR2562/09_PG/act-teacher-1-2547.PDF` | สำนักงาน ก.ค.ศ. | 2026-06-25 | บังคับใช้ | `verified_official_source` | P1 |
| `data/laws.json#teacher-council-2546` | พระราชบัญญัติสภาครูและบุคลากรทางการศึกษา พ.ศ. 2546 | พระราชบัญญัติ | พ.ศ. 2546 | สำนักงานเลขาธิการคุรุสภา | `https://www.moe.go.th/backend/wp-content/uploads/2020/10/1.-%E0%B8%9E%E0%B8%A3%E0%B8%9A.-%E0%B8%AA%E0%B8%A0%E0%B8%B2%E0%B8%84%E0%B8%A3%E0%B8%B9.pdf` | กระทรวงศึกษาธิการ | 2026-06-26 | บังคับใช้ | `verified_official_source` | P1 |
| `data/laws.json#teacher-salary-2547` | พระราชบัญญัติเงินเดือน เงินวิทยฐานะ และเงินประจำตำแหน่งข้าราชการครูและบุคลากรทางการศึกษา พ.ศ. 2547 | พระราชบัญญัติ | พ.ศ. 2547 | กระทรวงการคลัง / สำนักงาน ก.ค.ศ. | `https://www.moe.go.th/backend/wp-content/uploads/2020/10/1.-%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%94%E0%B8%B7%E0%B8%AD%E0%B8%99.pdf` | กระทรวงศึกษาธิการ | 2026-06-25 | บังคับใช้ | `verified_official_source` | P2 |
| `data/laws.json#univ-civil-2547` | พระราชบัญญัติระเบียบข้าราชการพลเรือนในสถาบันอุดมศึกษา พ.ศ. 2547 และที่แก้ไขเพิ่มเติม | พระราชบัญญัติ | พ.ศ. 2547 · แก้ไขเพิ่มเติมหลายฉบับ | สำนักงานปลัดกระทรวงการอุดมศึกษาฯ | `https://mhesi.nrct.go.th/archives/s/mhesi_archives/item/317` | กระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม (อว.) | 2026-06-25 | บังคับใช้ | `verified_official_source` | P2 |
| `data/laws.json#private-school-2550` | พระราชบัญญัติโรงเรียนเอกชน พ.ศ. 2550 และที่แก้ไขเพิ่มเติม (ฉบับที่ 2) พ.ศ. 2554 | พระราชบัญญัติ | พ.ศ. 2550 · แก้ไขเพิ่มเติม พ.ศ. 2554 | สำนักงานคณะกรรมการส่งเสริมการศึกษาเอกชน (สช.) | `https://ops.moe.go.th/wp-content/uploads/2017/09/09-%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%9A%E0%B8%B1%E0%B8%8D%E0%B8%8D%E0%B8%B1%E0%B8%95%E0%B8%B4%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%8A%E0%B8%99-%E0%B8%89%E0%B8%9A%E0%B8%B1%E0%B8%9A%E0%B8%97%E0%B8%B5%E0%B9%88-2-%E0%B8%9E.%E0%B8%A8.-2554-1.pdf` | สำนักงานปลัดกระทรวงศึกษาธิการ | 2026-06-25 | บังคับใช้ | `verified_official_source` | P1 |
| `data/laws.json#disability-edu-2551` | พระราชบัญญัติการจัดการศึกษาสำหรับคนพิการ พ.ศ. 2551 | พระราชบัญญัติ | พ.ศ. 2551 | สำนักบริหารงานการศึกษาพิเศษ สพฐ. | `https://ops.moe.go.th/wp-content/uploads/2023/03/1.-%E0%B8%9E%E0%B8%A3%E0%B8%9A.-%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%88%E0%B8%B1%E0%B8%94%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%A8%E0%B8%B6%E0%B8%81%E0%B8%A9%E0%B8%B2-%E0%B8%891.pdf` | สำนักงานปลัดกระทรวงศึกษาธิการ | 2026-06-25 | บังคับใช้ | `verified_official_source` | P2 |
| `data/laws.json#child-protect-2546` | พระราชบัญญัติคุ้มครองเด็ก พ.ศ. 2546 | พระราชบัญญัติ | พ.ศ. 2546 | กรมกิจการเด็กและเยาวชน กระทรวงการพัฒนาสังคมและความมั่นคงของมนุษย์ | `https://dep.go.th/images/uploads/Downloads/pdf/888_08.pdf` | กรมส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการ (เผยแพร่เอกสาร) | 2026-06-25 | บังคับใช้ | `verified_official_source` | P1 |
| `data/laws.json#eef-2561` | พระราชบัญญัติกองทุนเพื่อความเสมอภาคทางการศึกษา พ.ศ. 2561 | พระราชบัญญัติ | พ.ศ. 2561 | กองทุนเพื่อความเสมอภาคทางการศึกษา (กสศ.) | `https://www.ratchakitcha.soc.go.th/DATA/PDF/2561/A/033/1.PDF` | ราชกิจจานุเบกษา | 2026-06-25 | บังคับใช้ | `verified_official_source` | P2 |
| `data/laws.json#sla-2560` | พระราชบัญญัติกองทุนเงินให้กู้ยืมเพื่อการศึกษา พ.ศ. 2560 | พระราชบัญญัติ | พ.ศ. 2560 | กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.) | `https://www.studentloan.or.th/th/system/files/files/knowledge/1.1-20173001.pdf` | กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.) | 2026-06-25 | บังคับใช้ | `verified_official_source` | P2 |
| `data/laws.json#age-counting-2545` | กฎกระทรวงกำหนดหลักเกณฑ์และวิธีการนับอายุเด็กเพื่อเข้ารับการศึกษาภาคบังคับ พ.ศ. 2545 | กฎกระทรวง | พ.ศ. 2545 | กระทรวงศึกษาธิการ | `https://backoffice.onec.go.th/uploaded/Category/Laws/PDF/0301-a.pdf` | สำนักงานเลขาธิการสภาการศึกษา (สกศ.) | 2026-06-25 | บังคับใช้ | `verified_official_source` | P3 |
| `data/laws.json#punishment-rule-2548` | ระเบียบกระทรวงศึกษาธิการว่าด้วยการลงโทษนักเรียนและนักศึกษา พ.ศ. 2548 | ระเบียบกระทรวง | พ.ศ. 2548 | กระทรวงศึกษาธิการ | `https://www.moe.go.th/backend/wp-content/uploads/2020/12/4.-%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B8%A2%E0%B8%9A-%E0%B8%A8%E0%B8%98.-%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%A5%E0%B8%87%E0%B9%82%E0%B8%97%E0%B8%A9.pdf` | กระทรวงศึกษาธิการ | 2026-06-25 | บังคับใช้ | `verified_official_source` | P2 |
| `data/laws.json#nea-draft` | ร่างพระราชบัญญัติการศึกษาแห่งชาติ พ.ศ. .... (ฉบับปรับปรุงใหม่) | ร่างกฎหมาย | อยู่ระหว่างกระบวนการนิติบัญญัติ | รัฐสภา / กระทรวงศึกษาธิการ | `https://www.parliament.go.th/section77/manage/files/file_20260515022936_1_564.pdf` | รัฐสภาไทย | 2026-06-25 | อยู่ระหว่างพิจารณา | `verified_official_source` | P2 |
| `data/laws.json#higher-ed-2562` | พระราชบัญญัติการอุดมศึกษา พ.ศ. 2562 | พระราชบัญญัติ | พ.ศ. 2562 | กระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม (อว.) | `https://www.ratchakitcha.soc.go.th/DATA/PDF/2562/A/057/T_0054.PDF` | ราชกิจจานุเบกษา | 2026-06-25 | บังคับใช้ | `verified_official_source` | P1 |
| `data/laws.json#pdpa-2562` | พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (ที่เกี่ยวข้องกับสถานศึกษา) | พระราชบัญญัติ | พ.ศ. 2562 · บังคับใช้ 1 มิ.ย. 2565 | สำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.) | `https://www.ratchakitcha.soc.go.th/DATA/PDF/2562/A/069/T_0052.PDF` | ราชกิจจานุเบกษา | 2026-06-25 | บังคับใช้ | `verified_official_source` | P2 |
| `data/laws.json#osh-2554` | พระราชบัญญัติความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน พ.ศ. 2554 (สถานศึกษา) | พระราชบัญญัติ | พ.ศ. 2554 | กรมสวัสดิการและคุ้มครองแรงงาน / สถานศึกษา (นายจ้าง) | `https://www.tosh.or.th/images/file/2016/osh-act.b.e.2554.pdf` | สถาบันส่งเสริมความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน (สสปท.) | 2026-06-25 | บังคับใช้ | `verified_official_source` | P2 |
| `data/laws.json#budget-procedure-2561` | พระราชบัญญัติวิธีการงบประมาณ พ.ศ. 2561 (ที่เกี่ยวข้องกับสถานศึกษา) | พระราชบัญญัติ | พ.ศ. 2561 | กระทรวงการคลัง / หน่วยงานของรัฐรวมถึงสถานศึกษา | `https://www.ratchakitcha.soc.go.th/DATA/PDF/2561/A/092/1.PDF` | ราชกิจจานุเบกษา | 2026-06-26 | บังคับใช้ | `verified_official_source` | P3 |
| `data/laws.json#procurement-2560` | พระราชบัญญัติการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. 2560 | พระราชบัญญัติ | พ.ศ. 2560 · แก้ไขเพิ่มเติมหลายฉบับ | กรมบัญชีกลาง / สถานศึกษาและหน่วยงานการศึกษา | `https://www.ratchakitcha.soc.go.th/DATA/PDF/2560/A/024/13.PDF` | ราชกิจจานุเบกษา | 2026-06-26 | บังคับใช้ | `verified_official_source` | P3 |
| `data/laws.json#disabled-welfare-2550` | พระราชบัญญัติส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการ พ.ศ. 2550 | พระราชบัญญัติ | พ.ศ. 2550 · แก้ไขเพิ่มเติม | กรมส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการ / สถานศึกษา | `https://omhc.dmh.go.th/law/files/%E0%B8%9E%E0%B8%A3%E0%B8%9A.%E0%B8%AA%E0%B8%87%E0%B9%80%E0%B8%AA%E0%B8%A3%E0%B8%B4%E0%B8%A1%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9E%E0%B8%B1%E0%B8%92%E0%B8%99%E0%B8%B2%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%8A%E0%B8%B5%E0%B8%A7%E0%B8%B4%E0%B8%95%E0%B8%84%E0%B8%99%E0%B8%9E%E0%B8%B4%E0%B8%81%E0%B8%B2%E0%B8%A3-%E0%B8%9E.%E0%B8%A8.2550.pdf` | กรมสุขภาพจิต (เผยแพร่เอกสาร) | 2026-06-25 | บังคับใช้ | `verified_official_source` | P2 |
| `data/laws.json#labor-protection-2541` | พระราชบัญญัติคุ้มครองแรงงาน พ.ศ. 2541 (ลูกจ้างสถานศึกษาเอกชน) | พระราชบัญญัติ | พ.ศ. 2541 · แก้ไขเพิ่มเติมหลายฉบับ | กระทรวงแรงงาน / โรงเรียนเอกชนและสถานศึกษาที่จ้างลูกจ้าง | `https://www.ratchakitcha.soc.go.th/DATA/PDF/2541/A/008/1.PDF` | ราชกิจจานุเบกษา | 2026-06-25 | บังคับใช้ | `verified_official_source` | P3 |
| `data/laws.json#local-edu-2542` | บทบัญญัติเกี่ยวกับการจัดการศึกษาท้องถิ่น (ตาม พ.ร.บ.การศึกษาแห่งชาติ) | บทบัญญัติใน พ.ร.บ. | พ.ศ. 2542 · ปรับปรุงตามฉบับแก้ไข | องค์กรปกครองส่วนท้องถิ่น / สพฐ. | `https://www.moe.go.th/backend/wp-content/uploads/2020/10/1.-%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%9A%E0%B8%B1%E0%B8%8D%E0%B8%8D%E0%B8%B1%E0%B8%95%E0%B8%B4%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%A8%E0%B8%B6%E0%B8%81%E0%B8%A9%E0%B8%B2%E0%B9%81%E0%B8%AB%E0%B9%88%E0%B8%87%E0%B8%8A%E0%B8%B2%E0%B8%95%E0%B8%B4-%E0%B8%9E.%E0%B8%A8.2542-%E0%B8%89.%E0%B8%AD%E0%B8%B1%E0%B8%9E%E0%B9%80%E0%B8%94%E0%B8%97.pdf` | กระทรวงศึกษาธิการ | 2026-06-26 | บังคับใช้ | `verified_official_source` | P3 |
| `data/laws.json#youth-protection-2551` | พระราชบัญญัติส่งเสริมและพัฒนาคุณภาพชีวิตเด็กและเยาวชน พ.ศ. 2551 | พระราชบัญญัติ | พ.ศ. 2551 | กรมกิจการเด็กและเยาวชน | `https://siythailand.org/wp-content/uploads/2020/10/law_th_20172507204615_1.pdf` | เอกสารเผยแพร่ (ควรยืนยันกับราชกิจจานุเบกษา) | 2026-06-25 | บังคับใช้ | `verified_official_source` | P2 |
| `data/laws.json#private-univ-2546` | พระราชบัญญัติสถาบันอุดมศึกษาเอกชน พ.ศ. 2546 และที่แก้ไขเพิ่มเติม | พระราชบัญญัติ | พ.ศ. 2546 · แก้ไขเพิ่มเติม (ฉบับที่ 2) พ.ศ. 2550 และ (ฉบับที่ 3) พ.ศ. 2562 | กระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม (อว.) | `https://mhesi.nrct.go.th/archives/s/mhesi_archives/item/397` | คลังจดหมายเหตุดิจิทัล กระทรวง อว. | 2026-06-26 | บังคับใช้ | `verified_official_source` | P2 |
| `data/laws.json#student-uniform-2551` | พระราชบัญญัติเครื่องแบบนักเรียน พ.ศ. 2551 | พระราชบัญญัติ | พ.ศ. 2551 | กระทรวงศึกษาธิการ | `https://ops.moe.go.th/wp-content/uploads/2023/03/1.-%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%9A%E0%B8%B1%E0%B8%8D%E0%B8%8D%E0%B8%B1%E0%B8%95%E0%B8%B4%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99-%E0%B8%9E.%E0%B8%A8.-%E0%B9%92%E0%B9%95%E0%B9%95%E0%B9%91.pdf` | สำนักงานปลัดกระทรวงศึกษาธิการ | 2026-06-26 | บังคับใช้ | `verified_official_source` | P3 |
| `data/laws.json#scout-2551` | พระราชบัญญัติลูกเสือ พ.ศ. 2551 | พระราชบัญญัติ | พ.ศ. 2551 | กระทรวงศึกษาธิการ / สำนักงานลูกเสือแห่งชาติ | `https://backoffice.onec.go.th/uploaded/Category/Laws/Act/acteng/01/0101-j-510331.pdf` | สำนักงานเลขาธิการสภาการศึกษา (สกศ.) | 2026-06-26 | บังคับใช้ | `verified_official_source` | P3 |
| `data/laws.json#vocational-institute-2555` | พระราชบัญญัติสถาบันการอาชีวศึกษา พ.ศ. 2555 | พระราชบัญญัติ | พ.ศ. 2555 | สำนักงานคณะกรรมการการอาชีวศึกษา (สอศ.) | `https://old.parliament.go.th/ewtcommittee/ewt/25join_nationaleducation/ewt_dl_link.php?nid=271&filename=index` | รัฐสภา (เอกสารเผยแพร่ — ควรยืนยันกับราชกิจจานุเบกษา) | 2026-06-26 | บังคับใช้ | `verified_official_source` | P2 |
| `data/laws.json#hesi-policy-council-2562` | พระราชบัญญัติสภานโยบายการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรมแห่งชาติ พ.ศ. 2562 | พระราชบัญญัติ | พ.ศ. 2562 | สภานโยบายการอุดมศึกษาฯ / กระทรวง อว. | `https://db.legal.tu.ac.th/wp-content/uploads/2022/08/%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%9A%E0%B8%B1%E0%B8%8D%E0%B8%8D%E0%B8%B1%E0%B8%95%E0%B8%B4%E0%B8%AA%E0%B8%A0%E0%B8%B2%E0%B8%99%E0%B9%82%E0%B8%A2%E0%B8%9A%E0%B8%B2%E0%B8%A2%E0%B8%AD%E0%B8%B8%E0%B8%94%E0%B8%A1%E0%B8%A8%E0%B8%B6%E0%B8%81%E0%B8%A9%E0%B8%B2-%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-%E0%B8%A7%E0%B8%B4%E0%B8%88%E0%B8%B1%E0%B8%A2-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%99%E0%B8%A7%E0%B8%B1%E0%B8%95%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B9%81%E0%B8%AB%E0%B9%88%E0%B8%87%E0%B8%8A%E0%B8%B2%E0%B8%95%E0%B8%B4-%E0%B8%9E.%E0%B8%A8.-2562.pdf` | ฐานข้อมูลกฎหมาย ม.ธรรมศาสตร์ (เผยแพร่ — ควรยืนยันกับราชกิจจานุเบกษา) | 2026-06-26 | บังคับใช้ | `verified_official_source` | P2 |
| `data/laws.json#rajabhat-2547` | พระราชบัญญัติมหาวิทยาลัยราชภัฏ พ.ศ. 2547 | พระราชบัญญัติ | พ.ศ. 2547 | กระทรวง อว. / มหาวิทยาลัยราชภัฏ | `https://prt.parliament.go.th/items/8bd4ab86-c135-40ff-a746-2ca96a95982e` | คลังสารสนเทศ สำนักงานเลขาธิการสภาผู้แทนราษฎร | 2026-06-26 | บังคับใช้ | `verified_official_source` | P2 |
| `data/laws.json#rmut-2548` | พระราชบัญญัติมหาวิทยาลัยเทคโนโลยีราชมงคล พ.ศ. 2548 | พระราชบัญญัติ | พ.ศ. 2548 | กระทรวง อว. / มหาวิทยาลัยเทคโนโลยีราชมงคล | `https://mhesi.nrct.go.th/archives/s/mhesi_archives/item/393` | คลังจดหมายเหตุดิจิทัล กระทรวง อว. | 2026-06-26 | บังคับใช้ | `verified_official_source` | P2 |
| `data/laws.json#community-college-2558` | พระราชบัญญัติสถาบันวิทยาลัยชุมชน พ.ศ. 2558 | พระราชบัญญัติ | พ.ศ. 2558 | กระทรวง อว. / สถาบันวิทยาลัยชุมชน | `https://www.ratchakitcha.soc.go.th/DATA/PDF/2558/A/030/1.PDF` | ราชกิจจานุเบกษา | 2026-06-26 | บังคับใช้ | `verified_official_source` | P2 |
| `data/laws.json#icescr` | กติการะหว่างประเทศว่าด้วยสิทธิทางเศรษฐกิจ สังคม และวัฒนธรรม (ICESCR) — โดยเฉพาะข้อ 13–14 | สนธิสัญญาระหว่างประเทศ | ค.ศ. 1966 · ไทยภาคยานุวัติ 5 ก.ย. 1999 | องค์การสหประชาชาติ (UN) | `https://treaties.un.org/Pages/ViewDetails.aspx?src=TREATY&mtdsg_no=IV-3&chapter=4&clang=_en` | UN Treaty Collection | 2026-06-26 | ไทยเป็นภาคี | `verified_official_source` | P2 |
| `data/laws.json#crc` | อนุสัญญาว่าด้วยสิทธิเด็ก (CRC) — โดยเฉพาะข้อ 28–29 | สนธิสัญญาระหว่างประเทศ | ค.ศ. 1989 · ไทยภาคยานุวัติ 27 มี.ค. 1992 | องค์การสหประชาชาติ (UN) | `https://treaties.un.org/Pages/ViewDetails.aspx?src=TREATY&mtdsg_no=IV-11&chapter=4&clang=_en` | UN Treaty Collection | 2026-06-26 | ไทยเป็นภาคี | `verified_official_source` | P2 |
| `data/laws.json#crpd` | อนุสัญญาว่าด้วยสิทธิคนพิการ (CRPD) — โดยเฉพาะข้อ 24 เรื่องการศึกษา | สนธิสัญญาระหว่างประเทศ | ค.ศ. 2006 · มีผลใช้บังคับ 3 พ.ค. 2008 · ไทยให้สัตยาบัน 29 ก.ค. 2008 | องค์การสหประชาชาติ (UN) | `https://treaties.un.org/Pages/ViewDetails.aspx?src=TREATY&mtdsg_no=IV-15&chapter=4&clang=_en` | UN Treaty Collection | 2026-06-26 | ไทยเป็นภาคี | `verified_official_source` | P2 |
| `data/laws.json#cedaw` | อนุสัญญาว่าด้วยการขจัดการเลือกปฏิบัติต่อสตรีในทุกรูปแบบ (CEDAW) — โดยเฉพาะข้อ 10 ความเสมอภาคทางการศึกษา | สนธิสัญญาระหว่างประเทศ | ค.ศ. 1979 · ไทยภาคยานุวัติ 9 ส.ค. 1985 | องค์การสหประชาชาติ (UN) | `https://treaties.un.org/Pages/ViewDetails.aspx?src=TREATY&mtdsg_no=IV-8&chapter=4&clang=_en` | UN Treaty Collection | 2026-06-26 | ไทยเป็นภาคี | `verified_official_source` | P2 |
| `data/laws.json#icerd` | อนุสัญญาว่าด้วยการขจัดการเลือกปฏิบัติทางเชื้อชาติในทุกรูปแบบ (ICERD) — โดยเฉพาะข้อ 5(e)(v) และข้อ 7 | สนธิสัญญาระหว่างประเทศ | ค.ศ. 1965 · ไทยภาคยานุวัติ 28 ม.ค. 2003 | องค์การสหประชาชาติ (UN) | `https://treaties.un.org/Pages/ViewDetails.aspx?src=TREATY&mtdsg_no=IV-2&chapter=4&clang=_en` | UN Treaty Collection | 2026-06-26 | ไทยเป็นภาคี | `verified_official_source` | P2 |

## แหล่งข้อมูลที่ระบุชัดเจนใน data (source_url แบบเจาะจง)

- `const-2560` — รัฐธรรมนูญแห่งราชอาณาจักรไทย พุทธศักราช 2560 (หมวดสิทธิด้านการศึกษา)
  - source_url: https://www.ratchakitcha.soc.go.th/DATA/PDF/2560/A/040/1.PDF
  - official_source: ราชกิจจานุเบกษา
  - last_checked: 2026-06-25
- `nea-2542` — พระราชบัญญัติการศึกษาแห่งชาติ พ.ศ. 2542 และที่แก้ไขเพิ่มเติม
  - source_url: https://ratchakitcha.soc.go.th/documents/1708862.pdf
  - official_source: ราชกิจจานุเบกษา
  - last_checked: 2026-06-25
- `compulsory-2545` — พระราชบัญญัติการศึกษาภาคบังคับ พ.ศ. 2545
  - source_url: https://ops.moe.go.th/%E0%B8%9E%E0%B8%A3%E0%B8%9A-%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%A8%E0%B8%B6%E0%B8%81%E0%B8%A9%E0%B8%B2%E0%B8%A0%E0%B8%B2%E0%B8%84%E0%B8%9A%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%B1%E0%B8%9A/
  - official_source: ราชกิจจานุเบกษา
  - last_checked: 2026-06-24
- `ecd-2562` — พระราชบัญญัติการพัฒนาเด็กปฐมวัย พ.ศ. 2562
  - source_url: https://www.ratchakitcha.soc.go.th/DATA/PDF/2562/A/056/T_0005.PDF
  - official_source: ราชกิจจานุเบกษา
  - last_checked: 2026-06-25
- `innovation-area-2562` — พระราชบัญญัติพื้นที่นวัตกรรมการศึกษา พ.ศ. 2562
  - source_url: https://ratchakitcha.soc.go.th/documents/17087271.pdf
  - official_source: ราชกิจจานุเบกษา
  - last_checked: 2026-06-25
- `learning-promote-2566` — พระราชบัญญัติส่งเสริมการเรียนรู้ พ.ศ. 2566
  - source_url: https://ops.moe.go.th/wp-content/uploads/2023/04/%E0%B8%9E.%E0%B8%A3.%E0%B8%9A.%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B9%80%E0%B8%AA%E0%B8%A3%E0%B8%B4%E0%B8%A1%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%A3%E0%B8%B9%E0%B9%89-%E0%B8%9E.%E0%B8%A8.-2566.pdf
  - official_source: สำนักงานปลัดกระทรวงศึกษาธิการ
  - last_checked: 2026-06-25
- `moe-admin-2546` — พระราชบัญญัติระเบียบบริหารราชการกระทรวงศึกษาธิการ พ.ศ. 2546 และที่แก้ไขเพิ่มเติม
  - source_url: https://www.moe.go.th/%E0%B8%9E%E0%B8%A3%E0%B8%9A-%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B8%A2%E0%B8%9A%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%81%E0%B8%B2%E0%B8%A3/
  - official_source: กระทรวงศึกษาธิการ
  - last_checked: 2026-06-25
- `ohes-2562` — พระราชบัญญัติระเบียบบริหารราชการกระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม พ.ศ. 2562
  - source_url: https://www.ops.go.th/th/legal-info/82-act/5807-2562-2
  - official_source: สำนักงานปลัดกระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม
  - last_checked: 2026-06-25
- `vocational-2551` — พระราชบัญญัติการอาชีวศึกษา พ.ศ. 2551
  - source_url: https://www.moe.go.th/backend/wp-content/uploads/2020/10/1.-%E0%B8%9E%E0%B8%A3%E0%B8%9A.-%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AD%E0%B8%B2%E0%B8%8A%E0%B8%B5%E0%B8%A7%E0%B8%A8%E0%B8%B6%E0%B8%81%E0%B8%A9%E0%B8%B2-2551.pdf
  - official_source: กระทรวงศึกษาธิการ
  - last_checked: 2026-06-25
- `teacher-civil-2547` — พระราชบัญญัติระเบียบข้าราชการครูและบุคลากรทางการศึกษา พ.ศ. 2547 และที่แก้ไขเพิ่มเติม
  - source_url: https://www.otepc.go.th/images/00_YEAR2562/09_PG/act-teacher-1-2547.PDF
  - official_source: สำนักงาน ก.ค.ศ.
  - last_checked: 2026-06-25
- `teacher-council-2546` — พระราชบัญญัติสภาครูและบุคลากรทางการศึกษา พ.ศ. 2546
  - source_url: https://www.moe.go.th/backend/wp-content/uploads/2020/10/1.-%E0%B8%9E%E0%B8%A3%E0%B8%9A.-%E0%B8%AA%E0%B8%A0%E0%B8%B2%E0%B8%84%E0%B8%A3%E0%B8%B9.pdf
  - official_source: กระทรวงศึกษาธิการ
  - last_checked: 2026-06-26
- `teacher-salary-2547` — พระราชบัญญัติเงินเดือน เงินวิทยฐานะ และเงินประจำตำแหน่งข้าราชการครูและบุคลากรทางการศึกษา พ.ศ. 2547
  - source_url: https://www.moe.go.th/backend/wp-content/uploads/2020/10/1.-%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%94%E0%B8%B7%E0%B8%AD%E0%B8%99.pdf
  - official_source: กระทรวงศึกษาธิการ
  - last_checked: 2026-06-25
- `univ-civil-2547` — พระราชบัญญัติระเบียบข้าราชการพลเรือนในสถาบันอุดมศึกษา พ.ศ. 2547 และที่แก้ไขเพิ่มเติม
  - source_url: https://mhesi.nrct.go.th/archives/s/mhesi_archives/item/317
  - official_source: กระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม (อว.)
  - last_checked: 2026-06-25
- `private-school-2550` — พระราชบัญญัติโรงเรียนเอกชน พ.ศ. 2550 และที่แก้ไขเพิ่มเติม (ฉบับที่ 2) พ.ศ. 2554
  - source_url: https://ops.moe.go.th/wp-content/uploads/2017/09/09-%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%9A%E0%B8%B1%E0%B8%8D%E0%B8%8D%E0%B8%B1%E0%B8%95%E0%B8%B4%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%8A%E0%B8%99-%E0%B8%89%E0%B8%9A%E0%B8%B1%E0%B8%9A%E0%B8%97%E0%B8%B5%E0%B9%88-2-%E0%B8%9E.%E0%B8%A8.-2554-1.pdf
  - official_source: สำนักงานปลัดกระทรวงศึกษาธิการ
  - last_checked: 2026-06-25
- `disability-edu-2551` — พระราชบัญญัติการจัดการศึกษาสำหรับคนพิการ พ.ศ. 2551
  - source_url: https://ops.moe.go.th/wp-content/uploads/2023/03/1.-%E0%B8%9E%E0%B8%A3%E0%B8%9A.-%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%88%E0%B8%B1%E0%B8%94%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%A8%E0%B8%B6%E0%B8%81%E0%B8%A9%E0%B8%B2-%E0%B8%891.pdf
  - official_source: สำนักงานปลัดกระทรวงศึกษาธิการ
  - last_checked: 2026-06-25
- `child-protect-2546` — พระราชบัญญัติคุ้มครองเด็ก พ.ศ. 2546
  - source_url: https://dep.go.th/images/uploads/Downloads/pdf/888_08.pdf
  - official_source: กรมส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการ (เผยแพร่เอกสาร)
  - last_checked: 2026-06-25
- `eef-2561` — พระราชบัญญัติกองทุนเพื่อความเสมอภาคทางการศึกษา พ.ศ. 2561
  - source_url: https://www.ratchakitcha.soc.go.th/DATA/PDF/2561/A/033/1.PDF
  - official_source: ราชกิจจานุเบกษา
  - last_checked: 2026-06-25
- `sla-2560` — พระราชบัญญัติกองทุนเงินให้กู้ยืมเพื่อการศึกษา พ.ศ. 2560
  - source_url: https://www.studentloan.or.th/th/system/files/files/knowledge/1.1-20173001.pdf
  - official_source: กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.)
  - last_checked: 2026-06-25
- `age-counting-2545` — กฎกระทรวงกำหนดหลักเกณฑ์และวิธีการนับอายุเด็กเพื่อเข้ารับการศึกษาภาคบังคับ พ.ศ. 2545
  - source_url: https://backoffice.onec.go.th/uploaded/Category/Laws/PDF/0301-a.pdf
  - official_source: สำนักงานเลขาธิการสภาการศึกษา (สกศ.)
  - last_checked: 2026-06-25
- `punishment-rule-2548` — ระเบียบกระทรวงศึกษาธิการว่าด้วยการลงโทษนักเรียนและนักศึกษา พ.ศ. 2548
  - source_url: https://www.moe.go.th/backend/wp-content/uploads/2020/12/4.-%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B8%A2%E0%B8%9A-%E0%B8%A8%E0%B8%98.-%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%A5%E0%B8%87%E0%B9%82%E0%B8%97%E0%B8%A9.pdf
  - official_source: กระทรวงศึกษาธิการ
  - last_checked: 2026-06-25
- `nea-draft` — ร่างพระราชบัญญัติการศึกษาแห่งชาติ พ.ศ. .... (ฉบับปรับปรุงใหม่)
  - source_url: https://www.parliament.go.th/section77/manage/files/file_20260515022936_1_564.pdf
  - official_source: รัฐสภาไทย
  - last_checked: 2026-06-25
- `higher-ed-2562` — พระราชบัญญัติการอุดมศึกษา พ.ศ. 2562
  - source_url: https://www.ratchakitcha.soc.go.th/DATA/PDF/2562/A/057/T_0054.PDF
  - official_source: ราชกิจจานุเบกษา
  - last_checked: 2026-06-25
- `pdpa-2562` — พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (ที่เกี่ยวข้องกับสถานศึกษา)
  - source_url: https://www.ratchakitcha.soc.go.th/DATA/PDF/2562/A/069/T_0052.PDF
  - official_source: ราชกิจจานุเบกษา
  - last_checked: 2026-06-25
- `osh-2554` — พระราชบัญญัติความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน พ.ศ. 2554 (สถานศึกษา)
  - source_url: https://www.tosh.or.th/images/file/2016/osh-act.b.e.2554.pdf
  - official_source: สถาบันส่งเสริมความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน (สสปท.)
  - last_checked: 2026-06-25
- `budget-procedure-2561` — พระราชบัญญัติวิธีการงบประมาณ พ.ศ. 2561 (ที่เกี่ยวข้องกับสถานศึกษา)
  - source_url: https://www.ratchakitcha.soc.go.th/DATA/PDF/2561/A/092/1.PDF
  - official_source: ราชกิจจานุเบกษา
  - last_checked: 2026-06-26
- `procurement-2560` — พระราชบัญญัติการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. 2560
  - source_url: https://www.ratchakitcha.soc.go.th/DATA/PDF/2560/A/024/13.PDF
  - official_source: ราชกิจจานุเบกษา
  - last_checked: 2026-06-26
- `disabled-welfare-2550` — พระราชบัญญัติส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการ พ.ศ. 2550
  - source_url: https://omhc.dmh.go.th/law/files/%E0%B8%9E%E0%B8%A3%E0%B8%9A.%E0%B8%AA%E0%B8%87%E0%B9%80%E0%B8%AA%E0%B8%A3%E0%B8%B4%E0%B8%A1%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9E%E0%B8%B1%E0%B8%92%E0%B8%99%E0%B8%B2%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%8A%E0%B8%B5%E0%B8%A7%E0%B8%B4%E0%B8%95%E0%B8%84%E0%B8%99%E0%B8%9E%E0%B8%B4%E0%B8%81%E0%B8%B2%E0%B8%A3-%E0%B8%9E.%E0%B8%A8.2550.pdf
  - official_source: กรมสุขภาพจิต (เผยแพร่เอกสาร)
  - last_checked: 2026-06-25
- `labor-protection-2541` — พระราชบัญญัติคุ้มครองแรงงาน พ.ศ. 2541 (ลูกจ้างสถานศึกษาเอกชน)
  - source_url: https://www.ratchakitcha.soc.go.th/DATA/PDF/2541/A/008/1.PDF
  - official_source: ราชกิจจานุเบกษา
  - last_checked: 2026-06-25
- `local-edu-2542` — บทบัญญัติเกี่ยวกับการจัดการศึกษาท้องถิ่น (ตาม พ.ร.บ.การศึกษาแห่งชาติ)
  - source_url: https://www.moe.go.th/backend/wp-content/uploads/2020/10/1.-%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%9A%E0%B8%B1%E0%B8%8D%E0%B8%8D%E0%B8%B1%E0%B8%95%E0%B8%B4%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%A8%E0%B8%B6%E0%B8%81%E0%B8%A9%E0%B8%B2%E0%B9%81%E0%B8%AB%E0%B9%88%E0%B8%87%E0%B8%8A%E0%B8%B2%E0%B8%95%E0%B8%B4-%E0%B8%9E.%E0%B8%A8.2542-%E0%B8%89.%E0%B8%AD%E0%B8%B1%E0%B8%9E%E0%B9%80%E0%B8%94%E0%B8%97.pdf
  - official_source: กระทรวงศึกษาธิการ
  - last_checked: 2026-06-26
- `youth-protection-2551` — พระราชบัญญัติส่งเสริมและพัฒนาคุณภาพชีวิตเด็กและเยาวชน พ.ศ. 2551
  - source_url: https://siythailand.org/wp-content/uploads/2020/10/law_th_20172507204615_1.pdf
  - official_source: เอกสารเผยแพร่ (ควรยืนยันกับราชกิจจานุเบกษา)
  - last_checked: 2026-06-25
- `private-univ-2546` — พระราชบัญญัติสถาบันอุดมศึกษาเอกชน พ.ศ. 2546 และที่แก้ไขเพิ่มเติม
  - source_url: https://mhesi.nrct.go.th/archives/s/mhesi_archives/item/397
  - official_source: คลังจดหมายเหตุดิจิทัล กระทรวง อว.
  - last_checked: 2026-06-26
- `student-uniform-2551` — พระราชบัญญัติเครื่องแบบนักเรียน พ.ศ. 2551
  - source_url: https://ops.moe.go.th/wp-content/uploads/2023/03/1.-%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%9A%E0%B8%B1%E0%B8%8D%E0%B8%8D%E0%B8%B1%E0%B8%95%E0%B8%B4%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99-%E0%B8%9E.%E0%B8%A8.-%E0%B9%92%E0%B9%95%E0%B9%95%E0%B9%91.pdf
  - official_source: สำนักงานปลัดกระทรวงศึกษาธิการ
  - last_checked: 2026-06-26
- `scout-2551` — พระราชบัญญัติลูกเสือ พ.ศ. 2551
  - source_url: https://backoffice.onec.go.th/uploaded/Category/Laws/Act/acteng/01/0101-j-510331.pdf
  - official_source: สำนักงานเลขาธิการสภาการศึกษา (สกศ.)
  - last_checked: 2026-06-26
- `vocational-institute-2555` — พระราชบัญญัติสถาบันการอาชีวศึกษา พ.ศ. 2555
  - source_url: https://old.parliament.go.th/ewtcommittee/ewt/25join_nationaleducation/ewt_dl_link.php?nid=271&filename=index
  - official_source: รัฐสภา (เอกสารเผยแพร่ — ควรยืนยันกับราชกิจจานุเบกษา)
  - last_checked: 2026-06-26
- `hesi-policy-council-2562` — พระราชบัญญัติสภานโยบายการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรมแห่งชาติ พ.ศ. 2562
  - source_url: https://db.legal.tu.ac.th/wp-content/uploads/2022/08/%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%9A%E0%B8%B1%E0%B8%8D%E0%B8%8D%E0%B8%B1%E0%B8%95%E0%B8%B4%E0%B8%AA%E0%B8%A0%E0%B8%B2%E0%B8%99%E0%B9%82%E0%B8%A2%E0%B8%9A%E0%B8%B2%E0%B8%A2%E0%B8%AD%E0%B8%B8%E0%B8%94%E0%B8%A1%E0%B8%A8%E0%B8%B6%E0%B8%81%E0%B8%A9%E0%B8%B2-%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-%E0%B8%A7%E0%B8%B4%E0%B8%88%E0%B8%B1%E0%B8%A2-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%99%E0%B8%A7%E0%B8%B1%E0%B8%95%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B9%81%E0%B8%AB%E0%B9%88%E0%B8%87%E0%B8%8A%E0%B8%B2%E0%B8%95%E0%B8%B4-%E0%B8%9E.%E0%B8%A8.-2562.pdf
  - official_source: ฐานข้อมูลกฎหมาย ม.ธรรมศาสตร์ (เผยแพร่ — ควรยืนยันกับราชกิจจานุเบกษา)
  - last_checked: 2026-06-26
- `rajabhat-2547` — พระราชบัญญัติมหาวิทยาลัยราชภัฏ พ.ศ. 2547
  - source_url: https://prt.parliament.go.th/items/8bd4ab86-c135-40ff-a746-2ca96a95982e
  - official_source: คลังสารสนเทศ สำนักงานเลขาธิการสภาผู้แทนราษฎร
  - last_checked: 2026-06-26
- `rmut-2548` — พระราชบัญญัติมหาวิทยาลัยเทคโนโลยีราชมงคล พ.ศ. 2548
  - source_url: https://mhesi.nrct.go.th/archives/s/mhesi_archives/item/393
  - official_source: คลังจดหมายเหตุดิจิทัล กระทรวง อว.
  - last_checked: 2026-06-26
- `community-college-2558` — พระราชบัญญัติสถาบันวิทยาลัยชุมชน พ.ศ. 2558
  - source_url: https://www.ratchakitcha.soc.go.th/DATA/PDF/2558/A/030/1.PDF
  - official_source: ราชกิจจานุเบกษา
  - last_checked: 2026-06-26
- `icescr` — กติการะหว่างประเทศว่าด้วยสิทธิทางเศรษฐกิจ สังคม และวัฒนธรรม (ICESCR) — โดยเฉพาะข้อ 13–14
  - source_url: https://treaties.un.org/Pages/ViewDetails.aspx?src=TREATY&mtdsg_no=IV-3&chapter=4&clang=_en
  - official_source: UN Treaty Collection
  - last_checked: 2026-06-26
- `crc` — อนุสัญญาว่าด้วยสิทธิเด็ก (CRC) — โดยเฉพาะข้อ 28–29
  - source_url: https://treaties.un.org/Pages/ViewDetails.aspx?src=TREATY&mtdsg_no=IV-11&chapter=4&clang=_en
  - official_source: UN Treaty Collection
  - last_checked: 2026-06-26
- `crpd` — อนุสัญญาว่าด้วยสิทธิคนพิการ (CRPD) — โดยเฉพาะข้อ 24 เรื่องการศึกษา
  - source_url: https://treaties.un.org/Pages/ViewDetails.aspx?src=TREATY&mtdsg_no=IV-15&chapter=4&clang=_en
  - official_source: UN Treaty Collection
  - last_checked: 2026-06-26
- `cedaw` — อนุสัญญาว่าด้วยการขจัดการเลือกปฏิบัติต่อสตรีในทุกรูปแบบ (CEDAW) — โดยเฉพาะข้อ 10 ความเสมอภาคทางการศึกษา
  - source_url: https://treaties.un.org/Pages/ViewDetails.aspx?src=TREATY&mtdsg_no=IV-8&chapter=4&clang=_en
  - official_source: UN Treaty Collection
  - last_checked: 2026-06-26
- `icerd` — อนุสัญญาว่าด้วยการขจัดการเลือกปฏิบัติทางเชื้อชาติในทุกรูปแบบ (ICERD) — โดยเฉพาะข้อ 5(e)(v) และข้อ 7
  - source_url: https://treaties.un.org/Pages/ViewDetails.aspx?src=TREATY&mtdsg_no=IV-2&chapter=4&clang=_en
  - official_source: UN Treaty Collection
  - last_checked: 2026-06-26

---

ดูวิธีตรวจสอบและกรอกข้อมูลที่ `docs/SOURCE_VERIFICATION_WORKSHEET.md`
และเช็กลิสต์ตามลำดับความสำคัญที่ `docs/PRIORITY_LAW_SOURCE_CHECKLIST.md`
