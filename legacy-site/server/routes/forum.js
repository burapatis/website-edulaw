const express = require('express');
const { getForumData, saveForumData } = require('../db');

const router = express.Router();

router.get('/threads', (_req, res) => {
  const data = getForumData();
  res.json({ threads: data.threads || [] });
});

router.get('/threads/:id', (req, res) => {
  const data = getForumData();
  const thread = (data.threads || []).find(t => t.id === req.params.id);
  if (!thread) return res.status(404).json({ error: 'ไม่พบกระทู้' });
  res.json(thread);
});

router.post('/threads', (req, res) => {
  const { topic, title, body, author } = req.body || {};
  if (!topic || !title || !body) {
    return res.status(400).json({ error: 'ต้องมี topic, title และ body' });
  }
  const data = getForumData();
  const thread = {
    id: 't' + Date.now(),
    topic,
    title: String(title).slice(0, 300),
    body: String(body).slice(0, 8000),
    author: (author || 'ผู้ใช้นิรนาม').slice(0, 80),
    createdAt: Date.now(),
    replies: [],
  };
  data.threads.unshift(thread);
  saveForumData(data);
  res.status(201).json(thread);
});

router.post('/threads/:id/replies', (req, res) => {
  const { body, author } = req.body || {};
  if (!body) return res.status(400).json({ error: 'ต้องมี body' });
  const data = getForumData();
  const thread = (data.threads || []).find(t => t.id === req.params.id);
  if (!thread) return res.status(404).json({ error: 'ไม่พบกระทู้' });
  const reply = {
    author: (author || 'ผู้ใช้นิรนาม').slice(0, 80),
    body: String(body).slice(0, 8000),
    createdAt: Date.now(),
  };
  thread.replies.push(reply);
  saveForumData(data);
  res.status(201).json(reply);
});

module.exports = router;
