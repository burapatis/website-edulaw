import fs from 'fs';
import vm from 'vm';

const src = fs.readFileSync('static/js/quiz-data.js', 'utf8');
const ctx = {};
const modified = src.replace('const QUIZ_SETS', 'QUIZ_SETS');
vm.runInNewContext(modified, ctx);
const sets = ctx.QUIZ_SETS;

const catMeta = {
  constitution: {
    law: 'const-2560',
    lawTitle: 'รัฐธรรมนูญแห่งราชอาณาจักรไทย พ.ศ. 2560',
    audience: 'ผู้สนใจทั่วไป',
  },
  national: {
    law: 'nea-2542',
    lawTitle: 'พระราชบัญญัติการศึกษาแห่งชาติ พ.ศ. 2542',
    audience: 'ครูและบุคลากรทางการศึกษา',
  },
  personnel: {
    law: 'teacher-civil-2547',
    lawTitle: 'พระราชบัญญัติระเบียบข้าราชการครูและบุคลากรทางการศึกษา พ.ศ. 2547',
    audience: 'ครูและบุคลากรทางการศึกษา',
  },
  'admin-higher': {
    law: 'moe-admin-2546',
    lawTitle: 'พระราชบัญญัติระเบียบบริหารราชการกระทรวงศึกษาธิการ พ.ศ. 2546',
    audience: 'ผู้บริหารสถานศึกษา',
  },
  'child-institution': {
    law: 'child-protect-2546',
    lawTitle: 'พระราชบัญญัติคุ้มครองเด็ก พ.ศ. 2546',
    audience: 'ครูและบุคลากรทางการศึกษา',
  },
};

function yamlQuote(s) {
  return JSON.stringify(String(s ?? ''));
}

const categories = sets.map((s) => {
  const m = catMeta[s.key] || {};
  return {
    key: s.key,
    title: s.title,
    description: s.desc,
    default_difficulty: s.level,
    default_audience: m.audience || 'ผู้สนใจทั่วไป',
    related_law_id: m.law || '',
    related_law_title: m.lawTitle || '',
  };
});

let n = 0;
const questions = [];
for (const s of sets) {
  const m = catMeta[s.key] || {};
  for (const q of s.questions) {
    n += 1;
    questions.push({
      id: `q${String(n).padStart(3, '0')}`,
      category: s.key,
      audience: m.audience || 'ผู้สนใจทั่วไป',
      difficulty: s.level,
      question: q.q,
      choices: q.options,
      answer: q.correct,
      explanation: q.explain,
      related_law_id: m.law || '',
      related_law_title: m.lawTitle || '',
      related_topics: [],
    });
  }
}

let yaml = `version: 1\nupdated_at: "2026-06-24"\n\ncategories:\n`;
for (const c of categories) {
  yaml += `  - key: ${c.key}\n`;
  yaml += `    title: ${yamlQuote(c.title)}\n`;
  yaml += `    description: ${yamlQuote(c.description)}\n`;
  yaml += `    default_difficulty: ${yamlQuote(c.default_difficulty)}\n`;
  yaml += `    default_audience: ${yamlQuote(c.default_audience)}\n`;
  yaml += `    related_law_id: ${c.related_law_id}\n`;
  yaml += `    related_law_title: ${yamlQuote(c.related_law_title)}\n`;
}
yaml += '\nquestions:\n';
for (const q of questions) {
  yaml += `  - id: ${q.id}\n`;
  yaml += `    category: ${q.category}\n`;
  yaml += `    audience: ${yamlQuote(q.audience)}\n`;
  yaml += `    difficulty: ${yamlQuote(q.difficulty)}\n`;
  yaml += `    question: ${yamlQuote(q.question)}\n`;
  yaml += `    choices:\n`;
  for (const ch of q.choices) yaml += `      - ${yamlQuote(ch)}\n`;
  yaml += `    answer: ${q.answer}\n`;
  yaml += `    explanation: ${yamlQuote(q.explanation)}\n`;
  yaml += `    related_law_id: ${q.related_law_id}\n`;
  yaml += `    related_law_title: ${yamlQuote(q.related_law_title)}\n`;
  yaml += `    related_topics: []\n`;
}

fs.writeFileSync('data/quizzes.yaml', yaml);
console.log(`Wrote ${questions.length} questions to data/quizzes.yaml`);
