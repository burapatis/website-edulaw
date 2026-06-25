# รายงานสรุปผลการตรวจสอบเว็บไซต์ — Public Beta v1.0.0-beta

เอกสารนี้บันทึกผลการตรวจสอบก่อน/หลังเผยแพร่ **Public Beta** เพื่อใช้เป็นข้อมูลพื้นฐานในการพัฒนาต่อ

| รายการ | ค่า |
|--------|-----|
| วันที่ตรวจสอบ | 2026-06-24 |
| เวอร์ชัน | `1.0.0-beta` (`hugo.toml` → `params.version`) |
| สถานะเว็บไซต์ | Public Beta |
| Commit ที่ตรวจ | `a421a51` — Prepare public beta release readiness |
| Branch | `main` (ตรงกับ `origin/main`) |
| URL production | https://burapatis.github.io/website-edulaw/ |

เอกสารที่เกี่ยวข้อง: [PUBLIC_RELEASE.md](PUBLIC_RELEASE.md) · [QA_CHECKLIST.md](QA_CHECKLIST.md) · [RELEASE_CHECKLIST.md](../RELEASE_CHECKLIST.md) · [ROADMAP.md](ROADMAP.md)

---

## สรุปผู้บริหาร (Executive Summary)

| คำถาม | ผล |
|--------|-----|
| Deploy สำเร็จไหม? | **ใช่** — GitHub Actions (Deploy Hugo site to GitHub Pages) บน `main` สำเร็จ |
| ทำงานถูกต้องไหม? | **ใช่** — build ผ่าน, หน้าหลักโหลดได้, บั๊กหน้า about/public-beta แก้แล้วบน production |
| ครบถ้วนสมบูรณ์ 100%? | **ไม่** — ตามขอบเขต **Public Beta** ยังมี metadata และช่องทาง feedback บางส่วนที่เติมทีหลังได้ |
| พร้อมประกาศเปิดใช้สาธารณะ? | **ได้** — ไม่มี critical issue ค้าง |

**ข้อสรุป:** เว็บไซต์พร้อมใช้งานสาธารณะในระดับ Public Beta เนื้อหาและฟีเจอร์หลักทำงานได้ถูกต้อง ข้อจำกัดที่เหลือเป็นงานปรับปรุงต่อเนื่อง ไม่ใช่ตัวกั้นการเปิดใช้งานครั้งแรก

---

## 1. Git และการ deploy

| รายการ | ผล |
|--------|-----|
| Branch ปัจจุบัน | `main` |
| สถานะ sync กับ remote | ตรงกับ `origin/main` |
| Commit ล่าสุด | `a421a51` |
| GitHub Actions — Deploy Hugo site to GitHub Pages | **success** (หลัง push `main`) |
| GitHub Pages Source | GitHub Actions |

---

## 2. การตรวจอัตโนมัติในเครื่อง

คำสั่ง: `npm run release:check`

| ขั้นตอน | ผล |
|---------|-----|
| `npm run check:content` | **ผ่าน** — 0 critical, 52 warnings |
| `npm run build:search` (Hugo + Pagefind) | **ผ่าน** |
| Release check รวม | **PASSED** |

### สถิติ build

| รายการ | จำนวน |
|--------|--------|
| หน้า Hugo (รวม) | 236 |
| หน้าที่ Pagefind index | 140 |
| ไฟล์ static | 9 |

### Warnings (52 รายการ) — ไม่บล็อกการเปิด Public Beta

สาเหตุหลักจาก `data/laws.json`:

- ไม่มี `last_checked` ในข้อมูลโดยตรง (ใช้ค่า default จาก `_content.gotmpl`)
- บางฉบับไม่มี `tags`

**แนวทางแก้:** เติม metadata ทีละฉบับหลังตรวจแหล่งทางการ — ดู [CONTENT_EXPANSION_WORKFLOW.md](CONTENT_EXPANSION_WORKFLOW.md) และ [ROADMAP.md](ROADMAP.md) v1.1

---

## 3. สถิติเนื้อหา (`npm run report:stats`)

| รายการ | จำนวน |
|--------|--------|
| หน้ากฎหมาย | 38 |
| หัวข้อสรุป (summaries) | 6 |
| ข้อคำถามแบบทดสอบ | 40 |
| เส้นทางการเรียนรู้ | 6 |
| หมวดหมู่ในคลัง | 9 |
| อัปเดตคลังข้อมูล (`data/laws.json`) | 2026-06-23 |

### สถานะแหล่งข้อมูล (จาก `data/laws.json`)

| รายการ | จำนวน |
|--------|--------|
| มีข้อมูลแหล่งทางการแล้ว (`source_url`) | 38 |
| ควรตรวจสอบเพิ่มเติม | 0 |
| ไม่มี `source_url` | 0 |
| ไม่มี `last_checked` ใน JSON | 33 |
| `last_checked` เก่าเกิน 180 วัน | 0 |
| คิว `pending_review` ใน `law_backlog.yaml` | 10 |

---

## 4. ตรวจหน้าสำคัญบน production

ตรวจ HTTP status และเนื้อหาเบื้องต้น ณ วันที่ตรวจสอบ

