require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const lawsRouter = require('./routes/laws');
const forumRouter = require('./routes/forum');
const adminRouter = require('./routes/admin');

const ROOT = path.join(__dirname, '..');
const PORT = Number(process.env.PORT) || 3000;

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'edulaw-api',
    time: new Date().toISOString(),
  });
});

app.use('/api/laws', lawsRouter);
app.use('/api/forum', forumRouter);
app.use('/api/admin', adminRouter);

app.use(express.static(ROOT));

app.listen(PORT, () => {
  console.log(`กฎหมายการศึกษา — server running at http://localhost:${PORT}`);
  console.log(`  API:   http://localhost:${PORT}/api/health`);
  console.log(`  Admin: http://localhost:${PORT}/admin.html`);
});
