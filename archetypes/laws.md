---
# มาตรฐาน front matter สำหรับหน้ารายละเอียดกฎหมาย (content/laws/*.md)
# หมายเหตุ: หน้ากฎหมายส่วนใหญ่ถูกสร้างจาก data/laws.json ผ่าน _content.gotmpl
# ใช้ archetype นี้เมื่อเพิ่มฉบับใหม่ด้วย: hugo new laws/<law-id>.md

title: "{{ replace .Name "-" " " | title }}"
short_title: ""
description: ""
og_image: ""
law_type: ""
year: ""
category: ""
agency: ""
status: "บังคับใช้"
source_url: ""
official_source: "ต้องตรวจสอบจากแหล่งทางการ"
last_checked: {{ now.Format "2006-01-02" }}
audiences:
  - ครูและบุคลากรทางการศึกษา
  - นักศึกษา
  - ผู้สนใจทั่วไป
tags: []
# taxonomy (Hugo สร้างหน้า /tags/ /categories/ ฯลฯ อัตโนมัติเมื่อระบุค่าเหล่านี้)
# categories: []   # หลายหมวด (key เช่น national) — ถ้าไม่ระบุใช้ category เดี่ยว
draft: false

# ฟิลด์เสริมที่เทมเพลตใช้งาน (เก็บไว้เพื่อความเข้ากันได้)
law_id: "{{ .Name }}"
type: ""
citation: ""
links: []
categories: []
relatedLaws: []
---

สรุปสาระสำคัญของกฎหมายฉบับนี้

## สาระสำคัญ

- (เพิ่มข้อสรุปจากแหล่งที่มีอยู่)

## หมายเหตุ

เนื้อหานี้เป็นการสรุปสาระสำคัญเพื่อการเรียนรู้ ไม่ใช่ถ้อยคำตามกฎหมายฉบับเต็ม โปรดตรวจสอบฉบับเต็มจากแหล่งอ้างอิงทางการก่อนนำไปอ้างอิง