| URL | HTTP | หมายเหตุ |
|-----|------|----------|
| `/` | 200 | แสดงสถานะ Public Beta |
| `/laws/` | 200 | คลังกฎหมาย |
| `/search/` | 200 | Pagefind |
| `/dashboard/` | 200 | ภาพรวมเว็บไซต์ |
| `/about/` | 200 | ไม่พบ `law-card` ผิดปกติ (แก้แล้ว) |
| `/about/public-beta/` | 200 | การ์ดสถานะครบ, badge v1.0.0-beta |
| `/about/source-policy/` | 200 | นโยบายแหล่งข้อมูล |
| `/laws/nea-2542/` | 200 | metadata card, แหล่งทางการ, SEO |
| `/sitemap.xml` | 200 | — |
| `/robots.txt` | 200 | — |

### บั๊กที่แก้ก่อนการตรวจครั้งนี้

| ปัญหา | สาเหตุ | การแก้ |
|--------|--------|--------|
| กรอบว่าง/ซ้อนในหน้า public-beta | Goldmark แยก HTML block ใน markdown | ย้ายการ์ดแรกไป `layouts/partials/release-card-site-status.html` |
| `law-card` บนหน้า `/about/` | `list.html` ใส่ `.Summary` (HTML ทั้งหน้า) ใน `law-card` | สร้าง `layouts/about/list.html` ใช้เฉพาะ `.Content` |

---

## 5. ไฟล์และโครงสร้าง release ที่ตรวจแล้ว

| ไฟล์ | สถานะ |
|------|--------|
| `CHANGELOG.md` | มี v1.0.0-beta |
| `RELEASE_CHECKLIST.md` | มี |
| `docs/PUBLIC_RELEASE.md` | มี |
| `docs/QA_CHECKLIST.md` | มี |
| `docs/ROADMAP.md` | มี |
| `layouts/about/list.html` | มี (แก้ about index) |
| `layouts/about/public-beta.html` | มี |
| `layouts/partials/release-card-site-status.html` | มี |
| `scripts/release-check.js` | ใช้งานได้ |
| `.github/workflows/hugo.yml` | deploy บน push `main` |

### ค่า config สำคัญ (`hugo.toml`)

```toml
params.version = '1.0.0-beta'
params.release_status = 'Public Beta'
params.feedbackGoogleForm = ''   # ยังว่าง — ดูหัวข้อ 6
```

---

## 6. สิ่งที่ยังไม่สมบูรณ์ (ไม่กั้น Public Beta)

| รายการ | สถานะ | แนวทาง |
|--------|--------|--------|
| Google Form feedback | ยังไม่ตั้ง URL | ใส่ใน `hugo.toml` → `params.feedbackGoogleForm` เมื่อพร้อม |
| `last_checked` ใน JSON | 33/38 ฉบับยังไม่มีในข้อมูลโดยตรง | เติมหลังตรวจแหล่งทางการ |
| `tags` บางฉบับ | warning ใน check:content | เติมตามความเหมาะสม |
| QA ด้วยมือทุกข้อ | ยังไม่ครบทุก checkbox | ใช้ [QA_CHECKLIST.md](QA_CHECKLIST.md) |
| quality-check / link-check CI | รันเมื่อเปิด PR (ไม่ใช่ทุก push `main`) | เปิด PR หรือ `workflow_dispatch` เมื่อต้องการตรวจซ้ำ |
| Git tag `v1.0.0-beta` | ยังไม่ได้ติด (ขณะตรวจ) | `git tag v1.0.0-beta && git push origin v1.0.0-beta` |
| คิวกฎหมายใหม่ | 10 รายการ `pending_review` | ขยายใน v1.1 ตาม [ROADMAP.md](ROADMAP.md) |

---

## 7. ข้อจำกัดที่ยอมรับ (Public Beta)

ตาม [PUBLIC_RELEASE.md](PUBLIC_RELEASE.md) และหน้า `/about/public-beta/`:

- ไม่ใช่เว็บไซต์ราชการหรือบริการให้คำปรึกษากฎหมายเฉพาะกรณี
- คลังกฎหมายเป็นการคัดสรรและสรุป — ไม่ครบทุกฉบับในประเทศ
- ไม่รับประกันว่าทุกหน้าเป็นฉบับล่าสุด — ต้องตรวจแหล่งทางการก่อนใช้จริง

---

## 8. คำสั่งอ้างอิงสำหรับการตรวจรอบถัดไป

```bash
# ตรวจก่อน deploy / หลังแก้เนื้อหาสำคัญ
npm run release:check

# รายงานสถิติ (ไม่ทำให้ build ล้ม)
npm run report:stats

# build ในเครื่อง
npm run build:search

# ทดสอบ local
npm run dev
# เปิด http://localhost:1313/website-edulaw/
```

---

## 9. ขั้นตอนแนะนำหลัง Public Beta

1. ทำ QA ด้วยมือตาม [QA_CHECKLIST.md](QA_CHECKLIST.md) (desktop + mobile)
2. ติด git tag `v1.0.0-beta` (ถ้ายังไม่ได้ทำ)
3. ประกาศเปิดใช้ตามถ้อยคำใน [PUBLIC_RELEASE.md](PUBLIC_RELEASE.md)
4. งาน v1.1+: ขยายคลัง, เติม `last_checked`, Google Form, ปรับ metadata warnings

---

## ประวัติการอัปเดตเอกสารนี้

| วันที่ | เวอร์ชัน | หมายเหตุ |
|--------|----------|----------|
| 2026-06-24 | 1.0.0-beta | ตรวจครั้งแรกหลัง merge `main` และ deploy production |
