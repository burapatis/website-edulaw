const express = require('express');
const { getLawsData, saveLawsData } = require('../db');
const { authMiddleware } = require('../auth');

const router = express.Router();

function normalizeLaw(law) {
  return {
    ...law,
    points: law.points || [],
    links: law.links || [],
    tags: law.tags || [],
    relatedLaws: law.relatedLaws || [],
  };
}

router.get('/', (_req, res) => {
  const data = getLawsData();
  res.json({
    ...data,
    laws: (data.laws || []).map(normalizeLaw),
  });
});

router.put('/', authMiddleware, (req, res) => {
  const { categories, laws, version } = req.body || {};
  if (!Array.isArray(categories) || !Array.isArray(laws)) {
    return res.status(400).json({ error: 'ต้องมี categories และ laws เป็น array' });
  }
  const saved = saveLawsData({
    version: version || 2,
    categories,
    laws: laws.map(normalizeLaw),
  });
  res.json(saved);
});

router.post('/', authMiddleware, (req, res) => {
  const law = normalizeLaw(req.body || {});
  if (!law.id || !law.title) {
    return res.status(400).json({ error: 'ต้องมี id และ title' });
  }
  const data = getLawsData();
  if (data.laws.some(l => l.id === law.id)) {
    return res.status(409).json({ error: 'มีกฎหมาย id นี้อยู่แล้ว' });
  }
  data.laws.unshift(law);
  const saved = saveLawsData(data);
  res.status(201).json(law);
});

router.put('/:id', authMiddleware, (req, res) => {
  const data = getLawsData();
  const idx = data.laws.findIndex(l => l.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'ไม่พบกฎหมาย' });
  const law = normalizeLaw({ ...data.laws[idx], ...req.body, id: req.params.id });
  data.laws[idx] = law;
  saveLawsData(data);
  res.json(law);
});

router.delete('/:id', authMiddleware, (req, res) => {
  const data = getLawsData();
  const before = data.laws.length;
  data.laws = data.laws.filter(l => l.id !== req.params.id);
  if (data.laws.length === before) {
    return res.status(404).json({ error: 'ไม่พบกฎหมาย' });
  }
  saveLawsData(data);
  res.json({ ok: true, id: req.params.id });
});

module.exports = router;
