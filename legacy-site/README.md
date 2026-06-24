# Legacy Static Site Backup

โฟลเดอร์นี้เก็บเว็บไซต์ HTML/CSS/JS เดิมก่อนย้ายไป Hugo

## เนื้อหา

- หน้า HTML: `index.html`, `library.html`, `quiz.html`, `about.html`, `forum.html`, `admin.html`
- สไตล์และสคริปต์: `css/`, `js/`, `scripts/`
- ข้อมูล: `data/laws.json`, `data/forum.json`
- Backend (Express): `server/`
- แบรนด์ดิ้งเดิม: `assets/`
- Node.js: `package.json`

## การรันเว็บเดิม (อ้างอิง)

```bash
cd legacy-site
npm install
npm start
```

หรือเปิดไฟล์ HTML โดยตรงผ่าน static file server
